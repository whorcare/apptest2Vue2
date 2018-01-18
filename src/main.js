import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // vuex的store 实例化
import fastclick from 'fastclick' // 解决web手机端点击延迟300毫秒问题
import VueLazyLoad from 'vue-lazyload' // 懒加载

import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png') // 懒加载图片地址 require？
})

var vue = new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
vue
