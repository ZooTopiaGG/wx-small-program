var id;
var app = getApp();
var images = []

Page({
  data:{
    caseInfo: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    id = options.id;
    images = [];
  },
  onReady:function(){
    // 页面渲染完成
    var that = this;

    app.func.reqPost('/advice/get_info', {
      question_id: id,
      with_details: true, 
      with_lawyers: true
    },function(res){ 
      console.log(res);
      if (res.result.attach_list) {
        for(var i=0; i<res.result.attach_list.length;i++) {
          images.push(res.result.attach_list[i].media_url)
        }
      }
      that.setData ({
        caseInfo:  res.result
      })
    });  
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
  
  previewImage: function () {
    wx.previewImage({
      urls: images
    })
  }
})