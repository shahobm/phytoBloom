# phytoBloom
Spring Phytoplankton Bloom Simulation
Sverdrop's Critical Depth Concept
A web app for students to learn plankto bloom prediction models.

# About
An admin will use the predicitive algorithim with some preselected variables to solve the equation. Students may then test their understanding of the algorithim by inputting light/depth/date variables to see when a bloom will occur given the scenario.

Target date 10/31

# Map
1. Homepage:

- HTML is index.html
- CSS is in assets -> css main.css
- JS is in assets -> js
- images are in phytoBloom -> images

2. Experiments:

- HTML is experiment(1-3).html
- CSS is in assets -> css main.css

- JS:
--Sliders
--- scripts -> top of slider.js

--Equations
---scripts -> bottom of slider.js

--Tank
---scripts -> tank.js
	Lines:
	(1-154) Construct tank with base values and call functions to set inital values and functions
	(155-674) Apply inital tank dimensions, color, text attributes and wave animations
	(675-1054) Allows changes in depth and color to be applies and corresponding text positioning
	(1055-1124) Call these functions to update values of the tank given slider values
	(1125-1224) Utility functions
	(1125-1254) Change right sidebar functions
	(1255-1274) Change inital text values and colors
	(1275-1284) Change tank size based on given  CSS values in assets -> css -> tank.css
	(1285-1304) Functions for date and random calculations
	(1305-1340) Button calls that are below the tank and description on the webpage.

# 8/9/18 Meeting
Rather than use the entire algorthim in a python equation, we will determine where blooms will occur given a Javascript area equation between out variables. We will edit the three scenarios to the scenarios David described. First by changing the toggles, their corresponding values in the tank, and their display in the tank. We can also create a mockup of the sidepanel displays for each scenario.

Scenario 1. The toggles will be irradiance, respiration, and mix layer depth. The tank will show an air layer a water layer, and a mix layer depth below. The side panel will display a light/respiration exponential graph to the right.

Scenario 2. The toggles are respiration and mixed layer depth. The tank will show the time of year January-July along one axis and a curved dotted line showing the depth needed for a bloom to occur along a particular date. And a mix layer depth that can be raised or lowered. There will be a side graph showing irradience as a function of time.

Scenario 3. The toggles are irradience and respiration. The tank will show a curved dotted line to represent time and a fixed mix layer depth with a brown seafloor and a water layer above.

# ToDo
1. Change scenario toggles.
	Rename light -> irradience
	comment out date and replace with respiration %
	Rename depth to mix layer depth

- Scenario 2
	Create respiration toggle
	Change depth to mix layer depth
	remove other toggles

- Scenario 3
	Rename light -> irradience
	Comment out date and with respiration %

2. Change design of tanks to represent new toggles.

- Scenario 1
	Remove unessasary old values (date)
	Rename new toggle values in tank
	Create static sea level depth with appropriate sidebar value as depth is now Mixiing level depth
	Make maximum mixing layer depth sea level depth
	Label static values with sidebar

- Scenario 2
	Have date change based on light percentage (jan = min, july = max)
	Rename new toggle values in tank
	create wave critical deppth dotted line
	add time of year as x-axis on tank
	Label static values with sidebar
	Change colors for bloom

- Scenario 3
	Rename new toggle values in tank
	Create date/time wavy dotted line
	Label static values with sidebar
	Change colors for bloom and seafloor

3. Create static side panels.

Create with CSS for portability of graph values to change with sliders later?

- Scenario 1
	Create square to house sidepanel
	Check data and estimate sidepanel view

- Scenario 2
	Create square to house sidepanel
	Check data and estimate sidepanel view

4. Create framework for toggles and tank values to change.
	For each scenario build a seperate checkSolution() with the sliders
	Give them access for an area equation to determine when a bloom will occur
	Allow function to call bloomColor() and noBloomColor() when values will indicate a bloom or not

5. Get area equations for bloom occurances.
	Follow up with David for how to calculate area equations properly
	Change checkSolution() to use areaEquation() with values of sliders rather than mock values

6. Get correct descriptions for experiment.
	Place on cii.wwu.edu/springBloom
	Include legend for what different values mean
	Ask David for experiment descriptions, homepage descriptions and footer description


7. Change webdesign and animations.
	Create a page for discussion of theory and its interpretation/uses
	Change any colors necessary in tank
	Make side of tank static values bigger
	Remove unessasary buttons that are on the experiment page
	Change homepage experiment pictures to new snapshots
	Add animations for light/respiration if necessary
	Change any web design colors necessary
	Add animation for sidepanel graphs if necessary
	

# Misc. Definitions (Science)
1. irradiance = light
2. mixing layer depth = depth where different water columns (surface/deep) meet
3. Critical depth = depth where bloom occurs and water columns mix
	Where area 1 = area 2
	Drops with increase in light

# Misc. Definitions (Sliders/Tank)

1. Sliders

2. Tank
