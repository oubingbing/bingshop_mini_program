const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    carts:[],
    selectAll:true
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })

    this.getCarts();
  },

  onShow:function(){
    if (app.globalData.flushCart==true){
      this.getCarts();
      app.flushCartStatus();
    }
  },

  /**
   * 获取购物车商品
   */
  getCarts:function(){
    http.get(`/carts`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if(resData.code == 0){
        let cartData = resData.data;
        cartData.map(item=>{
          item.select = true;
          return item;
        })
        this.setData({
          carts:cartData
        })
      }
      
    })
  },

  /**
   * 勾选商品
   */
  selectGoods:function(e){
    let cartId = e.currentTarget.dataset.id;
    let carts = this.data.carts;
    let selectAll = true;
    let cartData = carts.map(item=>{
      if (cartId == item.sku_id){
        if (item.select == true) {
          item.select = false;
        }else{
          item.select = true;
        }
      }
      return item;
    });

    this.setData({ carts: cartData})
  },

  /**
   * 将商品移出购物车
   */
  removeCart(e){
    let skuId = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确认将该商品移出购物车?',
      success: res => {
        if (res.confirm) {
          http.del(`/cart/${skuId}/delete`, {}, res => {
              let resData = res.data;
              if(resData.code == 0){
                let carts = this.data.carts;
                carts = carts.filter(item=>{
                  if(item.sku_id != skuId){
                    return item;
                  }
                })
                this.setData({carts:carts})
              }
          });

        }
      }
    })
  },

  openDetail:function(e){
    let id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id=' + id
    })
  }
})