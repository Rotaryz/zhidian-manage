<template>
  <div class="admin-select">
    <div class="select-item" @click.stop="selectType">
      <div class="admin-big-box" @mouseleave="showHover = false" @mouseenter="showHover = true">
        <div class="admin-select-box input-height-item" :class="{'admin-select-box-active': select.check, 'admin-big-box-hover': showHover}" :style="{'min-width': width + 'px',height: height + 'px', lineHeight: height + 'px'}">
          {{select.content}}
          <img src="./icon-drop_down@2x.png" class="city-tap-top" :class="{'city-tap-top-active': select.check}">
          <transition name="fade">
            <ul v-show="select.check" class="select-child" @mouseleave="leaveHide()" @mouseenter="endShow">
              <li v-for="(child, chIdx) in select.data" :key="chIdx" class="select-child-item" :style="{height: itemHeight + 'px', lineHeight: itemHeight + 'px'}"
                  @click.stop="setValue(child, chIdx)"
              >
                {{child.name}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      select: {
        type: Object,
        default: () => {
          return {
            check: false,
            show: false,
            content: '全部',
            type: 'default',
            data: [] // 格式：{name: '55'}
          }
        }
      },
      isUse: {
        type: Boolean,
        default: true
      },
      itemHeight: {
        type: Number,
        default: 40
      },
      width: {
        type: Number,
        default: 102
      },
      height: {
        type: Number,
        default: 28
      }
    },
    data() {
      return {
        setTime: '',
        showHover: false,
        selectIdx: -1
      }
    },
    mounted() {
      window.onclick = () => {
        this.select.check = false
      }
    },
    methods: {
      clickHide() {
        this.select.check = false
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      leaveHide() {
        this.setTime = setTimeout(() => {
          this.clickHide()
        }, 1500)
      },
      selectType() {
        if (!this.isUse) {
          return
        }
        this.select.check = !this.select.check
        this.$emit('selectType', this.select)
      },
      setValue(value, index) {
        this.select.check = false
        this.selectIdx = index
        this.showHover = false
        this.select.content = value.name
        this.$emit('setValue', value)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .admin-select
    box-sizing: border-box
    display: flex

  .select-item
    display: flex
    align-items: center
    position: relative
    &:first-child
      margin-left: 0px

  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

  .admin-big-box
    cursor: pointer
    box-sizing: border-box
    border-radius: 4px
    font-size: $font-size-medium
    color: $color-text-main
    position: relative
    .admin-select-box
      min-width: 102px
      border-radius: 4px
      border 1px solid $color-line
      padding: 0 31px 0 15px
      line-height: 27px
      white-space: nowrap
      font-size: $font-size-12
      position: relative
      color: $color-text-sub
      box-sizing: border-box
      transition: all 0.2s
      .city-tap-top
        width: 12px
        height: @width
        col-center()
        right: 14px
        transform-origin: 50% 0%
        transform: rotate(0deg) translateY(-50%)
        transition: transform 0.3s
      .city-tap-top-active
        transform-origin: 50% 0%
        transform: rotate(180deg) translateY(-50%)
        transition: transform 0.3s
      .select-child
        left: 0
        background: $color-white
        z-index: 300
        position: absolute
        min-width: 100%
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
        margin-top: 10px
        overflow-y: auto
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .3s ease-in-out
        .select-child-item
          white-space: nowrap
          color: $color-text-main
          padding: 0 11px
          text-align: left
          height: 40px
          line-height: 40px
          font-size: 14px
          font-family: $font-family-regular
          border-bottom: 0.5px solid $color-line
          box-sizing: border-box
          &:hover
            color: $color-sub
    .admin-select-box-active
      border-color: $color-sub !important
      color: $color-text-main
    .admin-big-box-hover
      border-color: #ACACAC

  .edit-input-box
    .admin-big-box
      margin-left: 0 !important
      .admin-select-box
        font-size: $font-size-14 !important
        min-width: 140px !important
        margin-left: 0
        line-height: 44px !important
        height: 44px !important

  .categories-input-box
    .admin-big-box
      margin-left: 0 !important
      .admin-select-box
        font-size: $font-size-14 !important
        min-width: 310px !important
        margin-left: 0
        line-height: 44px !important
        height: 44px !important
</style>
