const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    orderId: '',
    order:''
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      orderId: options.id
    })
    this.getOrder();
  },

  /**
   * 获取订单详情
   */
  getOrder:function(){
    http.get(`/order/${this.data.orderId}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        let order = resData.data;
        order.actual_amount = util.floar(order.actual_amount);
        order.amount = util.floar(order.amount);
        order.order_items = order.order_items.map(sub => {
          sub.sku_snapshot.price = util.floar(sub.sku_snapshot.price);
          return sub;
        })
        order.status_string = util.formatStatus(order.status);
        this.setData({
          order: order
        })
      }
    });
  }
})