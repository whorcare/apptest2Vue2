/** 在Vuex中store数据改变的唯一方法就是mutation 装着一些改变数据方法的集合 **/
import * as types from './mutation-types' // 获取全部集合成 => type

// 对state中的数据进行修改
const mutations = {
  [types.SET_SINGER](state, singer) { // 修改 VUEX state 歌手歌曲详情数据的方法 state => vuex数据存储 singer => 传入的新数据
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}

export default mutations // export default只能导出一个 export可以多个
