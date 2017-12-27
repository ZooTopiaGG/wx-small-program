var app = getApp();
var common = require('../../utils/common.js')
Page({
  data:{
    fadebackCon:""
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
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
    app.func.reqPost('/feedback/addfeedback',{
      telephone:"",
      content:con
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
  }
})