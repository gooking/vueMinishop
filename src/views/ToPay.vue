<template>
  <div class="topay">
    <div class="topay-bar">
      <div class="shop-bar">
        <div class="shop-box">
          <div class="shop-name">配送方式</div>
        </div>
        <van-radio-group v-model="peisongType" direction="horizontal" @change="peisongTypeChange">
          <van-radio name="kd" icon-size="13px">配送</van-radio>
          <van-radio name="pszq" icon-size="13px" >自提</van-radio>
        </van-radio-group>
      </div>
      <!-- <div class="blank" />
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          size="13px"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="tel"
          name="预留电话"
          label="预留电话"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="value"
          label="自提时间"
          input-align="right"
          is-link="boolean"
          placeholder="立即自取（18:48）"
          @click="showPicker = true"
        />
      </van-form> -->
    </div>
    <van-divider />
    <van-cell v-if="defaultAddress" :title="defaultAddress.linkMan + ' ' + defaultAddress.mobile" :label="defaultAddress.address" is-link to="/addressList?topay=1" />
    <van-contact-card
      v-else
      type="add"
      add-text="添加收货地址"
      @click="goAddAddress"
    />
    <div class="topay-list-bar">
      <div class="logo-bar">
        <div class="logo-box">
          <!-- <img mode='aspectFill' class='logo' src='http://a4.peoplecdn.cn/6160e177eab04a7845dd859b974788ea.jpg'/> -->
          <div class="title">商品明细</div>
        </div>
        <router-link to="/home">
          <div class="add">继续加单</div>
        </router-link>
      </div>
      <div class="blank" />
      <div class="title-box">
        <van-row class="van-row">
          <van-col span="14"><div class="name">名称</div></van-col>
          <van-col span="4"><div class="num">数量</div></van-col>
          <van-col span="6"><div class="price">价格</div></van-col>
        </van-row>
      </div>
      <div v-for="(item, index) in cartInfo.items" :key="index" class="list-bar">
        <van-row style="width:100%;">
          <van-col span="14"><div class="name">{{ item.name }}</div></van-col>
          <van-col span="4"><div class="num">×{{ item.number }}</div></van-col>
          <van-col span="6"><div class="price">¥{{ item.price }}</div></van-col>
        </van-row>
      </div>
      <div class="blank" />
      <div v-if="orderCalculate" class="price-bar">
        <!-- <div class="on-sale-box">
          <div class="on-sale">服务费</div>
          <div class="price">¥{{ orderCalculate.amountLogistics }}</div>
        </div> -->
        <div class="total-amount">
          <div class="total">商品小计</div>
          <div class="amount">¥{{ orderCalculate.amountTotle }}</div>
        </div>
      </div>
    </div>
    <van-cell-group>
      <van-cell title="选择包装">
        <template #extra>
          <van-radio-group v-model="bzType" direction="horizontal">
            <van-radio :name="2" icon-size="14px">中等</van-radio>
            <van-radio :name="1" icon-size="14px">普通</van-radio>
            <van-radio :name="3" icon-size="14px">精品</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell v-if="bzType == 1" title="包装费用" :value="'¥' + sysconfig.bz1_price" value-class="cell-price" />
      <van-cell v-if="bzType == 2" title="包装费用" :value="'¥' + sysconfig.bz2_price" value-class="cell-price" />
      <van-cell v-if="bzType == 3" title="包装费用" :value="'¥' + sysconfig.bz3_price" value-class="cell-price" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="配送时间" label="21点前下单 次日中午左右到达" :value="pstimeSelect ? pstimeSelect : '请选择'" is-link @click="pstimesOpen = true" />
      <van-cell title="温馨提示" value="超过21点后下单的如有需要第二天派送的请联系客服" value-class="psjjtx" />
    </van-cell-group>
    <van-cell-group v-if="curFeePeisong">
      <van-cell title="配送里程" :value="distance + '公里'" />
      <van-cell v-if="curFeePeisong.ztDiscounts > 0 && peisongType == 'pszq'" title="自提补贴" :value="'- ¥' + curFeePeisong.ztDiscounts" value-class="cell-price" />
      <van-cell title="服务费" :value="'¥' + orderCalculate.amountLogistics" value-class="cell-price" />
      <van-cell v-if="orderCalculate.amountLogistics > 1000" title="服务费说明" value="您的配送距离较远，可先下单，再联系我们协商服务费" value-class="cell-price" />
    </van-cell-group>
    <van-field
      v-model="remark"
      rows="2"
      autosize
      label="备注"
      label-width="50px"
      size=""
      type="textarea"
      maxlength="50"
      placeholder="请输入备注"
      show-word-limit
    />
    <!-- <div class="remark-bar">
      <div class="invoice-box">
        <div class="title">发票</div>
        <div class="content">该店不支持线上开票，请联系商户</div>
      </div>
    </div> -->
    <div class="blank-bottom" />
    <div v-if="outOfPSArea" class="pay-bar">
      <div class="amount-box amount-box2">
        超出配送访问，仅限配送北京
      </div>
    </div>
    <div v-if="orderCalculate && !outOfPSArea" class="pay-bar">
      <div class="amount-box">
        <div v-if="bzType == 1" class="amount">总计¥{{ (orderCalculate.amountTotle*100 + orderCalculate.amountLogistics*100 + sysconfig.bz1_price*100)/100 }}</div>
        <div v-if="bzType == 2" class="amount">总计¥{{ (orderCalculate.amountTotle*100 + orderCalculate.amountLogistics*100 + sysconfig.bz2_price*100)/100 }}</div>
        <div v-if="bzType == 3" class="amount">总计¥{{ (orderCalculate.amountTotle*100 + orderCalculate.amountLogistics*100 + sysconfig.bz3_price*100)/100 }}</div>
      </div>
      <div class="pay-box">
        <div class="pay" @click="createOrder(false)">确认下单</div>
      </div>
    </div>

    <van-popup v-model="pstimesOpen" position="bottom">
      <!-- <van-datetime-picker
        v-model="currentDate"
        type="month-day"
        title="选择配送时间"
        :formatter="formatter"
        :filter="filter"
        @cancel="pstimesOpen = false"
        @confirm="pstimeConfirm"
      /> -->
      <van-picker
        title="选择配送时间"
        show-toolbar
        :columns="psDateArray"
        @confirm="pstimeConfirm"
        @cancel="pstimesOpen = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
const WEBAPI = require('apifm-webapi')
WEBAPI.init(process.env.VUE_APP_SUB_DOMAIN)
export default {
  data() {
    return {
      peisongType: 'kd',
      defaultAddress: undefined,
      cartInfo: {},
      remark: '',
      outOfPSArea: false,
      curFeePeisong: undefined,
      orderCalculate: {},
      distance: 0,
      bzType: 2,
      pstimesOpen: false,
      currentDate: new Date(),
      pstimeSelect: undefined,
      psDateArray: []
    }
  },
  computed: {
    ...mapGetters(['sysconfig'])
  },
  mounted() {
    this.initPSdate()
    this.shippingCarInfo()
  },
  methods: {
    initPSdate() {
      const dd = new Date()
      dd.setDate(dd.getDate() + 1)
      this.psDateArray.push((dd.getMonth() + 1) + '月' + dd.getDate() + '日')
      dd.setDate(dd.getDate() + 1)
      this.psDateArray.push((dd.getMonth() + 1) + '月' + dd.getDate() + '日')
      // dd.setDate(dd.getDate() + 1)
      // this.psDateArray.push((dd.getMonth() + 1) + '月' + dd.getDate() + '日')
    },
    formatter(type, val) {
      if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
    },
    filter(type, options) {
      if (type === 'month') {
        return options.filter((option) => option > new Date().getMonth())
      }
      if (type === 'day') {
        return options.filter((option) => option > new Date().getDate() && option <= new Date().getDate() + 3)
      }
      return options
    },
    pstimeConfirm(d) {
      // console.log(new Date(d).getMonth() + 1, new Date(d).getDate())
      // this.pstimeSelect = (new Date(d).getMonth() + 1) + '月' + new Date(d).getDate() + '日'
      this.pstimeSelect = d
      this.pstimesOpen = false
    },
    async fetchDefaultAddress() {
      const res = await WEBAPI.defaultAddress(getToken())
      if (res.code === 0) {
        this.defaultAddress = res.data.info
        // 计算配送距离
        const distanceRes = await WEBAPI.gpsDistance({
          key: process.env.VUE_APP_BAIDU_MAP_KEY,
          mode: 'bicycling',
          from: this.$store.getters.sysconfig.gps,
          to: this.defaultAddress.latitude + ',' + this.defaultAddress.longitude
        })
        if (distanceRes.code !== 0) {
          this.$toast('当前地址超出配送范围')
          this.outOfPSArea = true
          return
        }
        const distance = distanceRes.data.result.rows[0].elements[0].distance / 1000.0
        const peisongFeeRes = await WEBAPI.peisongfei()
        if (peisongFeeRes.code !== 0) {
          this.$toast('当前地址超出配送范围')
          this.outOfPSArea = true
          return
        }
        this.distance = distance
        const curFeePeisong = peisongFeeRes.data.find(ele => {
          return ele.distance >= distance
        })
        if (!curFeePeisong) {
          this.$toast('当前地址超出配送范围')
          this.outOfPSArea = true
          return
        }
        this.curFeePeisong = curFeePeisong
        // 计算订单金额
        this.createOrder(true)
      }
    },
    goAddAddress() {
      location.href = 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=http://' + document.domain + '/AddressEdit%3ftopay%3d1&key=' + process.env.VUE_APP_BAIDU_MAP_KEY + '&referer=vueshopdemo'
    },
    async shippingCarInfo() {
      const res = await WEBAPI.shippingCarInfo(getToken())
      if (res.code === 0) {
        this.cartInfo = res.data
      } else {
        this.cartInfo = []
      }
      this.fetchDefaultAddress()
    },
    peisongTypeChange() {
      this.createOrder(true)
    },
    imgPreview(pic) {
      ImagePreview([pic])
    },
    async createOrder(calculate) {
      if (!this.defaultAddress) {
        this.$toast('请选择收货地址')
        return
      }
      const goodsJson = []
      this.cartInfo.items.forEach(ele => {
        goodsJson.push({
          goodsId: ele.goodsId,
          number: ele.number,
          propertyChildIds: '',
          logisticsType: 0
        })
      })
      const _data = {
        calculate: !!calculate,
        token: getToken(),
        goodsJsonStr: JSON.stringify(goodsJson),
        remark: this.remark + (this.peisongType === 'pszq' ? ' ！！！用户到店自提！！！无需配送' : ''),
        peisongType: this.peisongType,
        peisongFeeId: this.curFeePeisong.id,
        provinceId: 0,
        cityId: 0,
        address: this.defaultAddress.address,
        linkMan: this.defaultAddress.linkMan,
        mobile: this.defaultAddress.mobile
      }
      const extJsonStr = {}
      if (this.pstimeSelect) {
        extJsonStr['配送日期'] = this.pstimeSelect
      }
      if (this.bzType === 1) {
        _data.trips = this.sysconfig.bz1_price
        extJsonStr['包装'] = '普通包装'
      }
      if (this.bzType === 2) {
        _data.trips = this.sysconfig.bz2_price
        extJsonStr['包装'] = '中等包装'
      }
      if (this.bzType === 3) {
        _data.trips = this.sysconfig.bz3_price
        extJsonStr['包装'] = '精品包装'
      }
      _data.extJsonStr = JSON.stringify(extJsonStr)
      const res = await WEBAPI.orderCreate(_data)
      if (res.code !== 0) {
        this.$toast(res.msg)
        return
      }
      if (!calculate) {
        this.$toast('下单成功!')
        await WEBAPI.shippingCarInfoRemoveAll(getToken())
        this.$router.replace('/waitPay?id=' + res.data.id)
      } else {
        this.orderCalculate = res.data
      }
    }
  }
}
</script>
<style lang="scss">
.topay {
  width: 100%;
  position: relative;
}
.topay-bar{
  background: #ffffff;
  margin:  8px;
  border-radius: 2%;
  margin-top: 24px;
  .shop-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 6px;
    .shop-box{
      .shop-name{
        font-size: 14px;
      }
      .shop-ad{
        font-size: 12px;
        margin-top: 8px;
      }
    }
    .van-radio__label{
      font-size: 14px;
    }
    .van-radio.van-radio--horizontal{
      margin-right: 0px;
      margin-left: 8px;
    }
  }
  .blank{
    width: 350px;
    border-bottom: 0.5px solid #ddd;
    margin-left: 5px;
  }
  .van-cell.van-cell--13px.van-field{
    font-size: 13px;
    padding: 5px;
    line-height: 33px;
    margin-left: 0px;

  }
  .van-form{
    padding: 0px;
  }
  .van-cell.van-field{
    font-size: 13px;
    padding: 5px;
    line-height: 33px;
    align-items: center;
    margin-left: 0px;
  }
  .van-cell.van-cell--clickable.van-field{
    font-size: 13px;
    line-height: 30px;
  }
  .van-icon.van-icon-arrow.van-cell__right-icon{
    height: 30px;
  }
  .van-icon.van-icon-arrow.van-cell__right-icon::before{
    font-size: 13px;
    min-width: 0px;
    line-height: 30px;
  }
}
.topay-list-bar{
  margin: 0px 8px;
  background-color: #ffffff;
  border-radius: 2%;
  padding-top:18px ;
  .logo-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px 0 18px 6px;
    .logo-box{
      display: flex;
      align-items: center;
      .logo{
        height: 23px;
        width: 23px;
        border-radius: 25%;
      }
      .title{
        font-size: 14px;
        margin-left: 8px;
      }
    }
    .add{
      font-size: 16px;
      color:red;
      margin-right: 20px;
      font-weight: bold;
    }
  
  }
  .blank{
    width: 350px;
    border-bottom: 0.5px solid #ddd;
    margin-left: 5px;
  }
  .title-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin: 12px 6px;
  }
  .list-bar{
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin: 0px 6px 6px 6px;
  }
  .units{
    font-size: 11px;
    margin-left: 6px;
  }
  .meal-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin: 35px 6px 15px 6px;
  }
  .price-bar{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 15px;
    padding-bottom: 12px;
    .on-sale-box{
      display: flex;
      align-items: center;
      font-size: 14px;
      .price{
        margin-left: 4px;
        color:red;
      }
    }
    .total-amount{
      display: flex;
      align-items: center;
      margin-left: 5px;
      margin-right: 6px;
      .total{
        font-size: 13px;
      }
      .amount{
        font-size: 20px;
        margin-left: 4px;
        color:red;
      }
      }

  }
  }
.remark-bar{
  margin: 5px 8px;
  background-color: #ffffff;
  padding: 15px 6px;
  border-radius: 2%;
  .blank{
    width: 350px;
    border-bottom: 0.5px solid #ddd;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .invoice-box{
    display: flex;
    font-size: 13px;
    .content{
      margin-left: 123px;
    }
  }
}
.pay-bar{
  position: fixed;
  bottom: 0PX;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  .amount-box{
    height: 50px;
    width: 275px;
    background-color: #000000;
    color: #ffffff;
    font-size: 15px;
    .amount{
      margin-left: 8px;
      height: 50px;
      line-height: 50px;
    }
  }
  .amount-box2 {
    width: 100vw;
    line-height: 50px;
    text-align: center;
  }
  .pay-box{
    background-color: red;
    height: 50px;
    width: 100px;
    font-size: 15px;
    .pay{
      line-height: 50px;
      text-align: center;
      color: #ffffff;
    }
  }
}
.van-row {
  width: 100%;
  .price {
    text-align: right;
    padding-right: 12px;
  }
  .num {
    text-align: right;
  }
}
.blank-bottom {
  height: 60px;
}
.cell-price {
  color: red;;
}
.bzpic {
  height: 60px;
  object-fit: contain;
}
.psjjtx {
  color: red;
  font-size: 12px;
}
</style>
