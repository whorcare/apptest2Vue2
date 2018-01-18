<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex' // vuex 语法糖 改变数据

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) { // 跳转至歌曲详情页
        this.$router.push({ // 跳转 并传入router中 singer.id  路由跳转实际上并没有换一个新页面 只是盖上一个层
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer) // vuex语法糖简化版 this.$store.commit('SET_SINGER')
      },
      _getSingerList() { // 获取歌手列表数据
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) { // 对歌手数据进行处理
        let map = { // 新 对象数据格式
          hot: { // 热门数据
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => { // item => i  index  => 索引
          /** 根据索引 前10条的数据为 热门数据 **/
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({ // 封装一个Singer对象在公共js中 向对象传递一个 '对象' 参数
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          /** 其他数据根据首字母做聚类 **/
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        /** 为了得到有序列表 我们需要处理map **/
        let hot = [] // 热门
        let ret = [] // 普通数据
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) { // 如果title 是a-z中的字母 则进入数组
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => { // 对普通数据进行排序  obj.sort(return (a - b))
          return a.title.charCodeAt(0) - b.title.charCodeAt(0) // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码  0->第一个下标
        })
        // 将热门与普通数据拼接在一起
        return hot.concat(ret)
      },
      // ...将一个数组，变为参数序列
      ...mapMutations({ // 映射 你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。
        setSinger: 'SET_SINGER' // 映射 this.setSinger() 为 this.$store.commit('SET_SINGER')
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
