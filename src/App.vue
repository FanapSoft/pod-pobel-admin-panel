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

@font-face {
  font-family:Irsans;
  $prefix: '';
  @if $env == "production" {
    $prefix: '/admin'
  }
  src:
      url($prefix + '/assets/webfonts/irsans.eot?#') format("eot"),
      url($prefix + '/assets/webfonts/irsans.woff') format("woff"),
      url($prefix + '/assets/webfonts/irsans.ttf') format("truetype")
}

.v-application,
.apexcharts-text,
.apexcharts-text tspan,
.apexcharts-title-text,
.apexcharts-legend-text {
  font-family: Roboto, Irsans, "sans-serif" !important
}

.rtl .v-application,
.rtl .apexcharts-text,
.rtl .apexcharts-text tspan,
.rtl .apexcharts-title-text,
.rtl .apexcharts-legend-text {
  font-family: Irsans, Roboto, "sans-serif" !important
}

.vpd-input-group input {
  border: 1px solid #dadada !important;
  border-right: 1px solid #dadada !important;
  border-radius: 0;
}

.ltr-picker .vpd-input-group .vpd-clear-btn {
  left: auto;
  right: 0;
}

</style>

<script>
import { OVERRIDE_LAYOUT_CONFIG } from "@/core/services/store/config.module";


export default {
  name: "MetronicVue",
  mounted() {
    /**
     * this is to override the layout config using saved data from localStorage
     * remove this to use config only from static json (@/core/config/layout.config.json)
     */
    this.$store.dispatch(OVERRIDE_LAYOUT_CONFIG);

    if (this.$langIsFa) {
      let body = document.querySelector('body');
      body.setAttribute("direction", "rtl");
      body.setAttribute("dir", "rtl");
      body.style.direction = "rtl";
      body.classList.add("rtl");

      import("@/assets/css/style.vue.rtl.css");

      this.$vuetify.rtl = true;
    } else {
      import("@/assets/css/style.vue.css")
      this.$vuetify.rtl = false;
    }
  }
};
</script>
