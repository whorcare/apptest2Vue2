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
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400001J5QJL1pRQYB.m4a?vkey=13F8450D5A206F63B175C4F433E7173D4751F1731CB0FAB109316895209240AAE7C59DEC68AC94DFAB1E00D9EC00978B0BC464FC54DE9D69&guid=1791208910&uin=0&fromtag=66'
          } else {
            ret[i].url = 'http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?vkey=BA5FF89603DC95CF462A1DF074D960A2621D305BF2E4C9F592688E31B6216F16B959B997201C645586FD931A952BFCCA46488092D56EFF07&guid=1791208910&uin=0&fromtag=66'
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
