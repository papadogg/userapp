import * as ACTION from '../const/actions';
import axios from 'axios';

let prevState;
let proccessing = false;
      
export const fetchUsers = () => {
  return (dispatch, getState) => {
    if(proccessing === false) {
      prevState = getState();
    }
    proccessing = true;
    const token = localStorage.getItem('token');
    if(token) {
      dispatch({
        type: ACTION.LOADING_DATA,
        payload: true
      });
    }
    axios.get('/api/users', {
      headers: {
        'x-access-token': token
      }
    })
    .then(res => {
      proccessing = false;
      dispatch({
        type: ACTION.FETCH_USERS,
        payload: res.data
      });
      dispatch({
        type: ACTION.LOADING_DATA,
        payload: false
      });
    }).catch(e => {
      console.log(e);
      proccessing = false;
      dispatch({
        type: ACTION.USER_ACTION_ERROR,
        payload: prevState.users.list
      });
      dispatch({
        type: ACTION.LOADING_DATA,
        payload: false
      });
    });
  };
};

export const addNewUser = (data) => {
  return (dispatch, getState)=>{
    if(proccessing === false) {
      prevState = getState();
    }
    proccessing = true;
    dispatch({
      type: ACTION.ADD_USER,
      payload: {
        id: Math.random() * 100000000000000,
        ...data
      }
    });
    const token = localStorage.getItem('token');
    axios.post('/api/users', data,  {
      headers: {
        'x-access-token': token
      }
    }).then(res => {
      proccessing = false;
      dispatch({
        type: ACTION.REFETCH_USER,
        payload: res.data
      });
    }).catch(e => {
      proccessing = false;
       dispatch({
          type: ACTION.USER_ACTION_ERROR,
          payload: prevState.users.list
      });
      console.log(e);
    });
  };
};

export const editUser = (id, data) => {
  return (dispatch, getState)=>{
    if(proccessing === false) {
      prevState = getState();
    }
    proccessing = true;
    dispatch({
      type: ACTION.EDIT_USER,
      payload: {
        id,
        ...data
      }
    });
    const token = localStorage.getItem('token');
    axios.put(`/api/users/${id}`, data, {
      headers: {
        'x-access-token': token
      }
    }).then(res => {
      proccessing = false;
    }).catch(e => {
      proccessing = false;
       dispatch({
          type: ACTION.USER_ACTION_ERROR,
          payload: prevState.users.list
      });
      console.log(e);
    });
  };
};

export const deleteUser = (id) => {
  return (dispatch, getState)=>{
    if(proccessing === false) {
      prevState = getState();
    }
    proccessing = true;
    dispatch({
      type: ACTION.DELETE_USER,
      payload: id
    });
    const token = localStorage.getItem('token');
    axios.delete(`/api/users/${id}`, {
      headers: {
        'x-access-token': token
      }
    }).then(res => {
      proccessing = false;
    }).catch(e => {
      proccessing = false;
      dispatch({
        type: ACTION.USER_ACTION_ERROR,
        payload: prevState.users.list
      });
      console.log(e);
    });
  };
};

export const clearError = () => {
  return {
    type: ACTION.CLEAR_ERROR
  };
};

export const setPage = data => {
  return {
    type: ACTION.SET_PAGE,
    payload: data
  };
};

export const filterUsers = data => {
  return {
    type: ACTION.FILTER_USERS,
    payload: data
  };
}; 
