<template>
    <div>
        <span v-if="dgvInfos.resource">
            <resource-view></resource-view>
        </span>
    </div>
</template>

<script>
import ResourceView from '@/apps/tabular/ResourceView.vue'
import storeTabular from './store/storeTabular'
import config from '@/config.js'

export default {
    name: 'DatasetView',
    components: {ResourceView},
    store: storeTabular,
    props:{
    },
    computed: {
        dgvInfos () {
          return this.$store.state.dgv_infos
        },
    },
    methods: {
        formHref() {
            return "https://tally.so/r/nr5BML";
        },
        setFiltersFromQueryString (params) {
          Object.keys(params).forEach((item) => {
            this.$store.commit("addFilter", { field: item.split("__")[0], value: params[item], comp: item.split("__")[1] })
          })
        },
        retrieveInfos(did){
          let url_dgv = process.env.VUE_APP_DATAGOUV_URL
          let params_complements = null
          let obj = {}
          let rid = null
          if (this.$route.hash && this.$route.hash.startsWith("#/resources/")){
              let url_complement = this.$route.hash.replace("#/resources/", "").split("?")
              rid = url_complement[0].replace("/", "")
              this.setFiltersFromQueryString(this.$route.query)
          }
          fetch(url_dgv + '/api/1/datasets/' + did)
              .then((response) => {
                  return response.json();
              })
              .then((data) => {
                  if (data.resources.length > 0){
                      obj.dataset_title = data.title
                      obj.resource = null
                      obj.dataset_id = data.id
                      if (data.organization) {
                          obj.organization_id = data.organization.id
                          obj.organization_name = data.organization.name
                      }

                      let obj2 = []
                      data.resources.forEach((res) => {
                          if (res.extras && res.extras['analysis:parsing:finished_at']) {
                            let obj3 = { resource_id: res.id, resource_title: res.title, preview_url: res.preview_url, extras: res.extras }
                            if (res.format) {
                              obj3.format = res.format
                            }
                            obj2.push(obj3)
                            if (res.id == rid){
                                obj.resource = res
                            }
                          }
                      })
                      if (obj.resource) {
                          this.$router.push({ hash: '#/resources/' + obj.resource.id, query: this.$route.query }).catch(
                            err => {
                            if (err.name !== 'NavigationDuplicated') {
                              throw err;
                            }
                          });
                      }
                      obj.other_resources = obj2
                      //this.$store.commit('setDgvInfos', obj)
                      this.$store.dispatch("manageDgvInfos", obj);
                  }
              }
          );
        }
    },
    mounted () {
        let url_dgv = process.env.VUE_APP_DATAGOUV_URL        
        if (this.$route.name == "resources") {
            fetch(url_dgv + '/api/2/datasets/resources/' + this.$route.params.id)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
              window.location.href = "/fr/datasets/" + data["dataset_id"] + "/#/resources/" + this.$route.params.id              
            })
        } else {
          this.retrieveInfos(this.$route.params.id)
        }
    }
}
</script>

<style scoped>
.subheader{
  background-color:#3558A2;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.subheader.excel{
  display: block;
}

.inforessource{
  flex-grow: 99;
}


.sticky-bar {
  z-index: 1;
  padding-top: 0.5rem!important;
  padding-bottom: 0.5rem!important;
}

.fr-text--sm, .fr-btn--sm{
  font-size: 0.8rem!important;
}

.dgvSelector{
  line-height: 0.9rem;
  max-width: 320px;
  font-size: 0.8rem;
  font-weight: 700;
}

.preventExcel{
  margin:1px 0 0 0!important;
}

.preventExcel div{
  background-color: #FBCB04;
  padding-left: 30px;
  color: #1353B5;
}

@media (max-width: 48em){
  .fr-col-auto{
    padding: 0.2rem 0.5rem 0.2rem 0.5rem!important;
  }
}

</style>