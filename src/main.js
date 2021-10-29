import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'amfe-flexible'

import Vant from 'vant'
import { Lazyload } from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
Vue.use(Lazyload, {
  lazyComponent: true
})

Vue.config.productionTip = false

import WEBAPI from 'apifm-webapi'
WEBAPI.init(process.env.VUE_APP_SUB_DOMAIN)
Vue.prototype.$wxapi = WEBAPI

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
