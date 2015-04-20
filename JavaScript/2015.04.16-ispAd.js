(function(window, $, X){

    X.help = X.help || {};

    /*
     * @note    简陋的运营商广告过滤
     *          代码的配置其实几乎等于写死不可配置了 下面的参数只是拿来扯蛋的
     * @param   option.srcFilterTags 需要处理的标签数组
     *          option.domainWhiteList 白名单数组
     *          option.searchTimes 低级浏览器初始化时候需要循环搜索的次数
     *          option.TIMER_SET 低级浏览器每一次搜索间隔毫秒数
     *          option.protocals 需要处理的链接的协议名
     * @rely    jQuery
     */
    X.help.ispAd = function (option) {

        // isp_ad.js come from by zilong.feng for h5
        // modifed by Xaber for PC
        var srcFilterTags = $.isArray(option.srcFilterTags) ? option.srcFilterTags : ['iframe'],
            domainWhiteList = $.isArray(option.domainWhiteList) ? option.domainWhiteList : ['beibei.com', 'live800.com', 'kuaidi100.com', 'open.qzone.qq.com'],
            domainWhiteListReg = null,
            whitelistReg = null,
            searchTimes = option.searchTimes || 30, // 执行30次
            TIMER_SET = option.TIMER_SET || 500, // 每一次间隔500ms 总共15s
            protocals = $.isArray(option.protocals) ? option.protocals : ['http'];

        // 白名单列表
        // /^(http):\/\/[\w-\.]*?(beibei.com|live800.com|kuaidi100.com|open.qzone.qq.com)/
        domainWhiteListReg = new RegExp('^(' + protocals.join('|') + ')://[\\w-\\.]*?' + '(' + domainWhiteList.join('|') + ')');
        whitelistReg = domainWhiteListReg;

        var inWhileList = function(src){
            return whitelistReg.test(src);
        };

        // 一般情况下 iframe src 为空时 最后获取的src 就是当前页面链接
        // 因此添加 src === window.location.href 检测
        var isEmpty = function (src) {
            return src === '' || src === window.location.href;
        };

        // 不是一个链接  用于处理 ueditor 等 iframe src 是一个脚本或者about:blank;
        var isLink = function (src) {
            return src.search('http://') === 0;
        };

        // PC 端额外检测 用于 处理 src为空 id为ads 开头的iframe 以及其父元素的div
        var applyCheckForId = function (dom) {
            var domId = $(dom).attr('id');
            return !!domId && domId.search('ads') === 0;
        };

        var needFilter = function (dom) {
            var src = dom.src;

            // for test
            // console.log(dom, isEmpty(src), applyCheckForId(dom), isLink(src),  inWhileList(src));

            // src为空（当前链接） 但是 id是 adsxxxx （判断需要在前面）
            // 或者 是链接并且不在白名单
            return ( isEmpty(src) && applyCheckForId(dom) ) || ( isLink(src) && !inWhileList(src) );
        };

        var sendLog = function(src, referer){
            $.ajax({
                url: 'http://b.husor.cn/click.html?log=framekiller&src=' + encodeURIComponent(src) + '|pc|' + encodeURIComponent(referer),
                dataType: 'jsonp'
            });
        };

        // 过滤的具体处理
        var processFilter = function (dom) {
            var $dom = $(dom),
                temp = dom.parentNode;

            // 先循环判断处理父级节点
            while(temp && temp !== document.body) {
                if (applyCheckForId(temp)) {
                    $(temp).remove();
                    sendLog(dom.src, location.href);
                    dom = null;
                }

                // for test
                // console.log('aaa', temp, temp !== document.body, applyCheckForId(temp));
                temp = temp.parentNode;
            }

            // 上级节点没有需要过滤的  判断当前dom是否需要过滤
            if(dom && needFilter(dom)){

                $dom.remove();
                sendLog(dom.src, location.href);
            }
        };

        // 初始化时 或者 低级浏览器的执行函数
        var normalProcess = function () {
            $(srcFilterTags.join(',')).each(function (key, dom) {
                processFilter(dom);
            });
        };

        // 以下几种对BCMain对象的处理 是针对特殊一个地区的广告的
        var adBlockForBCMain = function () {
            if (Object.defineProperty && window.BCMain) {
                Object.defineProperty(window, 'BCMain', {
                    value: function(){},
                    configurable: false
                });
            }

            // html5 设置属性 并且更改无效
            if (Object.defineProperties && window.BCMain) {
                Object.defineProperties(window.BCMain, {
                    '_js': {
                        value: '127.0.0.1',
                        configurable: false
                    },
                    '_redirect': {
                        value: '127.0.0.1',
                        configurable: false
                    },
                    '_ads': {
                        value: '127.0.0.1',
                        configurable: false
                    },
                    '_cms': {
                        value: '127.0.0.1',
                        configurable: false
                    },
                    '_third_req': {
                        value: '127.0.0.1',
                        configurable: false
                    },
                    'show': {
                        value: function(){},
                        configurable: false
                    },
                    'third_req': {
                        value: function(){},
                        configurable: false
                    },
                    'ready': {
                        value: function(){},
                        configurable: false
                    }
                });
            }

            // ES5 Object.freeze
            if(typeof Object.freeze !== 'undefined' && window.BCMain){
                Object.freeze(window.BCMain);
            } else {
                window.BCMain = null;
            }
        };
        
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
            observeMutationSupport = !!MutationObserver;

        // html5 MutationObserver 监测 dom 变化
        // ie11 chrome 等才支持
        if(observeMutationSupport){

            var mutationHandler = function(records){
                $.each(records, function(key, record){
                    $.each(record.addedNodes, function(key, addedNode){
                        $.each(srcFilterTags, function(key, tagName){
                            if(addedNode.tagName === tagName.toUpperCase()){
                                processFilter(addedNode);
                            }
                        });

                        var $addedNode = $(addedNode),
                            child = $addedNode.length ? $addedNode.find(srcFilterTags.join(',')) : null;
                        
                        // $('body').append('<iframe id="ads2323" src=""></iframe>') 处理iframe成功
                        // $('body').append('<div id="ads23"><iframe id="ads2323" src=""></iframe></div>') 处理iframe失败
                        // html5 MutationObserver dom监测只支持根元素 不会追踪到子孙元素
                        // 因此高级版本浏览器的这部分处理还需要添加对应的子孙元素查询处理
                        if (child && child.length) {
                            child.each(function () {
                                processFilter(this);
                            });
                        }
                    });
                });
            };

            var observer = new MutationObserver(mutationHandler);

            observer.observe(document.body, {
                'childList': true,
                'subtree': true
            });

            setTimeout(function () {
                observer.disconnect();
            }, searchTimes * TIMER_SET);

        // 低版本IE 或者其他不支持 MutationObserver 的浏览器 利用 js 定时查找 设置searchTimes次的 查找
        } else {
            
            var lowerBrowserTimeout = function () {
                if (searchTimes--) {
                    normalProcess();
                    setTimeout(lowerBrowserTimeout, TIMER_SET);
                }
            };

            setTimeout(lowerBrowserTimeout, TIMER_SET);
        }

        // 初始化执行一次 用于运营商劫持直接在dom中放置iframe
        normalProcess();

        // BCMain的特殊处理
        adBlockForBCMain();
    };

})(window, $, _, window.X || (window.X = {}));

// for test  包裹在dom ready 之后再执行
// $(function () {
//     X.custom.ispAd();
// });
// $('body').append('<iframe id="ads2323" src=""><div id="ads23"><iframe id="ads2323" src=""></iframe></div>')