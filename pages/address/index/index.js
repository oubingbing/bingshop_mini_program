const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    address:[]
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getAddress();
  },

  onShow:function(){
    this.getAddress();
  },

  createPost:function(){
    wx.navigateTo({
      url: "/pages/address/create/create"
    })
  },

  /**
   * 获取地址列表
   */
  getAddress:function(){
    http.get(`/address`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        this.setData({
          address:resData.data
        })
      }
    });
  },

  /**
   * 删除收货地址
   */
  removeAddress:function(e){
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确认将该地址吗',
      success: res => {
        if (res.confirm) {
          http.del(`/address/${id}`, {}, res => {
            wx.hideLoading();
            let resData = res.data;
            if (resData.code == 0) {
              let addressList = this.data.address;
              let newAddress = addressList.filter(item => {
                if (item.id != id) {
                  return item;
                }
              })
              this.setData({ address: newAddress })
            }
          });
        }
      }
    })
  },

  openAddress:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/address/create/create?id="+id
    })
  }
})