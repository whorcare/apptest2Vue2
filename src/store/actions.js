/** actions 对 mutation 进行封装和异步操作 多次mutation的集合操作 **/

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

/*
* Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
* ({commit, state}) 写法是es6语法，简写，state是默认传参，就是上面的state，就算写aaa也是指向state。 list=>播放列表 index索引
 */

export const selectPlay = function ({commit, state}, {list, index}) { // 点击歌曲进入播放时的vuex 多个mutation 操作
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) { // 如果从歌曲列表点进来时 播放模式为随机播放 那么重新洗牌
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index]) // ???
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true) // 打开播放器
  commit(types.SET_PLAYING_STATE, true) // 播放状态
}

export const randomPlay = function({commit, state}, {list}) { // 随机播放按钮
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

function findIndex(list, song) { // 寻找当前应该播放的index es6新写法
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
