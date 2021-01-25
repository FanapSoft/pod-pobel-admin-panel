// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
//export const UPDATE_ACCOUNT_INFO = "updateUserAccountInfo";

// mutation types
export const SET_USER_ID = "setUserId";
export const SET_DATASET_ID = "setDatasetId";

const state = {
  userId: null,
  datasetId: null
};

const getters = {
  datasetId(state) {
    return state.datasetId;
  },

  userId(state) {
    return state.userId;
  }
};

const actions = {

};

const mutations = {
  [SET_USER_ID](state, userId) {
    state.userId = userId;
  },
  [SET_DATASET_ID](state, datasetId) {
    state.datasetId = datasetId;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
