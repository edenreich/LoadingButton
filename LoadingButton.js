var LoadingButton = function() {

	'use strict';

	/**
	 * stores the button element.
	 */
	var element = {};

	/**
	 * stores the text element.
	 */
	var elementText = {};

	/**
	 * stores the Button original text.
	 */
	var elementOriginalText = {};

	/**
	 * stores the Button Text.
	 */
	var elementOriginalInnerText = '';

	/**
	 * stores the Button Id.
	 */
	var elementId = '';

	/**
	 * stores the loader overlay.
	 */
	var loader = {};

	/**
	 * stores the Default Settings.
	 */
	var settings = {
		progressColor: 'green',
		bindToElementById: 'selector',
		buttonColor: 'blue',
		buttonWidth: '200px',
		buttonHeight: '80px',
		checkMarkColor: '#0DFF84',
		fontSize: '56px',
		fontColor: '#ffffff',
		backToOriginalState: true,
	}

	/**
	 * - checks if the developer passed own settings.
	 * - check if the element exist in the DOM.
	 * - add a style tag to the head.
	 */
	function init(options) {
		settings = options || settings;

		if(document.getElementById(settings.bindToElementById)) {
			element = document.getElementById(settings.bindToElementById);
			elementOriginalInnerText = element.innerHTML;
			elementId = settings.bindToElementById;
		} else {
			throw new Error('Selector does not exist in the DOM '+ settings.bindToElementById);
		}

		addStyleTags();
		wrapInnerHTML();
		addHoverEvents();
	}

	/**
	 * start the loader overlay.
	 */
	function start() {
		var regExp = new RegExp('(?:^|\s)(animated|loading)(?!\S)');

		if(regExp.test(element.className)) {
			return;
		}

		if(element.className) {
			element.className = element.className +' loading';
		} else {
			element.className = 'loading';
		}

		elementText.className = elementText.className +' fade-out';

		loader = document.createElement('div');
		loader.className = 'loader';
		element.appendChild(loader);
	}

	/**
	 * wrap the text that exist inside the button in a div with class text.
	 */
	function wrapInnerHTML() {
		elementText = document.createElement('div');
		elementText.className = 'text';
		elementText.innerHTML = elementOriginalInnerText;
		element.innerHTML = '';
		element.appendChild(elementText);
	}

	/**
	 * Stop the loader and add a checkmark in the button.
	 */
	function stop() {
		element.className = element.className.replace('loading', '');
		element.innerHTML = '';
		element.className = 'animated';

		var checkMark = document.createElement('div');
		checkMark.className = 'check-mark';
		element.appendChild(checkMark);

		if(settings.backToOriginalState) setTimeout(reset, 2000);
	}
	
	/**
	 * reset the button element to its original state.
	 */
	function reset() {
		element.className = '';
		wrapInnerHTML();
	}

	/**
	 * add style tag to the head tag.
	 */
	function addStyleTags() {
		var head = document.head || document.getElementsByTagName('head')[0];
		var styleTag = document.createElement('style');
		styleTag.innerHTML = `#`+elementId+` {
					z-index: 1;
					width: `+settings.buttonWidth+`;
					height: `+settings.buttonHeight+`;
					background: `+settings.buttonColor+`;
					color: `+settings.fontColor+`;
					font-size: `+settings.fontSize+`;
					border: 0;
					position: relative;
					overflow: hidden;
				      }

				      #`+elementId+`:hover {
					cursor: pointer;
				      }

				      .text {
					z-index: 4;
					text-align: center;
				      }

				      .loader {
					opacity: 0.8;
					z-index: 0;
				 	position: absolute;
					top:0;
					left:0;
					background-color: `+settings.progressColor+`;
					height: 100%;
					animation-name: load;
    					animation-duration: 4s;
    					animation-fill-mode: forwards;
				      }

				      .check-mark {
					z-index: 3;
					display: inline-block;
					margin: 0 auto;
					width: 10px;
					height: 30px;
					border: 10px solid `+settings.checkMarkColor+`;
					border-top: none;
					border-left: none;
					transform: rotate(35deg);
					vertical-align: middle;
				      }

				      .fade-out {
				  	opacity: 1;
					animation-name: fade-out;
    					animation-duration: 3s;
    					animation-fill-mode: forwards;
				      }

				      @keyframes load {
					from {
					  width: 0;
					} to {
					  width: 100%;
					}
				      }

				      @-webkit-keyframes load {
					from {
					  width: 0;
					} to {
					  width: 100%;
					}

				      @keyframes fade-out {
					from {
					  opacity: 1;
					} to {
					  opacity: 0;
					}
				      }

				      @-webkit-keyframes fade-out {
					from {
					  opacity: 1;
					} to {
					  opacity: 0;
					}
				      }`;

		styleTag.setAttribute('id', settings.bindToElementById +'ButtonCSS');
		head.appendChild(styleTag);
	}

	/**
	 * bind the click event.
	 */
	function onclick(callback) {
		element.onclick = function() { 
			start();
			callback();
		}
	}
	
	/**
	 * bind the hover event.
	 */
	function addHoverEvents() {
		element.onmouseover = function() {
			if(element.className == 'loading') return;
			
			elementText.innerHTML = 'send';
		};
	}
	
	return {
		start: start,
		stop: stop,
		settings: function(options) {
			init(options);
		},
		onclick: onclick,
	};
	
};
