<template>
  <div class="data-overview">
    <ul class="header">
      <li v-for="(item, index) in headerArray" :key="index" class="h-item">
        <d-header-item :dataInfo="item"></d-header-item>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {OVERVIEW} from './data-config'
  import DHeaderItem from './d-header-item/d-header-item'

  const PAGE_NAME = 'DATA_OVERVIEW'
  const TITLE = '数据统计'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DHeaderItem
    },
    data() {
      return {
        headerArray: OVERVIEW,
      }
    },
    created() {
      this._getTotalMode()
    },
    methods: {
      _getTotalMode() {
        API.Data.getTotalMode().then((res) => {
          this.headerArray = res.data
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .data-overview
    flex: 1
    display: flex
    border-radius: 6px
    flex-direction: column
    .header
      layout(row,block,nowrap)
      .h-item
        flex: 1
        margin-right :25px
        &:last-child
          margin-right :0

</style>
