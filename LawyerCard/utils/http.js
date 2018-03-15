var rootDomain = 'https://weixin.lawyer-says.com';
// var rootDomain = 'http://192.168.0.128:8085';

function http_post (url, data, cb) {
  wx.showNavigationBarLoading()
  // wx.showLoading({
  //   title: '加载中...',
  //   mask: true
  // })
  var token;
  try {
    token = ''
  } catch (e) {
    token = ''
  }
  wx.getNetworkType({
    success: function(res) {
      var networktype = res.networkType
      if (networktype == "none") {
        wx.showToast({
          title: '当前为无网络状态',
          icon: 'loading',
          duration: 1000
        })
      } else {
        wx.request({
          url: rootDomain + url,
          data: data,
          method: 'POST',
          dataType: 'json',
          header: {
            'Content-Type': 'application/json'
          },
          success: res => {
            return typeof cb == 'function' && cb(res.data)
          },
          fail: () => {
            return typeof cb == 'function' && cb(false)
            wx.showToast({
              title: '网络繁忙',
              icon: 'loading',
              duration: 1000
            })
          },
          complete: res => {
            wx.hideNavigationBarLoading()
            // wx.hideLoading()
            if (res.errMsg.match('request:fail')) {
              wx.showToast({
                title: '网络繁忙',
                icon: 'loading',
                duration: 1000
              })
            }
          }
        })
      }
    },
  })
  
}
function http_get(url, cb) {
  wx.showNavigationBarLoading()
  // wx.showLoading({
  //   title: '加载中...',
  // })
  var token;
  try {
    token = ''
  } catch (e) {
    token = ''
  }
  wx.getNetworkType({
    success: function(res) {
      var networktype = res.networkType
      if (networktype == "none") {
        wx.showToast({
          title: '当前为无网络状态',
          icon: 'loading',
          duration: 1000
        })
      } else {
        wx.request({
          url: rootDomain + url,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
          success: res => {
            return typeof cb == 'function' && cb(res.data)
          },
          fail: () => {
            return typeof cb == 'function' && cb(false)
            wx.showToast({
              title: '网络繁忙',
              icon: 'loading',
              duration: 1000
            })
          },
          complete: res => {
            wx.hideNavigationBarLoading()
            // wx.hideLoading()
            if (res.errMsg == 'request: fail') {
              wx.showToast({
                title: '网络繁忙',
                icon: 'loading',
                duration: 1000
              })
            }
          }
        })
      }
    },
  })
  
}

module.exports = {
  http_post: http_post,
  http_get: http_get
}

