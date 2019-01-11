<template>
  <div class="d-charts-panel">
    <header class="header">
      <div class="title">用户统计</div>
      <date-picker @change="changeHandle($event, 'date')"></date-picker>
      <div class="btn-group">
        <sizer-group :btnGroup="btnGroup" @change="changeHandle"></sizer-group>
      </div>
    </header>
  </div>
</template>

<script type="text/ecmascript-6">
  import DatePicker from '@components/date-picker/date-picker'
  import SizerGroup from '@components/sizer-group/sizer-group'
  const COMPONENT_NAME = 'D_CHARTS_PANEL'

  const NAV = [
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'},
  ]
  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker,
      SizerGroup
    },
    data() {
      return {
        btnGroup: NAV
      }
    },
    methods: {
      changeHandle(e, type) {
        this.$emit('change', e, type)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .d-charts-panel
    height :427px
    card-box-style()
    .header
      display :flex
      align-items :center
      padding :20px 30px
      border-bottom :1px solid $color-line
      .title
        font-family: $font-family-regular
        font-size: 18px;
        color: #333333;
        line-height: 18px;
        flex: 1
      .btn-group
        margin-left :20px
</style>
