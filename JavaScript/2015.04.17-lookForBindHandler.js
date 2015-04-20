// come from avoidDblTrigger
// 用于查看一个dom元素上绑定的特定事件类型的函数
var lookForBindHandler = function (dom, eventType) {
    $.each( $._data(dom).events[eventType], function (key, handle) {
        console.log(handle.handler.toString());
    });
};