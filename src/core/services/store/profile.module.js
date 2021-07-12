// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
import Vue from 'vue'
import ApiService from "../api.service";

export const LOAD_USER_OBJECT = "loadUserObject";
export const EMPTY_LOCAL_OBJECT = "emptyLocalUserObject";

// mutation types
export const SET_USER_OBJECT = "setUserObject";

const state = {
  user: null
};

const getters = {
  user(state) {
    return state.user;
  },
};

const actions = {
  async [LOAD_USER_OBJECT](context, userId) {
    const data = {
      id: userId
    };
    try {

      const user = await ApiService.get("/api/User/Get/" + userId);
      if(user.status < 400) {
        context.commit(SET_USER_OBJECT, user.data);
        return user.data;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  async [EMPTY_LOCAL_OBJECT](context) {
    this.state.user = null;
  },
};

const mutations = {
  [SET_USER_OBJECT](state, user) {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
