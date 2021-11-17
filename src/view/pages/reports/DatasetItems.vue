<template>
  <div class="row" >
    <div class="col-md-12">
      <v-card>
        <v-card-title>
          {{ $t("DATASET.DATASETSITEMS") }}
          <v-spacer></v-spacer>

        </v-card-title>
        <v-card-text>
          <p>
            برای پردازش آیتم های دیتاست ابتدا یک دیتاست انتخاب نمایید، سپس شروع پردازش را کلیک کنید. عملیات پردازش زمان بر می باشد و توسط دکمه رفرش نتیجه می توانید از اتمام پردازش و امکان مشاهده خروجی ها و دریافت خروجی اکسل، مطلع شوید
          </p>
          <fieldset>
            <v-chip
                close label

                @click="$router.push('/dataset/list')"
                @click:close="()=>{$router.push('/reports/datasetItems'); getState(); }">
              {{ $t("DATASET.DATASET")}}: {{$route.query.DatasetId && currentDataset ? currentDataset.Name : ''}}
            </v-chip>
            <v-btn
                outlined

                v-if="currentDataset && currentDataset.Id"

                :disabled="isCheckingState || (processState && processState[currentDataset.Id] && !processState[currentDataset.Id].done && (processState[currentDataset.Id].started || processState[currentDataset.Id].hasError))"
                :loading="isCheckingState"
                @click="maybeStartCalculating"

                class="mr-2"
            >
              <template v-if="processState && (!processState[currentDataset.Id] || processState[currentDataset.Id] && !processState[currentDataset.Id].started && !processState[currentDataset.Id].hasError && !processState[currentDataset.Id].done)">
                شروع پردازش
              </template>
              <template v-else-if="processState && processState[currentDataset.Id].started && !processState[currentDataset.Id].hasError  && !processState[currentDataset.Id].done">
                در حال پردازش...
              </template>
              <template v-else-if="processState && processState[currentDataset.Id].done">
                پردازش کامل شده
              </template>
              <template v-else-if="processState && processState[currentDataset.Id].hasError">
                پردازش با خطا مواجه شده است
              </template>
            </v-btn>
            <v-btn
                v-if="currentDataset && currentDataset.Id"

                depressed

                :loading="isResetingResults"
                @click="resetProcessedResults"

                class="danger mr-2" >ریست جهت پردازش مجدد</v-btn>
          </fieldset>
        </v-card-text>
      </v-card>
    </div>
    <div
         v-if="processState && processState[currentDataset.Id] && processState[currentDataset.Id].done"

         class="col-md-12" >
      <v-card>
        <v-card-title>
          {{ $t("DATASET.DATASETSITEMS") }}
          <v-spacer></v-spacer>
          <span class="d-inline-block mr-3">{{pagination.realCount.toLocaleString()}}</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
              v-if="datasetItems"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="datasetItems"
              :page.sync="pagination.currentPage"
              :loading="loading"
              :items-per-page="10"
              :footer-props="{
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus'
                        }"

              item-key="objectId"
              class="elevation-1">
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + datasetItems.indexOf(item) + 1 : datasetItems.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.content="{ item }">
              <v-avatar v-if="item.Type === 0" class="my-2" rounded>
                <img :src="`${axios.defaults.baseURL}/api/File/Dataset/Item/${item.Id}`">
              </v-avatar>
              <span
                  v-else-if="item.Type === 1" style="max-width: 300px; display: inline-block;">{{ item.Content }}</span>
            </template>
            <template v-slot:item.labelName="{ item }">
              {{ (item.Name ? item.Name : 'No label')}}
            </template>
            <template v-slot:item.datasetItem="{ item }">
              <DatasetDetails
                  :key="item.DatasetId"
                  :item="item">
              </DatasetDetails>
            </template>

            <template v-slot:item.actions="{ item }">

            </template>
          </v-data-table>
          <v-row class="mx-9">
            <v-col cols="12" class="position-relative">
              <v-pagination
                  v-model="pagination.currentPage"
                  :total-visible="($vuetify.breakpoint.width - $vuetify.application.left - 404) / 44 - 1"
                  :length="pagination.count"

                  class="mt-4 pb-2"></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

  </div>

</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { SET_DATASET_ID } from "@/core/services/store/transactionsList.module";
import DatasetDetails from "../transactions/DatasetDetails";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";
import {mapGetters} from "vuex";

export default {
  name: "ReportsDatasetItems",
  data() {
    return {
      datasetItems: null,
      DatasetId: null,
      IsGoldenData: false,
      processState: null,
      isCheckingState: false,
      isResetingResults: false,

      listHeaders: [
        { text: this.$t("GENERAL.ROW"), value: "ind" },

        { text: this.$t("DATASET.ANSWERSCOUNT"), value: "AnswersCount" },
        { text: this.$t("DATASET.ANSWERSCOUNT"), value: "AnswersCount" },
        { text: this.$t("DATASET.ANSWERSCOUNT"), value: "AnswersCount" },
/*        { text: this.$t("GENERAL.CONTENT"), value: "content" },
        { text: this.$t("GENERAL.LABEL"), value: "labelName" },
        { text: this.$t("DATASET.ANSWERSCOUNT"), value: "AnswersCount" },
        { text: this.$t("DATASET.ISGOLDEN"), value: "IsGoldenData" },
        { text: this.$t("DATASET.DATASET"), value: "datasetItem" },
        { text: this.$t("GENERAL.ACTIONS"), value: "actions" },*/
      ],
      loading: false,
      pagination: {
        limit: 10,
        count: 0,
        realCount: 0,
        skip: 0,
        currentPage: 1,
        perPage: 10
      },
      expanded: [],
    };
  },
  computed: {
    ...mapGetters({
      currentDataset: `datasets/currentDataset`
    })
  },
  components: {
    DatasetDetails
  },
  methods:{
    async getState() {
      this.isCheckingState = true
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,

        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };
      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/GetState`, data));
        if(result.status < 400) {
          console.log(result)
          this.$set(this, 'processState', result.data.state);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isCheckingState = false
      }
    },
    async maybeStartCalculating() {
      if(!this.processState[this.currentDataset.Id] || (this.processState[this.currentDataset.Id] && !this.processState[this.currentDataset.Id].done && !this.processState[this.currentDataset.Id].hasError && !this.processState[this.currentDataset.Id].started)) {
        await this.startCalculatingResults();
        await this.getState();
      }
    },
    async startCalculatingResults() {
      this.loading = true;
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,
      };

      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/StartCalculatingResults`, data));
        if(result.status < 400) {
          //TODO: do what ?
        }
      } catch (error) {
        console.log(error);
      }
    },
    async resetProcessedResults() {
      this.isResetingResults = true;
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,
      };

      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/Reset`, data));
        if(result.status < 400) {
          //TODO: do what ?
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isResetingResults = false;
        await this.getState()
      }
    },
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,

        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/GetAll`, data));
        if(items.status < 400 && items.data.items) {
          this.datasetItems = items.data.items;
          this.datasetItems.forEach(item => {
            item.ReferenceDatasetId = item.DatasetId;
            //item.datasetName = item.datasetName;
          });
          this.pagination.count = items.data.totalCount ? Math.ceil(items.data.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = items.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    calcCurrentPage(page) {
      if (!page || page == 1) {
        this.pagination.skip = 0;
        this.pagination.currentPage = 1;
      } else if (page > 1) {
        this.pagination.skip = this.pagination.limit * (page - 1);
        this.pagination.currentPage = page;
      }
    },
    resetFields() {
      this.datasetItems = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    }
  },
  async mounted() {
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.$route.query.DatasetId);

    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.DATASETSITEMS")},
      //{ title: `Dataset ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      //{ title: `Items` },
    ]);

    await this.getState()
    //this.refreshList()
  },
  watch: {
    'pagination.currentPage'() {
      this.refreshList();
    },
    IsGoldenData(){
      this.refreshList()
    },
    OnlyNonDecidedGoldens(){
      this.refreshList()
    },
  }
};
</script>
