/** VUEX 入口 **/
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'// log插件

Vue.use(Vuex) // 注册插件

const debug = process.env.NODE_ENV !== 'production' // vuex调试工具 在npm run dev 时 debug 为 true

// Vuex就是提供一个仓库，Store仓库里面放了很多对象。其中state就是数据源存放地
export default new Vuex.Store({ // 在入口main.js时导入
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
