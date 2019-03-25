const http = require("./../../../utils/http.js");
const app = getApp();

const images = [
  "http://article.qiuhuiyi.cn/hui_yi_15532398760009200",
  "http://article.qiuhuiyi.cn/hui_yi_15532398790002956"
]

const goods = [
  { 
    attachments: ["http://article.qiuhuiyi.cn/hui_yi_15532398010009612"],
    name:'小米9',
    describe:'小米旗舰机',
    price:99,
    chalk_line_price:100
  },
  {
    attachments: ["http://article.qiuhuiyi.cn/hui_yi_15532398790002956"],
    name: '小米9',
    describe: '小米旗舰机',
    price: 99,
    chalk_line_price: 100
  },
  {
    attachments: ["http://article.qiuhuiyi.cn/hui_yi_15532398760009200"],
    name: '小米9',
    describe: '小米旗舰机',
    price: 99,
    chalk_line_price: 100
  },
  {
    attachments: ["http://article.qiuhuiyi.cn/hui_yi_15532398790002956"],
    name: '小米9',
    describe: '小米旗舰机',
    price: 99,
    chalk_line_price: 100
  },
  {
    attachments: ["http://article.qiuhuiyi.cn/hui_yi_15532398760009200"],
    name: '小米9',
    describe: '小米旗舰机',
    price: 99,
    chalk_line_price: 100
  },
];

Page({

  data: {
    showAuth: false,
    attachments: images,
    goodsList: goods
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
   * 搜索商品
   */
  search:function(){

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