var app = getApp()
var common = require('../../utils/common.js')
var that;
var id;

var lawTypeCode; //法律对应code
var pruneContent; //概述
var replyContent; //意见
var holdLegalBasis; //建议

Page({
  data:{
    focus: false,
    isShowLawyerType: false,
    lawCateArray: ['民商事法律','刑辩法律','行政法律'],
    lawCodeAndName: [],
    lawType: "法律分类",
    Cate1: [{
        name: "婚姻继承",
        code: "900001"
      },{
        name: "借贷纠纷",
        code: "900002"
      },{
        name: "人身损害",
        code: "900003"
      },{
        name: "交通事故",
        code: "900004"
      },{
        name: "房屋买卖",
        code: "900005"
      },{
        name: "消费维权",
        code: "900006"
      },{
        name: "劳动用工",
        code: "900007"
      },{
        name: "保险理赔",
        code: "900008"
      },{
        name: "合同争议",
        code: "900009"
      },{
        name: "知识产权",
        code: "900010"
      },{
        name: "公司经营",
        code: "900011"
      },],
    Cate2: [{
        name: "职务犯罪",
        code: "901001"
      },{
        name: "暴力犯罪",
        code: "901002"
      },{
        name: "经济犯罪",
        code: "901003"
      }] ,
    Cate3: [{
        name: "行政诉讼",
        code: "902001"
      },{
        name: "行政复议",
        code: "902002"
      },{
        name: "政府顾问",
        code: "902003"
      }] ,

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
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

  //显示法律类型菜单
  showLawyerType:function() {
    if (that.data.isShowLawyerType) {
        that.setData({
          isShowLawyerType: false
        })
    } else{
        that.setData({
          isShowLawyerType: true,
          lawCodeAndName: []
        })      
    }
  },

  //设置右侧列表
  setLawArray: function(e) {
    var id = e.currentTarget.id;
    var cate1 =  that.data.Cate1;
    var cate2 =  that.data.Cate2;
    var cate3 =  that.data.Cate3;
    if (id == 0) {
      that.setData({
        lawCodeAndName: cate1
      })
    } else if (id == 1) {
      that.setData({
        lawCodeAndName: cate2
      })
    } else if (id == 2) {
      that.setData({
        lawCodeAndName: cate3
      })
    }
  },

  //选择法律类型类型
  chooseLawCode: function(e) {
    lawTypeCode = e.currentTarget.id;
    var name =e.target.dataset.name;
    that.setData({
      isShowLawyerType: false
    });
    that.setData({
      lawType: name
    });
  },

  EventHandleZixun: function(e) {
    pruneContent = e.detail.value;
  },

  EventHandleYijian: function(e) {
    replyContent = e.detail.value;
  },

  EventHandleYiju: function(e) {
    holdLegalBasis = e.detail.value;
  },

  submit: function() {
    app.func.reqPost('/advice/reply', {
      para: {
        id: id,
        law_type: lawTypeCode,
        prune_content: pruneContent,
        reply_content: replyContent,
        hold_legal_basis: holdLegalBasis
      }
    }, function(res) {
      if (res.isSuc) {
        common.showToast(res.message, "success");
        wx.navigateBack({
          delta: 3, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      } else{
        common.showToast(res.message, "loading");
      }
    })
  },
})