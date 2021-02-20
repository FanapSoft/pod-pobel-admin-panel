// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
//export const UPDATE_ACCOUNT_INFO = "updateUserAccountInfo";

// mutation types
export const SET_DATASET_ID = "setDatasetId";

const state = {
  datasetId: null,
};

const getters = {
  datasetId(state) {
    return state.datasetId;
  }
};

const actions = {

};

const mutations = {
  [SET_DATASET_ID](state, datasetId) {
    state.datasetId = datasetId;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
