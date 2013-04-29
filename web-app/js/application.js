if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}
$('#debug').click(function () {
    $(this).next().toggle();
});

// returns blank string if the property is undefined, else the value
function orBlank(v) {
    return v === undefined ? '' : v;
}
function orFalse(v) {
    return v === undefined ? false : v;
}
function orZero(v) {
    return v === undefined ? 0 : v;
}

// returns blank string if the object or the specified property is undefined, else the value
function exists(parent, prop) {
    return parent === undefined ? '' : (parent[prop] === undefined ? '' : parent[prop]);
}

