<template>
  <div class="big-box">
    <div class="top-tab">
      <ul>
        <li
          v-for="(item, index) in topTab"
          :key="index"
          class="tab-item"
          :class="{'active':tabInd === index}"
          @click="changeType(index, item)"
        >{{item}}</li>
      </ul>
    </div>
    <div class="brand-manage">
      <div class="lib">
        <span v-for="(item, index) in topTab" :key="index" class="lib-item" :class="{'active':tabInd === index}"></span>
      </div>
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
      <div class="status-tab">
        <div class="left-box">
          <div class="tab-box">
            <div v-for="(item, index) in statusTab" :key="index" class="tab-item" :class="tabIdx == index ? 'active' : ''" @click="changeTab(index, item)">
              {{item}}
            </div>
          </div>
          <div class="underline-box" :style="'transform: translate(' + tabIdx*100 + '%,0)'">
            <div class="underline"></div>
          </div>
        </div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import SizerGroup from '@components/sizer-group/sizer-group'
  import {BASE_URL} from '@utils/config'
  const PAGE_NAME = 'BRAND_MANAGE'
  const TITLE = '品牌管理'
  const TAB_LIST = [
    {name: '订单号', width: '1', value: 'code', class: 'item'},
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
            date: '2019.1.11 10:20:00'
          }
        ],
        topTab: ['全部', '服务', '拼团', '砍价'],
        statusTab: ['全部', '待付款', '待结算', '已完成', '已关闭'],
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
        excelUrl: '',
        tabInd: 0,
        tabIdx: 0
      }
    },
    watch: {
      addTime(date, oldDate) {
        this.addDate()
      }
    },
    methods: {
      getRecordList() {
        let accessToken = `access_token=${this.$storage.get('aiToken')}`
        this.excelUrl = `${BASE_URL.api}/api/admin/merchant-list-export?${accessToken}`
      },
      changeType(index, item) {
        this.tabInd = index
      },
      changeTab(index, item) {
        this.tabIdx = index
        console.log(index, item)
      },
      timeChange(time, type) {
        let date = ''
        if (type) {
          let startTime = time[0]
            .toLocaleDateString()
            .replace(/\//g, '-')
            .replace(/\b\d\b/g, '0$&')
          let endTime = time[1]
            .toLocaleDateString()
            .replace(/\//g, '-')
            .replace(/\b\d\b/g, '0$&')
          date = [startTime, endTime]
        } else {
          date = time
        }
        console.log(date, type)
      },
      search(inputTxt) {
        this.requestData.keyword = inputTxt
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData.sort_type = ''
        this.getRecordList()
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
        this.getRecordList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .big-box
    display: flex
    flex: 1
    position: relative
    .top-tab
      position: absolute
      top: -40px
      left: 0
      height: 40px
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-regular
      z-index: 1
      .tab-item
        width: 97px
        height: 40px
        background: #F8F8F8
        margin-right: 4px
        display: inline-block
        position: relative
        text-align: center
        line-height: @height
        cursor: pointer
        border-radius: 4px 4px 0 0
        box-shadow: 0 1px 6px 0 rgba(0,8,39,0.10)
        transition: font-size 0.2s
      .active
        background: #FFF
        font-size: $font-size-16
        font-family: $font-family-medium
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
    position: relative
    z-index: 1
    .lib
      position: absolute
      left: 0
      top: -3px
      height:3px
      .lib-item
        width: 97px
        height: 6px
        background: #FFF
        float: left
        margin-top: 3px
        margin-right: 4px
      .active
        margin-top: 0
    .content-top
      display: flex
      justify-content: space-between
      align-items: center
      min-height: 88px
      .left
        display: flex
      .status
        margin-right: 10px
    .status-tab
      border-bottom: 1px solid $color-line
      width: 100%
      height: 45px
      display: flex
      .left-box
        flex: 1
        overflow: hidden
        position: relative
        .tab-box
          width: 100%
          height: 45px
          display: flex
        .tab-item
          width: 108px
          height: 45px
          line-height: 44px
          text-align: center
          font-size: $font-size-14
          color: $color-text-main
          font-family: $font-family-regular
          letter-spacing: 0.8px
          cursor: pointer
        .tab-item.active
          font-family: $font-family-medium
      .underline-box
        height: 2px
        position: absolute
        bottom: 0
        width: 108px
        display: flex
        justify-content: center
        transform: translate(0, 0)
        transition: all 0.3s
        .underline
          width: 34px
          height: 2px
          background: $color-main
          border-radius: 3px
  .right-box
    width: 65px
    line-height: 45px
    display: flex
    align-items: center
    justify-content: center
    font-size: $font-size-14
    color: $color-27273E
    position: relative
    &::before
      content: ""
      width: 1px
      height: 14px
      background: $color-706B82
      position: absolute
      left: 0
      top: 50%
      transform: translate(0, -50%)
    .right-icon
      width: 11px
      height: 11px
      margin-left: 2px
      display: block
    .right-name.active
      color: $color-D32F2F

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
            padding-right: 10px
          .item
            flex: 1
            line-height: 18px
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
