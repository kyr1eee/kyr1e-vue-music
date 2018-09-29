<template>
  <div class="singer">
    <list-view @select="selectSinger" :singer-list="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
const HOTKEY = '热门'
const HOT_LEN = 10
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
