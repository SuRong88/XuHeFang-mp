const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        list: [{
                id: 1,
                name: '名字1',
                phone: '15015050141'
            },
            {
                id: 2,
                name: '名字2',
                phone: '15015050142'
            },
            {
                id: 3,
                name: '名字3',
                phone: '15015050143'
            },
            {
                id: 4,
                name: '名字4',
                phone: '15015050144'
            }
        ],
        showMask: false,
        deleteIndex: -1
    }
}

VM.init = function(query) {}

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
    // todo

    let list = this.data.list
    let deleteIndex = this.data.deleteIndex
    list.splice(deleteIndex, 1)
    this.setData({
        list: list,
        deleteIndex: -1,
        showMask: false
    })
    Util.Toast('已成功删除')
}

VM.cancelDelete = function() {
    this.setData({
        deleteIndex: -1,
        showMask: false
    })
}

Page(VM)
