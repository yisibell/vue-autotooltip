import Vue from 'vue'
import App from './App.vue'
import { Autotooltip } from '@/lib/main'

Vue.config.productionTip = false

Vue.directive('autotooltip', Autotooltip)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
