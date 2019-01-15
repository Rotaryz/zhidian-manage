<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <base-search placeHolder="请输入手机号/姓名/品牌" @search="search"></base-search>
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
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item.name}}</span>
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
            <div v-if="val.class === 'item head'" class="head item">
              <img v-if="item.url" :src="item.url" class="img" alt="">
              <div v-else class="img"></div>
              <span class="txt">{{item[val.value] + '' || '---'}}</span>
            </div>
            <div v-if="val.class === 'item handle'" class="list-handle item">
              <span class="handle-item" @click="openPop('look', item)">查看</span>
              <span class="handle-item" @click="openPop('freeze', item)">{{+item.status === 3 ? '解冻' : '冻结'}}</span>
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
          <span>{{popName}}</span>
          <span class="closePop" @click="closePop"></span>
        </header>
        <div v-if="showPopContent === 1 || showPopContent === 2" class="pop-main">
          <div v-if="showPopContent === 1" class="input-box-big">
            <span class="after"></span>
            <textarea v-model="popTxt" class="popTxt" maxlength="100" placeholder="备注原因"></textarea>
            <span class="before"></span>
          </div>
          <div v-if="showPopContent === 2" class="reasonTxt">冻结原因：{{reasonTxt}}</div>
          <div class="content-btn">
            <div class="btn" @click="closePop">取消</div>
            <div class="btn active" @click="operate">{{showPopContent === 1 ? '冻结' : '解冻'}}</div>
          </div>
        </div>
        <div v-if="showPopContent === 3" class="pop-main code">
          <img v-if="!loadImg" key="1" :src="codeUrl" alt="" class="xcx-img">
          <img v-if="loadImg" key="2" src="./loading.gif" alt="" class="load-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {BASE_URL} from '@utils/config'
  import API from '@api'
  const PAGE_NAME = 'STORE_MANGE'
  const TITLE = '店铺管理'
  const SWITCH = [0, 1]
  const TAB_LIST = [
    {name: '店铺名称', width: '1.8', value: 'storeName', class: 'item head'},
    {name: '姓名', width: '1', value: 'name', class: 'item'},
    {name: '手机', width: '1', value: 'phone', class: 'item'},
    {name: '品牌', width: '1.8', value: 'brand', class: 'item'},
    {name: '访客', width: '1', value: 'business', class: 'item'},
    {name: '交易订单', width: '1', value: 'code', class: 'item'},
    {name: '交易金额', width: '1', value: 'money', class: 'item'},
    {name: '开通时间', width: '1.5', value: 'date', class: 'item'},
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
        data: [],
        requestData: {
          keyword: '',
          sort_type: '',
          page: 1,
          limit: 10
        },
        handleIndex: 0,
        headClass: {
          class4: '',
          class5: '',
          class6: ''
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        excelUrl: '',
        showPop: false,
        showActive: false,
        popName: '',
        showPopContent: '',
        loadImg: false,
        codeUrl: '',
        popTxt: '',
        reasonTxt: '',
        merchant_id: ''
      }
    },
    created() {
      this.getList()
      this.$modal.hideNoData()
    },
    methods: {
      getList() {
        API.Store.getList(this.requestData).then((res) => {
          this.pageDetail = res.obj
          this.data = res.arr
          if (res.arr.length === 0) {
            this.$modal.showNoData()
          } else {
            this.$modal.hideNoData()
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
        this.excelUrl = `${BASE_URL.api}/api/admin/stores/report?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData = {
          keyword: inputTxt,
          start_date: this.requestData.start_date,
          end_data: this.requestData.end_data,
          date_type: this.requestData.date_type,
          sort_type: '',
          sort: '',
          page: 1,
          limit: 10
        }
        this.getList()
      },
      handleClick(num) {
        switch (num) {
        case 4:
          this.requestData.sort_type = 7
          break
        case 5:
          this.requestData.sort_type = 1
          break
        case 6:
          this.requestData.sort_type = 3
          break
        }
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
            switch (num) {
            case 4:
              this.requestData.sort_type = 8
              break
            case 5:
              this.requestData.sort_type = 2
              break
            case 6:
              this.requestData.sort_type = 4
              break
            }
          } else {
            this.headClass[`class${num}`] = 'down'
          }
        } else {
          this.handleIndex = num
          for (let val in this.headClass) {
            this.headClass[val] = ''
          }
          this.headClass[`class${num}`] = 'down'
        }
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
        this.getList()
      },
      openPop(type, item) {
        // 打开弹窗
        this.$modal.showShade()
        this.showPop = true
        this.showActive = true
        this.merchant_id = item.id
        switch (type) {
        case 'freeze':
          if (+item.status === 3) {
            this.popName = `解冻${item.storeName}店铺`
            this.reasonTxt = item.reason
            this.showPopContent = 2
          } else {
            this.popName = `冻结${item.storeName}店铺`
            this.showPopContent = 1
          }
          break
        case 'look':
          this.viewQrcode()
          this.popName = '查看"' + item.storeName + '"店铺'
          this.showPopContent = 3
          break
        }
      },
      viewQrcode() {
        this.loadImg = true
        API.Store.getQrcode(this.merchant_id).then((res) => {
          this.loadImg = false
          this.codeUrl = res.data.image_url
        })
      },
      operate() {
        // 1冻结  2解冻
        if (this.showPopContent === 1) {
          this.frozenStore()
        } else {
          this.unFrozenStore()
        }
      },
      frozenStore() {
        // if (!this.popTxt || this.popTxt.replace(/^\s+|\s+$/g, '') === '') {
        //   this.$toast.show('请填写冻结原因')
        //   return
        // }
        API.Store.freeze({switch: SWITCH[1], reason: this.popTxt, id: this.merchant_id}).then((res) => {
          this.$toast.show('操作成功')
          this.data = this.data.map(item => {
            if (item.id === res.data.id) {
              item.reason = res.data.freeze_reason
              item.status = res.data.status
            }
            return item
          })
        })
        this.closePop()
      },
      unFrozenStore() {
        API.Store.freeze({switch: SWITCH[0], reason: this.reasonTxt, id: this.merchant_id}).then((res) => {
          this.$toast.show('操作成功')
          this.data = this.data.map(item => {
            if (item.id === res.data.id) {
              item.reason = res.data.freeze_reason
              item.status = res.data.status
            }
            return item
          })
        })
        this.closePop()
      },
      closePop() {
        // 关闭弹窗
        this.$modal.hideShade()
        setTimeout(() => {
          this.showPop = false
        }, 200)
        this.showActive = false
        this.popTxt = ''
      },
      // 翻页
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
          padding-right: 10px
          &:last-child
            flex: 1.5
        .handle
          cursor: pointer
          .contxt
            position: relative
            &:before
            &:after
              content: ''
              display: inline-block
              width: 0
              height: 0
              border: 4px solid #999
              border-top-color: transparent
              border-right-color: transparent
              border-bottom-color: transparent
              position: absolute
              right: -16px
              top: 1px
              transition: all 0.4s
              transform: rotate(-90deg)
            &:after
              transform: rotate(90deg)
              top: 12px
          .down:after
            border-left-color: $color-main
          .up:before
            border-left-color: $color-main
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
            overflow: hidden
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
              border: 1px solid #D9D9D9
            .txt
              no-wrap()
              flex: 1
          .list-handle
            color: $color-main
            white-space: nowrap
            user-select: none
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
          textarea-animate(471px, 91px, 0px, #999)
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
        user-select: none
</style>
