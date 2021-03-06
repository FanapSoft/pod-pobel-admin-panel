<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            Choose a report type
            <v-spacer></v-spacer>
          </v-card-title>
        </v-card>
        <v-row>
            <v-col cols="4" class="pb-0">
              <v-card to="AnswerCountTrend">
                <v-card-title>Answers Counts Trend</v-card-title>
                <v-card-subtitle>Users activity trend on datasets</v-card-subtitle>
              </v-card>
            </v-col>
          <v-col cols="4" class="pb-0">
            <v-card :to="`/reports/scoreboard`">
              <v-card-title>Scoreboard</v-card-title>
              <v-card-subtitle>Scoreboard</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import { SET_SUBHEADER_ACTION } from "@/core/services/store/subheaderActions.module";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  name: 'Reports',
  data() {
    return {
      datasets: null,
      loading: false
    };
  },
  methods:{

  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("BREADCRUMBS.REPORTS") },
    ]);
    /*this.$store.dispatch(SET_SUBHEADER_ACTION, [
      {
        title: 'Create Dataset',
        link: `/dataset/create`
      }
    ]);*/
    // this.$store.dispatch(SET_BREADCRUMB, [{ title: "Manage Datasets", route: "/dataset/list" }]);
  }
};
</script>
