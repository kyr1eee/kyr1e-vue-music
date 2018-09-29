<template>
  <div id="music">
    <div id="app">
      <div id="top">
        <music-header></music-header>
        <tab></tab>
      </div>
      <div id="main-content">
        <!--缓存dom,避免重复获取json数据-->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <player></player>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicHeader from 'components/header/music-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MusicHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
  #app
    bg-kyr1e("kyr1e")
</style>
