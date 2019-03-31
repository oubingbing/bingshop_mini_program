const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    sku:[],
    amount:0,
    orderId:'',
  },
  onLoad: function (options) {
    this.getSku();
  },

  onShow:function(){
    let sku = wx.getStorageSync('order_skus');
    if (sku == '') {
      wx.navigateBack({ delta: 2 });
      return false;
    }
  },

  getSku:function(){
    let sku = wx.getStorageSync('order_skus');
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
   * 提交订单
   */
  submitOrder: function () {
    let addressId   = 1;
    let skuData     = [];
    let orderId = this.data.orderId;

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
      order_id: orderId
    }, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        app.globalData.flushCart = true;
        let orderId = resData.data.id;
        let config = resData.data.config;
        this.setData({ orderId: orderId});
        this.payment(config);
      }else{
        wx.showToast({
          title: resData.message,
          icon:'none'
        })
      }

    })
  },

  /**
   * 调起微信支付
   */
  payment:function(config){
    wx.requestPayment(
      {
        'timeStamp': config.timeStamp,
        'nonceStr': config.nonceStr,
        'package': config.package,
        'signType': config.signType,
        'paySign': config.paySign,
        'success': res=> {
          let id = this.data.orderId;
          wx.removeStorageSync('order_skus');
          wx.navigateTo({
            url: `/pages/order/detail/detail?id=${id}`
          })
        },
        'fail': function (res) {
          //支付失败
        },
        'complete': res=> {
          console.log("支付完成");
        }
      })
  }
})