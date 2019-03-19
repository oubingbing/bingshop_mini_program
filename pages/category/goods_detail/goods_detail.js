const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550048428582&di=1e0de423d2df501d4166790c9339cb92&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff7246b600c338744dd981da85c0fd9f9d62aa080.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550048428582&di=3c01ba16608e54e69db55bbb5930a0f9&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F1f178a82b9014a90e7c1956da4773912b21bee67.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550048428582&di=02fca2fc77ff50d9f5d0e374bfb1c599&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F2f738bd4b31c8701e96739342a7f9e2f0608ff0b.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    goodsId:'',
    goods:''
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
      if (resData.code != 0) {
        wx.showToast({
          title: '系统繁忙~_~',
          icon: 'none'
        })
      }

      this.setData({
        goods: resData.data
      })
    });
  }
})