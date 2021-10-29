<template>
  <div>
    <van-address-list
      :list="addressList"
      :switchable="topay == '1'"
      @add="onAdd"
      @select="selectItem"
    >
      <template #item-bottom="item">
        <van-button type="danger" size="mini" round @click="deleteAddress(item)">删除</van-button>
      </template>
    </van-address-list>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
const WEBAPI = require('apifm-webapi')
export default {
  data() {
    return {
      addressList: [],
      topay: undefined
    }
  },
  mounted() {
    this.getAddressList()
    this.topay = this.$route.query.topay
  },
  methods: {
    async getAddressList() {
      const res = await WEBAPI.queryAddress(getToken())
      if (res.code === 700) {
        this.$toast('暂无收货地址')
        this.addressList = []
        return
      }
      if (res.code === 0) {
        this.addressList = res.data
        this.addressList.forEach(ele => {
          ele.name = ele.linkMan
          ele.tel = ele.mobile
        })
      }
    },
    onAdd() {
      if (this.topay === '1') {
        location.href = 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=http://' + document.domain + '/AddressEdit%3ftopay%3d1&key=' + process.env.VUE_APP_BAIDU_MAP_KEY + '&referer=vueshopdemo'
      } else {
        location.href = 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=http://' + document.domain + '/AddressEdit&key=' + process.env.VUE_APP_BAIDU_MAP_KEY + '&referer=vueshopdemo'
      }
    },
    async deleteAddress(item) {
      const res = await WEBAPI.deleteAddress(getToken(), item.id)
      if (res.code === 0) {
        this.$toast('删除成功')
        this.getAddressList()
      } else {
        this.$toast(res.msg)
      }
    },
    async selectItem(item, index) {
      const _data = Object.assign({}, item)
      _data.isDefault = true
      _data.token = getToken()
      const res = await WEBAPI.updateAddress(_data)
      if (res.code === 0) {
        this.$router.go(-1)
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.van-address-item__edit {
  display: none;
}
.van-address-item__value {
  padding-right: 0;
}
</style>
