<template>
  <!--歌手列表组件-->
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <!--双重循环-->
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar"  v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧A-Z栏  touchstart点击事件 touchmove手指滑动事件 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!--通过 index 索引 获取点击的是第几个元素-->
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18

  export default {
    created() {
      this.touch = {} // 为位置滚动设置一个空对象 用来记录值
    },
    props: {
      data: { // 接收歌手列表数据
        type: Array,
        default: []
      }
    },
    computed: { // 计算属性用于代替复杂的 <div>{{}}</div>
      shortcutList() { // 获取data歌手列表数据中的 title => A-Z 的集合数组
        return this.data.map((group) => { // map 也就是原数组被“映射”成对应新数组。
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
      onShortcutTouchStart(e) { // A-Z 触摸点击事件 点击后让scroll滚动到相应的位置
        let anchorIndex = getData(e.target, 'index') // 获取其index索引
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) { // 手指滑动事件 计算从start到滚动到的位置差（y值差） 计算滚动到哪里
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 在y轴上的偏移量（像素）除以/18像素（ 每个A-Z之间的间隔 ）得出 偏移多少个元素 再取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) { // 再次封装滚动方法
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // listGroup 为多个 <li> 取其索引 [index]
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

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
