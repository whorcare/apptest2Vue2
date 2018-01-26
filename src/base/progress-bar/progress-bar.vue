<!--进度条组件-->
<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!--prevent阻止浏览器默认行为-->
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16 // 小球的宽度
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: { // 进度条百分比
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {} // 拖动维护共享专用变量
    },
    methods: {
      // div内置拖动函数
      progressTouchStart(e) {
        this.touch.initiated = true // 标志位
        this.touch.startX = e.touches[0].pageX // 刚开始点击的位置
        this.touch.left = this.$refs.progress.clientWidth // 左边偏移量
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 滑动偏移量
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)) // 最终偏移的位置
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) { // 点击进度条（不拖动 只是点击）
        this._offset(e.offsetX)
        this._triggerPercent()
      },
      _triggerPercent() { // 向外派发事件 告诉外部进度条已被手动改变
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent) // emit向外传递参数
      },
      _offset(offsetWidth) { // 封装方法 偏移实现抽象
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) { // 偏移宽度
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
