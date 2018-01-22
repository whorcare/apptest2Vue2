/** 获取数据 封装getters Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性） **/
export const singer = state => state.singer // getters获取VUEX state 的 歌手歌曲 详情 相等于 function singer(state) { return state.singer }

export const playing = state => state.playing // playing 播放状态 是否在播放中

export const fullScreen = state => state.fullScreen // 全屏 展开和收起 播放器

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => { // state中没有  通过getters中计算得出currentSong 当前播放的歌曲
  return state.playlist[state.currentIndex] || {} // 如果没有则是空对象
}
