// var constants = require('../../constants/core_constant.js');
class ImageResourceManager {
    constructor() {
        this.imageMap = {
            'cn.esuny.main.Title': '../../resource/MainPageTitle.png',
            'cn.esuny.fitness.reset_data_l': '../../resource/reset_data_l.png'
            // "cn.esuny.fitness.shequ01": constants.API_V1_GETRESOURCE + "/shequ01.gif",
            // 添加其他图片资源
            // 'cn.esuny.other.Image': '../../resource/OtherImage.png',
        };
    }

    getImagePath(key) {
        return this.imageMap[key];
    }
}
module.exports = ImageResourceManager;