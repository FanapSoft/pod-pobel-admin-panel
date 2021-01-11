// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
//export const UPDATE_ACCOUNT_INFO = "updateUserAccountInfo";

// mutation types
export const SET_USER_ID = "setUserId";
export const SET_DATASET_ID = "setDatasetId";

const state = {
  ownerId: null,
  datasetId: null
};

const getters = {
  datasetId(state) {
    return state.datasetId;
  },

  ownerId(state) {
    return state.ownerId;
  }
};

const actions = {

};

const mutations = {
  [SET_OWNER_ID](state, ownerId) {
    state.ownerId = ownerId;
  },
  [SET_DATASET_ID](state, datasetId) {
    state.datasetId = datasetId;
  },

};

export default {
  state,
  actions,
  mutations,
  getters
};
