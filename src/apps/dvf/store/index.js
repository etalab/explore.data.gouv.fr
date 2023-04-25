import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePanel:"carte",
    map:{
      lng:2,
      lat:46.3,
      zoom:null,
      zoomLevel:4.8
    },
    apiData:null,
    apiLevel:null,
    apiCode:null,
    location:{
      level: 'fra',
      dep: null,
      com: null,
      section: null,
      parcelle: null
    },
    locationLabels:{
      dep:null,
      com: null
    },
    activeFilter:"tous",
    searchBarCoordinates: null,
    dvfCurrentSection: null,
  },
  mutations: {
    changeDvfCurrentSection( state, data) {
      state.dvfCurrentSection = data
    },
    changeSearchBarCoordinates( state, data) {
      state.searchBarCoordinates = data
    },
    changeActivePanel (state,data) {
      state.activePanel = data
    },
    changeZoomLevel (state, data){
      state.map.zoomLevel = data
    },
    changeLocationLevel (state, data){
      state.location.level = data
    },
    changeLocationDep (state, data){
      state.location.dep = data
      state.location.com = null
      state.location.section = null
      state.location.parcelle = null
    },
    changeLocationCom (state, data){
      state.location.com = data
      state.location.section = null
      state.location.parcelle = null
    },
    changeLocationSection (state, data){
      state.location.section = data
      state.location.parcelle = null
    },
    changeLocationParcelle (state, data){
      state.location.parcelle = data
    },
    changeLocationLabelDep (state, data){
      state.locationLabels.dep = data
    },
    changeLocationLabelCom (state, data){
      state.locationLabels.com = data
    },
    updateApiData (state, data){
      state.apiData = data
    },
    updateApiLevel (state, data){
      state.apiLevel = data
    },
    updateApiCode(state, data){
      state.apiCode = data
    },
    updateActiveFilter(state,filter){
      state.activeFilter = filter
    }
  }
})