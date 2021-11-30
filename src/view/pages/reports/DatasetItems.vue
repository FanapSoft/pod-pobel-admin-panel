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

                :disabled="isCheckingState || (processState && !processState.done && (processState.started || processState.hasError))"
                :loading="isCheckingState"
                @click="maybeStartCalculating"

                class="mr-2"
            >
              <template v-if="!processState || (processState && !processState.started && !processState.hasError && !processState.done)">
                شروع پردازش
              </template>
              <template v-else-if="processState && processState.started && !processState.hasError  && !processState.done">
                در حال پردازش...
              </template>
              <template v-else-if="processState && processState.done">
                پردازش کامل شده
              </template>
              <template v-else-if="processState && processState.hasError">
                پردازش با خطا مواجه شده است
              </template>
            </v-btn>
            <v-btn
                v-if="currentDataset && currentDataset.Id"

                depressed

                :loading="isResetingResults"
                @click="resetProcessedResults"

                class="mr-1 bg-danger btn-danger text-white" >ریست جهت پردازش مجدد</v-btn>
          </fieldset>
        </v-card-text>
      </v-card>
    </div>
    <div
         v-if="processState && processState.done"

         class="col-md-12" >
      <v-card>
        <v-card-title>
          نتیجه پردازش برای دیتاست:
          {{currentDataset.Name}}
           <strong class="mx-1">|</strong>
          <v-btn
              depressed small text

              @click="maybeGenerateCSV"
              :disabled="csvGenerateState && csvGenerateState.started && !csvGenerateState.hasError  && !csvGenerateState.done"
              :loading="isCheckingCSVState"
              :href="(csvGenerateState && csvGenerateState.done ? appProdURL + '/public/export.csv' : '#')"
              :target="(csvGenerateState && csvGenerateState.done ? '_blank' : '_self')"

              class="mx-1"
          >
            <template v-if="!csvGenerateState || csvGenerateState && (!csvGenerateState || csvGenerateState && !csvGenerateState.started && !csvGenerateState.hasError && !csvGenerateState.done)">
              ایجاد خروجی CSV
            </template>
            <template v-else-if="csvGenerateState && csvGenerateState.started && !csvGenerateState.hasError  && !csvGenerateState.done">
              در حال پردازش...
            </template>
            <template v-else-if="csvGenerateState && csvGenerateState.done">
              دانلود CSV
            </template>
            <template v-else-if="csvGenerateState && csvGenerateState.hasError">
              پردازش با خطا مواجه شده است
            </template>
          </v-btn>
          <v-btn
              v-if="csvGenerateState"
              depressed small

              @click="resetCSV"
              :loading="isResetingCSV"

              class="bg-danger btn-danger text-white"
          >ریست</v-btn>
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
            <template v-slot:header.IsReplicationDone="{ item }">
              <v-select
                  outlined dense hide-details

                  :items="[{text: 'همه', value: null}, {text: 'کامل ها', value: 'True'}, {text: 'ناقص ها', value:'False'}]"
                  @change="handleFilterIsReplicationDone"

                  label="وضعیت پاسخ ها"
                  style="width: 180px">
              </v-select>
            </template>
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + datasetItems.indexOf(item) + 1 : datasetItems.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.IsReplicationDone="{ item }">
                {{ item.IsReplicationDone ?
                "کامل"
                :
                "ناقص"
                }}
            </template>
            <template v-slot:item.TotalAnswers="{ item }">
                {{`${item.TotalAnswers} / ${item.TotalYesAnswers} / ${item.TotalNoAnswers}`}}
            </template>
            <template v-slot:item.OverAllResult="{ item }">
                <div style="direction: ltr; text-align: center">{{`${item.OverAllResultPercent} || ${item.OverAllResult}`}}</div>
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
      processState: null,
      csvGenerateState: null,
      isCheckingState: false,
      isCheckingCSVState: false,
      isResetingResults: false,
      isResetingCSV: false,
      IsReplicationDoneFilter: null,
      appProdURL: null,

      checkCSVStateInterval: null,

      listHeaders: [
        { text: this.$t("GENERAL.ROW"), value: "ind" },

        { text: 'FileName', value: "FileName" },
        { text: 'وضعیت پاسخگویی', value: "IsReplicationDone" },
        { text: 'کل پاسخ ها/بله/خیر', value: "TotalAnswers" },
        { text: 'تعداد جواب مورد نیاز', value: "RequiredReplication" },
        { text: 'نتیجه نهایی || درصد', value: "OverAllResult" },

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
    handleFilterIsReplicationDone(event) {
      this.IsReplicationDoneFilter = event;
      this.refreshList();
    },
    async getState(csv) {
      if(csv) {
        this.isCheckingCSVState = true;
      } else {
        this.isCheckingState = true;
      }
      const data = {
        optionKey: (csv ? "datasetsCSVGenerationData" : "datasetsResultCalculationData")
      };
      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/GetState`, data));
        if(result.status < 400) {

          if(csv) {
            if(result.data.state) {
              this.$set(this, 'csvGenerateState', result.data.state[this.currentDataset.Id]);
              if(!this.checkCSVStateInterval
                  && this.csvGenerateState
                  && this.csvGenerateState.started
                  && !this.csvGenerateState.done
                  && !this.csvGenerateState.hasError)
                this.watchCSVState();
            }
          } else {
            if(result.data.state) {
              this.$set(this, 'processState', result.data.state[this.currentDataset.Id]);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {

        setTimeout(() => {
          if(csv)
            this.isCheckingCSVState = false;
          else
            this.isCheckingState = false;
        }, 1000)
      }
    },
    watchCSVState() {
      this.checkCSVStateInterval = setInterval(async () => {
        await this.getState(true);
        if(this.csvGenerateState
            && (this.csvGenerateState.hasError
                || this.csvGenerateState.done)
        ) {
          clearInterval(this.checkCSVStateInterval);
        }
      }, 10000)
    },
    async maybeStartCalculating() {
      if(!this.processState || (this.processState && !this.processState.done && !this.processState.hasError && !this.processState.started)) {
        await this.startCalculatingResults();
        await this.getState();
      }
    },
    async maybeGenerateCSV() {
      if(!this.csvGenerateState
          || (this.csvGenerateState
              && !this.csvGenerateState.done
              && !this.csvGenerateState.hasError
              && !this.csvGenerateState.started)
      ) {
        await this.startGenerateCSV();
      }
    },
    async startCalculatingResults() {
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
    async startGenerateCSV() {
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,
        IsReplicationDone: this.IsReplicationDoneFilter
      };

      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/StartGenerateCSV`, data));
        if(result.status < 400) {
          //TODO: do what ?
        }
      } catch (error) {
        console.log(error);
      } finally {
       await this.getState(true)
      }
    },
    async resetProcessedResults() {
      this.isResetingResults = true;
      const data = {
        DatasetId: this.currentDataset ? this.currentDataset.Id : null,
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
    async resetCSV() {
      clearInterval(this.checkCSVStateInterval)
      console.log(this.checkCSVStateInterval)
      this.isResetingCSV = true;
      const data = {
        DatasetId: this.currentDataset.Id ? this.currentDataset.Id : null,
        CSV: true
      };

      try {
        const result = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/Reset`, data));
        if(result.status < 400) {
          //TODO: do what ?
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isResetingCSV = false;
        await this.getState(true)
      }
    },
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        DatasetId: this.currentDataset ? this.currentDataset.Id : null,
        IsReplicationDone: this.IsReplicationDoneFilter,

        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetsResults/GetAll`, data));
        if(items.status < 400 && items.data.items) {
          this.datasetItems = items.data.items;
          this.datasetItems.forEach(item => {
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
    this.appProdURL = process.env.VUE_APP_API_URL_PROD;
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.$route.query.DatasetId);

    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.DATASETSITEMS")},
      //{ title: `Dataset ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      //{ title: `Items` },
    ]);

    await this.getState();
    await this.getState(true);
    this.refreshList()
  },
  watch: {
    'pagination.currentPage'() {
      this.refreshList();
    },
  }
};
</script>
