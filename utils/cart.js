const http = require("./http.js");
const app = getApp();

/**
 * 设置购物车图标数量
 */
const setCartBadge = function (timestamp) {
  getCartNun(res=>{
    let resData = res.data;
    if (resData.code == 0) {
      let num = resData.data;
      if (num > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: num
        })
      } else {
        wx.removeTabBarBadge({ index: 2 })
      }
    }
  })
}

const getCartNun = function(call){
  http.get(`/cart/num`, {}, res => {
    call(res);
  });
}

module.exports = { setCartBadge, getCartNun}
