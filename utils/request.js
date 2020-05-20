const app = getApp();
const Util = require('./util.js')
const HOST = 'https://xcxdemo2.mrxdtech.com/api';
let Request = null;
// 接口
const OPTIONS = {
    // test
    test: {
        url: `${HOST}/test`,
    }
}
// 状态码处理
function codeCheck(data, success, fail) {
    let code = parseInt(data.code)
    switch (code) {
        case 0: //成功
            success && success(data);
            break;
        case 50003: //token过期
            Util.showModal('提示', '登录信息已过期,请重新登录', false, '', '确定', () => {
                getApp().checkAuthorize(() => {
                    getApp().userLogin((res) => {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    })
                }, () => {
                    // todo
                })
            })
            break;
        default:
            if (fail) {
                fail(data)
            } else {
                Util.showModal('提示', data.msg||'系统出错', false, '', '确定')
            }
            break;
    }
}
// 请求方法
/**
 ** key：接口名
 ** data: 参数
 ** option: 配置
 ** success: 成功的回调函数
 ** fail：失败的回调函数
 ** todo: 自定义接口调用成功的状态码判断方法(delete)
 **/
function request(key, data, option, success, fail) {
    Util.showLoading();
    let url = OPTIONS[key].url;
    let method = (option && option.method) || 'GET';
    let dataType = (option && option.dataType) || 'json';
    let responseType = (option && option.responseType) || 'text';
    wx.request({
        url: url,
        data: data,
        method: method,
        dataType: dataType,
        responseType: responseType,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-Token': wx.getStorageSync('token')
        },
        success: function(res) {
            wx.hideLoading();
            codeCheck(res.data, success, fail);
        },
        fail: function(err) {
            wx.hideLoading();
            console.log(err);
        }
    })
}
Request = {
    OPTIONS,
    request
}
module.exports = Request;
