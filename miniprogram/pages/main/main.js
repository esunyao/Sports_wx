Page({
    data: {
        markers: [{
            id: 0,
            iconPath: '/miniprogram/resource/a.png',
            latitude: 22.561619212937828,
            longitude: 113.86294563308716,
            width: 50,
            height: 50
        }], controls: [{
            id: 1, iconPath: '/miniprogram/resource/a.png', position: {
                left: 0, top: 300 - 50, width: 50, height: 50
            }, clickable: true
        }], latitude: '', // 新增的数据���
        longitude: '', // 新增的数据项
        showOverlay: false,
    }, onLoad: function (options) {
        var that = this;
        wx.getLocation({
            type: 'wgs84', success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({
                    latitude: latitude, longitude: longitude
                })
            }
        })
    }, controltap(e) {
        console.log(e.controlId)
    }, handleScanCode: function () {
        wx.scanCode({
            success: (res) => {
                let url = res.result;
                let protocol = url.match(/(https?):\/\//)[1];
                let host = url.match(/:\/\/(.[^:/]+)/)[1];
                let port = url.match(/:(\d+)/)[1];
                let path = url.match(/[^:](\/.*\?)/)[1];
                let id = url.match(/id=([^&]*)/)[1];
                if (protocol === 'https' && host === 'sports.erpsu.com.cn' && port === '443' && path === '/sports.erpsu.com.cn:443/api/v1/wx?') {
                    wx.navigateTo({
                        url: '/pages/device/device?id=' + id
                    });
                } else {
                    wx.showToast({
                        title: '请扫描设备二维码', icon: 'error', duration: 2000
                    })
                    this.setData({
                        showOverlay: true, scanButtonText: '重新扫码'
                    });
                    console.info("Invalid URL: " + res.result);
                }
            }
        })
    }, resetScanCode: function () {
        this.setData({
            showOverlay: false,
        });
    }
});