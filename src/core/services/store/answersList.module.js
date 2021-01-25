// action types
//export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
//export const UPDATE_ACCOUNT_INFO = "updateUserAccountInfo";

// mutation types
export const SET_USER_ID = "setUserId";
export const SET_DATASET_ID = "setDatasetId";
export const SET_DATASETITEM_ID = "setDatasetItemId";
export const SET_DATE_TO = "setDateTo";
export const SET_DATE_FROM = "setDateFrom";

const state = {
  userId: null,
  datasetId: null,
  datasetItemId: null ,
  dateFrom: null,
  dateTo: null
};

const getters = {
  datasetId(state) {
    return state.datasetId;
  },
  datasetItemId(state) {
    return state.datasetItemId;
  },
  userId(state) {
    return state.userId;
  },
  dateFrom () {
    return state.dateFrom
  },
  dateTo () {
    return state.dateTo
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
  [SET_DATASETITEM_ID](state, datasetItemId) {
    state.datasetItemId = datasetItemId;
  },
  [SET_DATE_TO](state, dateTo) {
    state.dateTo = dateTo;
  },
  [SET_DATE_FROM](state, dateFrom) {
    state.dateFrom = dateFrom;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
