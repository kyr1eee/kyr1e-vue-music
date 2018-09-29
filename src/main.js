// import ES6
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index'
// vuex
import store from './store'
// 懒加载
import VueLazyLoad from 'vue-lazyload'
// import stylus
import 'common/stylus/index.styl'
import fastclick from 'fastclick'

fastclick.attach(document.body)
// 使用lazyload插件
Vue.use(VueLazyLoad, {
  loading: require('common/img/kyr1e.jpg')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
