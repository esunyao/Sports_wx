// index.js
// 获取应用实例
const app = getApp()
var utilMd5 = require('../../utils/md5.js');
var UUID = require('../../utils/UUID_Utils');
var constants = require('../../constants/core_constant.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    asdfasdf: true,
    // motto: 'Hello World',
    // userInfo: {
    //   avatarUrl: defaultAvatarUrl,
    //   nickName: '',
    // },
    // hasUserInfo: false,
    // canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    // canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    account: '',
    passwd: ''
  },
  methods: {

    handleAccountInput: function(e) {
      this.setData({
        account: e.detail.value
      });
    },
    handlePasswdInput: function(e) {
      this.setData({
        passwd: e.detail.value
      });
    },
    handleLogin: function() {
      console.log('Account: ' + UUID.generateUUIDFromString(this.data.account));
      console.log('Password: ' + utilMd5.hexMD5(this.data.passwd));
      wx.request({
        url: constants.API_V1_LOGIN,
        method: 'POST',
        data: {
          account: UUID.generateUUIDFromString(this.data.account),
          password: utilMd5.hexMD5(this.data.passwd)
        },
        header: {
            'content-type': 'application/json'
            },
        success: function(res) {
            console.log(res.data)
            this.data.asdfasdf = false
            if (res.data.code === 0) {
                wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
                })
            } else {
                wx.showToast({
                title: '登录失败'+res.data,
                icon: 'none',
                duration: 2000
                })
            }
        },
        fail: function(res) {
            console.log(res.data)
            wx.showToast({
                title: '登录失败aasdf'+res.data,
                icon: 'none',
                duration: 2000
            })
        }
      })
    },
    // 事件处理函数
    // bindViewTap() {
    //   wx.navigateTo({
    //     url: '../logs/logs',
    //   })
    // },
    // onChooseAvatar(e) {
    //   const { avatarUrl } = e.detail
    //   const { nickName } = this.data.userInfo
    //   this.setData({
    //     "userInfo.avatarUrl": avatarUrl,
    //     hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    //   })
    // },
    // onInputChange(e) {
    //   // const nickName = e.detail.value
    //   // const { avatarUrl } = this.data.userInfo
    //   // this.setData({
    //   //   "userInfo.nickName": nickName,
    //   //   hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    //   // })
    // },
    // getUserProfile() {
    //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    //   wx.getUserProfile({
    //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //     success: (res) => {
    //       console.log(res)
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // },
  },
})