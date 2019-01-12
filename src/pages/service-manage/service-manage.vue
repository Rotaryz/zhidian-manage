<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group></sizer-group>
        </div>
        <base-search placeHolder="请输入昵称、手机号" @search="search"></base-search>
      </div>
      <a :href="excelUrl" class="excel" target="_blank">导出Excel</a>
    </div>
    <div class="content-list">
      <div class="list-header">
        <div v-for="(item, index) in headerList"
             :key="index"
             class="header-key"
             :class="{'handle': index === 2 || index === 3}"
             :style="{flex: item.width}"
             @click="handleClick(index)"
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
            <span v-if="val.class === 'item status'" class="before" :class="{'green': true}">{{(val.class === 'item status') ? '已上架' : '已下架'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img src="" class="img" alt="">
              <span class="txt">{{item[val.value] + '' || '---'}}</span>
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
  const PAGE_NAME = 'SERVICE_MANAGE'
  const TITLE = '品牌管理'
  const TAB_LIST = [
    {name: '服务', width: '2', value: 'title', class: 'item head'},
    {name: '价格', width: '1', value: 'price', class: 'item'},
    {name: '浏览量', width: '1', value: 'num', class: 'item'},
    {name: '销量', width: '1', value: 'stock', class: 'item'},
    {name: '状态', width: '1', value: 'status', class: 'item status'},
    {name: '来源', width: '1', value: 'source', class: 'item'},
    {name: '创建时间', width: '1', value: 'date', class: 'item'}
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
            title: '店铺名称水电费说的',
            price: '122.00',
            num: '200',
            stock: '100',
            status: '已上架',
            source: '某某公司',
            date: '2019-01-11'
          }
        ],
        requestData: {
          keyword: '',
          sort_type: '',
          page: 1,
          limit: 10
        },
        headClass: {
          class2: '',
          class3: ''
        },
        handleIndex: 0,
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        endTime: '',
        addTime: '',
        excelUrl: ''
      }
    },
    watch: {},
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
      handleClick(num) {
        switch (num) {
        case 2:
          this.requestData.sort_type = 7
          break
        case 3:
          this.requestData.sort_type = 1
          break
        }
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
            switch (num) {
            case 2:
              this.requestData.sort_type = 8
              break
            case 3:
              this.requestData.sort_type = 2
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
        this.getBrandList()
      },
      addDate() {
        this.expire_time = this.addTime
          .toLocaleDateString()
          .replace(/\//g, '-')
          .replace(/\b\d\b/g, '0$&')
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
</style>
