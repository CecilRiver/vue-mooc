import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
import { getUserInfo } from 'utils/cache.js'
Vue.use(Router)

// 首页路由
const Home = () => import('components/home/home.vue')
// 个人中心路由
const UserCenter = () => import('components/user/index.vue')
// 订单中心路由
const OrderIndex = () => import('components/order/index.vue')
// 免费课程路由
const CourseIndex = () => import('components/course/index.vue')
// 免费课程详情路由
const CourseDetail = () => import('components/course-detail/index.vue')
// 实战课程路由
const LessonIndex = () => import('components/lesson/index.vue')
// 实战课程详情路由
const LessonDetail = () => import('components/lesson-detail/index.vue')
// 消息中心路由
const NoticeIndex = () => import('components/notice/notice.vue')
// 购物车路由
const CartIndex = () => import('components/cart/cart.vue')
// 购物车确认路由
const CartConfirm = () => import('components/cart/confirm.vue')
// 购物车支付路由
const CartPay = () => import('components/cart/pay.vue')
// 专栏路由
const ReadIndex = () => import('components/read/read.vue')
const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component:Home 
  },
  {
    path: '/user',
    name: 'UserCenter',
    component:UserCenter,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/order',
    name: 'OrderIndex',
    component:OrderIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/course',
    name: 'CourseIndex',
    component: CourseIndex
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: CourseDetail
  },
  {
    path: '/lesson',
    name: 'LessonIndex',
    component:LessonIndex
  },
  {
    path: '/lesson/:id',
    name: 'LessonDetail',
    component: LessonDetail
  },
  {
    path: '/notice',
    name: 'NoticeIndex',
    component:NoticeIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/cart',
    name: 'CartIndex',
    component:CartIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/cart/confirm',
    name: 'CartConfirm',
    component:CartConfirm,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/cart/pay/:order',
    name: 'CartPay',
    component:CartPay,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/read',
    name: 'ReadIndex',
    component:ReadIndex,
  }
]
const router = new Router({
  routes: routes,
  scrollBehavior () {
    return {
      x: 0,
      y: 0
    }
  }
})

// 路由拦截
router.beforeEach((to, from, next) => {
  let userinfo = getUserInfo()
  if (to.meta.requireAuth) {
    if (userinfo.name) {
      next()
    } else{
      store.commit('login/SET_SHOW_LOGIN', true)
    }
  } else {
    next()
  }
})


export default router