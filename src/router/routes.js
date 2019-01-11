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
        title: '商家管理',
        component: () => lazyLoadView(import('@pages/store-manage/store-manage'))
      },
      {
        path: 'business-manage/store-manage',
        name: 'store-manage',
        title: '品牌管理',
        component: () => lazyLoadView(import('@pages/brand-manage/brand-manage'))
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
