<template>
  <transition name="fade">
    <div v-show="isShade" class="base-model">
      <!-- 弹窗-->
      <div class="shade-win">
        <div class="shade-detail" @click.stop>
          <slot name="shade-box"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'BaseModel',
    components: {},
    props: {},
    data() {
      return {
        isShade: false
      }
    },
    methods: {
      showShade() {
        this.isShade = true
      },
      hideShade() {
        this.isShade = false
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .base-model
    left: 0
    right: 0
    top: 0
    bottom: 0
    position: fixed
    display: flex
    overflow: auto
    flex-direction: column
    z-index: 1000
  .shade-win
    height: 100%
    width: 100%
    background: rgba(50, 50, 58, 0.60)
    position: absolute
    top: 0
    bottom: 0
    right: 0
    left: 0
    &.fade-enter, &.fade-leave-to
      opacity: 0
    &.fade-enter-to, &.fade-leave-to
      transition: opacity .2s ease-in-out
    .shade-detail
      all-center()
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      border-radius: 3px
      background: $color-white
      width: 534px
</style>
