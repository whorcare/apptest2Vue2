<!--轮播图组件-->
<template>
  <div class="slider" ref="slider">
    <!--需要通过js设置 slider-group 的宽度-->
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll' // 安装轮播组件库
  import {addClass} from 'common/js/dom' // 为swiper添加class

  export default {
    data() {
      return {
        dots: [], // 轮播下标
        currentPageIndex: 0 // 当前第几页
      }
    },
    props: {
      loop: { // 是否循环
        type: Boolean,
        default: true
      },
      autoPlay: { // 是否自动轮播
        type: Boolean,
        default: true
      },
      interval: { // 轮播时间间隔
        type: Number,
        default: 3000
      }
    },
    mounted() { // 编译好的HTML挂载到页面 的 mounted钩子
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots() // 轮播下标 因为 children.length 需要在初始化前完成
        this._initSlider()

        if (this.autoPlay) { // 如果开启自动循环
          this._play()
        }
      }, 20)

      window.addEventListener('resize', () => { // 监听窗口大小改变时的事件
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh() // BScroll 重新计算轮播组件宽度大小
      })
    },
    methods: {
      _setSliderWidth(isResize) { // 设置slider宽度   isResize => 是否是第一次加载宽度
        this.children = this.$refs.sliderGroup.children // 获取轮播图的数量 DOM对象的children？

        let width = 0 // 整个轮播的总长度
        let sliderWidth = this.$refs.slider.clientWidth // 屏幕宽度 clientWidth 获取对象可见内容的宽度，不包括滚动条，不包括边框
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item') // 为每一个slider添加class？

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        if (this.loop && !isResize) { // isResize第二次页面加载此方法不能双倍width
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() { // 初始化轮播下标
        this.dots = new Array(this.children.length) // 长度为5的空数组
      },
      _initSlider() { // 初始化slider
        this.slider = new BScroll(this.$refs.slider, { // BScroll组件各种参数 将BScroll 实例化进slider变量里
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => { // BScroll可以绑定一个事件 确定滚动到第几个元素
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) { // 如果循环 BScroll 组件会自动在前后各多生成一个新元素 则需要 -1
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() { // 自动轮播
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400) // BScroll 的 goToPage 方法 跳转至某一页
        }, this.interval)
      }
    },
    destroyed() { // Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
