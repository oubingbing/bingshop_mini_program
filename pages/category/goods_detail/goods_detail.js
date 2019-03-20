const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    goodsId:'',
    goods:'',
    standards:''
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      goodsId:options.id
    })
    this.goodsDetail();
  },

  goodsDetail:function(){
    http.get(`/goods/${this.data.goodsId}`, {}, res => {
      let resData = res.data;
      console.log(resData);
      this.setData({
        goods: resData.data.goods,
        standards: resData.data.standards
      })
    });
  }
})