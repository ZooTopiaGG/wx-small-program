var app = getApp()
var common = require('../../utils/common.js');
var util = require('../../utils/util.js')
var that;
var page=1;
var unionId;
var nickName;

var cityCode;

var openId;
var unionId;
var nickName;
var createOrder = ''

Page({
  data:{
    currentTab: 1,
    caseArray:"",
    lawTypeArray: [],
    isRolling: false,
    isloading: false,
    desc: '',
    prompt: '输入您要咨询的与' + common.versionName + '相关的法律问题，提交支付成功后，系统立即为您匹配最多两位专业律师接单解答',
    nums: 0,

    select1:false,
    select2:false,
    select3:false,
    price:"",
    placeholder: '我自己填',
    inputStyle: 'pay-input',
    inputMoney: '',
    consultationContent: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.refresh();
    that.getLocation();
  },
  onReady:function(){
    // 页面渲染完成
    that.getDesc()
  },

  getLocation: function() {
    //获取位置
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        app.func.reqPost('/user/get_location_wchat', {
          lat: latitude,
          lng: longitude
        }, function (res) {
          var strs = new Array();
          strs = res.result.split(";");
          //city = strs[0]
          cityCode = strs[1]
        })
      }
    })
  },

  getDesc: function() {
    // wx.getStorage({
    //   key: 'desc',
    //   success: function(res){
    //     if (res.data) {
    //       that.setData({
    //         desc: res.data
    //       })
    //     }
    //   },
    //   fail: function(res) {
    app.func.reqGet('/shared/lawyer_typeList_wchat',
      function(res){ 
        if (res.isSuc) {
          var length = res.result.length
          for (var i=0; i<length;i++) {
            if (res.result[i].code == common.versionCode) {
              wx.setStorage({
                key: 'desc',
                data: res.result[i].description
              })
              that.setData({
                desc: res.result[i].description
              })
            }
          }
        } else{
          wx.getStorage({
            key: 'desc',
            success: function(res) {
              that.setData({
                desc: res.data
              })
            },
          })
        }
      });
      // },

    // })
  },

  onShareAppMessage:function () {
    //分享
    return {
      title: 'We法律咨询',
      desc: '小程序版[律师说]，随时随地咨询享受专业的法律咨询服务',
      path: '/pages/home/home'
    }
  },
  switchTab1: function() {
    that.setData({
      currentTab: 1
    })
  },

  switchTab2: function() {
    that.setData({
      currentTab: 2
    })
  },

  refresh: function() {
    page = 1;
    app.func.reqPost('/advice/get_good_union/public', {
      type: common.versionCode,
      page: page,
    },function(res){ 
      wx.stopPullDownRefresh()
      that.setData({
        isRolling: true
      })
      if (res.isSuc) {
        that.setData({
          caseArray: res.result
        })
      } else{
        common.showToast(res.message,'loading')
      }
    }); 
  },

    //跳转到订单详情
  gotoCaseDetail: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail/getCaseDetail?id=' + id,
    })
  },

    //跳转到订单列表
  gotoCaseList: function(e) {
    var idstr = e.currentTarget.id;
    var id = idstr.split(";")[0]
    var typename = idstr.split(";")[1]
    var desc = idstr.split(";")[2]
    wx.navigateTo({
      url: '../caselist/caselist?lawCode=' + id+'&lawType='+typename+'&desc='+desc,
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
          that.setData({
            isloading: true
          })
                app.getUserInfo(function(userInfo, code, iv, encryptedData){
                  if (userInfo){
                    app.func.reqPost(common.version + 'onLogin', {
                      code: code,
                      IV:iv,
                      encryptedData:encryptedData
                    }, function(res) { 
                      that.setData({
                        isloading: false
                      })
                      if (res.isSuc) {
                        console.log(res)
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
  },


  onPullDownRefresh: function() {
    that.refresh()
  },


  bindconsultationContentBlur: function(e) {
    var nowNums = e.detail.value.length;
    that.setData({
      nums: nowNums,
      consultationContent: e.detail.value
    })
  },

  opts1:function(e){
    this.setData({
      select1:!this.data.select,
      select2:false,
      select3:false,
      price:15,
      inputStyle: 'pay-input',
      inputMoney: '',
      placeholder: '我自己填',
    })
  },
  
  opts2:function(e){
    this.setData({
      select2:!this.data.select,
      select1:false,
      select3:false,
      price:20,
      inputStyle: 'pay-input',
      inputMoney: '',
      placeholder: '我自己填',
    })
  },

  opts3:function(e){
    this.setData({
      select3:!this.data.select,
      select2:false,
      select1:false,
      price:30,
      inputStyle: 'pay-input',
      inputMoney: '',
      placeholder: '我自己填',
    })
  },

  inputMoney: function(e) {
    var length = e.detail.value.length;
    if (length > 0) {
      this.setData({
        select2:false,
        select1:false,
        select3:false,
        price: e.detail.value
      })
    }
  },

  payInputF: function(e) {
    that.setData({
      placeholder: '10~999',
      inputStyle: 'pay-input-f'
    })
    
  },

  payInputB: function(e) {
    if (!e.detail.value) {
      that.setData({
        placeholder: '我自己填',
        inputStyle: 'pay-input'
      })
    }
  },

  evaSubmit:function() {
    // 发布悬赏咨询;
    that.setData({
        focus: false
    })

    var consultationContent = that.data.consultationContent;
    console.log(consultationContent);
    if (!consultationContent) { 
      common.showToast1('咨询内容不能为空','loading',600)
      return
    } 

    if (consultationContent.length < 10) {
      common.showToast1('咨询问题至少10个字以上','loading',600)
      return
    } 

    
    if (!that.data.price) {
      common.showToast1('请输入订单金额','loading',600)
      return
    } 

    if (that.data.price < 10 || that.data.price>999) {
      common.showToast1('订单金额应在10-999之间','loading',600)
      return
    }

    
    that.setData({
      isloading: true
    })

    var typeCode = common.versionCode;
    if (typeCode == '901') {
      //从901001，901002，901003中随机取一个
      var random = Math.round(Math.random()*2)
      if (random == 0) {
        typeCode = '901001'
      } else if (random == 1) {
        typeCode = '901002'
      } else if (random == 2) {
        typeCode = '901003'
      }
    }

    createOrder = {
      para: {
        questionId: 0,
        typeCode: typeCode,
        lawyer_id: 0,
        content: consultationContent,
        cityCode: '',
        bussinessCode: 0,
        media_list: null 
      }
    }

    //先判断是否绑定手机
    that.isBindPhone()

  },


  isBindPhone: function() {
    app.getUserInfo(function (userInfo, code, iv, encryptedData) {
      //更新数据
      if (userInfo) {
        that.setData({
          userInfo: userInfo
        })
        //判断是否已经绑定
        app.func.reqPost(common.version + 'onLogin', {
          code: code,
          IV: iv,
          encryptedData: encryptedData
        }, function (res) {
          if (res.isSuc) {
            console.log(res)
            var wxInfo = JSON.parse(res.result)
            wx.setStorageSync('openId', wxInfo.openId)
            wx.setStorageSync('unionId', wxInfo.unionId)
            openId = wxInfo.openId;
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
            }, function (res) {
              console.log(res)
              if (res.result) {
                that.setData({
                  isHiddenBind: true,
                  userPhoneNum: res.result.PhoneNum
                })

                app.globalData.lawyerSayUserInfo = res.result;
                //token缓存到本地
                try {
                  wx.setStorageSync('token', res.result.Token)
                  wx.setStorageSync('lawyerSayUserInfo', res.result)
                } catch (e) {
                  console.log(e)
                }

                that.createOrder();
              } else {
                wx.showModal({
                  title: '提示',
                  content: '提示：咨询前请绑定手机，律师解答后将立刻通知您。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.getStorage({
                        key: 'openId',
                        success: function (res) {
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
            common.showToast(res.message, 'loading')
          }
        })
      } else {
        common.showToast('登录授权失败', 'loading')
        that.setData({
          isHiddenBind: true,
        })
      }
    })
  },

  //创建订单
  createOrder: function() {
    app.func.reqPost('/advice/create_question', createOrder, function (res) {
      that.setData({
        isloading: false
      })
      if (res.isSuc) {
        console.log(res);
        var order = res.result;
        wx.showModal({
          title: '提示',
          content: '订单创建成功，是否支付订单',
          success: function (res) {
            if (res.confirm) {
              //支付接口
              console.log(that.data.price + "")
              var price = that.data.price || 0;
              app.func.reqPost('/advice/set_price', {
                questionId: order.question_id,
                price: price,
                isPublicPrice: false
              }, function (res) {
                common.showToast1('加载中', 'loading', 10000)
                if (res.isSuc) {
                  //common.showToast('支付成功','loading')
                  var openid = wx.getStorageSync('openId');
                  console.log(openid);
                  app.func.reqPost(common.version + 'UnifiedOrder', {
                    openid: openid,
                    total_fee: that.data.price * 100,
                    questionId: order.question_id
                  }, function (res) {
                    if (res.isSuc) {
                      wx.hideToast()
                      var para = JSON.parse(res.result);
                      //悬赏支付
                      wx.requestPayment({
                        'timeStamp': para.timeStamp,
                        'nonceStr': para.nonceStr,
                        'package': para.package,
                        'signType': 'MD5',
                        'paySign': para.paySign,
                        'success': function (res) {
                          // wx.redirectTo({                                                                    
                          //   url: '../myCase/myCase'
                          // })
                          wx.navigateTo({
                            url: '../caseCompelete/caseCompelete',
                          })
                        },
                        'fail': function (res) {
                          console.log('fail' + res)
                        }
                      })
                    } else {
                      common.showToast(res.message, 'loading')
                    }
                  })
                } else {
                  common.showToast(res.message, 'loading')
                }
              })
            }
          }
        })
      } else {
        console.log(res.message)
        common.showToast(res.message, 'loading')
      }
    });
  }
})

