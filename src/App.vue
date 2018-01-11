<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!--keep-alive将dom缓存在内存中 解决切换route时重新加载页面dom的问题-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header.vue'
  import Tab from 'components/tab/tab.vue'
  export default{
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
