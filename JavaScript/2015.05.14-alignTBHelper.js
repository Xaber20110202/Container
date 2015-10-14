(function (win, X) {
    /* @note    用于浮动的定位 悬停效果
                container 一般为window
                fixbar 浮动条
                locate 接受两种参数 'top' 'bottom'
                target 顶部/底部的位置  (到达这个位置开始悬停)
                reserve 顶部/底部的距离 （悬停时候 到顶部/底部的距离）
                fixbarH 浮动条的高度 如果不传递 直接获取
     * @author  Xaber
     */
    var tbHelper = function (container, fixbar, locate, target, reserve, fixbarH) {
        var $container = null,
            $fixbar = null;

        if(!fixbar || !container) {
            return;
        }

        $fixbar = $(fixbar);
        $container = $(container);
        
        return function (event) {
            target = target || 0;
            reserve = reserve || 0;
            fixbarH = fixbarH === void 0 ? $fixbar.height() : 0;

            var scrollTop = $container.scrollTop(),
                dValue = 0;

            if (locate === 'top') {
                dValue = scrollTop - target;
                $fixbar.css(locate, dValue < reserve ? reserve - dValue : reserve);
            } else {
                var distanceBottom = $('body').height() - $container.scrollTop() - $container.height(); // 距离底部
                $fixbar.css(locate, distanceBottom + reserve < target ? target - distanceBottom : reserve);
            }
           
        };
    };

    X.help = X.help || {};
    X.help.align = X.help.align || {};
    X.help.align.tbHelper = tbHelper;

})(window, window.X || (window.X = {}));