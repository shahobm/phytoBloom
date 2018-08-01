var currentLight = 0;
var currentDepth = 0;
var currentDate = 0;


// light slider
var lightSlider = document.getElementById("lightRange");
var lightOutput = document.getElementById("lightVal");
lightOutput.innerHTML = lightSlider.value;

lightSlider.oninput = function() {
	lightOutput.innerHTML = this.value;
	tank.updateLightValue(this.value);
}

// date slider
var dateSlider = document.getElementById("dateRange");
var dateOutput = document.getElementById("dateVal");
dateOutput.innerHTML = dateSlider.value;

dateSlider.oninput = function() {
	dateOutput.innerHTML = this.value;
	tank.updateChangeDateValue(this.value);
	dateFromDay(this.value);

}

// depth slider
var depthSlider = document.getElementById("depthRange");
var depthOutput = document.getElementById("depthVal");
depthOutput.innerHTML = dateSlider.value;

depthSlider.oninput = function() {
	depthOutput.innerHTML = this.value;
	tank.updateHeight(this.value)
}

// check students values for correct solution

function myFunction(currentLight) {

	// if light is incorrect
	if (lightOutput.innerHTML != 30){
		document.getElementById("response").innerHTML = "Your light value is not 30";
	}
	// if date is incorrect
	else if (dateOutput.innerHTML != 1){
		document.getElementById("response").innerHTML = "Your date value is not 10";
	}
	// if depth is incorrect
	else if (depthOutput.innerHTML != 30){
		document.getElementById("response").innerHTML = "Your depth value is not 30";
	}
	// if all is correct
	else {
	tank.updateColor("green");
	document.getElementById("response").innerHTML = "All variables are 30";

	}
}

