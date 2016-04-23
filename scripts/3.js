console.log("3 script")

var button_state = 1;



function changeData(){
	console.log( d3.select(this) );

	if (this.id.localeCompare("1")){
		button_state = 1;
	} else if (this.id.localeCompare("2")) {
		button_state = 2;
	} else if (this.id.localeCompare("3")) {
		button_state = 3;
	} else {
		button_state = 1;
	}

	console.log(button_state);
}

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
		f_Prev_l95: +p.Female_Prev_UCI
	}
	}

}

function dataLoaded(err, prev){
	//console.log(err);
	console.log(prev);
	console.log(button_state);

}

