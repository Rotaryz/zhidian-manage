<template>
  <div class="sizer-group">
    <li v-for="(item, index) in btnGroup" :key="index" class="date-item hand" :class="{'date-item-active': tabIndex === index}" @click="checkTab(item, index)">
      {{item.title}}
      <transition name="fade">
        <div v-if="item.status === 'set'" v-show="tabIndex === tabActive" class="block">
          <date-picker ref="_datePicker" @change="dateChange($event, 'date')"></date-picker>
        </div>
      </transition>
    </li>
  </div>
</template>

<script type="text/ecmascript-6">
  import DatePicker from '@components/date-picker/date-picker'

  const COMPONENT_NAME = 'SIZER_GROUP'
  const NAV = [
    {title: '今天', status: 'today'},
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'},
    {title: '全部', status: ''},
    {title: '自定义', status: 'set'}
  ]
  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker
    },
    props: {
      btnGroup: {
        type: Array,
        default: () => NAV
      },
      tabActive: {
        type: Number,
        default: 5
      },
      defaultIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        tabIndex: this.defaultIndex,
        preIndex: 0,
        showPicker: true
      }
    },
    watch: {
      tabIndex(cur, pre) {
        if (pre === this.tabActive) {
          cur !== this.tabActive && this._clearTime()
        }
      }
    },
    methods: {
      _clearTime() {
        this.$refs._datePicker && this.$refs._datePicker[0] && this.$refs._datePicker[0].clearTime()
      },
      _clearActive() {
        this.tabIndex = -1
      },
      _setTabIndex(num) {
        this.tabIndex = num
      },
      dateChange(time, type) {
        let date = []
        date.push(
          time[0]
            .toLocaleDateString()
            .replace(/\//g, '-')
            .replace(/\b\d\b/g, '0$&')
        )
        date.push(
          time[1]
            .toLocaleDateString()
            .replace(/\//g, '-')
            .replace(/\b\d\b/g, '0$&')
        )
        this.$emit('change', date, type)
      },
      checkTab(item, index) {
        this.tabIndex = index
        let status = item.status
        if (status === 'set') {
          return
        }
        this.$emit('change', status)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .sizer-group
    display: flex
  .date-item
    line-height: 28px
    font-size: $font-size-12
    color: $color-text-main
    width: 60px
    height: 27px
    position: relative
    transition: all 0.3s ease-out
    border: 0.5px solid $color-line-btn
    border-left: none
    text-align :center
    cursor :pointer
    user-select :none
    &:nth-child(1)
      border-left: 0.5px solid $color-line-btn
    &:last-child
      border-top-right-radius: 4px
      border-bottom-right-radius: 4px
      &:after
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
      &:before
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
    &:first-child
      border-top-left-radius: 4px
      border-bottom-left-radius: 4px
      &:after
        border-top-left-radius: 4px
        border-bottom-left-radius: 4px
      &:before
        border-top-left-radius: 4px
        border-bottom-left-radius: 4px
    &:after
      content: ''
      border-top: 0.5px solid transparent
      border-bottom: 0.5px solid transparent
      position: absolute
      z-index: 5
      height: 100%
      width: 0
      right: 0
      top: -0.5px
      box-sizing: content-box
      transition: all 0.3s ease-out
    &:before
      content: ''
      border-right: 0.5px solid transparent
      border-left: 0.5px solid transparent
      position: absolute
      z-index: 5
      height: 0
      width: 100%
      bottom: 0
      left: -0.5px
      box-sizing: content-box
      transition: all 0.3s ease-out

  .date-item-active
    transition: all 0.3s ease-out
    color: $color-main
    &:after
      border-color: $color-main
      transition: all 0.3s ease-out
      width: 100%
    &:before
      border-color: $color-main
      transition: all 0.3s ease-out
      height: 100%

  .block
    row-center()
    z-index: 10
    &.fade-enter, &.fade-leave-to
      opacity: 0
      height: 0
    &.fade-enter-to, &.fade-leave-to
      transition: all .3s ease-in-out
</style>
