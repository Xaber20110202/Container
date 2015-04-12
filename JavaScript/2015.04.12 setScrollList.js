
! function (X) {

    /*
     * @note    列表向上滚动的小函数
     * @author  Xaber
     */
    var setScrollList = function ($obj, time) {
        var $lis = null,
            count = 0,
            i = 0,
            liHeight,
            timerFunc;

        if (!$obj || !$obj.length || !( count = ( $lis = $obj.find('li') ).length ) ) {
            return;
        }

        time = time || 2000;
        liHeight = $lis.eq(0).height();

        timerFunc = function() {

            if (i === count) {
                $awardList.css('top', 0);
                i = 1;

            } else {
                i += 1;
            }

            $awardList.animate({
                top: i * -liHeight
            });

            setTimeout(timerFunc, time);

        };

        $obj.append( $obj.html() );
        timerFunc();
    };

    if (X.help) {
        X.help.setScrollList = setScrollList;
    
    } else {
        X.help = {
            setScrollList : setScrollList
        };
    }

}( window.X ? window.X : (window.X = {}) );