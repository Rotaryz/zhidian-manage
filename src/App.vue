<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import appConfig from '@utils/app.config2'

  export default {
    page: {
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title
        return title ? `${title} | ${appConfig.title}` : appConfig.title
        // return title
      }
    },
    created() {
    // console.log(this.$route)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "./design/_globals.styl"
  @import "~nprogress/nprogress.css"

  #nprogress .bar
    background: $color-main !important

  #nprogress .peg
    box-shadow: 0 0 10px $color-main, 0 0 5px $color-main !important
</style>
