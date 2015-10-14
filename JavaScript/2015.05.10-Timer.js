// 暂停 0-0 ！
(function (win, $, X) {
    var Timer = function (option) {
        // 安全的构造函数实例创建
        if (this instanceof Timer) {
            return new Timer(option);
        }

        option = $.extend(option || {}, defaultOption);

        // 设置时间格式 getFormatArr
        // 用于避免每一次倒计时 通过正则replace获得最后的时间
        this.setFormatArr(this.getFormatArr(option.format));
    };

    Timer.prototype = {
        _stack : {},
        formatArr : [],
        create : function () {

        },
        stop : function () {

        },

        // 获取时间格式数组 
        // '{y}年{d}天{h}小时{mm}分钟{ss}秒' --> ["", "年", "天", "小时", "分钟", "秒"]
        getFormatArr : function (format) {
            var reg = /^([\s\S]*?)(?:{y}([\s\S]*?))?(?:{d}([\s\S]*?))?(?:{h}([\s\S]*?))?(?:{mm}([\s\S]*?))?(?:{ss}([\s\S]*?))?$/,
                result = format.match(reg);

            if (result) {
                result.splice(0, 1);
            } else {
                result = [];
            }

            return result;
        },
        setFormatArr : function (format) {
            this.formatArr = this.getFormatArr(format);
        },

        // 获取剩余时间
        getRemainedTimestamp : function (left) {
              
        },
        getTimerStr : function (formatArr) {
            // 字符串的情况 先做一个获取格式数组的处理
            formatArr = $.isString(formatArr) ? this.getFormatArr(formatArr) : formatArr;


        },
        defaultOption : {
            container : null,
            runTime : 1000,
            format : '{y}年{d}天{h}小时{mm}分钟{ss}秒',
            toMoment : 0,
            _now : $.now() // 共用的 用于继承
        }
    };

})(window, jQuery, window.X || (window.X = {}));