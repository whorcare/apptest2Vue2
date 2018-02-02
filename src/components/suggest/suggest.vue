<!--搜索时 进行搜索功能下拉菜单显示-->
<template>
  <div ref="suggest" class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {filterSinger} from 'common/js/song' // 数组转字符串拼接方法

  const TYPE_SINGER = 'singer'

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
        result: [] // 接收请求返回的数据
      }
    },
    methods: {
      search() { // 数据变化时 请求服务端数据
        search(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
          }
        })
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
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      },
      _genResult(data) { // 处理数据
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // 将俩个对象添加到一个对象上
        }
        if (data.song) {
          ret = ret.concat(data.song.list)
        }
        return ret
      }
    },
    watch: {
      query() {
        this.search()
      }
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
