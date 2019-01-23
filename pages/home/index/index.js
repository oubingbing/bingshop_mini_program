const http = require("./../../../utils/http.js");
const app = getApp()

let theCategories = [];
for(let i=1;i<=6;i++){
  theCategories.push({id:i,name:'手机'})
}

let theGoods = [];
for (let i = 1; i <= 6; i++) {
  theGoods.push({
     id: i, 
     name: '原生态大白菜', 
     'remark':'非常甜，多汁',
     'normal_price':100,
     'vip_price':80,
    'attachments': ['https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=909144937,3981150873&fm=200&gp=0.jpg'] })
}

Page({
  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    categories: theCategories,
    goods: theGoods,
    toView:"v1",
    toGoodsView:"v1",
    selectCategory:1,
    scrollWithAnimation:true
  },

  onLoad: function (e) {

    console.log(this.data.categories)

    //wx.showLoading({
      //title: '加载中'
    //});
  },

  onShow: function (option) {

  },

  scrollView:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: 'v'+id,
      selectCategory:id,
      toGoodsView:'v1'
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {

  },


  /**
   * 检测用户授权
   */
  checkoutAuth:function(){

    let theUrl = '/pages/home/coupon_detail/coupon_detail?id=' + this.data.detailId + '&user_id=' + this.data.userId;
    let that = this;
    wx.getSetting({
      success:res=>{
        if (!res.authSetting['scope.userInfo']) {
          console.log("弹出授权弹窗")
          this.setData({
            showAuth: true
          });
        } else {
          if (that.data.detailId != undefined && that.data.detailId) {
            that.setData({ sharecomeIn: false })
            wx.navigateTo({
              url: theUrl
            })

          }
        }
      }
    })
  },


  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({ showAuth: false});
    http.login(null, null, null, res=> {
      this.getTodayActivity();
      let sharecomeIn = this.data.sharecomeIn;
      let detailId = this.data.detailId;
      if (sharecomeIn == true) {
        this.setData({ sharecomeIn: false })
        wx.navigateTo({
          url: '/pages/home/coupon_detail/coupon_detail?id=' + detailId + '&user_id=' + this.data.userId
        })
      }
    });
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: "优卡",
      path: '/pages/index/index',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})