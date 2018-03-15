//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var userID
  Page({
    data: {
      motto: '',
      userInfo: {},
      userAvatar:'',
      nums: 0,
      cardName: '',
      cardPhoneNum: '',
      cardComName: '',
      cardJob: '',
      user_des: '',
      cardEmail: '',
      cardWeChat: ''
    },
    onLoad: function(){
      // this.setData({
      //   cardName: wx.getStorageSync('stoDataName'),
      //   cardPhoneNum: wx.getStorageSync('stoDataPhoneNum'),
      //   cardComName: wx.getStorageSync('stoDataComName'),
      //   cardJob: wx.getStorageSync('stoDataCardJob'),
      //   cardEmail: wx.getStorageSync(key),
      //   cardWeChat: wx.getStorageSync(key)
      // })
      var user = wx.getStorageSync('user')
      var userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo.avatarUrl);
      var that = this
      app.func.reqPost('/user/getinfobyopenid', {
        OpenId: user.openid
      }, function (res) {
        if (res.state == 0) {
          common.showToast1('跳转修改页面', 'success', 1000)
          console.log(res)
          that.setData({
            cardName: res.result.UserName,
            cardJob: res.result.Positions,
            cardComName: res.result.Company,
            user_des: res.result.Introduction,
            cardPhoneNum: res.result.Tel,
            cardEmail: res.result.Mail,
            cardWeChat: res.result.Wechat,
            userAvatar: userInfo.avatarUrl,
            nums: (res.result.Introduction).length
          })
          userID = res.result.ID
          wx.setStorageSync("userID", res.result.ID)
        }

        else {
          common.showToast1('跳转修改页面失败', 'loading', 1000)
        }
        
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
        user_des: e.detail.value
      })
    },

    modCardInfo: function () {
      var cardName = this.data.cardName;
      var cardPhoneNum = this.data.cardPhoneNum;
      var cardComName = this.data.cardComName;
      var cardJob = this.data.cardJob;
      if (!cardName) {

        common.showToast1('姓名不能为空', 'loading', 1000)
        return

      }
      if (!cardPhoneNum) {

        common.showToast1('电话不能为空', 'loading', 1000)
        return

      }
      if (cardPhoneNum) {
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
      if (!cardComName) {

        common.showToast1('公司名称不能为空', 'loading', 1000)
        return
      }
      if (!cardJob) {
        common.showToast1('公司职位不能为空', 'loading', 1000)
        return
      }
      else {
        // wx.setStorageSync('stoDataName', cardName);
        // wx.setStorageSync('stoDataPhoneNum', cardPhoneNum);
        // wx.setStorageSync('stoDataComName', cardComName);
        // wx.setStorageSync('stoDataCardJob', cardJob);
        // wx.setStorageSync('stoDataCardEmail', cardEmail);
        // wx.setStorageSync('stoDataCardWechat', cardWeChat);
        // wx.setStorageSync('stoDataCardDes', user_des);
        // common.showToast1('修改名片成功！', 'success', 1000);
        // wx.navigateTo({
        //   url: '../my_card/my_card'
        // })
        var that = this
        var user = wx.getStorageSync('user')
        console.log(wx.getStorageSync("userID"))
        app.func.reqPost('/user/update', {
          Userid: userID,
          OpenId: user.openid,
          UserName: that.data.cardName,
          Tel: that.data.cardPhoneNum,
          Company: that.data.cardComName,
          Positions: that.data.cardJob,
          Mail: that.data.cardEmail,
          Wechat: that.data.cardWeChat,
          Introduction: that.data.user_des
        }, function (res) {
          console.log(res);
          if (res.state == 0) {
            common.showToast1('修改成功', 'success', 1000)
            wx.navigateTo({
              url: '../my_card/my_card?userID=' + userID,
            })
          }
          else {
            common.showToast1('修改失败', 'loading', 1000)
          }
        })
      }

    },
    input_name: function (e) {
      this.setData({
        cardName: e.detail.value,
      })
      //  console.log(e.detail.value);

    },
    input_phoneNum: function (e) {
      this.setData({
        cardPhoneNum: e.detail.value,
      })
      // var regu = /^[1][3][0-9]{9}$/;
      // var re = new RegExp(regu);
      // if (re.test(e.detail.value)){
      //   wx.setStorageSync('stoDataPhoneNum', e.detail.value);
      // }
      // else{
      //   common.showToast1('输入电话有误', 'loading', 1000)
      //   return 
      // }

    },
    input_ComName: function (e) {
      this.setData({
        cardComName: e.detail.value,
      })

    },
    input_Job: function (e) {
      this.setData({
        cardJob: e.detail.value,
      })

    }
  })

