const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 任务状态
        status: 0,
        index: -1, //操作订单下标
        showCancel: false,
        showDelete: false,
        // pagination
        list: [],
        current: 0,
        rownum: 10,
        totalPage: 1,
        total: 0,
        isEmpty: false
    }
}

VM.init = function(query) {
    this.setData({
        status: query.status || 0,
        // pagination
        list: [],
        current: 0,
        rownum: 10,
        totalPage: 1,
        total: 0,
        isEmpty: false
    })
    this.getList()
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.onReachBottom = function() {
    this.getList()
}

// tab切换状态
VM.changeStatus = function(e) {
    let status = Util.dataset(e, 'status')

    if (status == this.data.status) {
        return;
    }
    this.setData({
        status: status,
        list: [],
        current: 0,
        rownum: 10,
        totalPage: 1,
        total: 0,
        isEmpty: false
    })
    this.getList()
}

// 获取活动列表
VM.getList = function(status) {
    if (this.data.current >= this.data.totalPage) {
        return Util.Toast('没有更多啦~')
    }
    Req.request('getOrderList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
        status: this.data.status
    }, {
        method: 'get'
    }, (res) => {
        let oldList = this.data.list
        let newList = res.data.list
        let pagination = res.data.pagination
        newList.forEach(item => {
            item.date = item.detail[0].spec_name.substring(0, 10)
            item.time = item.detail[0].spec_name.substring(10)
        })
        this.setData({
            list: oldList.concat(newList),
            current: pagination.page * 1,
            rownum: pagination.rownum * 1,
            total: pagination.total * 1,
            totalPage: pagination.total_page * 1,
            isEmpty: pagination.total * 1 <= 0 ? true : false
        })
    })
}
//取消mask 
VM.showCancelMask = function(e) {
    let index = Util.dataset(e, 'index')
    this.setData({
        index: index,
        showCancel: true
    })
}
// 删除mask
VM.showDeleteMask = function(e) {
    let index = Util.dataset(e, 'index')
    this.setData({
        index: index,
        showDelete: true
    })
}
// 确认“取消订单”
VM.confirmCancel = function() {
    let id = this.data.list[this.data.index].id
    let index = this.data.index
    let tar = `list[${index}].status`
    Req.request('cancelOrder', {
        id: id
    }, {
        method: 'put'
    }, (res) => {
        Util.Toast('取消成功')
        this.setData({
            [tar]: 4,
            index: -1,
            showCancel: false
        })
    })
}

VM.cancelCancel = function() {
    this.setData({
        index: -1,
        showCancel: false
    })
}

// 确认“删除订单”
VM.confirmDelete = function() {
    let list = this.data.list
    let index = this.data.index
    let id = list[index].id
    Req.request('deleteOrder', {
        id: id
    }, {
        method: 'delete'
    }, (res) => {
        list.splice(index, 1)
        Util.Toast('删除成功')
        this.setData({
            list: list,
            index: -1,
            showDelete: false
        })
    })
}

VM.cancelDelete = function() {
    this.setData({
        index: -1,
        showDelete: false
    })
}


Page(VM)
