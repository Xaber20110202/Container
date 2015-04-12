! function (X) {

    /*
     * @note    CSS3 特性检测
     * @rely    jQuery underscore
     * @param   选择要检测的CSS 3特性名称
     * @author  Xaber
     */
    var isSupportCss3 = function (name) {
        var reg = new RegExp(name, 'ig'),
            getComputedStyle = window.getComputedStyle;

        return !!getComputedStyle && _.some( getComputedStyle( document.body, null ), function (v) {
            return reg.test(v);
        });
    };

    if (X.help) {
        X.help.isSupportCss3 = isSupportCss3;

    } else {
        X.help = {
            isSupportCss3 : isSupportCss3
        };
    }

}( window.X ? window.X : (window.X = {}) );