// index.js
// 获取应用实例
const app = getApp()
// import md5 from '../../utils/md5.js'
const ImageResourceManager = require('../../resource/ResourceManage.js');
const imageResourceManager = new ImageResourceManager();
var md5 = require('../../utils/md5.js')
var constants = require('../../constants/core_constant.js');
// const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Component({
    data: {
        account: '', passwd: '',

        // resource
        titleImagePath: ''
    }, lifetimes: {
        created: function () {
            this.setData({
                titleImagePath: imageResourceManager.getImagePath('cn.esuny.main.Title')
            });
        }
    }, methods: {
        handleAccountInput: function (e) {
            this.setData({
                account: e.detail.value
            });
        }, handlePasswdInput: function (e) {
            this.setData({
                passwd: e.detail.value
            });
        }, handleLogin: function () {
            if (this.data.account === '' || this.data.passwd === '') {
                wx.showToast({
                    title: '账号或密码不能为空', icon: 'error', duration: 2000
                })
                return
            }
            wx.request({
                url: constants.API_V1_LOGIN, method: 'POST', data: {
                    account: this.data.account, password: md5.hex(this.data.passwd)
                }, header: {
                    'content-type': 'application/json'
                }, success: function (res) {
                    console.log(res.data)
                    if (res.data.code === constants.LOGIN_SUCCESS_CODE) {
                        wx.showToast({
                            title: '登录成功', icon: 'success', duration: 2000
                        })
                        wx.navigateTo({
                            url: '/pages/main/main'
                        });
                        console.log("跳转页面")
                    } else {
                        wx.showToast({
                            title: '登录失败 ' + res.data.message, icon: 'error', duration: 2000
                        })
                    }
                }, fail: function (res) {
                    console.log(res.errMsg)
                    wx.showToast({
                        title: '网络请求失败', icon: 'error', duration: 2000
                    })

                }
            })
        }, // 事件处理函数
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