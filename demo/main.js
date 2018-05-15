import Vue from 'vue'
import VirtualScroll from '../src'
import App from './App.vue'

Vue.component('virtual-list', VirtualScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
