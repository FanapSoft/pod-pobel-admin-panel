// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
import Vue from 'vue'
import ApiService from "../api.service";

export const LOAD_USER_OBJECT = "loadUserObject";

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

      const user = await ApiService.get(Vue.$utils.addParamsToUrl("/api/services/app/User/Get", data));
      if(user.data && user.data.result) {
        context.commit(SET_USER_OBJECT, user.data.result);
        return user.data.result;
      }
    } catch (error) {
      throw new Error(error);
    }
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
