/*
 *  @note    获取url get 字符串
 *  @author  xaber
 */
var getUrlParam = function (name) {
    var search = window.location.search,
        matched = search.slice(1).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'));
    return search.length ? (matched && matched[2]) : null;
};