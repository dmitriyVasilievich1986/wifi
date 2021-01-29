from django.shortcuts import render, redirect, reverse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt


def enter_view(request, *args, **kwargs):
    if request.method == "POST":
        request.session["mode"] = request.POST["mode"]
        request.session["error"] = request.POST["error"]
        request.session["language"] = request.POST["lang"]
        request.session["greetru"] = request.POST["greetru"]
        request.session["greeten"] = request.POST["greeten"]
        request.session["termen"] = request.POST["termen"]
        request.session["termru"] = request.POST["termru"]
        request.session["room"] = "on" if "room" in request.POST else ""
        request.session["surname"] = "on" if "surname" in request.POST else ""
        request.session["reservation"] = "on" if "reservation" in request.POST else ""
        return redirect("free")
    return render(request, "enter.html")

@csrf_exempt
def free_view(request, *args, **kwargs):
    context = {
        "mode": request.session["mode"],
        # "error": "invalid_certificate",
        "error": request.session["error"],
        "url": r"/free",
        "language": request.session["language"],
        "termen": request.session["termen"],
        "termru": request.session["termru"],
        # "tariffes":["t1", "t2"]
        "tariffes":["t1", "t2"]
    }
    if request.method == "POST":
        return JsonResponse(request.POST)
    return render(request, "free.html", context)
