<template>
  <div class="modal">
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
    <div class="content-base">
      <div v-if="showNull" class="blank">
        <div class="blank-icon"></div>
        <div class="blank-title">暂无相关数据</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseModel',
    components: {},
    props: {},
    data() {
      return {
        isShade: false,
        showNull: false
      }
    },
    methods: {
      showShade() {
        this.isShade = true
      },
      hideShade() {
        this.isShade = false
      },
      showNoData() {
        this.showNull = true
      },
      hideNoData() {
        this.showNull = false
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

  .content-base
    padding: 1.5vw
    flex: 1
    display: flex
    flex-direction: column
    box-sizing: border-box
    .blank
      row-center()
      top: 55%
      text-align: center
      z-index: 1
      &.fade-enter, &.fade-leave-to
        opacity: 0
      &.fade-enter-to, &.fade-leave-to
        transition: opacity .2s ease-in-out
      .blank-icon
        icon-image('icon-null')
        width: 140px
        height: 89px
        margin-bottom: 30px
      .blank-title
        color: $color-text99
</style>
