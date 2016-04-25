console.log("4 script")

var data_concat,
	w = d3.select('.hold_vis').node().clientWidth,
	h = d3.select('.hold_vis').node().clientHeight,
	m = {t:5,r:50,b:5,l:0},
	chartW = w - m.l - m.r,
	chartH = h - m.t - m.b,
	clr, clr2;

var scaleX = d3.scale.linear().range([0, chartW]),
	scaleY = d3.scale.linear().range([chartH, 0]);
