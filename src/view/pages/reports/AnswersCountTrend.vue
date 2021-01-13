<template>
  <div>
    <!--begin::Dashboard-->
    <v-row>
      <v-col cols="12" class="px-6">
        <v-chip
            close

            @click="$router.push('/users?showAnswerCountTrend=true')"
            @click:close="removeQueryItem('userId')">User: {{userId ? userId : 'All'}}</v-chip>
        <v-chip
            close

            @click="$router.push('/dataset/list')"
            @click:close="removeQueryItem('datasetId')">Dataset: {{datasetId ? datasetId : 'All'}}</v-chip>
      </v-col>
    </v-row>
    <div class="row">
      <div class="col-12 ">
        <v-card style="background-color: #cfd8dc">
          <v-card-title>30 Days answers counts trend for user: {{userId}}</v-card-title>
          <v-card-text v-if="showChart && userId" class="px-0 py-0">
            <apexchart
                :options="chartOptions"
                :series="series"

                type="area"
                class="card-rounded-bottom"></apexchart>
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
export default {
  name: "statistics",
  data(){
    return {
      chartOptions: {},
      dates: [],//labels
      series: [
        {
          name: "Net Profit",
          data: []//[20, 22, 30, 28, 25, 26, 30, 28, 22, 24, 25, 35]
        }
      ],
      showChart: false
    }
  },
  components: {
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

    this.generateDates()
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
            this.$nextTick(()=>{
              this.setupChartOptions();
            })
          })
        }

        /*if(transactions.data && transactions.data.result) {

          this.transactions = transactions.data.result.items;
        }*/
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    removeQueryItem(item) {
      if (item == 'userId')
        this.$store.commit(`answerCountTrend/${SET_USER_ID}`, null);
      if (item == 'datasetId')
        this.$store.commit(`answerCountTrend/${SET_DATASET_ID}`, null);

      //this.refreshList()
    },
    generateDates() {
      for(let i=1; i <= 30; i++) {
        const tmpDay = new Date(new Date().setDate(new Date().getDate() - i));

        this.dates.push(tmpDay.toLocaleDateString("en-US"))
      }
    },
    extractApiData(apiData) {
      this.series.data = [];
      this.dates.forEach(item => {
        let hasAdi = false
        apiData.forEach(adi => {
          if(new Date(adi.date).toLocaleDateString('en-US') == item) {
            this.series.data.push(adi.count);
            hasAdi = true;
          }
        })
        if(!hasAdi) {
          this.series.data.push(0);
        }
      })
    },
    setupChartOptions() {
      this.chartOptions = {
        chart: {
          type: "area",
          height: 125,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {},
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: "gradient",
          opacity: 1,
          gradient: {
            type: "vertical",
            shadeIntensity: 0.55,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.2,
            stops: [25, 50, 100],
            colorStops: []
          }
        },
        stroke: {
          curve: "smooth",
          show: true,
          width: 3,
          colors: [this.strokeColor]
        },
        xaxis: {
          categories: ["11", "22", "33"],//this.dates,//["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            style: {
              colors: this.layoutConfig("colors.gray.gray-500"),
              fontSize: "12px",
              fontFamily: this.layoutConfig("font-family")
            }
          },
          crosshairs: {
            show: false,
            position: "front",
            stroke: {
              color: this.layoutConfig("colors.gray.gray-300"),
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
              fontFamily: this.layoutConfig("font-family")
            }
          }
        },
        yaxis: {
          show: false,
          min: 0,
          max: 37,
          labels: {
            show: false,
            style: {
              colors: this.layoutConfig("colors.gray.gray-500"),
              fontSize: "12px",
              fontFamily: this.layoutConfig("font-family")
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
            fontFamily: this.layoutConfig("font-family")
          },
          y: {
            formatter: function(val) {
              return "$" + val + " thousands";
            }
          },
          marker: {
            show: false
          }
        },
        colors: [this.layoutConfig("colors.theme.light.danger")],
        markers: {
          colors: [this.layoutConfig("colors.theme.light.danger")],
          strokeColor: [this.strokeColor],
          strokeWidth: 3
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        }
      };
      this.showChart = true;
      console.log(this.dates, this.series.data);
    }
  },
};
</script>
