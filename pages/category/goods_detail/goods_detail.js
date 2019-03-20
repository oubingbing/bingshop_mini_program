const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    showSku:false,
    showSkuContainer:false,
    interval: 5000,
    duration: 1000,
    goodsId:'',
    goods:'',
    standards:'',
    animationData: {}
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
  },



  selectSku: function(e) {
    // 用that取代this，防止不必要的情况发生
    this.setData({ showSkuContainer:true})
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 400,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(600).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      showSku: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  closeSku: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showSku: false
      })
    }, 200)

    setTimeout(function(){
      that.setData({
        showSkuContainer: false
      })
    },220)
  }
})