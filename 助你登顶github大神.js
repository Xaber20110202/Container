
var colors = ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];

var randomFunc = function (min, max) {
	if (max == null) {
      max = min;
      min = 0;
    }

    return min + Math.floor( Math.random() * ( max - min + 1 ) );
};

var getColor = function (colors, randomFunc) {
	return colors[ randomFunc( colors.length - 1) ];
};

$('rect').each(function () {
	$(this).attr( 'fill', getColor( colors, randomFunc ) );
});