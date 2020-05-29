const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: true,
        userInfo:null
    }
}

VM.init = function() {
    Req.request('getUserInfo',null , {
        method: 'get'
    }, (res) => {
        this.setData({
            userInfo:res.data
        })
    })
}

VM.onLoad = function(query) {
    this.init()
    Base.onLoad(this)
}

// 弹窗点击事件
VM.confirmHandle = function() {
    console.log('点击弹窗确定')
    this.setData({
        showMask: false
    })
}

VM.cancelHandle = function() {
    console.log('点击弹窗取消')
    this.setData({
        showMask: false
    })
}

Page(VM)
