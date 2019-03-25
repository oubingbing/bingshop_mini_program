const http = require("./../../../utils/http.js");
const cart = require("./../../../utils/cart.js");
const app = getApp()

Page({
  data: {
    carts:[],
    selectAll:true,
    amount:0
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })

    this.getCarts();
  },

  onShow:function(){
    if (app.globalData.flushCart==true){
      cart.setCartBadge();
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
        let amount = this.data.amount;
        cartData.map(item=>{
          item.select = true;
          amount += parseFloat(item.sku.price);
          return item;
        })
        this.setData({
          carts:cartData,
          amount:amount
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
    let amount = 0;
    let cartData = carts.map(item=>{
      if (cartId == item.sku_id){
        if (item.select == true) {
          item.select = false;
        }else{
          item.select = true;
        }
      }
      if (item.select == true){
        amount += parseFloat(item.sku.price);
      }
      return item;
    });

    this.setData({ carts: cartData, amount: amount})
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
              let amount = 0;
              if(resData.code == 0){
                cart.setCartBadge();
                let carts = this.data.carts;
                carts = carts.filter(item=>{
                  if(item.sku_id != skuId){
                    amount += parseFloat(item.sku.price);
                    return item;
                  }
                })
                
                this.setData({ carts: carts, amount: amount})
              }
          });

        }
      }
    })
  },

  /**
   * 查看商品详情
   */
  openDetail:function(e){
    let id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id=' + id
    })
  },

  /**
   * 去支付结算
   */
  toPay:function(){
    let sku = [];
    this.data.carts.map(item => {
      if (item.select == true) {
        sku.push(item);
      }
    });

    if (sku.length <= 0) {
      wx.showToast({
        title: '请选择需要支付的商品',
        icon: 'none'
      })
      return false;
    }

    wx.removeStorageSync('order_skus')
    wx.setStorageSync('order_skus', JSON.stringify(sku))

    wx.navigateTo({
      url: '/pages/cart/confirmation_order/confirmation_order'
    })
  }
})