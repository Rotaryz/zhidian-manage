<template>
  <div class="test-page">
    data-page
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TEST_PAGE'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-page
    height :100%
    background yellowgreen
</style>
