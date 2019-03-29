const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    sku:[],
    amount:0,
    orderNumber:''
  },
  onLoad: function (options) {
    this.getSku();
  },

  getSku:function(){
    let sku = wx.getStorageSync('order_skus');
    console.log(sku);
    if (sku == '') {
      wx.showToast({
        title: '获取商品错误',
        icon: 'none'
      })
      return false;
    }

    let skuData = JSON.parse(sku);
    let amount = this.data.amount;
    skuData.map(item=>{
      amount += (item.purchase_num * item.sku.price)
      return item;
    })

    this.setData({
      sku: skuData,
      amount: util.floar(amount)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    let addressId   = 1;
    let skuData     = [];
    let orderNumber = this.data.orderNumber;

    this.data.sku.map(item => {
      skuData.push({ sku_id: item.sku_id, purchase_num: item.purchase_num })
    })

    if (skuData.length <= 0) {
      wx.showToast({
        title: '商品数据错误',
        icon: 'none'
      })
      return false;
    }

    http.post(`/order`, {
      address_id:addressId,
      sku:skuData,
      order_number: orderNumber
    }, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        let orderNumber = resData.data.order_number;
        let config = resData.data.config;
        this.setData({ orderNumber:orderNumber});
        this.payment(config);
      }else{
        wx.showToast({
          title: resData.message,
          icon:'none'
        })
      }

    })
  },
  payment:function(config){
    wx.requestPayment(
      {
        'timeStamp': config.timeStamp,
        'nonceStr': config.nonceStr,
        'package': config.package,
        'signType': config.signType,
        'paySign': config.paySign,
        'success': function (res) {
          //支付成功
        },
        'fail': function (res) {
          //支付失败
        },
        'complete': function (res) {
          console.log("c");
          console.log(res);
        }
      })
  }
})