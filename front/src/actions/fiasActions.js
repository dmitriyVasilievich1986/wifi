import TYPE_ACTIONS from './types'

export const setFiasData = (newData) => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.CHANGE_FIAS_DATA,
        payload: newData
    })
}