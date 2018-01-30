<!-- 多个使用的 歌曲详情组件 -->
<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!--随机播放按钮-->
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!--todo 向上推动时需要的层 layer -->
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40 // 顶部title高度
  // 返回拼接好的css属性名
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [playlistMixin],
    props: {
      bgImage: { // 背景图
        type: String,
        default: ''
      },
      songs: { // 数据
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0 // scroll偏移量
      }
    },
    computed: {
      bgStyle() { // 背景图片的style
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3 // 用于scroll参数
      this.listenScroll = true
    },
    mounted() { // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
      this.imageHeight = this.$refs.bgImage.clientHeight // 记录最高滚动高度
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px` // ??? 将scroll组件top值改写 让scroll组件上方的bgImage出现
    },
    methods: {
      handlePlaylist(playlist) { // mixins底部方法
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom // scroll内置方法
        this.$refs.list.refresh()
      },
      scroll(pos) { // 接收scroll的监听事件
        this.scrollY = pos.y
      },
      back() { // 返回上一页
        this.$router.back()
      },
      selectItem(item, index) { // 点击进入歌曲播放页 接收song-list派发事件 item=>点击的歌曲 index=>索引
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() { // 随机播放按钮
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newY) { // 监听watch偏移量 来设置DOM layer 的偏移量
        let translateY = Math.max(this.minTransalteY, newY) // 最多偏移量 不让其偏移超出顶部
        let zIndex = 0
        let scale = 1
        let blur = 0 // 高斯模糊
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
        const percent = Math.abs(newY / this.imageHeight) // 下拉图片缩放公式
        if (newY > 0) { // 向下拉时
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20) // 高斯模糊比例 最大不超过20
        }
        this.$refs.filter.style[backdrop] = `blur(${blur})` // 模糊只能在IOS上显示效果
        if (newY < this.minTransalteY) { // 滚动到顶部时
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
