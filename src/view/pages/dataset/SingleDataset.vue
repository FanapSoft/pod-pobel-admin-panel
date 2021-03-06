<template>
  <div>
    <div class="row">
      <div class="col-md-12">

        <v-row>
          <v-col
              cols="6"
              class="pb-0">
            <v-card :to="`/datasetitems?DatasetId=${this.$route.params.DatasetId}`">
              <v-card-title>
                Items
                <v-spacer></v-spacer>
                {{ datasetItemsCount }}
              </v-card-title>
              <v-card-subtitle>View Dataset Items</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card to="targets">
              <v-card-title>
                Targets
                <v-spacer></v-spacer>
                {{ targetsCount }}
              </v-card-title>
              <v-card-subtitle>View Dataset Targets</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card :to="`/answers?DatasetId=${$route.params.DatasetId}`">
              <v-card-title>
                Answers
                <v-spacer></v-spacer>
                {{ answersCount }}
              </v-card-title>
              <v-card-subtitle>View Dataset Answers</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card :to="`/transaction/list?DatasetId=${this.$route.params.DatasetId}`">
              <v-card-title>
                Transactions
                <v-spacer></v-spacer>
                {{ transactionsCount }}
              </v-card-title>
              <v-card-subtitle>View Dataset Transactions</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import {SET_SUBHEADER_ACTION} from "@/core/services/store/subheaderActions.module";
import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";

export default {
  name: 'Datasets',
  data() {
    return {
      datasetItemsCount: null,
      targetsCount: null,
      transactionsCount: null,
      answersCount: null,
      loading: false
    };
  },
  methods: {
    async getDatasetItemsCount() {
      this.loading = true;
      const data = {
        DataSetId: this.$route.params.DatasetId,
        SkipCount: 0,
        MaxResultCount: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/DataSetItems/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.datasetItemsCount = items.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getTargetsCount() {
      this.loading = true;
      const data = {
        DatasetId: this.$route.params.DatasetId,
        SkipCount: 0,
        MaxResultCount: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/TargetDefinitions/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.targetsCount = items.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getTransactionsCount() {
      this.loading = true;
      const data = {
        DatasetId: this.$route.params.DatasetId,
        SkipCount: 0,
        MaxResultCount: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Transactions/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.transactionsCount = items.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getAnswersCount() {
      this.loading = true;
      const data = {
        DatasetId: this.$route.params.DatasetId,
        SkipCount: 0,
        MaxResultCount: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Answers/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.answersCount = items.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
  mounted() {
    this.$store.dispatch(SET_SUBHEADER_ACTION, [
      {
        title: this.$t("BREADCRUMBS.EDITDATASET"),
        link: `/dataset/${this.$route.params.DatasetId}/edit`
      },
      {
        title: 'AnswerCountTrend',
        link: `/reports/AnswerCountTrend?DatasetId=${this.$route.params.DatasetId}`
      },
      {
        title: 'Scoreboard',
        link: `/reports/Scoreboard?DatasetId=${this.$route.params.DatasetId}`
      },

    ]);
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("BREADCRUMBS.MANAGEDATASETS"), route: "/dataset/list" },
      { title: `${this.$t("BREADCRUMBS.DATASET")} ${this.$route.params.DatasetId.substr(0, 10)}...` },
    ]);

    this.getTargetsCount();
    this.getDatasetItemsCount();
    this.getAnswersCount();
    this.getTransactionsCount();
  }
};
</script>
