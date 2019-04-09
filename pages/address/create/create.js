let QQMapWX = require('./../../../utils/qqmap-wx-jssdk.js');
const http = require("./../../../utils/http.js");
const config = require("./../../../config.js");
const app = getApp();
let qqmapsdk;

Page({

  data: {
    addressId:'',
    receiver:'',
    phone:'',
    region:'',
    detailAddress:'',
    defaultSetting:false,
    province:'',
    nation:'',
    city:'',
    district:'',
    street:'',
    addressDetail:'',
    latitude:'',
    longitude:''
  },

  onLoad: function (options) {
    let id = options.id;
    if(id){
      this.setData({addressId:id});
      this.getAddressDetail();
    }
    qqmapsdk = new QQMapWX({
      key: config.TX_MAP_KEY
    });
  },

  getAddressDetail:function(){
    wx.showLoading({
      title: '加载中'
    })
    http.get(`/address/${this.data.addressId}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        this.setData({
          receiver: resData.data.receiver,
          phone: resData.data.phone,
          nation: resData.data.nation,
          province: resData.data.province,
          city: resData.data.city,
          district: resData.data.district,
          street: resData.data.street,
          detailAddress: resData.data.detail_address,
          longitude: resData.data.longitude,
          latitude: resData.data.latitude,
          defaultSetting: resData.data.type
        })
      }
    });
  },

  /**
   * 设置默认地址
   */
  switchChange:function(e){
    this.setData({ defaultSetting:e.detail.value})
  },

  /**
   * 获取收货人
   */
  getName: function (e) {
    let value = e.detail.value;
    this.setData({
      receiver: value
    });
  },

  /**
   * 获取收货手机
   */
  getPhone:function(e){
    let value = e.detail.value;
    this.setData({
      phone: value
    });
  },

  /**
   * 获取所在区域
   */
  getRegion:function(){
    wx.chooseLocation({
      success: response=> {
        let latitude = response.latitude;
        let longitude = response.longitude;

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: res => {
            console.log(res);
            let resData = res.result.address_component;
            this.setData({
              nation:resData.nation,
              province:resData.province,
              city:resData.city,
              district:resData.district,
              street:resData.street,
              detailAddress:res.result.formatted_addresses.recommend,
              latitude: latitude,
              longitude: longitude
            });
            console.log(this.data.addressDetail);
          },
          fail: function (res) {
            wx.showToast({
              title: '获取地理信息失败',
              icon: 'none'
            })
          }
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '获取地理信息失败',
          icon:'none'
        })
      }
    })
  },

  /**
   * 获取详细地址
   */
  getDetailAddress:function(){
    let value = e.detail.value;
    this.setData({
      detailAddress: value
    });
  },

  /**
   * 提交地址信息
   */
  submitAddress:function(){
    let name = this.data.receiver;
    let phone = this.data.phone;

    if(name == ''){
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none'
      })
      return false;
    }

    if (phone == '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      })
      return false;
    }

    wx.showLoading({
      title: '提交中'
    })

    http.post(`/address`, {
      address_id: this.data.addressId,
      receiver:name,
      phone:phone,
      nation:this.data.nation,
      province:this.data.province,
      city:this.data.city,
      district:this.data.district,
      street: this.data.street,
      detail_address: this.data.detailAddress,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      type: this.data.defaultSetting
    }, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        wx.navigateBack({ comeBack: true });
      } else {
        wx.showToast({
          title: resData.message,
          icon: 'none'
        })
      }
    });

  }

})