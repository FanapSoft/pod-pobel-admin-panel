<template>
  <div>
    <!--begin::Dashboard-->
    <v-row>
      <v-col cols="12" class="px-6">
        <v-chip
            close

            @click="$router.push('/users/list?showAnswerCountTrend=true')"
            @click:close="removeQueryItem('userId')">User: {{userId ? userId : ':) Choose a user'}}</v-chip>
        <v-chip
            v-if="userId"
            close

            @click="$router.push('/dataset/list')"
            @click:close="removeQueryItem('datasetId')">Dataset: {{datasetId ? datasetId : 'All'}}</v-chip>
      </v-col>
    </v-row>
    <div class="row">
      <div class="col-12 ">
        <v-card style="background-color: #cfd8dc">
          <v-card-title>30 Days answers counts trend for user: {{userId}}</v-card-title>
          <v-card-text v-if="userId" class="px-0 py-0">
            <chart
                v-if="dataCounts && dataCounts.length && dates"

                :data="dataCounts"
                :categories="dates"></chart>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!--end::Dashboard-->
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { SET_DATASET_ID, SET_USER_ID } from "@/core/services/store/answerCountTrend.module";
import { mapGetters } from "vuex";
import Chart from "./Chart";

export default {
  name: "AnswersCountTrend",
  data(){
    return {
      dates: [],
      dataCounts: [],
      showChart: false
    }
  },
  components: {
    Chart
    // AdvancedTableWidget2,
    // MixedWidget1
  },
  computed: {
    ...mapGetters({
      layoutConfig: "layoutConfig",
      datasetId: "answerCountTrend/datasetId",
      userId: "answerCountTrend/userId"
    })
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
        { title: "Reports", route: '/reports/list' },
        { title: "AnswerCountTrend" }
    ]);

    if(this.$route.query.UserId) {
      this.$store.commit(`answerCountTrend/${SET_USER_ID}`, this.$route.query.UserId);
    }

    if(this.$route.query.DatasetId) {
      this.$store.commit(`answerCountTrend/${SET_DATASET_ID}`, this.$route.query.DatasetId);
    }

    this.generateDates();
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      if(!this.userId)
        return;
      const today = new Date();
      const priorDay = new Date(new Date().setDate(today.getMonth()-12));

      const data = {
        UserId: this.userId,
        From: priorDay.toLocaleDateString("en-US"),
        To: today.toLocaleDateString("en-US"),
        DataSetId: this.datasetId,
      };

      try {
        const res = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Reports/AnswersCountsTrend`, data));
        console.log(res)
        if(res.data.result && res.data.result.length) {
          this.$nextTick(() => {
            this.extractApiData(res.data.result);
            // this.$nextTick(()=>{
            //   this.setupChartOptions();
            // })
          })
        }

        /*if(transactions.data && transactions.data.result) {

          this.transactions = transactions.data.result.items;
        }*/
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    removeQueryItem(item) {
      if (item == 'userId')
        this.$store.commit(`answerCountTrend/${SET_USER_ID}`, null);
      if (item == 'datasetId')
        this.$store.commit(`answerCountTrend/${SET_DATASET_ID}`, null);

      //this.refreshList()
    },
    generateDates() {
      for(let i=30; i >= 1; i--) {
        const tmpDay = new Date(new Date().setDate(new Date().getDate() - i));

        this.dates.push(tmpDay.toLocaleDateString("en-US"))
      }
    },
    extractApiData(apiData) {
      this.dataCounts = [];

      this.dates.forEach((item, index) => {
        let hasAdi = false
        apiData.forEach(adi => {
          if(new Date(adi.date).toLocaleDateString('en-US') == item) {
            this.dataCounts.push(adi.count);
            hasAdi = true;
          }
          this.$set(this.dates, index, new Date(item).toLocaleDateString('fa-IR'));
        })
        if(!hasAdi) {
          this.dataCounts.push(0);
        }
      })
    },
  },
};
</script>
