import * as ACTION from '../const/actions';

const initialState = {
  authenticated: false,
  loginError: false,
  user: {},
  userLoading: true
};

const fetchingUser = (state, action) => {
  const _state = {
   ...state,
    userLoading: action.payload
  };
  return _state; 
};

const loginSuccess = (state, action) => {
  const _state = {
    ...state,
    authenticated: true,
    loginError: false,
    user: action.payload
  };
  return _state;
};

const loginFail = (state, action) => {
  const _state = {
    ...state,
    loginError: true
  };
  return _state;
};

const logout = (state, action) => {
  const _state = {
    ...state,
    authenticated: false,
    loginError: false,
    user: {}
  };
  return _state;
};

const loginErrorClear = (state, action) => {
  const _state = {
    ...state,
    loginError: false
  };
  return _state;
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case ACTION.LOGIN_FAIL:
      return loginFail(state, action);
    case ACTION.LOGOUT:
      return logout(state, action);
    case ACTION.LOGIN_ERROR_CLEAR:
      return loginErrorClear(state, action);
    case ACTION.FETCHING_USER:
        return fetchingUser(state, action);
    default:
      return state;
  }
};

export default auth;


