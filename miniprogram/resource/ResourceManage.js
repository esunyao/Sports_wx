class ImageResourceManager {
    constructor() {
        this.imageMap = {
            'cn.esuny.main.Title': '../../resource/MainPageTitle.png',
            // 添加其他图片资源
            // 'cn.esuny.other.Image': '../../resource/OtherImage.png',
        };
    }

    getImagePath(key) {
        return this.imageMap[key];
    }
}
module.exports = ImageResourceManager;