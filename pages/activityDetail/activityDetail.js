const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const WxParse = require('../../wxParse/wxParse');

const VM = {
    data: {
        id: '',
        showSelected: false,
        activityInfo: null,
        siteId: '',
        siteCheckedId: '',
        rankId: '',
        rankCheckedId: '',
        siteList: [], // 场次类型
        rankList: [], // 等级类型
        totalAmount: 0, //总价格
        buyLimit: 0, //数量限制
        price: 0, //单价
        priceMember: 0, //会员价
        stock: 0, //库存
        buyNum: 0, //购买数量
        vip: false
    }
}

VM.init = function(query) {
    let id = query.id
    if (!id) {
        Util.Toast('缺少必要参数')
        setTimeout(() => {
            wx.navigateBack({delta:1})
        }, 1500)
    }
    this.setData({
        id: id
    })
    Req.request('getActivityDetail', {
        id: id
    }, {
        method: 'get'
    }, (res) => {
        console.log(res.data);
        let activityInfo = res.data
        activityInfo.start_date = activityInfo.start_date.substr(0, 11)
        activityInfo.end_date = activityInfo.end_date.substr(0, 11)
        WxParse.wxParse('introduce', 'html', activityInfo.introduce, this, 5);
        this.setData({
            activityInfo: activityInfo
        })
    }, (err) => {
        Util.showModal('提示', err.msg || '系统出错', false, '', '确定', () => {
            wx.navigateBack({delta:1})
        })
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// 收藏
VM.toggleCollect = function() {
    let id = this.data.id
    let isCollected = this.data.activityInfo.is_collect
    Req.request('addCollect', {
        goods_id: id
    }, {
        method: isCollected ? 'delete' : 'post'
    }, (res) => {
        Util.Toast('操作成功')
        this.setData({
            ['activityInfo.is_collect']: (isCollected ? 0 : 1)
        })
    })
}

VM.showSelect = function() {
    let status = this.data.activityInfo.activity_status
    if (status == 1) {
        return Util.Toast('活动未开始，请浏览其他活动')
    } else if (status == 3) {
        return Util.Toast('活动已结束，请浏览其他活动')
    }
    // status==2
    this.setData({
        showSelected: !this.data.showSelected
    })
    if (this.data.siteId) {
        return
    }
    Req.request('getActivityType', {
        id: this.data.id,
        spec_id: ''
    }, {
        method: 'get'
    }, (res) => {
        console.log(res.data);
        let inf = res.data
        let siteList = inf.spec_list[0].childspec
        let rankList = inf.spec_list[1].childspec
        siteList.forEach(item => {
            item.checked = false
        })
        rankList.forEach(item => {
            item.checked = false
        })
        this.setData({
            siteId: inf.spec_list[0].id,
            rankId: inf.spec_list[1].id,
            siteList: siteList,
            rankList: rankList,
            vip: inf.price.root == 1 ? false : true
        })
    })
}

VM.hideSelect = function() {
    this.setData({
        showSelected: !this.data.showSelected
    })
}

VM.reduceNum = function() {
    if (this.data.siteCheckedId == '') {
        return Util.Toast('请选择场次时间')
    }
    if (this.data.rankCheckedId == '') {
        return Util.Toast('请选择购票等级')
    }
    let buyNum = this.data.buyNum
    if (buyNum == 0) {
        return
    }
    buyNum -= 1
    this.setData({
        buyNum
    })
}

VM.addNum = function() {
    if (this.data.siteCheckedId == '') {
        return Util.Toast('请选择场次时间')
    }
    if (this.data.rankCheckedId == '') {
        return Util.Toast('请选择购票等级')
    }
    let buyNum = this.data.buyNum
    // 不限购
    if (this.data.buyLimit == 0) {
        if (buyNum >= this.data.stock) {
            return
        }
    } else { //限购
        if (buyNum >= this.data.buyLimit) {
            return
        }
    }
    buyNum += 1
    this.setData({
        buyNum
    })
}

// 选择场次
VM.selectSite = function(e) {
    let index = Util.dataset(e, 'index')
    let siteList = this.data.siteList
    if (this.data.siteCheckedId == siteList[index].id) {
        return
    }
    siteList.forEach(item => {
        item.checked = false
    })
    siteList[index].checked = true
    this.setData({
        siteList: siteList,
        siteCheckedId: siteList[index].id,
        rankCheckedId: '',
        buyLimit: 0,
        price: 0,
        priceMember: 0,
        stock: 0,
        buyNum: 0
    })
    let specObj = {
        [this.data.siteId]: this.data.siteCheckedId
    }
    console.log(specObj);
    Req.request('getActivityType', {
        id: this.data.id,
        spec_id: JSON.stringify(specObj)
    }, {
        method: 'get'
    }, (res) => {
        console.log(res.data);
        let inf = res.data
        let rankList = inf.spec_list[1].childspec
        rankList.forEach(item => {
            item.checked = false
        })
        this.setData({
            rankList: rankList
        })
    })
}

// 选择等级
VM.selectRank = function(e) {
    if (this.data.siteCheckedId === '') {
        return Util.Toast('请先选择场次时间')
    }
    let index = Util.dataset(e, 'index')
    let rankList = this.data.rankList
    // 售罄
    if (!rankList[index].valid) {
        return
    }
    // 点击同一个
    if (this.data.rankCheckedId == rankList[index].id) {
        return
    }
    rankList.forEach(item => {
        item.checked = false
    })
    rankList[index].checked = true
    this.setData({
        rankList: rankList,
        rankCheckedId: rankList[index].id,
        buyLimit: 0,
        price: 0,
        priceMember: 0,
        stock: 0,
        buyNum: 0
    })
    let specObj = {
        [this.data.siteId]: this.data.siteCheckedId,
        [this.data.rankId]: this.data.rankCheckedId
    }
    console.log(specObj);
    Req.request('getActivityType', {
        id: this.data.id,
        spec_id: JSON.stringify(specObj)
    }, {
        method: 'get'
    }, (res) => {
        console.log(res.data);
        let inf = res.data
        let priceData = inf.price
        // 限购大于剩余  限购变为剩余
        if (priceData.buy_limit != 0 && priceData.buy_limit > priceData.stock) {
            priceData.buy_limit = priceData.stock
        }
        this.setData({
            buyLimit: priceData.buy_limit,
            price: priceData.price,
            priceMember: priceData.price_member,
            stock: priceData.stock
        })
    })
}

// 提交订单
VM.submitOrder = function() {
    let {
        id,
        siteId,
        rankId,
        siteCheckedId,
        rankCheckedId,
        buyNum
    } = this.data
    if (!siteCheckedId) {
        return Util.Toast('请选择场次时间')
    }
    if (!rankCheckedId) {
        return Util.Toast('请选择购票等级')
    }
    if (buyNum == 0) {
        return Util.Toast('请选择购买数量')
    }
    let orderParams = [{
        goods_id: id,
        num: buyNum,
        spec_id: {
            [siteId]: siteCheckedId,
            [rankId]: rankCheckedId
        }
    }]
    console.log('下单信息', orderParams)
    wx.redirectTo({
        url: '/pages/confirmOrder/confirmOrder?orderParams=' + JSON.stringify(orderParams)
    })
}
Page(VM)
