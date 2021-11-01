<template>
  <div class="introduce-box">
    <div class="introduce-content" v-html="content"/>
  </div>
</template>
<script>

export default {
  data() {
    return {
      content: undefined
    }
  },
  mounted() {
    this.cmsPage()
  },
  methods: {
    // 获取餐馆信息
    async cmsPage() {
      const res = await this.$wxapi.cmsPage(this.$route.query.key)
      if (res.code === 0) {
        this.content = res.data.content
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.introduce-box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  .introduce-content {
    font-size: 16px;
    color: #333333;
    line-height: 2.3;
  }
}
</style>
