import * as ACTION from '../const/actions';
import axios from 'axios';

export const login = userInfo => {
  return dispatch => {
     axios.post('/api/login', userInfo)
     .then(res=>{
       localStorage.setItem('token', res.data.token);
       dispatch({
          type: ACTION.LOGIN_SUCCESS,
          payload: res.data.user
        });
     }).catch(e=>{
        console.log(e);
        dispatch({
          type: ACTION.LOGIN_FAIL
        });
     });
  };
};

export const signup = userInfo => {
  return dispatch => {
     axios.post('/api/signup', userInfo)
     .then(res=>{
        localStorage.setItem('token', res.data.token);
        dispatch({
          type: ACTION.LOGIN_SUCCESS,
          payload: res.data.user
        });
     }).catch(e=>{
        console.log(e);
        dispatch({
          type: ACTION.LOGIN_FAIL
        });
     });
  };
};

export const getUser = () => {
  return dispatch => {
   const token = localStorage.getItem('token');
    if(!token) {
      dispatch({
        type: ACTION.FETCHING_USER,
        payload: false
      });
      return;
    }
    dispatch({
      type: ACTION.FETCHING_USER,
      payload: true
    });
    axios.get('/api/user', {
      headers: {
        'x-access-token': token
      }
    })
   .then(res=>{
      dispatch({
        type: ACTION.LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch({
        type: ACTION.FETCHING_USER,
        payload: false
      });
   }).catch(e=>{
      console.log(e);
      dispatch({
        type: ACTION.FETCHING_USER,
        payload: false
      });
   });
  };
};

export const logout = () => { 
  localStorage.removeItem('token');
  return dispatch => {
    dispatch({
      type: ACTION.LOGOUT
    });
    dispatch({
      type: ACTION.FETCH_USERS,
      payload: []
    });
  };
};

export const loginErrorClear = () => {
    return {
        type: ACTION.LOGIN_ERROR_CLEAR
    };
};