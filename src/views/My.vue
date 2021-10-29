<template>
  <div class="aboutContainer">
    <div class="mycard" />
    <div class="card-bar">
      <div v-if="userDetail && userDetail.base" class="card-box">
        <img class="my-photo" :src="userDetail.base.avatarUrl">
        <div class="name">{{userDetail.base.nick}}</div>
      </div>
      <div class="balance">
        <div class="box">
          <div class="units">¥</div>
          <div class="m">{{userAmount.balance}}</div>
        </div>
        <div class="title">可用余额</div>
      </div>
    </div>
    <div class="content-bar">
      <router-link to="/addressList">
        <div class="box">
          <div class="content-box">
            <img class="icon" src="../assets/img/ad.png">
            <div class="content">收货地址</div>
          </div>
          <img class="font" src="../assets/img/icon-font.png">
        </div>
      </router-link>
      <div class="blank" />
      <router-link to="/orderlist">
        <div class="box">
          <div class="content-box">
            <img class="icon" src="../assets/img/order.png">
            <div class="content">我的订单</div>
          </div>
          <img class="font" src="../assets/img/icon-font.png">
        </div>
      </router-link>
      <div class="blank" />
      <router-link to="/about?key=about">
        <div class="box">
          <div class="content-box">
            <img class="icon" src="../assets/img/about.png">
            <div class="content">关于我们</div>
          </div>
          <img class="font" src="../assets/img/icon-font.png">
        </div>
      </router-link>
      <div class="blank" />
      <router-link to="/about?key=contact">
        <div class="box">
          <div class="content-box">
            <img class="icon" src="../assets/img/contact.png">
            <div class="content">联系我们</div>
          </div>
          <img class="font" src="../assets/img/icon-font.png">
        </div>
      </router-link>
      <div class="blank" />
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
const WEBAPI = require('apifm-webapi')
export default {
  data() {
    return {
      userDetail: undefined,
      userAmount: undefined
    }
  },
  mounted() {
    this.getUserDetail()
    this.getUserAmount()
  },
  methods: {
    async getUserDetail() {
      const res = await WEBAPI.userDetail(getToken())
      if (res.code === 0) {
        this.userDetail = res.data
      } else {
        this.$toast(res.msg)
      }
    },
    async getUserAmount() {
      const res = await WEBAPI.userAmount(getToken())
      if (res.code === 0) {
        this.userAmount = res.data
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss">
page{
  position: relative;
}
.mycard{
  height: 100px;
  width: 100vw;
  background-color: #ff340d;
}
.card-bar{
  background: #fff;
  position: absolute;
  top:20px;
  left: 37.5px;
  width: 300px;
  height: 140px;
  border-radius: 2%;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  .card-box{
    display: flex;
    margin-left: 15px;
    margin-top: 15px;
    align-items: center;
    .my-photo{
      width: 35px;
      height: 35px;
      object-fit: cover;
      border-radius: 50%;
    }
    .name{
      font-family: PingFangSC;
      font-size: 14px;
      font-weight: 600;
      color: #3d3d3d;
      margin-left: 10px;
    }
  }
  .balance{
    display: flex;
    align-items: flex-end;
    margin-left: 130px;
    margin-top: 20px;
    .box{
      display: flex;
      align-items: flex-end;
      .units{
        font-size: 16px;
        margin-right: 6px;
        margin-bottom: 4px;
        color:#ff340d;
      }
      .m{
        color:red;
        font-size: 35px;
      }
    }
    .title{
      font-size: 12px;
      margin-bottom: 6px;
      margin-left: 4px;
    }
  }
}
.content-bar{
  margin-top: 150px;
  .box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content-box{
      display: flex;
      align-items: center;
      margin-left: 50px;
      margin-top: 15px;
      margin-bottom: 15px;
      .icon{
        width: 28px;
        height: 28px;
      }
      .content{
        font-size: 16px;
        color: #3c3c3c;
        margin-left:16px ;
      }
    }
    .font{
      height: 20px;
      width: 20px;
      margin-right: 25px;
    }
  }
  .blank{
    width: 260px;
    height: 1px;
    background-color: #ebebeb;
    margin-left: 90px;
  }
}
</style>
