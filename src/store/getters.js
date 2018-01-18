/** 获取数据 封装getters Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性） **/
export const singer = state => state.singer // getters获取VUEX state 的 歌手歌曲 详情 相等于 function singer(state) { return state.singer }
