const app = getApp();
const Util = require('./util.js')
const HOST = 'http://xcx19.mrxdtech.com/api/';
let Request = null;
// 接口
const OPTIONS = {
    /* 
     *活动模块
     * */
    // 活动列表
    getActivityList: {
        url: `${HOST}/activity`,
    },
    // 活动详情
    getActivityDetail: {
        url: `${HOST}/activity`,
    },
    // 活动规格
    getActivityType: {
        url: `${HOST}/activity/stock`,
    },
    // 收藏列表
    getCollectList: {
        url: `${HOST}/user/collect`,
    },
    // 添加收藏
    addCollect: {
        url: `${HOST}/user/collect`,
    },
    // 删除收藏
    deleteCollect: {
        url: `${HOST}/user/collect`,
    },
    /*
     *用户模块
     * */
    // 用户信息
    getUserInfo: {
        url: `${HOST}/user`,
    },
    // 联系人列表
    getContactList: {
        url: `${HOST}/user/contact`,
    },
    // 获取默认联系人地址
    getDefaultContact: {
        url: `${HOST}/user/contact`,
    },
    // 获取指定联系人地址
    getSpecificContact: {
        url: `${HOST}/user/contact`,
    },
    // 添加联系人
    addContact: {
        url: `${HOST}/user/contact`,
    },
    // 修改联系人
    editContact: {
        url: `${HOST}/user/contact`,
    },
    // 删除联系人
    deleteContact: {
        url: `${HOST}/user/contact`,
    },
    // 登录
    login: {
        url: `${HOST}/wx/xcxtoken`,
    },
    // 修改用户信息
    editUserInfo: {
        url: `${HOST}/user`,
    },
    /*
     *订单模块
     * */
    // 确认订单之前
    beforeConfirmOrder: {
        url: `${HOST}/order/pre`,
    },
    // 确认订单
    confirmOrder: {
        url: `${HOST}/order`,
    },
    // 取消订单
    cancelOrder: {
        url: `${HOST}/order/cancel`,
    },
    // 支付订单
    payOrder: {
        url: `${HOST}/order/pay`,
    },
    // 订单列表
    getOrderList: {
        url: `${HOST}/order`,
    },
    // 订单详情
    getOrderDetail: {
        url: `${HOST}/order`,
    },
    // 删除订单
    deleteOrder: {
        url: `${HOST}/order`,
    },
    /*
     *公共模块
     * */
    // 首页轮播
    getBannerList: {
        url: `${HOST}/common/banner`,
    },
    // 联系客服信息
    getServiceInfo: {
        url: `${HOST}/common/webInfo`,
    },
}
// 状态码处理
function codeCheck(data, success, fail) {
    let code = parseInt(data.code)
    switch (code) {
        case 0: //成功
            success && success(data);
            break;
        case 50001:
            Util.showModal('提示', data.msg, false, '', '确定', () => {
                wx.reLaunch({
                    url: '/pages/login/login'
                })
            })
            break;
        case 50003: //token过期
            Util.showModal('提示', '登录信息已过期,请重新登录', false, '', '确定', () => {
                wx.removeStorageSync('token')
                wx.reLaunch({
                    url: '/pages/login/login'
                })
                // getApp().checkAuthorize(() => {
                //     getApp().userLogin((res) => {
                //         wx.reLaunch({
                //             url: '/pages/login/login'
                //         })
                //     })
                // }, () => {
                //     // todo
                // })
            })
            break;
        default:
            if (fail) {
                fail(data)
            } else {
                Util.showModal('提示', data.msg || '系统出错', false, '', '确定')
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
