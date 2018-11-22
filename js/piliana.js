/**
 * Piliana 1.0.0
 * pili-ana is a javascript-only app which allows journalists to efficiently interact with the highlighted opportunities, approve or delete user comments and to reply to user comments.
 * https://github.com/Fixxpunkt/pili-ana
 *
 * Copyright 2018-2019 Fixxpunkt AG
 *
 * Licensed under the MIT
 *
 * Released on: November 22, 2018
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.Piliana = factory());
}(this, (function () { 'use strict';
	/**
	 * SSR Window 1.0.1
	 * Better handling for window object in SSR environment
	 * https://github.com/nolimits4web/ssr-window
	 *
	 * Copyright 2018, Vladimir Kharlampidi
	 *
	 * Licensed under MIT
	 *
	 * Released on: July 18, 2018
	 */
	var doc = (typeof document === 'undefined') ? {
		body: {},
		addEventListener: function addEventListener() {},
		removeEventListener: function removeEventListener() {},
		activeElement: {
			blur: function blur() {},
			nodeName: '',
		},
		querySelector: function querySelector() {
			return null;
		},
		querySelectorAll: function querySelectorAll() {
			return [];
		},
		getElementById: function getElementById() {
			return null;
		},
		createEvent: function createEvent() {
			return {
				initEvent: function initEvent() {},
			};
		},
		createElement: function createElement() {
			return {
				children: [],
				childNodes: [],
				style: {},
				setAttribute: function setAttribute() {},
				getElementsByTagName: function getElementsByTagName() {
					return [];
				},
			};
		},
		location: { hash: '' },
	} : document; // eslint-disable-line

	var win = (typeof window === 'undefined') ? {
		document: doc,
		navigator: {
			userAgent: '',
		},
		location: {},
		history: {},
		CustomEvent: function CustomEvent() {
			return this;
		},
		addEventListener: function addEventListener() {},
		removeEventListener: function removeEventListener() {},
		getComputedStyle: function getComputedStyle() {
			return {
				getPropertyValue: function getPropertyValue() {
					return '';
				},
			};
		},
		Image: function Image() {},
		Date: function Date() {},
		screen: {},
		setTimeout: function setTimeout() {},
		clearTimeout: function clearTimeout() {},
	} : window; // eslint-disable-line

	/**
	 * Dom7 2.1.2
	 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
	 * http://framework7.io/docs/dom.html
	 *
	 * Copyright 2018, Vladimir Kharlampidi
	 * The iDangero.us
	 * http://www.idangero.us/
	 *
	 * Licensed under MIT
	 *
	 * Released on: September 13, 2018
	 */

	var Dom7 = function Dom7(arr) {
		var self = this;
		// Create array-like object
		for (var i = 0; i < arr.length; i += 1) {
			self[i] = arr[i];
		}
		self.length = arr.length;
		// Return collection with methods
		return this;
	};

	function $(selector, context) {
		var arr = [];
		var i = 0;
		if (selector && !context) {
			if (selector instanceof Dom7) {
				return selector;
			}
		}
		if (selector) {
			// String
			if (typeof selector === 'string') {
				var els;
				var tempParent;
				var html = selector.trim();
				if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
					var toCreate = 'div';
					if (html.indexOf('<li') === 0) { toCreate = 'ul'; }
					if (html.indexOf('<tr') === 0) { toCreate = 'tbody'; }
					if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) { toCreate = 'tr'; }
					if (html.indexOf('<tbody') === 0) { toCreate = 'table'; }
					if (html.indexOf('<option') === 0) { toCreate = 'select'; }
					tempParent = doc.createElement(toCreate);
					tempParent.innerHTML = html;
					for (i = 0; i < tempParent.childNodes.length; i += 1) {
						arr.push(tempParent.childNodes[i]);
					}
				} else {
					if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
						// Pure ID selector
						els = [doc.getElementById(selector.trim().split('#')[1])];
					} else {
						// Other selectors
						els = (context || doc).querySelectorAll(selector.trim());
					}
					for (i = 0; i < els.length; i += 1) {
						if (els[i]) { arr.push(els[i]); }
					}
				}
			} else if (selector.nodeType || selector === win || selector === doc) {
				// Node/element
				arr.push(selector);
			} else if (selector.length > 0 && selector[0].nodeType) {
				// Array of elements or instance of Dom
				for (i = 0; i < selector.length; i += 1) {
					arr.push(selector[i]);
				}
			}
		}
		return new Dom7(arr);
	}

	$.fn = Dom7.prototype;
	$.Class = Dom7;
	$.Dom7 = Dom7;

	function unique(arr) {
		var uniqueArray = [];
		for (var i = 0; i < arr.length; i += 1) {
			if (uniqueArray.indexOf(arr[i]) === -1) { uniqueArray.push(arr[i]); }
		}
		return uniqueArray;
	}
	function addClass(className) {
		if (typeof className === 'undefined') {
			return this;
		}
		var classes = className.split(' ');
		for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
				if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.add(classes[i]); }
			}
		}
		return this;
	}
	function removeClass(className) {
		var classes = className.split(' ');
		for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
				if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.remove(classes[i]); }
			}
		}
		return this;
	}
	function hasClass(className) {
		if (!this[0]) { return false; }
		return this[0].classList.contains(className);
	}
	function toggleClass(className) {
		var classes = className.split(' ');
		for (var i = 0; i < classes.length; i += 1) {
			for (var j = 0; j < this.length; j += 1) {
				if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') { this[j].classList.toggle(classes[i]); }
			}
		}
		return this;
	}
	function attr(attrs, value) {
		var arguments$1 = arguments;

		if (arguments.length === 1 && typeof attrs === 'string') {
			// Get attr
			if (this[0]) { return this[0].getAttribute(attrs); }
			return undefined;
		}

		// Set attrs
		for (var i = 0; i < this.length; i += 1) {
			if (arguments$1.length === 2) {
				// String
				this[i].setAttribute(attrs, value);
			} else {
				// Object
				// eslint-disable-next-line
				for (var attrName in attrs) {
					this[i][attrName] = attrs[attrName];
					this[i].setAttribute(attrName, attrs[attrName]);
				}
			}
		}
		return this;
	}
	function removeAttr(attr) {
		for (var i = 0; i < this.length; i += 1) {
			this[i].removeAttribute(attr);
		}
		return this;
	}
	function data(key, value) {
		var el;
		if (typeof value === 'undefined') {
			el = this[0];
			// Get value
			if (el) {
				if (el.dom7ElementDataStorage && (key in el.dom7ElementDataStorage)) {
					return el.dom7ElementDataStorage[key];
				}

				var dataKey = el.getAttribute(("data-" + key));
				if (dataKey) {
					return dataKey;
				}
				return undefined;
			}
			return undefined;
		}

		// Set value
		for (var i = 0; i < this.length; i += 1) {
			el = this[i];
			if (!el.dom7ElementDataStorage) { el.dom7ElementDataStorage = {}; }
			el.dom7ElementDataStorage[key] = value;
		}
		return this;
	}
	function transform(transform) {
		for (var i = 0; i < this.length; i += 1) {
			var elStyle = this[i].style;
			elStyle.webkitTransform = transform;
			elStyle.transform = transform;
		}
		return this;
	}
	function transition(duration) {
		if (typeof duration !== 'string') {
			duration = duration + "ms"; // eslint-disable-line
		}
		for (var i = 0; i < this.length; i += 1) {
			var elStyle = this[i].style;
			elStyle.webkitTransitionDuration = duration;
			elStyle.transitionDuration = duration;
		}
		return this;
	}
	function on() {
		var assign;

		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];
		var eventType = args[0];
		var targetSelector = args[1];
		var listener = args[2];
		var capture = args[3];
		if (typeof args[1] === 'function') {
			(assign = args, eventType = assign[0], listener = assign[1], capture = assign[2]);
			targetSelector = undefined;
		}
		if (!capture) { capture = false; }

		function handleLiveEvent(e) {
			var target = e.target;
			if (!target) { return; }
			var eventData = e.target.dom7EventData || [];
			if (eventData.indexOf(e) < 0) {
				eventData.unshift(e);
			}
			if ($(target).is(targetSelector)) { listener.apply(target, eventData); }
			else {
				var parents = $(target).parents(); // eslint-disable-line
				for (var k = 0; k < parents.length; k += 1) {
					if ($(parents[k]).is(targetSelector)) { listener.apply(parents[k], eventData); }
				}
			}
		}
		function handleEvent(e) {
			var eventData = e && e.target ? e.target.dom7EventData || [] : [];
			if (eventData.indexOf(e) < 0) {
				eventData.unshift(e);
			}
			listener.apply(this, eventData);
		}
		var events = eventType.split(' ');
		var j;
		for (var i = 0; i < this.length; i += 1) {
			var el = this[i];
			if (!targetSelector) {
				for (j = 0; j < events.length; j += 1) {
					var event = events[j];
					if (!el.dom7Listeners) { el.dom7Listeners = {}; }
					if (!el.dom7Listeners[event]) { el.dom7Listeners[event] = []; }
					el.dom7Listeners[event].push({
						listener: listener,
						proxyListener: handleEvent,
					});
					el.addEventListener(event, handleEvent, capture);
				}
			} else {
				// Live events
				for (j = 0; j < events.length; j += 1) {
					var event$1 = events[j];
					if (!el.dom7LiveListeners) { el.dom7LiveListeners = {}; }
					if (!el.dom7LiveListeners[event$1]) { el.dom7LiveListeners[event$1] = []; }
					el.dom7LiveListeners[event$1].push({
						listener: listener,
						proxyListener: handleLiveEvent,
					});
					el.addEventListener(event$1, handleLiveEvent, capture);
				}
			}
		}
		return this;
	}
	function off() {
		var assign;

		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];
		var eventType = args[0];
		var targetSelector = args[1];
		var listener = args[2];
		var capture = args[3];
		if (typeof args[1] === 'function') {
			(assign = args, eventType = assign[0], listener = assign[1], capture = assign[2]);
			targetSelector = undefined;
		}
		if (!capture) { capture = false; }

		var events = eventType.split(' ');
		for (var i = 0; i < events.length; i += 1) {
			var event = events[i];
			for (var j = 0; j < this.length; j += 1) {
				var el = this[j];
				var handlers = (void 0);
				if (!targetSelector && el.dom7Listeners) {
					handlers = el.dom7Listeners[event];
				} else if (targetSelector && el.dom7LiveListeners) {
					handlers = el.dom7LiveListeners[event];
				}
				if (handlers && handlers.length) {
					for (var k = handlers.length - 1; k >= 0; k -= 1) {
						var handler = handlers[k];
						if (listener && handler.listener === listener) {
							el.removeEventListener(event, handler.proxyListener, capture);
							handlers.splice(k, 1);
						} else if (!listener) {
							el.removeEventListener(event, handler.proxyListener, capture);
							handlers.splice(k, 1);
						}
					}
				}
			}
		}
		return this;
	}
	function trigger() {
		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];

		var events = args[0].split(' ');
		var eventData = args[1];
		for (var i = 0; i < events.length; i += 1) {
			var event = events[i];
			for (var j = 0; j < this.length; j += 1) {
				var el = this[j];
				var evt = (void 0);
				try {
					evt = new win.CustomEvent(event, {
						detail: eventData,
						bubbles: true,
						cancelable: true,
					});
				} catch (e) {
					evt = doc.createEvent('Event');
					evt.initEvent(event, true, true);
					evt.detail = eventData;
				}
				// eslint-disable-next-line
				el.dom7EventData = args.filter(function (data, dataIndex) { return dataIndex > 0; });
				el.dispatchEvent(evt);
				el.dom7EventData = [];
				delete el.dom7EventData;
			}
		}
		return this;
	}
	function transitionEnd(callback) {
		var events = ['webkitTransitionEnd', 'transitionend'];
		var dom = this;
		var i;
		function fireCallBack(e) {
			/* jshint validthis:true */
			if (e.target !== this) { return; }
			callback.call(this, e);
			for (i = 0; i < events.length; i += 1) {
				dom.off(events[i], fireCallBack);
			}
		}
		if (callback) {
			for (i = 0; i < events.length; i += 1) {
				dom.on(events[i], fireCallBack);
			}
		}
		return this;
	}
	function outerWidth(includeMargins) {
		if (this.length > 0) {
			if (includeMargins) {
				// eslint-disable-next-line
				var styles = this.styles();
				return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
			}
			return this[0].offsetWidth;
		}
		return null;
	}
	function outerHeight(includeMargins) {
		if (this.length > 0) {
			if (includeMargins) {
				// eslint-disable-next-line
				var styles = this.styles();
				return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
			}
			return this[0].offsetHeight;
		}
		return null;
	}
	function offset() {
		if (this.length > 0) {
			var el = this[0];
			var box = el.getBoundingClientRect();
			var body = doc.body;
			var clientTop = el.clientTop || body.clientTop || 0;
			var clientLeft = el.clientLeft || body.clientLeft || 0;
			var scrollTop = el === win ? win.scrollY : el.scrollTop;
			var scrollLeft = el === win ? win.scrollX : el.scrollLeft;
			return {
				top: (box.top + scrollTop) - clientTop,
				left: (box.left + scrollLeft) - clientLeft,
			};
		}

		return null;
	}
	function styles() {
		if (this[0]) { return win.getComputedStyle(this[0], null); }
		return {};
	}
	function css(props, value) {
		var i;
		if (arguments.length === 1) {
			if (typeof props === 'string') {
				if (this[0]) { return win.getComputedStyle(this[0], null).getPropertyValue(props); }
			} else {
				for (i = 0; i < this.length; i += 1) {
					// eslint-disable-next-line
					for (var prop in props) {
						this[i].style[prop] = props[prop];
					}
				}
				return this;
			}
		}
		if (arguments.length === 2 && typeof props === 'string') {
			for (i = 0; i < this.length; i += 1) {
				this[i].style[props] = value;
			}
			return this;
		}
		return this;
	}
	function each(callback) {
		// Don't bother continuing without a callback
		if (!callback) { return this; }
		// Iterate over the current collection
		for (var i = 0; i < this.length; i += 1) {
			// If the callback returns false
			if (callback.call(this[i], i, this[i]) === false) {
				// End the loop early
				return this;
			}
		}
		// Return `this` to allow chained DOM operations
		return this;
	}
	function html(html) {
		if (typeof html === 'undefined') {
			return this[0] ? this[0].innerHTML : undefined;
		}

		for (var i = 0; i < this.length; i += 1) {
			this[i].innerHTML = html;
		}
		return this;
	}
	function text(text) {
		if (typeof text === 'undefined') {
			if (this[0]) {
				return this[0].textContent.trim();
			}
			return null;
		}

		for (var i = 0; i < this.length; i += 1) {
			this[i].textContent = text;
		}
		return this;
	}
	function is(selector) {
		var el = this[0];
		var compareWith;
		var i;
		if (!el || typeof selector === 'undefined') { return false; }
		if (typeof selector === 'string') {
			if (el.matches) { return el.matches(selector); }
			else if (el.webkitMatchesSelector) { return el.webkitMatchesSelector(selector); }
			else if (el.msMatchesSelector) { return el.msMatchesSelector(selector); }

			compareWith = $(selector);
			for (i = 0; i < compareWith.length; i += 1) {
				if (compareWith[i] === el) { return true; }
			}
			return false;
		} else if (selector === doc) { return el === doc; }
		else if (selector === win) { return el === win; }

		if (selector.nodeType || selector instanceof Dom7) {
			compareWith = selector.nodeType ? [selector] : selector;
			for (i = 0; i < compareWith.length; i += 1) {
				if (compareWith[i] === el) { return true; }
			}
			return false;
		}
		return false;
	}
	function index() {
		var child = this[0];
		var i;
		if (child) {
			i = 0;
			// eslint-disable-next-line
			while ((child = child.previousSibling) !== null) {
				if (child.nodeType === 1) { i += 1; }
			}
			return i;
		}
		return undefined;
	}
	function eq(index) {
		if (typeof index === 'undefined') { return this; }
		var length = this.length;
		var returnIndex;
		if (index > length - 1) {
			return new Dom7([]);
		}
		if (index < 0) {
			returnIndex = length + index;
			if (returnIndex < 0) { return new Dom7([]); }
			return new Dom7([this[returnIndex]]);
		}
		return new Dom7([this[index]]);
	}
	function empty() {
		this[0].innerHTML = '';
		return this;
	}
	function fadeOut(time = 400) {
		var fadeTarget = this[0];
		var fadeEffect = setInterval(function () {
			if (!fadeTarget.style.opacity) {
				fadeTarget.style.opacity = 1;
			}
			if (fadeTarget.style.opacity > 0) {
				fadeTarget.style.opacity -= 0.1;
			} else {
				fadeTarget.style.display = "none";
				clearInterval(fadeEffect);
			}
		}, time/10);
	}
	function fadeIn(time = 400) {
		var fadeTarget = this[0];
		var fadeEffect = setInterval(function () {
			if (!fadeTarget.style.opacity) {
				fadeTarget.style.opacity = 0;
			}
			if (fadeTarget.style.opacity < 1) {
				fadeTarget.style.opacity += 0.1;
			} else {
				clearInterval(fadeEffect);
			}
		}, time/10);
	}
	function append() {
		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];

		var newChild;

		for (var k = 0; k < args.length; k += 1) {
			newChild = args[k];
			for (var i = 0; i < this.length; i += 1) {
				if (typeof newChild === 'string') {
					var tempDiv = doc.createElement('div');
					tempDiv.innerHTML = newChild;
					while (tempDiv.firstChild) {
						this[i].appendChild(tempDiv.firstChild);
					}
				} else if (newChild instanceof Dom7) {
					for (var j = 0; j < newChild.length; j += 1) {
						this[i].appendChild(newChild[j]);
					}
				} else {
					this[i].appendChild(newChild);
				}
			}
		}

		return this;
	}
	function prepend(newChild) {
		var i;
		var j;
		for (i = 0; i < this.length; i += 1) {
			if (typeof newChild === 'string') {
				var tempDiv = doc.createElement('div');
				tempDiv.innerHTML = newChild;
				for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
					this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
				}
			} else if (newChild instanceof Dom7) {
				for (j = 0; j < newChild.length; j += 1) {
					this[i].insertBefore(newChild[j], this[i].childNodes[0]);
				}
			} else {
				this[i].insertBefore(newChild, this[i].childNodes[0]);
			}
		}
		return this;
	}
	function next(selector) {
		if (this.length > 0) {
			if (selector) {
				if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
					return new Dom7([this[0].nextElementSibling]);
				}
				return new Dom7([]);
			}

			if (this[0].nextElementSibling) { return new Dom7([this[0].nextElementSibling]); }
			return new Dom7([]);
		}
		return new Dom7([]);
	}
	function nextAll(selector) {
		var nextEls = [];
		var el = this[0];
		if (!el) { return new Dom7([]); }
		while (el.nextElementSibling) {
			var next = el.nextElementSibling;
			if (selector) {
				if ($(next).is(selector)) { nextEls.push(next); }
			} else { nextEls.push(next); }
			el = next;
		}
		return new Dom7(nextEls);
	}
	function prev(selector) {
		if (this.length > 0) {
			var el = this[0];
			if (selector) {
				if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
					return new Dom7([el.previousElementSibling]);
				}
				return new Dom7([]);
			}

			if (el.previousElementSibling) { return new Dom7([el.previousElementSibling]); }
			return new Dom7([]);
		}
		return new Dom7([]);
	}
	function prevAll(selector) {
		var prevEls = [];
		var el = this[0];
		if (!el) { return new Dom7([]); }
		while (el.previousElementSibling) {
			var prev = el.previousElementSibling; // eslint-disable-line
			if (selector) {
				if ($(prev).is(selector)) { prevEls.push(prev); }
			} else { prevEls.push(prev); }
			el = prev;
		}
		return new Dom7(prevEls);
	}
	function parent(selector) {
		var parents = []; // eslint-disable-line
		for (var i = 0; i < this.length; i += 1) {
			if (this[i].parentNode !== null) {
				if (selector) {
					if ($(this[i].parentNode).is(selector)) { parents.push(this[i].parentNode); }
				} else {
					parents.push(this[i].parentNode);
				}
			}
		}
		return $(unique(parents));
	}
	function parents(selector) {
		var parents = []; // eslint-disable-line
		for (var i = 0; i < this.length; i += 1) {
			var parent = this[i].parentNode; // eslint-disable-line
			while (parent) {
				if (selector) {
					if ($(parent).is(selector)) { parents.push(parent); }
				} else {
					parents.push(parent);
				}
				parent = parent.parentNode;
			}
		}
		return $(unique(parents));
	}
	function closest(selector) {
		var closest = this; // eslint-disable-line
		if (typeof selector === 'undefined') {
			return new Dom7([]);
		}
		if (!closest.is(selector)) {
			closest = closest.parents(selector).eq(0);
		}
		return closest;
	}
	function find(selector) {
		var foundElements = [];
		for (var i = 0; i < this.length; i += 1) {
			var found = this[i].querySelectorAll(selector);
			for (var j = 0; j < found.length; j += 1) {
				foundElements.push(found[j]);
			}
		}
		return new Dom7(foundElements);
	}
	function children(selector) {
		var children = []; // eslint-disable-line
		for (var i = 0; i < this.length; i += 1) {
			var childNodes = this[i].childNodes;

			for (var j = 0; j < childNodes.length; j += 1) {
				if (!selector) {
					if (childNodes[j].nodeType === 1) { children.push(childNodes[j]); }
				} else if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
					children.push(childNodes[j]);
				}
			}
		}
		return new Dom7(unique(children));
	}
	function remove() {
		for (var i = 0; i < this.length; i += 1) {
			if (this[i].parentNode) { this[i].parentNode.removeChild(this[i]); }
		}
		return this;
	}
	function add() {
		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];

		var dom = this;
		var i;
		var j;
		for (i = 0; i < args.length; i += 1) {
			var toAdd = $(args[i]);
			for (j = 0; j < toAdd.length; j += 1) {
				dom[dom.length] = toAdd[j];
				dom.length += 1;
			}
		}
		return dom;
	}
	function hide(){
		var el = this[0];
		el.style.display = "none";
		return false;
	}
	function show(){
		var el = this[0];
		el.style.display = "block";
		el.style.opacity = 1;
		return false;
	}

	var Methods = {
		addClass: addClass,
		removeClass: removeClass,
		hasClass: hasClass,
		toggleClass: toggleClass,
		attr: attr,
		removeAttr: removeAttr,
		data: data,
		transform: transform,
		transition: transition,
		on: on,
		off: off,
		trigger: trigger,
		transitionEnd: transitionEnd,
		outerWidth: outerWidth,
		outerHeight: outerHeight,
		offset: offset,
		css: css,
		each: each,
		html: html,
		text: text,
		is: is,
		index: index,
		eq: eq,
		fadeOut: fadeOut,
		fadeIn: fadeIn,
		empty: empty,
		append: append,
		prepend: prepend,
		next: next,
		nextAll: nextAll,
		prev: prev,
		prevAll: prevAll,
		parent: parent,
		parents: parents,
		closest: closest,
		find: find,
		children: children,
		remove: remove,
		add: add,
		styles: styles,
		hide: hide,
		show: show,
	};

	var Utils = {
		deleteProps: function deleteProps(obj) {
			var object = obj;
			Object.keys(object).forEach(function (key) {
				try {
					object[key] = null;
				} catch (e) {
					// no getter for object
				}
				try {
					delete object[key];
				} catch (e) {
					// something got wrong
				}
			});
		},
		nextTick: function nextTick(callback, delay) {
			if ( delay === void 0 ) delay = 0;

			return setTimeout(callback, delay);
		},
		now: function now() {
			return Date.now();
		},
		parseUrlQuery: function parseUrlQuery(url) {
			var query = {};
			var urlToParse = url || win.location.href;
			var i;
			var params;
			var param;
			var length;
			if (typeof urlToParse === 'string' && urlToParse.length) {
				urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
				params = urlToParse.split('&').filter(function (paramsPart) { return paramsPart !== ''; });
				length = params.length;

				for (i = 0; i < length; i += 1) {
					param = params[i].replace(/#\S+/g, '').split('=');
					query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
				}
			}
			return query;
		},
		isObject: function isObject(o) {
			return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
		},
		extend: function extend() {
			var args = [], len$1 = arguments.length;
			while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];

			var to = Object(args[0]);
			for (var i = 1; i < args.length; i += 1) {
				var nextSource = args[i];
				if (nextSource !== undefined && nextSource !== null) {
					var keysArray = Object.keys(Object(nextSource));
					for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
						var nextKey = keysArray[nextIndex];
						var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
						if (desc !== undefined && desc.enumerable) {
							if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
								Utils.extend(to[nextKey], nextSource[nextKey]);
							} else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
								to[nextKey] = {};
								Utils.extend(to[nextKey], nextSource[nextKey]);
							} else {
								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}
			}
			return to;
		},
	};



	// MAIN METHODS
	function get_discussions(){
		var piliana = this;
		return fetch(piliana.params.api.overview, {credentials: 'same-origin'}).then(res => { if (res.status !== 200){ display_error_message(res); return; } else { return res.json()} })
	}

	function get_comments_by_discussionId(){
		var piliana = this;
		return fetch(piliana.params.api.discussion+'?id='+piliana.discussionId, {credentials: 'same-origin'}).then(res => { if (res.status !== 200){ display_error_message(res); return; } else { return res.json()} })
	}

	function get_open_comments(aAllComments){
		var aComments = [];
		for (var parentKey in aAllComments){

			// parents
			aAllComments[parentKey].commentType = 'parent';
			if (aAllComments[parentKey].status == 0){
				aComments.push(aAllComments[parentKey]);
			}

			// children
			if (aAllComments[parentKey].children && Object.keys(aAllComments[parentKey].children).length > 0){
				var childItem = aAllComments[parentKey].children;
				for (var childKey in childItem){
					childItem[childKey].commentType = 'child';
					childItem[childKey].parentId = aAllComments[parentKey].id;
					if (childItem[childKey].status == 0){
						aComments.push(childItem[childKey]);
					}
				}
			}
		}
		return aComments;
	}

	function get_comment_by_commentid(iCommentId, aCommentItems){
		var commentItem = aCommentItems.find(function(element){
			return element.id == iCommentId;
		});

		if (!commentItem) {
			for (var key in aCommentItems) {
				if (aCommentItems[key].children) {
					commentItem = get_comment_by_commentid(iCommentId, Object.values(aCommentItems[key].children));
					if (commentItem) {
						commentItem.commentType = 'child';
						commentItem.parentId = aCommentItems[key].id;
						break;
					}
				}
			}
		} else {
			commentItem.commentType = 'parent';
		}

		return commentItem;
	}

	function get_toxicity(text) {
		var piliana = this;
		var objComment = {
			comment: {
				text: text
			},
			languages: ["en"],
			requestedAttributes: {
				TOXICITY: {}
			}
		};

		return fetch(piliana.params.api.perspective, {
			method: 'POST',
			body: JSON.stringify(objComment),
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => res.json());
	}

	function execute_delete_comment(){
		var piliana = this;
		return fetch(piliana.params.api.delete+'?id='+piliana.commentId+'&iDiscussionId='+piliana.discussionId, {credentials: 'same-origin'}).then(res => { if (res.status !== 200){ display_error_message(res); return; } else { return res.json()} })
	}

	function execute_approve_comment(){
		var piliana = this;
		return fetch(piliana.params.api.approve+'?id='+piliana.commentId, {credentials: 'same-origin'}).then(res => { if (res.status !== 200){ display_error_message(res); return; } else { return res.json()} })
	}

	function execute_create_response(sComment){
		var piliana = this;
		return fetch(piliana.params.api.respond+'?id='+piliana.commentId+'&iDiscussionId='+piliana.discussionId+'&comment='+encodeURI(sComment), {credentials: 'same-origin'}).then(res => { if (res.status !== 200){ display_error_message(res); return; } else { return res.json()} })
	}

	function display_error_message(response){
		var errorMessage = '<strong>Could not connect to API!</strong>';
		if ($('.loaderOverlay').length == 0){
			$('body').prepend('<div class="loaderOverlay"></div>');
		}
		$('.loaderOverlay').empty().html('<div class="error-msg">'+errorMessage+'</div>');
		$('body').css('overflow', 'hidden');
	}

	function parseDate(date){
		var dDate = new Date(date.replace(/-/g, '/'));
		var dDay = dDate.getDate().toString().length == 1 ? '0'+dDate.getDate() : dDate.getDate();
		var dMonth = (dDate.getMonth()+1).toString().length == 1 ? '0'+dDate.getMonth() : dDate.getMonth()+1;
		var dHours = dDate.getHours().toString().length == 1 ? '0'+dDate.getHours() : dDate.getHours();
		var dMinutes = dDate.getMinutes().toString().length == 1 ? '0'+dDate.getMinutes() : dDate.getMinutes();
		var parsedDate = dDay+'.'+dMonth+'.'+dDate.getFullYear()+"&nbsp;&nbsp;&nbsp;"+dHours+':'+dMinutes;
		return parsedDate;
	}

	function nl2br(sContent){
		return sContent.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
	};

	function loaderComplete(){
		$('.loaderOverlay').empty().fadeOut(400);
		Utils.nextTick(function(){ $('.loaderOverlay').remove(); }, 800);
	}

	var main = {
		get_discussions: get_discussions,
		get_comments_by_discussionId: get_comments_by_discussionId,
		get_toxicity: get_toxicity,
		execute_delete_comment: execute_delete_comment,
		execute_approve_comment: execute_approve_comment,
		execute_create_response: execute_create_response,
	};



	// DASHBOARD
	function initDashboard(objDiscussions){
		send_basic_cd();
		var piliana = this;
		piliana.editorId = objDiscussions.items.editorId;
		piliana.aAllComments = [];
		piliana.aComments = [];
		piliana.discussionId = null;

		for (var discussionItem of objDiscussions.items.Discussions) {
			var flagColor = piliana.editorId in discussionItem.authors ? 'magenta' : 'green';
			var authorCut = Object.keys(discussionItem.authors).length > 1 ? ', ...' : '';
			var dashboardHMTL = '';

			dashboardHMTL += '<li class="js_slide">';
			dashboardHMTL += '<a href="comment?id='+discussionItem.id+'" class="discussion-item" data-id="'+discussionItem.id+'" data-navigo>';
			dashboardHMTL += '<div class="dashboard-counter"></div>';
			dashboardHMTL += '<div class="dashboard-title">'+discussionItem.title+'</div>';
			dashboardHMTL += '<div class="dashboard-meta">';
			dashboardHMTL += '<div class="dashboard-timestamp">'+parseDate(discussionItem.date)+'</div>';
			dashboardHMTL += '<div class="dashboard-author">'+discussionItem.authors[Object.keys(discussionItem.authors)[0]]+authorCut+'</div>';
			dashboardHMTL += '</div>';
			dashboardHMTL += '<div class="dashboard-flag '+flagColor+'">';
			dashboardHMTL += '<div class="flag-box">'+discussionItem.waiting_count+'/'+discussionItem.total_count+'</div>';
			dashboardHMTL += '<div class="flag-corner"></div>';
			dashboardHMTL += '</div>';
			dashboardHMTL += '</a>';
			dashboardHMTL += '</li>';

			if (piliana.editorId in discussionItem.authors) {
				$('#ownStorys .js_slides').append(dashboardHMTL);
				lory($('#ownStorys .js_slider')[0], {});
			} else {
				$('#allStorys .js_slides').append(dashboardHMTL);
				lory($('#allStorys .js_slider')[0], {});
			}
		};

		$('.discussion-item').on('click', function(e){
			e.preventDefault();
			piliana.discussionId = parseInt($(this).attr('data-id'));
			piliana.loadView('comment');
		});

		loaderComplete();
	}

	var dashboard = {
		initDashboard: initDashboard,
	};



	// COMMENTS
	function initComments(data){
		var piliana = this;
		var iDiscussionId = piliana.discussionId;

		if (data != 'undefined') {
			piliana.aAllComments = Object.values(data.items.aData.Comments);
			piliana.aComments = get_open_comments(piliana.aAllComments);

			$('.comment-title').text(data.items.aData.Discussion.title);
			$('.comment-title-link').attr('href', '/!' + iDiscussionId);

			var iCurrentIndex = piliana.load_comment(0);
			$('.skip-btn').on('click', function (e) {
				e.preventDefault();
				if ((iCurrentIndex + 1) < piliana.aComments.length) {
					gtm_skip_event();
					iCurrentIndex = piliana.load_comment((iCurrentIndex + 1));
				}
			});
			$('.show-btn').on('click', function () {
				$('.discussion-container').removeClass('collapsed');
				gtm_discussion_event();
			});

			$('.action-btns, .comment-container.new').css('visibility', 'visible');
			$('.delete-btn').on('click', function () {
				piliana.delete_comment();
				gtm_decline_btn_event();
			});
			$('.approve-btn').on('click', function () {
				piliana.approve_comment();
				gtm_approve_btn_event();
			});
			$('.reply-btn').on('click', function () {
				piliana.commentId = get_comment_id();
				piliana.loadView('reply');
				gtm_reply_btn_event();
			});

			$('.back-btn').on('click', function (e) {
				e.preventDefault();
				gtm_back_event();
				gtm_fire_pageEvent();
				piliana.loadView('dashboard');
			});

			initializeTouch($('.comment-container.new'));
			loaderComplete();
		}
	}

	function load_comment(index) {
		var piliana = this;
		if (index < piliana.aComments.length) {
			$('.skip-btn').removeClass('hidden');
			$('.discussion-container').addClass('collapsed');
			$('.discussion-container').empty();
			$('.comment-counter').text((index + 1) + '/' + piliana.aComments.length);
			$('.progress-bar progress').attr('value', 100/piliana.aComments.length*(index+1));

			var comment = piliana.aComments[index];
			// Load all approved associative comments
			if (comment.commentType == 'child'){
				var parentItem = piliana.aAllComments.find(function(element){
					return element.id == comment.parentId;
				});
				add_comment(parentItem);

				for (var key in parentItem.children){
					if (parentItem.children[key].status != 0){
						add_comment(parentItem.children[key]);
					}
				}
			}

			// Display comment to be approved
			$('.comment-container.new').removeClass('parent child');
			$('.comment-container.new').addClass(comment.commentType);
			$('.comment-container.new').attr('data-comment-id', comment.id);
			$('.comment-container.new .comment-user').text(comment.User.username);
			$('.comment-container.new .comment-timestamp').html(parseDate(comment.date));
			$('.comment-container.new .comment-user-stats').html('Freigeschaltet: ' + comment.User.cleared + ' | ' + comment.User.quote + '%');
			$('.comment-container.new .comment-content').html(nl2br(convert_youtube_links(comment.comment)));

			if (comment.media !== null) {
				var img = '<a href="' + comment.media + '" target="_blank"><img class="comment-thumb" src="' + comment.media + '"></a>';
				$('.comment-container.new .comment-content').append(img);
			}

			if ($('.comment-youtube').length != 0) {
				$('.comment-youtube').on('click', function(){
					resetYoutube();
					$(this).attr('data-playing', true);
					var iId = $(this).find(".preview").attr("data-video_id");
					var html = $(this).html();
					$(this).html('<iframe src="https://www.youtube.com/embed/' + iId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>').append('<div class="youtube_wrapper" style="display:none">' + html + '</div>');
				});
			}

			// Get toxicity data and display on comment
			piliana.get_toxicity(comment.comment).then(data => {
				if (data != 'undefined') {
					var score = data.attributeScores.TOXICITY.summaryScore.value;

					var toxicityColor = 'neutral';
					if (score > 0.75) {
						toxicityColor = 'bad';
					} else if (score < 0.25) {
						toxicityColor = 'good';
					}

					var toxicity = Math.round(score * 100);
					$('.comment-toxicity').text('Toxicity ' + toxicity + '%');
					$('.comment-toxicity').removeClass('good neutral bad').addClass(toxicityColor);

					send_comment_cd(comment.id, comment, piliana.discussionId, toxicity);
				}
			}).catch(error => { $('.comment-toxicity').remove(); })

			$('.action-btns').show();

		} else if (piliana.aComments.length == 0){
			piliana.loadView('dashboard');
		}

		if ((index+1) == piliana.aComments.length){
			$('.skip-btn').addClass('hidden');
		}
		gtm_fire_pageEvent();
		return index;
	}

	function add_comment(commentItem){
		var html = '';
		html += '<div class="comment-container '+commentItem.commentType+'">';
		html += '<div class="comment-meta">';
		html += '<div class="comment-user">'+commentItem.User.username+'</div>';
		html += '<div class="comment-timestamp">'+parseDate(commentItem.date)+'</div>';
		html += '</div>';
		html += '<div class="comment-content">'+nl2br(commentItem.comment)+'</div>';
		html += '</div>';
		$('.discussion-container').append(html);
	}

	function delete_comment(){
		var piliana = this;
		piliana.commentId = get_comment_id();
		var iCurrentIndex = piliana.get_comment_index(piliana.commentId);
		$('.action-btns').hide();

		piliana.execute_delete_comment().then(data => {
			if (data.status == 1){
				$('.comment-status').show();
				$('.comment-status .deleted').show();
				resetSwipe();
				Utils.nextTick(function(){
					$('.comment-status').fadeOut(200);
					$('.comment-status .deleted').fadeOut(200);
					piliana.aComments.splice(iCurrentIndex, 1);
					if (iCurrentIndex == piliana.aComments.length && piliana.aComments.length != 0) {
						iCurrentIndex--;
					}
					piliana.load_comment(iCurrentIndex);
				}, 600);
			}
		}).catch(error => { deactivateTouch($('.comment-container.new')); })
	}

	function approve_comment(){
		var piliana = this;
		piliana.commentId = get_comment_id();
		var iCurrentIndex = piliana.get_comment_index(piliana.commentId);
		$('.action-btns').hide();

		piliana.execute_approve_comment().then(data => {
			if (data.status == 1){
				resetSwipe();
				$('.comment-status').show();
				$('.comment-status .approved').show();
				Utils.nextTick(function(){
					$('.comment-status').fadeOut(200);
					$('.comment-status .approved').fadeOut(200);
					piliana.aComments[iCurrentIndex].status = 1;
					piliana.aComments.splice(iCurrentIndex, 1);
					if (iCurrentIndex == piliana.aComments.length && piliana.aComments.length != 0){
						iCurrentIndex --;
					}
					piliana.load_comment(iCurrentIndex);
				}, 600);
			}
		}).catch(error => { deactivateTouch($('.comment-container.new')); })
	}

	function get_comment_id(){
		return $('.comment-container.new').data('comment-id');
	}

	function get_comment_index(commentId){
		var piliana = this;
		var index = piliana.aComments.findIndex(function(element){ return element.id == commentId; });
		return index;
	}

	function convert_youtube_links(sContent){
		var matchesYTUrl = sContent.match(/href="(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/g);
		var matchesYTLinks = sContent.match(/<a [^>]+>([^<]+)<\/a>/g);
		if (matchesYTUrl) {
			matchesYTUrl.forEach((url) => {
				url = url.replace('href="', '').replace('"', '');

				var youtube = '<div class="comment-youtube"> '+
				'<div class="preview" data-video_id="' + getYoutubeId(url) + '" style="background-image: url(https://img.youtube.com/vi/' + getYoutubeId(url) + '/0.jpg)">'+
				'</div><img class="arrow" src="https://www.watson.ch/media/img/main/arrows/arrow_video_play.png" alt="Play Icon"></div>';

				for (var key in matchesYTLinks) {
					if (matchesYTLinks[key].indexOf(url) > -1){
						sContent = sContent.replace(matchesYTLinks[key], youtube);
					}
				}
			});
		}
		return sContent;
	}

	function getYoutubeId(url){
		var ID = '';
		url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if(url[2] !== undefined) {
			ID = url[2].split(/[^0-9a-z_\-]/i);
			ID = ID[0];
		}
		else {
			ID = url;
		}
		return ID;
	}

	function resetYoutube() {
		$('.comment-youtube[data-playing="true"]').each(function(index) {
			$(this).find('iframe').remove();
			$(this).removeAttr('data-playing');
			var preview = $(this).find('.youtube_wrapper').html();
			$(this).html(preview);
			$(this).find('.youtube_wrapper').remove();
		});
	}

	// touch-swipe
	function initializeTouch($el){
		$el[0].ongoingTouches = {
			swipe: false,
			w: 0,		// width of swipe element
			lw: 0,		// left width from touch point
			rw: 0,		// right width from touch point
			ml: 0,		// margin left
			y: 0,		// touch point y
			sT: 0.7,	//swipe tolerance
			sW: 50		// swipe width
		};
		$el.on('touchstart', handleStart);
		$el.on('touchend', handleEnd);
		$el.on('touchmove', handleMove);
	}
	function pauseTouch($el){
		$el.off('touchend');
		$el.off('touchmove');
	}
	function resumeTouch($el){
		$el.on('touchend', handleEnd);
		$el.on('touchmove', handleMove);
	}
	function deactivateTouch($el){
		$el.off('touchstart');
		$el.off('touchend');
		$el.off('touchmove');
	}
	function handleStart(evt){
		var el = this;
		var elStyle = window.getComputedStyle(el);
		var touches = evt.changedTouches;
		el.ongoingTouches.lw = touches[0].clientX - parseInt(elStyle.marginLeft);
		el.ongoingTouches.rw = window.outerWidth - touches[0].clientX + parseInt(elStyle.marginLeft);
		el.ongoingTouches.ml = parseInt(elStyle.marginLeft);
		el.ongoingTouches.y = touches[0].clientY;
		resumeTouch($(this));

		if ( !$('.comment-container.new').hasClass('child') || $('.comment-container.new').hasClass('child') && !$('.discussion-container').hasClass('collapsed')){
			el.ongoingTouches.swipe = true;
		}
	}
	function handleEnd(evt){
		var el = this;
		var touches = evt.changedTouches;
		var curX = touches[0].clientX;
		var lw = el.ongoingTouches.lw;
		var rw = el.ongoingTouches.rw;
		var ml = el.ongoingTouches.ml;
		var sT = el.ongoingTouches.sT;
		var sW = el.ongoingTouches.sW;
		var vDelta = Math.round(Math.abs(el.ongoingTouches.y - touches[0].clientY));

		if (isInViewport($('.action-btns'))) {
			if (curX - ml < lw && lw > sW && getLP(curX,el) > sT && el.ongoingTouches.swipe && vDelta < sW) {
				piliana.delete_comment();
				gtm_decline_swipe_event();
			} else if (curX - ml > lw && rw > sW && getRP(curX,el) > sT && el.ongoingTouches.swipe && vDelta < sW) {
				piliana.approve_comment();
				gtm_approve_swipe_event();
			} else {
				resetSwipe();
			}
		}

		el.ongoingTouches.swipe = false;
		el.ongoingTouches.lw = 0;
		el.ongoingTouches.rw = 0;
		el.ongoingTouches.ml = 0;
		el.ongoingTouches.y = 0;
	}
	function handleMove(evt){
		var el = this;
		var touches = evt.changedTouches;
		var curX = touches[0].clientX;
		var lw = el.ongoingTouches.lw;
		var rw = el.ongoingTouches.rw;
		var ml = el.ongoingTouches.ml;
		var sT = el.ongoingTouches.sT;
		var sW = el.ongoingTouches.sW;
		var vDelta = Math.round(Math.abs(el.ongoingTouches.y - touches[0].clientY));

		if (isInViewport($('.action-btns'))) {
			if (curX - ml < lw && lw > sW && Math.abs(lw - curX - ml) > sW && el.ongoingTouches.swipe && vDelta < sW) {
				$('.delete-btn').addClass('swipe');
				$('.approve-btn').removeClass('swipe');
				if (getLP(curX,el) > sT) {
					$('.delete-btn').addClass('ready');
					$('.swipe-delete').addClass('swipe');
				} else {
					$('.delete-btn').removeClass('ready');
					$('.swipe-delete').removeClass('swipe');
				}
			} else if (curX - ml > lw && rw > sW && Math.abs(curX - ml - lw) > sW && el.ongoingTouches.swipe && vDelta < sW) {
				$('.delete-btn').removeClass('swipe');
				$('.approve-btn').addClass('swipe');
				if (getRP(curX,el) > sT) {
					$('.approve-btn').addClass('ready');
					$('.swipe-approve').addClass('swipe');
				} else {
					$('.approve-btn').removeClass('ready');
					$('.swipe-approve').removeClass('swipe');
				}
			} else if (vDelta > sW) {
				pauseTouch($(this));
				resetSwipe();
			}
		}
	}
	function resetSwipe(){
		$('.swipe-delete').removeClass('swipe');
		$('.swipe-approve').removeClass('swipe');
		$('.approve-btn').removeClass('swipe');
		$('.delete-btn').removeClass('swipe');
		$('.approve-btn').removeClass('ready');
		$('.delete-btn').removeClass('ready');
	}
	function getLP(curX, el){
		var lw = el.ongoingTouches.lw;
		var ml = el.ongoingTouches.ml;
		return 1/lw*(lw-curX-ml);
	}
	function getRP(curX, el){
		var lw = el.ongoingTouches.lw;
		var rw = el.ongoingTouches.rw;
		var ml = el.ongoingTouches.ml;
		return 1/rw*(curX-ml-lw);
	}
	function isInViewport($el) {
		var elementPos = $el[0].getBoundingClientRect();
		var elementTop = $el[0].offsetTop;
		var elementBottom = elementTop + elementPos.height;
		var viewportTop = window.scrollY;
		var viewportBottom = viewportTop + window.outerHeight;
		return elementBottom > viewportTop && elementTop < viewportBottom;
	}

	var comments = {
		initComments: initComments,
		load_comment: load_comment,
		delete_comment: delete_comment,
		approve_comment: approve_comment,
		get_comment_index: get_comment_index,
	};



	// REPLY
	function initReply(){
		var piliana = this;
		var comment = get_comment_by_commentid(piliana.commentId, piliana.aAllComments);
		$('.comment-user').text(comment.User.username);
		$('.comment-content > p').html(nl2br(comment.comment));
		$('.comment-content')[0].style.height = $('.comment-content > p')[0].offsetHeight + 'px';

		$('.comment-reply-btn').on('click', function () {
			piliana.send_reply(comment);
			gtm_reply_event();
		});
		$('.back-btn').on('click', function (e) {
			e.preventDefault();
			gtm_back_event();
			piliana.loadView('comment');
		});
		$('.reply-input').on('keyup', function (e) {
			checkTextarea(this);
		});
		send_comment_cd(piliana.commentId, comment, piliana.discussionId);
	}

	function checkTextarea(el){
		if (el.value.length > 0){
			$('.comment-reply-btn').removeClass('off');
		} else {
			$('.comment-reply-btn').addClass('off');
		}
		if (el.value.length < 600){
			$('.comment-reply-btn').removeClass('processing');
			$('.reply-status-message').text('');
		}
	}

	function send_reply(comment){
		var piliana = this;
		$('.loaderOverlay').show();
		piliana.execute_approve_comment().then(data => {
			if (data.status == 1){
				piliana.commentId = comment.commentType == 'child' ? comment.parentId : piliana.commentId;
				piliana.execute_create_response($('.reply-input')[0].value).then(data => {
					if (data.status && data.status == 1){
						$('.comment-status').show();
						$('.comment-status .approved').show();
						$('.loaderOverlay').hide();

						Utils.nextTick(function(){
							piliana.loadView('comment');
						}, 600);
					}
					if (data.error && data.error == 1){
						$('.comment-reply.load, .comment-reply-container, .reply-input').removeClass('processing');
						$('.reply-status-message').text(data.message);
					}
				}).catch(error => { alert('error');})
			}
		}).catch(error => {alert('error');})
	};

	var reply = {
		initReply: initReply,
		send_reply: send_reply,
	};

	var prototypes = {
		main: main,
		dashboard: dashboard,
		comments: comments,
		reply: reply,
	};

	var defaults = {
		language: 'en',
		api: {
			approve: '',
			delete: '',
			discussion: '',
			overview: '',
			prespective: '',
			respond: '',
		},
		gtm: {
			containerId: ''
		},
		cdn: false,
		debugMode: false
	};



	// PILIANA
	var piliana;
	var Piliana = function(PilianaSelector, params = {}){
		piliana = this;
		piliana.params = Utils.extend({}, defaults, params);

		// Find el
		var $el = $(PilianaSelector);
		var el = $el[0];
		if (!el) {
			return undefined;
		}

		Utils.extend(piliana, {
			$: $,
			$el: $el,
			el: el,
			aAllComments: [],
			aComments: [],
			commentId: null,
			discussionId: null,
			editorId: null,
		});

		Object.keys(Methods).forEach(function (methodName) {
			$.fn[methodName] = Methods[methodName];
		});

		Object.keys(prototypes).forEach(function (prototypeGroup) {
			Object.keys(prototypes[prototypeGroup]).forEach(function (protoMethod) {
				if (!Piliana.prototype[protoMethod]) {
					Piliana.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
				}
			});
		});

		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer',piliana.params.gtm.containerId);

		// Pili-Ana uses lory slider (http://meandmax.github.io/lory/)
		var loryScript = document.createElement('script');
		loryScript.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/lory.js/2.5.2/lory.min.js');
		document.head.appendChild(loryScript);

		piliana.loadView('dashboard');
	};

	Piliana.prototype.loadView = function loadView (view) {
		var piliana = this;
		var path = piliana.params.cdn ? 'https://cdn.jsdelivr.net/gh/Fixxpunkt/pili-ana/view/'+view+'.html' : './view/'+view+'.html';
		var req = new XMLHttpRequest();
		req.open('GET', path);
		req.send();

		req.onload = () => {
			piliana.$el.attr('data-view', view);
			piliana.$el.html(req.responseText);
			switch(view){
				case 'dashboard':
					piliana.get_discussions().then(data => { if (data != 'undefined'){ piliana.initDashboard(data); } }).catch(error => {});
					break;
				case 'comment':
					piliana.get_comments_by_discussionId().then(data => { if (data != 'undefined'){ piliana.initComments(data); } }).catch(error => {});
					break;
				case 'reply':
					piliana.initReply();
					break;
			}
		};
	};



	/**
	 * Google Tag Manager
	 */
	window.dataLayer = window.dataLayer || [];
	var GTM = (function () {
		var gtmCookie = 'gtm_events';
		return {

			/**
			 * pushes a gtm event to the dataLayer
			 * @param category
			 * @param actions
			 * @param label
			 * @param nonInteraction
			 * @param event
			 * @param {object} customDimension
			 */
			event: function(category, action, label, nonInteraction, customDimension, event) {

				nonInteraction = nonInteraction || false;
				customDimension = customDimension || null;
				event = event || 'gaEvent';

				var eventParams = {
					'event': event,
					'eventCategory': category,
					'eventAction': action,
					'eventLabel': label,
					'eventValue': null,
					'nonInteraction': nonInteraction
				};

				for (var key in customDimension) {
					if (customDimension.hasOwnProperty(key)) eventParams[key] = customDimension[key];
				}

				if (typeof window.dataLayer === 'undefined') {
					return;
				}
				window.dataLayer.push(eventParams)
			}
		}
	})();

	var platform = (function() {
		var ua = navigator.userAgent.toLowerCase();

		if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
			return 'site-tablet';
		} else {
			if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
				return 'site-mobile';
			}  else {
				return 'site-web';
			}
		}
	})();

	var pageUrl = (function() {
		return window.location.href;
	})();

	var send_basic_cd = function() {
		var pageType = $('div#index').data('type');
		var cd = {
			'platform': platform,
			'pageType': pageType,
			'pageCanonical': pageUrl
		}
		dataLayer.push(cd);
	};

	var send_comment_cd = function(commentId, comment, discussionId, toxicity) {
		var date = new Date(comment.date),
			year = date.getFullYear(),
			month = (date.getMonth() < 10 ? '0' : '') + date.getMonth(),
			day = (date.getDate() < 10 ? '0' : '') + date.getDate(),
			hours = (date.getHours() < 10 ? '0': '') + date.getHours(),
			minutes = (date.getMinutes() < 10 ? '0': '') + date.getMinutes(),
			commentDate = year + '' + month + '' + day,
			commentTime = hours + ':' + minutes;

		var commentMedia = (comment.media !== null) ? 'Yes' : 'No';
		var commentParent = 'Yes';
		if (comment.commentType == 'child'){
			commentParent = 'No';
		}
		var pageType = $('div#index').data('type');

		var cd = {
			'platform': platform,
			'pageType': pageType,
			'pageCanonical': pageUrl,
			'commentDate': commentDate,
			'commentTime' : commentTime,
			'commentMedia': commentMedia,
			'commentParent': commentParent,
			'commentId': commentId,
			'commentUser': comment.User.username,
			'approvedComments': comment.User.cleared,
			'approvedCommentsRatio': comment.User.quote,
			'commentStoryId': discussionId,
			'commentToxicLevel': toxicity
		};
		dataLayer.push(cd);
	};

	var gtm_skip_event = function() {
		GTM.event('Interactions', 'Navigation', 'Skip');
	};
	var gtm_back_event = function() {
		GTM.event('Interactions', 'Navigation', 'Back');
	};
	var gtm_approve_btn_event = function() {
		GTM.event('Comments', 'Approve', 'Button');
	};
	var gtm_approve_swipe_event = function() {
		GTM.event('Comments', 'Approve', 'Swipe');
	};
	var gtm_decline_btn_event = function() {
		GTM.event('Comments', 'Decline', 'Button');
	};
	var gtm_decline_swipe_event = function() {
		GTM.event('Comments', 'Decline', 'Swipe');
	};
	var gtm_reply_btn_event = function() {
		GTM.event('Comments', 'Reply', 'Select');
	};
	var gtm_reply_event = function() {
		GTM.event('Comments', 'Reply', 'Send');
	};
	var gtm_discussion_event = function() {
		GTM.event('Comments', 'Discussion', 'Show');
	};
	var gtm_fire_pageEvent = function() {
		window.dataLayer.push({
			'event': 'gapageEvent'
		});
	};

	return Piliana;
})));
