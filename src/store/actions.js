/** actions 对 mutation 进行封装和异步操作 多次mutation的集合操作 **/

import * as types from './mutation-types'

/*
* Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
* ({commit, state}) 写法是es6语法，简写，state是默认传参，就是上面的state，就算写aaa也是指向state。 list=>播放列表 index索引
 */

export const selectPlay = function ({commit, state}, {list, index}) { // 点击歌曲进入播放时的vuex 多个mutation 操作
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true) // 打开播放器
  commit(types.SET_PLAYING_STATE, true) // 播放状态
}
