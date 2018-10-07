<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :singer-list="singers" ref="listview"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import { playlistMixin } from 'common/js/mixin'
const HOTKEY = '热门'
const HOT_LEN = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  mixins: [playlistMixin],
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          this._setSingerList()
        }
      })
    },
    _setSingerList() {
      let map = {
        hot: {
          title: HOTKEY,
          items: []
        },
        list: {
        }
      }
      this.singers.forEach((item, index) => {
        if (index < HOT_LEN) {
          map.hot.items.push(new Singer({
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map.list[key]) {
          map.list[key] = {
            title: key,
            items: []
          }
        }
        map.list[key].items.push(new Singer({
          mid: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 字母排序
      let keyArr = []
      for (let key in map.list) {
        let val = map.list[key]
        if (key.match(/[a-zA-Z]/)) {
          keyArr.push(val)
        }
      }
      keyArr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      this.singers = [map.hot].concat(keyArr)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
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
    top: 80px
    bottom: 0
    width: 100%
</style>
