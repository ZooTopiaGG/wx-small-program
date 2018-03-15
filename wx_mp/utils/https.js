// var rootDocment = 'http://119.29.251.187:8057';//你的域名--测试网  
var rootDocment ='https://jiuyihengtai.cn' 
function reqPost(url, data, cb) {
  wx.showNavigationBarLoading()
  var token;
  try {
    token = wx.getStorageSync('token');
  } catch (e) {
    // Do something when catch error
    token = '';
  }
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      // console.log(networkType)
      if (networkType == "none") {
        wx.showToast({
          title: "当前为无网络状态",
          icon: "loading",
          duration: 1000,
        })
      }
      else{
        wx.request({
          url: rootDocment + url,
          data: data,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            return typeof cb == "function" && cb(res.data)
            console.log(res.data)
          },
          fail: function () {
            return typeof cb == "function" && cb(false)
            wx.showToast({
              title: "服务器无响应",
              icon: "loading",
              duration: 1000,
            })
          },
          complete: function (res) {
            wx.hideNavigationBarLoading()
            console.log(res)
            if (res.errMsg == "request:fail") {
              wx.showToast({
                title: "服务器请求失败",
                icon: "loading",
                duration: 1000,
              })
              return
            }
          }
        })
      }
    }

  })
}


function reqPost2(url, data, cb) {
  wx.showNavigationBarLoading()
  var token;
  try {
    token = wx.getStorageSync('token');
  } catch (e) {
    // Do something when catch error
    token = '';
  }

  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      console.log(networkType)
      if (networkType == "none") {
        wx.showToast({
          title: "当前为无网络状态",
          icon: "loading",
          duration: 1000,
        })
      }
      else{
        wx.request({
          url: url,
          data: data,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            return typeof cb == "function" && cb(res.data)
          },
          fail: function () {
            return typeof cb == "function" && cb(false)
            wx.showToast({
              title: "服务器无响应",
              icon: "loading",
              duration: 1000,
            })
          },
          complete: function (res) {
            wx.hideNavigationBarLoading()
            console.log(res)
            if (res.errMsg == "request:fail") {
              wx.showToast({
                title: "服务器请求失败",
                icon: "loading",
                duration: 1000,
              })
              return
            }
          }
        })
      }
    }

  })

 
}

function reqGet(url, cb) {
  wx.showNavigationBarLoading()
  var token;
  try {
    token = wx.getStorageSync('token');
  } catch (e) {
    // Do something when catch error
    token = '';
  }

  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      console.log(networkType)
      if (networkType == "none") {
        wx.showToast({
          title: "当前为无网络状态",
          icon: "loading",
          duration: 1000,
        })
      }
      else{
        wx.request({
          url: rootDocment + url,
          header: {
            'Content-Type': 'application/json',
            'token': token
          },
          success: function (res) {
            return typeof cb == "function" && cb(res.data)
          },
          fail: function () {
            return typeof cb == "function" && cb(false)
            wx.showToast({
              title: "服务器无响应",
              icon: "loading",
              duration: 1000,
            })
          },
          complete: function (res) {
            wx.hideNavigationBarLoading()
            console.log(res)
            if (res.errMsg == "request:fail") {
              wx.showToast({
                title: "服务器请求失败",
                icon: "loading",
                duration: 1000,
              })
              return
            }
          }
        })
      }
    }
  })
 
}

module.exports = {
  reqPost: reqPost,
  reqPost2: reqPost2,
  reqGet: reqGet
} 