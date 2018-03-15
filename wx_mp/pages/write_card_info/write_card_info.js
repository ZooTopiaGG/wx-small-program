//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
var share
Page({
  data: {
    motto: '',
    openId:'{}',
    userInfo: {},
    userAvatar:'',
    nums:0,
    cardName:"",
    cardPhoneNum: "",
    cardComName: "",
    cardJob: "",
    cardEmail: "",
    cardWeChat: "",
    consultationContent:""
  },
  
  onLoad:function(options){
    var that = this 
    var user = wx.getStorageSync("user"); 
    // 判断从分享出来的标识
    if (options.meetID){
      meetID = options.meetID
    }
    if (options.share == 123){
      share = 123
    }
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        userAvatar: userInfo.avatarUrl,
        openId:user.openid
      })
      console.log(user.openid)
    })
  },
  saveCardInfo:function(){
    var cardName = this.data.cardName;
    var cardPhoneNum = this.data.cardPhoneNum;
    var cardComName = this.data.cardComName;
    var cardJob = this.data.cardJob;
    var cardEmail = this.data.cardEmail;
    var cardWeChat = this.data.cardWeChat;
    var consultationContent = this.data.consultationContent;
    if (!cardName){

      common.showToast1('姓名不能为空', 'loading', 1000)
      return  
      
     }
    if (!cardPhoneNum){
      
      common.showToast1('电话不能为空', 'loading', 1000)
      return  

     }
    if (cardPhoneNum){
      var regu = /^1[34578]\d{9}$/;
      var re = new RegExp(regu);
      if (re.test(cardPhoneNum)) {
        wx.setStorageSync('stoDataPhoneNum', cardPhoneNum);
      }
      else {
        common.showToast1('输入电话有误', 'loading', 1000)
        return
      }
     }
    if (cardEmail){
      var reguE = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      var re_2 = new RegExp(reguE);
      if (re_2.test(cardEmail)){
        wx.setStorageSync('stoDataCardEmail', cardEmail);
      }
      else{
        common.showToast1('输入邮箱有误', 'loading', 1000)
        return
      }
     }
    if (!cardComName){
      
      common.showToast1('公司名称不能为空', 'loading', 1000)
      return 
     }
    if (!cardJob) {
      common.showToast1('公司职位不能为空', 'loading', 1000)
      return 
    }
    else{
      // wx.setStorageSync('stoDataName', cardName);
      // wx.setStorageSync('stoDataPhoneNum', cardPhoneNum);
      // wx.setStorageSync('stoDataComName', cardComName);
      // wx.setStorageSync('stoDataCardJob', cardJob);
      // wx.setStorageSync('stoDataCardEmail', cardEmail);
      // wx.setStorageSync('stoDataCardWechat', cardWeChat);
      // wx.setStorageSync('stoDataCardDes', consultationContent);
      // common.showToast1('创建名片成功！', 'success', 1000);
      // wx.navigateTo({
      //   url: '../my_card/my_card'
      // })
      var that = this 
      var userInfo = wx.getStorageSync('userInfo');
      console.log()
      app.func.reqPost('/user/login',{
        OpenId: that.data.openId,
        UserName: that.data.cardName,
        Headurl: that.data.userAvatar,
        Tel: that.data.cardPhoneNum,
        Company: that.data.cardComName,
        Positions: that.data.cardJob,
        Mail: that.data.cardEmail,
        Wechat: that.data.cardWeChat,
        Introduction: that.data.consultationContent
      },function(res){
        console.log(res);
        if (res.state == 0){
          wx.setStorageSync('userID', res.result.ID)
          
          if(share == 123){  //这里判断分享并跳转报名
            common.showToast1('创建成功，正为您跳转报名...', 'success', 1000)
            setTimeout(function(){
              wx.navigateTo({
                url: '../invitation/invitation?meetID=' + meetID + '&share=123',
              })
            },1500)
           
          }

          else {            //正常流程
            common.showToast1('创建成功', 'success', 1000)
            wx.navigateTo({
              url: '../my_card/my_card?userID=' + res.result.ID,
            })
          }
          
        }
        else{
          common.showToast1('创建失败', 'loading', 1000)
          console.log(res)
        }
      })
    }

  },
  input_name:function(e){
       this.setData({
         cardName:e.detail.value
       })
      //  console.log(e.detail.value);
      
  },
  input_phoneNum:function(e){
    this.setData({
      cardPhoneNum: e.detail.value
    })
   
  },
  input_ComName: function (e) {
    this.setData({
      cardComName: e.detail.value
    })
  
  },
  input_Job:function(e){
    this.setData({
      cardJob: e.detail.value
    })
   
  },
  input_email:function(e){
    this.setData({
      cardEmail:e.detail.value
    })
  },
  input_wechat:function(e){
    this.setData({
      cardWeChat:e.detail.value
    })
  },
  //事件处理函数
  bindDesContentBlur: function (e) {
    if (e.detail.value.length > 0) {
      var nowNums = e.detail.value.length;
      this.setData({
        isHidden: true,
        nums: nowNums
      })
    } else {
      this.setData({
        isHidden: false,
        nums: 0
      })
    }
    this.setData({
      consultationContent: e.detail.value
    })
  },
})
