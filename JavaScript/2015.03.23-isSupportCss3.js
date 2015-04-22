! function (X) {

    /*
     * @note    CSS3 特性检测
     * @rely    jQuery underscore
     * @param   选择要检测的CSS 3特性名称们
     * @author  Xaber
     */
    var isSupportCss3 = function () {
        var getComputedStyle = window.getComputedStyle,
            computedStlye = null;

        return !!getComputedStyle && 
            (computedStlye = getComputedStyle(document.body, null)) && 
            _.every(Array.prototype.slice.call(arguments), function (name) {
                var reg = new RegExp(name, 'ig');
                return _.some(computedStlye, function (v) {
                    return reg.test(v);
                });
            });
    };

    X.help = X.help || {};
    X.help.isSupportCss3 = isSupportCss3;

}( window.X ? window.X : (window.X = {}) );