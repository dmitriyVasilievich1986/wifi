import termReducer from './termReducer'
import { combineReducers } from 'redux'

export default combineReducers({
    term: termReducer
})