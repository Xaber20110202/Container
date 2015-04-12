+ function () {

    // 放在你 github 首页的控制台里按下回车试试
    var randomFunc = function (min, max) {
        if (max == null) {
          max = min;
          min = 0;
        }

        return min + Math.floor( Math.random() * ( max - min + 1 ) );
    };

    var getRandomItem = function (items, randomFunc) {
        return items[ randomFunc( items.length - 1) ];
    };

    var colors = ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];

    $('rect').each(function () {
        $(this).attr( 'fill', getRandomItem( colors, randomFunc ) );
    });

}();