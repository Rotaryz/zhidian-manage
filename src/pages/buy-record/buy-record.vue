<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group @change="timeChange"></sizer-group>
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
            <span :class="val.class">{{item[val.value] + '' || '---'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bot-page">
      <base-pagination ref="pageDetail" :pageDtail="pageDetail" @addPage="addPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SizerGroup from '@components/sizer-group/sizer-group'
  import {BASE_URL} from '@utils/config'
  const PAGE_NAME = 'BRAND_MANAGE'
  const TITLE = '品牌管理'
  const TAB_LIST = [
    {name: '订单号', width: '1', value: 'code', class: 'item head'},
    {name: '交易号', width: '1', value: 'orderCode', class: 'item'},
    {name: '交易金额', width: '1', value: 'orderMoney', class: 'item'},
    {name: '交易类型', width: '1', value: 'orderType', class: 'item'},
    {name: '付款人', width: '1', value: 'person', class: 'item'},
    {name: '支付时间', width: '1', value: 'date', class: 'item'}
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
        data: [
          {
            code: '5415645612132',
            orderCode: '564541465',
            orderMoney: '100',
            orderType: '支付',
            person: '啦啦啦',
            date: '2019.1.11 10:20:00',
          }
        ],
        requestData: {
          keyword: '',
          sort_type: '',
          page: 1,
          limit: 10
        },
        handleIndex: 0,
        dispatchSelect: {
          check: false,
          show: false,
          content: '交易类型',
          type: 'default',
          data: [{name: '1'}, {name: '2'}]
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        endTime: '',
        addTime: '',
        expire_time: '',
        typeId: '',
        excelUrl: ''
      }
    },
    watch: {
      addTime(date, oldDate) {
        this.addDate()
      }
    },
    methods: {
      timeChange(time, type) {
        let date = ''
        if (type) {
          date = time[0].toLocaleDateString()
            .replace(/\//g, '-')
            .replace(/\b\d\b/g, '0$&')
        } else {
          date = time
        }
        console.log(date, type)
      },
      getBrandList() {
        let accessToken = `access_token=${this.$storage.get('aiToken')}`
        this.excelUrl = `${BASE_URL.api}/api/admin/merchant-list-export?${accessToken}`
      },
      search(inputTxt) {
        this.requestData.keyword = inputTxt
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData.sort_type = ''
        this.getMemberList()
      },
      setValue(item) {
        this.typeId = item.id
      },
      addDate() {
        this.expire_time = this.addTime
          .toLocaleDateString()
          .replace(/\//g, '-')
          .replace(/\b\d\b/g, '0$&')
      // this.addTime.toLocaleDateString().replace(/\//g, '-')
      },
      addPage(num) {
        this.requestData.page = num
        this.getMemberList()
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
    padding: 0 1.5vw
    box-sizing: border-box
    font-family: $font-family-regular
    .content-top
      display: flex
      justify-content: space-between
      align-items: center
      min-height: 88px
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
        padding-left: 2vw
        border-bottom: 0.5px solid $color-line
        .header-key
          flex: 1
          overflow: hidden
          &:last-child
            flex: 1.5
      .list-content
        .list-item
          height: 60px
          flex: 1
          display: flex
          align-items: center
          justify-content: space-between
          padding-left: 2vw
          box-sizing: border-box
          border-bottom: 0.5px solid $color-line
          text-align: left
          .item-box
            no-wrap()
          .item
            flex: 1
            line-height: 18px
            padding-right: 20px
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
      height: 60px
      display: flex
      align-items: center
</style>
