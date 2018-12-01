// slider.js used by all 3 experiments

var lightSlider = document.getElementById("lightRange");
var lightOutput = document.getElementById("lightVal");

var depthSlider = document.getElementById("depthRange");
var depthOutput = document.getElementById("depthVal");

var respirationSlider = document.getElementById("respirationRange");
var respirationOutput = document.getElementById("respirationVal");

// light slider
if(lightOutput){
	lightOutput.innerHTML = lightSlider.value;

	lightSlider.oninput = function() {
		lightOutput.innerHTML = this.value;
		tank.updateLightValue(this.value);
		
		critDepth = areaCalculation();
	}
}

// depth slider
if(depthOutput){
	depthOutput.innerHTML = depthSlider.value;

	depthSlider.oninput = function() {
		depthOutput.innerHTML = this.value;
		tank.updateHeight(this.value)
		critDepth = areaCalculation();
	}
}

// respiration slider
if(respirationOutput){
	respirationOutput.innerHTML = respirationSlider.value;

	respirationSlider.oninput = function() {
		respirationOutput.innerHTML = this.value;
		tank.updateRespiration(this.value)
		critDepth = areaCalculation();
	}
}

// initalize critical depth input files depending on the experiment page
function areaCalculation() {

// experiment 2
	if(document.getElementById("lightVal") == null){
		var light = -1;
		var respiration = respirationOutput.innerHTML;
		var depth = depthOutput.innerHTML;
	}

// experiment 3
	else if(document.getElementById("depthVal") == null){
		var light = lightOutput.innerHTML;
		var respiration = respirationOutput.innerHTML;
		var depth = -1;

	}

// experiment 1
	else {
		var light = lightOutput.innerHTML;
		var respiration = respirationOutput.innerHTML;
		var depth = depthOutput.innerHTML;
	}

	if(light == -1){
		// light is fixed set default
		light = 75;
	}
	if(depth == -1){
		// mix layer depth is fixed set default (experiment 3 depth)
		depth = 30;
	}

	critDepth = critDepthCalc(light, depth, respiration);

	if(document.getElementById("lightVal") != null){
		setOneText(critDepth);
		window.myLine.data.datasets[2].data = criticalData(critDepth);
		window.myLine.update();
	

	// if mix layer depth > calculated critical depth, change tank color. Otherwise change the color back if its not already.
		if (depth <= critDepth) {
			// return change to boom color
			bloomColor();
		}else{
			// return no change to bloom color
			noBloomColor();

		}
	}
}

// based on matlab calculations, calculate critical depth
function critDepthCalc(light, depth, respiration){

	// these remain constant
	var alpha = 1;
	var attenuation = 0.05;	

	// create depth array
	 //const increaseVal = x => x + 0.1
	 function range(start, stop, step){
	     var a=[start], b=start;
	     while(b<stop){b+=(step || 1);a.push(b)}
	     return a;
	 };

	var depthArray = range(0, 200, 0.1);

	var pInt = 1;
	var rInt = 0;

	// array starts at index 0
	var index = 0;

	while(pInt > rInt){
		
		index += 1;

		var numerator = light*alpha;
		var preExp = -attenuation * depthArray[index];

		pInt = ([light*alpha/0.05]*(1-(Math.exp(preExp))));
		rInt = respiration * depthArray[index];
	}

	critDepth = Math.round(depthArray[index] * 100 / 100);

	return critDepth;
}
