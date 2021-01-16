import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";
import subheaderActions from "./subheaderActions.module";
import transactionsList from "./transactionsList.module";
import answerCountTrend from "./answerCountTrend.module";
import answersList from  "./answersList.module"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    htmlClass,
    config,
    breadcrumbs,
    profile,
    subheaderActions,
    transactionsList,
    answerCountTrend,
    answersList
  }
});
