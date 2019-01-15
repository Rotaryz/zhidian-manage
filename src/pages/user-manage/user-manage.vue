<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group :defaultIndex="defaultIndex" @change="checkTime"></sizer-group>
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
            <span v-if="val.class === 'item sex'" :class="val.class">{{+item[val.value] === 1 ? '男' : item[val.value] === 2 ? '女' : '未知'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img v-if="item[val.value]" :src="item[val.value]" class="img" alt="">
              <img v-else :src="defaultUrl" class="img">
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
  import {BASE_URL} from '@utils/config'
  import {HEAD_IMAGE} from '@utils/constant'
  import SizerGroup from '@components/sizer-group/sizer-group'
  import API from '@api'
  const PAGE_NAME = 'USER_MANAGE'
  const TITLE = '用户管理'
  const TAB_LIST = [
    {name: '头像', width: '1', value: 'head', class: 'item head'},
    {name: '昵称', width: '1', value: 'name', class: 'item'},
    {name: '性别', width: '1', value: 'sex', class: 'item sex'},
    {name: '地区', width: '1', value: 'addr', class: 'item'},
    {name: '手机号', width: '1', value: 'phone', class: 'item'},
    {name: '交易订单', width: '1', value: 'num', class: 'item'},
    {name: '总消费', width: '1', value: 'money', class: 'item'},
    {name: '注册时间', width: '1.2', value: 'date', class: 'item'}
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
          keyword: '',
          start_date: '',
          end_date: '',
          date_type: '',
          page: 1,
          limit: 10
        },
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        defaultIndex: 4,
        excelUrl: '',
        defaultUrl: HEAD_IMAGE
      }
    },
    created() {
      this.getList()
      this.$emit('hideNoData')
    },
    methods: {
      getList() {
        API.User.getList(this.requestData).then((res) => {
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
        this.excelUrl = `${BASE_URL.api}/api/admin/customers/report?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        this.requestData.keyword = inputTxt
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
          padding-right: 10px
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
              border: 1px solid #D9D9D9
    .bot-page
      height: 60px
      display: flex
      align-items: center
</style>
