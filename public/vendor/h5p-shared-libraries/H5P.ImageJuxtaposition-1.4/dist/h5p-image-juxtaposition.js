(function (a) {
	function b(d) {
		if (c[d]) return c[d].exports;
		var e = (c[d] = { i: d, l: !1, exports: {} });
		return a[d].call(e.exports, e, e.exports, b), (e.l = !0), e.exports;
	}
	var c = {};
	return (
		(b.m = a),
		(b.c = c),
		(b.d = function (a, c, d) {
			b.o(a, c) || Object.defineProperty(a, c, { enumerable: !0, get: d });
		}),
		(b.r = function (a) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(a, "__esModule", { value: !0 });
		}),
		(b.t = function (a, c) {
			if ((1 & c && (a = b(a)), 8 & c)) return a;
			if (4 & c && "object" == typeof a && a && a.__esModule) return a;
			var d = Object.create(null);
			if (
				(b.r(d),
				Object.defineProperty(d, "default", { enumerable: !0, value: a }),
				2 & c && "string" != typeof a)
			)
				for (var e in a)
					b.d(
						d,
						e,
						function (b) {
							return a[b];
						}.bind(null, e),
					);
			return d;
		}),
		(b.n = function (a) {
			var c =
				a && a.__esModule
					? function () {
							return a["default"];
						}
					: function () {
							return a;
						};
			return b.d(c, "a", c), c;
		}),
		(b.o = function (a, b) {
			return Object.prototype.hasOwnProperty.call(a, b);
		}),
		(b.p = ""),
		b((b.s = 1))
	);
})([
	function () {},
	function (a, b, c) {
		"use strict";
		function d(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function e(a, b) {
			for (var c, d = 0; d < b.length; d++)
				(c = b[d]),
					(c.enumerable = c.enumerable || !1),
					(c.configurable = !0),
					"value" in c && (c.writable = !0),
					Object.defineProperty(a, c.key, c);
		}
		function f(a, b, c) {
			return b && e(a.prototype, b), c && e(a, c), a;
		}
		function g(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function h(a, b) {
			for (var c, d = 0; d < b.length; d++)
				(c = b[d]),
					(c.enumerable = c.enumerable || !1),
					(c.configurable = !0),
					"value" in c && (c.writable = !0),
					Object.defineProperty(a, c.key, c);
		}
		function i(a, b, c) {
			return b && h(a.prototype, b), c && h(a, c), a;
		}
		function j(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function k(a, b) {
			for (var c, d = 0; d < b.length; d++)
				(c = b[d]),
					(c.enumerable = c.enumerable || !1),
					(c.configurable = !0),
					"value" in c && (c.writable = !0),
					Object.defineProperty(a, c.key, c);
		}
		function l(a, b, c) {
			return b && k(a.prototype, b), c && k(a, c), a;
		}
		function m(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function n(a, b) {
			for (var c, d = 0; d < b.length; d++)
				(c = b[d]),
					(c.enumerable = c.enumerable || !1),
					(c.configurable = !0),
					"value" in c && (c.writable = !0),
					Object.defineProperty(a, c.key, c);
		}
		function o(a, b, c) {
			return b && n(a.prototype, b), c && n(a, c), a;
		}
		function p(a) {
			return (
				(p =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? function (a) {
								return typeof a;
							}
						: function (a) {
								return a &&
									"function" == typeof Symbol &&
									a.constructor === Symbol &&
									a !== Symbol.prototype
									? "symbol"
									: typeof a;
							}),
				p(a)
			);
		}
		function q(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function r(a, b) {
			for (var c, d = 0; d < b.length; d++)
				(c = b[d]),
					(c.enumerable = c.enumerable || !1),
					(c.configurable = !0),
					"value" in c && (c.writable = !0),
					Object.defineProperty(a, c.key, c);
		}
		function s(a, b, c) {
			return b && r(a.prototype, b), c && r(a, c), a;
		}
		function t(a) {
			return (
				(t =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? function (a) {
								return typeof a;
							}
						: function (a) {
								return a &&
									"function" == typeof Symbol &&
									a.constructor === Symbol &&
									a !== Symbol.prototype
									? "symbol"
									: typeof a;
							}),
				t(a)
			);
		}
		function u(a, b) {
			if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
		}
		function v(a, b) {
			return b && ("object" === t(b) || "function" == typeof b) ? b : w(a);
		}
		function w(a) {
			if (void 0 === a)
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return a;
		}
		function x(a) {
			return (
				(x = Object.setPrototypeOf
					? Object.getPrototypeOf
					: function (a) {
							return a.__proto__ || Object.getPrototypeOf(a);
						}),
				x(a)
			);
		}
		function y(a, b) {
			if ("function" != typeof b && null !== b)
				throw new TypeError("Super expression must either be null or a function");
			(a.prototype = Object.create(b && b.prototype, {
				constructor: { value: a, writable: !0, configurable: !0 },
			})),
				b && z(a, b);
		}
		function z(a, b) {
			return (
				(z =
					Object.setPrototypeOf ||
					function (a, b) {
						return (a.__proto__ = b), a;
					}),
				z(a, b)
			);
		}
		c.r(b);
		var A = c(0),
			B = (function () {
				function a(b, c) {
					d(this, a),
						(this.params = b),
						(this.callbackLoaded = c),
						(this.loaded = !1),
						this.buildDOM();
				}
				return (
					f(a, [
						{
							key: "getDOM",
							value: function () {
								return this.imageDOM;
							},
						},
						{
							key: "getDimensions",
							value: function () {
								return this.isLoaded
									? {
											width: this.image.naturalWidth,
											height: this.image.naturalHeight,
											ratio: this.image.naturalWidth / this.image.naturalHeight,
										}
									: { width: 0, height: 0, ratio: 1 };
							},
						},
						{
							key: "update",
							value: function (a) {
								var b = !!(1 < arguments.length && void 0 !== arguments[1]) && arguments[1];
								!0 === b
									? this.imageDOM.classList.add("transition")
									: this.imageDOM.classList.remove("transition"),
									"horizontal" === this.params.mode
										? (this.imageDOM.style.width = "".concat(a, "%"))
										: (this.imageDOM.style.height = "".concat(a, "%"));
							},
						},
						{
							key: "buildDOM",
							value: function () {
								var a = this;
								if (
									((this.imageDOM = document.createElement("div")),
									(this.imageDOM.className =
										"h5p-image-juxtaposition-image h5p-image-juxtaposition-".concat(
											this.params.position,
										)),
									this.imageDOM.setAttribute("draggable", "false"),
									(this.image = new Image()),
									(this.image.onload = function () {
										a.image.setAttribute("width", ""),
											a.image.setAttribute("height", ""),
											(a.isLoaded = !0),
											a.callbackLoaded();
									}),
									(this.image.src = this.params.image.src),
									(this.image.alt = this.params.image.alt || ""),
									(this.image.title = this.params.image.title || ""),
									(this.label = this.params.label || !1),
									this.image.setAttribute("draggable", "false"),
									this.image.setAttribute("unselectable", "on"),
									this.image.setAttribute("onselectstart", "return false;"),
									this.imageDOM.appendChild(this.image),
									this.params.label && "" !== this.params.label)
								) {
									var b = document.createElement("div");
									(b.className = "h5p-image-juxtaposition-label"),
										b.setAttribute("unselectable", "on"),
										b.setAttribute("onselectstart", "return false;"),
										b.setAttribute("onmousedown", "return false;"),
										b.setAttribute("aria-hidden", "true"),
										(b.innerHTML = this.params.label),
										this.imageDOM.appendChild(b);
								}
							},
						},
					]),
					a
				);
			})(),
			C = B,
			D = (function () {
				function a(b, c) {
					var d = this;
					g(this, a),
						(this.params = b),
						(this.callbackUpdate = c),
						(this.controller = document.createElement("div")),
						(this.controller.className = "h5p-image-juxtaposition-controller"),
						(this.controller.style.backgroundColor = this.params.color),
						this.controller.setAttribute("draggable", "false"),
						this.controller.setAttribute("tabindex", 0),
						this.controller.setAttribute("role", "slider"),
						this.controller.setAttribute("aria-valuemin", 0),
						this.controller.setAttribute("aria-valuemax", 100),
						this.controller.setAttribute("aria-orientation", this.params.mode);
					var e = document.createElement("div");
					(e.className = "h5p-image-juxtaposition-control"),
						(e.style.backgroundColor = this.params.color),
						e.setAttribute("draggable", "false"),
						e.appendChild(this.controller);
					var f = document.createElement("div");
					(f.className = "h5p-image-juxtaposition-arrow h5p-image-juxtaposition-left"),
						(f.style.borderColor =
							"horizontal" === this.params.mode
								? "transparent ".concat(this.params.color, " transparent transparent")
								: "transparent transparent ".concat(this.params.color, " transparent")),
						f.setAttribute("draggable", "false");
					var h = document.createElement("div");
					(h.className = "h5p-image-juxtaposition-arrow h5p-image-juxtaposition-right"),
						(h.style.borderColor =
							"horizontal" === this.params.mode
								? "transparent transparent transparent ".concat(this.params.color)
								: "".concat(this.params.color, " transparent transparent transparent")),
						h.setAttribute("draggable", "false"),
						(this.handle = document.createElement("div")),
						(this.handle.className = "h5p-image-juxtaposition-handle"),
						this.handle.setAttribute("draggable", "false"),
						this.handle.appendChild(f),
						this.handle.appendChild(e),
						this.handle.appendChild(h),
						this.handle.addEventListener("keydown", function (a) {
							a = a || window.event;
							var b = a.which || a.keyCode,
								c = parseFloat(d.handle.style.left || d.handle.style.top);
							35 === b
								? (a.preventDefault(), d.callbackUpdate(100))
								: 36 === b
									? (a.preventDefault(), d.callbackUpdate(0))
									: 37 === b || 38 === b
										? (a.preventDefault(), d.callbackUpdate(Math.max(0, c - 1)))
										: 39 === b || 40 === b
											? (a.preventDefault(), d.callbackUpdate(Math.min(100, c + 1)))
											: void 0;
						});
				}
				return (
					i(a, [
						{
							key: "getDOM",
							value: function () {
								return this.handle;
							},
						},
						{
							key: "update",
							value: function (a) {
								var b = !!(1 < arguments.length && void 0 !== arguments[1]) && arguments[1];
								!0 === b
									? this.handle.classList.add("transition")
									: this.handle.classList.remove("transition"),
									"horizontal" === this.params.mode
										? (this.handle.style.left = "".concat(a, "%"))
										: (this.handle.style.top = "".concat(a, "%"));
								var c =
									50 < parseInt(a, 10)
										? this.params.ariaValueTextAfter
										: this.params.ariaValueTextBefore;
								this.controller.setAttribute("aria-valuetext", c);
							},
						},
					]),
					a
				);
			})(),
			E = (function () {
				function a(b, c) {
					j(this, a),
						(this.params = b),
						(this.callbackLoaded = c),
						(this.isSliding = !1),
						(this.imagesLoaded = 0),
						this.buildDOM();
				}
				return (
					l(a, [
						{
							key: "buildDOM",
							value: function () {
								var a = this;
								(this.slider = document.createElement("div")),
									(this.slider.className = "h5p-image-juxtaposition-slider"),
									this.slider.classList.add("h5p-image-juxtaposition-" + this.params.mode),
									this.slider.setAttribute("draggable", "false"),
									this.params.container.appendChild(this.slider),
									(this.firstImage = new C(
										{
											image: this.params.images[0],
											label: this.params.images[0].label,
											mode: this.params.mode,
											position: "left",
										},
										function () {
											a.imagesLoaded++, a.handleImageLoaded();
										},
									)),
									this.slider.appendChild(this.firstImage.getDOM()),
									(this.secondImage = new C(
										{
											image: this.params.images[1],
											label: this.params.images[1].label,
											mode: this.params.mode,
											position: "right",
										},
										function () {
											a.imagesLoaded++, a.handleImageLoaded();
										},
									)),
									this.slider.appendChild(this.secondImage.getDOM()),
									(this.handle = new D(
										{
											ariaValueTextAfter: this.buildAriaValueText(
												this.params.images[1].label,
												this.params.images[1].alt,
											),
											ariaValueTextBefore: this.buildAriaValueText(
												this.params.images[0].label,
												this.params.images[0].alt,
											),
											color: this.params.color,
											mode: this.params.mode,
										},
										function (b) {
											a.update(b);
										},
									)),
									this.slider.appendChild(this.handle.getDOM());
							},
						},
						{
							key: "update",
							value: function (a) {
								var b = !!(1 < arguments.length && void 0 !== arguments[1]) && arguments[1],
									c = this.extractPosition(a).toFixed(2),
									d = 100 - c;
								0 > c ||
									100 < c ||
									0 > d ||
									100 < d ||
									(this.firstImage.update(c, b),
									this.secondImage.update(d, b),
									this.handle.update(c, b));
							},
						},
						{
							key: "resize",
							value: function (a) {
								var b,
									c,
									d = 0;
								a
									? this.imageRatio <= a.width / a.height
										? ((b = a.height),
											(c = b * this.imageRatio),
											(d = (a.width - c) / 2),
											(c = "".concat(c, "px")))
										: ((c = a.width), (b = c / this.imageRatio), (c = "".concat(c, "px")))
									: ((c = window.innerWidth - 2), (b = c / this.imageRatio), (c = "100%")),
									this.params.container &&
										((this.params.container.style.width = c),
										(this.params.container.style.height = "".concat(b, "px")),
										(this.params.container.style.paddingLeft = "".concat(d, "px")));
							},
						},
						{
							key: "handleImageLoaded",
							value: function () {
								if (!(2 > this.imagesLoaded)) {
									var a = [this.firstImage.getDimensions(), this.secondImage.getDimensions()];
									a[0].ratio !== a[1].ratio &&
										console.warn("Make sure that both images have the same aspect ratio."),
										(this.imageRatio = a[0].ratio),
										(this.params.container.style.width = a[0].width),
										this.addEventListeners(),
										this.update(this.params.startingPosition, !1),
										this.callbackLoaded();
								}
							},
						},
						{
							key: "buildAriaValueText",
							value: function () {
								var a = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "",
									b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "";
								return "" === a ? b : "".concat(a, ". ").concat(b);
							},
						},
						{
							key: "extractPosition",
							value: function (a) {
								if ("string" == typeof a || "number" == typeof a) return parseInt(a, 10);
								var b = this.slider.getBoundingClientRect(),
									c = {
										top: b.top + document.body.scrollTop,
										left: b.left + document.body.scrollLeft,
									},
									d =
										"horizontal" === this.params.mode
											? this.slider.offsetWidth
											: this.slider.offsetHeight,
									e = "horizontal" === this.params.mode ? this.getPageX(a) : this.getPageY(a),
									f = "horizontal" === this.params.mode ? c.left : c.top;
								return 100 * ((e - f) / d);
							},
						},
						{
							key: "getPageX",
							value: function (a) {
								var b;
								return (
									(b = a.pageX
										? a.pageX
										: a.touches
											? a.touches[0].pageX
											: a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft),
									b
								);
							},
						},
						{
							key: "getPageY",
							value: function (a) {
								var b;
								return (
									(b = a.pageY
										? a.pageY
										: a.touches
											? a.touches[0].pageY
											: a.clientY + document.body.scrollTop + document.documentElement.scrollTop),
									b
								);
							},
						},
						{
							key: "addEventListeners",
							value: function () {
								var a = this;
								this.slider.addEventListener("mousedown", function (b) {
									(b = b || window.event), a.update(b, !0), (a.isSliding = !0);
								}),
									window.addEventListener("mousemove", function (b) {
										(b = b || window.event),
											b.preventDefault(),
											!0 === a.isSliding && a.update(b, !1);
									}),
									this.slider.addEventListener("touchstart", function (b) {
										(b = b || window.event),
											b.preventDefault(),
											b.stopPropagation(),
											a.update(b, !0);
									}),
									this.slider.addEventListener("touchmove", function (b) {
										(b = b || window.event),
											b.preventDefault(),
											b.stopPropagation(),
											a.update(b, !1);
									}),
									window.addEventListener("mouseup", function (b) {
										(b = b || window.event),
											b.preventDefault(),
											b.stopPropagation(),
											(a.isSliding = !1);
									});
							},
						},
					]),
					a
				);
			})(),
			F = (function () {
				function a(b) {
					m(this, a),
						(this.classNameBase = b),
						(this.container = document.createElement("div")),
						this.container.classList.add("".concat(this.classNameBase, "-container")),
						(this.spinnerElement = document.createElement("div")),
						this.spinnerElement.classList.add(b);
					var c = document.createElement("div");
					c.classList.add("".concat(this.classNameBase, "-circle-head")),
						this.spinnerElement.appendChild(c);
					var d = document.createElement("div");
					d.classList.add("".concat(this.classNameBase, "-circle-neck-upper")),
						this.spinnerElement.appendChild(d);
					var e = document.createElement("div");
					e.classList.add("".concat(this.classNameBase, "-circle-neck-lower")),
						this.spinnerElement.appendChild(e);
					var f = document.createElement("div");
					f.classList.add("".concat(this.classNameBase, "-circle-body")),
						this.spinnerElement.appendChild(f),
						this.container.appendChild(this.spinnerElement);
				}
				return (
					o(a, [
						{
							key: "getDOM",
							value: function () {
								return this.container;
							},
						},
						{
							key: "show",
							value: function () {
								this.container.classList.remove("".concat(this.classNameBase, "-none"));
							},
						},
						{
							key: "hide",
							value: function () {
								this.container.classList.add("".concat(this.classNameBase, "-none"));
							},
						},
					]),
					a
				);
			})(),
			G = (function () {
				function a() {
					q(this, a);
				}
				return (
					s(a, null, [
						{
							key: "extend",
							value: function () {
								for (var a = 1; a < arguments.length; a++)
									for (var b in arguments[a])
										arguments[a].hasOwnProperty(b) &&
											("object" === p(arguments[0][b]) && "object" === p(arguments[a][b])
												? this.extend(arguments[0][b], arguments[a][b])
												: (arguments[0][b] = arguments[a][b]));
								return arguments[0];
							},
						},
					]),
					a
				);
			})(),
			H = (function (a) {
				function b(a, c, d) {
					var e;
					return (
						u(this, b),
						(e = v(this, x(b).call(this, "image-juxtaposition"))),
						(e.params = G.extend(
							{
								title: "",
								imageBefore: { imageBefore: void 0, labelBefore: "" },
								imageAfter: { imageAfter: void 0, labelAfter: "" },
								behavior: {
									startingPosition: 50,
									sliderOrientation: "horizontal",
									sliderColor: "#f3f3f3",
								},
							},
							a,
						)),
						(e.contentId = c),
						(e.contentData = d),
						Element.prototype.matches ||
							(Element.prototype.matches =
								Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
						Element.prototype.closest ||
							(Element.prototype.closest = function (a) {
								var b = this;
								do {
									if (b.matches(a)) return b;
									b = b.parentElement || b.parentNode;
								} while (null !== b && 1 === b.nodeType);
								return null;
							}),
						e.on("exitFullScreen", function () {
							e.trigger("resize");
						}),
						(e.registerDomElements = function () {
							var a = document.createElement("div");
							if (
								(a.classList.add("h5p-image-juxtaposition-container"),
								(e.spinner = new F("h5p-image-juxtaposition-spinner")),
								a.appendChild(e.spinner.getDOM()),
								e.params.title &&
									((e.title = document.createElement("div")),
									e.title.classList.add("h5p-image-juxtaposition-title"),
									e.title.classList.add("h5p-image-juxtaposition-title-none"),
									(e.title.innerHTML = e.params.title),
									a.appendChild(e.title)),
								!e.params.imageBefore.imageBefore.params.file ||
									!e.params.imageBefore.imageBefore.params.file.path ||
									!e.params.imageAfter.imageAfter.params.file ||
									!e.params.imageAfter.imageAfter.params.file.path)
							) {
								var b = document.createElement("div");
								b.classList.add("h5p-image-juxtaposition-missing-images"),
									(b.innerHTML = "I really need two background images :)"),
									a.appendChild(b),
									e.spinner.hide();
							} else {
								var c = document.createElement("div");
								c.classList.add("h5p-image-juxtaposition-juxtapose"), a.appendChild(c);
								var d = new E(
									{
										container: c,
										images: [
											{
												src: H5P.getPath(
													e.params.imageBefore.imageBefore.params.file.path,
													e.contentId,
												),
												alt: e.params.imageBefore.imageBefore.params.alt,
												title: e.params.imageBefore.imageBefore.params.title,
												label: e.params.imageBefore.labelBefore,
											},
											{
												src: H5P.getPath(
													e.params.imageAfter.imageAfter.params.file.path,
													e.contentId,
												),
												alt: e.params.imageAfter.imageAfter.params.alt,
												title: e.params.imageAfter.imageAfter.params.title,
												label: e.params.imageAfter.labelAfter,
											},
										],
										startingPosition: e.params.behavior.startingPosition + "%",
										mode: e.params.behavior.sliderOrientation,
										color: e.params.behavior.sliderColor,
									},
									function () {
										e.handleLoaded();
									},
								);
								e.on("resize", function () {
									e.containerH5P = a.closest(".h5p-image-juxtaposition");
									var b =
											e.containerH5P.classList.contains("h5p-fullscreen") ||
											e.containerH5P.classList.contains("h5p-semi-fullscreen"),
										c = b
											? { height: window.innerHeight - e.titleHeight, width: window.innerWidth }
											: void 0;
									d.resize(c);
								});
							}
							e.setContent(a);
						}),
						(e.handleLoaded = function () {
							e.spinner.hide(),
								e.title
									? (e.title.classList.remove("h5p-image-juxtaposition-title-none"),
										setTimeout(function () {
											var a = window.getComputedStyle(e.title),
												b = parseFloat(a.marginTop) + parseFloat(a.marginBottom);
											e.titleHeight = Math.ceil(e.title.offsetHeight + b);
										}, 0))
									: (e.titleHeight = 0),
								e.trigger("resize");
						}),
						(e.getTitle = function () {
							var a;
							return (
								e.contentData && e.contentData.metadata && (a = e.contentData.metadata.title),
								(a = a || b.DEFAULT_DESCRIPTION),
								H5P.createTitle(a)
							);
						}),
						e
					);
				}
				return y(b, a), b;
			})(H5P.Question);
		H.DEFAULT_DESCRIPTION = "Image Juxtaposition";
		(H5P = H5P || {}), (H5P.ImageJuxtaposition = H);
	},
]);
