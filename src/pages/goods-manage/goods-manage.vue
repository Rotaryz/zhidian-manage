<template>
  <div class="brand-manage">
    <div class="content-top">
      <div class="left">
        <div class="status">
          <sizer-group :defaultIndex="defaultIndex" @change="checkTime"></sizer-group>
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
             :class="{'handle': index === 2 || index === 3}"
             :style="{flex: item.width}"
             @click="handleClick(index)"
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
            <span v-if="val.class === 'item money'" :class="val.class">¥{{item[val.value]}}</span>
            <span v-if="val.class === 'item status'" class="before" :class="{'green': +item.status === 1}">{{(+item.status === 1) ? '已上架' : '已下架'}}</span>
            <div v-if="val.class === 'item head'" class="head item">
              <img v-if="item.url" :src="item.url" class="img" alt="">
              <img v-else :src="defaultUrl" class="img">
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
  import {BASE_URL} from '@utils/config'
  import {HEAD_IMAGE} from '@utils/constant'
  import API from '@api'
  const PAGE_NAME = 'SERVICE_MANAGE'
  const TITLE = '商品管理'
  const TAB_LIST = [
    {name: '商品', width: '2', value: 'title', class: 'item head'},
    {name: '价格', width: '1', value: 'price', class: 'item money'},
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
        // 页面数据数组
        ],
        requestData: {
          // 请求数据
          title: '',
          start_date: '',
          end_date: '',
          date_type: '',
          sort_type: '',
          sort: '',
          type: 1, // 1商品 2虚拟 3服务
          page: 1,
          limit: 10
        },
        sortType: ['browse_count', 'sale_count'],
        sort: ['asc', 'desc'],
        headClass: {
          class2: '',
          class3: ''
        },
        handleIndex: 0, // 点击排序
        pageDetail: {
          // 翻页
          total: 2,
          per_page: 10,
          total_page: 1
        },
        excelUrl: '', // 表格地址
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
        API.Goods.getList(this.requestData).then((res) => {
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
        this.excelUrl = `${BASE_URL.api}/api/admin/goods/export?${accessToken}&${query}`
      },
      // 搜索功能
      search(inputTxt) {
        this.$refs.pageDetail.beginPage()
        for (let val in this.headClass) {
          this.headClass[val] = ''
        }
        this.requestData = {
          title: inputTxt,
          start_date: this.requestData.start_date,
          end_data: this.requestData.end_data,
          date_type: this.requestData.date_type,
          sort_type: '',
          sort: '',
          type: 1,
          page: 1,
          limit: 10
        }
        this.getList()
      },
      // 排序方式选择
      handleClick(num) {
        switch (num) {
        case 2:
          this.requestData.sort_type = this.sortType[0]
          this.requestData.sort = this.sort[1]
          break
        case 3:
          this.requestData.sort_type = this.sortType[1]
          this.requestData.sort = this.sort[1]
          break
        }
        if (this.handleIndex === num) {
          if (this.headClass[`class${num}`] === 'down') {
            this.headClass[`class${num}`] = 'up'
            switch (num) {
            case 2:
              this.requestData.sort_type = this.sortType[0]
              this.requestData.sort = this.sort[0]
              break
            case 3:
              this.requestData.sort_type = this.sortType[1]
              this.requestData.sort = this.sort[0]
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
              border: 1px solid #D9D9D9
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
