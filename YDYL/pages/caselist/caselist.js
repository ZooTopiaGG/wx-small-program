var app = getApp()
var common = require('../../utils/common.js');
var util = require('../../utils/util.js')
var that;
var page=1;
var lawCode;
var typename;
var desc;

var unionId;
var nickName;

Page({
  data:{
    caseArray:"",
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    lawCode = options.lawCode
    typename = options.lawType
    desc = options.desc
    that = this;     
    that.refresh();
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
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
    that.refresh();
  },
  onReachBottom: function() {
    // 上拉加载更多
    that.loadMore()
  },
  onShareAppMessage:function () {
    //分享
    return {
      title: typename+'类的法律咨询解答',
      desc: desc,
      path: '/pages/caselist/caselist?lawCode='+lawCode
    }
  },
  refresh: function() {
    page = 1;
    app.func.reqPost('/advice/get_list/public', {
      page: page,
      law_code: lawCode
    },function(res){ 
      if (res.isSuc) {
        wx.setNavigationBarTitle({
          title: typename + '类的热门咨询'
        })
        that.setData({
          caseArray: res.result
        })
      } else{
        common.showToast(res.message,'loading')
      }
    }); 
  },

  //   //上拉加载更多
  // lower: function(e) {
  //  that.loadMore()
  // },

  loadMore: function() {
    page++;
    common.showToast("加载中", "loading")
    app.func.reqPost('/advice/get_list/public', {
        page: page,
        law_code: lawCode
    }, function(res) {
        if (res.isSuc) {
          if (res.result) {

            that.setData({
                caseArray: that.data.caseArray.concat(res.result)
            })
          } else{
            page--
          }
        } else{
          page--
        }
    })
  },

      //跳转到订单详情
  gotoCaseDetail: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail/getCaseDetail?id=' + id,
    })
  },


  //跳转到咨询界面
  consultation: function() {
    wx.getStorage({
        key: 'token',
        success: function(res) {
          wx.navigateTo({
            url: '../consultation/consultation'
          })
        },
        fail: function() {
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
                        nickName = wxInfo.nickName;
                        unionId = wxInfo.unionId;
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
                                url: '../consultation/consultation'
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
                      } else {
                        common.showToast(res.message,'loading')
                      }
                    } )
                  } else {
                    common.showToast('登录授权失败','loading')
                  }
                })
        } 
      })
  }
})