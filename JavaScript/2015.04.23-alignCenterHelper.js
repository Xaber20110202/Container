(function (win, X) {

    var getTarget = function (containersize, domsize) {
        var target = Math.round((containersize - domsize) / 2);
        return target < 0 ? 0 : target;
    };

    /* @note    用于绝对／固定定位的元素水品垂直居中 主要用于弹窗居中的场景
     * @author  Xaber
     */
    var centerHelper = function (container, dom, width, height) {
        var $container = null,
            $dom = null,
            containerH = 0,
            containerW = 0;

        if(!dom || !container) {
            return;
        }

        $dom = $(dom);
        $container = $(container);
        
        return function (event) {

            width = width || $dom.width();
            height = height || $dom.height();

            containerH = $container.height();
            containerW = $container.width();

            $dom.css('left', getTarget(containerW, width));
            $dom.css('top', getTarget(containerH, height));
        };
    };

    X.help = X.help || {};
    X.help.align = X.help.align || {};

    X.help.align.getTarget = getTarget;
    X.help.align.centerHelper = centerHelper;

})(window, window.X || (window.X = {}));