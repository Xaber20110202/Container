// 一个简陋的倒计时辅助函数 
// 原型来源 @zonghuan.chen@rosuh.com.cn
// modified Xaber
(function(win, X) {
    X.lightTimer = ({
        //计时元素数组
        list: [],
        timeout: null,
        format: {
            first: '<i class="iconfont">&#xf006a;</i> 距开抢：<span><em>',
            second: '</em>天</span><span><em>',
            third: '</em>时</span><span><em>',
            forth: '</em>分</span><span><em>',
            fifth: '</em>秒</span>'
        },
        _now: Math.round($.now() / 1000),
        setFormat: function(format) {
            this.format = format;
            return this;
        },
        push: function(ele) {
            this.list.push(ele);
        },
        stop: function() {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
        },
        init: function() {
            var list = this.list,
                that = this;
            var toDouble = function(num) {
                return num.toString().length < 2 ? ('0' + num) : num;
            };
            //获取计时显示的文本
            var getDayStr = function(end, special) {
                end = parseInt(end);
                var _now = that._now;
                var format = that.format;
                var dis = end - _now;
                var dayCount = toDouble(parseInt(dis / (60 * 60 * 24)));
                var hourCount = toDouble(parseInt(dis % (60 * 60 * 24) / (60 * 60)));
                var minuteCount = toDouble(parseInt(dis % (60 * 60) / 60));
                var secondCount = toDouble(parseInt(dis % 60));
                if (dis < 0) {
                    return;
                }
                return format.first + dayCount + format.second + hourCount + format.third + minuteCount + format.forth + secondCount + format.fifth;
            };

            var timerFunc = function() {
                var before = $.now();
                for (var i = 0; i < list.length; i++) {
                    try {
                        list[i].html(getDayStr(list[i].attr('data-end'), {
                            format: 'format'
                        }));
                    } catch (e) {}
                }

                that._now += Math.round(($.now() - before) / 1000) + 1;
                that.timeout = window.setTimeout(timerFunc, 1000);
            };

            that.timeout = window.setTimeout(timerFunc, 1000);
            return this;
        }
    }).init();
})(window, window.X || (window.X = {}));