import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false
// 给axios设置一个基路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置携带token的头
// 拦截   检查有没有携带token
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = localStorage.getItem('token')
  return config
})

// axios.interceptors.response.use(function (response) {
//     return response;
//   }, function (error) {
//     return Promise.reject(error);
//   });
Vue.prototype.$http = axios

import './assets/css/index.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
