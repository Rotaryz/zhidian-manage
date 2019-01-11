<template>
  <div class="d-header-item">
    <header class="header">
      <div class="logo" :class="dataInfo.icon"></div>
      <span class="title">{{dataInfo.title}}</span>
      <div class="help" @mouseenter="_showTip" @mouseleave="_hideTip">
        <transition name="fade">
          <div v-show="isShowTip" class="data-show-tip">实时数据，两小时统计一次并刷新数据</div>
        </transition>
      </div>
    </header>
    <section class="section">{{dataInfo.number}}</section>
    <footer class="footer">
      <div class="item-f">昨日：{{dataInfo.yesterday}}</div>
      <div class="item-f">{{dataInfo.text}}：{{dataInfo.total}}</div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'D_HEADER_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        isShowTip: false
      }
    },
    methods: {
      _showTip() {
        this.isShowTip = true
      },
      _hideTip() {
        this.isShowTip = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .d-header-item
    card-box-style()
    padding :30px
    font-family: $font-family-regular
    font-size: 14px;
    line-height: 14px;
    .header
      display :flex
      align-items :center
      .logo
        width :18px
        height: @width
        &.shop
          icon-image(icon-shop)
        &.amount
          icon-image(icon-amount)
        &.order
          icon-image(icon-ordercount)
        &.user
          icon-image(icon-newuser)
      .help
        position :relative
        margin-left :4px
        width :14px
        height :@width
        cursor :pointer
        icon-image('./icon-help')
        .data-show-tip
          position: absolute
          bottom: -48px
          left: -56px
          color: $color-white
          height: 40px
          line-height: @height
          width: 278px
          text-align: center
          border-radius: 4px
          background: rgba(50, 50, 58, .8)
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: all .1s ease-in-out
          &:after
            content: ''
            position: absolute
            top: -8px
            left: 59px
            border: 4px solid rgba(50, 50, 58, .8)
            border-top: 4px solid transparent
            border-left: 4px solid transparent
            border-right: 4px solid transparent
      .title
        margin-left :10px
        color: #333333;
    .section
      padding :31px 15px
      font-family: $font-family-medium
      font-size: 30px;
      color: #333333;
      letter-spacing: 1px;
      text-align: center;
      line-height: 30px;
    .footer
      layout(row,block,nowrap)
      justify-content :space-between
      .item-f
        color: #999999;
</style>
