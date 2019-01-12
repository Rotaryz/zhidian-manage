import {HOME_PAGE, LOGIN_PAGE} from '@utils/constant'

export default [
  {
    path: '/home',
    name: 'home',
    component: () => lazyLoadView(import('@pages/home/home')),
    redirect: HOME_PAGE,
    children: [
      // 数据统计
      {
        path: 'data-overview',
        name: 'data-overview',
        component: () => lazyLoadView(import('@pages/data-overview/data-overview'))
      },
      // 商家管理/品牌管理
      {
        path: 'business-manage/brand-manage',
        name: 'brand-manage',
        title: '品牌管理',
        component: () => lazyLoadView(import('@pages/brand-manage/brand-manage'))
      },
      // 商家管理/店铺管理
      {
        path: 'business-manage/store-manage',
        name: 'store-manage',
        title: '店铺管理',
        component: () => lazyLoadView(import('@pages/store-manage/store-manage'))
      },
      // 用户管理
      {
        path: 'user-manage',
        name: 'user-manage',
        title: '用户管理',
        component: () => lazyLoadView(import('@pages/user-manage/user-manage'))
      },
      // 服务管理
      {
        path: 'content-manage/service-manage',
        name: 'service-manage',
        title: '服务管理',
        component: () => lazyLoadView(import('@pages/service-manage/service-manage'))
      },
      // 活动管理
      {
        path: 'content-manage/activity-manage',
        name: 'activity-manage',
        title: '服务管理',
        component: () => lazyLoadView(import('@pages/activity-manage/activity-manage'))
      },
      // 订单管理
      {
        path: 'order-form-manage',
        name: 'order-form-manage',
        title: '订单管理',
        component: () => lazyLoadView(import('@pages/order-form-manage/order-form-manage'))
      },
      // 交易记录
      {
        path: 'finance-manage/buy-record',
        name: 'buy-record',
        title: '交易记录',
        component: () => lazyLoadView(import('@pages/buy-record/buy-record'))
      },
      // 提现申请
      {
        path: 'finance-manage/cash-apply',
        name: 'cash-apply',
        title: '提现申请',
        component: () => lazyLoadView(import('@pages/cash-apply/cash-apply'))
      }
      // // 商家管理/店铺管理
      // {
      //   path: '/store-manage',
      //   component: StoreManage,
      //   meta: {
      //     title: '商家管理,店铺管理'
      //   }
      // },
    ]
  },
  // ROOT
  {
    path: '/',
    redirect: LOGIN_PAGE
  },
  // 登陆
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@pages/login/login'))
  },
  {
    path: '/404',
    name: '404',
    component: require('@pages/_404/_404').default,
    props: true
  },
  {
    path: '*',
    redirect: '404'
  }
]

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@pages/_loading/_loading').default,
    delay: 400,
    error: require('@pages/_timeout/_timeout').default,
    timeout: 10000
  })

  return Promise.resolve({
    functional: true,
    render(h, {data, children}) {
      // 将属性和方法传递给所有展示组件
      return h(AsyncHandler, data, children)
    }
  })
}
