<template>
  <scroll class="listview"
          :data="singerList"
          ref="listview"
          :probeType="probeType"
          :listenScroll="listenScroll"
          @scrollPos="getPos"
          >
    <ul>
      <li class="list-group" v-for="(group, index) in singerList" :key=index ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.img" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--touchmove prevent 阻止默认行为,stop 阻止冒泡-->
    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li class="item"
            :class="{'current': currentIndex === index}"
            v-for="(item, index) in shortCutList"
            :key="index"
            :data-index="index">
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <div v-show="!singerList.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
// 思路
// 左边 右边 联动 双侧滚动
// 通过左边获取目前滚动位置,以及在那个group区间,获取当前currentIndex得到高亮
export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    singerList: {
      type: Array,
      default: null
    },
    dataIndex: {
      type: Number,
      default: 0
    }
  },
  // 计算属性依赖于缓存,只有相关依赖改变才重新求值,不用像method重复执行函数
  computed: {
    shortCutList() {
      return this.singerList.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return
      }
      return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortCutTouchStart(e) {
      // 事件委托
      let anchorIndex = getData(e.target, 'index')
      // touchEvent.touches touch对象的数组
      // clientX:触摸目标在视口中的x坐标。
      // clientY：触摸目标在视口中的y坐标。
      // identifier:标识触摸的唯一ID。
      // pageX：触摸目标在页面中的x坐标。
      // pageY：触摸目标在页面中的y坐标。
      // screenX：触摸目标在屏幕中的x坐标。
      // screenY：触摸目标在屏幕中的y坐标。
      // target：触摸的DOM节点目标。
      let firstTouch = e.touches[0]
      this.touch.anchorIndex = parseInt(anchorIndex)
      this.touch.y1 = firstTouch.pageY
      this.scrollTo(anchorIndex)
    },
    onShortCutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      let anchorIndex = this.touch.anchorIndex + delta
      this.scrollTo(anchorIndex)
    },
    getPos(pos) {
      this.scrollY = pos.y
    },
    scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _getListHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    singerList() {
      setTimeout(() => {
        this._getListHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部,newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
