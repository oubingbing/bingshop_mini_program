const http = require("./../../../utils/http.js");
const app = getApp()

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
    categories: [],
    goods: [],
    toView:"v1",
    toGoodsView:"v1",
    selectCategory:'',
    scrollWithAnimation:true
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中'
    })

    this.getCategories();

  },

  selectCategory:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: 'v'+id,
      selectCategory:id,
      toGoodsView:'v1'
    })

    //获取分类商品
    http.get(`/category/${id}/goods`, {}, res => {

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
  },

  /**
   * 获取商品类目
   */
  getCategories:function(){
    http.get(`/categories`,{},res => {
      wx.hideLoading();
      this.setData({
        showGeMoreLoadin: false
      })

      let resData = res.data;
      console.log(resData);
      if(resData.code != 0){
        wx.showToast({
          title: '系统繁忙~_~',
          icon:'none'
        })
      }

      let categoryList = this.data.categories;
      resData.data.categories.map((item,index)=>{
        if(index == 0){
          //勾选tab
          this.setData({selectCategory:item.id})
        }
        categoryList.push(item);
      })

      this.setData({
        categories:categoryList,
        goods: resData.data.goods
      })
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

  /**
   * 查看商品详情
   */
  openGoodsDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id='+id
    })
  }

})