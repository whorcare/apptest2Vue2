<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: { // 滚动监听模式选择
        type: Number,
        default: 1 // 滚动的时候会派发scroll事件，会截流
      },
      click: { // 是否可以点击
        type: Boolean,
        default: true
      },
      data: { // 数据
        type: Array,
        default: null
      },
      listenScroll: { // 是否监听滚动事件
        type: Boolean,
        default: false
      }
    },
    mounted() { // 当组件ready钩子
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() { // 初始化scroll组件方法
        if (!this.$refs.wrapper) { // 如果DOM 是undefined时
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) { // 如果需要监听scroll的滚动事件
          let that = this
          this.scroll.on('scroll', (pos) => { // 内置API 拿到pos
            that.$emit('scroll', pos) // $emit向外部派发事件
          })
        }
      },
      // BScroll方法代理
      enable() { // 启用 better-scroll，默认开启
        this.scroll && this.scroll.enable()
      },
      disable() { // 禁用 better-scroll
        this.scroll && this.scroll.disable()
      },
      refresh() { // 当 better-scroll 刷新时触发
        this.scroll && this.scroll.refresh()
      },
      scrollTo() { // 让 better-scroll 使用封装好的内置API => scrollTo 滚动到相应的位置（坐标）
        // 用apply 将 scrollTo() 的参数传递到 better-scroll 中 scrollTo 的方法里
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments) // apply(this对象上下文, arguments)
      },
      scrollToElement() { // 滚动到某个元素
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() { // 监听 当  props => data 数据变化时
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
