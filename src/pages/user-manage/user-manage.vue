<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group></sizer-group>
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
            <div v-else class="head item">
              <img src="" class="img" alt="">
            </div>
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
    {name: '头像', width: '1', value: 'head', class: 'item head'},
    {name: '昵称', width: '1', value: 'name', class: 'item'},
    {name: '性别', width: '1', value: 'sex', class: 'item'},
    {name: '地区', width: '1', value: 'addr', class: 'item'},
    {name: '手机号', width: '1', value: 'phone', class: 'item'},
    {name: '交易订单', width: '1', value: 'num', class: 'item'},
    {name: '总消费', width: '1', value: 'money', class: 'item'},
    {name: '来源', width: '1', value: 'source', class: 'item'},
    {name: '注册时间', width: '1', value: 'date', class: 'item'}
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
            head: '',
            name: '昵称大是大非',
            sex: '男',
            addr: '广东广州',
            phone: '13584260103',
            num: '22',
            money: '122.50',
            source: '某某公司',
            date: '2019.1.11'
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
    .bot-page
      height: 60px
      display: flex
      align-items: center
</style>
