<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<style lang="scss">
// 3rd party plugins css
@import "~bootstrap-vue/dist/bootstrap-vue.css";
@import "~perfect-scrollbar/css/perfect-scrollbar.css";
@import "~socicon/css/socicon.css";
@import "~animate.css";
@import "~@fortawesome/fontawesome-free/css/all.css";
@import "~line-awesome/dist/line-awesome/css/line-awesome.css";
@import "assets/plugins/flaticon/flaticon.css";
@import "assets/plugins/flaticon2/flaticon.css";
@import "assets/plugins/keenthemes-icons/font/ki.css";

// Main demo style scss
// @import "assets/sass/style.vue";

// Check documentation for RTL css
// Update HTML with RTL attribute at public/index.html
/*@import "assets/css/style.vue.rtl";*/
</style>

<script>
import { OVERRIDE_LAYOUT_CONFIG } from "@/core/services/store/config.module";
import i18nService from "@/core/services/i18n.service.js";

export default {
  name: "MetronicVue",
  mounted() {
    /**
     * this is to override the layout config using saved data from localStorage
     * remove this to use config only from static json (@/core/config/layout.config.json)
     */
    this.$store.dispatch(OVERRIDE_LAYOUT_CONFIG);

    if (i18nService.getActiveLanguage() === 'fa') {
      import("@/assets/css/style.vue.rtl.css");

      let body = document.getElementsByTagName("body")[0];
      body.setAttribute("direction", "rtl");
      body.setAttribute("dir", "rtl");
      body.style.direction = "rtl";
      body.classList.add("rtl");

      this.$vuetify.rtl = true;
    } else {
      import("@/assets/css/style.vue.css")

      this.$vuetify.rtl = false;
    }
  }
};
</script>
