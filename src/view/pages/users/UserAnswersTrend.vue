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

              class="mr-2">From: {{ resultsFrom ? new Date(resultsFrom).toLocaleDateString('en-US') : '' }}</v-chip>
<!--
:close="(resultsFrom ? true : false)"
              @click:close="() => {resultsFrom = null; refreshResults()}"
                  -->
        </template>
        <v-date-picker
            no-title scrollable

            v-model="resultsFrom">
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"

              @click="()=>{dateFromMenu = false; refreshResults()}">
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

          >To: {{ resultsTo ? new Date(resultsTo).toLocaleDateString('en-US') : '' }}</v-chip>
<!--
      :close="(resultsTo ? true : false)"
              @click:close="() => {resultsTo = null; refreshResults()}"
     -->
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
      </v-menu>

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
          class="card-rounded-bottom"></apexchart>
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
      let lastDay = new Date();

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
        this.$set(this.userActivityDates, index, new Date(item).toLocaleDateString('en-US'));

      });
      this.chartOptions.series[0].data = this.dataCounts;
      this.chartKey++;
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
    }
  }
}
</script>
