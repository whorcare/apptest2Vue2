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
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400001J5QJL1pRQYB.m4a?vkey=541005AEFD95288DD4EB71C1D49031B9EFFA43B9DACA1A70903A89C7D42A216E237DFFE44FB0315AA7C66664292BD3DBB10027AB1D72949B&guid=1791208910&uin=591686670&fromtag=66'
          } else {
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?vkey=001950F47AA01291F5847BBA9318633F48CD0843F5CD641010412063DA6943FB1F39ECFE80B89A77E9B66E99CFDAF8E0436D034EA8CDB147&guid=1791208910&uin=591686670&fromtag=66'
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
