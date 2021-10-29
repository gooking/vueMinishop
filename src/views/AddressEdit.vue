<template>
  <div>
    <van-address-edit
      :show-delete="deleteBtnShow"
      show-search-result
      :address-info="addressInfo"
      :show-area="false"
      :search-result="searchResult"
      @save="onSave"
    />
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
const WEBAPI = require('apifm-webapi')

export default {
  data() {
    return {
      deleteBtnShow: false,
      addressInfo: {},
      searchResult: []
    }
  },
  mounted() {
    // this.initJssjk()
    this.initData()
  },
  methods: {
    initData() {
      this.addressInfo = {
        name: '',
        tel: '',
        addressDetail: this.$route.query.addr + this.$route.query.name,
        latitude: this.$route.query.latng.split(',')[0],
        longitude: this.$route.query.latng.split(',')[1]
      }
    },
    // 保存
    async onSave(content) {
      const res = await WEBAPI.addAddress({
        token: getToken(),
        provinceId: 0,
        cityId: 0,
        linkMan: content.name,
        mobile: content.tel,
        address: content.addressDetail,
        latitude: content.latitude,
        longitude: content.longitude,
        isDefault: true
      })
      if (res.code !== 0) {
        this.$toast(res.msg)
        return
      }
      this.$toast('添加成功')
      if (this.$route.query.topay) {
        this.$router.push('/toPay')
      } else {
        this.$router.push('/addressList')
      }
    }
  }
}
</script>
<style lang="scss"></style>
