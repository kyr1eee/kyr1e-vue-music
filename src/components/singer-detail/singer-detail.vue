<template>
  <transition name="slide">
    <music-list :songs="songs" :bgImage="bgImage" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    bgImage() {
      return this.singer.img
    },
    title() {
      return this.singer.name
    },
    // 将store/getters的方法映射到局部计算属性中
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.mid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._setSongList(res.data.list)).then((songs) => {
            this.songs = songs
            // console.log(songs)
          })
        }
      })
    },
    _setSongList(list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.6s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
