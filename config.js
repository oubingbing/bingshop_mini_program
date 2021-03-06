const config={
  dev:{//开发环境
    domain:"http://127.0.0.1:8000/api/wechat",
    qiniuDomain:"http://article.qiuhuiyi.cn",
  },
  prod:{//生产环境
    domain: "https://bingshop.qiuhuiyi.cn/api/wechat",
    qiniuDomain: "http://article.qiuhuiyi.cn"
  }
}

const domain = config.prod.domain;
//const domain = config.dev.domain;

const qiniuDomain = config.prod.qiniuDomain;
const TX_MAP_KEY = 'XCDBZ-EG7C6-2OIS6-MSJDG-OQ2FT-2EBED';//腾讯地图开发者ID

module.exports = {
  domain, qiniuDomain, TX_MAP_KEY
}