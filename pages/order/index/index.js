const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    pageSize: 5,
    pageNumber: 1,
    initPageNumber: 1,
    select:0,
    orders:[],
    showGeMoreLoadin: false,
    notDataTips: false,
  },

  onLoad: function (options) {
    let selectType = options.select_type;
    this.setData({ select: selectType ? selectType:0})
    wx.showLoading({
      title: '加载中',
      icon: "none"
    })
    this.getOrders();
  },

  /**
   * 切换tab
   */
  selectTab:function(e){
    wx.showLoading({
      title: '加载中',
      icon: "none"
    })
    let tab = e.currentTarget.dataset.select;
    this.setData({
      select: tab,
      orders:[],
      pageNumber:this.data.initPageNumber
    });
    this.getOrders();
  },

  /**
   * 获取订单列表
   */
  getOrders:function(){
    http.get(`/orders?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter=${this.data.select}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        let orderArray = this.data.orders;
        resData.data.page_data.map(item=>{
          item.actual_amount = util.floar(item.actual_amount);
          item.order_items = item.order_items.map(sub=>{
            sub.sku_snapshot.price = util.floar(sub.sku_snapshot.price);
            return sub;
          })
          item.status_string = util.formatStatus(item.status);
          orderArray.push(item);
        })

        this.setData({ 
          orders:orderArray,
          pageNumber: this.data.pageNumber + 1,
          showGeMoreLoadin:false,
          notDataTips: resData.data.page_data >= 0 ? true : false
        });
      }
    });
  },

  openDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.getOrders();
  },
})