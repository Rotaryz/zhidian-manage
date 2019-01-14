<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group @change="checkTime"></sizer-group>
        </div>
        <div class="status">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
        <base-search placeHolder="请输入订单号" @search="search"></base-search>
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
              <span class="txt-content">{{item.status}}</span>
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
      <base-pagination ref="pageDetail" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
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
  import API from '@api'
  const PAGE_NAME = 'CASH_APPLY'
  const TITLE = '提现记录'
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
        data: [],
        requestData: {
          withdraw_sn: '',
          status: '-1',
          start_date: '',
          end_date: '',
          date_type: 'today',
          page: 1,
          limit: 10
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '处理状态',
          type: 'default',
          data: [{name: '待审核', id: 0}, {name: '微信受理成功', id: 1}, {name: '审核不通过', id: 2}, {name: '微信打款成功', id: 3}, {name: '微信打款失败', id: 4}]
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
        showPopContent: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 获取列表
      getList() {
        API.CashApply.getList(this.requestData)
          .then(res => {
            this.pageDetail = res.obj
            this.data = res.arr
          })
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.withdraw_sn = inputTxt
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
      // 选择处理状态
      setValue(item) {
        this.requestData.status = item.id
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getList()
      },
      openPop(item) {
        // 打开弹窗
        this.$modal.showShade()
        this.showPop = true
        this.showActive = true
        this.popName = item.name
        this.merchant_id = item.id
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
