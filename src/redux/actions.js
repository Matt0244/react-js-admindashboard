/*
Module containing n action creator functions
Synchronous action: object {type: 'xxx', data: value}
Asynchronous action: function  dispatch => {}
 */
  import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

/*
Synchronous action to set the header title
*/
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

/*
Synchronous action to receive user information
*/
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

/*
Synchronous action to display error message
*/
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

/*
Synchronous action to log out
*/
export const logout = () =>  {
    // Remove the user from local storage
    storageUtils.removeUser()
    // Return the action object
    return {type: RESET_USER}
}

/*
Asynchronous action to log in
*/
export const login = (username, password) => {
    return async dispatch => {
        // 1. Execute an asynchronous ajax request
        const result = await reqLogin(username, password)  // {status: 0, data: user} {status: 1, msg: 'xxx'}
        // 2.1. If successful, dispatch a synchronous action for success
        if(result.status === 0) {
            const user = result.data
            // Save to local storage
            storageUtils.saveUser(user)
            // Dispatch the synchronous action to receive user
            dispatch(receiveUser(user))
        } else { // 2.2. If failed, dispatch a synchronous action for failure
            const msg = result.msg
            // message.error(msg)
            dispatch(showErrorMsg(msg))
        }
    }
}
