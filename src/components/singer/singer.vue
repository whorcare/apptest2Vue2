<template>
  <div class="singer">
    歌手页面
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'

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
      _getSingerList() { // 获取歌手列表数据
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            console.log(this._normalizeSinger(this.singers))
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
      }
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
