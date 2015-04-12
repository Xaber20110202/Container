
! function (X) {

    /**
     * @note   针对一些特殊按钮的快速点击 创建两个订单等各类事件
     *         将原有JQuery绑定在元素的事件函数做一个保存 然后解除绑定
     *         最后绑定一个事件  先做时间延迟调用的处理  再将原有函数依次执行
     *         部分想法来源：《Pro JavaScript Technique》&& Dean Edwards Events && JQuery
     * @rely   jQuery
     * @param  selector jQuery 选择器 或者任意经jQuery可以转成jQuery dom对象的元素
     *         eventType 事件类型 默认为click
     *         waiting 需要暂停事件触发的时间 默认为500ms
     *         waitingFunc 在暂停期间事件触发时可选的调用函数
     * @author Xaber
     */
    var avoidDblTrigger = function (selector, eventType, waiting, waitingFunc) {

        var $dom = null,
            oriBinds = [],// 原来绑定的所有事件函数的散列表
            temp;

        if ( !selector || !($dom = $(selector)).length ) {
            return;
        }

        eventType = eventType || 'click';
        waiting = waiting || 500;
        waitingFunc = $.isFunction(waitingFunc) ? waitingFunc : function () {};

        // 有绑定过相应事件
        if ( (temp = $._data($dom[0]).events) &&
                (temp = temp[eventType]) ) {

            // 获得 绑定事件的函数数组
            // 不可在循环中使用off  因off中会将 $._data($dom[0]).events[eventType] 中的事件绑定函数移除
            // 也就类似 循环的过程中改变循环的数组
            $.each( temp, function (key, handle) {
                if (handle.handler) {
                    oriBinds.push(handle.handler);
                }
            });

            // 解除绑定
            $.each(oriBinds, function (key, handler) {
                $dom.off(eventType, handler);
            });

            $dom.each(function () {

                var thisDom = this;

                thisDom.isDblTrigger = false;
                $(thisDom).on(eventType, function () {
                    var args = arguments,
                        // 初始返回值即为undefined
                        result;

                    // 在延时时间内再次触发 只针对单个的DOM
                    // 不对不是连续两次触发过的其他元素影响
                    if (thisDom.isDblTrigger) {
                        waitingFunc.apply(thisDom, args);

                        // 顺便禁掉默认事件
                        return false;
                    }

                    thisDom.isDblTrigger = true;
                    // 设置定时
                    setTimeout(function () {
                        thisDom.isDblTrigger = false;
                    }, waiting);

                    $.each(oriBinds, function (key, handler) {

                        // 原来绑定的所有事件函数 调用
                        result = handler.apply(thisDom, args);
                    });

                    return result;

                });
            });
        }
    };

    if (X.help) {
        X.help.avoidDblTrigger = avoidDblTrigger;
    
    } else {
        X.help = {
            avoidDblTrigger : avoidDblTrigger
        };
    }

}( window.X ? window.X : (window.X = {}) );