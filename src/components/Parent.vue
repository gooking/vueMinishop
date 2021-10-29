<template>
  <div class="container-box">
    <div class="container-main">
      <router-view />
    </div>
    <van-tabbar v-show="$route.meta.showTab" v-model="tabbarName" class="container-footer" :fixed="false" route active-color="#ee0a24">
      <van-tabbar-item name="Home" icon="home-o" replace to="/home">首页</van-tabbar-item>
      <van-tabbar-item name="Cartlist" icon="shopping-cart-o" replace to="/cartlist">购物车</van-tabbar-item>
      <van-tabbar-item name="My" icon="contact" replace to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
const WEBAPI = require('apifm-webapi')

export default {
  data() {
    return {
      tabbarName: 'Home'
    }
  },
  mounted() {
    this.queryConfigBatch()
  },
  methods: {
    async queryConfigBatch() {
      const res = await WEBAPI.queryConfigBatch('gps,paycode,bz1_price,bz2_price,bz3_price,paycodeali,alert_notice')
      if (res.code === 0) {
        const sysconfig = {}
        res.data.forEach(ele => {
          sysconfig[ele.key] = ele.value
        })
        if (this.$route.path === '/home' && sysconfig['alert_notice']) {
          this.$dialog.alert({
            title: '温馨提示',
            message: sysconfig['alert_notice'],
            confirmButtonText: '我知道了',
            confirmButtonColor: 'red',
            messageAlign: 'left'
          })
        }
        this.$store.commit('setSysconfig', sysconfig)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container-header {
    height: 50px;
  }
  .container-main {
    width: 100vw;
    flex: 1;
    overflow: scroll;
  }
  .container-footer {
    width: 100vw;
  }
}
</style>
