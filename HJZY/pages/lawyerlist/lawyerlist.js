var name
var code
var cityCode
var keyWord
var searchType
var app = getApp()
var common = require('../../utils/common.js');
var lawType = require('../../data/law_type.js');
var that
var pageSize = 5
var pageIndex = 1

var unionId;
var nickName;

Page({
  data:{
    lawyerArray: [],
    isRolling: false
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this
    code = options.code
    name = options.name
    keyWord = options.keyWord
    searchType = options.type

    if (searchType == 0) {
      if (code == 0) {
          code = ""
          wx.setNavigationBarTitle({
          title: '全部的律师'
          })
      } else{
        code = options.code
          wx.setNavigationBarTitle({
          title: '擅长' + name + '的律师'
          })
      }
    } else if (searchType == 1) {
      if (code == 0) {
        code = common.versionCode
        cityCode = ""
        wx.setNavigationBarTitle({
        title: '全部的律师'
        })
      } else{
        code = common.versionCode
        cityCode = options.code
          wx.setNavigationBarTitle({
          title: '在' + name + '执业的律师'
          })
      }
    } else if (searchType == 3) {
        code = common.versionCode
        cityCode = ""
    }
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    that.refresh()
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    that.refresh()
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },

  //下拉刷新
  onPullDownRefresh: function() {
      that.refresh()
  },

  //刷新
  refresh: function() {
    pageIndex = 1;
    app.func.reqPost('/lawyer/searchwchat', {
        para: {
            law_code: code,
            key_words: keyWord,
            city_code: cityCode,
            page_index: pageIndex,
            page_size:pageSize
        }
    }, function(res) {
        wx.stopPullDownRefresh();
        if (res.isSuc) {  
            console.log(res)
            if (res.result.length == 5) {
              that.setData({
                isRolling: false
              })
            } else{
              that.setData({
                isRolling: true
              })
            }
            that.setData({
                lawyerArray: res.result
            })
        } else{
            // common.showToast(res.message + "", "loading");
        }
    })
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
    // common.showToast("加载中", "loading")
    app.func.reqPost('/lawyer/searchwchat', {
        para: {
            law_code: code,
            key_words: keyWord,
            city_code: cityCode,
            page_index: pageIndex,
            page_size:pageSize
        }
    }, function(res) {
        if (res.isSuc) {
          if (res.result) {
            if (res.result.length == 5) {
              that.setData({
                isRolling: false
              })
            } else{
              that.setData({
                isRolling: true
              })
            }

            that.setData({
                lawyerArray: that.data.lawyerArray.concat(res.result)
            })
          } else{
            that.setData({
              isRolling: true
            })
            pageIndex--
          }
        } else{
          pageIndex--
          that.setData({
            isRolling: true
          })            
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