<template>
  <v-card color="red lighten-3 ">
    <v-card-title class="text-white">
      Answers Trend
      <v-spacer></v-spacer>
      <v-menu
          ref="dateFromMenu"
          v-model="dateFromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          left
          min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-chip
              label
              v-bind="attrs"
              v-on="on"
              :close="(resultsFrom ? true : false)"
              @click:close="() => {resultsFrom = null; refreshResults()}"
              class="mr-2">From: {{resultsFrom}}</v-chip>
        </template>
        <v-date-picker
            no-title scrollable

            v-model="resultsFrom">
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"

              @click="()=>{dateFromMenu = false; resultsFrom = null; refreshResults()}">
            Cancel
          </v-btn>
          <v-btn
              text
              color="primary"
              @click="()=>{$refs.dateFromMenu.save(resultsFrom); refreshResults()}">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

      <v-menu
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

              :close="(resultsTo ? true : false)"
              @click:close="() => {resultsTo = null; refreshResults()}">To: {{resultsTo}}</v-chip>
        </template>
        <v-date-picker
            no-title scrollable

            v-model="resultsTo">
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="()=>{dateToMenu = false; resultsTo = null; refreshResults()}">
            Cancel
          </v-btn>
          <v-btn
              text
              color="primary"
              @click="()=>{$refs.dateToMenu.save(resultsTo); refreshResults()}">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

    </v-card-title>
    <v-row align="center" justify="center">
      <v-progress-circular
          v-if="loading"
          color="red"
          indeterminate></v-progress-circular>
    </v-row>
    <apexchart
        v-if="showChart && !loading"

        :key="showChart"
        :options="chartOptions"
        :series="series"

        ref="asnwersCountTrend"
        type="area"
        class="card-rounded-bottom"></apexchart>
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
      loading: false,
      showChart: false,
      userActivityDates: [],
      dataCounts: [],
      resultsFrom: null,
      dateFromMenu: false,
      resultsTo: null,
      dateToMenu: false,
      series: [
        {
          name: "",
          data: this.data ? this.data : []
        }
      ],
      chartOptions: {
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
            formatter: function (val) {
              return val + " Answers";
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
  mounted() {
    this.refreshResults();
  },
  methods: {
    async refreshResults(){
      this.loading = true;
      this.generateDates();
      await this.getData();
      setTimeout(()=>{
        this.loading = false
      }, 1000);
    },
    async getData() {
      this.loading = true;
      if (!this.user)
        return;

      let today = this.resultsTo ? new Date(this.resultsTo).toLocaleDateString("en-US") : new Date().toLocaleDateString("en-US");
      let priorDay = this.resultsFrom ? new Date(this.resultsFrom).toLocaleDateString("en-US") : new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString("en-US");

      const data = {
        UserId: this.user.id,
        DataSetId: (this.dataset ? this.dataset.id : null),
        From: priorDay,
        To: today,
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

      if(this.resultsTo && this.resultsFrom) {
        let tmpFrom = new Date(this.resultsFrom).getTime()
            , tmpTo = new Date(this.resultsTo).getTime();

        totalDays = (tmpTo - tmpFrom) / (1000 * 3600 * 24);
        lastDay = new Date(this.resultsTo);
      } else if(this.resultsTo) {
        lastDay = new Date(this.resultsTo);
      } else if(this.resultsFrom) {
        lastDay = new Date(new Date(this.resultsFrom).getTime() + (30 * 1000 * 3600 * 24));
      }

      for (let i = totalDays; i >= 1; i--) {
        const tmpDay = new Date(new Date().setDate(lastDay.getDate() - i));
        this.userActivityDates.push(tmpDay.toLocaleDateString("en-US"))
      }
      this.chartOptions.xaxis.categories = this.userActivityDates
    },
    extractApiData(apiData) {
      this.dataCounts = [];

      this.userActivityDates.forEach((item, index) => {
        let hasAdi = false;

        apiData.forEach(adi => {
          if (new Date(adi.date).toLocaleDateString('en-US') == item) {
            this.dataCounts.push(adi.count);
            hasAdi = true;
          }
          this.$set(this.userActivityDates, index, new Date(item).toLocaleDateString('fa-IR'));
        })
        if (!hasAdi) {
          this.dataCounts.push(0);
        }
      });
      this.series[0].data = this.dataCounts;
    },
  },
  watch: {
    chartOptions: {
      handler() {
        this.showChart = false;
        this.$nextTick(()=>{
          this.showChart = true;
        })
      },
      deep: true
    },
    series: {
      handler() {
        this.showChart = false;
        this.$nextTick(()=>{
          this.showChart = true;
        })
      },
      deep: true
    },
    resultsFrom(val){
      if(val && this.resultsTo && new Date(val).getTime() > new Date(this.resultsTo)) {
        this.resultsFrom = null;
        this.$bvToast.toast("From can not be greater than To", {
          title: `Error`,
          variant: 'danger',
          solid: true
        })
      }
    },
    resultsTo(val){
      if(val && this.resultsTo && new Date(val).getTime() < new Date(this.resultsTo)) {
        this.resultsTo = null;
        this.$bvToast.toast("To can not be less than From", {
          title: `Error`,
          variant: 'danger',
          solid: true
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
