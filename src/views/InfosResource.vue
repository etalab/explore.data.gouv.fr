<template>
  <div class="subheader" :class="(generalInfos.filetype && generalInfos.filetype === 'excel')?'excel':''">
    <infos-dgv></infos-dgv>
    <div class="inforessource">
      <div v-if="generalInfos.filetype && generalInfos.filetype === 'excel'" class="fr-grid-row fr-grid-row--gutters preventExcel">
        <div class="fr-col-12 fr-col-md-12 fr-col-xl-12">
          Attention, vous avez sélectionné un fichier Excel, les fonctionnalités d'analyses sur ce type de fichiers sont limitées.
        </div>
      </div>
      <div v-if="dgvInfos.resource" class="fr-container--fluid fr-p-2w sticky-bar">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-9 fr-col-xl-9">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
              <div class="fr-col-auto">
                <select class="fr-select dgvSelector" v-model="selectedResource" @change="redirectToResource">
                  <option :key="dgvInfos.resource.id" :value="dgvInfos.resource.id">
                    {{ dgvInfos.resource.title || 'Ressource sans nom' }}
                  </option>
                  <option
                    v-for="option in dgvInfos.other_resources"
                    :key="option.resource_id"
                    :value="option.resource_id"
                    :disabled="!option.preview_url"
                  >
                    {{ option.resource_title || 'Ressource sans nom' }}
                  </option>
                </select>
              </div>
              <div class="fr-col-auto fr-text--sm fr-m-0 text-mention-grey">
                <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                  <div class="fr-col-auto">Mis à jour le {{ toFrDate(dgvInfos.resource.last_modified) }}</div>
                  <div class="fr-col-auto">
                    <template v-if="dgvInfos.resource.format">{{ dgvInfos.resource.format }} </template>
                    <template v-if="dgvInfos.resource.filesize">({{ bytesToSize(dgvInfos.resource.filesize) }})</template>
                  </div>
                  <!-- <div class="fr-col-auto">{{ dgvInfos.resource.metrics.views ? dgvInfos.resource.metrics.views : 0 }} téléchargement<template v-if="dgvInfos.resource.metrics.views > 1">s</template></div> -->
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3 fr-col-xl-3" style="width: 100%">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle" style="width: 100%">
              <div class="fr-col-auto" style="width: 100%">
                <button
                  :disabled="doesntHaveFilter"
                  class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-filter-line"
                  data-fr-opened="false"
                  aria-controls="fr-modal-filters"
                  style="float: right;white-space: nowrap;min-width: 180px;"
                >
                  Configurer les filtres <span v-if="hasActivefilters" class="fr-ml-1w fr-badge fr-badge--blue-cumulus">{{countActiveFilters}}</span>
                </button>
              </div>
              <!-- <div class="fr-col-12 fr-col-sm">
                <div class="fr-input-wrap fr-input-wrap--icon-left fr-icon-search-line" :class="globalSearchWrapClass">
                  <input class="fr-input" type="search" :class="globalSearchClass" v-model="globalSearch" placeholder="Rechercher" />
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <dialog aria-labelledby="fr-modal-title-modal-filters" role="dialog" id="fr-modal-filters" class="fr-modal fr-modal--popover">
          <div class="fr-container--fluid">
              <div class="fr-grid-row fr-grid-row--right">
                  <div class="fr-col-12 fr-col-sm-7 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
                      <div class="fr-modal__body">
                          <div class="fr-modal__header">
                              <button class="fr-link--close fr-link" title="Fermer la fenêtre modale" aria-controls="fr-modal-filters">Fermer</button>
                          </div>
                          <div class="fr-modal__content">
                              <h1 id="fr-modal-title-modal-filters" class="fr-modal__title">Configurer les filtres</h1>
                              <div 
                                v-for="filter in filters"
                                :key="filter.field+filter.comp"
                              >
                                <div
                                  v-if="filterNotDuplucate(filter)"
                                  class="fr-py-2w relative"
                                >
                                  <Input
                                    
                                    :field="getField(filter.field)"
                                    showLabel
                                  />
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </dialog>
      </div>
    </div>
  </div>
</template>


<script>
import {getResourceUrl} from '../config'
import Input from '../components/Input.vue'
import InfosDgv from '@/views/InfosDgv'
export default {
  name: 'DgvInfos',
  components: { Input, InfosDgv },
  data() {
    return {
      globalSearch: '',
      selectedResource: null,
    }
  },
  computed: {
    countActiveFilters() {
      return this.filters.length
    },
    dgvInfos() {
      return this.$store.state.dgv_infos
    },
    generalInfos() {
      return this.$store.state.generalInfos
    },
    fields() {
      return this.$store.getters.fields
    },
    filters() {
      return this.$store.state.filters
    },
    hasActivefilters() {
      return this.countActiveFilters > 0
    },
    doesntHaveFilter() {
      return !this.hasActivefilters;
    },
    globalSearchClass() {
      return this.globalSearch ? 'fr-input--filled' : 'fr-input--empty'
    },
    globalSearchWrapClass() {
      return this.globalSearch ? 'fr-input-wrap--filled' : 'fr-input-wrap--empty'
    }
  },
  methods: {
    toFrDate(date) {
      return date.substr(8, 2) + "/" + date.substr(5, 2) + "/" + date.substr(0, 4)
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    getField(key) {
      return this.fields.find(field => field.key === key)
    },
    redirectToResource() {
      window.open(window.location.origin + '/' + this.$route.params.lang + '/tableau?url=' + getResourceUrl(this.selectedResource))
    },
    filterNotDuplucate(filter){
      let filt = this.filters.filter(f => f.field === filter.field)
      if((filt.length > 1) & (filter.comp === 'less')){
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    dgvInfos: {
      deep: true,
      immediate: true,
      handler(value) {
        if(value && value.resource) {
          this.selectedResource = value.resource.id
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.subheader{
  background-color:#E6EEFE;
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
