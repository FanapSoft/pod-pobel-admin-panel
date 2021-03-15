<template>
  <v-card color="red lighten-3 ">
    <v-card-title class="">
      <span class="text-white">{{ $t("REPORTS.ANSWERSTREND") }}</span>
      <v-spacer></v-spacer>
      <v-chip
          v-if="user"

          label

          @click="dateFromMenu = true"

          class="mr-2">{{ $t("GENERAL.FROM") }}: {{ displayResultsFrom }}</v-chip>
      <jalali-date-picker
          v-if="user"

          clearable

          v-model="resultsFrom"
          :placeholder="$t('GENERAL.FROM')"
          :locale="$langIsFa ? 'fa,en': 'en,fa'"
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
          :class="{'ltr-picker': $langIsFa != 'fa'}"
          :show="dateFromMenu"
          @close="dateFromMenu=false"
          @input="checkDateFromValue"

          format="YYYY/MM/DD"
          element="my-custom-editable-input" >
      </jalali-date-picker>

      <v-chip
          v-if="user"

          label

          @click="dateToMenu = true"

          class="mr-2">{{ $t("GENERAL.TO") }}: {{ displayResultsTo }}</v-chip>
      <jalali-date-picker
          v-if="user"

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
          :class="{'ltr-picker': $langIsFa}"
          :show="dateToMenu"
          @close="dateToMenu=false"
          @input="checkDateToValue"

          format="YYYY/MM/DD"
          element="my-custom-editable-input1" >
      </jalali-date-picker>


    </v-card-title>
    <v-row align="center" justify="center">
      <v-progress-circular
          v-if="loading"
          color="red"
          indeterminate></v-progress-circular>
    </v-row>
    <template
        v-if="!loading && chartOptions ">
      <apexchart
          :key="chartKey"
          :options="chartOptions"
          :series="chartOptions.series"

          type="area"
          class="card-rounded-bottom" style="direction: ltr"></apexchart>
    </template>

  </v-card>
</template>

<script>
export default {
  name: "userAnswersTrend",
  props: {
    user: null,
    dataset: null
  },
  data() {
    return {
      chartKey: 0,
      loading: false,
      userActivityDates: [],
      dataCounts: [],
      resultsFrom: null,
      dateFromMenu: false,
      resultsTo: null,
      dateToMenu: false,

      chartOptions: {
        series: [
          {
            name: "",
            data: []
          }
        ],
        chart: {
          type: "area",
          height: 125,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
        },
        plotOptions: {},
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          colors: ['#F64E60'],
          type: "gradient",
          opacity: .5,

          gradient: {
            type: "vertical",
            gradientToColors: [ '#EF9A9A'],
            shade: 'dark',
            inverseColors: false,
            colorStops: [],
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        stroke: {
          curve: "smooth",
          show: true,
          width: 3,
          colors: ["#F64E60"]//this.strokeColor]
        },
        xaxis: {
          show: false,
          categories: this.categories ? this.categories : [],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            style: {
              colors: '#fff',
              fontSize: "12px",
            }
          },
          crosshairs: {
            show: false,
            position: "front",
            stroke: {
              width: 1,
              dashArray: 3
            }
          },
          tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
              fontSize: "12px",
            }
          }
        },
        yaxis: {
          show: false,
          min: 0,
          labels: {
            show: true,
            style: {
              fontSize: "12px",
            }
          }
        },
        states: {
          normal: {
            filter: {
              type: "none",
              value: 0
            }
          },
          hover: {
            filter: {
              type: "none",
              value: 0
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: "none",
              value: 0
            }
          }
        },
        tooltip: {
          style: {
            fontSize: "12px",
          },
          y: {
            formatter: (val) => {
              return `${val} ${this.$t("GENERAL.ANSWER")}`;
            }
          },
          marker: {
            show: false
          }
        },
        colors: ['#F64E60'],
        markers: {
          strokeColor: ['#F64E60'],
          strokeWidth: 3
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        }
      }
    }
  },
  computed: {
    displayResultsFrom() {
      let lang = this.$langIsFa ? 'fa-IR' : 'en-US';
      return this.resultsFrom ?  new Date(this.resultsFrom).toLocaleDateString(lang) : '';
    },
    displayResultsTo() {
      let lang = this.$langIsFa ? 'fa-IR' : 'en-US';
      return this.resultsTo ?  new Date(this.resultsTo).toLocaleDateString(lang) : '';
    },
  },
  mounted() {
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
      if (!this.user)
        return;

      let startDate = new Date(this.resultsFrom).toLocaleDateString('en-Us');
      let endDate = new Date(this.resultsTo).toLocaleDateString('en-Us');

      const data = {
        UserId: this.user.id,
        DataSetId: (this.dataset ? this.dataset.id : null),
        From: startDate,
        To: endDate,
      };

      try {
        const res = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Reports/AnswersCountsTrend`, data));
        if (res.data.result ) {
          this.$nextTick(() => {
            this.extractApiData(res.data.result);
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    generateDates() {
      this.userActivityDates = [];
      let totalDays = 30;
      let lastDay = new Date();

      let tmpFrom = new Date(this.resultsFrom).getTime()
          , tmpTo = new Date(this.resultsTo).getTime();

      totalDays = (tmpTo - tmpFrom) / (1000 * 3600 * 24);
      lastDay = new Date(this.resultsTo);

      for (let i = totalDays; i >= 1; i--) {
        const tmpDay = new Date(lastDay.getTime() - (i * 1000 * 3600 * 24));
        this.userActivityDates.push(tmpDay.toLocaleDateString("en-US"));
      }

      this.chartOptions.xaxis.categories = this.userActivityDates;
      //this.chartKey++;
    },
    generateInitDates() {
      this.userActivityDates = [];
      let totalDays = 30;
      let lastDay = new Date(new Date().getTime() + (3600 * 24 * 1000));

      this.resultsTo = `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)}-${lastDay.getDate()}`;
      let tmpFrom = new Date(lastDay.getTime() - (totalDays * 1000 * 3600 * 24));
      this.resultsFrom = `${tmpFrom.getFullYear()}-${tmpFrom.getMonth() + 1}-${tmpFrom.getDate()}`;
      this.chartOptions.xaxis.categories = this.userActivityDates;
      //this.chartKey++;
      for (let i = totalDays; i >= 1; i--) {
        const tmpDay = new Date(lastDay.getTime() - (i * 1000 * 3600 * 24));
        this.userActivityDates.push(tmpDay.toLocaleDateString("en-US"))
      }
    },
    extractApiData(apiData) {
      this.dataCounts = [];
      let lang = this.$langIsFa ? "fa-IR" : "en-US";

      this.userActivityDates.forEach((item, index) => {
        let hasAdi = false;

        apiData.forEach(adi => {
          if (new Date(adi.date).toLocaleDateString('en-US') == item) {
            this.dataCounts.push(adi.count);
            hasAdi = true;
          }
        });
        if (!hasAdi) {
          this.dataCounts.push(0);
        }
        this.$set(this.userActivityDates, index, new Date(item).toLocaleDateString(lang));

      });
      this.chartOptions.series[0].data = this.dataCounts;
      this.chartKey++;
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
    user(){
      this.generateInitDates();
      this.refreshResults();
    }
  }
}
</script>
