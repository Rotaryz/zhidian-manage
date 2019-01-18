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
            <sizer-group ref="sizer" :defaultIndex="defaultIndex" @change="checkTime"></sizer-group>
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
              <span v-if="val.class === 'item'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
              <span v-if="val.class === 'item count'" :class="val.class">x{{item[val.value] + '' || '0'}}</span>
              <span v-if="val.class === 'item money'" :class="val.class">¥{{item[val.value]}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bot-page">
        <base-pagination ref="pageDetail" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SizerGroup from '@components/sizer-group/sizer-group'
  import {BASE_URL} from '@utils/config'
  import API from '@api'
  const PAGE_NAME = 'ORDER_FORM'
  const TITLE = '订单管理'
  const TAB_LIST = [
    {name: '订单号', width: '1.5', value: 'code', class: 'item'},
    {name: '商品信息', width: '1.8', value: 'title', class: 'item'},
    {name: '单价', width: '1', value: 'price', class: 'item money'},
    {name: '数量', width: '1', value: 'num', class: 'item count'},
    {name: '实付金额', width: '1', value: 'total', class: 'item money'},
    {name: '业务类型', width: '1', value: 'orderType', class: 'item'},
    {name: '店铺名称', width: '1.2', value: 'shopName', class: 'item'},
    {name: '下单用户', width: '1', value: 'customer', class: 'item'},
    {name: '下单时间', width: '1.5', value: 'date', class: 'item'},
    {name: '状态', width: '1', value: 'status', class: 'item'}
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
        topTab: ['全部', '商品', '服务', '拼团', '砍价'],
        statusTab: ['全部', '待付款', '待结算', '已完成', '已关闭'],
        requestData: {
          order_sn: '',
          status: '',
          order_type: '',
          start_date: '',
          end_date: '',
          date_type: '',
          page: 1,
          limit: 10
        },
        orderType: ['', 8, 1, 4, 7], // 业务类型 3商品 1服务 4团购 7砍价
        status: ['', 'payment', 'waiting_received', 'finish', 'close', 'waiting_groupon', 'refund'], // 全部，待付款，待使用|待结算，已完成，已关闭，待成团，已退款
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        excelUrl: '',
        tabInd: 0,
        tabIdx: 0,
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
        API.OrderForm.getList(this.requestData).then((res) => {
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
        this.excelUrl = `${BASE_URL.api}/api/admin/order/export?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.order_sn = inputTxt
        this.requestData.page = 1
        this.getList()
      },
      changeType(index, item) {
        if (index === this.tabInd) return
        this.requestData = {
          order_sn: '',
          status: '',
          order_type: this.orderType[index],
          start_date: '',
          end_date: '',
          date_type: '',
          page: 1,
          limit: 10
        }
        if (index === 3) {
          this.statusTab = this.statusTab.concat(['待成团', '已退款'])
        } else {
          this.statusTab.splice(5, 2)
        }
        this.$refs.sizer._setTabIndex(4)
        this.$refs.pageDetail.beginPage()
        this.tabIdx = 0
        this.tabInd = index
        this.getList()
      },
      changeTab(index, item) {
        if (index === this.tabIdx) return
        this.requestData.status = this.status[index]
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.tabIdx = index
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
      addPage(num) {
        this.requestData.page = num
        this.getList()
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
        transition-duration: 0.4s
        transition-property: font-size,background
        &:hover
          background: #FFF
      .active
        background: #FFF
        font-family: $font-family-medium
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
        transition: all 0.2s
      .active
        margin-top: 0
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
    .status-tab
      border-bottom: 1px solid #E1E1E1
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
      margin-top: 30px
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
