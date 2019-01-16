<template>
  <div class="navigation">
    <header>
      <img src="./pic-logo@2x.png" class="icon">
      <img src="./logo.png" alt="" class="logo">
    </header>
    <dl v-for="(item, index) in navList" :key="index">
      <dt :class="item | isActive" @click="navHandle(item, index)" @mouseenter="navEnter(item, index)" @mouseleave="navLeave(item,index)">
        <img :src="item.isLight || item.isEnter ? item.iconSelected : item.icon" alt="">
        <p>{{item.title}}</p>
        <i :class="item.children.length ? 'rotate' : ''"></i>
        <em :class="item | isActive" class="flag"></em>
      </dt>
      <dd :style="item | childrenActive">
        <template v-for="(child, idx) in item.children">
          <div :key="idx" :class="child | isActive" class="child"
               @click="navHandle(child, idx, item)"
               @mouseenter="navEnter(item, index)"
               @mouseleave="navLeave(item,index)"
          >
            {{child.title}}
            <em :class="child | isActive" class="flag"></em>
          </div>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script type="text/ecmascript-6">
  const HEIGHT = 52
  const NAV_LIST = [
    {
      title: '数据概览',
      url: '/home/data-overview',
      icon: require('./icon-data@2x.png'),
      iconSelected: require('./icon-data_select@2x.png'),
      childrenIndex: 0,
      isRouter: true, // 是否跳转
      isLight: false, // 是否亮灯
      isEnter: false,
      children: []
    },
    {
      title: '商家管理',
      url: '/home/business-manage/',
      icon: require('./icon-shop@2x.png'),
      iconSelected: require('./icon-shop_select@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      isEnter: false,
      children: [
        {
          title: '品牌管理',
          url: '/home/business-manage/brand-manage',
          isRouter: true,
          isLight: false,
          isEnter: false
        },
        {
          title: '店铺管理',
          url: '/home/business-manage/store-manage',
          isRouter: true,
          isLight: false,
          isEnter: false
        }
      ]
    },
    {
      title: '用户管理',
      url: '/home/user-manage',
      icon: require('./icon-user@2x.png'),
      iconSelected: require('./icon-user_select@2x.png'),
      childrenIndex: 0,
      isRouter: true, // 是否跳转
      isLight: false, // 是否亮灯
      isEnter: false,
      children: []
    },
    {
      title: '内容管理',
      url: '/home/content-manage/',
      icon: require('./icon-content@2x.png'),
      iconSelected: require('./icon-content_select@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      isEnter: false,
      children: [
        {
          title: '商品管理',
          url: '/home/content-manage/goods-manage',
          isRouter: true,
          isLight: false,
          isEnter: false
        },
        {
          title: '服务管理',
          url: '/home/content-manage/service-manage',
          isRouter: true,
          isLight: false,
          isEnter: false
        },
        {
          title: '活动管理',
          url: '/home/content-manage/activity-manage',
          isRouter: true,
          isLight: false,
          isEnter: false
        }
      ]
    },
    {
      title: '订单管理',
      url: '/home/order-form-manage',
      icon: require('./icon-indent@2x.png'),
      iconSelected: require('./icon-indent_select@2x.png'),
      childrenIndex: 0,
      isRouter: true, // 是否跳转
      isLight: false, // 是否亮灯
      isEnter: false,
      children: []
    },
    {
      title: '财务管理',
      url: '/home/finance-manage/',
      icon: require('./icon-money@2x.png'),
      iconSelected: require('./icon-money_select@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      isEnter: false,
      children: [
        {
          title: '交易记录',
          url: '/home/finance-manage/buy-record',
          isRouter: true,
          isLight: false,
          isEnter: false
        },
        {
          title: '提现申请',
          url: '/home/finance-manage/cash-apply',
          isRouter: true,
          isLight: false,
          isEnter: false
        }
      ]
    }
  ]
  const NAV_STR = JSON.stringify(NAV_LIST)
  export default {
    name: 'NAVIGATIONBAR',
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
        let styles = ''
        if (value.children.length && value.isLight) {
          styles = `height:${value.children.length * HEIGHT}px`
        }
        return styles
      },
      // 本路由的激活状态过滤
      isActive(value) {
        let cname = ''
        if (value.isLight) {
          cname = 'active'
        }
        if (value.isLight && value.children && value.children.length) {
          cname += ' no-border'
        }
        return cname
      }
    },
    data() {
      return {
        navList: JSON.parse(NAV_STR),
        nowTime: Date.now(),
        lastItem: {}
      }
    },
    watch: {
      $route() {
        // 重置路由器
        this._reBuildNavStatus()
        this._initNavList()
      }
    },
    created() {
      this._reBuildNavStatus()
      this._initNavList()
    },
    methods: {
      navHandle(item, index, father) {
        if (Date.now() - this.nowTime < 50) {
          return
        }
        this.nowTime = Date.now()
        let url = ''
        let currentObj = {}
        // 设置自身
        if (item.isRouter) {
          url = item.url
          currentObj = item
        }
        if (item.children) {
          let children = item.children
          let childrenIndex = item.childrenIndex
          let currentChildren = children[childrenIndex]
          if (children.length) {
            currentObj = currentChildren
          }
          if (currentChildren && currentChildren.isRouter) {
            url = currentChildren.url
          }
        }
        if (url === this.$route.fullPath) return
        // 重置路由器
        this._reBuildNavStatus()
        // 设置父级
        if (father) {
          father.isLight = true
          father.childrenIndex = index
        }
        currentObj.isLight = true
        this.$router.push(url)
      },
      // 重置路由显示的状态
      _reBuildNavStatus() {
        this.navList = JSON.parse(NAV_STR)
      },
      // 刷新页面输出路由
      _initNavList() {
        let path = this.$route.fullPath
        this._resetNavLight(this.navList, path)
      },
      // 重置路由亮灯的状态
      _resetNavLight(arr, path) {
        // 路由包含的路由关系
        let index = arr.findIndex((item) => path.includes(item.url))
        // 路由名称全等的路由关系
        let fullIdx = arr.findIndex((item) => path === item.url)
        let current = {}
        // 全等权重大于包含
        if (fullIdx > -1 || index > -1) {
          current = fullIdx > -1 ? arr[fullIdx] : arr[Math.max(0, index)]
        }
        current.isLight = true
        // 没有子路由结束递归
        if (index !== -1 && current.children && current.children.length) {
          return this._resetNavLight(current.children, path)
        }
      },
      // hover 样式修改
      navEnter(item) {
        item.isEnter = true
      },
      navLeave(item) {
        item.isEnter = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $tab-height = 46px
  $color-menu-tag = #FF533C
  $color-menu-text = #6E748B
  $color-menu-text-active = #fff
  $color-menu-bg-active = rgba(255, 255, 255, 0.1)
  $color-menu-bg = rgba(255, 255, 255, 0)
  $color-menu-child-bg = #1B2029
  $color-white = #fff
  $color-text-active = #E2F0F5
  $menu-width=200px
  @import "~@design"

  .navigation
    user-select: none
    position: fixed
    top: 0
    left: 0
    background: #232633
    box-shadow: 3px 0 4px 0 rgba(0, 8, 39, 0.30)
    width: $menu-width
    min-height: 100vh
    z-index: 2000
    overflow-y: auto
    header
      layout(row)
      height: 77px
      align-items: center
      background:  #1B2029
      justify-content: center
      border-bottom: 1px solid $color-menu-line
      .icon
        height: 33px
        width: 30px
        margin-right: 8px
      .logo
        width: 107px
      p
        font-size: 20px
        color: #fff
        font-family: PingFangSC-Semibold
        letter-spacing: 6px
    dl
      font-family: PingFangSC-Regular
      color: $color-menu-text
      font-size: 16px
      cursor: pointer
      dt
        layout(row, block, nowrap)
        align-items: center
        width: 100%
        height: $tab-height
        overflow: hidden
        background: $color-menu-bg
        border-left: 0px solid transparent
        transition: all .2s
        position :relative
        margin : 8px 0
        .flag
          width :5px
          height :0
          border-radius: 2.5px
          left :0
          col-center()
          background :$color-main
          transition :all 0.3s
          &.active
            height : $tab-height
            &.no-border
              height :0
        &:hover
          color:  $color-text-active
          &.no-border
            border-color: transparent
          & > p
            color: $color-white
          & > i
            icon-image('icon-pressed_select')
        &.active
          //border-left: 5px solid $color-main
          //background: $color-menu-bg-active
          color: $color-text-active
          background: $color-menu-child-bg
          &.no-border
            border-color: transparent
          & > p
            color: $color-white
          & > i
            icon-image('icon-pressed_select')
            &.rotate
              transform: rotate(90deg)
        &.no-border
          background: $color-menu-bg
        p
          flex: 1
          overflow: hidden
          background: rgba(255, 255, 255, 0)
          box-sizing: border-box
          border-left: 5px solid transparent
          transition: all .2s
        img
          height: 19px
          width: @height
          margin: 0 10px 0 30px
        i
          height: 10px
          width: 10px
          icon-image('icon-pressed')
          justify-self: flex-end
          margin-right: 30px
          transform rotate(0deg)
          transition: transform 0.2s
      dd
        height: 0
        transition: height 0.3s
        layout()
        overflow: hidden
        .child
          width: 100%
          layout()
          background: $color-menu-child-bg
          align-items: center
          justify-content: center
          flex: 1
          box-sizing :border-box
          border-left: 0px solid transparent
          transition: all .2s
          position :relative
          .flag
            width :5px
            height :0
            border-radius: 2.5px
            left :0
            col-center()
            background :$color-main
            transition :all 0.3s
            &.active
              height :20px
              &.no-border
                height :0
          &:hover
            color: $color-text-active
          &.active
            color: $color-text-active
</style>
