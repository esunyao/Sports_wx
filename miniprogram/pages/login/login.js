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
        account: '', passwd: '', token: '',

        // resource
        titleImagePath: ''
    }, lifetimes: {
        created: function () {
            if (wx.getStorageSync('token') === '') {
                console.debug("未找到记录中的token")
            } else {
                // console.log("找不到")
                this.setData({
                    token: wx.getStorageSync('token')
                });
                wx.showLoading({
                    title: '加载中...',
                });
                wx.request({
                    url: constants.API_V1_CHECK_TOKEN, method: 'POST', header: {
                        'content-type': 'application/json',
                    }, data: {
                        token: this.data.token
                    }, success: function (res) {
                        wx.hideLoading();
                        if (res.data.code === constants.LOGIN_SUCCESS_CODE) {
                            wx.redirectTo({
                                url: '/pages/main/main'
                            });
                        } else {
                            wx.showToast({
                                title: '登录已过期 请重新登录', icon: 'error', duration: 2000
                            })
                        }
                    }, fail: function (res) {
                        wx.hideLoading();
                        console.log(res.errMsg)
                        wx.showToast({
                            title: '网络请求失败', icon: 'error', duration: 2000
                        })
                    }
                })
            }
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
                    if (res.data.code === constants.LOGIN_SUCCESS_CODE) {
                        wx.showToast({
                            title: '登录成功', icon: 'success', duration: 2000
                        })
                        wx.setStorageSync('token', JSON.parse(res.data.data).token);
                        wx.redirectTo({
                            url: '/pages/main/main'
                        });
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
        }
    },
})