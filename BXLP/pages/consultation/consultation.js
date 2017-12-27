var app = getApp()
var common = require('../../utils/common.js')
var userId
var name
var content
var cityCode
var price
var BussinessCode

var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]

var count;

Page({
   
  data:{
    cityName: "",
    consultationContent: "",
    focus: false,
    lawyerSayUserInfo: "",
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isHidden: false,
    nums:0,
    imageNum:0,
    select1:false,
    select2:false,
    select3:false,
    price:"",
    imageList: [],
    imageNum: 0,
    isloading: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    userId = options.user_id;
    name = options.name;
    content = options.content;
    price = options.price;

    if (price) {
      this.setData({
        price: price
      })
    }

    if (content) {
      this.setData({
        consultationContent: content
      })
    }

    if (name) {
      wx.setNavigationBarTitle({
          title: '向' + name + '律师咨询'
      })
    }

    count = 3;
    if(!userId) {
      BussinessCode = 0
      userId = 0
    } else{
      BussinessCode = 2
    }
    var that = this;
    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      that.setData({
        lawyerSayUserInfo:lawyerSayUserInfo
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    //获取位置
    wx.getLocation({
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        app.func.reqPost('/user/get_location_wchat', {
          lat: latitude,
          lng: longitude
        }, function(res) {
          var strs= new Array();
          strs=res.result.split(";");
          //city = strs[0]
          cityCode = strs[1]
          console.log(cityCode)
        })
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  evaSubmit:function() {
    // 发布悬赏咨询
    var that = this;
    that.setData({
        focus: false
    })
    var consultationContent = this.data.consultationContent;
    console.log(consultationContent);
    if (!consultationContent) { 
      common.showToast1('咨询内容不能为空','loading',600)
      return
    } 

    if (consultationContent.length < 10) {
      common.showToast1('咨询问题至少10个字以上','loading',600)
      return
    } 

    
    if (!that.data.price) {
      common.showToast1('请输入订单金额','loading',600)
      return
    } 

    if (that.data.price < 10 || that.data.price>999) {
      common.showToast1('订单金额应在10-999之间','loading',600)
      return
    }

    var createOrder = ''
    that.setData({
      isloading: true
    })
    if (that.data.imageNum > 0) {
      var media_list = []
      for (var i=0; i<that.data.imageList.length; i++) {
        media_list.push({
          url: that.data.imageList[i].mediaUrl,
          thumb_url: that.data.imageList[i].thumbUrl,
          description: '',
          media_type: 1
        })
      }
      createOrder = {
        para: {
          questionId: 0,
          typeCode: common.versionCode,
          lawyer_id: userId,
          content: consultationContent,
          cityCode: '',
          bussinessCode: BussinessCode,
          media_list: media_list 
        }
      }
    } else{
      createOrder = {
        para: {
          questionId: 0,
          typeCode: common.versionCode,
          lawyer_id: userId,
          content: consultationContent,
          cityCode: '',
          bussinessCode: BussinessCode,
          media_list: null 
        }
      }
    }

     //创建订单
    app.func.reqPost('/advice/create_question', createOrder,function(res){ 
      that.setData({
        isloading: false
      })
      if (res.isSuc) {
        console.log(res);
        var order = res.result;
        wx.showModal({
          title: '提示',
          content: '订单创建成功，是否支付订单',
          success: function(res) {
            if (res.confirm) {
              //支付接口
              console.log(that.data.price+"")
              var price = that.data.price || 0;
              app.func.reqPost('/advice/set_price', {
                questionId: order.question_id,
                price: price,
                isPublicPrice: false
              }, function(res){
                common.showToast1('加载中','loading',10000)
                if (res.isSuc) {
                     //common.showToast('支付成功','loading')
                  var openid = wx.getStorageSync('openId');
                  console.log(openid);
                  app.func.reqPost(common.version + 'UnifiedOrder',{
                      openid:openid, 
                      total_fee:that.data.price*100,
                      questionId: order.question_id
                  },function(res){
                    if(res.isSuc){
                      wx.hideToast()
                      var para = JSON.parse(res.result);
                      //悬赏支付
                      wx.requestPayment({
                        'timeStamp': para.timeStamp,
                        'nonceStr': para.nonceStr,
                        'package': para.package,
                        'signType': 'MD5',
                        'paySign': para.paySign,
                        'success':function(res){
                          // wx.redirectTo({                                                                    
                          //   url: '../myCase/myCase'
                          // })
                          wx.redirectTo({
                            url: '../caseCompelete/caseCompelete',
                          })
                        },
                        'fail':function(res){
                          console.log('fail'+res)
                        }
                      })
                    }else{
                      common.showToast(res.message,'loading')
                    }
                  })
                } else{
                  common.showToast(res.message,'loading')
                }
              })
            }
          }
        })
      } else{
        common.showToast(res.message,'loading')
      }
    });  
  },

  bindconsultationContentBlur: function(e) {
    if(e.detail.value.length>0){
       var nowNums = e.detail.value.length;
        this.setData({
          isHidden:true,
          nums:nowNums
        })
    }else{
      this.setData({
          isHidden:false,
          nums:0
        })
    }
    this.setData({
      consultationContent: e.detail.value
    })
  },



  chooseImage: function () {
    var that = this
    if (count == 0) {
      common.showToast('最多只能选择3张图片')
      return
    }
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      count: count,
      success: function (res) {
        count = count - res.tempFilePaths.length;

        // that.setData({
        //   imageList: that.data.imageList.concat(res.tempFilePaths),
        //   imageNum: that.data.imageNum + res.tempFilePaths.length
        // })

        var imgurl = [];
        
        if (res.tempFilePaths) {
          common.showToast1('正在上传图片', 'loading', 5000);
          var choosePicLength = res.tempFilePaths.length;
          for (var i=0; i<res.tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://file.lawyer-says.com/services/app_upload_image.ashx', 
              filePath: res.tempFilePaths[i],
              name: 'imgFile',
              success: function(res){
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

  
  dropImage: function(e) {
    var idx = e.currentTarget.id;
    count += 1;
    this.data.imageList.splice(idx, 1)
    this.setData({
      imageList: this.data.imageList,
      imageNum: this.data.imageNum - 1
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  eveHandle:function(e){
    console.log(e);
    this.setData({
      price:e.detail.value
    })
  },

  opts1:function(e){
    this.setData({
      select1:!this.data.select,
      select2:false,
      select3:false,
      price:15
    })
  },
  
  opts2:function(e){
    this.setData({
      select2:!this.data.select,
      select1:false,
      select3:false,
      price:20
    })
  },

  opts3:function(e){
    this.setData({
      select3:!this.data.select,
      select2:false,
      select1:false,
      price:30
    })
  }
})