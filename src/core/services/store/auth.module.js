import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  /*[LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("login", credentials)
        .then(({ data }) => {
          // console.log("Here what post returns", data);
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise(resolve => {
      ApiServiceAuth.post("login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },*/
  //[VERIFY_AUTH](context) {
    /*if(JwtService.getToken()) {
      /!*let data = {
        token: JwtService.getToken(),
        token_type_hint: "access_token"
      };*!/
      // ApiServiceAuth
      //     .post("token/info", data)
      //     .then(result => {
      //       console.log('here');
      //       console.log('token check result: ', result);
      //       context.commit(SET_AUTH, result);
      //     })
      //     .catch(response => {
      //       console.log(response.message)
      //       if(response.message.indexOf('401') !== 'undefined'){
      //         window.location = ApiServiceAuth.loginUrl
      //       }
      //       context.commit(SET_ERROR, response);
      //
      //     });
    } else {
      window.location = ApiServiceAuth.loginUrl;
      // window.location = `https://accounts.pod.ir/oauth2/authorize/?client_id=18035391i35f649cbac6ab4d4c9bf45fb&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:8080/loggedIn')}`
    }*/
  //},
  /*[UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiServiceAuth.put("password", password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  }*/
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    JwtService.saveToken(state.user.token);
    ApiService.setHeader();
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
