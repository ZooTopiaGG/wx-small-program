// pages/articleDetails/articleDetails.js
var util = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    article: '',
    art: '',
    convasContent: '', //文本被截取的字符串
    articleContent: {}, // 文章详情内容
    supNum: 0,
    supAvatar: ['../../images/atu.png'],
    animationData: {}, // 动画
    ty:'1000px', // translateY
    oy: 0, // opacity
    qrCode: '', // 文章二维码
    publicImg: '', // 海报
    avatar: '', // 海报 头像
    // pixelRatio: '', // 设备比例
    zi: -1, // 层级
    lines: 0, // 行数
    text: '', // 文本字符串
    linechnum: '', // 切割字符串
    artid: '', // 文章id,
    contentHeight: 0, // canvas高,
    supImg: '../../images/nosup.png'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      artid: options.articleid
    })
  },
  renderCase () {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取文章内容
    app._http.http_get('/article/getarticlecontent?lawyerid=' + app.globalData.lawyerid + '&articleid=' + that.data.artid, res => {
      // console.log(res)
      wx.hideLoading()
      var sum = res.result.summary.substr(0, 100).replace(/\s+/g, "")
      that.setData({
        articleContent: res.result,
        supNum: res.result.totalnum,
        supAvatar: res.result.headurl,
        art: res.result.content,
        convasContent: sum
      })
      // console.log(that.data.supAvatar)
      wx.setNavigationBarTitle({
        title: res.result.title,
      })
    })    
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    this.renderCase()
  },
  // 拨号
  gotolink (e) {
    wx.switchTab({
      url: '../linkme/linkme',
    })
  },
  // 创建动画
  createAnimations () {
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.opacity(1).translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  // 隐藏动画
  hideAnimations () {
    this.animation.translateY(-1000).opacity(0).step({duration: 1000})
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 点赞授权
  supportBtn () {
    var that = this
    var _openid = wx.getStorageSync('_openid')
    // console.log(app.globalData.userInfo.avatarUrl)
    if (_openid) {
      app._http.http_post('/visitor/thumbarticle', {
        articleid: that.data.artid,
        lawyerid: app.globalData.lawyerid,
        openid: _openid,
        headurl: app.globalData.userInfo.avatarUrl
      }, res => {
        if (res.state == 0) {
          that.data.supAvatar.push(String(app.globalData.userInfo.avatarUrl))
          that.setData({
            supNum: Number(that.data.supNum) + 1,
            supAvatar: that.data.supAvatar,
            supImg: '../../images/dz.png'
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 500
          })
        } else if (res.state == -1104002) {
          that.setData({
            supImg: '../../images/dz.png'
          })
          wx.showToast({
            title: '您已点赞',
            icon: 'loading',
            duration: 500
          })
        } else {
          wx.showToast({
            title: '文章不存在',
            icon: 'loading',
            duration: 500
          })
        }
      })
    } else {
      wx.login({
        success: res => {
          var code = res.code
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              // console.log(app.globalData.userInfo)
              app.getOpenId(res.userInfo, app.globalData.lawyerid, code)
              setTimeout(() => {
                that.supportBtn()
              }, 500)
            }
          })
        }
      })
    }
  },
  // 生成海报时 需要监听是否授权
  createPoster () {
    var that = this
    var _openid = wx.getStorageSync('_openid')
    // console.log(_openid == false)
    if (_openid) {
      that.hideAnimations()
      wx.showLoading({
        title: '正在生成海报...',
      })
      that.loadImg()
    } else {
      wx.login({
        success: res => {
          var code = res.code
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              // console.log(app.globalData.userInfo)
              app.getOpenId(res.userInfo, app.globalData.lawyerid, code)
              that.hideAnimations()
              wx.showLoading({
                title: '正在生成海报...',
              })
              that.loadImg()
            }
          })
        }
      })
    }
  },
  hideCanvas () {
    wx.redirectTo({
      url: '../articleDetails/articleDetails?articleid=' + this.data.artid,
    })
  },
  // 加载并下载图片
  loadImg: function () {
    var that = this
    // console.log(that.data.articleContent.picurl)
    // 一张一张的生成 比较消耗性能
    wx.downloadFile({
      // publicImg
      url: that.data.articleContent.picurl,
      success: function (res) {
        that.setData({
          publicImg: res.tempFilePath
        })
      },
      complete: function (res) {
        // console.log(app.globalData.userInfo.avatarUrl)
        wx.downloadFile({
          // avatar 微信头像
          url: app.globalData.userInfo.avatarUrl,
          success: function (res) {
            // console.log(res.tempFilePath)
            that.setData({
              avatar: res.tempFilePath
            })
          },
          complete: function (res) {
            // console.log(that.data.articleContent.codeurl)
            wx.downloadFile({
              // qrCode
              url: that.data.articleContent.codeurl,
              success: function (res) {
                that.setData({
                  qrCode: res.tempFilePath
                })
              },
              complete: function (res) {
                that.drawCanvas()
              }
            })
          }
        })
      }
    })
  },
  // 创建canvas 并画图
  drawCanvas: function () {
    // 创建canvas
    var
      that = this,
      ctx = wx.createCanvasContext("myCanvas"),
      qrCode = that.data.qrCode,
      imgSrc = that.data.publicImg,
      avatar = that.data.avatar,
      content = that.data.convasContent,
      title = that.data.articleContent.title,
      lawyername = that.data.articleContent.name,
      username= app.globalData.userInfo.nickName;
    // console.log(username)
    // 获取设备比例 ，调整输出图片清晰度
    // 获取屏幕宽高
    var 
      pixelRatio = wx.getSystemInfoSync().pixelRatio,
      windowHeight = wx.getSystemInfoSync().windowHeight,
      windowWidth = wx.getSystemInfoSync().windowWidth;
    // console.log(`应用窗口的原始宽高: ${windowWidth} -- ${windowHeight}`)
    // 获取图片宽高
    wx.getImageInfo({
      src: imgSrc,
      success: res => {
        var getImgHeight = res.height,
            getImgWidth = res.width;
        // console.log(`img的原始宽高: ${getImgWidth} -- ${getImgHeight}`)
        // 设置图片缩放
        var setImgHeight = (windowWidth - 6) / getImgWidth * getImgHeight
        // console.log(setImgHeight)
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, windowWidth, setImgHeight + 390)
        ctx.drawImage(imgSrc, 3, 3, windowWidth - 6, setImgHeight)
        ctx.drawImage(avatar, 15, setImgHeight + 15, 31, 31)
        ctx.setFontSize(14)
        ctx.setFillStyle('#666666')
        ctx.fillText(username, 51, setImgHeight + 27)
        ctx.setFontSize(14)
        ctx.fillText(util.formatTime(new Date()), 51, setImgHeight + 45)
        ctx.fillText('正在读这篇文章', 131, setImgHeight + 45)
        ctx.setFontSize(21)
        ctx.setFillStyle('#090909')
        that.strsplice(title, 32, function () {
          // console.log(11)
          for (let n = 0, off = 0; n < 2; n++) {
            let lnstr1 = that.getLineString(title, off, 32);
            off += lnstr1.length;
            ctx.fillText(lnstr1, 15, setImgHeight + 81 + n * 30);
          }
        })
        // ctx.fillText('别人的物业给业主发出去哈哈哈哈啊', 30, 290)
        ctx.setFontSize(16)
        ctx.setFillStyle('#999999')
        that.strsplice(content, 42, function () {
          for (let t = 0, off = 0; t < 4; t++) {
            // console.log(`t的执行：${t}`)
            let lnstr = that.getLineString(content, off, 42);
            off += lnstr.length;
            ctx.fillText(lnstr, 15, setImgHeight + 142 + t * 25);
          }
        })
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释阿达的a', 15, 341)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 366)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 391)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 416)
        ctx.beginPath()
        ctx.setLineWidth(0.5)
        ctx.setFillStyle('#8d8d8d')
        ctx.moveTo(15, setImgHeight + 247)
        ctx.lineTo(358, setImgHeight + 247)
        ctx.stroke()
        ctx.setFontSize(16)
        ctx.setFillStyle('#333333')
        ctx.fillText('发表者', 15, setImgHeight + 291)
        ctx.fillText(lawyername+'律师', 15, setImgHeight + 321)
        ctx.setFontSize(14)
        ctx.setFillStyle('#8d8d8d')
        ctx.fillText('长按小程序码', 191, setImgHeight + 291)
        ctx.fillText('进入律师小程序阅读全文', 122, setImgHeight + 320)
        ctx.drawImage(qrCode, 284, setImgHeight + 255, 80, 80)
        that.setData({
          contentHeight: setImgHeight + 390
        })
        ctx.draw(true, function () {
          that.setData({
            zi: 5
          })
        })
        // ctx.draw()兼容安卓保存本地图片解决方法 setTimeout(() => {}, 500)
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: windowWidth,
            height: setImgHeight + 390,
            destWidth: windowWidth * that.data.pixelRatio,
            destHeight: (setImgHeight + 390) * that.data.pixelRatio,
            fileType: 'jpg',
            canvasId: 'myCanvas',
            success: function (res) {
              wx.hideLoading()
              // 保存到系统相册
              // console.log(res.tempFilePath)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '已保存到系统相册',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: res => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              })
            }
          })
        }, 500)
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '图片获取失败',
          icon: 'loading',
          duration: 1500
        })
      },
      complete: res => {
        // console.log(res)
      }
    })

  },
  // str拆分
  strsplice: function (text, linechnum, callback) {
    if (typeof text != 'string' || text.trim().length === 0) {
      var err = new Error('text is not correct:<' + text + '>');
      return callback(err);
    }
    text = text.trim().replace(/\t/g, ' ');
    var linechnum = linechnum;
    var lines = Math.floor(this.getTrueLength(text) / linechnum) + 1;
    // lines = lines > 4 ? 4 : lines
    // this.setData({
    //   lines: lines,
    //   text: text,
    //   linechnum: linechnum
    // })
    return typeof callback == "function" && callback()
  },

  getTrueLength: function (str) {
    var len = str.length, truelen = 0;
    for (var x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        truelen += 2;
      } else {
        truelen += 1;
      }
    }
    return truelen;
  },

  getLineString: function (str, offset, linechnum) {
    var len = str.length, nlen = 0;
    var x = offset;
    for (; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        if (nlen + 2 <= linechnum) {
          nlen += 2;
        } else {
          break;
        }
      } else {
        if (nlen + 1 <= linechnum) {
          nlen++;
        } else {
          break;
        }
      }
    }
    // console.log(str.substring(offset, x))
    return str.substring(offset, x);
  },
  /**
    分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: that.data.articleContent.title,
      path: 'pages/articleDetails/articleDetails?articleid=' + that.data.artid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})