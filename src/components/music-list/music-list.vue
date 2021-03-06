<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image"  ref="bgImage">
      <div class="play-wrapper" ref="playWrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="filter" :style="bgStyle"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scrollPos="getPos" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :rank="rank" @select="selectItem" :songs="songs" ref="songList"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVE_HEIGHT = 150
const BTN_BOTTOM = 20
const transform = prefixStyle('transform')
const filter = prefixStyle('filter')
export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      defaule: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage});background-size:cover;`
    }
  },
  // 在模板渲染成html后调用
  mounted() {
    // 组件需要$el获取dom
    // 缓存高度,不必进行多次dom操作
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.minScrollY = -this.imgHeight + RESERVE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    // console.log(this.songs)
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    getPos(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minScrollY, newY)
      let zIndex = 0
      let scale = 1
      let filterScale = 1.2
      let blur = 0
      let bottom = BTN_BOTTOM
      let percent = Math.abs(newY / this.imgHeight)
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      if (newY > 0) {
        scale += percent
        zIndex = 10
        bottom = BTN_BOTTOM
      } else {
        // ME
        // set my scroll animate
        bottom += -translateY
        filterScale -= percent / 2
        if (filterScale <= 1) {
          filterScale = 1
        }
      }
      this.$refs.filter.style[transform] = `scale(${filterScale})`
      this.$refs.playWrapper.style.bottom = `${bottom}px`
      if (newY < -(this.imgHeight - RESERVE_HEIGHT)) {
        blur = Math.min(6 * percent, 6)
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`
        this.$refs.playWrapper.style.bottom = `${BTN_BOTTOM}px`
      } else {
        blur = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.filter.style[filter] = `blur(${blur}px)`
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      overflow: hidden
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
        transform: scale(1.2)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
