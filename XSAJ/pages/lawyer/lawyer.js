var app = getApp()
var common = require('../../utils/common.js');
var lawType = require('../../data/law_type.js');
var that
var pageSize = 5
var pageIndex = 1

var locationCity="";
var locationCityCode

var unionId;
var nickName;


Page({
  data:{
    lawyerArray: [],
    lawType: [],
    citydata: [],
    isRolling: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.setData({
      lawType: lawType.lawType.data
    })
    that.setData({
      citydata: lawType.cityData.data
    })

    wx.showNavigationBarLoading()
    wx.getLocation({
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        app.func.reqPost('/user/get_location_wchat', {
          lat: latitude,
          lng: longitude
        }, function(res) {
          var strs= new Array();
          strs=res.result.split(";");
          locationCity = strs[0]
          locationCityCode = strs[1]
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    that.refresh()
  },
  onShow:function(){
    // 页面显示
    // var i = 0    
    // var dotAnData = wx.createAnimation({      
    //   duration: 50,      
    //   transformOrigin: '4rpx 25rpx'    
    // })    
    // dotAnFun = setInterval(function() {       
    //   dotAnData.rotate(20* (++i)).step()       
    //   that.setData({         
    //     dotAnData: dotAnData.export()       
    //   })    
    // }.bind(that), 50)  
  },
  
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },

  // //上拉加载更多
  // lower: function(e) {
  //  that.loadMore()
  // },

  //上拉加载更多
  onReachBottom: function() {
    that.loadMore()
  },
  
  loadMore: function() {
    pageIndex++;
    var versionCode = common.versionCode;
    if (versionCode == '901') {
      versionCode = '901001;901002;901003'
    }
    app.func.reqPost('/lawyer/searchwchat', {
        para: {
            law_code: versionCode,
            key_words: "",
            city_code: "",
            page_index: pageIndex,
            page_size:pageSize
        }
    }, function(res) {
        that.setData({
          isRolling: false
        })
        if (res.isSuc) {
          if (res.result) {
            that.setData({
                lawyerArray: that.data.lawyerArray.concat(res.result)
            })
          } else{
            pageIndex--
            that.setData({
              isRolling: true
            })
          }
        } else{
          pageIndex--
          that.setData({
            isRolling: true
          })
        }
    })
  },

  //下拉刷新
  onPullDownRefresh: function() {
      that.refresh()
  },

  refresh: function() {
    pageIndex = 1;
    var versionCode = common.versionCode;
    if (versionCode == '901') {
      versionCode = '901001;901002;901003'
    }
    app.func.reqPost('/lawyer/searchwchat', {
        para: {
            law_code: versionCode,
            key_words: "",
            city_code: "",
            page_index: pageIndex,
            page_size:pageSize
        }
    }, function(res) {
        wx.stopPullDownRefresh();
        if (res.isSuc) {  
            console.log(res)
            that.setData({
                lawyerArray: res.result
            })
            wx.hideNavigationBarLoading()
        } else{
            // common.showToast(res.message + "", "loading");
        }
    })
  },

  //跳转到律师信息详情
  goToLawyerInfo: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../lawyerInfo/lawyerInfo?id=' + id,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

   //跳转到搜索结果
  gotoSearchResult: function(e) {
    var lawtype = e.currentTarget.id;
    var strs= new Array();
    strs=lawtype.split(";");
    if (strs[1] == -1) {

    } else{
      wx.navigateTo({
        url: '../lawyerlist/lawyerlist?code=' + strs[1] + "&name=" + strs[0] + "&type=" + 0,
      })
    }
  },

   //跳转到搜索结果
  gotoSearchResultByCity: function(e) {
    var lawtype = e.currentTarget.id;
    var strs= new Array();
    strs=lawtype.split(";");
    if (strs[1] == -2) {

    } else if(strs[1] == -1) {
      if (!locationCityCode) {
        common.showToast("定位没有成功", "loading");
      } else {
        wx.navigateTo({
          url: '../lawyerlist/lawyerlist?code=' + locationCityCode + "&name=" + locationCity + "&type=" + 1,
        })
      }
    } else{
      wx.navigateTo({
        url: '../lawyerlist/lawyerlist?code=' + strs[1] + "&name=" + strs[0] + "&type=" + 1,
      })
    }
  },

  searchLawyer: function(e) {
    var keyWord = e.detail.value
    wx.navigateTo({
        url: '../lawyerlist/lawyerlist?keyWord=' + keyWord + "&type=" + 3
    })
  },

  consultation: function(e) {
    var str = e.currentTarget.id;
    var lawyerId = str.split(";")[0];
    var lawyerName = str.split(";")[1];

    // wx.navigateTo({
    //   url: '../consultation/consultation?user_id='+that.data.lawyerInfo.lawyer_id,
    // })
    wx.getStorage({
    key: 'token',
    success: function(res) {
      wx.navigateTo({
        url: '../consultation/consultation?user_id=' + lawyerId + '&name=' + lawyerName
      })
    }, fail: function() {
            app.getUserInfo(function(userInfo, code, iv, encryptedData){
              if (userInfo){
                app.func.reqPost(common.version + 'onLogin', {
                  code: code,
                  IV:iv,
                  encryptedData:encryptedData
                }, function(res) { 
                  if (res.isSuc) {
                    var wxInfo = JSON.parse(res.result)
                    wx.setStorageSync('openId', wxInfo.openId)
                    unionId = wxInfo.unionId;
                    nickName = wxInfo.nickName;
                    app.func.reqPost('/passport/quick_login', {
                      para: {
                        platform: 9,
                        openId: wxInfo.openId,
                        unionID: wxInfo.unionId,
                        token: '123',
                        avatar: wxInfo.avatarUrl,
                        appId: wxInfo.watermark.appid,
                        nickName: wxInfo.nickName
                      }
                    }, function(res){
                        console.log(res)
                        if (res.result) {
                          app.globalData.lawyerSayUserInfo = res.result;
                          //token缓存到本地
                          try {
                              wx.setStorageSync('token', res.result.Token)
                              wx.setStorageSync('lawyerSayUserInfo', res.result)
                          } catch (e) {    
                            console.log(e)
                          }
                          wx.navigateTo({
                            url: '../consultation/consultation?user_id=' + lawyerId + '&name=' + lawyerName
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '提示：咨询前请绑定手机，律师解答后将立刻通知您。',
                            success: function(res) {
                              if (res.confirm) {    
                                wx.getStorage({
                                  key: 'openId',
                                  success: function(res) {
                                    wx.navigateTo({
                                        url: '../register/register?openId=' + res.data + "&unionId=" + unionId + "&nickName=" + nickName,
                                    })
                                  } 
                                })
                              }
                            }
                          })
                        }
                    })
                  } else{
                    // common.showToast(res.message,'loading')
                  }
                })
              } else {
                common.showToast('登录授权失败','loading')
              }
            })
    } 
  })
  },
})

