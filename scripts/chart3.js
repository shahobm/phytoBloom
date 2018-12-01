
// inital 2D array of values to map base x and y coords to graph
var data1 = [{x: 1, y: 10}, {x: 2, y: 10}, {x: 3, y: 10}, {x: 4, y: 10}, {x: 5, y: 10}, {x: 6, y: 10}, {x: 7, y: 10}, {x: 8, y: 10}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}];
var productivitySet = [{x: 1, y: 20}, {x: 2, y: 30}, {x: 3, y: 36}, {x: 4, y: 40}, {x: 5, y: 44}, {x: 6, y: 46}, {x: 7, y: 49}, {x: 8, y: 50}, {x: 9, y: 52}, {x: 10, y: 54}, {x: 11, y: 55}];
var data3 = [{x: 1, y: 2}, {x: 2, y: 13}, {x: 3, y: 21}, {x: 4, y: 10}, {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 2}, {x: 8, y: 2}, {x: 9, y: 31}, {x: 10, y: 15}, {x: 11, y: 11}];
var criticalValue = [{x: 0, y: 37}, {x: 99, y: 37}];
var respirationValue = 50;
var respirationSet = [{x: 50, y: 0}, {x: 50, y: 100}];

// x-axis labels
var chartData = {
	labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
	datasets: [

	{label: 'Mix Layer Depth',
	backgroundColor: window.chartColors.green,
	borderColor: window.chartColors.green,
	data: MLDData(30),
	fill: false,},

	{label: 'Productivity',
	fill: false,
	backgroundColor: window.chartColors.blue,
	borderColor: window.chartColors.blue,
	data: productivityData(lightSlider.value)},

	{label: 'Critical Depth',
	fill: false,
	backgroundColor: window.chartColors.orange,
	borderColor: window.chartColors.orange,
	data: criticalValue},

	{label: 'Respiration',
	fill: false,
	backgroundColor: window.chartColors.red,
	borderColor: window.chartColors.red,
	data: respirationSet}

	]
};

window.onload = function() {
	var config = document.getElementById("canvas").getContext("2d");
	window.myLine = Chart.Line(config, {
		type: "line",
		data: chartData,
		options: {
			responsive: true,
			title: {
				display: true,
				text: ['Productivity, Respiration', 'mg C m^-3 d^-1'],
				fontSize: 14
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			annotation: {
				annotations: [
				]
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Productivity'
					},
					type: 'linear',
					position: 'top',
					ticks: {
						max: 99,
						min: 0,
						stepSize: 10,
						callback: function(value, index, values) {
							return chartData.labels[index];
						}
					}
				}],
				yAxes: [{
					display: true,
					ticks:{min: 0, max: 30, reverse: true},
					scaleLabel: {
						display: true,
						labelString: 'Depth'
					}
				}]
			}
		}
	});
};

function MLDData(depth){
	var dataPoints = [];
	var h;
	for(var w = 0; w < 100 ; w++){
		dataPoints.push({x: w, y: depth});
		//alert(dataPoints.push({x: w, y: h}));
	}
	return dataPoints;
}

function respirationData(respiration){
	var dataPoints = [];
	var yPos = 0;
	for(var step = 0; step < 2 ; step++){
		dataPoints.push({x: respiration, y: yPos});
		yPos+=100;
	}
	return dataPoints;
}

// create MLD Dataset
function productivityData(light){

	var attenuation = .05;
	var dataPoints = [];

	for(var depthArrayPos = 0; depthArrayPos < 100 ; depthArrayPos = depthArrayPos + 1){
		var productivity = light * 1 * Math.exp(-0.05 * depthArrayPos);

		dataPoints.push({x: productivity, y: depthArrayPos});

	}
	return dataPoints;
}

function criticalData(criticalValue){
	var dataPoints = [];
	var yPos = criticalValue;
	var xPos = 0;
	for(var step = 0; step < 2 ; step++){
		dataPoints.push({x: xPos, y: yPos});
		xPos+=99;
	}
	return dataPoints;
}


document.getElementById('respirationRange').addEventListener('change', function() {
	window.myLine.data.datasets[3].data = respirationData(respirationSlider.value);
	window.myLine.update();
});


document.getElementById('lightRange').addEventListener('change', function() {
	window.myLine.data.datasets[1].data = productivityData(lightSlider.value);
	window.myLine.update();
});

