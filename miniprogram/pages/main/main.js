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
        longitude: '' // 新增的数据项
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
                console.log(res);
            }
        })
    }
});