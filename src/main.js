import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

Vue.use(ElementUI)
Vue.config.productionTip = false

import './assets/css/index.css'

router.beforeEach((to, from, next) => {
  console.log(to)
  // next()
  if (to.path === '/login') {
    next()
    return
  }

  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
