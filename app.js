const config = require("./config.js");
const httpUtil = require("./utils/http.js");

App({
  onLaunch: function () {

    this.globalData.apiUrl = config.domain;
    this.globalData.imageUrl = config.qiniuDomain;
    this.globalData.needToReloadShareActivity = false;

    let token = wx.getStorageSync('token');
    console.log('token=' + token);
    if (!token) {
      httpUtil.login();
    }
  },


  globalData: {
    appId:null,
    userInfo: null,
    apiUrl: null,
    needToReloadShareActivity:false
  }
})