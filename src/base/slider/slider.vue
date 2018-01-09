<!--轮播图组件-->
<template>
  <div class="slider" ref="slider">
    <!--需要通过js设置 slider-group 的宽度-->
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll' // 安装轮播组件库
  import {addClass} from 'common/js/dom' // 为swiper添加class

  export default {
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
        default: 4000
      }
    },
    mounted() { // 编译好的HTML挂载到页面 的 mounted钩子
      setTimeout(() => {
        this._setSliderWidth()
        this._initSlider()
      }, 20)
    },
    methods: {
      _setSliderWidth() { // 设置slider宽度
        this.children = this.$refs.sliderGroup.children // 获取轮播图的数量 DOM对象的children？

        let width = 0 // 整个轮播的总长度
        let sliderWidth = this.$refs.slider.clientWidth // 屏幕宽度 clientWidth 获取对象可见内容的宽度，不包括滚动条，不包括边框
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item') // 为每一个slider添加class？

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        if (this.loop) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() { // 初始化slider
        this.slider = new BScroll(this.$refs.slider, { // BScroll组件各种参数
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true
        })
      }
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
