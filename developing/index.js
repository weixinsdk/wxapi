/**
* 封装微信API
* @ author 李东 lid_ong@sina.com
*/
;(function (g) {
	if ('undefined' != typeof g.wxapi ) { return false;}
    var w = g.wxapi ={
            _inited : false,
            _debug : false,
            _wxConfig:'',
            _version : '0.1.0',
            _config : {
                'title': '分享标题', // 分享标题
                'desc': '分享描述', // 分享描述
                'link': g.location.origin, // 分享链接
                'imgUrl': g.location.origin+'/m/images/logo.png', // 分享图标
                //'type': '', // 分享类型,music、video或link，不填默认为link
                //'dataUrl': '', // 如果type是music或video，则要提供数据链接，默认为空
                'cancel'  : function () {},
                'success' : function () {},
                'trigger' : function () {},
            },
            
    };
    var getConfigUrl = '/weixin/getjsapi.do';// 配置获取signatuer地址
    
    var jsApiList = [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',//隐藏所有非基础按钮接口
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard',
                ];
    w.init = function (config) {
        var me = this;
        if (me._inited) {
            /** 初始化微信API */
            var CF = {
                    debug: me._debug,
                    appId: me._wxConfig.app_id,
                    timestamp: me._wxConfig.timestamp,
                    nonceStr: me._wxConfig.noncestr,
                    signature: me._wxConfig.signature,
                    jsApiList: jsApiList,
            };
            wx.config(CF);
            wx.ready(function () {
                me.alert('准备成功');
            });
            wx.error(function (res) {
                me.alert("err....:"+res.errMsg);
            });
        } else {
            
        }
        me._extend(me._config,config);
        me.setShareAll();
    };
    
    w.sendRequest = function () {
        if (!!this._inited) { return false;}
        var me = this;
        this.ajax.post(getConfigUrl, {url:(window.location.href.split('#')[0])}, function (json) {
        //$.post(getConfigUrl, {:(window.location.href.split('#')[0])}, function (json) {
            if (json.status == 1) {
                me._wxConfig = json.data;
                me._inited = true;
                me.init();
            }
        }, 'json');
        
    };
    /**
     * 将所有得分享都初始化
     * @param config
     */
    w.setShareAll = function (config) {
        // 分享接口
        var me = this ,CF = w._extend(this._config, config);
        CF.trigger = function () {
         // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            me.alert('用户点击发送给朋友');
        };
        CF.success = function (res) {
            me.alert('分享成功~');
        };
        CF.cancel = function (res) {
            me.alert('已取消');
        };
        me.alert(CF);
        wx.ready(function (){
        // 1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        w.shareAPP(CF);
        // 2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        w.shareTime(CF);
        // 3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        w.shareQQ(CF);
        // 4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        w.shareWeibo(CF);
        });
    };
    
    /** 分享给朋友 */
    w.shareAPP = function (config) {
        this._config = this._extend(this._config,config);
        wx.onMenuShareAppMessage(this._config);
    };
    /** 分享到朋友圈 */
    w.shareTime = function (config) {
        this._config = this._extend(this._config,config);
        wx.onMenuShareTimeline(this._config);
    };
    /** 分享到qq */
    w.shareQQ = function (config) {
        this._config = this._extend(this._config,config);
        wx.onMenuShareQQ(this._config);
    };
    /** 分享到微博 */
    w.shareWeibo = function (config) {
        this._config = this._extend(this._config,config);
        wx.onMenuShareWeibo(this._config);
    };
    /** 隐藏所有非基础按钮接口 */
    w.hideAllBaseMenu = function (){
        wx.hideAllNonBaseMenuItem();
    };
    
    /** 显示所有功能按钮接口 */
    w.showAllBaseMenu = function () {
        wx.showAllNonBaseMenuItem();
    };
    
    //wxapi.ajax.post('http://timelineapp.pointstone.org/coreball/game.html?openid=o3OtAuK--ELj5XEt3w22NGpb6Jv8&from=timeline&isappinstalled=0','',function (json){console.log(json)},'html');
    
    /******************************* 工具方法 *********************************/
    w.alert = function () 
    {
        if (!this._dubug) { return false;}
        g.alert(arguments[0]);
    };
    /**
     * 对象简单继承，后面的覆盖前面的
     * @private
     */
    w._extend = function () 
    {
            var result = {}, obj, k;
            for (var i = 0, len = arguments.length; i < len; i++) {
                obj = arguments[i];
                if (typeof obj === 'object') {
                    for (k in obj) {
                        obj[k] && (result[k] = obj[k]);
                    }
                }
            }
            return result;
    };
    
    /******************************* 工具方法 *********************************/
    /******************************* 发起请求函数 *******************************/
    /** 发起请求方案 */
    var ajax = w.ajax = {};
    ajax.request = function () {
        if ( typeof XMLHttpRequest !== 'undefined' ) {
            return new XMLHttpRequest();
        }
        /** 支持不同浏览器 */
        var versions = ['MSXML2.XmlHttp.5.0','MSXML2.XmlHttp.4.0','MSXML2.XmlHttp.3.0','MSXML2.XmlHttp.2.0','Microsoft.XmlHttp',];
        var XHRt;
        
        for (var i=0;i<versions.length;i++) {
            try {
                XHRt = new ActiveXObject(versions[i]);
            } catch (e) {
                
            }
        }
        return XHRt;
    };
    
    ajax.send = function (method,url,data,callback,sync) {
        var request = this.request();
        request.open(method,url,sync);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if ('undefined' != typeof callback ) {
                    if (sync == 'json') {
                        callback(JSON.parse(request.responseText));
                    } else {
                        callback(request.responseText);
                    }
                    
                }
            }
        };
        if (method == 'POST') {
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        request.send(data);
    };
    
    ajax.get = function (url,data,callback,sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key)+'='+encodeURIComponent(data[key]));
        }
        url = (url.indexOf('?') != -1)?(url+'&'):(url+'?');
        this.send('GET',url,query.join('&'),sync);
    };
    
    ajax.post = function (url,data,callback,sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key)+'='+encodeURIComponent(data[key]));
        }
        url = (url.indexOf('?') != -1)?(url+'&'):(url+'?');
        this.send('POST',url,query.join('&'),callback,sync);
    };
    g.wxapi.sendRequest();
})(window);