const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    sku:[]
  },
  onLoad: function (options) {
    this.getSku();
    console.log(this.data.sku)
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
    this.setData({ sku: JSON.parse(sku) })
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
    let addressId = 1;
    let skuData = [];

    this.data.sku.map(item => {
      skuData.push({ id: item.sku_id, purchase_num: item.purchase_num })
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
      sku:skuData
    }, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {

      }

    })
  }
})