const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        swiperIndex: 0,
        bannerList: [{
                imgUrl: '/images/all/banner01.png'
            },
            {
                imgUrl: '/images/all/banner01.png'
            },
            {
                imgUrl: '/images/all/banner01.png'
            },
            {
                imgUrl: '/images/all/banner01.png'
            },
            {
                imgUrl: '/images/all/banner01.png'
            }
        ]
    }
}

VM.init = function() {}

VM.onLoad = function(query) {
    this.init()
    Base.onLoad(this)
}

// 轮播
VM.changeSwiper = function(e) {
    let current = e.detail.current
    this.setData({
        swiperIndex: current
    })
}

VM.onShareAppMessage = function() {
    return {
        title: "分享标题",
        path: '/pages/index/index',
        imageUrl: ''
    }
}
Page(VM)
