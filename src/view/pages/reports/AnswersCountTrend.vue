<template>
  <div>
    <!--begin::Dashboard-->
    <v-row>
      <v-col cols="12" class="px-3">
        <v-chip
            close label

            @click="$router.push('/users/list?showAnswerCountTrend=true')"
            @click:close="removeQueryItem('userId')">{{ $t("USER.USER")}}: {{userId ? userId : $t("USER.CHOOSEAUSER")}}</v-chip>
        <v-chip
            v-if="userId"

            close label

            @click="$router.push('/dataset/list')"
            @click:close="removeQueryItem('datasetId')"

            class="mx-1">{{ $t("DATASET.DATASET")}}: {{datasetId  && currentDataset ? currentDataset.name : ''}}</v-chip>
      </v-col>
    </v-row>
    <v-container class="my-5 px-0" >
        <v-card style="background-color: #cfd8dc">
          <v-card-title>
            {{ $t("GENERAL.ANSWERSCOUNTSTRENDFORUSER") }} {{userId}}
            <v-spacer></v-spacer>
            <v-chip
                v-if="userId"

                label

                @click="dateFromMenu = true"

                class="mr-2">{{ $t("GENERAL.FROM") }}: {{ displayResultsFrom }}</v-chip>
            <jalali-date-picker
                v-if="userId"

                clearable

                v-model="resultsFrom"
                :placeholder="$t('GENERAL.FROM')"
                :locale="$langIsFa? 'fa,en': 'en,fa'"
                :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD',
                        lang: { label: 'شمسی' }
                      },
                      en: {
                        displayFormat: 'YYYY/MM/DD',
                        lang: { label: 'Gregorian' }
                      }
                    }"
                :editable="true"
                :class="{'ltr-picker': !$langIsFa}"
                :show="dateFromMenu"
                @close="dateFromMenu=false"
                @input="checkDateFromValue"

                format="YYYY/MM/DD"
                element="my-custom-editable-input" >
            </jalali-date-picker>

            <v-chip
                v-if="userId"

                label

                @click="dateToMenu = true"

                class="mr-2">{{ $t("GENERAL.TO") }}: {{ displayResultsTo }}</v-chip>
            <jalali-date-picker
                v-if="userId"

                clearable

                v-model="resultsTo"
                :placeholder="$t('GENERAL.TO')"
                :locale="$langIsFa? 'fa,en': 'en,fa'"
                :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD',
                        lang: { label: 'شمسی' }
                      },
                      en: {
                        displayFormat: 'YYYY/MM/DD',
                        lang: { label: 'Gregorian' }
                      }
                    }"
                :editable="true"
                :class="{'ltr-picker': !$langIsFa}"
                :show="dateToMenu"
                @close="dateToMenu=false"
                @input="checkDateToValue"

                format="YYYY/MM/DD"
                element="my-custom-editable-input1" >
            </jalali-date-picker>
<!--            <v-menu
                v-if="userId"

                ref="dateToMenu"
                v-model="dateToMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                left
                min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                    label

                    v-bind="attrs"
                    v-on="on"

                >To: {{ resultsTo ? new Date(resultsTo).toLocaleDateString('en-US') : '' }}</v-chip>
                &lt;!&ndash;
                      :close="(resultsTo ? true : false)"
                              @click:close="() => {resultsTo = null; refreshResults()}"
                     &ndash;&gt;
              </template>
              <v-date-picker
                  no-title scrollable

                  v-model="resultsTo">
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="()=>{dateToMenu = false; refreshResults()}">
                  Cancel
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="()=>{$refs.dateToMenu.save(resultsTo); refreshResults()}">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>-->

          </v-card-title>
          <v-card-text
              v-if="userId"
              class="px-0 py-0"
              style="direction: ltr; ">
            <chart
                v-if="dataCounts && !loading"

                :data="dataCounts"
                :categories="displayDates"></chart>
          </v-card-text>
        </v-card>
    </v-container>
    <!--end::Dashboard-->
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { SET_DATASET_ID, SET_USER_ID } from "@/core/services/store/answerCountTrend.module";
import { mapGetters } from "vuex";
import Chart from "./Chart";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";

export default {
  name: "AnswersCountTrend",
  data(){
    return {
      dates: [],
      displayDates: [],
      dataCounts: [],
      resultsFrom: null,
      dateFromMenu: false,
      resultsTo: null,
      dateToMenu: false,
      loading: false,
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
      userId: "answerCountTrend/userId",
      currentDataset: `datasets/currentDataset`
    }),
    displayResultsFrom() {
      if(this.resultsFrom && this.$langIsFa) {
        return new Date(this.resultsFrom).toLocaleDateString('fa-IR')
      } if(this.resultsFrom && !this.$langIsFa) {
        return new Date(this.resultsFrom).toLocaleDateString('en-US')
      } else {
        return  ''
      }
    },
    displayResultsTo() {
      if(this.resultsTo && this.$langIsFa) {
        return new Date(this.resultsTo).toLocaleDateString('fa-IR')
      } else if(this.resultsTo && !this.$langIsFa) {
        return new Date(this.resultsTo).toLocaleDateString('en-US')
      } else {
        return  ''
      }
    },
  },
  async mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t("BREADCRUMBS.REPORTS"), route: '/reports/list' },
        { title: this.$t("REPORTS.ANSWERSTREND") }
    ]);

    if(this.$route.query.UserId) {
      this.$store.commit(`answerCountTrend/${SET_USER_ID}`, this.$route.query.UserId);
    }

    if(this.$route.query.DatasetId) {
      this.$store.commit(`answerCountTrend/${SET_DATASET_ID}`, this.$route.query.DatasetId);
    }

    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.datasetId);
    this.generateInitDates();
    this.refreshResults();
  },
  methods: {
    async refreshResults() {
      this.loading = true;

      try {
        await this.getData();

      } catch (error) {
        console.log("error:", error)
      }
      setTimeout(()=>{
        this.loading = false;
      }, 100);
    },
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
        if(res.data.result && res.data.result.length) {
          this.$nextTick(() => {
            this.extractApiData(res.data.result);
          })
        }
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

    },
    generateDates() {
      this.dates = [];
      this.displayDates = [];
      let totalDays = 30;
      let lastDay = new Date();

      let tmpFrom = new Date(this.resultsFrom).getTime()
          , tmpTo = new Date(this.resultsTo).getTime();

      totalDays = (tmpTo - tmpFrom) / (1000 * 3600 * 24);
      lastDay = new Date(this.resultsTo);
      let lang = this.$langIsFa ? "fa-IR" : "en-US";

      for (let i = totalDays; i >= 1; i--) {
        const tmpDay = new Date(lastDay.getTime() - (i * 1000 * 3600 * 24));
        this.dates.push(tmpDay.toLocaleDateString("en-US"));
        this.displayDates.push(tmpDay.toLocaleDateString(lang));
      }

      //this.chartOptions.xaxis.categories = this.dates;
      //this.chartKey++;
    },
    generateInitDates() {
      this.dates = [];
      this.displayDates = [];
      let totalDays = 30;
      let lastDay = new Date(new Date().getTime() + (3600 * 24 * 1000));

      this.resultsTo = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)}-${lastDay.getDate()}`;
      let tmpFrom = new Date(lastDay.getTime() - (totalDays * 1000 * 3600 * 24));
      this.resultsFrom = `${tmpFrom.getFullYear()}-${tmpFrom.getMonth() + 1}-${tmpFrom.getDate()}`;
      //this.chartOptions.xaxis.categories = this.dates;
      //this.chartKey++;
      let lang = this.$langIsFa ? "fa-IR" : "en-US";

      for (let i = totalDays; i >= 1; i--) {
        const tmpDay = new Date(lastDay.getTime() - (i * 1000 * 3600 * 24));
        this.dates.push(tmpDay.toLocaleDateString("en-US"));
        this.displayDates.push(tmpDay.toLocaleDateString(lang));

      }
    },
    extractApiData(apiData) {
      this.dataCounts = [];
      let lang = this.$langIsFa ? "fa-IR" : "en-US";
      this.dates.forEach((item, index) => {
        let hasAdi = false
        apiData.forEach(adi => {
          if(new Date(adi.date).toLocaleDateString('en-US') == item) {
            this.dataCounts.push(adi.count);
            hasAdi = true;
          }
          this.$set(this.dates, index, new Date(item).toLocaleDateString('en-US'));
          this.$set(this.displayDates, index, new Date(item).toLocaleDateString(lang));
        })
        if(!hasAdi) {
          this.dataCounts.push(0);
        }
      })
    },
    checkDateFromValue(val) {
      if(!val) {
        this.resultsFrom = null
      }
      this.refreshResults()
    },
    checkDateToValue(val) {
      if(!val) {
        this.resultsTo = null
      }
      this.refreshResults()
    },
  },
  watch: {
    resultsFrom(val) {
      if(this.resultsTo && new Date(val).getTime() > new Date(this.resultsTo)) {
        let tmpFrom = new Date(new Date(this.resultsTo).getTime() - (30 * 1000 * 3600 * 24));
        this.resultsFrom = `${tmpFrom.getFullYear()}-${tmpFrom.getMonth() + 1}-${tmpFrom.getDate()}`;
        this.$bvToast.toast("From can not be greater than To", {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.generateDates();
    },
    resultsTo(val) {
      if(this.resultsFrom && new Date(val).getTime() < new Date(this.resultsFrom)) {
        let tmpTo = new Date(new Date(this.resultsTo).getTime() + (30 * 1000 * 3600 * 24));
        this.$nextTick(()=>{
          this.$set(this, "resultsTo", `${tmpTo.getFullYear()}-${tmpTo.getMonth() + 1}-${tmpTo.getDate()}`)

        })
        this.$bvToast.toast("To can not be less than From", {
          title: `Error`,
          variant: 'danger',
          solid: true
        })
      }
      this.generateDates();
    },
  }
};
</script>
