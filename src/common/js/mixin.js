/**
 * 混合 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混合对象可以包含任意组件选项。当组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。
 * mixins 就是js代码复用 将这段代码 可以重复使用在其他组件上
 * mixins 是一个对象
 * 解决播放组件底部栏导致scroll组件高度加载的bug
**/
import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() { // 钩子 当templete被加载时 组件dom ready时触发
    this.handlePlaylist(this.playlist)
  },
  activated() { // keep-alive 组件激活时调用。 keep-alive组件用来缓存组件
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() { // 引用次minxin的组件必须定义此函数 即可覆盖函数
      throw new Error('component must implement handlePlaylist methods')
    }
  }
}
