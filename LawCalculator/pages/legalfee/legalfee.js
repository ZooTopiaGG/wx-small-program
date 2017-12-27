var that
//计算类型id
var id

// var isImportant = false
//当前选择地址的拼音
var sign
//按比例收费的金额
var value

/**
 * 风险代理
 */
var baseMoeny //基础费用
var onelabel //一审约定额
var onescale //一审百分比
var secondlabel='' //二审约定额
var secondscale='' //二审百分比

var length
var hourlyPay

var dataResourcePath

Page({
  data:{
    frees: [
        { id: 10000, name: "按标的额比例收费" },
        { id: 10001, name: "风险代理" },
        { id: 10002, name: "计件收费" },
        { id: 10003, name: "计时收费" }
    ], 
    areas: [{sign: "BeJing", name: "北京市"},
        {sign: "ShangHai", name: "上海市"},
        {sign: "GuangDong", name: "广东省"},
        {sign: "FuJian", name: "福建省"},
        {sign: "GuangXi", name: "广西壮族自治区"},
        {sign: "HeiLongJiang", name: "黑龙江省"},
        {sign: "JiLin", name: "吉林省"},
        {sign: "ShanDong", name: "山东省"},
        {sign: "ShanXi", name: "山西省"},
        {sign: "SiChuan", name: "四川省"},
        {sign: "ZheJiang", name: "浙江省"},
        {sign: "ChongQing", name: "重庆市"},
        {sign: "HuNan", name: "湖南省"},
        {sign: "TianJin", name: "天津市"},
        {sign: "LiaoNing", name: "辽宁省"},
        {sign: "HuBei", name: "湖北省"},
        {sign: "AnHui", name: "安徽省"},
        {sign: "HeBei", name: "河北省"},
        {sign: "HeNan", name: "河南省"},
        {sign: "JiangXi", name: "江西省"},
        {sign: "QingHai", name: "青海省"},
        {sign: "NeiMengGu", name: "内蒙古自治区"},
        {sign: "XinJiang", name: "新疆"},
        {sign: "HaiNan", name: "海南省"},
        {sign: "ShanXi1", name: "陕西省"},
        {sign: "GanSu", name: "甘肃省"},
        {sign: "NingXia", name: "宁夏回族自治区"},
        {sign: "XiZang", name: "西藏自治区"},
        {sign: "GuiZhou", name: "贵州省"},
        {sign: "YunNan", name: "云南省"},],
    isShowActionSheet: false,
    isShowActionSheet2: false,
    area: '',
    free: '',
    isShowValue: false,
    isShowRiskAgency: false,
    isShowJijian: false,
    isImportant: false,
    //是否是重大案情
    important: false,
    result: null,
    desc: '',

    //风险代理
    baseMoeny: '',
    onelabel: '', //一审约定额
    onescale: '', //一审百分比
    secondlabel: '', //二审约定额
    secondscale: '', //二审百分比

    //计件收费
    cases: '',
    desArr: [],
    CivilAction: [],

    //计时收费
    isShowTime: false,
    standard: '',
    hourlyPay: '',
    length: '',

    index: 0,
    freeIndex: 0,

    RiskFreeTitle: '',

    //数据来源
    dataResource: '',
    releaseDate: ''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this
  },

  calculate: function() {
      if (id == 10000) {
          var path = '../../areaCal/' + sign + '.js'
          var cal = require(path)
          if (value) {
            that.setData({
                result: cal.RatioFees(value, that.data.important),
                desc: cal.FreeRule
            })
          }
      } else if (id==10001) {
          var result = that.riskFree(baseMoeny, onelabel, onescale, secondlabel, secondscale)
          var path = '../../areaCal/' + sign + '.js'
          var cal = require(path)
          that.setData({
            RiskFreeTitle: cal.RiskFreeTitle
          })
          if (result) {
              that.setData({
                  result: result,
              })
          }
      } else if (id==10002) {
          var path = '../../areaCal/' + sign + '.js'
          var cal = require(path)
          that.setData({
              desc: cal.FreeRule
          })

          if (that.data.important) {
              for (var i=0; i<cal.JiJianArr.length; i++) {
                  if (cal.JiJianArr[i].Important == 1) {
                      that.setData({
                          cases: cal.JiJianArr[i].cases,
                          desArr: cal.JiJianArr[i].desArr,
                          CivilAction: cal.JiJianArr[i].CivilAction
                      })
                  }
              }
          } else {
              for (var i=0; i<cal.JiJianArr.length; i++) {
                  if (cal.JiJianArr[i].Important == 0) {
                      that.setData({
                          cases: cal.JiJianArr[i].cases,
                          desArr: cal.JiJianArr[i].desArr,
                          CivilAction: cal.JiJianArr[i].CivilAction
                      })
                  }
              }
          }
      } else if (id==10003) {
          var path = '../../areaCal/' + sign + '.js'
          var cal = require(path)
          that.setData({
              standard: cal.TimeFreeTitle
          })
          if (length && hourlyPay) {
              that.setData({
                  result: that.timeFree(hourlyPay, length)
              })
          }
      }
  },

  reset: function() {
    // that.setData({
    //     isShowValue: false,
    //     isImportant: false,
    //     isShowJijian: false,
    //     isShowRiskAgency: false,
    //     isShowTime: false,

    //     result: null,
    //     cases: '',
    //     desArr: null,
    //     CivilAction: null,

    //     area: '',
    //     free: ''      
    // })      

    if (id==10000) {
        that.setData({
            value: '',
            important: false,
            result: ''
        })
        value = 0
    } else if (id==10001) {
        that.setData({
            baseMoney: '',
            onelabel: '',
            onescale: '',
            secondlabel: '',
            secondscale: '',
            result: ''
        })
        baseMoeny=0
        onelabel=0
        onescale=0
        secondlabel=0
        secondscale=0
    } else if (id==10002) {
        that.setData({
            important: false,
            desArr: null,
            CivilAction: null,
            cases: ''
        })
    } else if (id==10003) {
        hourlyPay = 0,
        length = 0,
        that.setData({
            hourlyPay: '',
            length: '',
            result: '',
            standard: ''
        })
    }
  },

  important: function(e) {
    //   isImportant = e.detail.value
      that.setData({
          important: e.detail.value
      })
  },

  inputValue: function(e) {
      //输入的按比例收费的金额金额
      value = e.detail.value
  },

  riskFree: function(moeny, onelabel, onescale, secondlabel, secondscale) {
      //风险代理 一审  （）约定标的*（）比例%
            if (moeny == "" || isNaN(moeny)) {
                return false;
            }
            if (onelabel != "" && onescale == ""){
                return false;
            }
            if (onelabel == "" && onescale != "") {
                return false;
            }
            // if (secondlabel != "" && secondscale == "") {
            //     return false;
            // }
            // if (secondlabel == "" && secondscale != "") {
            //     return false;
            // }
           
            var one = 0;
            var two = 0;
            //如果一审项不为空
            if (onelabel != "" && onescale != "")
            {
                if (isNaN(onelabel))
                {
                    return false;
                }
                if (isNaN(onescale))
                {
                    return false;
                }
                one= parseFloat((onelabel * (onescale / 100)))
            }
            //如果二审项不为空
            if (secondlabel != "" && secondlabel != "") {
                if (isNaN(secondlabel)) {
                    return false;
                }
                if (isNaN(secondscale)) {
                    return false;
                }
                two = parseFloat((secondlabel * (secondscale / 100)))
            } else if (secondlabel == "" && secondlabel != ""){
                return false;
            } else if (secondlabel != "" && secondlabel == ""){
                return false;
            }

            if (one == 0 && two == 0)
            {
                return false;
            }
            return parseFloat(moeny) + one + two;
  },

  baseMoney: function(e) {
      baseMoeny = e.detail.value
  },

  onelabel: function(e) {
      onelabel = e.detail.value
  },

  onescale: function(e) {
      onescale = e.detail.value
  },

  secondlabel: function(e) {
      secondlabel = e.detail.value
  },

  secondscale: function(e) {
      secondscale = e.detail.value
  },

  length: function(e) {
      length = e.detail.value
      that.setData({
          length: e.detail.value
      })
  },
  
  hourlyPay: function(e) {
      hourlyPay = e.detail.value
      that.setData({
          hourlyPay: e.detail.value
      })
  },

  timeFree: function(money, time) {
      return parseFloat(money) * parseFloat(time);
  },

  bindAreaPickerChange: function(e) {
      that.setData({
          index: e.detail.value
      })
      var index = e.detail.value
      sign = that.data.areas[index].sign
      var name = that.data.areas[index].name
      that.setData({
          area: name
      })
      
      var dataResource = ''
      var releaseDate = ''
      switch(sign) {
          case 'BeJing':
            dataResource = '《北京市律师诉讼代理服务收费政府指导价标准》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/BeiJ.docx'
          break
          case 'ShangHai':
            dataResource = '《上海市律师服务收费政府指导价标准》'     
            releaseDate = '2016年6月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/ShangH.docx'
          break
          case 'GuangDong':
            dataResource = '《广东省律师服务实行政府指导价收费标准》'
            releaseDate = '2016年6月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/GuangD.docx'
          break
          case 'FuJian':
            dataResource = '《福建省律师法律服务收费行业指导标准》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/FuJ.docx'
          break
          case 'GuangXi':
            dataResource = '《广西壮族自治区律师服务收费管理实施办法》'
            releaseDate = '2013年4月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/GuangX.docx'
          break
          case 'HeiLongJiang':       
            dataResource = '《黑龙江省法律服务收费政府指导价标准》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HeiLJ.docx'
          break   
          case 'JiLin':
            dataResource = '《吉林省律师法律服务收费行业指导标准》'
            releaseDate = '2017年4月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/JiL.docx'
          break
          case 'ShanDong':
            dataResource = '《山东省律师服务收费标准》'
            releaseDate = '2017年1月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/ShanD.docx'
          break
          case 'ShanXi':
            dataResource = '《山西省律师服务收费管理办法》'
            releaseDate = '2016年8月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/Sha1nX.docx'
          break   
          case 'SiChuan':
            dataResource = '《四川省律师法律服务收费行业指导标准》'
            releaseDate = '2016年6月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/SiC.docx'
          break
          case 'ZheJiang':
            dataResource = '《浙江省律师服务收费新标准》'
            releaseDate = '2015年11月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/ZheJ.docx'
          break
          case 'ChongQing':
            dataResource = '《重庆市律师服务收费指导标准》'
            releaseDate = '2016年9月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/ChongQ.docx'
          break                                     
          case 'HuNan':
            dataResource = '《湖南省律师服务收费行业指导标准》'
            releaseDate = '2017年1月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HuN.docx'
          break
          case 'TianJin':
            dataResource = '《天津市律师服务收费指引》'
            releaseDate = '2015年12月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/TianJ.docx'
          break
          case 'LiaoNing':
            dataResource = '《辽宁省律师法律服务收费行业指导标准》'
            releaseDate = '2015年12月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/LiaoN.docx'
          break
          case 'HuBei':
            dataResource = '《湖北省实行政府指导价的律师服务收费标准》'
            releaseDate = '2016年4月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HuB.docx'
          break
          case 'AnHui':
            dataResource = '《安徽省律师收费标准》'
            releaseDate = '2016年2月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/AnH.docx'
          break
          case 'HeBei':
            dataResource = '《河北省律师服务收费指导意见》'
            releaseDate = '2016年2月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HeB.docx'
          break   
          case 'HeNan':
            dataResource = '《河南省律师服务收费行业指导意见》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HeN.docx'
          break
          case 'JiangXi':
            dataResource = '《江西省律师服务收费指导价标准》'
            releaseDate = '2016年2月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/JiangX.docx'
          break
          case 'QingHai':
            dataResource = '《青海省律师服务收费标准》'
            releaseDate = '2012年2月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/QingH.docx'
          break   
          case 'NeiMengGu':
            dataResource = '《内蒙古自治区律师服务收费标准》'
            releaseDate = '2010年8月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/NeiMG.docx'
          break
          case 'XinJiang':
            dataResource = '《新疆维吾尔自治区律师服务收费标准》'
            releaseDate = '2002年7月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/XinJ.docx'
          break
          case 'HaiNan':
            dataResource = '《海南省律师法律服务收费行业指导标准》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/HaiN.docx'
          break      
          case 'ShanXi1':
            dataResource = '《陕西省律师服务收费管理办法》'
            releaseDate = '2016年5月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/Sha3nX.docx'
          break
          case 'GanSu':
            dataResource = '《甘肃省律师服务收费指导意见》'
            releaseDate = '2016年6月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/GanS.docx'
          break
          case 'NingXia':
            dataResource = '《宁夏回族自治区律师业服务收费指导意见》'
            releaseDate = '2016年2月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/NingX.docx'
          break   
          case 'XiZang':
            dataResource = '《西藏自治区律师服务收费标准》'
            releaseDate = '2007年8月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/XiZ.docx'
          break
          case 'GuiZhou':
            dataResource = '《贵州省律师服务收费暂行规定》'
            releaseDate = '2017年3月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/GuiZ.docx'
          break
          case 'YunNan':
            dataResource = '《云南省律师服务收费行业指引标准》'
            releaseDate = '2017年1月'
            dataResourcePath = 'https://file.lawyer-says.com/lawyer_fee/YunN.docx'
          break                                  
          
      }

      that.setData({
          dataResource: dataResource,
          releaseDate: releaseDate
      })
  },

  bindFreePickerChange: function(e) {
    //   that.setData({
    //       freeIndex: e.detail.value
    //   })
      var freeIndex = e.detail.value

      if (!that.data.area) {
          return
      }

      var free = e.target.id
      var name
    
        id = that.data.frees[freeIndex].id
        name = that.data.frees[freeIndex].name
        that.setData({
        free: name
        })
        if (id==10000) {
            that.setData({
                isShowValue: true,
                isImportant: true,
                isShowJijian: false,
                isShowRiskAgency: false,
                isShowTime: false,

                result: null,
                cases: '',
                desArr: null,
                CivilAction: null,
                RiskFreeTitle: '',
                standard:''      
            })
        } else if (id==10001) {
            var path = '../../areaCal/' + sign + '.js'
            var cal = require(path)


            that.setData({
                isShowValue: false,
                isImportant: false,
                isShowJijian: false,
                isShowRiskAgency: true,
                isShowTime: false,

                result: null,
                cases: '',
                desArr: null,
                CivilAction: null,

                RiskFreeTitle: cal.RiskFreeTitle,
                standard:''      
            })
        } else if (id==10002) {
            that.setData({
                isShowValue: false,
                isImportant: true,
                isShowJijian: true,
                isShowRiskAgency: false,
                isShowTime: false,
                
                result: null,
                cases: '',
                desArr: null,
                CivilAction: null,
                RiskFreeTitle: '',
                standard:''                        
            })
        } else if (id=10003) {
            that.setData({
                isShowValue: false,
                isImportant: false,
                isShowJijian: false,
                isShowRiskAgency: false,
                isShowTime: true,

                result: null,
                cases: '',
                desArr: null,
                CivilAction: null,
                RiskFreeTitle: '',
            })
        }
  },

  document: function(e) {
    wx.downloadFile({
    url: dataResourcePath,
    success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
        filePath: filePath,
        success: function (res) {
            console.log('打开文档成功')
        }
        })
    }
    })
  },

  onShareAppMessage: function() {}

})

