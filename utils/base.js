/**
 * 通用返回
 */
function returnBack(e) {
    wx.navigateBack({
        delta: 1
    });
};

/**
 * 空函数
 */
function emptyHandle(e) {
    return false
};

/**
 * 公用跳转
 */
var jumpFlag = true

function jump(e) {
    if (!jumpFlag) {
        return false;
    }
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var oldUrl = currentPage.route;
    var newUrl = getApp().dataset(e, 'url');
    var type = getApp().dataset(e, 'type');
    // 1.未登录可跳转页面
    var allowPages = ['/pages/index/index', '/pages/login/login']
    var isLogined = getApp().globalData.isLogined
    var checkIndex = newUrl.indexOf('?')
    var checkUrl = newUrl
    if (checkIndex >= 0) {
        checkUrl = checkUrl.slice(0, checkIndex)
    }
    if (allowPages.indexOf(checkUrl) < 0 && !isLogined) {
        wx.setStorageSync('url', newUrl)
        return wx.navigateTo({
            url: '/pages/login/login'
        })
    }
    // 1.未登录可跳转页面 end
    // 2.跳转
    if (`/${oldUrl}` == newUrl) {
        return false
    }
    jumpFlag = false
    if (type == 'reLaunch') {
        newUrl && wx.reLaunch({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else if (type == 'switchTab') {
        newUrl && wx.switchTab({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else if (type == 'redirect') {
        newUrl && wx.redirectTo({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else {
        newUrl && wx.navigateTo({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    }
}
/**
 * 外联跳转(待测)
 */
function webJump(e) {
    var url = getApp().dataset(e, 'url');
    if (/^http/.test(url)) {
        wx.navigateTo({
            url: '/pages/web/web?url=' + encodeURIComponent(url)
        });
    }
};

/**
 * 通用预览图片
 */
function previewImage(e) {
    var src = e.currentTarget.dataset.src;
    if (!src) return;
    wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
    });
};

/**
 * 设置自定义头部高度
 */
function setHeader(page) {
    wx.getSystemInfo({
        success: res => {
            page.setData({
                headBarHeight: res.statusBarHeight / (res.windowWidth / 750),
                padHeight: res.statusBarHeight / (res.windowWidth / 750) + 88
            })
        }
    })
}

/**
 * 初始化base
 */
function onLoad(page) {
    page.emptyHandle = emptyHandle;
    page.returnBack = returnBack;
    page.base_jump = jump;
    page.base_webJump = webJump;
    page.previewImage = previewImage;
    setHeader(page)
    // 判断当前是否iphoneX 
    var sys = getApp().getSystemInfo(),
        model = sys.model.toLowerCase(),
        is_iphone = /iphone/.test(sys.model.toLowerCase()),
        is_iphonex = /iphone\D*x/.test(model),
        system;
    // 判断系统
    system = is_iphone ? 'ios' : 'android';
    page.setData({
        is_iphonex,
        system,
        isHome: getCurrentPages().length <= 1
    });
}

module.exports = {
    onLoad
};
