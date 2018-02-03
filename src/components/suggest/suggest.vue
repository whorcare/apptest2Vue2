<!--搜索时 进行搜索功能下拉菜单显示-->
<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" :pullDown="pullDown"
          @scrollToEnd="searchMore" @scrollToEndDown="searchDown"
  >
    <ul class="suggest-list">
      <loading v-show="nowDown" title=""></loading>
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song' // 实例化 类
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  const TYPE_SINGER = 'singer'
  const perpage = 20 // 一次加载数据量

  export default {
    props: {
      query: { // 搜索栏中的数据
        type: String,
        default: ''
      },
      showSinger: { // 是否显示歌手
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [], // 接收请求返回的数据
        pullup: true,
        hasMore: true, // 是否还有更多数据
        pullDown: true, // 是否开启下拽刷新数据
        nowDown: false // 是否在下拽过程中
      }
    },
    methods: {
      search() { // 数据变化时 请求服务端数据
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data) // 是否有更多的数据可以加载
            this.nowDown = false
          }
        })
      },
      searchMore() { // 上拉刷新时搜索更多
        if (!this.hasMore) { // 如果没有更多数据
          return
        }
        this.page++ // 请求的参数改变
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data)) // 将再次加载后的数据拼接在一起
            this._checkMore(res.data) // 是否有更多的数据可以加载
          }
        })
      },
      searchDown() { // 下拽事件
        this.nowDown = true
        this.search()
      },
      getIconCls(item) { // 改变图片class
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) { // 数据中计算判断html的显示
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _checkMore(data) { // 判断是否有更多的数据可以加载
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) { // 处理数据
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // 将俩个对象添加到一个对象上
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) { // 封装类?处理数据
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData)) // 封装为实例
          }
        })
        return ret
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
