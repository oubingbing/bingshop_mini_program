const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    sku: [],
    amount: 0,
    orderNumber: ''
  },
  onLoad: function (options) {
    this.getSku();
  },

  getSku: function () {
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
    skuData.map(item => {
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

  }
})