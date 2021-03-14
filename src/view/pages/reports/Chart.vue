<template>
  <apexchart
      :options="chartOptions"
      :series="series"

      ref="asnwersCountTrend"
      type="area"
      class="card-rounded-bottom"></apexchart>
</template>

<script>
export default {
  name: "Chart",
  props: {
    categories: null,
    data: null
  },
  data() {
    return {
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
          categories: this.categories? this.categories : [],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            style: {
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
          show: true,
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
              return `<span class="d-inline-block">${val}</span> <span class="d-inline-block">${this.$t('GENERAL.ANSWER')}</span>`;
            }
          },
          marker: {
            show: false
          }
        },
        markers: {
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
      }
    }
  },
  mounted() {
  },

}
</script>

<style scoped>

</style>
