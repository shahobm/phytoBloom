var chartColors = {
	blue: 'rgb(54, 162, 235)',
	green: 'rgb(75, 192, 192)'
}

// inital 2D array of values to map base x and y coords to graph
var data1 = [
	//JAN
	{x: 0, y: 65.3}, {x: 1, y: 65.3}, {x: 2, y: 33.14}, {x: 3, y: 22.01}, {x: 4, y: 34.74}, {x: 5, y: 26.58}, {x: 6, y: 38.49}, {x: 7, y: 48.12}, {x: 8, y: 44.3}, {x: 9, y: 28.55}, {x: 10, y: 28.92},
		//FEB
		{x: 11, y: 37.21}, {x: 12, y: 38.13}, {x: 13, y: 42.49}, {x: 14, y: 44.65}, {x: 15, y: 80.62}, {x: 16, y: 104.66}, {x: 17, y: 87.16}, {x: 18, y: 72.72}, {x: 19, y: 91.07}, {x: 20, y: 93.89},
		//MAR
		{x: 21, y: 113.01}, {x: 22, y: 109.56}, {x: 23, y: 110.08}, {x: 24, y: 126.43}, {x: 25, y: 128.98}, {x: 26, y: 165.52}, {x: 27, y: 196.73}, {x: 28, y: 156.93}, {x: 29, y: 140.41}, {x: 30, y: 130.24},
		//APRIL
		{x: 31, y: 164.14}, {x: 32, y: 150.28}, {x: 33, y: 127.09}, {x: 34, y: 134.54}, {x: 35, y: 129.89}, {x: 36, y: 115.30}, {x: 37, y: 181.71}, {x: 38, y: 259.52}, {x: 39, y: 269.57}, {x: 40, y: 241.86},
		//MAY
		{x: 41, y: 221.29}, {x: 42, y: 212.84}, {x: 43, y: 246}, {x: 44, y: 271.05}, {x: 45, y: 238.03}, {x: 46, y: 250.05}, {x: 47, y: 256.02}, {x: 48, y: 236.56}, {x: 49, y: 259.93}, {x: 50, y: 286.6},
		//JUNE
		{x: 51, y: 283.94}, {x: 52, y: 298.4}, {x: 53, y: 279.81}, {x: 54, y: 256.37}, {x: 55, y: 262.98}, {x: 56, y: 236.18}, {x: 57, y: 305.79}, {x: 58, y: 318.73}, {x: 59, y: 289.67}, {x: 60, y: 277.52}
			];

// x-axis labels
var chartData = {
	labels: ['1/1/2018', '2/1/2018', '3/1/2018', '4/1/2018', '5/1/2018', '6/1/2018', '7/1/2018'],
	datasets: [
	{label: 'Light',
	fill: true,

	borderColor: window.chartColors.blue,
	pointBackgroundColor: [],
	pointBorderColor: [],

	pointRadius: 10,
	pointHoverRadius: 10,

	data: data1},
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
				text: ['Light Intensity'],
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
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Date (3 day intervals)'
					},
					type: 'linear',
					position: 'bottom',
					ticks: {
						max: 59,
						min: 0,
						stepSize: 10,
						callback: function(value, index, values) {
							return chartData.labels[index];
						}
					}
				}],
				yAxes: [{
					display: true,
					ticks:{min: 0, max: 400, reverse: false},
					scaleLabel: {
						display: true,
						labelString: 'Photosynthetically Available Radiation'
					}
				}]
			}
		}
	});
};

function algeaFill(respiration, depth){

	var dataPoints = [];

	lightAvgs = [65.3, 33.14, 22.01, 34.74, 26.58, 38.49, 48.12, 44.3, 28.55, 28.92, 37.21, 38.13, 42.49, 44.65, 80.62, 104.66, 87.16, 72.72, 91.07, 93.89, 113.01, 109.56, 110.08, 126.43, 128.98,
	165.52, 196.73, 156.93, 140.41, 130.24, 164.14, 150.28, 127.09, 134.54, 129.89, 115.30, 181.71, 259.52, 269.57, 241.86, 221.29, 212.84, 246, 271.05, 238.03, 250.05, 256.02, 236.56, 259.93, 
	286.6, 283.94, 298.4, 279.81, 256.37, 262.98, 236.18, 305.79, 318.73, 289.67, 277.52];

	// for each array value
		// pass array value, depth, respiration
	for(var i = 0; i < 60; i++){
		if(critDepthCalc(lightAvgs[i], depth, respiration) >= depth || critDepthCalc(lightAvgs[i], depth, respiration) == 'NaN'){
			window.myLine.data.datasets[0].pointBackgroundColor[i] = "green";

		}else{
			window.myLine.data.datasets[0].pointBackgroundColor[i] = "blue";
		}
		dataPoints.push({x: i, y: lightAvgs[i]});
	}

	return dataPoints;

}

document.getElementById('respirationRange').addEventListener('change', function() {
	window.myLine.data.datasets[0].data = algeaFill(respirationSlider.value, depthSlider.value);
	window.myLine.update();
});

document.getElementById('depthRange').addEventListener('change', function() {

	window.myLine.data.datasets[0].data = algeaFill(respirationSlider.value, depthSlider.value);
	window.myLine.update();
});
