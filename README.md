# phytoBloom

The site is accesible at http://cii.wwu.edu/shull/algeaBloom/

Spring Phytoplankton Bloom Simulation
Sverdrop's Critical Depth Concept
A web app for students to learn plankto bloom prediction models.

# About
A user will use the critical depth algorithim with some values to solve the equation. Students may then test their understanding of the Sverdrup critical depth model by inputting light/depth/date variables to see when a bloom will occur given the scenario.

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
	Calculate the value of the critical depth

--Tank
---scripts -> tank(1-3).js
	Lines:
	(1-156) Construct tank with base values and call functions to set inital values and functions
	(157-676) Apply inital tank dimensions, color, text attributes and wave animations
	(677-975) Allows changes in depth and color to be applies and corresponding text positioning
	(976-1103) Call these functions to update values of the tank given slider values
	(1104-1139) Utility functions
	(1125-1254) Change right sidebar functions
	(1255-1274) Change inital text values and colors
	(1275-1284) Change tank size based on given CSS values in assets -> css -> tank.css
	(1285-1304) Functions for date and random calculations
	(1305-1340) Button calls that are below the tank and description on the webpage.

--Chart
---scripts -> chart(1-3).js

# Misc. Definitions (Science)
1. irradiance = light
2. mixing layer depth = depth where different water columns (surface/deep) meet
3. Critical depth = depth where bloom occurs and water columns mix
	Where area 1 = area 2
	Drops with increase in light

calculate2.m is the original matlab code the critical depth calculation is based on.