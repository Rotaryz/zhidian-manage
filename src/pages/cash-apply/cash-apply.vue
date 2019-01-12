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
        <base-search placeHolder="请输入昵称、手机号" @search="search"></base-search>
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
            <div v-if="val.class === 'item status'" class="item status">
              <span class="txt-content">水电费水电费</span>
              <span class="icon"></span>
            </div>
            <div v-if="val.class === 'item handle'" class="list-handle item">
              <span class="handle-item" @click="openPop(item)">审核</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bot-page">
      <base-pagination ref="pageDetail" :pageDtail="pageDetail" @addPage="addPage"></base-pagination>
    </div>

    <div v-show="showPop" class="pop-box">
      <div class="pop-content" :class="showActive ? 'model-active' : 'model-noactive'">
        <header class="title">
          <span>监考老师的积分</span>
          <span class="closePop" @click="closePop"></span>
        </header>
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
    {name: '订单号', width: '1.3', value: 'orderCode', class: 'item'},
    {name: '提交时间', width: '1.2', value: 'date', class: 'item'},
    {name: '帐号', width: '1', value: 'account', class: 'item'},
    {name: '可提现金额', width: '1', value: 'canCashMoney', class: 'item'},
    {name: '冻结金额', width: '1', value: 'freezeMoney', class: 'item'},
    {name: '提现金额', width: '1', value: 'cashMoney', class: 'item'},
    {name: '真实姓名', width: '1', value: 'nickName', class: 'item'},
    {name: '银行类型', width: '1', value: 'cardType', class: 'item'},
    {name: '银行卡号', width: '1', value: 'cardNum', class: 'item'},
    {name: '提现状态', width: '1.4', value: 'status', class: 'item status'},
    {name: '操作', width: '0.7', value: '', class: 'item handle'}
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
            orderCode: '465564654',
            date: '2019.1.11 11:00:00',
            account: '13545645664',
            canCashMoney: '2000.00',
            freezeMoney: '1000.00',
            cashMoney: '1000.00',
            nickName: '某某',
            cardType: '建设银行',
            cardNum: '****',
            status: '1'
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
          content: '处理状态',
          type: 'default',
          data: [{name: '1'}, {name: '2'}]
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        showPop: false,
        showActive: false,
        popName: '',
        merchant_id: '',
        showPopContent: '',
        endTime: '',
        addTime: '',
        expire_time: '',
        typeId: ''
      }
    },
    watch: {
      addTime(date, oldDate) {
        this.addDate()
      }
    },
    methods: {
      getApplyList() {
        let accessToken = `access_token=${this.$storage.get('aiToken')}`
        this.excelUrl = `${BASE_URL.api}/api/admin/merchant-list-export?${accessToken}`
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
        this.getApplyList()
      },
      setValue(item) {
        this.typeId = item.id
      },
      openPop(item) {
        // 打开弹窗
        this.$modal.showShade()
        this.showPop = true
        this.showActive = true
        this.popName = item.name
        this.merchant_id = item.id
      },
      addDate() {
        this.expire_time = this.addTime
          .toLocaleDateString()
          .replace(/\//g, '-')
          .replace(/\b\d\b/g, '0$&')
      // this.addTime.toLocaleDateString().replace(/\//g, '-')
      },
      openBusiness() {
        if (!this.expire_time) {
          this.$refs.toast.show('请选择延迟日期')
          return
        }
        if (new Date(this.expire_time) < new Date(this.endTime)) {
          this.$refs.toast.show('选择日期应大于到期日期')
          return
        }
        this.closePop()
      },
      closePop() {
        // 关闭弹窗
        this.$modal.hideShade()
        setTimeout(() => {
          this.showPop = false
        }, 200)
        this.showActive = false
        this.expire_time = ''
      },
      addPage(num) {
        this.requestData.page = num
        this.getApplyList()
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
            padding-right: 10px
          .item
            flex: 1
            line-height: 18px
          .status
            display: flex
            align-items: center
            .icon
              width: 14px
              height: 14px
              margin-left: 4px
              icon-image(icon-help)
          .list-handle
            color: $color-main
            white-space: nowrap
            .handle-item
              padding: 0 7px
              border-left: 0.5px solid #B5B5B5
              cursor: pointer
              height: 14px
              line-height: 14px
              display: inline-block
              &:first-child
                border-left: 0
                padding-left: 0
    .bot-page
      height: 60px
      display: flex
      align-items: center
  .pop-box
      z-index: 1001
      position: fixed
      top: 0
      left: 200px
      bottom: 0
      right: 0
      display: flex
      align-items: center
      justify-content: center
      .pop-content
        width: 530px
        min-height: 260px
        background: #FFF
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
        .title
          height: 60px
          border-bottom: 0.5px solid #E8E8E8
          font-size: 16px
          padding: 0 30px
          box-sizing: border-box
          color: $color-text-main
          display: flex
          justify-content: space-between
          align-items: center
          .closePop
            bg-image('./icon-del2')
            width: 16px
            height: 16px
            cursor: pointer
            background-size: 100% 100%
        .pop-main
          padding: 20px 30px
          text-align: left
          .input-box-big
            input-animate(#999, 0px, 471px, 91px)
          .popTxt
            padding: 8px
            resize: none
            font-size: 14px
            width: 100%
            height: 90px
            outline: none
            box-sizing: border-box
            border: 0.5px solid $color-line
            &::-webkit-input-placeholder
              color: #CCC
          .reasonTxt
            padding: 8px
            resize: none
            font-size: 14px
            width: 100%
            height: 90px
            box-sizing: border-box
            border: 0.5px solid $color-line
            color: $color-text-main
            background: #f5f7fb
          .content-btn
            display: flex
            justify-content: flex-end
            margin-top: 27px
            .btn
              width: 96px
              height: 40px
              cursor: pointer
              border: 0.5px solid #ccc
              border-radius: 3px
              text-align: center
              box-sizing: border-box
              font-family: $font-family-regular
              line-height: 40px
              font-size: 16px
              color: $color-text-main
              transition: all 0.4s ease-out
              &.active
                background: #4985FC
                color: #FFF
                border: 0
                margin-left: 20px
              &:hover
                transition: all 0.4s ease-out
                font-size: 17px
          .type
            display: inline-block
            width: 70px
          .end-time
            margin-top: 17px
          .add-time
            margin-top: 20px
          .content-btn
            margin-top: 40px
          .xcx-img
            width: 238px
            height: @width
          .load-img
            width: 40px
            height: 40px
          .add-call
            margin-top: 20px
            padding-bottom: 30px
            display: flex
            align-items: center
            .phone-box
              margin-left: 10px
              input-animate(#999, 3px, 181px, 31px, -1px, -1px, -1px)
            .phone-num
              width: 180px
              height: 30px
              outline: none
              line-height: 30px
              border: 0.5px solid $color-line
              border-radius: 3px
              padding: 0 5px
              box-sizing: border-box
          .cancelPower
            margin-top: 20px
            padding-bottom: 40px
        .code
          display: flex
          height: 260px
          justify-content: center
          align-items: center
</style>
