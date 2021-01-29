import TYPE_ACTIONS from './types'

export const changeLanguage = (newLanguage) => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.CHANGE_LANGUAGE,
        payload: newLanguage
    })
}

export const setSert = (newSert) => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.SET_SERT,
        payload: newSert
    })
}