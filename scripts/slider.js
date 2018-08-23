
var currentLight = 0;
var currentDepth = 0;
var currentDate = 0;
var currentRespiration = 0;



// light slider
var lightSlider = document.getElementById("lightRange");
var lightOutput = document.getElementById("lightVal");
if(lightOutput){
	lightOutput.innerHTML = lightSlider.value;


	lightSlider.oninput = function() {
		lightOutput.innerHTML = this.value;
		tank.updateLightValue(this.value);
		tank.updateChangeDateValue(this.value);
	}
}


// depth slider
var depthSlider = document.getElementById("depthRange");
var depthOutput = document.getElementById("depthVal");
if(depthOutput){
	depthOutput.innerHTML = depthSlider.value;

	depthSlider.oninput = function() {
		depthOutput.innerHTML = this.value;
		tank.updateHeight(this.value)
	}
}

// respiration slider
var respirationSlider = document.getElementById("respirationRange");
var respirationOutput = document.getElementById("respirationVal");
if(respirationOutput){
	respirationOutput.innerHTML = respirationSlider.value;

	respirationSlider.oninput = function() {
		respirationOutput.innerHTML = this.value;
		tank.updateRespiration(this.value)
		//tank.updateChangeDateValue(this.value);
	}
}

/*
// date slider
var dateSlider = document.getElementById("dateRange");
var dateOutput = document.getElementById("dateVal");
dateOutput.innerHTML = dateSlider.value;

dateSlider.oninput = function() {
	dateOutput.innerHTML = this.value;
	tank.updateChangeDateValue(this.value);
	tank.setSupportLabelText(dateFromDay(this.value));
}
*/

// check students values for correct solution

function checkSolution() {

	// if depth is incorrect
	if (depthOutput.innerHTML != 30){
		document.getElementById("response").innerHTML = "Your depth value is not 30";
	}
	// if all is correct
	else {
		document.getElementById("response").innerHTML = "All variables are correct";
		bloomColor();

	}

}

function tank1Solution() {
	var value1;
	var value2;
	var value3;

	areaCalculation(value1, value2, value3);
}

function tank2Solution() {
	var value1;
	var value2;
	var value3;

	areaCalculation(value1, value2, value3);
}

function tank3Solution() {
	var value1;
	var value2;
	var value3;

	areaCalculation(value1, value2, value3);
}

function areaCalculation(value1, value2, value3) {
	var bloomScenario = false;

	// calculate whether bloom

	if (bloomScenario) {
		// return change to boom color
		return true;
	}else{
		// return no change to bloom color
		return false;
	}
}

