<template>
  <div v-if="orderMap" class="shopCartContainer">
    <div v-for="(item, index) in orderMap.orderList" :key="index" class="order-details-bar">
      <div class="shops-tatle-box" @click="toDetail(item.id)">
        <div class="shop-tatle">#{{ item.qudanhao }}</div>
        <div class="unpaid-bar">
          <div class="unpaid">{{ item.statusStr }}</div>
          <van-icon class="go" name="arrow" />
        </div>
      </div>
      <div class="order-number">订单编号：{{ item.orderNumber }}</div>
      <div class="order-time">下单时间：{{ item.dateAdd }}</div>
      <div class="goods-photo">
        <img v-for="goods in orderMap.goodsMap[item.id]" :key="goods.id" mode="aspectFill" class="goods" :src="goods.pic">
      </div>
      <div class="blank" />
      <div class="botton-bar">
        <div class="price">¥{{ item.amountReal }}</div>
        <div class="botton-bar-1">
          <van-button v-if="item.status == 0" type="primary" size="small" style="margin-left:5px;" @click="topay(item.id)"> 立即支付</van-button>
          <van-button v-if="item.status == 0" type="danger" size="small" style="margin-left:5px;" @click="orderClose(item.id)"> 关闭订单</van-button>
          <van-button v-if="item.status == 2" type="danger" size="small" style="margin-left:5px;" @click="querenshouhuo(item.id)"> 确认收货</van-button>
          <van-button v-if="item.status == -1 || item.status == 0 || item.status == 3 || item.status == 4" type="danger" size="small" style="margin-left:5px;" @click="deleteOrder(item.id)"> 删除订单</van-button>
        </div>
      </div>
    </div>
  </div>
  <van-empty v-else description="暂无订单" />
</template>
<script>
const WEBAPI = require('apifm-webapi')
import { getToken } from '@/utils/auth'
import { Dialog } from 'vant'
export default {
  data() {
    return {
      page: 1,
      pagesize: 5,
      value: 3,
      orderMap: undefined
    }
  },
  mounted() {
    this.fetchOrderList()
  },
  methods: {
    async fetchOrderList() {
      const res = await WEBAPI.orderList({
        token: getToken(),
        pageSize: 10000
      })
      if (res.code === 0) {
        res.data.orderList.forEach(ele => {
          if (ele.status === 3) {
            ele.statusStr = '交易成功'
          }
        })
        this.orderMap = res.data
      } else {
        this.orderMap = null
      }
    },
    async orderClose(id) {
      Dialog.confirm({
        message: '确定要关闭该订单？'
      }).then(() => {
        this._orderClose(id)
      }).catch(() => {
        // on cancel
      })
    },
    async _orderClose(id) {
      const res = await WEBAPI.orderClose(getToken(), id)
      if (res.code === 0) {
        this.$toast('订单已关闭')
        this.fetchOrderList()
      } else {
        this.$toast(res.msg)
      }
    },
    async querenshouhuo(id) {
      Dialog.confirm({
        message: '确定已收到货？'
      }).then(() => {
        this._querenshouhuo(id)
      }).catch(() => {
        // on cancel
      })
    },
    async _querenshouhuo(id) {
      const res = await WEBAPI.orderDelivery(getToken(), id)
      if (res.code === 0) {
        this.$toast('交易成功')
        this.fetchOrderList()
      } else {
        this.$toast(res.msg)
      }
    },
    async deleteOrder(id) {
      Dialog.confirm({
        message: '确定删除该订单？'
      }).then(() => {
        this._deleteOrder(id)
      }).catch(() => {
        // on cancel
      })
    },
    async _deleteOrder(id) {
      const res = await WEBAPI.orderDelete(getToken(), id)
      if (res.code === 0) {
        this.$toast('删除成功')
        this.fetchOrderList()
      } else {
        this.$toast(res.msg)
      }
    },
    async topay(id) {
      this.$router.push('/waitPay?id=' + id)
    },
    async toDetail(id) {
      this.$router.push('/orderdetail?id=' + id)
    }
  }
}
</script>
<style lang="scss">
.order-details-bar{
  margin-left:10px;
  margin-top: 15px;
  margin-right: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 2%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 6px 16px 0 rgba(0, 0, 0, 0.06);
  background-color: #fffefd;
  .shops-tatle-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left:15px ;
    margin-right: 15px;
    .shop-tatle{
      font-family: PingFangSC;
      font-size: 13px;
      font-weight: 600;
      color: #1f1f1f;
    }
    .unpaid-bar{
      font-family: PingFangSC;
      display: flex;
      font-size: 12px;
      color: #1f1f1f;
      align-items: center;
      .unpaid{
        border-radius: 3px;
        background-color: #ff340d;
        color: #ffffff;
        padding: 0 5px;
        height: 21px;
        text-align: center;
        line-height: 21px;
      }
      .go{
        width: 16px;
        height: 16px;
        object-fit: contain;
        margin-left:12px ;
      }
    }
  }
  .order-number{
    font-family: PingFangSC;
    font-size: 12px;
    color: #8a8a8a;
    margin-top: 5px;
    margin-left:15px ;
  }
  .order-time{
    font-family: PingFangSC;
    font-size: 12px;
    color: #8a8a8a;
    margin-top: 5px;
    margin-left:15px ;
  }
  .goods-photo{
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px 10px 15px;
    .goods{
      width: 70px;
      height: 70px;
      border-radius: 5px;
      background-color: #f5f5f5;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
  .blank{
    width: 370px;
    height: 1rpx;
    background-color: #ebebeb;
    margin-left:2px ;
  }
  .botton-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin:20rpx 30rpx  ;
    .price{
      display: flex;
      align-items: flex-end;
      font-family: PingFangSC;
      font-size: 16px;
      color: #fa5c01;
      margin-left: 20px;
    }
    .botton-bar-1{
      margin-right: 20px;
    }
  }
}


</style>
