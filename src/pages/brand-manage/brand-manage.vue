<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
        <base-search placeHolder="请输入团长名称" @search="search"></base-search>
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
            <span v-if="val.class === 'item status'" class="before" :class="{'green': true}">{{(val.class === 'item status') ? '已激活' : '未激活'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img src="" class="img" alt="">
              <span class="txt">{{item[val.value] + '' || '---'}}</span>
            </div>
            <div v-if="val.class === 'item handle'" class="list-handle item">
              <span class="handle-item" :class="{'grey': true}" @click="openPop(item)">开通</span>
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
          <span>圣诞节分开了圣诞节</span>
          <span class="closePop" @click="closePop"></span>
        </header>
        <div class="pop-main">
          <p class="end-time">
            <span class="type">到期时间: </span>
            {{endTime}}
          </p>
          <p class="add-time">
            <span class="type">延迟至</span>
            <el-date-picker
              v-model="addTime"
              type="date"
              placeholder="选择日期"
              size="mini"
              style="width:180px"
            >
            </el-date-picker>
          </p>
          <div class="content-btn">
            <div class="btn" @click="closePop">取消</div>
            <div class="btn active" @click="openBusiness">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {BASE_URL} from '@utils/config'
  const PAGE_NAME = 'BRAND_MANAGE'
  const TITLE = '品牌管理'
  const TAB_LIST = [
    {name: '品牌名称', width: '2', value: 'storeName', class: 'item head'},
    {name: '姓名', width: '1', value: 'name', class: 'item'},
    {name: '手机', width: '1', value: 'phone', class: 'item'},
    {name: '门店', width: '1', value: 'num', class: 'item'},
    {name: '状态', width: '1', value: 'status', class: 'item status'},
    {name: '开通时间', width: '1', value: 'date', class: 'item'},
    {name: '操作', width: '1', value: '', class: 'item handle'}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        headerList: TAB_LIST,
        data: [
          {
            storeName: '店铺名称水电费说的',
            name: '姓名大是大非',
            phone: '13584260103',
            num: '50',
            status: '已激活',
            date: '2019-01-11'
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
          content: '全部状态',
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
        // Business.openBusiness({merchant_id: this.merchant_id, expire_time: this.expire_time})
        //   .then((res) => {
        //     if (res.error !== ERR_OK) {
        //       this.$refs.toast.show(res.message)
        //       return
        //     }
        //     this.getBusinessList()
        //     this.$refs.toast.show(res.message)
        //   })
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
            .txt
              no-wrap()
              flex: 1
          .before
            text-indent: 14px
            display: block
            position: relative
          .before:before
            col-center()
            left: 0
            content: ''
            width: 6px
            height: 6px
            border-radius: 10px
            background: #F6262D
          .green:before
            background: #26BD26
          .list-handle
            color: $color-main
            white-space: nowrap
            .handle-item
              cursor: pointer
            .grey
              color: #999
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
</style>
