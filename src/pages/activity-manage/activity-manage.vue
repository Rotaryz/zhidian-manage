<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group :defaultIndex="defaultIndex" @change="checkTime"></sizer-group>
        </div>
        <div class="status">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
        <base-search placeHolder="请输入名称" @search="search"></base-search>
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
            :class="{'handle': index === 2 || index === 3}"
            @click="handleClick(index)"
          >
            <span v-if="val.class === 'item'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
            <span v-if="val.class === 'item name'" :class="val.class">{{item[val.value] + '' || '---'}}</span>
            <span v-if="val.class === 'item money'" :class="val.class">¥{{item[val.value]}}</span>
            <span v-if="val.class === 'item status'" class="before" :class="{'green': +item.status === 1}">{{(+item.status === 1) ? '已上架' : '已下架'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img v-if="item.url" :src="item.url" class="img" alt="">
              <img v-else :src="defaultUrl" class="img" alt="">
              <span class="txt">{{item[val.value] + '' || '---'}}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="bot-page">
      <base-pagination ref="pageDetail" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SizerGroup from '@components/sizer-group/sizer-group'
  import {HEAD_IMAGE} from '@utils/constant'
  import {BASE_URL} from '@utils/config'
  import API from '@api'
  const PAGE_NAME = 'ACTIVITY_MANAGE'
  const TITLE = '活动管理'
  const TAB_LIST = [
    {name: '活动', width: '2', value: 'title', class: 'item head'},
    {name: '价格', width: '1', value: 'price', class: 'item money'},
    {name: '类型', width: '1', value: 'type', class: 'item'},
    {name: '状态', width: '1', value: 'status', class: 'item status'},
    {name: '关联', width: '1.4', value: 'link', class: 'item name'},
    {name: '来源', width: '1.2', value: 'source', class: 'item name'},
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
        data: [],
        requestData: {
          activity_name: '',
          rule_id: '',
          start_date: '',
          end_date: '',
          date_type: '',
          page: 1,
          limit: 10
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '活动类型',
          type: 'default',
          data: [{name: '全部', id: ''}, {name: '拼团', id: '1'}, {name: '砍价', id: '3'}]
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        excelUrl: '',
        defaultIndex: 4,
        defaultUrl: HEAD_IMAGE
      }
    },
    created() {
      this.getList()
      this.$emit('hideNoData')
    },
    methods: {
      // 获取列表
      getList() {
        API.Activity.getList(this.requestData).then((res) => {
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
        this.excelUrl = `${BASE_URL.api}/api/admin/activity/export?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.activity_name = inputTxt
        this.requestData.page = 1
        this.getList()
      },
      // 选择活动类型
      setValue(item) {
        this.requestData.rule_id = item.id
        this.requestData.page = 1
        this.$refs.pageDetail.beginPage()
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
            .grey
              color: #999
    .bot-page
      padding-top: 40px
      padding-bottom: 30px
</style>
