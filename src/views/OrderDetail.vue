<template>
  <div v-if="orderInfo" class="orderDetailContainer">
    <div class="order-status-bar">
      <div class="order-status">
        <div class="title">订单状态</div>
        <div class="order-number">订单编号：{{ orderInfo.orderInfo.orderNumber }}</div>
        <div class="order-time">下单时间：{{ orderInfo.orderInfo.dateAdd }}</div>
      </div>
      <div class="paid">{{ orderInfo.orderInfo.statusStr }}</div>
    </div>
    <div class="blank" />
    <!-- <div class="shops-bar">
      <div class="shops-box">
        <div class="content">
          <div class="titles">{{ orderInfo.logistics.linkMan }}</div>
        </div>
        <div class="text">{{ orderInfo.logistics.address }}</div>
      </div>
      <div class="get">自取</div>
    </div> -->
    <div class="shops-bar">
      <div class="shops-box">
        <div class="content">
          <div class="titles">联系人</div>
        </div>
        <div class="text">{{ orderInfo.logistics.linkMan }}</div>
      </div>
    </div>
    <div class="shops-bar">
      <div class="shops-box">
        <div class="content">
          <div class="titles">联系电话</div>
        </div>
        <div class="text">{{ orderInfo.logistics.mobile }}</div>
      </div>
    </div>
    <div class="shops-bar">
      <div class="shops-box">
        <div class="content">
          <div class="titles">配送地址</div>
        </div>
        <div class="text">{{ orderInfo.logistics.address }}</div>
      </div>
    </div>
    <div class="blank1" />
    <div v-for="goods in orderInfo.goods" :key="goods.id" class="orderdetails-bar">
      <img mode="aspectFill" class="photos" :src="goods.pic">
      <div class="titles-bar">
        <div class="titles-box1">
          <div class="titles">{{ goods.goodsName }}</div>
          <div class="price">¥{{ goods.amount }}</div>
        </div>
        <div class="titles-box2">
          <!-- <div class="titles">一般口味</div> -->
          <div class="num">×{{ goods.number }}</div>
        </div>
      </div>
    </div>
    <div class="blank2" />

    <div class="shops-bar1">
      <div class="shops-box">
        <div class="content">
          <div class="titles">备注信息</div>
        </div>
        <div class="text">{{ orderInfo.orderInfo.remark ? orderInfo.orderInfo.remark : '无' }}</div>
      </div>
    </div>
    <div class="num-bar">
      <div class="num">共 {{ orderInfo.orderInfo.goodsNumber }} 件商品，小计</div>
      <div class="price">¥{{ orderInfo.orderInfo.amountReal }}</div>
    </div>
    <div class="blank1" />
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      orderInfo: undefined
    }
  },
  mounted() {
    this.orderDetail()
  },
  methods: {
    async orderDetail() {
      const res = await this.$wxapi.orderDetail(getToken(), this.$route.query.id)
      if (res.code === 0) {
        if (res.data.orderInfo.status === 3) {
          res.data.orderInfo.statusStr = '交易成功'
        }
        this.orderInfo = res.data
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.order-status-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:19px 20px 20px 20px ;
  .order-status{
    .title{
      font-family: AlibabaPuHuiTiB;
      font-size: 15px;
      color: #3c3c3c;
    }
    .order-number{
      font-family: PingFangSC;
      font-size: 12px;
      color: #8a8a8a;
      margin-top:5px ;
    }
    .order-time{
      font-family: PingFangSC;
      font-size: 12px;
      color: #8a8a8a;
      margin-top: 5px;
    }
  }
  .paid{
    width: 60px;
    height: 28px;
    background-color: #ff340d;
    font-size: 13px;
    color: #ffffff;
    text-align: center;
    line-height: 28px;
    border-radius: 3px;
  }
}
.blank{
  width: 100vw;
  height: 5px;
  background-color: #f5f5f5;
}
.shops-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:10px 20px ;
  .shops-box{
    display: flex;
    flex-direction: column;
    .content{
      display: flex;
      align-items: center;
      margin-bottom:5px ;
      .titles{
        font-family: AlibabaPuHuiTiB;
        font-size: 15px;
        color: #3c3c3c;
        margin-right: 5px;
      }
    }
    .text{
      font-family: PingFangSC;
      font-size: 13px;
      color: #8a8a8a;
    }
  }
  .get{
    width: 46px;
    height: 28px;
    background-color: #1f1f1f;
    font-family: PingFangSC;
    font-size: 13px;
    color: #ffffff;
    text-align: center;
    line-height: 28px;
    border-radius: 3px;

  }
}
.get1{
  width: 72px;
  height: 28px;
  border-radius: 2%;
  border: solid 1px #e0c078;
  background-color: #fdf4e0;
  font-family: PingFangSC;
  font-size: 13px;
  color: #e0c078;
  text-align: center;
  line-height: 28px;
}

.blank1{
  height: 5px;
  background-color: #f5f5f5;
}

.orderdetails-bar{
  margin-top: 5px;
  padding:8px 20px ;
  display: flex;
  .photos{
    width: 80px;
    height:80px;
    border-radius: 5px;
    background-color: #f5f5f5;flex-shrink: 0;
  }
  .titles-bar{
    margin-left:10px;
    margin-top: 2px;
    flex: 1;
  }
  .titles-box1{
    display: flex;
    justify-content: space-between;
    .titles{
      font-family: AlibabaPuHuiTiB;
      font-size: 15px;
      color: #3c3c3c;
    }
    .price{
      display: flex;
      align-items:flex-end;
      background-color: #fefdfc;
      font-family: PingFangSC;
      font-size: 15px;
      font-weight: 600;
      color: #1f1f1f;
    }
  }
  .titles-box2{
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC;
    font-size: 11px;
    color: #8a8a8a;
  }

}
.blank2{
  width: 335px;
  height: 1px;
  background-color: #ebebeb;
  margin-left:20px ;
}

.shops-bar1{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:10px 20px 10px 20px ;
  .shops-box{
    font-size: 15px;
    .text{
      margin-top: 5px;
    }
  }
}
.num-bar{
  padding:0px 20px 10px 20px ;
  display: flex;
  justify-content: space-between;
  .num{
    font-family: PingFangSC;
    font-size: 13px;
    color: #8a8a8a;
  }
  .price{
    display: flex;
    justify-content: space-between;
    align-items:flex-end;
    background-color: #fefdfc;
    font-family: PingFangSC;
    font-size: 15px;
    font-weight: 600;
    color: #fa5c01;
  }
}
.pay-bar{
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  box-shadow: 0 -0.5px 0 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0px;
  width: 375px;
  height: 60px;
  .pay-box{
    display: flex;
    flex-direction: column;
    margin-left:20px ;
    margin-top:10px;
    .title{
      font-family: PingFangSC;
      font-size: 11px;
      text-align: justify;
      color: #3c3c3c;
    }
    .price{
      font-family: PingFangSC;
      font-size: 16px;
      font-weight: 600;
      color: #fa5c01;
    }
  }
  .pay-byn{
    width: 188px;
    height: 40px;
    border-radius: 6px;
    background-color: #fa5c01;
    margin-top: 10px;
    margin-right: 20px;
    font-family: PingFangSC;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    line-height: 40px;
    color: #ffffff;
  }
}

</style>
