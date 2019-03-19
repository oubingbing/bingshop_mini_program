const http = require("./../../../utils/http.js");
const app = getApp()

Page({

  data: {
    showAuth: false,
  },

  onLoad: function (options) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showAuth: true
          });
        } else {
          //已授权
        }
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  /**
 * 检测用户授权
 */
  checkoutAuth: function () {
    let theUrl = '/pages/home/coupon_detail/coupon_detail?id=' + this.data.detailId + '&user_id=' +            this.data.userId;
    let that = this;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log("弹出授权弹窗")
          this.setData({
            showAuth: true
          });
        } else {
          
        }
      }
    })
  },


  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({ showAuth: false });
    http.login(null, null, null, res => {
      
    });
  },
})