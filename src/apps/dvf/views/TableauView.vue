<template>
  <div class="mainView" id="tableauView">
    <div v-if="showTable">
      <div v-if="userLocation" class="ariane_container">
        <div><span>France</span></div>
        <div v-if="userLocation.depName">
          <span>{{ userLocation.depName }} ({{ userLocation.dep }})</span>
        </div>
        <div v-if="!userLocation.depName && selectedDepName">
          <span>{{ selectedDepName }} ({{ selectedDep }})</span>
        </div>
        <div v-if="userLocation.comName">
          <span>{{ userLocation.comName }} ({{ userLocation.com }})</span>
        </div>
        <div v-if="userLocation.sectionName">
          <span>Section {{ userLocation.sectionName }}</span>
        </div>
        <div v-if="userLocation.parcelleName">
          <span>Parcelle {{ userLocation.parcelleName }}</span>
        </div>
      </div>
      <div v-if="showInfo" style="margin:auto; width: 80%;"><b>Informations :</b><br/>
      <p>La direction générale des Finances publiques, qui produit les données DVF, ne dispose pas des mutations des départements du Bas-Rhin, Haut-Rhin, Moselle et Mayotte.</p>
      <p>Pour l'ancienne Alsace-Moselle, les données sont dans le Livre Foncier en raison de l'application du droit local, et ne sont actuellement pas ouvertes.</p>
      </div>
      <div v-if="loading"><img style="margin-left: 20px" src="../../../static/images/loader.gif" width="50" /></div>
      <Table class="fr-pt-0"></Table>
    </div>
    <div v-if="deps && showConfigDep" class="select-dep">
        <div >Veuillez sélectionner un département</div>
        <select
          class="fr-select dgvSelector"
          v-model="selectedDep"
        >
          <option
            v-for="option in Object.entries(deps).map(([key, value]) => key)"
            :key="option"
            :value="option"
          >
            {{ deps[option]["nom"] }}
          </option>
        </select>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import Table from "./Table.vue";
import CenterDeps from "@/apps/dvf/assets/json/centers_deps.json";

export default {
  name: "TableauView",
  components: { Table },
  data() {
    return {
      selectedResource: "",
      csvUrl: "",
      csvUrlFieldValue: "",
      resources: null,
      resource: {
        id: "",
        code: "",
      },
      showTable: false,
      showConfigDep: false,
      deps: null,
      selectedDep: null,
      selectedDepName: null,
      loading: true,
      showInfo: false,
    };
  },
  computed: {
    userLocation: function () {
      return appStore.state.userLocation;
    },
  },
  created() {
    let obj = {}
    for (const [key, value] of Object.entries(CenterDeps)) {
      if (!["57", "67", "68", "976"].includes(key)) {
        obj[key] = CenterDeps[key]
      }
    }
    this.deps = obj
    appStore.commit("emptyTable")
    if (this.$route.query.code && this.$route.query.level) {
      if (
        this.$route.query.code.startsWith('57') ||
        this.$route.query.code.startsWith('67') ||
        this.$route.query.code.startsWith('68') ||
        this.$route.query.code.startsWith('976')
      ) {
        this.loading = false
        this.showInfo = true
        this.showTable = true
      } else {
        let level
        if (this.$route.query.level === "departement") {
          level = "dep"
        }
        if (this.$route.query.level === "commune") {
          level = "com"
        }
        if (this.$route.query.level === "section") {
          level = "section"
        }
        if (this.$route.query.level === "parcelle") {
          level = "parcelle"
        }
        this.getFirstBatchRows(level, this.$route.query.code)
      }

    } else {
      this.showConfigDep = true
    }
  },
  methods: {
    getFirstBatchRows(level, code){
      appStore.commit('setTableLevel', level)
      appStore.commit('setTableCode', code)
      fetch(process.env.VUE_APP_DVF_API + "/dvf?" + level + "=" + code)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          appStore.commit('updateRows', data["data"])
          this.loading = false
        });
        this.showTable = true
        this.showConfigDep = false
    }
  },
  watch: {
    selectedDep (){
      this.selectedDepName = CenterDeps[this.selectedDep]["nom"]
      this.getFirstBatchRows("dep", this.selectedDep)
    }
  },
};
</script>

<style scoped>

.ariane_container {
  width: 100%;
  padding-left: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.ariane_container div {
  display: inline-block;
  font-size: 12px;
  color: #666666;
}

.ariane_container div span {
  text-decoration: underline;
}

.ariane_container div:before {
  content: ">";
  margin: 0 5px 0 5px;
  text-decoration: none;
}

.ariane_container div:first-child:before {
  display: none;
}

.select-dep {
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
}

</style>