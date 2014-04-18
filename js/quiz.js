

// SETUP VARIABLES
// =============================================

var INGDATA, REGIONALDATA, MAPDATA, STATES;

var spreadsheetURL = "/food_genius.tsv";
var jsonURL = "/us.json";
var regionalTSV = "/regional_ingredients.tsv";
// var spreadsheetURL = "http://www.guswezerek.com/projects/food_genius/food_genius.tsv";
// var jsonURL = "http://www.guswezerek.com/projects/food_genius/us.json";
// var regionalTSV = "http://www.guswezerek.com/projects/food_genius/regional_ingredients.tsv";

// For template
var statesTemplate = _.template( $(".viz-state-template").html() );







// D3
// =============================================

var width = 868,
	height = 550;

var color = d3.scale.quantize();

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

	var nested_terms = d3.nest()
		.key(function(d) {return d.state; })
		.entries(termData);

	REGIONALDATA = nested_regional;
	INGDATA = nested_terms;
	MAPDATA = us;

	populateStates(INGDATA);

	// Create the state paths
	var states = svg.selectAll("path")
		.data(us.features)
	  .enter().append("path")
		.attr("d", path)
		.attr("class", "viz-state-shape");

	STATES = states;

	// Shade map
	drawIngMap(us, states);

	// Now that the elements exist we can bind handlers
	bindMapHandlers();
}










// HANDLERS
// =============================================


function bindMapHandlers() {

	// Regional map icons
	$(".viz-regional-icon").on("click", function(){
		var term = $(this).data("term");

		updateLayout();
		drawRegionalMap(MAPDATA, STATES, term);
	});

	// Top terms map icon
	$(".viz-terms-icon").on("click", function(){
		updateLayout();
		drawIngMap(MAPDATA, STATES)
	});

	// State hover functionality
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

function updateLayout() {
	$(".viz-map-hed").hide();
	$(".viz-map-intro").hide();
	$(".viz-scale").hide();
}

function drawRegionalMap(data, states, term) {

	$(".viz-" + term).show();
	$(".viz-scale-regional").fadeIn(200);
	$(".viz-map-overlay").fadeOut(200);

	color.range(['rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(255,255,255)','rgb(224,224,224)','rgb(186,186,186)','rgb(135,135,135)','rgb(77,77,77)'])
		.domain([45, -45]);

	// Merge diff vals from REGIONALDATA into us data object
	if (!data.features[0].properties[term + "_diff"]) {
		for (var i = 0; i < REGIONALDATA.length; i++) {

			var state = REGIONALDATA[i];

			var regionalDataState = state.key;

			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < data.features.length; j++) {

				var jsonState = data.features[j].properties.abrv;

				if (regionalDataState == jsonState) {

					//Copy the termData value into the JSON
					data.features[j].properties[term + "_diff"] = parseFloat(state.values[0][term + "_diff"]);

					//Stop looking through the JSON
					break;
				}
			}
		}
	}

	states.style("stroke", "rgb(204, 198, 185)")
		.style("fill", function(d) {
			var value = d.properties[term + "_diff"];
			
			if (value) {
				return color(value);
			} else {
				return "#ccc";
			}
		});
}

function drawIngMap(data, states) {
	
	$(".viz-terms").show();
	$(".viz-scale-ing").fadeIn(200);
	$(".viz-map-overlay").fadeIn(200);

	color.range(['rgb(254,237,222)','rgb(253,208,162)','rgb(253,174,107)','rgb(253,141,60)','rgb(230,85,13)'])
		.domain([0, 0.5]);

	// Merge diff vals from INGDATA into us data object
	if (!data.features[0].properties.value) {
		for (var i = 0; i < INGDATA.length; i++) {
			var ingArray = [];

			_.each(INGDATA[i].values, function(e, j) {
				if (INGDATA[i].values[j].type === "ingredient" || INGDATA[i].values[j].type === "dish") {
					ingArray.push(INGDATA[i].values[j]);
				}
			});

			var mostDiff = ingArray[0];

			var termDataState = mostDiff.state_fullname;

			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < data.features.length; j++) {

				var jsonState = data.features[j].properties.name;

				if (termDataState == jsonState) {

					//Copy the termData value into the JSON
					data.features[j].properties.value = mostDiff.diff;
					data.features[j].properties.abrv =  mostDiff.state;
					data.features[j].properties.term = mostDiff.term;

					//Stop looking through the JSON
					break;
				}
			}
		}
	}

	states.style("stroke", "rgb(255, 255, 255)")
		.attr("id", function(d) { return d.properties.abrv; })
		.style("fill", function(d) {
			var value = d.properties.value;
			if (value) {
				return color(value);
			} else {
				return "#ccc";
			}
		});
}


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
