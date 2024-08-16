Page({
    onLoad: function () {
        // 显示加载框
        wx.showLoading({
            title: '正在连接蓝牙设备...',
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
            let dataHexStr = '';
            for (let i = 0; i < dataView.byteLength; i++) {
                dataHexStr += ('00' + dataView.getUint8(i).toString(16)).slice(-2);
            }
            console.log('接收到的数据：' + dataHexStr);
        });
    },

    startBluetoothDevicesDiscovery: function () {
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