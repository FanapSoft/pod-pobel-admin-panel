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
                {{$t("DATASET.ITEMS")}}
                <v-spacer></v-spacer>
                {{ datasetItemsCount.toLocaleString() }}
              </v-card-title>
              <v-card-subtitle>{{ $t("DATASET.VIEWDATASETITEMS")}}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card to="targets">
              <v-card-title>
                {{ $t("TARGET.TARGETS") }}
                <v-spacer></v-spacer>
                {{ targetsCount }}
              </v-card-title>
              <v-card-subtitle>{{ $t("DATASET.VIEWDATASETTARGETS")}}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card :to="`/answers?DatasetId=${$route.params.DatasetId}`">
              <v-card-title>
                {{ $t("BREADCRUMBS.ANSWERS")}}
                <v-spacer></v-spacer>
                {{ answersCount.toLocaleString() }}
              </v-card-title>
              <v-card-subtitle>{{ $t("DATASET.VIEWDATASETANSWERS") }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
              cols="6"
              class="pb-0">
            <v-card :to="`/transaction/list?DatasetId=${this.$route.params.DatasetId}`">
              <v-card-title>
                {{ $t("BREADCRUMBS.TRANSACTIONS") }}
                <v-spacer></v-spacer>
                {{ transactionsCount }}
              </v-card-title>
              <v-card-subtitle>{{ $t("DATASET.VIEWDATASETTRANSACTIONS") }}</v-card-subtitle>
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
import {mapGetters} from "vuex";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";

export default {
  name: 'Datasets',
  data() {
    return {
      datasetItemsCount: 0,
      targetsCount: 0,
      transactionsCount: 0,
      answersCount: 0,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      currentDataset: `datasets/currentDataset`
    })
  },
  methods: {
    async getDatasetItemsCount() {
      this.loading = true;
      const data = {
        DatasetId: this.$route.params.DatasetId,
        Skip: 0,
        Limit: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetItems/GetAll`, data));
        if(items.data && items.data.items) {
          this.datasetItemsCount = items.data.totalCount;
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
        Skip: 0,
        Limit: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/TargetDefinitions/GetAll`, data));
        if(items.data && items.data.items) {
          this.targetsCount = items.data.totalCount;
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
        Skip: 0,
        Limit: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/Transactions/GetAll`, data));
        if(items.data && items.data.items) {
          this.transactionsCount = items.data.totalCount;
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
        Skip: 0,
        Limit: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/Answers/GetAll`, data));
        if(items.data && items.data.items) {
          this.answersCount = items.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    setBreadcrumbs() {
      this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
        {
          title: `${this.$t("DATASET.DATASET")} ${ this.currentDataset ? this.currentDataset.Name : this.$route.params.DatasetId.substr(0, 10) + '...'}`,
          route: `/dataset/${this.$route.params.DatasetId}/singleDataset`
        },
      ]);
    }
  },
  async mounted() {
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.$route.params.DatasetId);
    this.setBreadcrumbs();
    this.$store.dispatch(SET_SUBHEADER_ACTION, [
      {
        title: this.$t("DATASET.EDITDATASET"),
        link: `/dataset/${this.$route.params.DatasetId}/edit`
      },
      {
        title: this.$t("REPORTS.ANSWERSTREND"),
        link: `/reports/AnswerCountTrend?DatasetId=${this.$route.params.DatasetId}`
      },
      {
        title: this.$t("REPORTS.SCOREBOARD"),
        link: `/reports/Scoreboard?DatasetId=${this.$route.params.DatasetId}`
      },
      {
        title: this.$t("REPORTS.RESULTS"),
        link: `/reports/DatasetItems?DatasetId=${this.$route.params.DatasetId}`
      },

    ]);

    this.getTargetsCount();
    this.getDatasetItemsCount();
    this.getAnswersCount();
    this.getTransactionsCount();
  },
};
</script>
