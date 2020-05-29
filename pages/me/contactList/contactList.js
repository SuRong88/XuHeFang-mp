const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        type: '',
        list: [],
        showMask: false,
        deleteIndex: -1
    }
}

VM.init = function(query) {
    if (query && query.type && query.type == 'select') {
        this.setData({
            type: query.type
        })
    }
    Req.request('getContactList', null, {
        method: 'get'
    }, (res) => {
        this.setData({
            list: res.data
        })
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// 
VM.showMask = function(e) {
    let deleteIndex = Util.dataset(e, 'index')
    this.setData({
        deleteIndex: deleteIndex,
        showMask: true
    })
}

VM.confirmDelete = function() {
    let list = this.data.list
    let deleteIndex = this.data.deleteIndex
    let id = list[deleteIndex].id
    Req.request('deleteContact', {
        id: id
    }, {
        method: 'delete'
    }, (res) => {
        list.splice(deleteIndex, 1)
        this.setData({
            list: list,
            deleteIndex: -1,
            showMask: false
        })
        Util.Toast('已成功删除')
    })
}

VM.cancelDelete = function() {
    this.setData({
        deleteIndex: -1,
        showMask: false
    })
}

// 设置默认
VM.setDefault = function(e) {
    let index = Util.dataset(e, 'index')
    let list = this.data.list
    let {
        id,
        name,
        phone,
        is_default
    } = list[index]
    if (list[index].is_default == 1) {
        return
    }
    list.forEach(item => {
        item.is_default = 0
    })
    Req.request('editContact', {
        id: id,
        name: name,
        phone: phone,
        is_default: 1
    }, {
        method: 'put'
    }, (res) => {
        Util.Toast('设置成功')
        list[index].is_default = 1
        this.setData({
            list: list
        })
    })
}

VM.selectContact = function(e) {
    if (this.data.type != 'select') {
        return
    }
    let index = Util.dataset(e, 'index')
    let list = this.data.list
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
        contactInfo: list[index]
    })
    wx.navigateBack({
        delta: 1
    })
}
Page(VM)
