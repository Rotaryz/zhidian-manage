<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group :defaultIndex="defaultIndex" @change="checkTime"></sizer-group>
        </div>
        <div class="status">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
        <base-search placeHolder="请输入订单号" @search="search"></base-search>
      </div>
      <a :href="excelUrl" class="excel" target="_blank">导出Excel</a>
    </div>
    <div class="content-list">
      <div class="list-header">
        <div v-for="(item, index) in headerList"
             :key="index"
             class="header-key"
             :style="{flex: item.width}"
        >
          <span class="contxt">{{item.name}}</span>
        </div>
      </div>
      <div class="list-content">
        <div v-for="(item, index) in data" :key="index" class="list-item">
          <div
            v-for="(val, ind) in headerList"
            :key="ind"
            :style="{flex: val.width}"
            class="item-box"
          >
            <span v-if="val.class === 'item'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
            <span v-if="val.class === 'item name'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
            <span v-if="val.class === 'item money'" :class="val.class">¥{{item[val.value]}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bot-page">
      <base-pagination ref="pageDetail" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SizerGroup from '@components/sizer-group/sizer-group'
  import {BASE_URL} from '@utils/config'
  import API from '@api'
  const PAGE_NAME = 'BUY_RECORD'
  const TITLE = '交易记录'
  const TAB_LIST = [
    {name: '订单号', width: '1.3', value: 'code', class: 'item'},
    {name: '交易号', width: '1.3', value: 'orderCode', class: 'item'},
    {name: '交易金额', width: '1', value: 'orderMoney', class: 'item money'},
    {name: '业务类型', width: '1', value: 'orderType', class: 'item'},
    {name: '交易类型', width: '1', value: 'isRefund', class: 'item'},
    {name: '付款人', width: '1.2', value: 'person', class: 'item name'},
    {name: '支付时间', width: '1.3', value: 'date', class: 'item'}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      SizerGroup
    },
    data() {
      return {
        headerList: TAB_LIST,
        data: [],
        requestData: {
          order_sn: '',
          is_refund: '-1',
          start_date: '',
          end_date: '',
          date_type: '',
          page: 1,
          limit: 10
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '交易类型',
          type: 'default',
          data: [{name: '全部', id: '-1'}, {name: '退款', id: 1}, {name: '支付', id: 0}]
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        excelUrl: '',
        defaultIndex: 4
      }
    },
    created() {
      this.getList()
      this.$emit('hideNoData')
    },
    methods: {
      // 获取列表
      getList() {
        API.BuyRecord.getList(this.requestData).then((res) => {
          this.pageDetail = res.obj
          this.data = res.arr
          if (res.arr.length === 0) {
            this.$emit('showNoData')
          } else {
            this.$emit('hideNoData')
          }
        })
        this.getExcelUrl()
      },
      // 导出地址
      getExcelUrl() {
        let query = ''
        for (let item in this.requestData) {
          if (item !== 'limit' && item !== 'page') {
            query += `&${item}=${this.requestData[item]}`
          }
        }
        let accessToken = `access_token=${this.$storage.get('token')}`
        this.excelUrl = `${BASE_URL.api}/api/admin/pay-trade/export?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.order_sn = inputTxt
        this.requestData.page = 1
        this.getList()
      },
      // 自定义日期选择
      checkTime(status) {
        if (status instanceof Array) {
          this.requestData.start_date = status[0]
          this.requestData.end_date = status[1]
          this.requestData.date_type = 'custom'
        } else {
          this.requestData.date_type = status
          this.requestData.start_date = ''
          this.requestData.end_date = ''
        }
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getList()
      },
      // 选择交易类型
      setValue(item) {
        this.requestData.is_refund = item.id
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getList()
      },
      addPage(num) {
        this.requestData.page = num
        this.getList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .brand-manage
    display: flex
    flex: 1
    flex-direction: column
    background: $color-white
    border-radius: 5px
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    padding: 0 30px
    box-sizing: border-box
    font-family: $font-family-regular
    .content-top
      display: flex
      justify-content: space-between
      align-items: center
      padding-top: 37px
      padding-bottom: 30px
      .left
        display: flex
      .status
        margin-right: 10px
    .content-list
      text-align: left
      flex: 1
      font-size: 14px
      color: $color-text-main
      .list-header
        flex: 1
        background: #FAFAFA
        height: 50px
        line-height: 50px
        font-family: $font-family-medium
        display: flex
        justify-content: space-between
        padding-left: 40px
        border-bottom: 0.5px solid $color-line
        .header-key
          flex: 1
          overflow: hidden
          padding-right: 20px
          &:last-child
            flex: 1.5
      .list-content
        .list-item
          height: 70px
          flex: 1
          display: flex
          align-items: center
          justify-content: space-between
          padding-left: 40px
          box-sizing: border-box
          border-bottom: 0.5px solid $color-line
          text-align: left
          .item-box
            no-wrap()
            padding-right: 20px
          .item
            flex: 1
            line-height: 18px
          .name
            no-wrap-plus()
            white-space: normal
          .head
            display: flex
            align-items: center
            .img
              margin-right: 10px
              width: 40px
              height: 40px
              object-fit: cover
              background: #f5f5f5
    .bot-page
      padding-top: 40px
      padding-bottom: 30px
</style>
