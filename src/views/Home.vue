<template>
  <div class="home">
    <div class="header-box">
      <van-notice-bar v-if="notice" :text="notice.title" left-icon="volume-o" color="#ffffff" background="#e64340" :scrollable="true" />
      <van-search v-model="searchKeyWords" placeholder="请输入搜索关键词" @search="search" />
    </div>
    <div class="classify-box">
      <div class="l">
        <van-sidebar v-model="activeKey" class="side-box" @change="categoryChange">
          <van-sidebar-item v-for="(item, index) in categories" :key="index" :title="item.name" />
        </van-sidebar>
      </div>
      <div ref="goodsList" class="r">
        <van-card
          v-for="(item, index) in goodsList"
          :key="index"
          :lazy-load="true"
          :title="item.name"
          :desc="item.characteristic"
          :thumb="item.pic"
          @click-thumb="showSku(index)"
        >
          <template #tags>
            <van-tag v-if="item.numberSells>0" plain type="danger">已售{{ item.numberSells }}</van-tag>
          </template>
          <template #price>
            <div class="goods-price"><span>¥</span>{{ item.minPrice }}/{{ item.unit }}</div>
          </template>
          <template #num>
            <van-icon v-if="item.buyNumber == 0" name="add" size="24" color="#e64340" @click="addCart(index)" />
            <van-stepper v-else :value="item.buyNumber" theme="round" button-size="20" input-width="24" disable-input min="0" async-change @change="changeBuyNumber(index, $event)" />
          </template>
        </van-card>
      </div>
    </div>

    <van-popup v-if="curGoods" v-model="showPop" round position="bottom">
      <img class="goods-photos" :src="curGoods.pic">
      <div class="title">{{ curGoods.name }}</div>
      <div class="title2">{{ curGoods.characteristic }}</div>
      <div class="price-bar">
        <div class="price"><span>¥</span>{{ curGoods.minPrice }}/{{ curGoods.unit }}</div>
        <van-icon v-if="curGoods.buyNumber == 0" name="add" size="24" color="#e64340" @click="addCart(curGoodsIndex)" />
        <van-stepper v-else :value="curGoods.buyNumber" theme="round" button-size="20" input-width="24" disable-input min="0" async-change @change="changeBuyNumber(curGoodsIndex, $event)" />
      </div>
    </van-popup>

    <div class="cart-bar">
      <van-goods-action>
        <van-goods-action-icon v-if="cartInfo && cartInfo.number > 0" icon="cart-o" :badge="cartInfo.number" to="/cartlist" color="#fff" />
        <van-goods-action-icon v-else icon="cart-o" color="#fff" />
        <div class="content">欢迎选购</div>
        <van-goods-action-button
          type="danger"
          text="去结算"
          @click="onClickButton"
        />
      </van-goods-action>

      <div v-if="openingStatus == 3" class="closeOpening">暂未营业( {{ opt }} )</div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
import { getToken, getUid } from '@/utils/auth'

wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
  wx.updateAppMessageShareData({
    title: '牛街and美食，好吃的不得了', // 分享标题
    desc: '牛街and美食，好吃的不得了哦', // 分享描述
    link: 'http://vueshop.s2m.cc/home?inviteId=' + getUid(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'https://dcdn.it120.cc/2020/06/03/96550576-b74c-4d71-bc05-1609be0b9240.png', // 分享图标
    success: function() {
      // 设置成功
    }
  })
  wx.updateTimelineShareData({
    title: '牛街and美食，好吃的不得了', // 分享标题
    link: 'http://vueshop.s2m.cc/home?inviteId=' + getUid(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'https://dcdn.it120.cc/2020/06/03/96550576-b74c-4d71-bc05-1609be0b9240.png', // 分享图标
    success: function() {
      // 设置成功
    }
  })
})

export default {
  name: 'Home',
  data() {
    return {
      activeKey: 0,
      notice: undefined,
      categories: undefined,
      goodsList: undefined,
      cartInfo: undefined,
      showPop: false,
      curGoods: undefined,
      curGoodsIndex: undefined,
      buyNumber: 0,
      searchKeyWords: undefined,
      openingStatus: 1, // 1 未知 2 营业中 3 未营业
      opt: undefined
    }
  },
  computed: {
    ...mapGetters(['sysconfig'])
  },
  mounted() {
    this.noticeLastOne()
    this.goodsCategory()
    this.jssdkSign()
    this.openingHours()
  },
  methods: {
    async jssdkSign() {
      const res = await this.$wxapi.jssdkSign(window.location.href)
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
    async noticeLastOne() {
      const res = await this.$wxapi.noticeLastOne()
      if (res.code === 0) {
        this.notice = res.data
      }
    },
    async openingHours() {
      const res = await this.$wxapi.queryConfigValue('openingHours')
      if (res.code === 0) {
        // res.data 09:00-23:00
        this.opt = res.data
        const _r = this.checkIsOpened(res.data)
        if (_r) {
          this.openingStatus = 2
        } else {
          this.openingStatus = 3
        }
      }
    },
    checkIsOpened(openingHours) {
      const date = new Date()
      const startTime = openingHours.split('-')[0]
      const endTime = openingHours.split('-')[1]
      const dangqian = date.toLocaleTimeString('chinese', { hour12: false })
      const dq = dangqian.split(':')
      const a = startTime.split(':')
      const b = endTime.split(':')

      const dqdq = date.setHours(dq[0], dq[1])
      const aa = date.setHours(a[0], a[1])
      const bb = date.setHours(b[0], b[1])

      return aa < dqdq && dqdq < bb
    },
    async shippingCarInfo() {
      const res = await this.$wxapi.shippingCarInfo(getToken())
      if (res.code === 0) {
        this.cartInfo = res.data
      } else {
        this.cartInfo = []
      }
    },
    async goodsCategory() {
      await this.shippingCarInfo()
      const res = await this.$wxapi.goodsCategory()
      if (res.code === 0) {
        this.categories = res.data
        this.goods()
      }
    },
    async goods() {
      const data = {
        page: 1,
        pageSize: 10000
      }
      if (this.activeKey >= 0) {
        data.categoryId = this.categories[this.activeKey].id
      }
      if (this.searchKeyWords) {
        data.k = this.searchKeyWords
      }
      const res = await this.$wxapi.goods(data)
      if (res.code === 0) {
        this.goodsList = this.processGoodsCarShow(res.data)
      } else {
        this.goodsList = null
      }
      this.$nextTick(() => {
        this.$refs.goodsList.scrollTop = 0
      })
    },
    processGoodsCarShow(goodsList) {
      // 商品组件购物车信息
      goodsList.forEach(ele => {
        ele.buyNumber = 0
      })
      // 处理商品列表，购物车信息默认显示
      if (!this.cartInfo || !this.cartInfo.items) {
        return goodsList
      }
      this.cartInfo.items.forEach(ele => {
        const goods = goodsList.find(g => {
          return g.id === ele.goodsId
        })
        if (goods) {
          goods.buyNumber += ele.number
          goods.cartItemKey = ele.key
        }
      })
      return goodsList
    },
    categoryChange(index) {
      this.activeKey = index
      this.goods()
    },
    async addCart(index) {
      const curGoods = this.goodsList[index]
      // 加入购物车
      const res = await this.$wxapi.shippingCarInfoAddItem(getToken(), curGoods.id, 1, [])
      if (res.code === 0) {
        this.$toast('加入购物车')
        await this.shippingCarInfo()
        this.goodsList = this.processGoodsCarShow(this.goodsList)
      } else {
        this.$toast(res.msg)
      }
    },
    async changeBuyNumber(index, value) {
      // this.$toast.loading({ forbidClick: true, duration: 0 })
      const goods = this.goodsList[index]
      if (value === 0) {
        // 删除购物车 cartItemId
        await this.$wxapi.shippingCarInfoRemoveItem(getToken(), goods.cartItemKey)
        await this.shippingCarInfo()
        this.goodsList = this.processGoodsCarShow(this.goodsList)
        // this.$toast.clear()
        this.$toast('移除购物车')
      } else {
        // 更新数量
        const res = await this.$wxapi.shippingCarInfoModifyNumber(getToken(), goods.cartItemKey, value)
        if (res.code !== 0) {
          // this.$toast.clear()
          this.$toast(res.msg)
          return
        }
        await this.shippingCarInfo()
        this.goodsList = this.processGoodsCarShow(this.goodsList)
        // this.$toast.clear()
      }
    },
    showSku(index) {
      this.curGoodsIndex = index
      this.curGoods = this.goodsList[index]
      this.showPop = true
      // this.$router.push('/goodsdetail?id=' + this.curGoods.id)
    },
    async onClickButton() {
      const res = await this.$wxapi.shippingCarInfo(getToken())
      if (res.code === 700) {
        this.$toast('请先选购商品')
        return
      }
      this.$router.push('/toPay')
    },
    search(value) {
      this.activeKey = -1
      this.searchKeyWords = value
      this.goods()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header-box {
    width: 100vw;
    flex-shrink: 0;
    position: relative;
  }
  .classify-box{
    display: flex;
    flex: 1;
    overflow: hidden;
    .l {
      width: 100px;
      height: 100%;
      overflow-y: scroll;
      background: #f7f8fa;
    }
    .r {
      width: 275px;
      height: 100%;
      overflow: scroll;
      .van-card{
        padding: 5px;
      }
      .van-card__thumb{
        height: 110px;
        width: 110px;
      }
      .van-card__desc {
        margin-top: 5px;
      }
      .van-card__price-integer{
        font-size: 12px;
        margin-left: 2px;
      }
      .van-card__title.van-multi-ellipsis--l2{
        font-size: 13px;
      }
      .van-card__desc.van-ellipsis{
        font-size: 11px;
      }
      .van-card__bottom{
        margin-bottom: 20px;
      }
    }
  }
  .cart-bar{
    background: white;
    width: 100%;
    padding: 8px 0;
  }
}

.van-goods-action{
  position: relative;
  margin-left: 15px;
  width: 350px;
  height: 43px;
}
.van-goods-action-icon{
  border-radius:50%;
  background-color: #e64340;
  height: 40px;
  width: 40px;
  min-width: 0px;
}
.van-goods-action-icon__icon{
  margin: auto;
  color: #FFF !important;
}
.van-goods-action-button--last {
  margin-left: 100px;
}
.van-icon-cart-o::before{
  color:white;
  height: 10px;
  width: 10px;
  margin-right: 6px;
}
.content{
  font-size: 13px;
  margin-left: 10px;
}
.goods-photos{
  width: 100%;
}
.title{
  font-size: 16px;
  margin-left:16px ;
}
.title2 {
  font-size: 14px;
  margin-left:16px ;
  color: #666;
}
.price-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px;
  .price{
    font-size: 13px;
    color:red;
    span {
      font-weight: normal;
      font-size: 10px;
    }
  }
}
.goods-price {
  font-size: 14px;
  color: #e64340;
  font-weight: bold;
  span {
    font-weight: normal;
    font-size: 12px;
  }
}
.van-search {
  width: 100%;
}
.closeOpening {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba($color: #000, $alpha: 0.6);
  font-size: 16px;
  color: #FFF;
}
</style>
