var app = getApp()
var common = require('../../utils/common.js')

var msg
var quesstionId
var toUserId

Page({
  data:{
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    quesstionId = options.quesstionId;
    toUserId = options.toUserId;
    console.log(toUserId)
  },
  onReady:function(){
    // 页面渲染完成
    
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

  EventHandleMsg: function(e) {
      msg = e.detail.value;
  },

  evaSubmit: function(eee) {
      if (msg) {
        app.func.reqPost('/advice/add_asked', {
            questionId: quesstionId,
            content: msg,
            toUserId: toUserId
        }, function(res) {
            if(res.isSuc) {
                common.showToast("解答成功", "success");
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
            } else{
                common.showToast(res.message, "loading");
            }
        })
      } else{
        common.showToast("请输入解答内容", "loading");
      }
  }
})