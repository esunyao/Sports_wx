const ImageResourceManager = require('../../resource/ResourceManage')
const imageResourceManager = new ImageResourceManager();
var constants = require('../../constants/core_constant.js');
Page({
    data: {
        progressValue: 20,
        fitnessValue: 0,
        shequ01: '',
        reset_data_l: imageResourceManager.getImagePath("cn.esuny.")
    }, onLoad: function () {
        // 显示加载框
        // wx.showLoading({
        //     title: '正在连接蓝牙设备...',
        // });
        console.error("asdfasdf");
        let that = this;
        console.log(wx.getStorageSync('token'))
        let ur = constants.API_V1_GETRESOURCE + "/shequ01.gif"
        console.log(ur)
        wx.downloadFile({
            url: ur, // 这里填��你的图片在线链接
            header:{
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },
            success: function(res) {
                if (res.statusCode === 200) {
                    wx.getImageInfo({
                        src: res.tempFilePath,
                        success: function(info) {
                            that.setData({
                                shequ01: info.path
                            });
                        }
                    });
                }
            }
        });
        // 初始化蓝牙适配器
        wx.openBluetoothAdapter({
            success: (res) => {
                console.log('初始化蓝牙适配器成功', res);
                // 开始扫描蓝牙设备
                this.startBluetoothDevicesDiscovery();
            }, fail: (err) => {
                console.log('初始化蓝牙适配器失败', err);
                // 初始化失败后关闭加载框
                wx.hideLoading();
            }
        });
        // 监听低功耗蓝牙设备的特征值变化
        wx.onBLECharacteristicValueChange(function (res) {
            console.log('特征值变化', res.characteristicId, res.value);
            // ArrayBuffer转16进度字符串示例
            let dataView = new DataView(res.value);
            console.log("原始数据", dataView)
            let dataHexStr = '';
            for (let i = 0; i < dataView.byteLength; i++) {
                dataHexStr += String.fromCharCode(dataView.getUint8(i));
                console.log(i, String.fromCharCode(dataView.getUint8(i)));
            }
            console.log('接收到的数据（16进制）：' + dataHexStr);

            // 转换为10进制
            let decimal = parseInt(dataHexStr, 16);
            console.log('接收到的数据（10进制）：' + decimal);
            that.setData({
                progressValue: decimal,
                fitnessValue: decimal
            });
        });
        // 意外断开连接
        wx.onBLEConnectionStateChange(function (res) {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
            // 关闭蓝牙模块，使其进入未初始化状态
            if (res.connected === false) {
                wx.closeBluetoothAdapter({
                    success: (res) => {
                        console.log('关闭蓝牙模块成功', res);
                    }, fail: (err) => {
                        console.log('关闭蓝牙模块失败', err);
                    }
                });
                wx.showModal({
                    title: '提示', content: '这是一个模态弹窗', success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        });
    }, onUnload: function () {
        // 取消监听低功耗蓝牙设备的特征值变化
        wx.offBLECharacteristicValueChange();

        // 关闭蓝牙模块，使其进入未初始化状态
        wx.closeBluetoothAdapter({
            success: (res) => {
                console.log('关闭蓝牙模块成功', res);
            }, fail: (err) => {
                console.log('关闭蓝牙模块失败', err);
            }
        });
        wx.hideLoading();
    }, startBluetoothDevicesDiscovery: function () {
        wx.startBluetoothDevicesDiscovery({
            services: [], success: (res) => {
                console.log('开始搜索附近的蓝牙外围设备', res);
                // 搜索到新设备的事件的回调
                wx.onBluetoothDeviceFound((device) => {
                    device.devices.forEach((dev) => {
                        console.log('找到蓝牙设备', dev.name, dev.deviceId);
                    });
                    if (device.devices.some(dev => dev.name === 'Sports')) {
                        // 找到 "Sports" 设备后停止搜索
                        wx.stopBluetoothDevicesDiscovery();
                        // 尝试连接设备
                        wx.createBLEConnection({
                            deviceId: device.devices.find(dev => dev.name === 'Sports').deviceId, success: (res) => {
                                console.log('连接成功', res);
                                // 连接成功后关闭加载框
                                wx.hideLoading();

                                // 获取设备的服务UUIDs
                                wx.getBLEDeviceServices({
                                    deviceId: device.devices.find(dev => dev.name === 'Sports').deviceId,
                                    success: (res) => {
                                        console.log('设备服务', res.services);

                                        // 找到 UUID 为 0xFFE0 的服务
                                        let service = res.services.find(service => service.uuid === '0000FFE0-0000-1000-8000-00805F9B34FB');
                                        if (!service) {
                                            console.log('没有找到 UUID 为 0xFFE0 的服务');
                                            return;
                                        }

                                        // 获取设备的特征值
                                        wx.getBLEDeviceCharacteristics({
                                            deviceId: device.devices.find(dev => dev.name === 'Sports').deviceId,
                                            serviceId: service.uuid,
                                            success: (res) => {
                                                console.log('设备特征值', res.characteristics);

                                                // 找到 UUID 为 0xFFE1 的特征值
                                                let characteristic = res.characteristics.find(characteristic => characteristic.uuid === '0000FFE1-0000-1000-8000-00805F9B34FB');
                                                if (!characteristic) {
                                                    console.log('没有找到 UUID 为 0xFFE1 的特征值');
                                                    return;
                                                }

                                                // 启用低功耗蓝牙设备特征值变化时的 notify 功能
                                                wx.notifyBLECharacteristicValueChange({
                                                    state: true, // 启用 notify 功能
                                                    deviceId: device.devices.find(dev => dev.name === 'Sports').deviceId,
                                                    serviceId: service.uuid,
                                                    characteristicId: characteristic.uuid,
                                                    success: function (res) {
                                                        console.log('启用notify成功', res);
                                                    },
                                                    fail: function (err) {
                                                        console.log('启用notify失败', err);
                                                    }
                                                });
                                            },
                                            fail: (err) => {
                                                console.log('获取设备特征值失败', err);
                                            }
                                        });
                                    },
                                    fail: (err) => {
                                        console.log('获取设备服务失败', err);
                                    }
                                });
                            }, fail: (err) => {
                                console.log('连接失败', err);
                                // 连接失败后关闭加载框
                                wx.hideLoading();
                            }
                        });
                    }
                });
            }, fail: (err) => {
                console.log('蓝牙搜索失败', err);
                // 搜索失败后关闭加载框
                wx.hideLoading();
            }
        });
    },

    // 其他的方法和数据...
});