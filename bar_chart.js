// Bar graph 

var incoming_runs_data = [[-23,6],[-21,4],[-14,3],[-2,1],[0,5]];
var incoming_error_data = [[-22,5],[-7,2],[0,1]];
var anchor = "div";
var type = "summary";
BarGraph(incoming_runs_data, incoming_error_data, anchor, type);

function BarGraph(run_data, error_data, anchor, type){
	var svg_w;
	var svg_h;
	var w;
	var h;
	var padding;
	var trans;
	var barPadding = 1;
	var max_val;
	var barHeightFactor;
	var barWidth;
	var x;
	var y;
	var x_ticks;
	var xAxis;
	var yAxis;
	var yAxisMinor;
	var chartContainer;
	var borderPath;
	var barsContainer;
	var right_label_text;
	var left_label_text;
	var xts; // x tick size
	var yts; // y tick size
	var font_size;

	var formatted_runs_data = Array.apply(null, new Array(24)).map(Number.prototype.valueOf,0);
	var formatted_error_data = Array.apply(null, new Array(24)).map(Number.prototype.valueOf,0);
	var formatted_data = [formatted_runs_data, formatted_error_data];

	// Format data
	function formatData(){
		for (var i=0; i<run_data.length; i++){
			var loc = run_data[i][0] * (-1); 	// location
			var val = run_data[i][1]; 		// value
			formatted_runs_data[loc] = val;
		}
		for (var i=0; i<error_data.length; i++){
			var loc = error_data[i][0] * (-1);	// location
			var val = error_data[i][1];		// value
			formatted_error_data[loc] = val;
		}
	}				
	// Check for type of graph to generate
	function getTypeParameters(type){
		if (type === "detailed"){
			svg_w = 500;
			svg_h = 150;
			w = svg_w - 40;
			h = svg_h - 30;
			padding = {left: 30, right: 10, top: 10, bottom: 30};
			trans = {w: 25, h: 5}
			x_ticks = 12;
			y_ticks_div = 2;
			xts = 3;
			yts = 3;
			right_label_text = "last hour";
			left_label_text = "hrs";
			font_size = "10px";
		}
		else if (type === "summary"){
			svg_w = 200;
			svg_h = 50;
			w = svg_w - 18;
			h = svg_h - 10;
			padding = {left: 18, right: 4, top: 4, bottom: 12};
			trans = {w: 16, h: 5}
			x_ticks = 0;
			y_ticks_div = 5;
			xts = 1;
			yts = 2;
			right_label_text = "";
			left_label_text = "";
			font_size = "9px";
		}
	}	
	// Calculate bar height factor
	function calcBarHeightFactor(){
		var max_run = Math.max.apply(Math, formatted_runs_data);
		var max_error = Math.max.apply(Math, formatted_error_data);
		max_val = Math.max(max_run, max_error);
		max_val += 1;		// ******************* buffer for nice look??????????????????????????
		barHeightFactor = (h) / max_val;
		console.log("barHeightFactor: " + barHeightFactor);
	}
	// Calculate bar width
	function calcBarWidth(){
		barWidth = (w / formatted_runs_data.length);
	}

	formatData();
	getTypeParameters(type);
	calcBarHeightFactor();
	calcBarWidth();

	chartContainer = d3.select(anchor).append("svg")
			.attr("id", anchor + "_svg")
			.attr("width", svg_w)
			.attr("height", svg_h)
			.attr("transform", "translate(" + trans.w + "," + trans.h + ")")
			.style("padding-left", padding.left + "px")
			//.style("padding-right", padding.right + "px")
			.style("padding-top", padding.top + "px");
			//.style("padding-bottom", padding.bottom + "px");

	barsContainer = chartContainer.append("g")
			.attr("class", anchor + "_bar_group");
	

	x = d3.scale.linear().range([w - barPadding, 0]);
	y = d3.scale.linear().range([h, 0]);
	x.domain([0, formatted_runs_data.length*(-1)]);
	y.domain([0, max_val]);
	xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(x_ticks).tickSize(xts,xts);
	yAxis = d3.svg.axis().scale(y).orient("left").ticks(max_val/y_ticks_div).tickSize(yts,yts);
	yAxisMinor = d3.svg.axis().scale(y).orient("left").ticks(max_val);
	
			
	yGrid = chartContainer.append("g")
		.attr("class", "grid")
		.call(yAxisMinor
			.tickSize(-w + barPadding, 0, 0)
			.tickFormat("")
		)
		 
	var runs = barsContainer.append("g")
			.attr("class", "run_bars")
			.selectAll(".bars")
			.data(formatted_runs_data)
			.enter()
			.append("rect")
			.attr("class", anchor + "_runs_rect")
			.attr("x", function(d, i){
				return w - ((i+1) * barWidth); // start from the right
			})
			.attr("y", function(d){
				return h - (d * barHeightFactor)
			})
			.attr("width", barWidth - barPadding)
			.attr("height", function(d){
				return d * barHeightFactor;
			})
			.style("stroke", "#74c1d5")
			.style("stroke-width", "none")
			.style("shape-rendering", "crispEdges")
			.attr("fill", "#AFDBE7")
			.attr("opacity", "0.4");

	var errors = barsContainer.append("g")
			.attr("class", "error_bars")
			.selectAll(".bars")
			.data(formatted_error_data)
			.enter()
			.append("rect")
			.attr("class", anchor + "_error_rect")
			.attr("x", function(d, i){
				//console.log("i: " + i)
				return w - ((i+1) * barWidth); // start from the right
			})
			.attr("y", function(d){
				return h - (d * barHeightFactor);
			})
			.attr("width", barWidth - barPadding)
			.attr("height", function(d){
				return d * barHeightFactor;
			})
			.style("stroke", "#d62815")
			.style("stroke-width", "none")
			.style("shape-rendering", "crispEdges")
			.attr("fill", "#ED5B4B")
			.attr("opacity", "0.4");
			 
	var placeholders = barsContainer.append("g")
			.attr("class", "placeholder_bars")
			.selectAll(".bars")
			.data(formatted_runs_data)
			.enter()
			.append("rect")
			.attr("class", anchor + "_focus_rect")
			.attr("x", function(d, i){
				return  w - ((i+1) * barWidth); // start from the right
			})
			.attr("y", 1)
			.attr("width", barWidth - barPadding)
			.attr("height", h)
			.attr("fill", "#888")
			.attr("opacity", "0");
			 
			//barsContainer.selectAll(".placeholder_bars rect")
			//.data(formatted_data)
			//.enter();

	d3.select("#" + anchor + "_svg").append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);
	d3.select("#" + anchor + "_svg").append("g")
			.attr("class", "y axis")
			.call(yAxis);
			
	borderPath = chartContainer.append("g")
			.attr("class", "chart_border")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", h)
			.attr("width", w - barPadding)
			.style("stroke", "#000")
			.style("fill", "none")
			.style("stroke-width", "none")
			.style("shape-rendering", "crispEdges");
						
	rightLabel = chartContainer.append("text")
			.attr("class", "label")
			.attr("transform", "translate(" + (w-30) + ", " + (svg_h-5) + ")")
			.style("color", "black")
			.text(right_label_text);
	leftLabel = chartContainer.append("text")
			.attr("class", "label")
			.attr("transform", "translate(-5, " + (svg_h-5) + ")")
			.style("color", "black")
			.text(left_label_text);
			
	
	d3.selectAll("text")
		.style("font-size", font_size);
		
	
	//legend = chartContainer.append("g")
			//.attr("class", "legend")
			//.attr("transform", "translate(50, 30)")
			//.
			 
	// Tooltip obj
	var tooltip = d3.select("body")
					.append("text")
					.attr("class", "tooltip")
					.style("position", "absolute")
					.style("z-index", "2010")
					.style("visibility", "hidden")
					.style("color", "black")
					.style("font-size", font_size);

	d3.selectAll("." + anchor + "_focus_rect")
		.on("mouseover", function(d, i){
			mouseover(d, i, this); 
		})
		.on("mousemove", function(d, i){
			mousemove(d, i, this); 
		})
		.on("mouseout", function(d, i){ 
			mouseout(d, i, this); 
		});
		
	function mouseover(d, i, t){
		ith_child = parseInt(i+1);
		
		d3.select("g.run_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.9");
		d3.select("g.error_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.7");
		return tooltip.style("visibility", "visible");
	}
	function mousemove(d, i, t){
		if (formatted_runs_data[i] == 0 && formatted_error_data[i] == 0){
			tooltip.style("visibility", "hidden");
		}
		else{
			tooltip.html("# of runs: " + formatted_runs_data[i] + 
				"<br># of errors: " + formatted_error_data[i]);
		}
		//console.log(t);
		//console.log(d3.event.pageY-10 + ", " + d3.event.pageX+10);
		return tooltip.style("top", (d3.event.pageY-10)+"px")
						.style("left",(d3.event.pageX+10)+"px");
	}
	function mouseout(d, i, t){
		ith_child = parseInt(i+1);
		d3.select("g.run_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.4");
		d3.select("g.error_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.4");
		return tooltip.style("visibility", "hidden");
	}
}
