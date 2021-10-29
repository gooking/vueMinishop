<template>
  <div v-if="cartInfo && cartInfo.number > 0" class="shopCartContainer">
    <div class="modelTit">
      <span>购物车</span>
      <van-button plain round size="mini" type="danger" @click="emptyShopCart">清空</van-button>
    </div>
    <ul class="goodsListDiv">
      <li v-for="(item, index) in cartInfo.items" :key="index">
        <div class="goodImg">
          <img :src="item.pic" alt>
        </div>
        <div class="goodInfo">
          <p>{{ item.name }}</p>
          <!-- <span v-if="item.sku">
            <font v-for="_sku in item.sku" :key="_sku.id">
              <font v-for="option in _sku.options" :key="option.id">{{ option.name }}&nbsp;</font>
            </font>
          </span> -->
          <em>¥ {{ item.price }}</em>
        </div>
        <div class="adjustGoodsNumDiv">
          <van-stepper
            v-model="item.number"
            :name="item.name"
            theme="round"
            disable-input
            min="0"
            async-change
            @change="editShopCart(item)"
          />
        </div>
      </li>
    </ul>
    <div class="cartFoot" @click="onSubmit">
      <span>合计：</span>
      <em>{{ cartInfo.price }}</em>
      <van-button round>提交订单</van-button>
    </div>
  </div>
  <div v-else class="shopCartContainer">
    <van-empty description="购物车是空的" />
  </div>
</template>
<script>
const WEBAPI = require('apifm-webapi')
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      cartInfo: undefined
    }
  },
  mounted() {
    this.shippingCarInfo()
  },
  methods: {
    async shippingCarInfo() {
      const res = await WEBAPI.shippingCarInfo(getToken())
      if (res.code === 0) {
        this.cartInfo = res.data
      } else {
        this.cartInfo = null
      }
    },
    async editShopCart(item) {
      if (item.number === 0) {
        await WEBAPI.shippingCarInfoRemoveItem(getToken(), item.key)
        await this.shippingCarInfo()
        return
      }
      await WEBAPI.shippingCarInfoModifyNumber(getToken(), item.key, item.number)
      await this.shippingCarInfo()
    },
    async emptyShopCart() {
      const res = await WEBAPI.shippingCarInfoRemoveAll(getToken())
      if (res.code === 0) {
        await this.shippingCarInfo()
      } else {
        this.$toast(res.msg)
      }
    },
    onSubmit() {
      this.$router.push('/toPay')
    }
  }
}
</script>
<style lang="scss">
.shopCartContainer {
  height: 100%;
  background: #f7f8fa;
  .modelTit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    background: #f7f8fa;
    padding: 0 10px;
    color: #989898;
  }
  .goodsListDiv {
    margin-bottom: 64px;
    li {
      position: relative;
      display: flex;
      // height: 150px;
      // align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      background: #fff;
      // .van-card {
      //   // background:#f7f8fa;
      //   background: #fff;
      // }

      .goodImg {
        display: flex;
        align-items: center;
        padding-right: 20px;
        img {
          width: 90px;
          height: 100px;
        }
      }

      .goodInfo {
        font-size: 14px;
        p {
          padding-top: 20px;
          font-size: 16px;
        }
        /*span {
          color: rgb(112, 111, 111);
        }*/
        em {
          font-style: normal;
          position: absolute;
          bottom: 20px;
          left: 120px;
          font-size: 14px;
          i {
            font-style: normal;
            font-size: 12px;
            float: left;
          }
        }
      }
      .adjustGoodsNumDiv {
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
  }
  .cartFoot {
    position: fixed;
    bottom: 50px;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    text-align: right;
    background: #fff;
    /*border-top: 0.02667rem solid #eee;*/
    span {
      color: #323233;
      font-size: 16px;
    }
    em {
      font-style: normal;
      padding-right: 16px;
      color: #ee0a24;
      font-weight: 500;
      font-size: 16px;
    }
    .van-button--default {
      background: linear-gradient(to right, #ff6034, #ee0a24);
      span {
        color: #fff;
      }
    }
  }
}
</style>
