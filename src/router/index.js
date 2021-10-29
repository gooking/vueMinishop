import Vue from 'vue'
import VueRouter from 'vue-router'
import Parent from '../components/Parent.vue'
import { getToken, setToken, setUid, removeToken, setInvite, getInvite } from '@/utils/auth'
const WEBAPI = require('apifm-webapi')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Parent',
    redirect: '/home',
    component: Parent,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: 'home', requireAuth: true, showTab: true }
      },
      {
        path: '/notice',
        name: 'Notice',
        component: () => import('../views/Notice.vue'),
        meta: { title: 'notice', requireAuth: false }
      },
      {
        path: '/cartlist',
        name: 'Cartlist',
        component: () => import('../views/CartList.vue'),
        meta: { title: 'shopCart', requireAuth: true, showTab: true }
      },
      {
        path: '/orderlist',
        name: 'OrderList',
        component: () => import('../views/OrderList.vue'),
        meta: { title: 'historyOrder', requireAuth: true }
      },
      {
        path: '/goodsdetail',
        name: 'GoodsDetail',
        component: () => import('../views/GoodsDetail.vue'),
        meta: { title: 'GoodsDetail', requireAuth: true }
      },
      {
        path: '/orderdetail',
        name: 'Orderdetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: { title: 'orderDetail', requireAuth: true }
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('../views/My.vue'),
        meta: { title: 'my', requireAuth: true, showTab: true }
      },
      {
        path: '/toPay',
        name: 'ToPay',
        component: () => import('../views/ToPay.vue'),
        meta: { title: 'toPay', requireAuth: true }
      },
      {
        path: '/waitPay',
        name: 'WaitPay',
        component: () => import('../views/WaitPay.vue'),
        meta: { title: 'waitPay', requireAuth: true }
      },
      {
        path: '/addressList',
        name: 'AddressList',
        component: () => import('../views/AddressList.vue'),
        meta: { title: 'addressList', requireAuth: true }
      },
      {
        path: '/addressEdit',
        name: 'AddressEdit',
        component: () => import('../views/AddressEdit.vue'),
        meta: { title: 'addressEdit', requireAuth: true }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/Page.vue'),
        meta: { title: 'about', requireAuth: false }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.query.inviteId) {
    setInvite(to.query.inviteId)
  }
  if (to.query.code) {
    const authData = {
      code: to.query.code
    }
    if (getInvite()) {
      authData.referrer = getInvite()
    }
    WEBAPI.authorization(authData).then(res => {
      if (res.code !== 0) {
        // alert(res.msg)
        next()
        return
      }
      setToken(res.data.token)
      setUid(res.data.uid)
      next()
    })
    return
  } else {
    if (to.meta.requireAuth) {
      const token = getToken()
      if (token) {
        WEBAPI.checkToken(token).then(res => {
          if (res.code === 0) {
            next()
          } else {
            removeToken()
            let _domian = location.href
            _domian = encodeURIComponent(_domian)
            parent.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + res.data.wxMpAppid + '&redirect_uri=' + _domian + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
          }
        })
        next()
      } else {
        WEBAPI.siteStatistics().then(res => {
          if (res.code !== 0) {
            this.$toast(res.msg)
            return
          }
          // let _domian = 'http://' + document.domain + '/login?redirect=' + router.currentRoute.fullPath
          let _domian = location.href
          _domian = encodeURIComponent(_domian)
          parent.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + res.data.wxMpAppid + '&redirect_uri=' + _domian + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        })
      }
    } else {
      next()
    }
  }
})

export default router
