<template>
  <div class="barChart">
    <canvas v-show="displayChart == true" id="barchart"></canvas>
    <div v-show="displayChart == false">
      <span
        >Il n'y a pas suffisamment de ventes sur cette sélection pour que nous
        puissions faire un graphique pertinent.</span
      >
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import { Chart } from "chart.js";

export default {
  name: "BarChart",
  components: {},
  data() {
    return {
      barData: {},
      values: [],
      labels: [],
      fullLabels: {},
      chart: undefined,
      displayChart: true,
    };
  },
  computed: {
    apiLevel: function () {
      return appStore.state.apiLevel;
    },
    apiCode: function () {
      return appStore.state.apiCode;
    },
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
  },
  mounted() {
    this.updateData("nation");
  },
  methods: {
    updateData(code) {
      var self = this;
      if (code) {
        fetch(process.env.VUE_APP_DVF_API + "/distribution/" + code)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.barData = data;
            this.updateValues();
          })
          .catch(function (error) {
            self.barData = {};
            self.updateValues();
          });
      }
    },
    updateValues() {
      var self = this;
      this.labels = [];
      this.values = [];
      this.fullLabels = {};

      var filter = "";

      switch (this.activeFilter) {
        case "tous":
          filter = "apt_maison";
          break;
        case "maison":
          filter = "maison";
          break;
        case "appartement":
          filter = "appartement";
          break;
        case "local":
          filter = "local";
          break;
      }

      if (Object.keys(this.barData).length === 0) {
        this.displayChart = false;
      }

      var filteredData = this.barData[filter];
      if (filteredData && filteredData["xaxis"]) {
        filteredData["xaxis"].forEach(function (d) {
          self.labels.push(d[0]);
          self.fullLabels[d[0]] = [d[0], d[1]];
        });
        filteredData["yaxis"].forEach(function (d) {
          self.values.push(d);
        });
        this.displayChart = true;
      } else {
        this.displayChart = false;
      }

      if (this.chart) {
        this.chart.destroy();
        this.buildChart();
      } else {
        this.buildChart();
      }
    },
    buildChart() {
      var self = this;
      if (document.getElementById("barchart")) {
        const ctx = document.getElementById("barchart").getContext("2d");
        Chart.defaults.font.family = "Marianne";
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: this.labels,
            datasets: [
              {
                data: this.values,
                borderWidth: 0,
                backgroundColor: "#B6CFFB",
                barPercentage: 1.15,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "rgba(74, 157, 247, 1)",
                bodyColor: "rgba(255, 255, 255, 1)",
                displayColors: false,
                callbacks: {
                  label: function (tooltipItems) {
                    return tooltipItems.formattedValue + " ventes";
                  },
                  title: function (tooltipItems) {
                    var tab = [];
                    for (var label in self.fullLabels) {
                      tab.push(label);
                    }
                    var pos = tab.indexOf(
                      self.fullLabels[tooltipItems[0]["label"]][0].toString()
                    );
                    var bornesLabel;
                    if (pos === tab.length - 1) {
                      bornesLabel =
                        "plus de " +
                        self.fullLabels[tooltipItems[0]["label"]][0] +
                        "€";
                    } else {
                      bornesLabel =
                        "entre " +
                        self.fullLabels[tooltipItems[0]["label"]][0] +
                        "€ et " +
                        self.fullLabels[tooltipItems[0]["label"]][1] +
                        "€";
                    }
                    return bornesLabel;
                  },
                },
              },
            },
            animation: {
              easing: "easeInOutBack",
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  callback: function (value, index, ticks) {
                    if (index == 0 || index == self.labels.length - 1) {
                      return self.labels[index] + "€";
                    }
                  },
                },
              },
              y: {
                beginAtZero: false,
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  callback: function (value, index, ticks) {
                    return "";
                  },
                },
              },
            },
          },
        });
      }
    },
  },
  watch: {
    apiCode() {
      this.updateData(this.apiCode);
    },
    activeFilter() {
      this.updateValues();
    },
  },
};
</script>

<style scoped>
.barChart {
  width: 100%;
  height: 120px;
  margin-top: 20px;
}

.barChart canvas {
  width: 100%;
  max-height: 120px;
}

.barChart div {
  font-size: 12px;
  font-weight: 400;
  background-color: #f6f6f6;
  padding: 5px;
  line-height: 20px !important;
}
</style>