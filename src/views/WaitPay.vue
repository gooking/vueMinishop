<template>
  <div class="waitPayContainer">
    <van-cell-group>
      <!-- <van-cell title="商品金额" :value="'¥' + orderInfo.amount" size="large" value-class="red" title-class="title" />
      <van-cell title="配送服务费" :value="'¥' + orderInfo.amountLogistics" size="large" value-class="red" title-class="title" /> -->
      <!-- <van-cell title="账户余额" value="¥300.00" size="large" value-class="green" title-class="title" /> -->
      <van-cell title="本次订单应付金额" :value="'¥' + orderInfo.amountReal" size="large" value-class="red" title-class="title" />
    </van-cell-group>
    <van-tabs v-model="active">
      <van-tab title="微信支付">
        <img mode="aspectFill" class="pay-0" :src="sysconfig.paycode">
        <div class="code">长按二维码付款</div>
      </van-tab>
      <van-tab title="支付宝支付">
        <img mode="aspectFill" class="pay-0" :src="sysconfig.paycodeali">
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      active: 0,
      userAmount: undefined,
      orderInfo: {
        amountReal: 0
      }
    }
  },
  computed: {
    ...mapGetters(['sysconfig'])
  },
  mounted() {
    this.orderDetail()
    // this.getUserAmount()
  },
  methods: {
    // 订单详情
    async orderDetail() {
      const res = await this.$wxapi.orderDetail(getToken(), this.$route.query.id)
      if (res.code === 0) {
        this.orderInfo = res.data.orderInfo
      } else {
        this.$toast(res.msg)
      }
    },
    async getUserAmount() {
      const res = await this.$wxapi.userAmount(getToken())
      if (res.code === 0) {
        this.userAmount = res.data
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.pay-0{
  margin: 50px;
  margin-top: 15px;
  margin-bottom: 5px;
  width: 275px;
 }
 .red {
   color:red;
   font-size: 17px;
   margin-right: 20px;
 }
 .green{
   color: #a3d17b;
   font-size: 17px;
   margin-right: 20px;
 }
 .title{
   margin-left: 20px;
 }
 .code{
   font-size: 14px;
   text-align: center;
 }
</style>