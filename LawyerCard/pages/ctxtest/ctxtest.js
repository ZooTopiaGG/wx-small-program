// pages/ctxtest/ctxtest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicPicture: '',
    qrCode: '',
    publicImg: '',
    avatar: '',
    pixelRatio: '',
    lines: 0,
    text: '',
    linechnum: '',
    contentHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.drawCanvas()
    this.loadImg()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  onShareAppMessage: function () {
  
  },
  loadImg: function() {
    var that = this
    // 一张一张的生成 比较消耗性能
    wx.downloadFile({
      // publicImg
      url: 'https://test2.lawyer-says.cn/images/1.png',
      success: function(res) {
        that.setData({
          publicImg: res.tempFilePath
        })
      },
      complete: function (res) {
        wx.downloadFile({
          // avatar
          url: 'https://test2.lawyer-says.cn/images/20170420163727227.jpg',
          success: function (res) {
            that.setData({
              avatar: res.tempFilePath
            })
          },
          complete: function (res) {
            wx.downloadFile({
              // qrCode
              url: 'https://test2.lawyer-says.cn/images/2017032115534559.jpg',
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
    // 一起生成 不知道生成的是哪张
    // var urlgroups = [
    //   'https://test2.lawyer-says.cn/images/2017032115534559.jpg',
    //   'https://test2.lawyer-says.cn/images/1.png',
    //   'https://test2.lawyer-says.cn/images/20170420163727227.jpg'
    // ]
    // var arr = []
    // urlgroups.map( x => {
    //   var n = ''
    //   wx.downloadFile({
    //     url: x,
    //     success: function(res) {
    //       console.log(res)
    //       arr.push(res.tempFilePath)
    //       if (arr.length >= 3) {
    //         console.log(arr)
    //         that.drawCanvas()
    //       }
    //     }
    //   })
    // })
  },
  drawCanvas: function () {
    // 创建canvas
    var 
      that = this,
      ctx = wx.createCanvasContext("myCanvas"),
      // qrCode = 'https://test2.lawyer-says.cn/images/2017032115534559.jpg',
      // img = 'https://test2.lawyer-says.cn/images/1.png',
      // avatar = 'https://test2.lawyer-says.cn/images/20170420163727227.jpg'
      qrCode = that.data.qrCode,
      imgSrc = that.data.publicImg,
      avatar = that.data.avatar,
      str = '本恶笨笨笨笨笨饿饿饿哒阿大大到啊的啊的啊是发父暗示法啊父艾弗森本恶笨笨笨笨笨饿饿饿哒阿大大到啊的啊的啊是发父暗示法啊父艾弗森本恶笨笨笨笨笨饿饿饿哒阿大大到啊的啊的啊是发父暗示法啊父艾弗森本恶笨笨笨笨笨饿饿饿哒阿大大到啊的啊的啊是发父暗示法啊父艾弗森',
      str1 = '本恶笨笨笨笨笨饿饿饿哒阿大大到啊的啊的啊是发父暗示法啊父艾弗森';

    var getImgHeight = '',
      getImgWidth = '';
    that.setData({
      pixelRatio: wx.getSystemInfoSync().pixelRatio
    })
    // 获取屏幕宽高
    var windowHeight = wx.getSystemInfoSync().windowHeight,
      windowWidth = wx.getSystemInfoSync().windowWidth;
    console.log(`应用窗口的原始宽高: ${windowWidth} -- ${windowHeight}`)
    // 获取图片宽高
    wx.getImageInfo({
      src: imgSrc,
      success: res => {
        getImgHeight = res.height,
        getImgWidth = res.width;
        console.log(`img的原始宽高: ${getImgWidth} -- ${getImgHeight}`)
        // 设置图片缩放
        var setImgHeight = (windowWidth - 6 ) / getImgWidth * getImgHeight
        console.log(setImgHeight)
        ctx.drawImage(imgSrc, 3, 3, windowWidth-6, setImgHeight)
        ctx.drawImage(avatar, 15, setImgHeight + 15, 31, 31)
        ctx.setFontSize(14)
        ctx.fillText('陶主任', 51, setImgHeight + 27)
        ctx.setFontSize(14)
        ctx.setFillStyle('#666666')
        ctx.fillText('2018.02.01', 51, setImgHeight + 45)
        ctx.fillText('正在读这篇文章', 131, setImgHeight + 45)
        ctx.setFontSize(21)
        ctx.setFillStyle('#090909')
        that.strsplice(str1, 32, function () {
          console.log(11)
          for (var n = 0, off = 0; n < 2; n++) {
            var lnstr = that.getLineString(str1, off, 32);
            off += lnstr.length;
            ctx.fillText(lnstr, 15, setImgHeight + 81 + n * 30);
          }
        })
        // ctx.fillText('别人的物业给业主发出去哈哈哈哈啊', 30, 290)
        ctx.setFontSize(16)
        ctx.setFillStyle('#999999')
        that.strsplice(str, 42, function () {
          for (var n = 0, off = 0; n < 4; n++) {
            var lnstr = that.getLineString(str, off, 42);
            off += lnstr.length;
            ctx.fillText(lnstr, 15, setImgHeight + 152 + n * 25);
          }
        })
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释阿达的a', 15, 341)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 366)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 391)
        // ctx.fillText('为啥要发红包呢？待效率和大家解释解释。。', 15, 416)
        ctx.beginPath()
        ctx.setLineWidth(0.5)
        ctx.setFillStyle('#8d8d8d')
        ctx.moveTo(15, setImgHeight + 257)
        ctx.lineTo(358, setImgHeight + 257)
        ctx.stroke()
        ctx.setFontSize(16)
        ctx.setFillStyle('#333333')
        ctx.fillText('发表者', 15, setImgHeight + 301)
        ctx.fillText('陈浩文律师', 15, setImgHeight + 331)
        ctx.setFontSize(14)
        ctx.setFillStyle('#8d8d8d')
        ctx.fillText('长按小程序码', 201, setImgHeight + 301)
        ctx.fillText('进入律师小程序阅读全文', 132, setImgHeight + 330)
        ctx.drawImage(qrCode, 300, setImgHeight + 279, 60, 60)
        that.setData({
          contentHeight: setImgHeight + 410
        })
        ctx.draw(true, function () {
          wx.hideLoading()
          that.setData({
            zi: 5
          })
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: windowWidth,
            height: setImgHeight + 410,
            destWidth: windowWidth * that.data.pixelRatio,
            destHeight: (setImgHeight + 410) * that.data.pixelRatio,
            fileType: 'jpg',
            canvasId: 'myCanvas',
            success: function (res) {
              // 保存到系统相册
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '已保存到系统相册',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          })
        })
      },
      complete: res => {
        console.log(res)
      }
    })
    
  },
  // str拆分
  strsplice: function (text, linechnum,callback) {
    if (typeof text != 'string' || text.trim().length === 0) {
      var err = new Error('text is not correct:<' + text + '>');
      return callback(err);
    }
    text = text.trim().replace(/\t/g, ' ');
    var linechnum = linechnum;
    var lineheight = 22;
    var lines = Math.floor(this.getTrueLength(text) / linechnum) + 1;
    // lines = lines > 4 ? 4: lines
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
    console.log(str.substring(offset, x))
    return str.substring(offset, x);
  }
})