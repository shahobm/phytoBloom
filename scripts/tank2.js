var log = console.log.bind(console);
console.clear();

(function ($) {
	$.fn.analogTank = function (config) {
		let $this = $(this);

		return new AnalogTank($this, config);
	};

	class AnalogTank {
		constructor($this, config) {
	let defaults = {
		tankType: "tower",
        tankWidth: null, // outside width.
        tankHeight: null, // outside height.
        fillPadding: null, // gap between perimeter and inside tank area that displays water.
        borderWidth: 2, // perimeter width.
        borderColor: "#333", // outside border color. usually the perimeter of the tank
        defaultFillColor: "#3fabd4", // default water color. this is assigned to fillColor if water level does not pass any thresholds.
        fillColor: null, // used later to set water color. it could be different color depending on situations.

        // Use as light indicator? Change opacity based on light percentage
        backFillColor: "#8ae2ea", // background color inside the tank where there is no water.
        defaultOpacity: 0.7, // opacity of the background.
        opacity: null,
        opacityAnimation: null,

        innerCornerRadius: 3,
        borderCornerRadius: 5,
        innerWidth: null,
        innerHeight: null,
        fillAnimationColor: null, // used later to set the color while animating.
        fillMaxValue: 100, // maximum possible value for the main text.
        fillMinValue: 0, // minimum possible value for the main text.
        fillValue: null, // value used to display the main text.
        fillUnit: null, // unit that is appended to the main text.
        decimal: 1, // number of decimal places for the main text.
        overlayTextFillOpacity: 0.8, // opacity of the main text.
        arrow: true, // arrow that is displayed to the right of the main text.
        fontFamily: "Helvetica",
        fontWeight: "bold",
        fontSize: 20,
        backFontColor: null,
        backFontAnimationColor: null,
        frontFontColor: null,
        waveWidth: 100,
        amplitude: 3,
        horizontalWaveDuration: 2000,
        transitionDuration: 1000,
        delay: 0,
        ease: d3.easePolyInOut.exponent(4),
        marker: true,
        markerPosition: "in",
        markerGap: [5, 3],
        markerLabelXOffset: 0,
        markerLabelYOffset: 0,
        markerWidth: 1,

        // manages red line length
        markerLength: 1036,

        topMarkerText: null,
        topMarkerColor: "#133440",
        topMarkerFontColor: "#133440",
        bottomMarkerText: null,
        bottomMarkerColor: "#133440",
        bottomMarkerFontColor: "#133440",
        markerFontSize: 10,
        markerFontWeight: "bold",
        markerFontFamily: "Helvetica",
        enableSupportLabel: false,
        supportLabelFontColor: "#133440",
        supportLabelFontFamily: "Helvetica",
        supportLabelFontWeight: "bold",
        supportLabelFontSize: 14,
        supportLabelText: "Mix Layer Depth",
        supportLabelYOffset: -1,
        mergeSupportLabelToBorder: false,
        dualSupportLabel: false,
        topSupportLabelFontColor: "#133440",
        topSupportLabelFontFamily: "Helvetica",
        topSupportLabelFontWeight: "bold",
        topSupportLabelFontSize: 14,
        topSupportLabelText: "",
        topSupportLabelYOffset: -1,
        enableSupportLabelBg: false,
        supportLabelBackgroundColor: "#fff",
        supportLabelBackgroundOpacity: 0.7,
        supportLabelBackgroundHeight: null,
        supportLabelBackgroundWidth: null,
        supportLabelBackgroundBorderWidth: 1,
        supportLabelBackgroundBorderColor: null,
        supportLabelPadding: 0,
        supportLabelWidthFix: 0,
        arrowName: null,
        upArrowName: "\uf176",
        downArrowName: "\uf175",
        noArrowName: "\uf07e",
        arrowFontFamily: "FontAwesome",
        arrowFontWeight: "bold",
        arrowFontSize: 12,
        arrowXOffset: 3,
        arrowYOffset: -1,
        topFillBackArrowColor: null,
        bottomFillBackArrowColor: null,
        frontArrowColor: null,
        backArrowColor: null,
        markerBarXOffset: 3,
        tooltipFontSize: 10,
        thresholds: [],
        lightValue: null, // If light value is set, a secondary text is displayed under the main text.
        lightValueUnit: null, // Unit for lightValue.
        lightValueDecimal: 0, // Number of decimal places for light value.
        lightValueEnabled: false,
        lightValueFontSize: 14,
        lightValueYOffset: 2,
        respirationArrowEnabled: false,
        respirationArrowYOffset: 0,
        respiration: null,
        respirationDecimal: 0,
        respirationEnabled: false,
        respirationFontSize: 14,
        respirationYOffset: 2,
        respirationUnit: '',

        axisScale: null,
        xAxis: null,
    };
    Object.assign(defaults, config);

    this.container = $this;
    Object.assign(this, defaults);
    this.url = window.location.href;

    this.init();
}

    // Constructor
    init() {
      	this.setInitialValues();
      	this.drawSvgContainer();

        // build the tank
        this.initTower();
        //this.setXAxis();
        this.setMarkerAttributes();
        this.calculateDimensions();
        this.setGaugeScale();
        this.getNewHeight();
        this.addThresholdMarkers();
        this.applyFillAttributes();
        this.applyTextAttributes();
        this.applyWaveHorizontalAttributes();
        this.applySupportLabelAttributes();
        this.updateArrowPosition();
        this.tweenWaveHorizontal();
        this.animateFromZero();
        this.repositionElements();
        this.setBisector();
        this.hover();
  	}

    // create box
    drawSvgContainer() {


    	this.width = this.container.outerWidth();
    	this.height = this.container.outerHeight();
    	let viewBoxDef = `0, 0, ${this.width}, ${this.height}`;

    	this.svgContainer = d3.select(this.container[0])
    	.attr('id', 'svg-container')
    	.append("svg")
    	.attr("width", "100%")
    	.attr("height", "100%")
    	.attr("viewBox", viewBoxDef);


    	this.bodyGroup = this.svgContainer.append('g')
    	.attr('id', 'bodyGroup')
    	.attr('transform', `translate(${this.width/2}, ${this.height/2})`);
    }

    // scale that returns pixel value for positioning the waveClip vertically
    setGaugeScale () {
    	this.gaugeScale = d3.scaleLinear()
    	.domain([this.fillMinValue, this.fillMaxValue])
    	.range([(this.innerHeight + this.amplitude)/2, -(this.innerHeight + this.amplitude)/2])
    	.clamp(true);
    }


    getNewHeight () {
    	this.newHeight = this.fillValue === null ? 0 : this.gaugeScale(this.fillValue);
    }

    initTower () {
    	let uniqId = this.uniqId();
      // this.tankGroup = this.bodyGroup.append('g').attr('id', 'tank-group');
      this.waveClip = this.bodyGroup.append('defs').append('clipPath').attr('id', uniqId);
      this.waveHorizontal = this.waveClip.append('path');

      this.backFill = this.bodyGroup.append('rect').attr('id', 'back-fill');

      // add black border
      this.border = this.bodyGroup.append('rect').attr('id', 'border');



      this.behindText = this.bodyGroup.append('text').attr('id', 'behind-text');
      this.behindArrow = this.bodyGroup.append('text').attr('id', 'behind-arrow');

      if (this.lightValueEnabled) {
      	this.lightValueBehindText = this.bodyGroup.append('text').attr('id', 'light-behind-text');
      }

      if (this.respirationEnabled) {
      	this.respirationBehindText = this.bodyGroup.append('text').attr('id', 'change-rate-value-behind-text');
      }

      this.waveGroup = this.bodyGroup.append('g').attr('clip-path', this.getUniqUrl(uniqId));
      this.waterFill = this.waveGroup.append('rect').attr('id', 'water-fill');

      this.overlayText = this.waveGroup.append('text').attr('id', 'overlay-text');
      this.overlayArrow = this.waveGroup.append('text').attr('id', 'overlay-arrow');

      if (this.lightValueEnabled) {
      	this.lightValueOverlayText = this.waveGroup.append('text').attr('id', 'lookup-value-overlay-text');
      }

      if (this.respirationEnabled) {
      	this.respirationOverlayText = this.waveGroup.append('text').attr('id', 'change-rate-value-overlay-text');
      }

      this.supportLabelGroup = this.bodyGroup.append('g').attr('id', 'support-label-group');
      this.supportLabelBg = this.supportLabelGroup.append('rect').attr('id', 'support-label-bg');
      this.supportLabel = this.supportLabelGroup.append('text').attr('id', 'overlay-support-label');
      this.topSupportLabel = this.supportLabelGroup.append('text').attr('id', 'top-overlay-support-label');

      this.topMarkerLabel = this.bodyGroup.append('text').attr('id', 'top-marker-label');
      this.bottomMarkerLabel = this.bodyGroup.append('text').attr('id', 'bottom-marker-label');
      this.markerBarGroup = this.bodyGroup.append('g').attr('id', 'marker-bar-group');
  }

  /* sets the inital text and color to display based on fillValue */
  setInitialValues () {
  	this.lightValueEnabled = this.lightValue !== null ? true : false;
  	this.respirationEnabled = this.respiration !== null ? true : false;

  	this.fillColor = this.defaultFillColor;

  	this.topMarkerText = this.topMarkerText === null ? 0 + " m. MLD".toString() : this.topMarkerText;
  	this.bottomMarkerText = this.bottomMarkerText === null ? 100 + " m. MLD".toString() : this.bottomMarkerText;
  	this.topMarkerFontColor = this.tankType === 'tower' ? '#000' : '#fafafa';
  	this.bottomMarkerFontColor = this.tankType === 'tower' ? '#000' : '#fafafa';
  }

  setMarkerAttributes() {
  	this.applyAttributes(this.topMarkerLabel, {
  		'text-anchor': 'end',
  		'font-family': this.markerFontFamily,
  		'font-size': `${this.markerFontSize}px`,
  		fill: this.topMarkerFontColor,
  		'font-weight': this.markerFontWeight,
  		text: this.topMarkerText
  	});

  	this.applyAttributes(this.bottomMarkerLabel, {
  		'text-anchor': 'end',
  		'font-family': this.markerFontFamily,
  		'font-size': `${this.markerFontSize}px`,
  		fill: this.bottomMarkerFontColor,
  		'font-weight': this.markerFontWeight,
  		text: this.bottomMarkerText
  	});
  }

  calculateDimensions() {
  	this.markerLabelWidth = this.getMaxWidth(this.topMarkerLabel, this.bottomMarkerLabel);
  	let markerGapSum = this.markerGap[0] + this.markerGap[1];

  	if (this.tankType === 'tower') {
  		this.tankWidth = this.width - this.borderWidth;
  		this.tankHeight = this.height - this.borderWidth;

  		if ( this.fillPadding !== null && typeof this.fillPadding === "number" && this.fillPadding !== 0 ) {
          this.innerWidth = this.tankWidth - 2*this.fillPadding; // in case there is a padding, this will be the inner fill part
          this.innerHeight = this.tankHeight - 2*this.fillPadding; // same as above
      } else {
      	this.innerWidth = this.tankWidth - this.borderWidth;
      	this.innerHeight = this.tankHeight - this.borderWidth;
      }
  }
}

// change red line attributes
addThresholdMarkers() {
	let topPixelPosition = this.gaugeScale(this.fillMaxValue) + this.borderWidth;
  
	this.thresholdMarkerPositions = [];
	this.thresholdTooltips = [];
	this.thresholdMarkers = [];

	this.thresholds.forEach( (threshold, i) => {
		let id = this.uniqId();
		let pixelPosition = this.gaugeScale(threshold.value);

    // change red line attributes of the shape svg ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // line should be path?
		let marker = this.markerBarGroup.append('line')
		.datum({ yCoord: pixelPosition, strokeWidth: this.markerWidth, x1: -this.markerLength })

		let tooltip = d3.select(this.container[0]).append('div')
		.datum({ name: threshold.name, value: threshold.value, type: threshold.type })
		.html(function(d) { return '<div>Name: ' + d.name + '</div>' + '<div>Value: ' + d.value + '</div>' + '<div>Type: ' + d.type + '</div>'; })
		.attr('id', `tooltip-${id}`)
		.style('position', 'absolute')
		.style('right', `${this.markerLabelWidth*2}px`)
		.style('top', `${pixelPosition + this.innerHeight/2 - 30}px`)
		.style('padding', '8px')
		.style('background', 'rgba(97,97,97,0.9)')
		.style('color', '#fff')
		.style('font-family', "'Roboto', 'Helvetica', 'Arial', sans-serif")
		.style('font-size', '10px')
		.style('display', 'initial')
		.style('-webkit-animation', 'pulse 200ms cubic-bezier(0, 0, 0.2, 1) forwards')
		.style('animation', 'pulse 200ms cubic-bezier(0, 0, 0.2, 1) forwards');

		if (this.thresholdMarkers.length > 0) {
			this.thresholdMarkerPositions.push({ yCoord: (this.thresholdMarkers[i-1].datum().yCoord + pixelPosition)/2 });
		}

		this.thresholdTooltips.push(tooltip);
		this.thresholdMarkers.push(marker);

		tooltip.style('display', 'none');
	});
}

applyFillAttributes() {
	if (this.tankType === 'tower') {
		this.applyAttributes(this.backFill, {
			x: 0,
			y: 0,
			width: this.innerWidth,
			height: this.innerHeight,
			rx: this.innerCornerRadius,
			ry: this.innerCornerRadius,
			fill: this.backFillColor,
			'fill-opacity': this.backFillOpacity,
			transform: `translate(-${(this.tankWidth - this.borderWidth)/2}, -${(this.tankHeight - this.borderWidth)/2})`
		});

		this.applyAttributes(this.waterFill, {
			datum: { color: this.fillColor },
			x: 0,
			y: 0,
			width: this.innerWidth,
			height: this.innerHeight,
			rx: this.innerCornerRadius,
			ry: this.innerCornerRadius,
			fill: function(d) { return d.color; },
			transform: `translate(-${(this.tankWidth - this.borderWidth)/2}, -${(this.tankHeight - this.borderWidth)/2})`
		});

		this.applyAttributes(this.border, {
			x: 0,
			y: 0,
			width: this.tankWidth,
			height: this.tankHeight,
			rx: this.borderCornerRadius,
			ry: this.borderCornerRadius,
			'fill-opacity': 0,
			stroke: this.borderColor,
			'stroke-width': this.borderWidth,
			transform: `translate(-${this.tankWidth/2}, -${this.tankHeight/2})`
		});
	}
}

applyTextAttributes() {
	let transform = `translate(0, ${this.fontSize/4})`;

	this.applyAttributes(this.behindText, {
		datum: { color: this.backFontColor === null ? this.fillColor : this.backFontColor },
		'text-anchor': 'middle',
		'font-family': this.fontFamily,
		'font-size': `${this.fontSize}px`,
		'font-weight': this.fontWeight,
		fill: function(d) { return d.color; },
		text: `0 ${this.fillUnit}`,
		transform: transform
	});

	this.applyAttributes(this.behindArrow, {
		datum: { color: this.backFontColor === null ? this.fillColor : this.backFontColor },
		'text-anchor': 'middle',
		'font-family': this.arrowFontFamily,
		'font-size': `${this.arrowFontSize}px`,
		'font-weight': this.arrowFontWeight,
		fill: function(d) { return d.color; },
		text: `${this.arrowName === null ? this.noArrowName : this.arrowName}`,
	});

	this.applyAttributes(this.overlayText, {
		datum: { color: this.frontFontColor === null ? "#fff" : this.frontFontColor },
		'text-anchor': 'middle',
		'font-family': this.fontFamily,
		'font-size': `${this.fontSize}px`,
		'font-weight': this.fontWeight,
		fill: function(d) { return d.color; },
		'fill-opacity': this.overlayTextFillOpacity,
		text: `0 ${this.fillUnit}`,
		transform: transform
	});

	this.applyAttributes(this.overlayArrow, {
		datum: { color: this.frontFontColor },
		'text-anchor': 'middle',
		'font-family': this.arrowFontFamily,
		'font-size': `${this.arrowFontSize}px`,
		'font-weight': this.arrowFontWeight,
		fill: function(d) { return d.color; },
		text: `${this.arrowName === null ? this.noArrowName : this.arrowName}`,
	});

	if (this.lightValueEnabled) {
		let lookupTransform = `translate(0, ${this.fontSize/4 + this.lightValueFontSize + this.lightValueYOffset})`;

		this.applyAttributes(this.lightValueBehindText, {
			datum: { color: this.backFontColor === null ? this.fillColor : this.backFontColor },
			'text-anchor': 'middle',
			'font-family': this.fontFamily,
			'font-size': `${this.lightValueFontSize}px`,
			'font-weight': this.fontWeight,
			fill: function(d) { return d.color; },
			text: `0 ${this.lightValueUnit}`,
			transform: lookupTransform
		});

		this.applyAttributes(this.lightValueOverlayText, {
			datum: { color: this.frontFontColor === null ? "#fff" : this.frontFontColor },
			'text-anchor': 'middle',
			'font-family': this.fontFamily,
			'font-size': `${this.lightValueFontSize}px`,
			'font-weight': this.fontWeight,
			fill: function(d) { return d.color; },
			'fill-opacity': this.overlayTextFillOpacity,
			text: `0 ${this.lightValueUnit}`,
			transform: lookupTransform
		});
	}

	if (this.respirationEnabled) {
		let yOffset = this.fontSize/4 + this.respirationFontSize + this.respirationYOffset;

		if (this.lightValueEnabled) {
			yOffset += this.lightValueFontSize + this.lightValueYOffset;
		}

		let rateTransform = `translate(0, ${yOffset})`;

		this.applyAttributes(this.respirationBehindText, {
			datum: { color: this.backFontColor === null ? this.fillColor : this.backFontColor },
			'text-anchor': 'middle',
			'font-family': this.fontFamily,
			'font-size': `${this.respirationFontSize}px`,
			'font-weight': this.fontWeight,
			fill: function(d) { return d.color; },
			text: `0 ${this.respirationUnit}`,
			transform: rateTransform
		});

		this.applyAttributes(this.respirationOverlayText, {
			datum: { color: this.frontFontColor === null ? "#fff" : this.frontFontColor },
			'text-anchor': 'middle',
			'font-family': this.fontFamily,
			'font-size': `${this.respirationFontSize}px`,
			'font-weight': this.fontWeight,
			fill: function(d) { return d.color; },
			'fill-opacity': this.overlayTextFillOpacity,
			text: `0 ${this.respirationUnit}`,
			transform: rateTransform
		});
	}
}

applyWaveHorizontalAttributes() {
	this.clipDef = `M0 0 Q${this.waveWidth/2} ${this.amplitude}, ${this.waveWidth} 0 T${2*this.waveWidth} 0`;
	var minRequiredClipWidth = this.width*2 + 2*this.waveWidth + this.borderWidth/2;
	this.clipWidth = 2*this.waveWidth;

	while ( this.clipWidth < minRequiredClipWidth ) {
		this.clipWidth += this.waveWidth;
		this.clipDef += ` T${this.clipWidth} 0`;
		this.clipWidth += this.waveWidth;
		this.clipDef += ` T${this.clipWidth} 0`;
	}
	this.clipDefArray = [this.clipDef, `L${this.clipWidth}`, `${this.height}`, "L0", `${this.height}`, "Z"];
	this.clipDef = this.clipDefArray.join(" ");

	this.applyAttributes(this.waveHorizontal, {
		d: this.clipDef
	});
}

applySupportLabelAttributes() {
	this.applyAttributes(this.supportLabelBg, {
		datum: { color: this.fillColor },
		width: 50,
		height: 50,
		rx: this.innerCornerRadius,
		ry: this.innerCornerRadius,
		fill: '#fafafa',
		'fill-opacity': this.supportLabelBackgroundOpacity,
		stroke: function(d) { return d.color; },
		'stroke-width': this.supportLabelBackgroundBorderWidth
	});

	this.applyAttributes(this.supportLabel, {
		'text-anchor': 'middle',
		'font-family': this.supportLabelFontFamily,
		'font-size': `${this.supportLabelFontSize}px`,
		fill: this.supportLabelFontColor,
		'font-weight': this.supportLabelFontWeight,
		text: `${this.supportLabelText}`
	});

	this.applyAttributes(this.topSupportLabel, {
		'text-anchor': 'middle',
		'font-family': this.supportLabelFontFamily,
		'font-size': `${this.topSupportLabelFontSize}px`,
		fill: this.supportLabelFontColor,
		'font-weight': this.supportLabelFontWeight,
		text: `${this.topSupportLabelText}`
	});
}

tweenWaveHorizontal () {
	let that = this;
	let startHeight = (this.tankHeight - this.innerHeight)/2 - this.amplitude/2;
	let transformStart = `translate(-${this.width + 2*this.waveWidth}, ${startHeight})`;
	let transformEnd = `translate(-${this.width}, ${startHeight})`;

	this.waveHorizontal.attr('transform', transformStart);

	animate();

	function animate() {
		that.waveHorizontal
		.transition()
		.duration(that.horizontalWaveDuration)
		.ease(d3.easeLinear)
		.attrTween("transform", function(d) {
			return d3.interpolateString(transformStart, transformEnd);
		}).on("end", function (d) {
			animate();
		});
	}
}

animateFromZero () {
	this.waveClip
	.datum({ transform: `translate(0, ${this.gaugeScale(this.fillMinValue) + this.amplitude})`})
	.attr('transform', function(d) { return d.transform; });
	this.animateNewHeight(this.fillValue);
}

animateNewHeight (val) {
	let that = this;
	if ( typeof val !== "undefined" ) {
		this.newHeight = this.gaugeScale(val);
		this.fillValue = 100-val;
	}

	this.tweenWaveVertical();
	this.tweenElements();
}

tweenWaveVertical() {
	let endTransform = `translate(0, ${this.newHeight})`;

	return this.waveClip
	.transition()
	.delay(this.delay)
	.duration(this.transitionDuration)
	.ease(this.ease)
	.attrTween("transform", function(d) {
		let interpolator = d3.interpolateString(d.transform, endTransform);

		return function(t) {
			d.transform = interpolator(t);
			return d.transform;
		};
	});
}

calculateColor () {
	this.fillAnimationColor = this.fillColor === null ? this.defaultFillColor : this.fillColor;
	this.backFontAnimationColor = this.backFontColor === null ? this.fillColor : this.backFontColor;
	this.backArrowAnimationColor = this.backArrowColor === null ? this.fillColor : this.backArrowColor;
}

/*
calculateOpacity() {
	this.opacityAnimation = this.opacity === null ? this.defaultFillColor : this.fillColor;
}
*/
tweenElements () {
	this.calculateColor();
	this.colorTransition(this.waterFill, "fill", this.fillAnimationColor);
	this.colorTransition(this.supportLabelBg, 'stroke', this.fillAnimationColor);
/*
	this.calculateOpacity();
	this.opacityTransition(this.waterFill, "fill", this.opacityAnimation);
*/

	this.tweenText();

	if ( this.arrow === true ) {
		this.colorTransition(this.behindArrow, "fill", this.backArrowAnimationColor);
		this.colorTransition(this.overlayArrow, "fill", this.frontArrowColor);
	}
}

colorTransition(selection, attribute, targetColor) {
	selection
	.transition()
	.delay(this.delay)
	.duration(this.transitionDuration)
	.ease(this.ease)
	.attrTween(attribute, function(d) {
		let interpolator = d3.interpolateRgb(d.color, targetColor);

		return function(t) {
			d.color = interpolator(t);
			return d.color;
		};
	});
}
/*
opacityTransition(selection, attribute, targetColor) {
	selection
	.transition()
	.delay(this.delay)
	.duration(this.transitionDuration)
	.ease(this.ease)
	.attrTween(attribute, function(d) {

	});
}
*/
textFormatter(val) {
	if (this.fillUnit) {
		return `${(Number(Math.round(parseFloat(val) + 'e' + this.decimal) + 'e-' + this.decimal)).toFixed(this.decimal)} ${this.fillUnit}`;
	}
	return `${(Number(Math.round(parseFloat(val) + 'e' + this.decimal) + 'e-' + this.decimal)).toFixed(this.decimal)}`;
}

lookupTextFormatter(val) {
	if (this.lightValueUnit) {
		return `${Number(Math.round(parseFloat(val) + 'e' + this.lightValueDecimal) + 'e-' + this.lightValueDecimal).toFixed(this.lightValueDecimal)} ${this.lightValueUnit}`;
	}
	return `${Number(Math.round(parseFloat(val) + 'e' + this.lightValueDecimal) + 'e-' + this.lightValueDecimal).toFixed(this.lightValueDecimal)}`;
}

respirationTextFormatter(val) {
	if (this.respirationUnit) {
		return `${Number(Math.round(parseFloat(val) + 'e' + this.respirationDecimal) + 'e-' + this.respirationDecimal).toFixed(this.respirationDecimal)} ${this.respirationUnit}`;
	}
	return `${Number(Math.round(parseFloat(val) + 'e' + this.respirationDecimal) + 'e-' + this.respirationDecimal).toFixed(this.respirationDecimal)}`;
}

tweenText() {
	let that = this;

	this.behindText
	.transition()
	.delay(this.delay)
	.ease(this.ease)
	.duration(this.transitionDuration)
	.tween("text", function(d) {
		let node = this;
		let interpolate = d3.interpolate(that.textFormatter(node.textContent), that.textFormatter(that.fillValue));

		return function(t) {
			node.textContent = that.textFormatter(interpolate(t));
		};
	})
	.attrTween("fill", function(d) {
		let interpolator = d3.interpolateRgb(d.color, that.backFontAnimationColor);

		return function(t) {
			d.color = interpolator(t);
			return d.color;
		};
	});

	this.overlayText
	.transition()
	.delay(this.delay)
	.ease(this.ease)
	.duration(this.transitionDuration)
	.tween("text", function(d) {
		let node = this;
		let interpolate = d3.interpolate(that.textFormatter(node.textContent), that.textFormatter(that.fillValue));
		return function(t) {
			if (that.arrow === true) {
				that.updateArrowPosition();
			}
			node.textContent = that.textFormatter(interpolate(t));
		};
	})
	.attrTween("fill", function(d) {
		let interpolator = d3.interpolateRgb(d.color, that.frontFontColor);

		return function(t) {
			d.color = interpolator(t);
			return d.color;
		};
	})
	.on('end', function() {
		if (that.arrow === true) {
			that.updateArrowPosition();
		}
	});

	if (this.lightValueEnabled) {
		this.lightValueBehindText
		.transition()
		.delay(this.delay)
		.ease(this.ease)
		.duration(this.transitionDuration)
		.tween("text", function(d) {
			let node = this;
			let interpolate = d3.interpolate(that.lookupTextFormatter(node.textContent), that.lookupTextFormatter(that.lightValue));

			return function(t) {
				node.textContent = that.lookupTextFormatter(interpolate(t));
			};
		})
		.attrTween("fill", function(d) {
			let interpolator = d3.interpolateRgb(d.color, that.backFontAnimationColor);

			return function(t) {
				d.color = interpolator(t);
				return d.color;
			};
		});

		this.lightValueOverlayText
		.transition()
		.delay(this.delay)
		.ease(this.ease)
		.duration(this.transitionDuration)
		.tween("text", function(d) {
			let node = this;
			let interpolate = d3.interpolate(that.lookupTextFormatter(node.textContent), that.lookupTextFormatter(that.lightValue));
			return function(t) {
				node.textContent = that.lookupTextFormatter(interpolate(t));
			};
		})
		.attrTween("fill", function(d) {
			let interpolator = d3.interpolateRgb(d.color, that.frontFontColor);

			return function(t) {
				d.color = interpolator(t);
				return d.color;
			};
		});
	}

	if (this.respirationEnabled) {
		this.respirationBehindText
		.transition()
		.delay(this.delay)
		.ease(this.ease)
		.duration(this.transitionDuration)
		.tween("text", function(d) {
			let node = this;
			let interpolate = d3.interpolate(that.respirationTextFormatter(node.textContent), that.respirationTextFormatter(that.respiration));

			return function(t) {
				node.textContent = that.respirationTextFormatter(interpolate(t));
			};
		})
		.attrTween("fill", function(d) {
			let interpolator = d3.interpolateRgb(d.color, that.backFontAnimationColor);

			return function(t) {
				d.color = interpolator(t);
				return d.color;
			};
		});

		this.respirationOverlayText
		.transition()
		.delay(this.delay)
		.ease(this.ease)
		.duration(this.transitionDuration)
		.tween("text", function(d) {
			let node = this;
			let interpolate = d3.interpolate(that.respirationTextFormatter(node.textContent), that.respirationTextFormatter(that.respiration));
			return function(t) {
				node.textContent = that.respirationTextFormatter(interpolate(t));
			};
		})
		.attrTween("fill", function(d) {
			let interpolator = d3.interpolateRgb(d.color, that.frontFontColor);

			return function(t) {
				d.color = interpolator(t);
				return d.color;
			};
		});
	}
}

updateArrowPosition () {
	let {xOffset, yOffset} = this.calculateArrowPosition();
	this.behindArrow.attr('x', xOffset).attr('y', yOffset);
	this.overlayArrow.attr('x', xOffset).attr('y', yOffset);
}

calculateArrowPosition () {
	let xOffset, yOffset;

	if (this.respirationArrowEnabled && this.respirationEnabled) {
		xOffset = this.respirationOverlayText.node().getBBox().width/2 + this.overlayArrow.node().getBBox().width/2 + this.arrowXOffset;
		yOffset = this.fontSize/4 + this.respirationFontSize + this.respirationYOffset - 1;

		if (this.lightValueEnabled) {
			yOffset += this.lightValueFontSize + this.lightValueYOffset;
		}
	} else {
		xOffset = this.overlayText.node().getBBox().width/2 + this.overlayArrow.node().getBBox().width + this.arrowXOffset;
		yOffset = this.overlayArrow.node().getBBox().height/4 + this.arrowYOffset;
	}

	return {xOffset: xOffset, yOffset: yOffset};
}

repositionElements () {
	this.repositionMarker();
	this.setSupportLabelText(this.supportLabelText);
}

    // calculate the needed transformation values for positioning the markers
    repositionMarker () {
    	let topMarkerLabelTrans = `translate(${this.innerWidth/2 + this.markerLabelXOffset - this.markerFontSize/4}, -${this.innerHeight/2 - this.markerFontSize + this.markerLabelYOffset})`;
    	let bottomMarkerLabelTrans = `translate(${this.innerWidth/2 + this.markerLabelXOffset - this.markerFontSize/4}, ${this.innerHeight/2 - this.markerFontSize/4 + this.markerLabelYOffset})`;

    	this.topMarkerLabel.attr('transform', topMarkerLabelTrans);
    	this.bottomMarkerLabel.attr('transform', bottomMarkerLabelTrans);


    	if (this.tankType === 'tower') {
    		let markerBarGroupTrans = `translate(${this.innerWidth/2}, 0)`;

    		this.markerBarGroup.attr('transform', markerBarGroupTrans);
    	}
    }

    repositionSupportLabelGroup() {
    	this.repositionSupportLabelBg();
    	this.repositionSupportLabel();

    	this.supportLabelGroup
    	.attr('transform', `translate(0, ${this.height/2 - this.borderWidth - this.supportLabelBgHeight/2})`);
    }

    repositionSupportLabelBg () {
    	let paddingForAesthetic = 1.6*this.supportLabelPadding;
    	let {width, height} = this.getSupportLabelDimensions();
    	let requiredWidth = width + 2*this.supportLabelPadding + paddingForAesthetic;
    	let requiredHeight = height + 2*this.supportLabelPadding;
    	this.supportLabelBgWidth = requiredWidth;
    	this.supportLabelBgHeight = requiredHeight;

    	this.supportLabelBg
    	.attr('width', this.supportLabelBgWidth)
    	.attr('height', this.supportLabelBgHeight)
    	.attr('transform', `translate(-${this.supportLabelBgWidth/2}, -${this.supportLabelBgHeight/2})`);
    }

    repositionSupportLabel () {
    	if ( this.dualSupportLabel === true ) {
    		this.topSupportLabelTrans = `translate(0, ${this.supportLabelYOffset + this.topSupportLabelYOffset})`;
    		this.supportLabelTrans = `translate(0, ${this.supportLabelFontSize + this.supportLabelYOffset})`;
    	} else if ( this.dualSupportLabel === false ) {
    		this.supportLabelTrans = `translate(0, ${this.supportLabelFontSize/2 + this.supportLabelYOffset})`;
    	}
    	this.topSupportLabel.attr('transform', this.topSupportLabelTrans);
    	this.supportLabel.attr('transform', this.supportLabelTrans);
    }

    applyAttributes(selection, datum = {}) {
    	let properties = Object.getOwnPropertyNames(datum);
    	properties.forEach((p) => {
    		if (p === 'datum') {
    			return selection.datum( datum[p] );
    		} else if (p === 'text') {
    			return selection.text( datum[p] );
    		} else if (p === 'style') {
    			return selection.style( datum[p] );
    		} else {
    			return selection.attr( p, datum[p] );
    		}
    	});
    }

    getSupportLabelDimensions () {
    	let width, height;
    	if ( this.dualSupportLabel === true ) {
    		width = this.getMaxWidth(this.supportLabel, this.topSupportLabel);
    		height = this.supportLabelFontSize - this.supportLabelYOffset + this.topSupportLabelFontSize - this.topSupportLabelYOffset;
    	} else if ( this.dualSupportLabel === false ) {
    		width = this.supportLabel.node().getBBox().width;
    		height = this.supportLabelFontSize - this.supportLabelYOffset;
    	}

    	return {width: width, height: height};
    }

    getHeight(selection) {
    	return selection.node().getBBox().height;
    }

    getMaxWidth (first, second) {
    	if (typeof second === 'object') {
    		return Math.max(first.node().getBBox().width, second.node().getBBox().width);
    	}
    	return first.node().getBBox().width;
    }

    getXCoordOfEllipse(y) {
    	return Math.sqrt( Math.pow(this.tankRx, 2)*(1 - ( Math.pow(y, 2)/Math.pow(this.tankRy, 2) )) );
    }

    getYCoordOfEllipse(x) {
    	return Math.sqrt( Math.pow(this.tankRy, 2)*(1 - ( Math.pow(x, 2)/Math.pow(this.tankRx, 2) )) );
    }

    slopeOfLineTangentToEllipse(x, y) {
    	return -x*Math.pow(this.tankRy,2)/(y*Math.pow(this.tankRx,2));
    }

    setDecimal (val) {
    	this.decimal = val;
    	this.tweenText();
    }

    updateHeight (val) {
    	this.animateNewHeight(100-val);
    }

    /* TODO connect light value to change the opacity of the back fill color of the tank.*/ 
    updateLightValue (val) {
    	this.lightValue = val;
    	this.animateNewHeight(this.fillValue);
    	this.backFillOpacity = 0.1;
    }

    updateRespiration (val) {
    	this.respiration = val;
    	this.animateNewHeight(this.fillValue);
    }

    setMarkerText (top, bottom) {
    	if ( this.marker === true ) {
    		this.topMarkerLabel.text(top);
    		this.bottomMarkerLabel.text(bottom);
    	} else {
    		console.log("markers are not enabled.");
    	}
    	this.repositionMarker();
    }

    setSupportLabelText (...args) {
    	if ( this.enableSupportLabel === true ) {
    		if ( args.length === 1 ) {
    			this.dualSupportLabel = false;
    			this.topSupportLabel.attr('fill-opacity', 0);
    			this.supportLabel.text(args[0]);
    		} else if ( args.length === 2 ) {
    			this.dualSupportLabel = true;
    			this.topSupportLabel.attr('fill-opacity', 1);
    			this.supportLabel.text(args[1]);
    			this.topSupportLabel.text(args[0]);
    		}
    	}
      //resize and reposition support label elements
      this.repositionSupportLabelGroup();
  }

  updateFillColor (options) {
  	if ( typeof options === "object" ) {
  		if ( "backFillColor" in options ) {
  			this.backFillColor = options.backFillColor;
  		}

  		this.tweenElements();
  	}
  }

  updateColor (color) {
  	this.fillColor = color;
  	this.backFontColor = color;
  	this.backFillColor = color;
  	this.tweenElements();
  }

  click(callback) {
  	if ( typeof callback !== "function" ) {
  		throw new Error("argument must be a function");
  	}
  	this.svgContainer.on("click", callback);
  }

  setBisector() {
  	this.bisector = d3.bisector(function(d) { return d.yCoord; }).left;
  }

  transitionMarker(marker, targetWidth, targetX1) {
  	marker
  	.transition()
  	.duration(200)
  	.ease(d3.easeLinear)
  	.attrTween('stroke-width', function(d) {
  		let interpolator = d3.interpolateNumber(d.strokeWidth, targetWidth);

  		return function(t) {
  			d.strokeWidth = interpolator(t);
  			return d.strokeWidth;
  		};
  	})
  	.attrTween('x1', function(d) {
  		let interpolator = d3.interpolateNumber(d.x1, targetX1);

  		return function(t) {
  			d.x1 = interpolator(t);
  			return d.x1;
  		};
  	});
  }

  hover() {
  	d3.select(this.svgContainer.node().parentNode).on('mouseleave', () => {
  		this.thresholdMarkers.forEach( (marker, i) => {
  			this.transitionMarker(marker, this.markerWidth, -this.markerLength);
  			this.thresholdTooltips[i].style('display', 'none');
  		});
  	});

  	d3.select(this.svgContainer.node().parentNode).on('mousemove', () => {
  		let yCoord = d3.mouse(this.markerBarGroup.node())[1];
  		let locationIndex = this.bisector(this.thresholdMarkerPositions, yCoord);

  		if (locationIndex >= 0) {
  			this.thresholdMarkers.forEach( (marker, i) => {
  				if ( i === locationIndex) {
  					this.transitionMarker(marker, this.markerWidth+3, -(this.markerLength+3));
  					this.thresholdTooltips[i].style('display', 'initial');
  				} else {
  					this.transitionMarker(marker, this.markerWidth, -this.markerLength);
  					this.thresholdTooltips[i].style('display', 'none');
  				}
  			});
  		} else {
  			this.transitionMarker(this.thresholdMarkers[0], this.markerWidth+3, -(this.markerLength+3));
  			this.thresholdTooltips[0].style('display', 'initial');
  		}
  	});
  }

  /* Utility Functions */
  uniqId() {
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return "clipPath" + Math.random().toString(36).substr(2, 9);
  }
  getUniqUrl(id) {
  	return `url(${this.url}#${id})`;
  }

  insertFirstBeforeSecond(container, first, second) {
  	return container.insert(
  		function() { return first.node(); },
  		function() { return second.node(); }
  		);
  }

  insertFirstAfterSecond(container, first, second) {
  	container.insert(
  		function() { return first.node(); },
  		function() { return second.node(); }
  		);

  	return container.insert(
  		function() { return second.node(); },
  		function() { return first.node(); }
  		);
  }

  appendSecondElementToFirst(first, ...args) {
      args.forEach((arg) => first.append( () => arg.node() ) );  // for each second argument, return a function: first.append( function(arg) { arg.node() });
  }
}

})(jQuery);

/* y axis values */
let thresholds = [
{
	name: 'Critical Depth',
	value: 40,
	type: 'Low',
	alarm: false
}
];

/* inital text values */
let options = {
	tankType: 'tower',
	fillValue: 50,
	fillUnit: "m MLD",
	supportLabelPadding: 5,
	frontFontColor: "#003B42",
	thresholds: thresholds,

	lightValueDecimal: 1,
	respirationDecimal: 1,
	respirationArrowEnabled: true,
	respiration: 1,
	respirationUnit: 'Respiration'
}

let tank = $('.tankWrapper').analogTank(options);


// expand tank to desired page width
$(".tankWrapper").resizable({
	stop: function( event, ui ) {
		tank.redraw();
	}
});

let that = this;

tank.click(function () {
	var randomVal = getRandom();
	tank.updateHeight(randomVal);
});

function bloomColor() {
	tank.updateColor("#669900");

}

function noBloomColor() {
  tank.updateColor("#3fabd4");

}

function tower() {
	tank.tankType = 'tower';
	delete tank.topMarkerFontColor;
	delete tank.bottomMarkerFontColor;
	tank.redraw();
}