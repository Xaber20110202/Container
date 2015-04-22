(function (win, X) {

    /* @note    用于绝对／固定定位的元素水品垂直居中 主要用于弹窗居中的场景
     * @author  Xaber
     */
    var alignCenterHelper = function (contaner, dom, width, height) {
        var $contaner = null,
            $contaner = null,
            contanerH = 0,
            contanerW = 0;

        return function (event) {

            var getTarget = function (contanersize, domsize) {
                var target = Math.round((contanerW - width) / 2);
                return target < 0 ? -target : target;
            };

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
    X.help.alignCenterHelper = alignCenterHelper;

})(window, window.X || (window.X = {}));