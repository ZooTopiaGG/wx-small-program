// // pages/conferencemail/conferencemail.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var choseId
var personType
var meetID
Page({
  data: {
    lists: [],
    textInformation: '请描述该成员的会议职务',
    Userdesc: '',
    textDes: '',
    userCellId: -1,
    showTextArea: 0
  },

  onLoad: function (options) {
    // console.log(options.addMeet)
    var that = this
    meetID = options.meetID
    if (options.addMeet == 'yes') {
      that.setData({
        showTextArea: 1
      })
      // console.log(that.data.showTextArea)
    }
    else {
      that.setData({
        showTextArea: 0
      })
      // console.log(that.data.showTextArea)
    }
    app.func.reqPost('/meet/getmeetingusers', {
      MeetingID: meetID,
    }, function (res) {

      that.setData({
        lists: res.result
      })
      console.log(that.data.lists)
    })

    // console.log(that.data.lists)
  },
  choice: function (e) {
    // console.log(`点击了${e.target.dataset.idx}`)
    console.log(e)


    this.setData({
      userCellId: e.currentTarget.dataset.idx
    })
    console.log(`点击了${e.currentTarget.dataset.idx}`)
    console.log(e.currentTarget.id)
    var inArray = e.currentTarget.id
    choseId = inArray.split("$")[0]
    personType = inArray.split("$")[1]
    // console.log(choseId + personType)
  },

  bindTextAreaBlur(e) {
    //当输入的文字改变走这个方法
    //记录输入的文字   
    var that = this
    that.setData({
      textDes: e.detail.value
    })
  },
  // 保存修改信息
  savetext: function () {
    var that = this
    var showTextArea = that.data.showTextArea
    console.log(showTextArea)
    if (showTextArea == 0) {
      if (!that.data.textDes) {
        common.showToast1('你还没有任何描述', 'loading', 1000)
      } else {
        if (personType == 0) {
          common.showToast1('您是主办方，无需修改！', 'loading', 1000)
          return
        }
        else {
          app.func.reqPost('/meet/updateassist', {
            MeetingID: meetID,
            Userid: choseId,
            UserType: 1,
            Userdesc: that.data.textDes
          }, function (res) {
            if (res.state == 0) {
              common.showToast1('添加描述成功！', 'success', 1000)
            }
            else {
              common.showToast1('添加描述失败！', 'loading', 1000)
            }
          })
        }

      }
    }
    else {
      if (personType == 0) {
        common.showToast1('您是主办方，不能设置演讲嘉宾！', 'loading', 1000)
        return
      }
      else {
        app.func.reqPost('/meet/updateassist', {
          MeetingID: meetID,
          Userid: choseId,
          UserType: 2,
          Userdesc: ' '
        }, function (res) {
          if (res.state == 0) {
            common.showToast1('设置成功！', 'success', 1000)
          }
          else {
            common.showToast1('设置失败！', 'loading', 1000)
            console.log(res)
          }
        })
      }

    }
  }

})
