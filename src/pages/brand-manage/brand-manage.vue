<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <base-search @search="search" placeHolder="请输入团长名称"></base-search>
      </div>
    </div>
    <div class="content-list">
      <div class="list-header">
        <div v-for="(item, index) in headerList" @click="handleClick(index)" :key="index" :class="{'handle': index === 2 || index === 3 || index === 4 || index === 5}" class="header-key">
          <span class="contxt" :class="`${headClass[`class${index}`]}`">{{item}}</span>
        </div>
      </div>
      <div class="list-content">
        <div v-for="(item, index) in data" :key="index" class="list-item">
          <span class="item">{{item.storeName + '' || '---'}}</span>
          <span class="item">{{item.name + '' || '---'}}</span>
          <span class="item">{{item.phone + '' || '---'}}</span>
          <span class="item">{{item.brand + '' || '---'}}</span>
          <span class="item">{{item.business + '' || '---'}}</span>
          <span class="item">{{item.code + '' || '---'}}</span>
          <span class="item">{{item.money + '' || '---'}}</span>
          <span class="item">{{item.date + '' || '---'}}</span>
          <div class="list-handle item">
            <span class="handle-item"
                  @click="openPop('open', item)">开通</span>
            <span class="handle-item" @click="openPop('freeze', item)">{{item.is_freeze_str === '正常' ? '冻结' : '解冻'}}</span>
            <span class="handle-item" @click="openPop('authority', item)">{{item.is_over_power * 1 === 0 ? '越权' : '取消越权'}}</span>
            <span class="handle-item" @click="openPop('shop', item)">店铺</span>
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
  const PAGE_NAME = 'BRAND_MANAGE'
  const TITLE = '品牌管理'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        headerList: ['店铺名称', '姓名', '手机', '品牌', '访客', '交易订单', '交易金额', '开通时间', '操作'],
        data: [
          {
            storeName: '店铺名称水电费说的',
            name: '姓名大是大非',
            phone: '13584260103',
            brand: '什么牌子',
            business: '客人',
            code: '156456131',
            money: '130.00',
            date: '2019-01-11'
          }
        ],
        handleIndex: 0,
        headClass: {
          class2: '',
          class3: '',
          class4: '',
          class5: ''
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        }
      }
    },
    methods: {
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
        case 4:
          this.requestData.sort_type = 3
          break
        case 5:
          this.requestData.sort_type = 5
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
            case 4:
              this.requestData.sort_type = 4
              break
            case 5:
              this.requestData.sort_type = 6
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
        this.getMemberList()
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
    .content-list
      text-align: left
      flex: 1
      font-size: 14px
      .list-header
        flex: 1
        background: #FAFAFA
        height: 50px
        line-height: 50px
        font-family: $font-family-medium
        display: flex
        justify-content: space-between
        padding-left: 2vw
        color: $color-text-main
        border-bottom: 0.5px solid $color-line
        .header-key
          flex: 1
          overflow: hidden
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
              border: 4px solid $color-text-sub
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
          .item
            flex: 1
            line-height: 18px
            no-wrap()
    .bot-page
      height: 60px
      display: flex
      align-items: center
</style>
