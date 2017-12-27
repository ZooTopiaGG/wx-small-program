var app = getApp()
var common = require('../../utils/common.js')

var msg
var id

Page({
  data:{
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    id = options.id;
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
        app.func.reqPost('/advice/reply', {
            para: {
                id: id,
                law_type: '',
                prune_content: '',
                reply_content: msg,
                hold_legal_basis: ''                
            }
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