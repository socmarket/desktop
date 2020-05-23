import sha256 from 'crypto-js/sha256';

export interface User {
  id: int;
  login: string;
  fullName: string;
  password: string;
  passwordNotSet: boolean;
}

export interface AclState {
  currentUser: User;
  lastError: string;
  authenticated: boolean;
  login: string;
  password: string;
  password2: string;
}

const emptyUser: User = {
  id: -1,
  login: "",
  fullName: "",
};

const setUser = (user: User) => ({
  type: "ACL_SET_USER",
  user: user
});

const setError = (msg: string) => ({
  type: "ACL_SET_ERROR",
  errorMsg: msg
});

const signIn = () => ({
  type: "ACL_SIGN_IN",
});

function authOrReg() {
  return function (dispatch, getState, { db }) {
    const { acl: { currentUser, login, password, password2 } } = getState();
    const hash = sha256(password) + "";
    console.log(hash);
    if (login.length === 0 || password.length === 0) {
      return;
    }
    if (currentUser.id > 0) {
      if (currentUser.passwordNotSet) {
        if (password === password2) {
          db.exec("update user set password = ? where id = ?", [
            hash,
            currentUser.id
          ])
            .then(_ => {
              dispatch(signIn());
            })
            .catch(err => {
              dispatch(setError(err));
            })
        } else {
          dispatch(setError("Пароли не совпадают"));
        }
      } else {
        if (currentUser.password === hash) {
          dispatch(signIn());
        } else {
          dispatch(setError("Неверное имя пользователя или пароль."));
        }
      }
    } else {
      dispatch(setError("Неверное имя пользователя или пароль."));
    }
  };
}

function findUser() {
  return function (dispatch, getState, { db }) {
    const { acl: { login } } = getState();
    if (login.length > 0) {
      db.selectOne("select *, password is null as passwordNotSet from user where login = ?", [ login ])
      .then((user: User) => {
        if (user) {
          dispatch(setUser(user));
          dispatch(setError(""));
        } else {
          dispatch(setUser(emptyUser));
        }
      })
      .catch(err => {
        dispatch(setError(err));
      })
    }
  };
}

const AclActions = {
  findUser: findUser,
  authOrReg: authOrReg,

  onLoginChange: (event) => ({
    type: 'ACL_ON_LOGIN_CHANGE',
    login: event.target.value
  }),

  onPasswordChange: (event) => ({
    type: 'ACL_ON_PASSWORD_CHANGE',
    password: event.target.value
  }),

  onPassword2Change: (event) => ({
    type: 'ACL_ON_PASSWORD2_CHANGE',
    password2: event.target.value
  }),

  signOut: () => ({
    type: 'ACL_SIGN_OUT'
  }),

}

function AclReducer (state: AclState = {
  currentUser: emptyUser,
  lastError: "",
  authenticated: true,
  login: "",
  password: "",
  password2: "",
}, action) {
  switch (action.type) {
    case "ACL_ON_LOGIN_CHANGE": {
      return Object.assign({}, state, {
        login: action.login
      });
    }
    case "ACL_ON_PASSWORD_CHANGE": {
      return Object.assign({}, state, {
        password: action.password
      });
    }
    case "ACL_ON_PASSWORD2_CHANGE": {
      return Object.assign({}, state, {
        password2: action.password2
      });
    }
    case "ACL_SET_ERROR": {
      return Object.assign({}, state, {
        lastError: action.errorMsg
      });
    }
    case "ACL_SET_USER": {
      return Object.assign({}, state, {
        currentUser: action.user
      });
    }
    case "ACL_SIGN_IN": {
      return Object.assign({}, state, {
        authenticated: true,
        login: "",
        password: "",
        password2: "",
        lastError: "",
      });
    }
    case "ACL_SIGN_OUT": {
      return Object.assign({}, state, {
        authenticated: false,
        currentUser: emptyUser,
        login: "",
        password: "",
        password2: "",
        lastError: "",
      });
    }
    default:
      return state
  }
}

export { AclActions, AclReducer };
