/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/core/services/store";

import {REMOVE_SUBHEADER_ACTIONS} from "@/core/services/store/subheaderActions.module"

import ApiService from "@/core/services/api.service";
//import MockService from "@/core/mock/mock.service";
import { SET_AUTH } from "@/core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";


import Utils from "@/plugins/Utils"
Vue.use(Utils);

Vue.config.productionTip = false;

import "@/filters/index"

// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from "clipboard";
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from "@/core/plugins/vue-i18n";
import vuetify from "@/core/plugins/vuetify";
import "@/core/plugins/portal-vue";
import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/highlight-js";
import "@/core/plugins/inline-svg";
import "@/core/plugins/apexcharts";
import "@/core/plugins/metronic";
import "@mdi/font/css/materialdesignicons.css";

// API service init
ApiService.init();
ApiService.setHeader();

// Remove this to disable mock API
//MockService.init();

router.beforeEach((to, from, next) => {
  store.commit(REMOVE_SUBHEADER_ACTIONS)
  // Ensure we checked auth before each page load.
  if(to.name == 'loggedIn') {
    if(to.query && to.query.token) {
      store
          .dispatch(SET_AUTH, {token: atob(to.query.token), uid: to.params.userId})
          .then(() => {
            next('dashboard');
          });
    } else {
      window.location = ApiService.loginUrl;
    }
  } else {
    next();
  }
  // reset config to initial state
  store.dispatch(RESET_LAYOUT_CONFIG);
  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

Vue.prototype.$adminPrefix = (process.env.NODE_ENV === 'production'? '/admin' : '');

import i18nService from "@/core/services/i18n.service.js";
Vue.prototype.$i18nService = i18nService;
Vue.prototype.$langIsFa = i18nService.getActiveLanguage() === 'fa';

import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.component('jalali-date-picker', VuePersianDatetimePicker);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app");
