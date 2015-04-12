/*
 * @note 列表向上滚动的小函数
 * @author Xaber
 */
var initListScroll = function ($obj) {
    var $lis = null,
        count = 0,
        i = 0,
        liHeight,
        timerFunc;

    if (!$obj || !$obj.length || !( count = ( $lis = $obj.find('li') ).length ) ) {
        return;
    }

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

        setTimeout(timerFunc, 2000);

    };

    $obj.append( $obj.html() );
    timerFunc();
};