console.log("3 script")

var data_concat,
	w = d3.select('.hold_vis').node().clientWidth,
	h = d3.select('.hold_vis').node().clientHeight,
	m = {t:5,r:50,b:5,l:0},
	chartW = w - m.l - m.r,
	chartH = h - m.t - m.b,
	clr, clr2;

var scaleX = d3.scale.linear().range([0, chartW]),
	scaleY = d3.scale.linear().range([chartH, 0]);

queue()
	.defer(d3.csv, './data/cvs_prevalence.csv', parse_Prev)
	.await(dataLoaded);


function parse_Prev(p) {

	if (p){
	
	return {
		symptom: p.symptom,
		symptomN: +p.N,
		t_Prev: +p.Prevalence,
		t_Prev_l95: +p.Prevalence_LCI,
		t_Prev_u95: +p.Prevalence_UCI,
		m_Prev: +p.Male_Prev,
		m_Prev_l95: +p.Male_Prev_LCI,
		m_Prev_u95: +p.Male_Prev_UCI,
		f_Prev: +p.Female_Prev,
		f_Prev_l95: +p.Female_Prev_LCI,
		f_Prev_u95: +p.Female_Prev_UCI
	}
	}

}

function dataLoaded(err, prev){
	//console.log(err);
	console.log(prev);

	//SCALES AND AXES
	scaleX.domain([-1,prev.length+2])
	var y_a = scaleY.domain([0, 57])

	//var formatNumber = d3.format(".1f");
	var yAxis = d3.svg.axis()
	    .scale(y_a)
	    .ticks(8)
	    .tickSize(w)
	    .orient("right");

	var plot = d3.select(".hold_vis")
			.append('svg')
			.attr('width', w)
			.attr('height', h)
	
	var svg = plot.append("svg")
	    .attr("width", w + m.l + m.r)
	    .attr("height", h + m.t + m.b)
	    .append("g")
	    .attr("transform", "translate(" + m.l + "," + m.t + ")");

	var gy = svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

	gy.selectAll("g").filter(function(d) { return d; })
	    .classed("minor", true);

	gy.selectAll("text")
	    .attr("x", 10)
	    .attr("dy", -10);

	

	//BUTTONS CHANGE DATA AND REDRAW
	d3.selectAll('.buttons')
		.on('click', function() {

		var state = d3.select(this).attr('id')
		var count = 1;
		data_concat = [];

		if (state == "btn-1") {
			prev.forEach( function(im){ 
				var data_obj = {a: +im.t_Prev, b: +im.t_Prev_l95, c: +im.t_Prev_u95, s: im.symptom, n: im.symptomN, iter: count};
				data_concat = data_concat.concat(data_obj);
				count++;
				clr = "#333", clr2 = "#ccc"
			})
		} else if (state == "btn-2") {
			prev.forEach( function(im){
				var data_obj = {a: +im.m_Prev, b: +im.m_Prev_l95, c: +im.m_Prev_u95, s: im.symptom, n: im.symptomN, iter: count};
				data_concat = data_concat.concat(data_obj);
				count++;
				clr = "#000066", clr2 = "lightblue";
			})
			
		} else if (state == "btn-3") {
			prev.forEach( function(im){
				var data_obj = {a: +im.f_Prev, b: +im.f_Prev_l95, c: +im.f_Prev_u95, s: im.symptom, n: im.symptomN, iter: count};
				data_concat = data_concat.concat(data_obj);
				count++;
				clr = "#CE5D71", clr2 = "#D3BECF";
			})
		} else {
			prev.forEach( function(im){
				var data_obj = {a: +im.t_Prev, b: +im.t_Prev_l95, c: +im.t_Prev_u95, s: im.symptom, n: im.symptomN, iter: count};
				data_concat = data_concat.concat(data_obj);
				count++;
				clr = "#333", clr2 = "#ccc"
			})
		}
			console.log(data_concat);
			plot_bar_chart(data_concat);

		}) //end of .onclick

	

	var prepattern = plot.append('g'),
		prepatter2 = plot.append('g'),
		prepatter3 = plot.append('g');

	var plot_bar_chart = function(data) {

		//BARS
		var bar_width = 40;
		var pattern = prepattern.selectAll('.rect_rects')
			.data(data)

		//BARS UPDATE
		pattern.transition()
			.attr('x', function(d) { return scaleX(d.iter) })
			.attr('y', function(d) { return scaleY(d.c) })
			.attr('height', function(d){ return (scaleY(d.b)- scaleY(d.c)) })
			.style('stroke', clr)
		
		//BAR ENTER + UPDATE SELECTION	
		var points = pattern.enter().append('rect')

		//BAR ENTER + UPDATE TRANSITIONS
		d3.transition(points)
			.attr('class', function(d){ return d.s })
			.attr('class', 'rect_rects')
			.style('stroke', clr)
			.style('stroke-width', 2)
			.style('fill', '#fff')
			.attr('width', 0)
			  	.transition()
				.attr('width', bar_width)
				.attr('x', function(d) { return scaleX(d.iter) })
				.attr('y', function(d) { return scaleY(d.c) })
				.attr('height', function(d){ return (scaleY(d.b)- scaleY(d.c)) });

		pattern.exit().remove();

		//Lines
		var pattern3 = prepatter3.selectAll('.rect_lines')
			.data(data)

		//Line UPDATE TRANSITION
		pattern3.transition()
			.attr('y', function(d) { return scaleY(d.a) })
			.style('fill', clr)

		//Line ENT + UPD SELECTION
		var points3 = pattern3.enter().append('rect')

		//Lines ENT + UPD TRANSITIONS
		d3.transition(points3)
			.attr('class', function(d){ return d.s+", light_up, rect_lines" })
			.attr('height', 2 )
			.attr('width', 0 )
			.attr('x', function(d) { return scaleX(d.iter)-50 })
			.attr('y', function(d) { return scaleY(d.a) })
			.style('fill', clr)
			.style('opacity', 0)
				.transition()
				.attr('width', bar_width)
				.attr('x', function(d) { return scaleX(d.iter) })
				.style('opacity', 1)
				
		//DOTS
		var pattern2 = prepatter2.selectAll('circle')
			.data(data)

		//DOTS UPDATE TRANSITION
		pattern2.transition()
			.attr('cx', function(d) { return scaleX(d.iter) + bar_width/2 })
			.attr('cy', function(d) { return scaleY(d.a) })
			.style('fill', clr)

		//DOTS ENT + UPD SELECTION
		var points2 = pattern2.enter().append('circle')

		//DOTS ENT + UPD TRANSITIONS
		d3.transition(points2)
			.attr('class', function(d){ return d.s+", light_up" })
			.attr('r', 6)
			.attr('cx', function(d) { return scaleX(d.iter)-50 })
			.attr('cy', function(d) { return scaleY(d.a) })
			.style('fill', clr)
			.style('opacity', 0)
				.transition()
				.style('opacity', 1)
				.attr('cx', function(d) { return scaleX(d.iter)+ bar_width/2 })
		
		//TOOLTIP	
		pattern2.on("mouseover", function(d) {      
	            	div.transition()        
	                	.duration(200)      
	                	.style("opacity", .9);      
	            	div.html("<strong>"+ d.a + "%</strong> experienced<br/>" + d.s)
	            		.style('background', clr2)  
	                	.style("left", (d3.event.pageX-8) + "px")     
	                	.style("top", (d3.event.pageY -68) + "px");    
            	})                  
        	
        		.on("mouseout", function(d) {       
            		div.transition()        
                		.duration(500)      
                		.style("opacity", 0);   
        		});



	};

	var div = d3.select("body").append("div")   
    			.attr("class", "tooltip")               
    			.style("opacity", 0);

}

