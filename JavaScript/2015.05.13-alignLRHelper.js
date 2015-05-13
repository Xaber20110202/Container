(function (win, X) {
    /* @note    用于浮动的定位
                container 一般为window
                fixbar 浮动条
                locate 接受两种参数 'left' 'right'
                wrapperW 中间居中的区域的宽度
                reserveW 浮动条与中间区域留白的宽度
                fixbarW 浮动条的宽度 如果不传递 直接获取
     * @author  Xaber
     */
    var lrHelper = function (container, fixbar, locate, wrapperW, reserveW, fixbarW) {
        var $container = null,
            $fixbar = null;

        if(!fixbar || !container) {
            return;
        }

        $fixbar = $(fixbar);
        $container = $(container);
        
        return function (event) {

            var fixbarW = fixbarW || $fixbar.width(),
                containerW = $container.width(),
                reserveW = reserveW || 0;

            // 最外层宽度 - 中间区域宽度 / 2 --> 两侧单边剩余宽度
            // 单边剩余宽度 - fixbarW - reserveW --> 如果有剩余 就是可以设置的left/right
            var dValue = Math.round((containerW - wrapperW) / 2) - fixbarW - reserveW;

            $fixbar.css(locate, dValue > 0 ? dValue : 0);
        };
    };

    X.help = X.help || {};
    X.help.align = X.help.align || {};
    X.help.align.lrHelper = lrHelper;

})(window, window.X || (window.X = {}));