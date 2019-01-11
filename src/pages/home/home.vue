<template>
  <transition name="fade">
    <div @touchmove.prevent>
      <navigation></navigation>
      <section class="home">
        <top-bar></top-bar>
        <div :class="panelStyle">
          <router-view :key="$route.fullPath"></router-view>
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
  const PANEL_CNAME = ['container-default', 'container-data']

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
      // title: ''
      }
    },
    computed: {
      ...globalComputed,
      panelStyle() {
        let index = 0
        if (this.$route.path.includes('data-overview')) {
          index = 1
        }
        return PANEL_CNAME[index]
      }
    },
    created() {
    // console.log(this.$route)
    // console.log(this.$store.dispatch('auth/validate'))
    // this.title = this.currentTitles.length ? this.currentTitles[this.currentTitles.length - 1] : ''
    },
    methods: {
      ...globalMethods
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
    background: $color-background
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
    .container-data
      display :flex
      flex:1
      user-select: text
      margin :22px
</style>
