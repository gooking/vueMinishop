<template>
  <div v-if="goodsDetail" class="goods-detail">
    <div class="swiper-box">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in goodsDetail.pics" :key="index">
          <img :src="image.pic">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="goods-description">
      <h3 style="margin-bottom:20px;">{{ goodsDetail.basicInfo.name }}</h3>
      <div style="margin-bottom:20px;">{{ goodsDetail.basicInfo.characteristic }}</div>
      <div class="html-content" v-html="goodsDetail.content" />
    </div>
    <div class="goods-detail-bottom" />
    <van-goods-action>
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartInfo.number" to="/cartlist" />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="addCart"
      />
    </van-goods-action>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
import { getToken, getUid } from '@/utils/auth'
const WEBAPI = require('apifm-webapi')
WEBAPI.init(process.env.VUE_APP_SUB_DOMAIN)

wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
  wx.updateAppMessageShareData({
    title: '牛街and美食，好吃的不得了', // 分享标题
    desc: '牛街and美食，好吃的不得了哦', // 分享描述
    link: 'http://m.niujiemenshi.com/home?inviteId=' + getUid(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'https://dcdn.it120.cc/2020/06/03/96550576-b74c-4d71-bc05-1609be0b9240.png', // 分享图标
    success: function() {
      // 设置成功
    }
  })
  wx.updateTimelineShareData({
    title: '牛街and美食，好吃的不得了', // 分享标题
    link: 'http://m.niujiemenshi.com/home?inviteId=' + getUid(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'https://dcdn.it120.cc/2020/06/03/96550576-b74c-4d71-bc05-1609be0b9240.png', // 分享图标
    success: function() {
      // 设置成功
    }
  })
})

export default {
  data() {
    return {
      goodsDetail: undefined,
      cartInfo: {
        number: 0
      }
    }
  },
  mounted() {
    this.initGoods()
    this.shippingCarInfo()
    this.jssdkSign()
  },
  methods: {
    async jssdkSign() {
      const res = await WEBAPI.jssdkSign(window.location.href)
      if (res.code === 0) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appid, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.sign, // 必填，签名
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
        })
      }
    },
    async initGoods() {
      const res = await WEBAPI.goodsDetail(this.$route.query.id)
      if (res.code === 0) {
        this.goodsDetail = res.data
      }
    },
    async shippingCarInfo() {
      const res = await WEBAPI.shippingCarInfo(getToken())
      if (res.code === 0) {
        this.cartInfo = res.data
      } else {
        this.cartInfo = []
      }
    },
    async addCart() {
      const res = await WEBAPI.shippingCarInfoAddItem(getToken(), this.goodsDetail.basicInfo.id, 1, [])
      if (res.code === 0) {
        this.$toast('加入成功')
        await this.shippingCarInfo()
        this.goodsList = this.processGoodsCarShow(this.goodsList)
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.goods-detail {
  width: 100%;
  height: 100%;
  .swiper-box {
    width: 100%;
    height: 300px;
    .van-swipe {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .goods-description {
    width: 100%;
    font-size: 14px;
    box-sizing: border-box;
    padding: 20px 10px;
    margin-top: 20px;
  }
}
.html-content {
  .wscnph {
    width: 100%;
  }
}
.goods-detail-bottom {
  width: 100%;
  height: 30px;
}
</style>
