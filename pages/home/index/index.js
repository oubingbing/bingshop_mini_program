const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    selectHeader:1,
    showAuth:false,
    showBank:false,
    showGeMoreLoadin:false,
    showNotMoreTip:false,
    banks:'',
    categories:'',
    activityList:[],
    filterCategories:[],
    filterBanks:[],
    activityType:1,
    sharecomeIn: false,
    detailId: '',
    userId:''
  },

  onLoad: function (e) {
    if (e.id != undefined && e.id) {
      this.setData({ sharecomeIn: true, detailId: e.id, userId:e.user_id })
    }
    wx.showLoading({
      title: '加载中'
    });

    console.log("进来的是啥")
    console.log(e)


    this.checkoutAuth();
    this.getTodayActivity();
  },

  onShow: function (option) {
    if (app.globalData.needToReloadShareActivity){
      app.globalData.needToReloadShareActivity = false;
      this.setData({
        pageNumber: this.data.initPageNumber,
        filterCategories: [],
        filterBanks: []
      })
      this.getShareActivity();
    }
  },

  /**
   * 跳转到用户分享页面
   */
  posterShare: function (e) {
    wx.navigateTo({
      url: '/pages/home/create_activity/create_activity'
    })
  },

  /**
   * 跳转到详情页面
   */
  openDetail:function(e){
    let id = e.currentTarget.dataset.obj_id;
    wx.navigateTo({
      url: '/pages/home/coupon_detail/coupon_detail?id=' + id
    })
  },

  /**
   * 筛选
   */
  serchActivity:function(){
    let temBankIds = [];
    this.data.banks.map(item=>{
      if(item.id != 0 && item.select == true){
        temBankIds.push(item.id); 
      }
    })

    let temCategoryIds = [];
    this.data.categories.map(item => {
      if (item.id != 0 && item.select == true) {
        temCategoryIds.push(item.id);
      }
    })

    this.setData({
      filterBanks:temBankIds,
      filterCategories:temCategoryIds,
      selectHeader:1,
      activityList:[]
    })
    this.getTodayActivity();
  },

  /**
   * 选择优惠类型进行过滤
   */
  selectCategoyrToFilter:function(e){
    let id = e.currentTarget.dataset.obj_id;
    let selectStatus = false;
    let newCategories = this.data.categories.map(item=>{
      if(item.id == id){
        if(item.select){
          item.select = false;
          selectStatus = false;
        }else{
          item.select = true;
          selectStatus = true;
        }
      }
      return item;
    })

    if(id == 0 && selectStatus == true){
      newCategories.map(item=>{
        if(item.id != 0){
          item.select = false;
        }
      })
    }else{
      newCategories.map(item => {
        if (item.id == 0) {
          item.select = false;
        }
      })
    }

    this.setData({ categories:newCategories})
  },

  /**
   * 选择银行进行过滤
   */
  selectBankToFilter:function(e){
    let id = e.currentTarget.dataset.obj_id;
    let selectStatus = false;
    let newBanks = this.data.banks.map(item => {
      if (item.id == id) {
        if (item.select) {
          item.select = false;
          selectStatus = false;
        } else {
          item.select = true;
          selectStatus = true;
        }
      }
      return item;
    })

    if (id == 0 && selectStatus == true) {
      newBanks.map(item => {
        if (item.id != 0) {
          item.select = false;
        }
      })
    } else {
      newBanks.map(item => {
        if (item.id == 0) {
          item.select = false;
        }
      })
    }

    this.setData({ banks: newBanks })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    switch (this.data.selectHeader){
      case "1":
        //this.getTodayActivity();
        break;  
      case "2":
        this.setData({ showGeMoreLoadin: true });
        this.getFutureActivity();
        break;
      case "4":
        this.setData({ showGeMoreLoadin: true });
        this.getShareActivity();
        break;
    }
  },

  /**
   * 获取当天可用
   */
  getTodayActivity:function(){
    http.get(`/today_activities?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter_banks=${this.data.filterBanks}&filter_categories=${this.data.filterCategories}&type=${this.data.activityType}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      this.setData({ showGeMoreLoadin: false, showNotMoreTip: true })      
      if(resData.code == 0){
        if (resData.code == 0) {
          let activityTemp = [];
          for (var item in resData.data) {
            activityTemp.push({ time: item, data: resData.data[item] })
          }
          this.setData({ activityList: activityTemp, pageNumber: this.data.pageNumber + 1 })
        }
      }
    })
  },

  /**
   * 获取最新预告
   */
  getFutureActivity: function () {
    http.get(`/future_activities?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter_banks=${this.data.filterBanks}&filter_categories=${this.data.filterCategories}&type=${this.data.activityType}`, {}, res => {
      let resData = res.data;
      this.setData({ showGeMoreLoadin: false })
      if(resData.code==0){
        if (resData.data.page_data) {
          if (resData.data.page_data.length <= 0) {
            this.setData({ showNotMoreTip: true })
          }
          if (resData.code == 0) {
            let activityTemp = this.data.activityList;
            for (var item in resData.data.page_data) {
              activityTemp.push({ time: item, data: resData.data.page_data[item] })
            }
            this.setData({ activityList: activityTemp, pageNumber: this.data.pageNumber + 1, showGeMoreLoadin: false })
          }
        }
      }
    })
  },
  /**
   * 获取玩家分享活动
   */
  getShareActivity:function(){
    http.get(`/share/activities?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter_banks=${this.data.filterBanks}&filter_categories=${this.data.filterCategories}&type=${this.data.activityType}`, {}, res => {
      let resData = res.data;
      this.setData({ showGeMoreLoadin: false })
      if (!resData.data.page_data) {
        this.setData({ showNotMoreTip: true })
      }
      if (resData.code == 0) {
        if (resData.data.page_data.length <= 0) {
          this.setData({ showNotMoreTip: true })
        }
        if(resData.data.page_data){
          let activityTemp = this.data.activityList;
          for (var item in resData.data.page_data) {
            activityTemp.push({ time: item, data: resData.data.page_data[item] })
          }
          this.setData({ activityList: activityTemp, pageNumber: this.data.pageNumber + 1 })
        }
      }
    })
  },

  /**
   * 获取银行列表
   */
  getBank:function(){
    http.get("/banks", {}, res => {
      let resData = res.data;
      if (resData.code == 0) {
        if(resData.data){
          resData.data.map(item => {
            item.select = false;
            return item;
          })
          resData.data.unshift({ id: 0, name: '全部', select: true })
          this.setData({ banks: resData.data })
        }
      }
    })
  },

  /**
   * 获取类型列表
   */
  getCategory: function () {
    wx.showLoading({
      title: '加载中'
    });
    http.get("/categories", {}, res => {
      let resData = res.data;
      wx.hideLoading()
      if (resData.code == 0) {
        if(resData.data){
          resData.data.map(item => {
            item.select = false;
            return item;
          })
          resData.data.unshift({ id: 0, name: '全部', select: true })
          this.setData({ categories: resData.data })
        }
      }
    })
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
   * 切换显示银行或者优惠类型
   */
  switchBank:function(){
    let showBank = this.data.showBank;
    if (showBank) {
      this.setData({ showBank: false })
    } else {
      this.setData({ showBank: true })
    }
  },

  /**
   * 切换header
   * @author yezi
   */
  switchHeader:function(e){
    let switchType = e.currentTarget.dataset.type;
    this.setData({ 
      selectHeader: switchType, 
      pageNumber: this.data.initPageNumber,
      showGeMoreLoadin: false,
      showNotMoreTip: false,
    })

    if(switchType == 3){
      //加载优惠类型和银行
      if(!this.data.banks){
        this.getBank();
      }
      if(!this.data.categories){
        this.getCategory();
      }
    }else if(switchType == 1){
      this.setData({ activityList: [],activityType:1 })
      this.getTodayActivity();
    }else if(switchType == 2){
      this.setData({ activityList: [], activityType: 1})
      this.getFutureActivity();
    }else{
      //获取分享广场
      this.setData({ activityList: [], activityType: 2})
      this.getShareActivity();
    }
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