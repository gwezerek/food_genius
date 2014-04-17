

// SETUP VARIABLES
// =============================================
var spreadsheetURL = "/food_genius.tsv";
var jsonURL = "/us.json";
var regionalTSV = "/regional_ingredients.tsv";
// var spreadsheetURL = "http://www.guswezerek.com/projects/food_genius/food_genius.tsv";
// var jsonURL = "http://www.guswezerek.com/projects/food_genius/us.json";

// For template
var statesTemplate = _.template( $(".viz-state-template").html() );


// SETUP
// =============================================







// D3
// =============================================

var width = 868,
	height = 550;

var rateById = d3.map();

var color = d3.scale.quantize()
	.domain([0,0.5])
	.range(['rgb(254,237,222)','rgb(253,208,162)','rgb(253,174,107)','rgb(253,141,60)','rgb(230,85,13)']);

var projection = d3.geo.albersUsa()
	.scale(1180)
	.translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select(".viz-svg-wrap").append("svg")
	.attr("width", width)
	.attr("height", height);

queue()
	.defer(d3.json, jsonURL)
	.defer(d3.tsv, spreadsheetURL)
	.defer(d3.tsv, regionalTSV)
	.await(ready);

function ready(error, us, termData, regionalData) {

	var nested_regional = d3.nest()
		.key(function(d) {return d.state; })
		.entries(regionalData);

	_.each(nested_regional, function(e,i) {
		var ingredients = e.values[0];
		ingredients.ranch = { 
			"ingredient": "ranch dressing",
			"pct": ingredients.ranch_pct,
			"diff": ingredients.ranch_diff
		};
		ingredients.pecan = { 
			"ingredient": "pecan",
			"pct": ingredients.pecan_pct,
			"diff": ingredients.pecan_diff
		};
		ingredients.chile = { 
			"ingredient": "green chile",
			"pct": ingredients.chile_pct,
			"diff": ingredients.chile_diff
		};
		ingredients.cheesesteak = { 
			"ingredient": "cheesesteak",
			"pct": ingredients.ranch_pct,
			"diff": ingredients.ranch_diff
		};
		ingredients.bell = { 
			"ingredient": "green bell pepper",
			"pct": ingredients.bell_pct,
			"diff": ingredients.bell_diff
		};
	});

	console.log(nested_regional);

	var nested_terms = d3.nest()
		.key(function(d) {return d.state; })
		.entries(termData);

	DATA = nested_terms;
	populateStates(DATA);


	// Dynamically get min and max for color range
	color.domain([
		d3.min(termData, function(d) { return d.diff; }),
		d3.max(termData, function(d) { return d.diff; })
	]);

	// Merge diff vals from termData into us data object
	for (var i = 0; i < DATA.length; i++) {
		var ingArray = [];

		_.each(DATA[i].values, function(e, j) {
			if (DATA[i].values[j].type === "ingredient" || DATA[i].values[j].type === "dish") {
				ingArray.push(DATA[i].values[j]);
			}
		});

		var mostDiff = ingArray[0];

		var termDataState = mostDiff.state_fullname;

		//Find the corresponding state inside the GeoJSON
		for (var j = 0; j < us.features.length; j++) {

			var jsonState = us.features[j].properties.name;

			if (termDataState == jsonState) {

				//Copy the termData value into the JSON
				us.features[j].properties.value = parseFloat(mostDiff.diff);
				us.features[j].properties.abrv =  mostDiff.state;
				us.features[j].properties.term = mostDiff.term;

				//Stop looking through the JSON
				break;
			}
		}
	}

	// Create the state paths
	svg.selectAll("path")
		.data(us.features)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d) { return d.properties.abrv })
		.attr("class", "viz-state-shape")
		.style("fill", function(d) {
			var value = d.properties.value;

			if (value) {
				return color(value);
			} else {
				return "#ccc";
			}
	});

	// Now that the elements exist we can bind handlers
	bindMapHandlers();

}










// HANDLERS
// =============================================
function bindMapHandlers() {
	$(".viz-svg-wrap").on({
		mouseenter: function() {
			var callout = $(".viz-hover-callout");
			var states = $(".viz-state");
			var state = this.id;
			var element = states.filter("[data-state='" + state + "']").first();
			var toInsert = element.clone();

			d3.select(this).moveToFront();
			this.addClass("viz-state-active");
			callout.html(toInsert);
		},
		mouseleave: function() {
			this.removeClass("viz-state-active");
		}
	}, ".viz-state-shape");
}











// HELPERS
// =============================================

function populateStates(data) {
	var myObj = {};
	var toAppendString1 = "";
	var toAppendString2 = "";
	var dataLength = data.length;
	var toPercent = d3.format("%");


	// Create objects that underscore likes
	myObj["states"] = data;
	data = myObj;
	
	// Compile the list
	for (i = 0; i < dataLength; i++) {
		if (i < dataLength/2 ) {
			toAppendString1 += statesTemplate(data.states[i]);
		} else {
			toAppendString2 += statesTemplate(data.states[i]);
		}
	}

	// Append the lists
	$(".viz-states-col-1").html(toAppendString1);
	$(".viz-states-col-2").html(toAppendString2);
};

var percentTimesHundo = function(val) {
	val  = val * 100;
	// var formatVal = d3.format(".0");
	return d3.round(val);
};


// SVG HELPERS
// =============================================

d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
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
