import * as ACTION from '../const/actions';

const initialState = {
  list: [],
  currentPage: 2,
  filter: '',
  error: '',
  loadingData: false
};

const fetchUsers = (state, action) => {
  const _state = {
    ...state,
    list: action.payload
  };
  return _state;
};

const addNewUser = (state, action) => {
  const _state = {
    ...state,
    list: [
      ...state.list,
      action.payload
    ]
  };
  return _state;
};

const refetchUser = (state, action) => {
  const newList = state.list.filter(user=> user.email !== action.payload.email);
  const _state = {
    ...state,
    list: [
      ...newList,
      action.payload
    ]
  };
  return _state;
};

const deleteUser = (state, action) => {
  const newList = state.list.filter(user=> user.id !== action.payload);
  const _state = {
    ...state,
    list: newList
  };
  return _state;
};

const editUser = (state, action) => {
  
  const newList = state.list.map((user) => {
    if (user.id === action.payload.id) {
      return Object.assign({}, action.payload);
    } else {
      return user;
    }
  });
  const _state = {
    ...state,
    list: newList
  };
  return _state;
};

const userActionError = (state, action) => {
  const _state = {
    ...state,
    error: 'Something went wrong.',
    list: action.payload
  };
  return _state;
};

const clearError = (state, action) => {
  const _state = {
    ...state,
    error: ''
  };
  return _state;
};

const loadingData = (state, action) => {
  const _state = {
    ...state,
    loadingData: action.payload
  };
  return _state;
};

const setPage = (state, action) => {
  const _state = {
    ...state,
    currentPage: action.payload
  };
  return _state;
};

const filterUsers = (state, action) => {
  const _state = {
    ...state,
    filter: action.payload
  };
  return _state;
};

const users = (state = initialState, action) => {
    switch (action.type) {
        case ACTION.FETCH_USERS:
          return fetchUsers(state, action);
        case ACTION.ADD_USER:
          return addNewUser(state, action);
        case ACTION.REFETCH_USER:
          return refetchUser(state, action);
        case ACTION.EDIT_USER:
          return editUser(state, action);
        case ACTION.DELETE_USER:
          return deleteUser(state, action);
        case ACTION.USER_ACTION_ERROR:
          return userActionError(state, action);
        case ACTION.CLEAR_ERROR:
          return clearError(state, action);
        case ACTION.LOADING_DATA:
          return loadingData(state, action);
        case ACTION.SET_PAGE:
          return setPage(state, action);
        case ACTION.FILTER_USERS:
          return filterUsers(state, action);
        default:
          return state;
    }
};

export default users;