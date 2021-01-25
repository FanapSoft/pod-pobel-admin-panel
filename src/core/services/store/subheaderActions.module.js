// action types
export const APPEND_SUBHEADER_ACTION = "appendSubHeaderAction";

// mutation types
export const SET_SUBHEADER_ACTION = "setSubHeaderAction";
export const ADD_SUBHEADER_ACTION = "addSubHeaderAction";
export const REMOVE_SUBHEAR_ACTIONS = "removeSubHeaderActions";

export default {
  state: {
    actionLinks: []
  },
  getters: {
    /**
     * Get list of breadcrumbs for current page
     * @param state
     * @returns {*}
     */
    actionLinks(state) {
      return state.actionLinks;
    }
  },
  actions: {
    /**
     * Set the breadcrumbs list
     * @param state
     * @param payload
     */
    [SET_SUBHEADER_ACTION](state, payload) {
      state.commit(SET_SUBHEADER_ACTION, payload);
    },

    /**
     * Add breadcrumb
     * @param state
     * @param payload
     */
    [ADD_SUBHEADER_ACTION](state, payload) {
      if (typeof payload === "object") {
        payload.forEach(item => state.commit(APPEND_SUBHEADER_ACTION, item));
      } else {
        state.commit(APPEND_SUBHEADER_ACTION, payload);
      }
    }
  },
  mutations: {
    [APPEND_SUBHEADER_ACTION](state, payload) {
      state.actionLinks = [...state.actionLinks, payload];
    },
    [SET_SUBHEADER_ACTION](state, payload) {
      state.actionLinks = payload;
    },
    [REMOVE_SUBHEAR_ACTIONS](state) {
      state.actionLinks = [];
    }
  }
};
