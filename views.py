# coding: utf-8

# region import libraries

from django.template.response import SimpleTemplateResponse
from django.http import HttpResponseNotAllowed
from django.http import QueryDict
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.conf import settings

from f.network.safe_dict import sign_dict
from f.network.safe_dict import check_dict
from f.network.orig_url import orig_url
from f.lib.fix_final_url import fix_final_url
from f.lib.redis_client import redis_client  # хакно
from f.lib.redis_client import REDIS_KEY_PREFIX  # хакно
from f.lib.redis_client import check_rate
from f.lib.redis_client import RateLimitError
from f.lib.exceptions import ABSException  # не хорошо!

import base64
import re
import time
import json
import logging

# endregion

# region initialize constants

logger = logging.getLogger(__name__)

RETRY_DB = 3

MODES = ["cert", "fias", "free"]

TTL = {
    "cert": 86400,
    "fias": 1800,
    "free": 86400,
}

# endregion


def dict_to_line(dct):
    dict_cpoy = dct.copy()
    string_dict = "\x20".join(sign_dict(d))
    dict_cpoy["s"] = string_dict
    query_dict = QueryDict("", mutable=True)
    query_dict.update(dict_cpoy)
    return query_dict.urlencode()


def line_to_dict(data):
    data = QueryDict(data).dict()
    data = check_dict(data, data["s"].split("\x20"))
    return data


def calldb(ABS, mac, phone, nasip, duration, smsfilter, flags, action):
    # надо вынести это в методы ABS
    for i in range(RETRY_DB):
        r = ABS(
            1902,
            {
                "mac": [mac],
                "msisdn": [phone],
                "nasip": [nasip],
                "duration": [duration + i],  # +i чтобы избежать кэширования
                "smsfilter": [smsfilter],
                "flags": [flags],
                "action": [action],
            },
        )
        (rc,) = r["rc"]
        rc = int(rc)
        if rc != -100:
            break
        logger.warning("DB RETRY %d" % i)
    return rc


def mac_check(ABS, mac, smsfilter):
    # check for MAC<>MSISDN (abs 1904)
    for i in range(RETRY_DB):
        r = ABS(1904, {"mac": [mac], "smsfilter": [smsfilter]})
        (abs_rc,) = r["rc"]
        abs_rc = int(abs_rc)
        (abs_str,) = r["str"]
        if abs_rc != -100:
            break
        logger.warning("DB RETRY %d" % i)
    return abs_rc, abs_str


def check_action_availability(ABS, channel, template, interval, limit):
    # check for MAC<>MSISDN (abs 1904)
    for i in range(RETRY_DB):
        r = ABS(
            32061,
            {
                "channel": [channel],
                "template": [template],
                "interval": [interval],
                "limit": [limit],
            },
        )
        (abs_rc,) = r["rc"]
        abs_rc = int(abs_rc)
        (abs_str,) = r["str"]
        if not abs_rc < -1:
            break
        logger.warning("DB RETRY %d" % i)
    return abs_rc, abs_str


def unlist(x):
    t = type(x)
    if t in (list, tuple):
        if len(x) == 1:
            return unlist(x[0])
        return map(unlist, x)
    elif t is dict:
        return dict(map(lambda x: (x[0], unlist(x[1])), x.items()))
    else:
        return x


class Replayer:  # ленивый отвечальщик
    def __init__(self, ABS, agent, template_prefix, default_template):
        self.ABS = ABS
        self.agent = agent
        self.template_prefix = template_prefix
        self.default_template = default_template

    def __call__(self, params):
        try:
            auth_params = self.ABS.get_auth_params(self.agent)
        except ABSException, e:
            # FIXME: не очень хорошее поведение. это должна быть фататльная ошибка
            logger.debug("INVALID auth_params. IGNORED!")
            auth_params = {}
        auth_params = unlist(auth_params)
        template_options = {}
        try:
            template = auth_params["template"]
        except KeyError, e:
            logger.debug("auth_params = " + repr(auth_params))
            logger.debug("use default template/options: " + repr(e))
        p = params.copy()
        p["year"] = time.asctime()[-4:]
        p["options"] = template_options
        logger.debug("replay: t=" + template + " opt=" + repr(p))
        return SimpleTemplateResponse(self.template_prefix + template, p)


# region main_view


def inititialize_parameters(request):
    default_mode = "free"
    ABS = request.META["bee.abs"]
    # initialization of replayer with default template parametrs
    replayer = Replayer(ABS, "legacy", "cert_auth/", "default.html")
    # get MAC and current filter name
    mac = ABS.get_mac()
    dnfilter = ABS.get_filter_name()
    # get orig URL
    url = fix_final_url(orig_url(request))
    auth_params = unlist(ABS.get_auth_params("legacy"))
    lang = auth_params.get("lang", "ru")
    mode = auth_params.get("modeid", default_mode)
    mode = mode in MODES and mode or default_mode
    return ABS, replayer, mac, dnfilter, url, lang, mode


def gate(request, redirect_to):
    ABS, replayer, mac, dnfilter, url, lang, mode = inititialize_parameters(request)

    # check entered filter
    if dnfilter not in ["videocp", "videocp-dev"]:
        logger.debug("Wrong DN filter for cert_auth page: %s" % dnfilter)
        return HttpResponseRedirect(url)

    # check if mac not empty
    if not mac:
        logger.debug("Empty MAC")
        return replayer({"lang": lang, "mode": "error", "error": "nomac"})

    # GET method
    if request.method == "GET":
        logger.debug("GET")
        # New user
        return replayer(
            {
                "mode": mode,
                "lang": lang,
                "data": dict_to_line(
                    {"url": base64.urlsafe_b64encode(url), "t": str(int(time.time()))}
                ),
            }
        )

    # POST method
    elif request.method == "POST":
        logger.debug("POST")
        data = request.POST.get("data", None)
        lang = request.POST.get("lang", lang)

        # Empty data - buggi browser?
        if data is None:
            logger.debug('%s "data" does not exist in POST params' % mac)
            return replayer(
                {
                    "lang": lang,
                    "mode": mode,
                    "error": "invalid_data",
                }
            )

        # try get data
        try:
            data = line_to_dict(data)
        except:
            logger.debug("data = " + repr(data))
            data = {}  # TODO return error page

        # check if time is out
        if int(data["t"]) + TTL[mode] < time.time():
            logger.warning(
                "TIMEOUT: %s < %s" % (int(data["t"]) + TTL[mode], time.time())
            )
            return replayer(
                {
                    "lang": lang,
                    "mode": "error",
                    "error": "timeout",
                    "data": dict_to_line(
                        {"url": data.get("url", ""), "t": str(int(time.time()))}
                    ),
                }
            )

        # get url from data
        url = data.get("url", None)

        # Authorization by certificate
        if mode == "cert":
            code = request.POST.get("certificate", None)
            if code is None:
                logger.debug('"certificate" does not exists in POST params')
                return replayer(
                    {
                        "mode": mode,
                        "error": "invalid_cert",
                        "lang": request.POST.get("lang", lang),
                        "data": request.POST["data"],
                    }
                )
            try:
                check_rate("CERT_MAC_" + mac, 10, 3600)
            except RateLimitError:
                logger.warning("RATE LIMIT MAC: " + repr(mac))
                return replayer({"lang": lang, "mode": "error", "error": "ratelimit"})

        # check for MAC<>MSISDN
        abs_rc, _ = mac_check(ABS, mac, dnfilter)
        if abs_rc != 1:  # 1 -- No such MAC, should auth
            if dnfilter == "authonly" or dnfilter == "ditauthonly":
                logger.debug(
                    "POST BUG!!! FIXME!!! %s/%s smsfilter is good, but mac_check is good too"
                    % (mac, dnfilter)
                )
                return replayer(
                    {"lang": lang, "mode": "error", "durlist": -1, "error": "nomac"}
                )
            return None

        # redirect to url
        redirect_to = base64.b64decode(url)
        logger.debug("POST2: PASS OK: %s to: %s" % (mac, repr(redirect_to)))
        return HttpResponseRedirect(redirect_to)

    elif request.method == "HEAD":
        # monitoring only
        logger.debug("HEAD")
        return HttpResponse("am " + time.asctime())


# endregion
