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
      <div class="col-md-8 ">
        <v-card style="background-color: #f8bbd0">
          <v-card-title>Daily clicks</v-card-title>
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
      <div class="col-md-6 mt-6">
        <v-card style="background-color: #fff8e1">
          <v-card-title>Daily Processed Dataset Items</v-card-title>
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
// import AdvancedTableWidget2 from "@/view/content/widgets/advance-table/Widget2.vue";
// import MixedWidget1 from "@/view/content/widgets/mixed/Widget1.vue";
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
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Statistics" }]);

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
  },
  methods: {
    setActiveTab1(event) {
      this.tabIndex = this.setActiveTab(event);
    },
    setActiveTab2(event) {
      this.tabIndex2 = this.setActiveTab(event);
    },
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    }
  }
};
</script>
