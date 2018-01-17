<template>
  <!-- 歌手列表组件 @scroll为接收scroll组件传出来的事件 -->
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <!--双重循环-->
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
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
        <li v-for="(item, index) in shortcutList" class="item" :class="{'current': currentIndex === index}" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- A-Z 可变标题 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!--loading-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created() {
      this.touch = {} // 为位置滚动设置一个空对象 用来记录值
      this.listenScroll = true // 是否监听 scroll组件 的 滚动值 传入到scroll组件中
      this.listHeight = [] // 高度数组 会将 每一个歌手分类的高度存入到 数组中
      this.probeType = 3 // 传给scroll组件 的滚动监听模式选择
    },
    data() {
      return {
        scrollY: -1, // 歌手列表 y位置 数据
        currentIndex: 0, // 当前应该显示的 a-z 第几个 高亮 默认0为第一个高亮
        diff: -1 // a-z 标题动画偏差值
      }
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
      },
      fixedTitle() { // A-Z标题
        if (this.scrollY > 0) { // 边界条件判断
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) { // 向外部派发事件（跳转至歌曲详情页）
        this.$emit('select', item)
      },
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
      scroll(pos) { // 为接收scroll组件传出来的事件  pos => better-scroll 传出的数据
        this.scrollY = pos.y
      },
      _scrollTo(index) { // 再次封装滚动方法
        if (!index && index !== 0) {
          return
        }
        if (index < 0) { // 滑动边界条件处理预防
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index] // 点击 a-z 切换高亮
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // listGroup 为多个 <li> 取其索引 [index]
      },
      _calculateHeight() { // 计算 scroll歌手列表 每个歌手group（分类） 的高度
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i] // 得到每个group（歌手分类）的元素（DOM）
          height += item.clientHeight // dom可以直接获取高度 高度累加
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) { // 将 scrollY => 当前滚动到的y值（像素） 与 listHeight => 区间高度集合数组 进行比较 确定在哪个scrollY滚动到了哪个区间
        const listHeight = this.listHeight
        // 当滚动到顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动时 遍历进行 scrollY 与 listHeight => []中的每个元素进行 上限 下限 的对比
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i // currentIndex => 索引
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部 且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) { // 观察diff
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
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
