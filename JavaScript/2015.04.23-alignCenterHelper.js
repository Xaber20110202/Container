(function (win, X) {

    var getTarget = function (contanersize, domsize) {
        var target = Math.round((contanersize - domsize) / 2);
        return target < 0 ? -target : target;
    };

    /* @note    用于绝对／固定定位的元素水品垂直居中 主要用于弹窗居中的场景
     * @author  Xaber
     */
    var centerHelper = function (contaner, dom, width, height) {
        var $contaner = null,
            $contaner = null,
            contanerH = 0,
            contanerW = 0;

        return function (event) {

            if(!dom || !contaner) {
                return;
            }

            $dom = $(dom);
            $contaner = $(contaner);

            width = width || $dom.width();
            height = height || $dom.height();

            contanerH = $contaner.height();
            contanerW = $contaner.width();

            $dom.css('left', getTarget(contanerW, width));
            $dom.css('top', getTarget(contanerH, height));
        };
    };

    X.help = X.help || {};
    X.help.align = X.help.align || {};
    
    X.help.align.getTarget = getTarget;
    X.help.align.centerHelper = centerHelper;

})(window, window.X || (window.X = {}));