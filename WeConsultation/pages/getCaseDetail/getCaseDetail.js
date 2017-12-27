var app = getApp()
var common = require('../../utils/common.js');
var id; 
var that;
var caseInfo;
var myInfo;
var cate;
var openId;
var unionId;
var nickName;

Page({
  data:{
    money: "",
    userInfo: {},
    details: "",
    answerTitle: "我的解答",
    firstReplyInfo: {},
    secondReplyInfo: {},
    bottomBtnText: "立即解答",
    role: '',
    state: '',
    createTime: '',
    caseCate: '',
    FirstReward: '',
    SecondReward: '',
    FirstAnswer: "",
    EvaluateContent: "",
    basicInfo: "",
    is_public: true,
    isRolling: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;

    id = options.id;
    cate = options.cate;
    if (cate) {
      that.setData({
        caseCate: cate
      })
    }
   

    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      myInfo = lawyerSayUserInfo;
      console.log(myInfo)
      that.setData({
        role: lawyerSayUserInfo.Role
      })
    })

    
    app.func.reqPost('/shareToListen/sharecaseInfo', {
      questionId: id
    }, function(res) {
      if (res.isSuc) {
        that.setData({
          basicInfo: res.result.UserName + " | " + res.result.LawyerTypeName 
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    app.func.reqPost('/advice/get_info',{
        question_id: id, 
        with_details: true,
        with_lawyers: true
    },function(res) {
      that.setData({
        isRolling: true
      })
        if (res.isSuc) {
            caseInfo = res.result;

            var ratio1 = (caseInfo.FirstReward / (caseInfo.FirstReward + caseInfo.SecondReward)).toFixed(1) * 10
            var ratio2 = (1-(ratio1/10))*10

            that.setData({
                FirstReward: ratio1,
                SecondReward: ratio2,
                userInfo: caseInfo.user_info,
                details: caseInfo.description,
                firstReplyInfo: caseInfo.first_reply_info,
                secondReplyInfo: caseInfo.second_reply_info,
                state: caseInfo.state,
                createTime: common.createTime(caseInfo.create_time),
                money:caseInfo.price,
                is_public:caseInfo.is_public
            })
             wx.setNavigationBarTitle({
              title: caseInfo.description
            })
            if (caseInfo.FirstAnswerSuggest) {
              that.setData({
                FirstAnswer: caseInfo.FirstAnswerSuggest
              })
            } else{
              that.setData({
                FirstAnswer: caseInfo.first_reply_info.answer.content
              })
            }

            if (caseInfo.EvaluateContent) {
              that.setData({
                EvaluateContent: caseInfo.EvaluateContent
              })
            } else{
              that.setData({
                EvaluateContent: caseInfo.second_reply_info.answer.content
              })
            }
            
        } else {
            common.showToast(res.message, "loading")
        }
    })
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },
   onShareAppMessage:function () {
      var lawyername =''
      if(that.data.firstReplyInfo){
        lawyername = that.data.firstReplyInfo.lawyer_info.lawyer_name;
      }
      if(that.data.secondReplyInfo){
        lawyername = that.data.secondReplyInfo.lawyer_info.lawyer_name;
      }
      if(that.data.firstReplyInfo && that.data.secondReplyInfo){
        lawyername = that.data.firstReplyInfo.lawyer_info.lawyer_name+"和"+that.data.secondReplyInfo.lawyer_info.lawyer_name+"律师"
      }
      //分享
      return {
        title: that.data.details,
        desc: '已支付咨询费'+that.data.money+'元，看'+lawyername+'的专业解答',
        path: '/pages/getCaseDetail/getCaseDetail?id='+id
      }
  },
  //接单
  answer: function() {
    // if (caseInfo.state == 2) {
    //   app.func.reqPost('/uc/grab', {
    //     id: id,
    //     type: 1
    //   }, function(res) {
    //     if (res.isSuc) {
    //       wx.navigateTo({
    //         url: '../myAnswer/myAnswer'
    //       })
    //     } else{
    //       common.showToast(res.message, "loading");
    //     }
    //   })
    // } else if (caseInfo.state==3 || caseInfo.state==4){
    //     if (that.data.bottomBtnText == "立即解答") {
    //       wx.navigateTo({
    //         url: '../myAnswer/myAnswer?id='+id,
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: '../supplementary/supplementary?id='+id,
    //       })
    //     }
    // }
    
  },

  //追问
  gotoAskagain: function(e) {
    var toUserId = e.currentTarget.id;
    wx.navigateTo({
      url: '../askagain/askagain?quesstionId=' + id + "&toUserId=" + toUserId,
    })
  },

  //确认解答
  sureCase: function() {
      if (that.data.firstReplyInfo.answer && !that.data.secondReplyInfo.answer) {
        wx.showModal({
          title: '提示',
          content: '确认之后无法接续追问，确定吗?',
          success: function(res) {
            if (res.confirm) {
              app.func.reqPost('/advice/share_bonus_v213',{
                para: {
                  question_id: id,
                  share_ratio: 1,
                  first_user_id: that.data.firstReplyInfo.lawyer_info.user_id,
                  first_user_bonus: that.data.money,
                  second_user_id: 0,
                  second_user_bonus: 0,
                }
              }, function(res) {
                if (res.isSuc) {
                  common.showToast("确认解答成功","success")
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                  })
                } else{
                  common.showToast(res.message,"loading")
                }
              })
            }
          }
        })        
      } else if (that.data.firstReplyInfo.answer && that.data.secondReplyInfo.answer) {
        wx.showModal({
          title: '提示',
          content: '确认之后无法接续追问，确定吗?',
          success: function(res) {
            if (res.confirm) {
              app.func.reqPost('/advice/share_bonus_v213',{
                para: {
                  question_id: id,
                  share_ratio: 0.5,
                  first_user_id: that.data.firstReplyInfo.lawyer_info.user_id,
                  first_user_bonus: that.data.money/2,
                  second_user_id: that.data.secondReplyInfo.lawyer_info.user_id,
                  second_user_bonus: that.data.money/2,
                }
              }, function(res) {
                if (res.isSuc) {
                  common.showToast("确认解答成功","success")
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                  })
                } else{
                  common.showToast(res.message,"loading")
                }
              })
            }
          }
        })       
      }
  },


  consultation: function(e) {
    var str = e.currentTarget.id;
    var lawyerId = str.split(";")[0];
    var lawyerName = str.split(";")[1];
    var questionPrice = str.split(";")[2];

    // wx.navigateTo({
    //   url: '../consultation/consultation?user_id='+that.data.lawyerInfo.lawyer_id,
    // })
    wx.getStorage({
    key: 'token',
    success: function(res) {
      wx.navigateTo({
        url: '../consultation/consultation?user_id=' + lawyerId + '&name=' + lawyerName + '&questionPrice=' + questionPrice
      })
    }, fail: function() {
            app.getUserInfo(function(userInfo, code, iv, encryptedData){
              if (userInfo){
                app.func.reqPost('/wxProgram/onLogin', {
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
                            url: '../consultation/consultation?user_id=' + lawyerId + '&name=' + lawyerName + '&questionPrice=' + questionPrice
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
                })
              } else {
                common.showToast('登录授权失败','loading')
              }
            })
    } 
  })
  },

  gotoLawyerInfo: function(e) {
    wx.navigateTo({
      url: '../lawyerInfo/lawyerInfo?id='+ that.data.firstReplyInfo.lawyer_info.user_id,
    })
  },

  gotoSeLawyerInfo: function(e) {
    wx.navigateTo({
      url: '../lawyerInfo/lawyerInfo?id='+ that.data.secondReplyInfo.lawyer_info.user_id,
    })
  },

  gotoCaseList: function(e) {
    wx.navigateTo({
      url: '../caselist/caselist?lawCode=' + caseInfo.type_code+'&lawType='+caseInfo.type_text+'&desc=' + '',
    })
  }
})