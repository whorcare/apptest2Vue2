/** 在Vuex中store数据改变的唯一方法就是mutation 装着一些改变数据方法的集合 **/
import * as types from './mutation-types' // 获取全部集合成 => type

const mutations = {
  [types.SET_SINGER](state, singer) { // 修改 VUEX state 歌手歌曲详情数据的方法
    state.singer = singer
  }
}

export default mutations // export default只能导出一个 export可以多个
