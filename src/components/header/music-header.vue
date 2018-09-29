<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Kyr1e Music</h1>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    overflow: hidden
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 2px
      width: 74px
      height: 100%
      margin-right: 9px
      bg-image("kyr1e")
      background-size: cover
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
