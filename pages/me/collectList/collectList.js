const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        delBtnWidth: 128,
        list: [],
        startX: "",
    }
}

VM.init = function(query) {
    this.getList()
}

VM.onLoad = function(query) {
    Base.onLoad(this)
}

// 取消收藏
VM.cancelCollect = function(e) {
    let index = Util.dataset(e, 'index')
    let list = this.data.list
    let id = list[index].goods_id
    Req.request('addCollect', {
        goods_id: id
    }, {
        method: 'delete'
    }, (res) => {
        Util.Toast('操作成功')
        list.splice(index, 1)
        this.setData({
            list: list
        })
    })
}

VM.onShow = function() {
    this.init()
}

VM.touchS = function(e) {
    if (e.touches.length == 1) {
        this.setData({
            //设置触摸起始点水平方向位置
            startX: e.touches[0].clientX
        });
    }
}

VM.touchM = function(e) {
    //获取手指触摸的是哪一项
    let index = Util.dataset(e, 'index');
    let list = this.data.list;
    let tar = 'list[' + index + '].txtStyle'
    if (e.touches.length == 1) {
        //手指移动时水平方向位置
        let moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        let disX = this.data.startX - moveX;
        let delBtnWidth = this.data.delBtnWidth;
        let txtStyle = "";
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，向右滑动，文本层位置不变
            txtStyle = "margin-left:0rpx;";
        } else if (disX > 0) { //移动距离大于0，向左滑动,文本层left值等于手指移动距离
            if (list[index].showBtn) {
                return
            }
            txtStyle = "margin-left:" + (-disX) + "rpx";
            if (disX >= delBtnWidth) {
                //控制手指移动距离最大值为删除按钮的宽度
                txtStyle = "margin-left:" + (-delBtnWidth) + "rpx";
            }
        }
        //更新列表的状态
        this.setData({
            [tar]: txtStyle
        });
    }
}

VM.touchE = function(e) {
    if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        let endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        let disX = this.data.startX - endX;
        let delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        let txtStyle = disX > delBtnWidth / 2 ? "margin-left:" + (-delBtnWidth) + "rpx" :
            "margin-left:0rpx;";
        let showBtn = disX > delBtnWidth / 2 ? true : false
        //获取手指触摸的是哪一项
        let index = Util.dataset(e, 'index');
        let list = this.data.list;
        list[index].txtStyle = txtStyle;
        list[index].showBtn = showBtn;
        //更新列表的状态
        this.setData({
            list: list
        });
    }
}

// 获取收藏列表
VM.getList = function() {
    Req.request('getCollectList', null, {
        method: 'get'
    }, (res) => {
        let list = res.data || []
        list.forEach(item => {
            item.startDate = item.start_date.substr(0, 11)
            item.endDate = item.end_date.substr(0, 11)
            item.txtStyle = 'margin-left:0rpx;'
            item.showBtn = false
        })
        this.setData({
            list: list,
        })
    })
}

Page(VM)
