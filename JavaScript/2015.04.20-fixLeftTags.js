(function (win, X) {
    X.help = X.help || {};

    /**
     * @note     用于补全一些字符串中标签丢失的左尖括号
     *           例如商品详情被PHP CI框架过滤掉左标签的一些元素
     *           只针对频繁出现的一些标签
     *           写于2014年8月
     * @author   Xaber
     */
    X.help.fixLeftTag = function (str) {
        var tags = ['strong', 'p', 'span', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            img = /([^<])(img((\s+\S*?)*?|(\s*\/?))>)/gi,
            br = /([^<])br(\s*\/?>)?/gi,
            pattern = '$1<$2';

        tags = new RegExp( '([^\\\/^<])((' + tags.join('|') + ')>)', 'gi' );
        // /([^\/^<])((strong|p|span|em|ul|ol|li|h1|h2|h3|h4|h5|h6)>)/gi 

        str = str.replace(tags, pattern);

        // 由于自闭合标签可能相邻标签紧连的情况导致单次匹配无法匹配到下一个
        // 故用循环来解决 原则上 只需要循环两次即可
        while ( str.search(img) !== -1 ) {
            str = str.replace(img, pattern);
        }
        while ( str.search(br) !== -1 ) {
            str = str.replace(br, '$1<br />');
        }

        return str;
    };

})(window, window.X || (window.X = {}));