<template>
  <dialog :aria-labelledby="'fr-modal-title-modal-' + field.key" role="dialog" :id="id"
    class="fr-modal fr-modal--popover">
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--right">
        <div class="fr-col-12 fr-col-sm-7 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button class="fr-link--close fr-link" title="Fermer la fenêtre modale"
                :aria-controls="id">Fermer</button>
            </div>
            <div class="fr-modal__content fr-text--regular">
              <h1 :id="'fr-modal-title-modal-' + field.key" class="fr-modal__title">{{ field.label }}</h1>
              <!-- <h2 class="fr-text--sm">Analyse des données</h2> -->
              <dl>
                <dt>Format détecté</dt>
                <dd>{{ columnInfos.format }}</dd>
                <dt>Nombre de valeurs distinctes</dt>
                <dd>{{ columnInfos.nb_distinct }}</dd>
                <span v-if="columnInfos.type === 'Numeric'">
                  <dt>Valeur minimale</dt>
                  <dd>{{ columnInfos.numeric_infos.min }}</dd>
                  <dt>Valeur maximale</dt>
                  <dd>{{ columnInfos.numeric_infos.max }}</dd>
                  <dt>Valeur moyenne</dt>
                  <dd>{{ columnInfos.numeric_infos.mean }}</dd>
                  <dt>Ecart-type</dt>
                  <dd>{{ columnInfos.numeric_infos.std }}</dd>
                  <span v-if="columnInfos.type == 'Numeric' && numericPlotInfos.bin_edges && numericPlotInfos.bin_edges.length > 0">
                    <dt>Distribution</dt>
                    <dd>
                      <histogram 
                        :datachart="numericPlotInfos.counts"
                        :labels="numericPlotInfos.bin_edges"
                        :title="field.label"
                        :id="'mychart-'+field.label"
                      ></histogram>
                    </dd>
                  </span>
                </span>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import Histogram from '@/components/Histogram.vue'

export default {
  components: {Histogram},
  props: {
    field: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    columnsInfos() {
      return this.$store.state.columnsInfos
    },
    columnInfos() {
      return this.columnsInfos[this.field.key] ? this.columnsInfos[this.field.key] : {}
    },
    numericPlotInfos() {
      return this.columnInfos['numeric_plot_infos'] ? this.columnInfos['numeric_plot_infos'] : {}
    },
  }
}
</script>

<style scoped>
h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

dl {
  margin: 0
}

dt {
  font-size: 0.8rem;
  color: var(--text-mention-grey);
}

dd {
  margin-left: 0;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  font-weight: bold;
}
</style>
