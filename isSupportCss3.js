var isSupportCss3 = function (name) {
    var reg = new RegExp(name, 'ig'),
        getComputedStyle = window.getComputedStyle;

    return !!getComputedStyle && _.some( getComputedStyle( document.body, null ), function (v) {
        return reg.test(v);
    });
};