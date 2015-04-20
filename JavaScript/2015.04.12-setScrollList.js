// @todo 更全面的封装实现
//       更好的函数命名
! function (X) {

    /*
     * @note    列表向上滚动的小函数
     * @rely    jQuery
     * @param   selector jQuery 选择器 或者任意经jQuery可以转成jQuery dom对象的元素
     *          time 定时滚动的时间
     *          direction 方向 'top' 'bottom' 'left' 'right' 分别是向上 向下 向左 向右滚动
     * @author  Xaber
     */
    var setScrollList = function (selecter, time, direction) {
        var $lis = null,
            $obj = $(selecter),
            count = 0,
            i = 0,
            sizeType = (direction === 'top' || direction === 'bottom') ? 'height' : 'width',
            liSize,
            timerFunc;

        if (!$obj || !$obj.length || !( count = ( $lis = $obj.find('li') ).length ) ) {
            return;
        }

        time = time || 2000;
        liSize = $lis.eq(0)[sizeType]();

        timerFunc = function() {
            var option = {};

            if (i === count) {
                $awardList.css(direction, 0);
                i = 1;

            } else {
                i += 1;
            }

            option[direction] = i * -liSize;

            $awardList.animate(option);

            setTimeout(timerFunc, time);

        };

        $obj.append( $obj.html() );
        timerFunc();
    };

    X.help = X.help || {};
    X.help.setScrollList = setScrollList;

}( window.X ? window.X : (window.X = {}) );