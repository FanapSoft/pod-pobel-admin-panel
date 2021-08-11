<template>
  <div>
    <!--begin::Dashboard-->
    <v-row>
      <v-col cols="4">
        <b-card  :img-height="75" img-left :img-src="$adminPrefix + '/media/svg/avatars/001-boy.svg'">
          <div class="d-flex">

            کل کاربران
            <v-spacer></v-spacer>
            {{ systemStats.users }}
          </div>
        </b-card>
      </v-col>
      <v-col cols="4">
        <b-card  :img-height="75" img-left :img-src="$adminPrefix + '/media/svg/icons/General/Attachment1.svg'">
          <div class="d-flex">

            کل پاسخ های کاربران
            <v-spacer></v-spacer>
            {{ systemStats.answers }}
          </div>
        </b-card>
      </v-col>
      <v-col cols="4">
        <b-card  :img-height="75" img-left :img-src="$adminPrefix + '/media/svg/icons/Files/File.svg'">
          <div class="d-flex">

            کل آیتم های موجود
            <v-spacer></v-spacer>
            {{ systemStats.datasetitems }}
          </div>
        </b-card>
      </v-col>
      <v-col cols="4">
        <b-card  :img-height="75" img-left :img-src="$adminPrefix + '/media/svg/icons/Files/File-done.svg'">
          <div class="d-flex">

            کل  پاسخ های صحیح به گلدن ها
            <v-spacer></v-spacer>
            {{ systemStats.correctgoldenanswers }}
          </div>
        </b-card>
      </v-col>
      <v-col cols="4">
        <b-card  :img-height="75" img-left :img-src="$adminPrefix + '/media/svg/icons/General/Clip.svg'">
          <div class="d-flex">

            کل دیتاست ها
            <v-spacer></v-spacer>
            {{ systemStats.datasets }}
          </div>
        </b-card>
      </v-col>

    </v-row>
    <!--end::Dashboard-->
  </div>
</template>

<script>
/* eslint-disable */
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import AdvancedTableWidget2 from "@/view/content/widgets/advance-table/Widget2.vue";
import MixedWidget1 from "@/view/content/widgets/mixed/Widget1.vue";
import ListWidget1 from "@/view/content/widgets/list/Widget1.vue";
import ListWidget9 from "@/view/content/widgets/list/Widget9.vue";
import ListWidget11 from "@/view/content/widgets/list/Widget11.vue";
import ListWidget12 from "@/view/content/widgets/list/Widget12.vue";
import ListWidget13 from "@/view/content/widgets/list/Widget13.vue";
import ListWidget14 from "@/view/content/widgets/list/Widget14.vue";
import ListWidget15 from "@/view/content/widgets/list/Widget15.vue";
import Vue from "vue";
import ApiService from "@/core/services/api.service";

export default {
  name: "dashboard",
  components: {

  },
  data: ()=>({
    systemStats: null
  }),
  methods: {
    async getSystemStat() {
       try {
        const stats = await this.$http.get(`/api/Reports/Dashboard`);
        if (stats.status < 400) {
          this.systemStats = stats.data
          console.log(this.systemStats)
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("MENU.DASHBOARD") }]);
    this.getSystemStat()
  }

};
</script>
