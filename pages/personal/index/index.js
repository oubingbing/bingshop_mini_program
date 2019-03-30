const http = require("./../../../utils/http.js");

Page({

  data: {
    waitPay:0,
    waitDispatch:0,
    dispatching:0,
    refunding:0,
    finish:0
  },

  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#528B8B'
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.getOrderStatus();
  },

  /**
   * 获取用户订单统计数据
   */
  getOrderStatus:function(){
    http.get(`/order/status`, {}, res => {
      let resData = res.data;
      if (resData.code == 0) {
        let waitPay      = 0;
        let waitDispatch = 0;
        let dispatching  = 0;
        let refunding    = 0;
        let finish       =0;
        let data = resData.data;

        if (data.wait){
          waitPay += data.wait;
        }

        if(data.paid){
          waitDispatch += data.paid;
        }

        if (data.pay_fail){
          waitPay += data.pay_fail;
        }

        if (data.wait_dispatch) {
          waitDispatch += data.wait_dispatch;
        }

        if (data.dispatch) {
          dispatching += data.dispatch;
        }

        if (data.refunding) {
          refunding += data.refunding;
        }

        if (data.finish) {
          finish += data.finish;
        }

        this.setData({
          waitPay: waitPay,
          waitDispatch: waitDispatch,
          dispatching: dispatching,
          refunding: refunding,
          finish: finish
        })
      }

    })
  },

  /**
   * 查看我的订单
   */
  openOrder: function (e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/order/index/index?select_type=' + type
    })
  }
})