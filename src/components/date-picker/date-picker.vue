<template>
  <el-date-picker
    v-model="time"
    :size="size"
    type="daterange"
    class="border-el-date-picker"
    :class="{'animate-border':focus}"
    style="width: 236px"
    rangeSeparator="~"
    startPlaceholder="开始日期"
    endPlaceholder="结束日期"
    :pickerOptions="pickerOptions"
    @focus="pickerFocus"
    @blur="pickerBlur"
    @change="change"
  >
  </el-date-picker>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      size: {
        type: String,
        default: 'mini'
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        time: '',
        focus: false,
        defaultValue: Date.now()
      }
    },
    methods: {
      clearTime() {
        this.time = ''
      },
      pickerFocus() {
        this.focus = true
      },
      pickerBlur() {
        this.focus = false
      },
      change(time) {
        this.$emit('change', time)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .el-input__icon.el-range__close-icon
    z-index :50

  .border-el-date-picker
    position: relative
    &:after
      content: ''
      border-top: 0.5px solid transparent
      border-bottom: 0.5px solid transparent
      position: absolute
      z-index: 0
      height: 100%
      width: 0
      right: 0
      top: -1px
      box-sizing: content-box
      transition: all 0.3s ease-out
      border-radius: 4px
    &:before
      content: ''
      border-right: 1px solid transparent
      border-left: 1px solid transparent
      position: absolute
      z-index: 0
      height: 0
      width: 100%
      bottom: 0
      left: -1px
      box-sizing: content-box
      transition: all 0.3s ease-out
      border-radius: 4px
    &:hover
      border-color: transparent
      &:after
        border-top: 1px solid $color-text-sub
        border-bottom: 1px solid $color-text-sub
        transition: all 0.3s ease-out
        width: 100%
      &:before
        border-right: 1px solid $color-text-sub
        border-left: 1px solid $color-text-sub
        transition: all 0.3s ease-out
        height: 100%
  .animate-border
    border-color: $color-line-btn !important
    color: $color-main
</style>
