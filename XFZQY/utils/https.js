// var rootDocment = 'https://api.lawyer-says.cn';//你的域名  
var rootDocment = 'https://api.lawyer-says.com';

function reqPost(url,data,cb){  
    wx.showNavigationBarLoading()
    var token;
    try {
      token = wx.getStorageSync('token');
    } catch (e) {
      // Do something when catch error
      token = '';
    }
    wx.request({  
      url: rootDocment + url,  
      data: data,  
      method: 'POST',  
      header: {
        'Content-Type': 'application/json',
        'token': token 
      },  
      success: function(res){  
        if (!res.data.isSuc) {
          if (res.data.message =="未登录或者登录信息已过期，请重新登录！") {
            wx.removeStorage({
              key: 'token',
              success: function(res) {
              },
            })
          }
        }
        return typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
        return typeof cb == "function" && cb(false)  
        wx.showToast({
          title: "服务器无响应",
          icon: "loading",
          duration: 1000,
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading()
      }  
    })  
}  

function reqGet(url,cb) {
    wx.showNavigationBarLoading()
    var token;
    try {
      token = wx.getStorageSync('token');
    } catch (e) {
      // Do something when catch error
      token = '';
    }
    wx.request({  
      url: rootDocment + url,
      header: {
        'Content-Type': 'application/json',
        'token': token
      },  
      success: function(res){  
        return typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
        return typeof cb == "function" && cb(false)  
        wx.showToast({
          title: "服务器无响应",
          icon: "loading",
          duration: 1000,
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading()
      }  
    })  
}

module.exports = {  
  reqPost: reqPost,
  reqGet: reqGet
} 