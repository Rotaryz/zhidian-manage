import Vue from 'vue'
import App from './App.vue'
import router from '@router'
import store from '@state/store'
import '@components/_globals'
import {Plugins} from '@utils/plugins'
import {DatePicker} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@utils/env-clear'

Vue.use(DatePicker)
Vue.use(Plugins)

Vue.config.productionTip = process.env.NODE_ENV === 'production'

if (window.Cypress) {
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

export const app = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

if (window.Cypress) {
  window.__app__ = app
}
