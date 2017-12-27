var app = getApp();
var common = require('../../utils/common.js')
var that
var count
var phoneNum

Page({
  data:{
    fadebackCon:"",
    imageList: [],
    imageNum: 0,
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    opt1: true,
    opt2: false,
    opt3: false,
    opt4: false
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this

    count = 1

    wx.getStorage({
      key: 'lawyerSayUserInfo',
      success: function (res) {
        phoneNum = res.data.PhoneNum
      },
    })
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
  textareaBlur:function(e){
    this.setData({
      fadebackCon:e.detail.value
    })
  },
  subFadeBack:function(e){
    var con = this.data.fadebackCon
    var iconUrl = ""
    if (that.data.imageList.length > 0) {
      iconUrl = that.data.imageList[0].mediaUrl
    }
    var ftype
    if (that.data.opt1) {
      ftype = 1
    } else if (that.data.opt2) {
      ftype = 2
    } else if (that.data.opt3) {
      ftype = 3
    } else if (that.data.opt4) {
      ftype = 4
    }

    app.func.reqPost('/feedback/addfeedbackone',{
      telephone: phoneNum,
      content:con,
      iconUrl: iconUrl,
      type: ftype,
      feedSource: 6
    },function(res){
      if(res.isSuc){
        wx.showModal({
          title: '提交成功',
          content: '感谢您的宝贵意见，我们会及时处理。',
          success: function(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
          }
        })
      }else{
        common.showToast1(res.message,'loading',600)
      }
    })
  },


  chooseImage: function () {
    that = this
    if (count == 0) {
      common.showToast('最多只能选择1张图片')
      return
    }
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      count: count,
      success: function (res) {
        count = count - res.tempFilePaths.length;

        var imgurl = [];

        if (res.tempFilePaths) {
          common.showToast1('正在上传图片', 'loading', 5000);
          var choosePicLength = res.tempFilePaths.length;
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://file.lawyer-says.com/services/app_upload_image.ashx',
              filePath: res.tempFilePaths[i],
              name: 'imgFile',
              success: function (res) {
                imgurl.push(JSON.parse(res.data))
                if (imgurl.length == choosePicLength) {
                  that.setData({
                    imageList: that.data.imageList.concat(imgurl),
                    imageNum: that.data.imageNum + imgurl.length
                  })
                  console.log(imgurl)
                  wx.hideToast()
                }
              }
            })
          }
        }
      }
    })
  },


  dropImage: function (e) {
    var idx = e.currentTarget.id;
    count += 1;
    this.data.imageList.splice(idx, 1)
    this.setData({
      imageList: this.data.imageList,
      imageNum: this.data.imageNum - 1
    })
  },

  // previewImage: function (e) {
  //   var current = e.target.dataset.src
  //   console.log(this.data.imageList)

  //   wx.previewImage({
  //     current: current,
  //     urls: this.data.imageList
  //   })
  // },

  selectOpt1: function(e) {
    if (!that.data.opt1) {
      that.setData({ 
        opt1: true,
        opt2: false,
        opt3: false,
        opt4: false
      })
    }
  },

  selectOpt2: function (e) {
    if (!that.data.opt2) {
      that.setData({
        opt1: false,
        opt2: true,
        opt3: false,
        opt4: false
      })
    }
  },

  selectOpt3: function (e) {
    if (!that.data.opt3) {
      that.setData({
        opt1: false,
        opt2: false,
        opt3: true,
        opt4: false
      })
    }
  },

  selectOpt4: function (e) {
    if (!that.data.opt4) {
      that.setData({
        opt1: false,
        opt2: false,
        opt3: false,
        opt4: true
      })
    }
  },
})