<template>
  <div class="recommend" ref="recommend">
    <!--监听data,data变化则refresh scroll组件-->
    <scroll ref="scroll" class="recommend-content" :data="popularList">
      <!--slot将其渲染至scroll组件中-->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <!--slot将其渲染至slider组件的slider-group中-->
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <!--取消fastclick拦截点击-->
                <img @load="loadImage()" :src="item.picUrl" class="needsclick"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="(item, index) in popularList" :key="index" class="item">
                <div class="icon">
                  <!--懒加载,节省用户流量,用户滚动才加载真实图片-->
                  <img width='90' height='80' v-lazy="item.imgurl" />
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.dissname"></h2>
                  <p class="desc" v-html="item.creator.name"></p>
                  <p class="desc" v-html="'播放量: '+item.listennum"></p>
                </div>
              </li>
            </ul>
          </div>
      </div>
      <div class="loading-container" v-show="!popularList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {getRecommend, getPopularList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  data() {
    return {
      recommends: [],
      popularList: [],
      songList: []
    }
  },
  mixins: [playlistMixin],
  created() {
    this._getRecommend()
    this._getPopularList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getPopularList() {
      getPopularList().then(res => {
        if (res.code === ERR_OK) {
          this.popularList = res.data.list
        }
      })
    },
    loadImage() {
      // 撑开高度防止better-scroll计算高度不包含img导致无法滚动到底部
      // 加载第一张图片刷新,只刷新一次
      if (!this.checkImageLoad) {
        this.$refs.scroll.refresh()
        this.checkImageLoad = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 90px
            width: 90px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
            .desc
              color: $color-text-d
              margin-bottom: 10px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
