/*jshint -W099 */
/*jslint browser: true, sub: true */


// SETUP
// =============================================

var CONFIG = {
	comboGroups: $(".viz-combo-group"),
	ingredients: $(".viz-ingredients > g")
};


// HANDLERS
// =============================================

// Show connections when hovering on a combo
CONFIG.comboGroups.on({
	mouseenter: function() {
		var comboID = $( this ).attr( "id" );	// Which combo is it?

		$( this ).find( ".viz-combo-reveal" ).show();	// Show the colored ingredients and connecting lines within
		d3.selectAll( ".viz-combo-group, .viz-ingredients" ).addClass( "viz-inactive" );	// Fades out all the combos, ingredients
		d3.select( this ).moveToFront().addClass( "viz-active" );		// Moves to front, restores opacity to hovered combo
		CONFIG.ingredients.filter( "." + comboID ).hide();	// Hides the black ingredients behind the now visible colored ingredients
	},
	mouseleave: function() {
		CONFIG.ingredients.show();	// Shows all black ingredients
		d3.selectAll(".viz-combo-group, .viz-ingredients").removeClass("viz-inactive");	// Show all the combos, ingredients
		d3.selectAll(".viz-combo-group").removeClass("viz-active");	// Removes full opacity mandate
		$(".viz-combo-reveal").hide();	// Hides combo lines, colored ingredients
	}
});


CONFIG.ingredients.on("mouseenter", function() {
	var comboIds = $(this).attr("class").split(" ");

	$.each(comboIds, function(i) {
		$("#" + comboIds[i]).find(".viz-combo-reveal").show();
		d3.select( "#" + comboIds[i] ).moveToFront().addClass( "viz-active" );
	});
});


// SVG HELPERS
// =============================================

d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.addClass = function(className) {
	return this.each(function() {
		if (!this.hasClass(className)) {
			this.setAttribute("class", this.getAttribute("class") + " " + className);
		}
	});
};

d3.selection.prototype.removeClass = function(className) {
	this.each(function() {
		var removedClass = this.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2");
		if (this.hasClass(className)) {
			this.setAttribute("class", removedClass);
		}
	});
};

SVGElement.prototype.hasClass = function(className) {
	return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute("class"));
};

SVGElement.prototype.addClass = function(className) {
	if (!this.hasClass(className)) {
		this.setAttribute("class", this.getAttribute("class") + " " + className);
	}
};

SVGElement.prototype.removeClass = function(className) {
	var removedClass = this.getAttribute("class").replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), "$2");
	if (this.hasClass(className)) {
		this.setAttribute("class", removedClass);
	}
};
