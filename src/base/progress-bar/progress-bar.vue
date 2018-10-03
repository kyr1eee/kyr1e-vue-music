<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
              @touchstart.prevent="progressTouchStart"
              @touchmove.prevent="progressTouchMove"
              @touchend="progressTouchEnd">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offset = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offset)
      this.$emit('percentChanging', this._getPercent())
    },
    progressTouchEnd() {
      this.touch.init = false
      this._triggerPercent()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offset = percent * barWidth
        this._offset(offset)
      }
    },
    _offset(offset) {
      this.$refs.progress.style.width = `${offset}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offset}px, 0, 0)`
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      return this.$refs.progress.clientWidth / barWidth
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent(newPercent) {
      this.setProgressOffset(newPercent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme

</style>
