<template>
  <div class="data-overview">
    <ul class="header">
      <li v-for="(item, index) in headerArray" :key="index" class="h-item">
        <d-header-item :dataInfo="item"></d-header-item>
      </li>
    </ul>
    <section class="charts-wrapper">
      <div class="c-item">
        <d-charts-panel title="用户统计" :chartType="CHATS_DATA_TYPE.user"></d-charts-panel>
      </div>
      <div class="c-item">
        <d-charts-panel title="门店统计" :chartType="CHATS_DATA_TYPE.shop"></d-charts-panel>
      </div>
    </section>
    <section class="charts-wrapper">
      <div class="c-item">
        <d-charts-panel title="订单统计" :chartType="CHATS_DATA_TYPE.order"></d-charts-panel>
      </div>
      <div class="c-item">
        <d-charts-panel title="交易统计" :chartType="CHATS_DATA_TYPE.amount"></d-charts-panel>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {OVERVIEW, CHATS_DATA_TYPE} from './data-config'
  import DHeaderItem from './d-header-item/d-header-item'
  import DChartsPanel from './d-charts-panel/d-charts-panel'

  const PAGE_NAME = 'DATA_OVERVIEW'
  const TITLE = '数据统计'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DHeaderItem,
      DChartsPanel
    },
    data() {
      return {
        headerArray: OVERVIEW,
        CHATS_DATA_TYPE: CHATS_DATA_TYPE
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
    .charts-wrapper
      margin-top :25px
      layout(row,block,nowrap)
      .c-item
        flex:1
        margin-right: 25px
        &:last-child
          margin-right :0

</style>
