import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [{
    path: '/',
    component: Layout,
    redirect: 'manage1/Brand',
    meta: {
      roles: ['admin']
    },
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/order/unreceive',
    meta: {
      roles: ['normal']
    },
    hidden: true
  },
  {
    path: '/result',
    component: Layout,
    hidden: true,
    children: [{
      path: 'success',
      name: 'success',
      component: () => import('@/views/success'),

    },
    {
      path: 'erro',
      name: 'erro',
      component: () => import('@/views/erro'),

    },]
  },
  {
    path: '/goods',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Goods',
      component: () => import('@/views/goods/goods'),
      meta: {
        title: '商品',
        icon: 'el-icon-s-help',
        roles: ['normal']
      }
    }, ]

  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/unreceive',
    name: 'order',
    meta: {
      title: '我的订单',
      icon: 'nested',
      roles: ['normal']
    },
    children: [{
        path: 'unreceive',
        name: 'unreceive',
        component: () => import('@/views/orderhistory/unreceive'),
        meta: {
          title: '待收货',
          icon: 'table',
          roles: ['normal']
        }
      },
      {
        path: 'evaluate',
        name: 'evaluate',
        component: () => import('@/views/orderhistory/evaluate'),
        meta: {
          title: '待评价',
          icon: 'table',
          roles: ['normal']
        }
      }, {
        path: 'allorder',
        name: 'allorder',
        component: () => import('@/views/orderhistory/allorder'),
        meta: {
          title: '历史订单',
          icon: 'table',
          roles: ['normal']
        }
      },
    ]
  },
  {
    path: '/manage1',
    component: Layout,
    children: [{
      path: 'Brand',
      name: 'Brand',
      component: () => import('@/views/manageBrand/index'),
      meta: {
        title: '品牌管理',
        icon: 'el-icon-s-help',
        roles: ['admin']
      }
    }, ]

  },
  {
    path: '/manage2',
    component: Layout,
    children: [{
      path: 'Deliver',
      name: 'Deliver',
      component: () => import('@/views/manageDeliver/index'),
      meta: {
        title: '送水人员管理',
        icon: 'el-icon-s-help',
        roles: ['admin']
      }
    }, ]

  },
  {
    path: '/manage3',
    component: Layout,
    children: [{
      path: 'Order',
      name: 'Order',
      component: () => import('@/views/manageOrder/index'),
      meta: {
        title: '订单管理',
        icon: 'el-icon-s-help',
        roles: ['admin']
      }
    }, ]

  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',

    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '我的', icon: 'user', noCache: true ,roles: ['normal','admin'] }
      }
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
