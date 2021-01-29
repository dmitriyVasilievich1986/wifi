import TYPE_ACTIONS from '../actions/types'

const initState = {
    sert: "",
    termAcceptance: false,
    mode: data.mode ? data.mode : "",
    error: data.error ? data.error : "",
    year: data.year ? data.year : "2020",
    language: data.language ? data.language : "ru",
    greetingText: { 'ru': "Билайн Wi-Fi", 'en': "Beeline Wi-Fi" },
    fiasData: {
        roomNumber: "",
        surnameText: "",
        reservationText: "",
    },
}

export default function (state = initState, action) {
    switch (action.type) {
        case TYPE_ACTIONS.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.payload
            }
        case TYPE_ACTIONS.SET_SERT:
            return {
                ...state,
                sert: action.payload
            }
        case TYPE_ACTIONS.CHANGE_FIAS_DATA:
            return {
                ...state,
                fiasData: {
                    ...state.fiasData,
                    ...action.payload,
                }
            }
        default:
            return state
    }
}