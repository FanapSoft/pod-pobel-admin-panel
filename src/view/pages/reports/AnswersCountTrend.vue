<template>
  <div>
    <!--begin::Dashboard-->
    <div class="row">
      <div class="col-md-4 ">
        <v-card style="background-color: #cfd8dc">
          <v-card-title>Daily New Users</v-card-title>
          <v-card-text class="px-0 py-0">
            <apexchart
                class="card-rounded-bottom"
                :options="chartOptions"
                :series="series"
                type="area"
            ></apexchart>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!--end::Dashboard-->
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { mapGetters } from "vuex";
export default {
  name: "statistics",
  data(){
    return {
      chartOptions: {},
      series: [
        {
          name: "Net Profit",
          data: [20, 22, 30, 28, 25, 26, 30, 28, 22, 24, 25, 35]
        }
      ],
    }
  },
  components: {
    // AdvancedTableWidget2,
    // MixedWidget1
  },
  computed: {
    ...mapGetters(["layoutConfig"])
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "AnswerCountTrend" }]);

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
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
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

    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const today = new Date();
      const priorDay = new Date(new Date().setDate(today.getMonth()-12))

      const data = {
        UserId: 18,
        From: priorDay.toLocaleDateString("en-US"),
        To: today.toLocaleDateString("en-US"),
        DataSetId: null,
      };

      try {
        const transactions = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Reports/AnswersCountsTrend`, data));
        console.log(transactions)
        /*if(transactions.data && transactions.data.result) {

          this.transactions = transactions.data.result.items;
        }*/
      } catch (error) {
        console.log(error);
      }
      this.loading = false;

    },
  },
};
</script>
