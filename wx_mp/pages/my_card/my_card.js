// my_card.js
//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var imageUrlHead = 'https://jiuyihengtai.cn/Images/'
var shareUserID
var shareUserName
  Page({

    /**
     * 页面的初始数据
     */
    data: {
        codeUrl: '',
        showView:false,
        showCode:false,
        scoreBtn:false,
        userAvatar:'',
        user_name:"",
        user_job:"",
        user_comp:"",
        user_des:"暂未填写个人简介",
        user_phone:"暂未填写电话",
        user_email:"暂未填写邮件",
        user_wechat:"暂未填写微信",
        hideMod:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        showView: (options.showView == "true" ? true : false)
        showCode: (options.showCode == "true" ? true : false)
        scoreBtn: (options.scoreBtn == "true" ? true : false)
        var that = this 
        console.log(options)
        // this.setData({
        //   user_name: wx.getStorageSync('stoDataName'),
        //   user_job: wx.getStorageSync('stoDataCardJob'),
        //   user_comp: wx.getStorageSync('stoDataComName'),
        //   user_des: wx.getStorageSync('stoDataCardDes'),
        //   user_phone: wx.getStorageSync('stoDataPhoneNum'),
        //   user_email: wx.getStorageSync('stoDataCardEmail'),
        //   user_wechat: wx.getStorageSync('stoDataCardWechat')
        // })
        if (options.hideMod == 123){
          that.setData({
            hideMod:1
          })
        }
        var user = wx.getStorageSync('user')
        var userInfo = wx.getStorageSync('userInfo');
        console.log(user.openid);
        var UserID = options.userID
        app.func.reqPost('/user/getinfobyuserid',{
          UserID: UserID
        },function(res){
          if(res.state == 0){
            shareUserID = res.result.ID
            shareUserName = res.result.UserName
            common.showToast1('获取名片成功！', 'success', 600)
            console.log(res)
            var user_info = wx.getStorageSync("userInfo");
            that.setData({
              user_name: res.result.UserName,
              user_job: res.result.Positions,
              user_comp: res.result.Company,
              user_des: res.result.Introduction,
              user_phone: res.result.Tel,
              user_email: res.result.Mail,
              user_wechat: res.result.Wechat,
              userAvatar: user_info.avatarUrl,
            })  
          }
          
          else{
            common.showToast1('获取名片失败', 'loading', 600)
          }
          
        })
    },
    onShareAppMessage: function () {
      var that = this
      console.log('进入分享')
      return {
        title: shareUserName+'的电子名片，请惠存！',
        path: '/pages/my_card/my_card?hideMod=123&userID=' + shareUserID,
        success: function (res) {
          // 转发成功
          console.log('转发成功！')
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },

    onChangeShowState1:function(){
        var that = this;
        that.setData({
          showView:(!that.data.showView),
          scoreBtn: (!that.data.scoreBtn)
        })
    },
    onCloseCode:function(){
        var that = this; 
        that.setData({
          showCode: (!that.data.showCode)
        })
    },
    onChangeShowState2:function(){
      var that = this;
      that.setData({
        showView: (!that.data.showView),
        scoreBtn: (!that.data.scoreBtn)
      })
    },

    onChangeCodeShow:function(){
      var that = this;
      var showView = that.data.showView
      that.setData({
        showCode: true,
        showView: (!showView),
        scoreBtn: (!that.data.scoreBtn)
      })
      app.func.reqPost('/weixin/getcodeurl', {
        MeetingID: 0,
        UserID: shareUserID,
        Path: "pages/my_card/my_card?hideMod=123&userID=" + shareUserID,
        Width: 130
      }, function (res) {
        console.log(res)
        that.setData({
          codeUrl: imageUrlHead + res.result
        })
        console.log(that.data.codeUrl)
      })

    },

    addPhoneContact:function(){
      var that = this 
      wx.addPhoneContact({
        firstName: that.data.user_name + '-会议go名片',
        // nickName: that.data.user_name+'-会议go名片',
        mobilePhoneNumber: that.data.user_phone,
        weChatNumber: that.data.user_wechat,
        organization: that.data.user_comp,
        title: that.data.user_job,
        remark: that.data.user_des,
        success:function(res){
          console.log(res)
        },
        fail:function(res){
          console.log(res)
        }
      })
      // common.showToast1('功能开发中，敬请期待...', 'loading', 800)
    },
    callPhone:function(){
      var that = this 
      var user_phone = that.data.user_phone
      wx.makePhoneCall({
        phoneNumber: user_phone
      })
    },
    

    modInfo:function(){
       var that = this;
       wx.navigateTo({
         url: '../mod_card_info/mod_card_info'
       }) 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    
    // },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    
    }
  })