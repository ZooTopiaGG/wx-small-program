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

var questionPrice;

var that

var userPhonePrice

var LowestQuestionPrice

Page({
   
  data:{
    cityName: "请选择当前城市",
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
    isloading: false,
    questionPrice: 0,
    name: '',
    showInputSelf: false,
    showPromptBox: false,
    isCall: false,
    userPhonePrice: 0,
    QuestionPrizeOne: 0,
    QuestionPrizeTwo: 0,
    QuestionPrizeThree: 0,
    QuestionPriceRange: "10~999"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    that = this

    userId = options.user_id;
    name = options.name;
    content = options.content;
    price = options.price;
    questionPrice = options.questionPrice;
    userPhonePrice = options.isCall


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

    if (questionPrice != 0 && questionPrice) {
      this.setData({
        questionPrice: questionPrice,
        price: questionPrice
      })
    }

    if (name) {
      wx.setNavigationBarTitle({
          title: '向' + name + '律师咨询'
      })
      this.setData({
        name: name
      })
    }

    count = 3;

    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      that.setData({
        lawyerSayUserInfo:lawyerSayUserInfo
      })
    })

    //获取电话价格
    app.func.reqPost('/phone/userphoneprize', {}, 
    function(res) {
      if (res.isSuc) {
        that.setData({
          userPhonePrice: res.result
        })
      }

      // if (userPhonePrice == "true") {
      //   that.setData({
      //     isCall: true,
      //     price: parseFloat(price) + parseFloat(res.result),
      //   })
      // } else if (userPhonePrice == "false"){
      //   that.setData({
      //     isCall: false,
      //   })
      // }
    })

    //获取价格列表
    app.func.reqPost('/systemconfig/querysystemconfig', {},
    function (res) {
      if (res.isSuc) {

        LowestQuestionPrice = res.result.LowestQuestionPrice

        that.setData({
          QuestionPrizeOne: res.result.QuestionPrizeOne,
          QuestionPrizeTwo: res.result.QuestionPrizeTwo,
          QuestionPrizeThree: res.result.QuestionPrizeThree,
          QuestionPriceRange: res.result.LowestQuestionPrice + "~999" 
        })

        if (!userPhonePrice){
          that.setData({
            isCall: res.result.PhoneFeeSwitch == 1? true : false
          })

          if (questionPrice != 0 && questionPrice && that.data.isCall) {
            
            that.setData({
              price: Number(parseFloat(questionPrice) + parseFloat(that.data.userPhonePrice)).toFixed(0)
            })
          }
        }
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    //获取位置
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        app.func.reqPost('/user/get_location_wchat', {
          lat: latitude,
          lng: longitude
        }, function (res) {
          var strs = new Array();
          strs = res.result.split(";");
          //city = strs[0]
          that.setData({ cityName: strs[0] })
          cityCode = strs[1]
        })
      }
    })
  },
  onShow:function(){
    // 页面显示
    wx.getStorage({
      key: 'location',
      success: function(res) {
        if (res.errMsg == "getStorage:ok") {
          var str = res.data
          that.setData({ cityName: str.split(":")[0] })
          cityCode = str.split(":")[1]
        }
      },
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
    that.setData({
        focus: false
    })
    var consultationContent = this.data.consultationContent;
    if (!consultationContent) { 
      common.showToast1('咨询内容不能为空','loading',600)
      return
    } 

    if (consultationContent.length < 10) {
      common.showToast1('咨询问题至少10个字以上','loading',600)
      return
    } 

    if (!cityCode) {
      common.showToast1('请选择所在城市，系统将优先为您匹配附近律师接单。', 'loading', 600)
      return
    }

    if (that.data.questionPrice == 0) {
      if (!that.data.price) {
        common.showToast1('请选择你要支付的咨询价格','loading',600)
        return
      } 

      if (that.data.price < LowestQuestionPrice || that.data.price > 999) {
        common.showToast1('订单金额应在' + LowestQuestionPrice +'-999之间','loading',600)
        return
      }
    }

    var createOrder = ''
    that.setData({
      isloading: true
    })

    if (!userId) {
      BussinessCode = 0
      userId = 0
    } else {
      BussinessCode = 2
    }

    if (that.data.isCall && userId == 0) {
      BussinessCode = 12
    } else if (that.data.isCall && userId != 0) {
      BussinessCode = 11
    }

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
          typeCode: 5,
          lawyer_id: userId,
          content: consultationContent,
          cityCode: cityCode,
          bussinessCode: BussinessCode,
          media_list: media_list 
        }
      }
    } else{
      createOrder = {
        para: {
          questionId: 0,
          typeCode: 5,
          lawyer_id: userId,
          content: consultationContent,
          cityCode: cityCode,
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
        var order = res.result;
        
        //设定价格
        
        var price
        if (that.data.questionPrice == 0) {
          price = that.data.price;
        } else{
          price = that.data.isCall ? (parseFloat(that.data.questionPrice) + parseFloat(that.data.userPhonePrice)) : that.data.questionPrice
        }

        app.func.reqPost('/advice/set_price', {
          questionId: order.question_id,
          price: price,
          isPublicPrice: false
        }, function(res){
          if (res.isSuc) {
                //common.showToast('支付成功','loading')
            wx.showModal({
              title: '提示',
              content: '订单创建成功，是否支付订单',
              success: function(res) {
                if (res.confirm) {
                  var openid = wx.getStorageSync('openId');
                  app.func.reqPost('/wxProgram/UnifiedOrder',{
                      openid:openid, 
                      total_fee: Number(price * 100).toFixed(0),
                      questionId: order.question_id
                  },function(res){
                    if(res.isSuc){
                      common.showToast1('加载中', 'loading', 10000)
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
                }
              }
            })
          } else{
            common.showToast(res.message,'loading')
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
    that = this
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

    var isCall = this.data.isCall
    var price = parseFloat(e.detail.value)
    
    if (isCall) {
      this.setData({ price: price + that.data.userPhonePrice})
    } else{
      this.setData({price: price})
    }
  },

  opts1:function(e){
    this.setData({
      select1:!this.data.select,
      select2:false,
      select3:false,
    })

    var isCall = this.data.isCall
    if (isCall) {
      this.setData({ price: that.data.QuestionPrizeOne + that.data.userPhonePrice })
    } else {
      this.setData({ price: that.data.QuestionPrizeOne })
    }
  },
  
  opts2:function(e){
    this.setData({
      select2:!this.data.select,
      select1:false,
      select3:false,
    })

    var isCall = this.data.isCall
    if (isCall) {
      this.setData({ price: that.data.QuestionPrizeTwo + that.data.userPhonePrice })
    } else {
      this.setData({ price: that.data.QuestionPrizeTwo })
    }
  },

  opts3:function(e){
    this.setData({
      select3:!this.data.select,
      select2:false,
      select1:false,
    })

    var isCall = this.data.isCall
    if (isCall) {
      this.setData({ price: that.data.QuestionPrizeThree + that.data.userPhonePrice })
    } else {
      this.setData({ price: that.data.QuestionPrizeThree })
    }
  },

  inputBySelf: function() {
    this.setData({
      showInputSelf: true,
      select3: false,
      select2: false,
      select1: false,
      price: ""
    })
  },

  back: function() {
    this.setData({
      showInputSelf: false,
      select3: false,
      select2: false,
      select1: false,
      price: ""
    })
  },

  showPromptBox: function() {
    this.setData({
      showPromptBox: true,
    })
  },

  iKnow: function() {
    this.setData({
      showPromptBox: false
    })
  },

  isCall: function(e) {
    var price = parseFloat(this.data.price)
    var isCall = e.detail.value
    
    this.setData({
      isCall: isCall
    })
    
    if (price) {
      if (isCall) {
        var price1 = new Number(price - that.data.userPhonePrice).toFixed(2)
        this.setData({
          price: price + that.data.userPhonePrice
        })
      } else {
        var price2 = new Number(price - that.data.userPhonePrice).toFixed(2)
        this.setData({
          price: price2
        })
      }
    }
  },


  tech: function(e) {
    wx.navigateTo({
      url: '../techUse/techUse',
    })
  },

  chooseCity: function(e) {
    wx.navigateTo({
      url: '../switchcity/switchcity',
    })
  }
  
})