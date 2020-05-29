const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {}
}

VM.init = function(query) {

}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// 用户授权
VM.getUserInfo = function(e) {
    //用户允许授权
    if (e.detail.userInfo) {
        console.log('允许授权');
        app.userLogin(this.userLogin)
    } else { //用户取消授权
        console.log('拒绝授权');
        Util.showModal('提示', '请授权使用该小程序', false, '', '知道了');
    }
}

// 用户登录
VM.userLogin = function(code, iv, encryptedData) {
    console.log(code);
    console.log(iv);
    console.log(encryptedData);
    Req.request('login', {
        code,
        iv,
        encryptedData
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        Util.successToast('登录成功')
        app.globalData.isLogined = true
        wx.setStorageSync('token', res.data)
        let url = wx.getStorageSync('url')
        setTimeout(() => {
            wx.removeStorageSync('url')
            if (url) {
                wx.redirectTo({
                    url: url
                })
            } else {
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            }
        }, 1500)
    }, err => {
        return util.Toast(err.data.msg || '登录失败，请重试')
    })
}
Page(VM)
