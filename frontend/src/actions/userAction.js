import axios from 'axios'
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from "../constants/userConstants"
import { USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "../constants/userConstants"
import { USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_RESET } from "../constants/userConstants"
import { USER_PROFILE_UPDATE_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS } from "../constants/userConstants"
import { USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_RESET } from "../constants/userConstants"
import { USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS } from "../constants/userConstants"
import { USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "../constants/userConstants"
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants"

export const login = (email, password)=> async(dispatch)=>{
    try{
        dispatch({type:USER_LOGIN_REQUEST})

        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post("/api/users/login", {email, password}, config)

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }catch(error){
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const logout = () => (dispatch)=>{
    localStorage.removeItem('userInfo')

    dispatch({ type: USER_LOGOUT})
    dispatch({type:ORDER_LIST_MY_RESET})
    dispatch({type:USER_DETAILS_RESET})
    dispatch({type:USER_LIST_RESET})
}


export const register = (name, email, password)=> async(dispatch)=>{
    try{
        dispatch({type:USER_REGISTER_REQUEST})

        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post("/api/users", {name, email, password}, config)

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        //as soon as user is registered(i.e. 'userInfo' of userLoginReducer is filled), 
        //we call login action.(to fill 'userInfo' of userRegisterReducer)
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }catch(error){
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

//get user details for profile screen
export const getUserDetails = (id)=> async(dispatch, getState)=>{
    try{
        dispatch({type:USER_DETAILS_REQUEST})

        const {userLogin : { userInfo }} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // id here is not actually id but a word 'profile'. so the route is : /api/users/profile
        const { data } = await axios.get(`/api/users/${id}`, config)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


export const updateUserProfile = (user)=> async(dispatch, getState)=>{
    try{
        dispatch({type:USER_PROFILE_UPDATE_REQUEST})

        const {userLogin : { userInfo }} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/users/profile`, user, config)

        dispatch({
            type: USER_PROFILE_UPDATE_SUCCESS,
            payload: data
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))

    }catch(error){
        dispatch({
            type: USER_PROFILE_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listUsers = ()=> async(dispatch, getState)=>{
    try{
        dispatch({type:USER_LIST_REQUEST})

        const {userLogin : { userInfo }} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/users`, config)

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deleteUser = (id)=> async(dispatch, getState)=>{
    try{
        dispatch({type:USER_DELETE_REQUEST})

        const {userLogin : { userInfo }} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/api/users/${id}`, config)

        dispatch({type: USER_DELETE_SUCCESS})

    }catch(error){
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateUser = (user)=> async(dispatch, getState)=>{
    try{
        dispatch({type:USER_UPDATE_REQUEST})

        const {userLogin : { userInfo }} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/users/${user._id}`, user, config)

        dispatch({type: USER_UPDATE_SUCCESS})

        dispatch({type: USER_DETAILS_SUCCESS, payload: data})

    }catch(error){
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}