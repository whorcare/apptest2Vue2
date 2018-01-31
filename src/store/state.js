/** state状态 存储 **/
import {playMode} from 'common/js/config' // 配置信息

// 在 VUEX state中只放基本数据 需要计算的数据放在getters中
const state = {
  singer: {}, // 歌手的 歌曲列表 详情
  playing: false, // 播放状态 是否在播放中
  fullScreen: false, // 全屏 展开和收起 播放器
  playlist: [], // 播放列表
  sequenceList: [], // 正常的顺序列表
  mode: playMode.sequence, // 播放模式 引入常量 sequence=>0正序播放  loop=>1循环播放  random=>2随机播放
  currentIndex: -1, // 当前播放的歌曲index
  disc: {} // 歌单
}

export default state
