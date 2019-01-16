<template>
  <transition name="fade">
    <div @touchmove.prevent>
      <navigation></navigation>
      <section class="home">
        <top-bar></top-bar>
        <div :class="panelStyle">
          <router-view :key="$route.fullPath" @showNoData="showNoData" @hideNoData="hideNoData"></router-view>
          <div class="no-data">
            <div v-if="showNull" class="blank">
              <div class="blank-icon"></div>
              <div class="blank-title">暂无相关数据</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navigation from './navigation/navigation'
  import TopBar from './top-bar/top-bar'
  import {globalComputed, globalMethods} from '@state/helpers'

  const PAGE_NAME = 'HOME'
  // const PANEL_CNAME = ['container-default', 'container-data', 'container-order']
  const PANEL_CNAME = {
    default: 'container-default',
    '/home/data-overview': 'container-data',
    '/home/order-form-manage': 'container-order'
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: ''
    },
    components: {
      Navigation,
      TopBar
    },
    data() {
      return {
        showNull: false
      // title: ''
      }
    },
    computed: {
      ...globalComputed,
      panelStyle() {
        let cname = PANEL_CNAME[this.$route.path] || PANEL_CNAME['default']
        return cname
      }
    },
    watch: {
      $route() {
        this.$modal.hideShade()
      }
    },
    created() {
    // console.log(this.$route)
    // console.log(this.$store.dispatch('auth/validate'))
    // this.title = this.currentTitles.length ? this.currentTitles[this.currentTitles.length - 1] : ''
    },
    methods: {
      ...globalMethods,
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
  .home
    layout()
    min-width: 1366px
    min-height: 100vh
    padding-left: 200px
    box-sizing: border-box
    background: #F6FAFC
    &::-webkit-scrollbar
      width: 8px
      height: 10px
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)
    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px
    .container-default
      display: flex
      flex: 1
      margin: 22px
      user-select: text
      card-box-style()
      position :relative
    .container-data
      display :flex
      flex:1
      user-select: text
      margin :22px
      position :relative
    .container-order
      display: flex
      flex: 1
      margin: 65px 22px 22px
      user-select: text
      card-box-style()
      position :relative

    .no-data
      all-center()
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
          color: #999
</style>
