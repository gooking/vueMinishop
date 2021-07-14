# 小票打印机配置教程

## 说明

用户下单以后，通过打印机自动将用户的订单信息打印出来，类似美团外卖；

## 在哪里购买打印机

你可以在任意地方购买打印机，比如淘宝、京东，小票打印机一般都有厂家都打印接口，如果你有开发能力，可以根据打印机厂家提供的打印接口，自行实现有订单后自动打印；

作者比较懒，所以就直接购买 “api工厂”定制调试对接好的打印机，机器买来简单在后台配置一下就可以使用了（偷懒也是有代价的，要多掏 200 元对接费用... 想偷懒，自己又没有技术开发能力的可以选择）

## 打印模版

下面举例 “api工厂”定制的飞鹅打印机的打印模版，其他打印机请自行根据打印机厂家的文档说明

### 参考模版一

```
<CB>${order.qudanhao}号</CB>
<RIGHT>${.now?datetime}</RIGHT>
商品明细
-------------------------------
<#list goods as test>
${test.goodsName}[${test.property!""}] <BOLD>x${test.number}</BOLD> ${test.amount}元
</#list>
-------------------------------
总份数：${order.goodsNumber} 
合计：${order.amountReal}元 
联系人: ${logistics.linkMan} 
联系电话: ${logistics.mobile} 
地址: ${logistics.address} 
备注: ${order.remark} 
配送日期: ${extJson['配送日期']} 
包装: ${extJson['包装']} 
订单号：${order.orderNumber} 
客服电话：15600605890 <BR> 
<QR>http://vueshop.s2m.cc</QR>
```