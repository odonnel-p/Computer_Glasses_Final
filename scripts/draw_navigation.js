//Constants for the SVG
var width = document.getElementById("nav_bub_id").clientWidth-280,
    height = document.getElementById("nav_bub_id").offsetHeight-40;

    //console.log(document.getElementById("nav_bub_id").offsetWidth);

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
    .charge(40)
    .linkDistance(120)
    .gravity(.4)
    .size([width, height]);


//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select(".nav_bubble").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 100);


//Read the data from the JSON file
d3.json("./data/nav_nodes.JSON", function(err, graph) {
  console.log(graph);
  if (err) throw err;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("a")
      .attr('xlink:href', function (e) {
        if (e.index==0) { return "home.html"; }
        var href = "page_"+e.index+".html";
        return href;
      })
      .append("circle")
      .attr("class", "node")
      .attr("r", 95)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag)
      

  node.append("title")
      .text(function(d) { return d.name; })
      .style('font-family', 'Lato')
      .style('font-weight', 400)
      .style('font-size', "small")
      .style('color', "#888");



  var padding = 80, // separation between circles
    radius=95;
  
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(graph.nodes);
    return function(d) {
      var rb = 2*radius + padding,
          nx1 = d.x - rb,
          nx2 = d.x + rb,
          ny1 = d.y - rb,
          ny2 = d.y + rb;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y);
            if (l < rb) {
            l = (l - rb) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { 
      if (d.x > width) { d.x = d.x-(d.x-width)/2};
      if (d.x < 0) { d.x = d.x+(-d.x/2)};
      return d.x; })
        .attr("cy", function(d) { 
      if (d.y > height) { d.y = d.y-(d.y-height)/2};
      if (d.y < 0) { d.y = d.y+(-d.y/2)};
      return d.y; });
    node.each(collide(0.02)); //Added 
  });
});