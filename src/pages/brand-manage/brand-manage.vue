<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
        <base-search placeHolder="请输入名称" @search="search"></base-search>
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
            <span v-if="val.class === 'item name'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
            <router-link v-if="val.class === 'item num'" tag="a" target="_blank" :to="encodeUrl(item.id)" :class="val.class"
                         class="hand"
            >{{item[val.value] + '' || '---'}}</router-link>
            <!--<span v-if="val.class === 'item status'" class="before" :class="{'green': +item.actived === 1}">{{(+item.actived === 1) ? '已激活' : '未激活'}}</span>-->
            <span v-if="val.class === 'item status'" class="before" :class="{'green': +item.type !== 0}">{{(+item.type !== 0) ? '已开通' : '未开通'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img v-if="item.url" :src="item.url" class="img" alt="">
              <img v-else :src="defaultUrl" class="img">
              <span class="txt">{{item[val.value] + '' || '---'}}</span>
            </div>
            <div v-if="val.class === 'item handle'" class="list-handle item">
              <span class="handle-item" :class="{'grey': +item.type !== 0}" @click="openPop(item)">开通</span>
              <span class="handle-item" @click="showPower(item)">越权</span>
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
          <span>开通</span>
          <span class="closePop" @click="closePop"></span>
        </header>
        <div class="pop-main">
          <p class="tip-txt">确定开通“{{openItem.storeName}}”品牌的多店功能吗？</p>
          <div class="content-btn">
            <div class="btn" @click="closePop">取消</div>
            <div class="btn active" @click="openBusiness">确定</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="powerShow" class="over-power">
      <div class="power-content" :class="showActive ? 'model-active' : 'model-noactive'">
        <span class="close" @click="hidePower"></span>
        <p class="mobile txt">手机号：{{powerItem.phone}}</p>
        <p class="txt">越权验证码：{{code}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {HEAD_IMAGE} from '@utils/constant'
  import API from '@api'
  const PAGE_NAME = 'BRAND_MANAGE'
  const TITLE = '品牌管理'
  const TAB_LIST = [
    {name: '品牌名称', width: '2', value: 'storeName', class: 'item head'},
    {name: '姓名', width: '1', value: 'name', class: 'item name'},
    {name: '手机', width: '1', value: 'phone', class: 'item'},
    {name: '门店数', width: '1', value: 'num', class: 'item num'},
    {name: '开通品牌', width: '1', value: 'actived', class: 'item status'},
    {name: '开通时间', width: '1.3', value: 'date', class: 'item'},
    {name: '操作', width: '1', value: 'type', class: 'item handle'}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        headerList: TAB_LIST,
        data: [],
        requestData: {
          keyword: '',
          type: '',
          page: 1,
          limit: 10
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}, {name: '已开通', id: 1}, {name: '未开通', id: 0}]
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        addTime: '',
        endTime: '',
        showPop: false,
        showActive: false,
        openItem: {},
        defaultUrl: HEAD_IMAGE,
        powerShow: false,
        powerItem: {},
        code: '',
        codeUsed: ''
      }
    },
    created() {
      this.$emit('hideNoData')
      this.getList()
    },
    methods: {
      getList() {
        API.Brand.getList(this.requestData).then((res) => {
          this.pageDetail = res.obj
          this.data = res.arr
          if (res.arr.length === 0) {
            this.$emit('showNoData')
          } else {
            this.$emit('hideNoData')
          }
        })
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.keyword = inputTxt
        this.requestData.page = 1
        this.getList()
      },
      // 选择品牌类型
      setValue(item) {
        this.requestData.type = item.id
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getList()
      },
      // 跳转到门店管理
      encodeUrl(id) {
        let url = `/home/business-manage/store-manage?merchantId=${id}`
        return url
      },
      openPop(item) {
        if (+item.type !== 0) return
        // 打开弹窗
        this.$modal.showShade()
        this.showPop = true
        this.showActive = true
        this.openItem = item
      },
      openBusiness() {
        this.closePop()
        API.Brand.open(this.openItem.id).then((res) => {
          this.$toast.show('开通成功')
          this.data = this.data.map((item) => {
            if (item.id === this.openItem.id) {
              item.type = 1
            }
            return item
          })
        })
      },
      closePop() {
        // 关闭弹窗
        this.$modal.hideShade()
        setTimeout(() => {
          this.showPop = false
        }, 200)
        this.showActive = false
      },
      // 越权
      showPower(item) {
        API.Brand.getCode({mobile: item.phone}).then((res) => {
          this.$modal.showShade()
          this.powerShow = true
          this.powerItem = item
          this.code = res.data.code
          this.codeUsed = res.data.sss
          this.showActive = true
        })
      },
      hidePower() {
        this.$modal.hideShade()
        setTimeout(() => {
          this.powerShow = false
        }, 200)
        this.showActive = false
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
          .num
            color: $color-main
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
              border: 1px solid #D9D9D9
            .txt
              no-wrap-plus()
              white-space: normal
              flex: 1
          .before
            text-indent: 14px
            display: block
            position: relative
          .before:before
            col-center()
            left: 0
            content: ''
            width: 8px
            height: 8px
            border-radius: 10px
            background: #FD6347
          .green:before
            background: #01CAA9
          .list-handle
            color: $color-main
            white-space: nowrap
            .handle-item
              cursor: pointer
              user-select: none
              padding: 0 10px
              display: inline-block
              line-height: 14px
              border-left: 1px solid #D9D9D9
              &:nth-of-type(1)
                border-left: 0
                padding-left: 0
            .grey
              color: #999
              cursor: auto
    .bot-page
      padding-top: 40px
      padding-bottom: 30px
  .pop-box,.over-power
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
        .tip-txt
          margin-top: 20px
          padding-bottom: 30px
          display: flex
          align-items: center
          font-size: $font-size-16
          color: $color-text-main
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
            transition: all 0.3s ease-out
            &.active
              background: #4D5AFF
              color: #FFF
              border: 0
              margin-left: 20px
            &:hover
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
    .power-content
      width: 400px
      height: 200px
      background: #FFF
      border-radius: 3px
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
      position: relative
      .close
        bg-image('./icon-del2')
        width: 16px
        height: 16px
        cursor: pointer
        position: absolute
        right: 15px
        top: 15px
        background-size: 100% 100%
      .txt
        text-align: center
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-16
        line-height: 30px
      .mobile
        margin-top: 70px
      .grey
        color: #999
        fonts-size: $font-size-12

</style>
