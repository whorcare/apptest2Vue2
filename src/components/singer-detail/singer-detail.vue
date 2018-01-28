<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import musicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: [] // 歌曲数据
      }
    },
    computed: { // getters 最终映射的就是计算属性 mapGetters需要在计算属性中写
      ...mapGetters([ // mapGetters实际是数组   mapMutations是对象
        'singer' // 此时 vuex 挂载了singer实例 此组件可以获取singer了
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() { // 根据 歌手 获取歌曲数据
        if (!this.singer.id) { // 如果没有singer 则退回到歌手列表页
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) { // 对数据进行处理
        let ret = []
        list.forEach((item) => {
          let {musicData} = item // 解构
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        /** 更改歌曲 **/
        for (let i = 0; i < ret.length; i++) {
          if (i % 2 === 0) {
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400001J5QJL1pRQYB.m4a?vkey=BB4C69CC914E0EFBA48DB73E1432DED30B063FE31ECFE5BF26EF6990331763A20586833BCF47EA47A823632DD46465E5E797FCFA5AB6FE75&guid=7564155098&uin=0&fromtag=66'
          } else {
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?vkey=4187CB91322E19D669AC973ACE9283A7F034CC2B6D82A883D1D95658C79536BCD5A72E1B1CCE22C55107B0963DE18D116ED5593E026B083F&guid=7564155098&uin=0&fromtag=66'
          }
        }
        console.log(ret)
        return ret
      }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
