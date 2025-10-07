!(function (e) {
	var r = {};
	function t(a) {
		if (r[a]) return r[a].exports;
		var n = (r[a] = { i: a, l: !1, exports: {} });
		return e[a].call(n.exports, n, n.exports, t), (n.l = !0), n.exports;
	}
	(t.m = e),
		(t.c = r),
		(t.d = function (e, r, a) {
			t.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: a });
		}),
		(t.r = function (e) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(e, "__esModule", { value: !0 });
		}),
		(t.t = function (e, r) {
			if ((1 & r && (e = t(e)), 8 & r)) return e;
			if (4 & r && "object" == typeof e && e && e.__esModule) return e;
			var a = Object.create(null);
			if (
				(t.r(a),
				Object.defineProperty(a, "default", { enumerable: !0, value: e }),
				2 & r && "string" != typeof e)
			)
				for (var n in e)
					t.d(
						a,
						n,
						function (r) {
							return e[r];
						}.bind(null, n),
					);
			return a;
		}),
		(t.n = function (e) {
			var r =
				e && e.__esModule
					? function () {
							return e.default;
						}
					: function () {
							return e;
						};
			return t.d(r, "a", r), r;
		}),
		(t.o = function (e, r) {
			return Object.prototype.hasOwnProperty.call(e, r);
		}),
		(t.p = ""),
		t((t.s = 1));
})([
	function (e, r, t) {},
	function (e, r, t) {
		"use strict";
		t.r(r);
		t(0);
		function a(e, r) {
			if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
		}
		function n(e, r) {
			for (var t = 0; t < r.length; t++) {
				var a = r[t];
				(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
			}
		}
		var i = H5P.jQuery,
			s = (function () {
				function e(r, t, n, s) {
					var o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
					return (
						a(this, e),
						(this.card = r),
						(this.params = t || {}),
						(this.id = n),
						(this.contentId = s),
						(this.callbacks = o),
						(this.$cardWrapper = i("<div>", {
							class: "h5p-dialogcards-cardwrap",
							role: "group",
							tabindex: "-1",
						})),
						"repetition" !== this.params.mode &&
							this.$cardWrapper.attr(
								"aria-labelledby",
								"h5p-dialogcards-progress-" + H5P.Dialogcards.idCounter,
							),
						(this.$cardHolder = i("<div>", { class: "h5p-dialogcards-cardholder" }).appendTo(
							this.$cardWrapper,
						)),
						this.createCardContent(r).appendTo(this.$cardHolder),
						this
					);
				}
				var r, t, s;
				return (
					(r = e),
					(t = [
						{
							key: "createCardContent",
							value: function (e) {
								var r = i("<div>", { class: "h5p-dialogcards-card-content" });
								this.createCardImage(e).appendTo(r);
								var t = i("<div>", { class: "h5p-dialogcards-card-text-wrapper" }).appendTo(r),
									a = i("<div>", { class: "h5p-dialogcards-card-text-inner" }).appendTo(t),
									n = i("<div>", { class: "h5p-dialogcards-card-text-inner-content" }).appendTo(a);
								this.createCardAudio(e).appendTo(n);
								var s = i("<div>", { class: "h5p-dialogcards-card-text" }).appendTo(n);
								return (
									(this.$cardTextArea = i("<div>", {
										class: "h5p-dialogcards-card-text-area",
										tabindex: "-1",
										html: e.text,
									}).appendTo(s)),
									(e.text && e.text.length) || s.addClass("hide"),
									this.createCardFooter().appendTo(t),
									r
								);
							},
						},
						{
							key: "createCardImage",
							value: function (e) {
								this.$image;
								var r = i("<div>", { class: "h5p-dialogcards-image-wrapper" });
								return (
									void 0 !== e.image
										? ((this.image = e.image),
											(this.$image = i(
												'<img class="h5p-dialogcards-image" src="' +
													H5P.getPath(e.image.path, this.contentId) +
													'"/>',
											)),
											e.imageAltText && this.$image.attr("alt", e.imageAltText))
										: (this.$image = i('<div class="h5p-dialogcards-image"></div>')),
									this.$image.appendTo(r),
									r
								);
							},
						},
						{
							key: "createCardAudio",
							value: function (e) {
								if (
									(this.audio,
									(this.$audioWrapper = i("<div>", { class: "h5p-dialogcards-audio-wrapper" })),
									void 0 !== e.audio)
								) {
									var r = { files: e.audio, audioNotSupported: this.params.audioNotSupported };
									(this.audio = new H5P.Audio(r, this.contentId)),
										this.audio.attach(this.$audioWrapper),
										this.audio.audio &&
											this.audio.audio.preload &&
											(this.audio.audio.preload = "none");
								} else this.$audioWrapper.addClass("hide");
								return this.$audioWrapper;
							},
						},
						{
							key: "createCardFooter",
							value: function () {
								var e = i("<div>", { class: "h5p-dialogcards-card-footer" }),
									r = "h5p-dialogcards-button-hidden",
									t = "-1";
								return (
									"repetition" === this.params.mode &&
										((r = ""),
										this.params.behaviour.quickProgression &&
											((r = "h5p-dialogcards-quick-progression"), (t = "0"))),
									(this.$buttonTurn = H5P.JoubelUI.createButton({
										class: "h5p-dialogcards-turn",
										html: this.params.answer,
									}).appendTo(e)),
									(this.$buttonShowSummary = H5P.JoubelUI.createButton({
										class: "h5p-dialogcards-show-summary h5p-dialogcards-button-gone",
										html: this.params.showSummary,
									}).appendTo(e)),
									(this.$buttonIncorrect = H5P.JoubelUI.createButton({
										class: "h5p-dialogcards-answer-button",
										html: this.params.incorrectAnswer,
									})
										.addClass("incorrect")
										.addClass(r)
										.attr("tabindex", t)
										.appendTo(e)),
									(this.$buttonCorrect = H5P.JoubelUI.createButton({
										class: "h5p-dialogcards-answer-button",
										html: this.params.correctAnswer,
									})
										.addClass("correct")
										.addClass(r)
										.attr("tabindex", t)
										.appendTo(e)),
									e
								);
							},
						},
						{
							key: "createButtonListeners",
							value: function () {
								var e = this;
								this.$buttonIncorrect.unbind("click").click(function (r) {
									r.target.classList.contains("h5p-dialogcards-quick-progression") &&
										e.callbacks.onNextCard({ cardId: e.id, result: !1 });
								}),
									this.$buttonTurn.unbind("click").click(function () {
										e.turnCard();
									}),
									this.$buttonCorrect.unbind("click").click(function (r) {
										r.target.classList.contains("h5p-dialogcards-quick-progression") &&
											e.callbacks.onNextCard({ cardId: e.id, result: !0 });
									});
							},
						},
						{
							key: "showSummaryButton",
							value: function (e) {
								this.getDOM()
									.find(".h5p-dialogcards-answer-button")
									.addClass("h5p-dialogcards-button-hidden")
									.attr("tabindex", "-1"),
									this.$buttonTurn.addClass("h5p-dialogcards-button-gone"),
									this.$buttonShowSummary
										.click(function () {
											return e();
										})
										.removeClass("h5p-dialogcards-button-gone")
										.focus();
							},
						},
						{
							key: "hideSummaryButton",
							value: function () {
								"normal" !== this.params.mode &&
									(this.getDOM()
										.find(".h5p-dialogcards-answer-button")
										.removeClass("h5p-dialogcards-button-hidden")
										.attr("tabindex", "0"),
									this.$buttonTurn.removeClass("h5p-dialogcards-button-gone"),
									this.$buttonShowSummary.addClass("h5p-dialogcards-button-gone"));
							},
						},
						{
							key: "turnCard",
							value: function () {
								var e = this,
									r = this.getDOM(),
									t = r.find(".h5p-dialogcards-card-content"),
									a = r.find(".h5p-dialogcards-cardholder").addClass("h5p-dialogcards-collapse");
								t.find(".joubel-tip-container").remove();
								var n = t.hasClass("h5p-dialogcards-turned");
								t.toggleClass("h5p-dialogcards-turned", !n),
									setTimeout(function () {
										if (
											(a.removeClass("h5p-dialogcards-collapse"),
											e.changeText(n ? e.getText() : e.getAnswer()),
											n ? a.find(".h5p-audio-inner").removeClass("hide") : e.removeAudio(a),
											"repetition" === e.params.mode && !e.params.behaviour.quickProgression)
										) {
											var i = r.find(".h5p-dialogcards-answer-button");
											!1 === i.hasClass("h5p-dialogcards-quick-progression") &&
												i.addClass("h5p-dialogcards-quick-progression").attr("tabindex", 0);
										}
										setTimeout(function () {
											e.addTipToCard(t, n ? "front" : "back"),
												"function" == typeof e.callbacks.onCardTurned &&
													e.callbacks.onCardTurned(n);
										}, 200),
											e.resizeOverflowingText(),
											e.$cardTextArea.focus();
									}, 200);
							},
						},
						{
							key: "changeText",
							value: function (e) {
								this.$cardTextArea.html(e), this.$cardTextArea.toggleClass("hide", !e || !e.length);
							},
						},
						{
							key: "setProgressText",
							value: function (e, r) {
								if ("repetition" === this.params.mode) {
									var t = this.params.progressText
										.replace("@card", e.toString())
										.replace("@total", r.toString());
									this.$cardWrapper.attr("aria-label", t);
								}
							},
						},
						{
							key: "resizeOverflowingText",
							value: function () {
								if (this.params.behaviour.scaleTextNotCard) {
									var e = this.getDOM().find(".h5p-dialogcards-card-text"),
										r = e.children();
									this.resizeTextToFitContainer(e, r);
								}
							},
						},
						{
							key: "resizeTextToFitContainer",
							value: function (r, t) {
								t.css("font-size", "");
								var a = r.get(0).getBoundingClientRect().height,
									n = t.get(0).getBoundingClientRect().height,
									i = parseFloat(r.css("font-size")),
									s = parseFloat(t.css("font-size")),
									o = this.getDOM().closest(".h5p-container"),
									d = parseFloat(o.css("font-size"));
								if (n > a)
									for (var c = !0; c; ) {
										if ((s -= e.SCALEINTERVAL) < e.MINSCALE) {
											c = !1;
											break;
										}
										t.css("font-size", s / i + "em"),
											(n = t.get(0).getBoundingClientRect().height) <= a && (c = !1);
									}
								else
									for (var l = !0; l; ) {
										if ((s += e.SCALEINTERVAL) > d) {
											l = !1;
											break;
										}
										t.css("font-size", s / i + "em"),
											(n = t.get(0).getBoundingClientRect().height) >= a &&
												((l = !1), (s -= e.SCALEINTERVAL), t.css("font-size", s / i + "em"));
									}
							},
						},
						{
							key: "addTipToCard",
							value: function (e, r, t) {
								"back" !== r && (r = "front"),
									void 0 === t && (t = this.id),
									e.find(".joubel-tip-container").remove();
								var a = this.card.tips;
								if (void 0 !== a && void 0 !== a[r]) {
									var n = a[r].trim();
									n.length &&
										e
											.find(".h5p-dialogcards-card-text-wrapper .h5p-dialogcards-card-text-inner")
											.after(H5P.JoubelUI.createTip(n, { tipLabel: this.params.tipButtonLabel }));
								}
							},
						},
						{
							key: "setCardFocus",
							value: function (e) {
								if (!0 === e) this.$cardTextArea.focus();
								else {
									var r = this.getDOM();
									r.one("transitionend", function () {
										r.focus();
									});
								}
							},
						},
						{
							key: "stopAudio",
							value: function () {
								var e = this;
								this.audio &&
									this.audio.audio &&
									(this.audio.audio.duration > 0 &&
										(this.audio.audio.currentTime = this.audio.audio.duration),
									this.audio.audio.load &&
										setTimeout(function () {
											e.audio.audio.load();
										}, 100));
							},
						},
						{
							key: "removeAudio",
							value: function () {
								this.stopAudio(), this.getDOM().find(".h5p-audio-inner").addClass("hide");
							},
						},
						{
							key: "getDOM",
							value: function () {
								return this.$cardWrapper;
							},
						},
						{
							key: "getText",
							value: function () {
								return this.card.text;
							},
						},
						{
							key: "getAnswer",
							value: function () {
								return this.card.answer;
							},
						},
						{
							key: "getImage",
							value: function () {
								return this.$image;
							},
						},
						{
							key: "getImageSize",
							value: function () {
								return this.image
									? { width: this.image.width, height: this.image.height }
									: this.image;
							},
						},
						{
							key: "getAudio",
							value: function () {
								return this.$audioWrapper;
							},
						},
						{
							key: "reset",
							value: function () {
								var e = this.getDOM();
								e.removeClass("h5p-dialogcards-previous"),
									e.removeClass("h5p-dialogcards-current"),
									this.changeText(this.getText());
								var r = e.find(".h5p-dialogcards-card-content");
								r.removeClass("h5p-dialogcards-turned"),
									this.addTipToCard(r, "front", this.id),
									this.params.behaviour.quickProgression ||
										e
											.find(".h5p-dialogcards-answer-button")
											.removeClass("h5p-dialogcards-quick-progression"),
									this.hideSummaryButton();
							},
						},
					]) && n(r.prototype, t),
					s && n(r, s),
					e
				);
			})();
		(s.SCALEINTERVAL = 0.2), (s.MAXSCALE = 16), (s.MINSCALE = 4);
		var o = s;
		function d(e, r) {
			for (var t = 0; t < r.length; t++) {
				var a = r[t];
				(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
			}
		}
		var c = (function () {
			function e(r, t, a) {
				var n = this;
				return (
					(function (e, r) {
						if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
					})(this, e),
					(this.params = r),
					(this.contentId = t),
					(this.callbacks = a),
					(this.cards = []),
					this.params.dialogs.forEach(function (e, r) {
						(e.id = r), n.cards.push(r);
					}),
					this
				);
			}
			var r, t, a;
			return (
				(r = e),
				(t = [
					{
						key: "getCard",
						value: function (e) {
							if (!(e < 0 || e > this.cards.length))
								return "number" == typeof this.cards[e] && this.loadCard(e), this.cards[e];
						},
					},
					{
						key: "getCardIds",
						value: function () {
							return this.cards.map(function (e, r) {
								return r;
							});
						},
					},
					{
						key: "loadCard",
						value: function (e) {
							e < 0 ||
								e > this.cards.length ||
								("number" == typeof this.cards[e] &&
									(this.cards[e] = new o(
										this.params.dialogs[e],
										this.params,
										e,
										this.contentId,
										this.callbacks,
									)));
						},
					},
				]) && d(r.prototype, t),
				a && d(r, a),
				e
			);
		})();
		function l(e) {
			return (
				(function (e) {
					if (Array.isArray(e)) return u(e);
				})(e) ||
				(function (e) {
					if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
				})(e) ||
				(function (e, r) {
					if (!e) return;
					if ("string" == typeof e) return u(e, r);
					var t = Object.prototype.toString.call(e).slice(8, -1);
					"Object" === t && e.constructor && (t = e.constructor.name);
					if ("Map" === t || "Set" === t) return Array.from(e);
					if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
						return u(e, r);
				})(e) ||
				(function () {
					throw new TypeError(
						"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
					);
				})()
			);
		}
		function u(e, r) {
			(null == r || r > e.length) && (r = e.length);
			for (var t = 0, a = new Array(r); t < r; t++) a[t] = e[t];
			return a;
		}
		function h(e, r) {
			if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
		}
		function p(e, r) {
			for (var t = 0; t < r.length; t++) {
				var a = r[t];
				(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
			}
		}
		var g = (function () {
			function e() {
				var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
				return (
					h(this, e),
					(this.cards = r.filter(function (e, t) {
						return r.indexOf(e) >= t;
					})),
					this
				);
			}
			var r, t, a;
			return (
				(r = e),
				(t = [
					{
						key: "getCards",
						value: function () {
							return this.cards;
						},
					},
					{
						key: "peek",
						value: function (e) {
							var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
							return (
								(r = Math.max(0, r)),
								"top" === e && (e = 0),
								"bottom" === e && (e = this.cards.length - r),
								e < 0 || e > this.cards.length - 1 ? [] : this.cards.slice(e, e + r)
							);
						},
					},
					{
						key: "add",
						value: function (e) {
							var r = this,
								t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "top";
							"number" == typeof e && (e = [e]),
								e.forEach(function (a) {
									var n;
									-1 === r.cards.indexOf(a) &&
										("top" === t
											? (t = 0)
											: "bottom" === t
												? (t = r.cards.length)
												: "random" === t && (t = Math.floor(Math.random() * r.cards.length)),
										(n = r.cards).splice.apply(n, [t, 0].concat(l(e))));
								});
						},
					},
					{
						key: "push",
						value: function (e) {
							this.add(e, "top");
						},
					},
					{
						key: "pull",
						value: function () {
							var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
								r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "top";
							return (
								(e = Math.max(1, Math.min(e, this.cards.length))),
								"top" === r && (r = 0),
								"bottom" === r && (r = -e),
								(r = Math.max(0, Math.min(r, this.cards.length - 1))),
								this.cards.splice(r, e)
							);
						},
					},
					{
						key: "remove",
						value: function (e) {
							var r = this;
							"number" == typeof e && (e = [e]),
								e.forEach(function (e) {
									var t = r.cards.indexOf(e);
									t > -1 && r.cards.splice(t, 1);
								});
						},
					},
					{
						key: "shuffle",
						value: function () {
							for (var e = this.cards.length - 1; e > 0; e--) {
								var r = Math.floor(Math.random() * (e + 1)),
									t = [this.cards[r], this.cards[e]];
								(this.cards[e] = t[0]), (this.cards[r] = t[1]);
							}
							return this.cards;
						},
					},
					{
						key: "contains",
						value: function (e) {
							return -1 !== this.cards.indexOf(e);
						},
					},
					{
						key: "length",
						value: function () {
							return this.cards.length;
						},
					},
				]) && p(r.prototype, t),
				a && p(r, a),
				e
			);
		})();
		function f(e) {
			return (
				(function (e) {
					if (Array.isArray(e)) return m(e);
				})(e) ||
				(function (e) {
					if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
				})(e) ||
				(function (e, r) {
					if (!e) return;
					if ("string" == typeof e) return m(e, r);
					var t = Object.prototype.toString.call(e).slice(8, -1);
					"Object" === t && e.constructor && (t = e.constructor.name);
					if ("Map" === t || "Set" === t) return Array.from(e);
					if ("Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
						return m(e, r);
				})(e) ||
				(function () {
					throw new TypeError(
						"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
					);
				})()
			);
		}
		function m(e, r) {
			(null == r || r > e.length) && (r = e.length);
			for (var t = 0, a = new Array(r); t < r; t++) a[t] = e[t];
			return a;
		}
		function v(e, r) {
			for (var t = 0; t < r.length; t++) {
				var a = r[t];
				(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
			}
		}
		var b = (function () {
			function e(r, t, a) {
				return (
					(function (e, r) {
						if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
					})(this, e),
					(this.params = r),
					(this.cardPool = new c(r, t, a)),
					this.reset(r.cardPiles),
					this
				);
			}
			var r, t, a;
			return (
				(r = e),
				(t = [
					{
						key: "createSelection",
						value: function () {
							var e = [];
							switch (this.params.mode) {
								case "repetition":
									e = this.createSelectionRepetition();
									break;
								default:
									e = this.cardPool.getCardIds();
							}
							return e;
						},
					},
					{
						key: "createPiles",
						value: function (e) {
							if (e)
								this.cardPiles = e.map(function (e) {
									return new g(e.cards);
								});
							else {
								this.cardPiles = [];
								var r = this.cardPool.getCardIds();
								switch (this.params.mode) {
									case "repetition":
										for (var t = 0; t < this.params.behaviour.maxProficiency; t++)
											0 === t ? this.cardPiles.push(new g(r)) : this.cardPiles.push(new g());
										break;
									case "normal":
										this.cardPiles.push(new g(r));
								}
							}
						},
					},
					{
						key: "updatePiles",
						value: function (e) {
							var r = this;
							return (
								e.forEach(function (e) {
									var t = r.find(e.cardId);
									if (-1 !== t) {
										var a = !0 === e.result ? t + 1 : 0;
										(a = Math.max(0, Math.min(a, r.cardPiles.length - 1))),
											r.cardPiles[t].remove(e.cardId),
											r.cardPiles[a].add(e.cardId, "bottom");
									}
								}),
								this.getPileSizes()
							);
						},
					},
					{
						key: "createSelectionRepetition",
						value: function () {
							for (var e = [], r = null, t = 0; t < this.cardPiles.length - 1; t++) {
								var a,
									n = this.cardPiles[t].length();
								if (null !== r || 0 !== n) {
									null === r && (r = t);
									var i = Math.ceil((1 * n) / (1 + t - r)),
										s = this.cardPiles[t].peek(0, i);
									e = (a = e).concat.apply(a, f(s));
								}
							}
							return (e = this.shuffle(e));
						},
					},
					{
						key: "shuffle",
						value: function (e) {
							for (var r = e.slice(), t = r.length - 1; t > 0; t--) {
								var a = Math.floor(Math.random() * (t + 1)),
									n = [r[a], r[t]];
								(r[t] = n[0]), (r[a] = n[1]);
							}
							return r;
						},
					},
					{
						key: "find",
						value: function (e) {
							var r = -1;
							return (
								this.cardPiles.forEach(function (t, a) {
									if (-1 !== r) return r;
									t.contains(e) && (r = a);
								}),
								r
							);
						},
					},
					{
						key: "reset",
						value: function (e) {
							this.createPiles(e);
						},
					},
					{
						key: "getCard",
						value: function (e) {
							return this.cardPool.getCard(e);
						},
					},
					{
						key: "getSize",
						value: function () {
							return this.cardPool.getCardIds().length;
						},
					},
					{
						key: "getPiles",
						value: function () {
							return this.cardPiles;
						},
					},
					{
						key: "getPileSizes",
						value: function () {
							return this.cardPiles.map(function (e) {
								return e.length();
							});
						},
					},
				]) && v(r.prototype, t),
				a && v(r, a),
				e
			);
		})();
		function y(e, r) {
			for (var t = 0; t < r.length; t++) {
				var a = r[t];
				(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
			}
		}
		var C = (function () {
			function e(r, t) {
				var a = this;
				!(function (e, r) {
					if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
				})(this, e),
					(this.params = r),
					(this.callbacks = t),
					(this.currentCallback = t.nextRound),
					(this.fields = []),
					(this.container = document.createElement("div")),
					this.container.classList.add("h5p-dialogcards-summary-screen");
				var n = this.createContainerDOM(r.summary);
				(this.fields.round = n.getElementsByClassName("h5p-dialogcards-summary-subheader")[0]),
					(this.fields["h5p-dialogcards-round-cards-right"] = this.addTableRow(n, {
						category: this.params.summaryCardsRight,
						symbol: "h5p-dialogcards-check",
					})),
					(this.fields["h5p-dialogcards-round-cards-wrong"] = this.addTableRow(n, {
						category: this.params.summaryCardsWrong,
						symbol: "h5p-dialogcards-times",
					})),
					(this.fields["h5p-dialogcards-round-cards-not-shown"] = this.addTableRow(n, {
						category: this.params.summaryCardsNotShown,
					}));
				var i = this.createContainerDOM(r.summaryOverallScore);
				(this.fields["h5p-dialogcards-overall-cards-completed"] = this.addTableRow(i, {
					category: this.params.summaryCardsCompleted,
					symbol: "h5p-dialogcards-check",
				})),
					(this.fields["h5p-dialogcards-overall-completed-rounds"] = this.addTableRow(i, {
						category: this.params.summaryCompletedRounds,
						symbol: "",
					}));
				var s = document.createElement("div");
				s.classList.add("h5p-dialogcards-summary-message"), (this.fields.message = s);
				var o = H5P.JoubelUI.createButton({
					class: "h5p-dialogcards-buttonNextRound",
					title: this.params.nextRound.replace("@round", 2),
					html: this.params.nextRound.replace("@round", 2),
				})
					.click(this.currentCallback)
					.get(0);
				this.fields.button = o;
				var d = H5P.JoubelUI.createButton({
						class: "h5p-dialogcards-button-restart",
						title: this.params.startOver,
						html: this.params.startOver,
					}).get(0),
					c = this.createConfirmationDialog(
						{ l10n: this.params.confirmStartingOver, instance: this },
						function () {
							setTimeout(function () {
								a.callbacks.retry();
							}, 100);
						},
					);
				d.addEventListener("click", function (e) {
					c.show(e.target.offsetTop);
				}),
					(this.fields.buttonStartOver = d);
				var l = document.createElement("div");
				return (
					l.classList.add("h5p-dialogcards-summary-footer"),
					l.appendChild(d),
					l.appendChild(o),
					this.container.appendChild(n),
					this.container.appendChild(i),
					this.container.appendChild(s),
					this.container.appendChild(l),
					this.hide(),
					this
				);
			}
			var r, t, a;
			return (
				(r = e),
				(t = [
					{
						key: "getDOM",
						value: function () {
							return this.container;
						},
					},
					{
						key: "createContainerDOM",
						value: function (e) {
							var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
								t = document.createElement("div");
							t.classList.add("h5p-dialogcards-summary-container");
							var a = document.createElement("div");
							a.classList.add("h5p-dialogcards-summary-header"),
								(a.innerHTML = e),
								t.appendChild(a);
							var n = document.createElement("div");
							n.classList.add("h5p-dialogcards-summary-subheader"),
								(n.innerHTML = r),
								t.appendChild(n);
							var i = document.createElement("table");
							return i.classList.add("h5p-dialogcards-summary-table"), t.appendChild(i), t;
						},
					},
					{
						key: "addTableRow",
						value: function (e, r) {
							var t = e.getElementsByClassName("h5p-dialogcards-summary-table")[0],
								a = document.createElement("tr"),
								n = document.createElement("td");
							n.classList.add("h5p-dialogcards-summary-table-row-category"),
								(n.innerHTML = r.category),
								a.appendChild(n);
							var i = document.createElement("td");
							i.classList.add("h5p-dialogcards-summary-table-row-symbol"),
								void 0 !== r.symbol && "" !== r.symbol && i.classList.add(r.symbol),
								a.appendChild(i);
							var s = document.createElement("td");
							return (
								s.classList.add("h5p-dialogcards-summary-table-row-score"),
								a.appendChild(s),
								t.appendChild(a),
								s
							);
						},
					},
					{
						key: "update",
						value: function () {
							var e = this,
								r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
								t = r.done,
								a = void 0 !== t && t,
								n = r.round,
								i = void 0 === n ? void 0 : n,
								s = r.message,
								o = void 0 === s ? void 0 : s,
								d = r.results,
								c = void 0 === d ? [] : d;
							!0 === a
								? (this.fields.buttonStartOver.classList.add("h5p-dialogcards-button-gone"),
									this.params.behaviour.enableRetry
										? (this.fields.button.classList.remove("h5p-dialogcards-button-next-round"),
											this.fields.button.classList.add("h5p-dialogcards-button-restart"),
											(this.fields.button.innerHTML = this.params.retry),
											(this.fields.button.title = this.params.retry),
											(this.currentCallback = this.callbacks.retry))
										: this.fields.button.classList.add("h5p-dialogcards-button-gone"))
								: (this.fields.buttonStartOver.classList.remove("h5p-dialogcards-button-gone"),
									this.fields.button.classList.add("h5p-dialogcards-button-next-round"),
									this.fields.button.classList.remove("h5p-dialogcards-button-restart"),
									(this.fields.button.innerHTML = this.params.nextRound),
									(this.fields.button.title = this.params.nextRound),
									(this.currentCallback = this.callbacks.nextRound)),
								H5P.jQuery(this.fields.button).unbind("click").click(this.currentCallback),
								(this.fields.round.innerHTML = this.params.round.replace("@round", i)),
								a ||
									void 0 === i ||
									((this.fields.button.innerHTML = this.params.nextRound.replace("@round", i + 1)),
									(this.fields.button.title = this.params.nextRound.replace("@round", i + 1))),
								a && void 0 !== o && "" !== o
									? (this.fields.message.classList.remove("h5p-dialogcards-gone"),
										(this.fields.message.innerHTML = o))
									: this.fields.message.classList.add("h5p-dialogcards-gone"),
								c.forEach(function (r) {
									var t = void 0 !== r.score.value ? r.score.value : "";
									void 0 !== r.score.max &&
										(t = ""
											.concat(
												t,
												'&nbsp;<span class="h5p-dialogcards-summary-table-row-score-divider">/</span>&nbsp;',
											)
											.concat(r.score.max)),
										(e.fields[r.field].innerHTML = t);
								});
						},
					},
					{
						key: "show",
						value: function () {
							this.container.classList.remove("h5p-dialogcards-gone"), this.fields.button.focus();
						},
					},
					{
						key: "hide",
						value: function () {
							this.container.classList.add("h5p-dialogcards-gone");
						},
					},
					{
						key: "createConfirmationDialog",
						value: function (e, r) {
							e = e || {};
							var t = new H5P.ConfirmationDialog({
								instance: e.instance,
								headerText: e.l10n.header,
								dialogText: e.l10n.body,
								cancelText: e.l10n.cancelLabel,
								confirmText: e.l10n.confirmLabel,
							});
							return (
								t.on("confirmed", function () {
									r();
								}),
								t.appendTo(this.getContainer()),
								t
							);
						},
					},
					{
						key: "getContainer",
						value: function () {
							var e = H5P.jQuery('[data-content-id="' + self.contentId + '"].h5p-content'),
								r = e.parents(".h5p-container");
							return (
								0 !== r.length ? r.last() : 0 !== e.length ? e : H5P.jQuery(document.body)
							).get(0);
						},
					},
				]) && y(r.prototype, t),
				a && y(r, a),
				e
			);
		})();
		function w(e) {
			return (w =
				"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
					? function (e) {
							return typeof e;
						}
					: function (e) {
							return e &&
								"function" == typeof Symbol &&
								e.constructor === Symbol &&
								e !== Symbol.prototype
								? "symbol"
								: typeof e;
						})(e);
		}
		function S(e, r) {
			return (S =
				Object.setPrototypeOf ||
				function (e, r) {
					return (e.__proto__ = r), e;
				})(e, r);
		}
		function x(e) {
			var r = (function () {
				if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
				if (Reflect.construct.sham) return !1;
				if ("function" == typeof Proxy) return !0;
				try {
					return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
				} catch (e) {
					return !1;
				}
			})();
			return function () {
				var t,
					a = I(e);
				if (r) {
					var n = I(this).constructor;
					t = Reflect.construct(a, arguments, n);
				} else t = a.apply(this, arguments);
				return T(this, t);
			};
		}
		function T(e, r) {
			return !r || ("object" !== w(r) && "function" != typeof r) ? k(e) : r;
		}
		function k(e) {
			if (void 0 === e)
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return e;
		}
		function I(e) {
			return (I = Object.setPrototypeOf
				? Object.getPrototypeOf
				: function (e) {
						return e.__proto__ || Object.getPrototypeOf(e);
					})(e);
		}
		var $ = H5P.jQuery,
			P = H5P.JoubelUI,
			A = (function (e) {
				!(function (e, r) {
					if ("function" != typeof r && null !== r)
						throw new TypeError("Super expression must either be null or a function");
					(e.prototype = Object.create(r && r.prototype, {
						constructor: { value: e, writable: !0, configurable: !0 },
					})),
						r && S(e, r);
				})(t, H5P.EventDispatcher);
				var r = x(t);
				function t(e, a, n) {
					var i;
					return (
						(function (e, r) {
							if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
						})(this, t),
						t.idCounter++,
						((i = r.call(this)).contentId = i.id = a),
						(i.previousState = n.previousState || {}),
						(i.contentData = n || {}),
						(i.params = $.extend(
							{
								title: "",
								mode: "normal",
								description:
									"Sit in pairs and make up sentences where you include the expressions below.<br/>Example: I should have said yes, HOWEVER I kept my mouth shut.",
								next: "Next",
								prev: "Previous",
								retry: "Retry",
								answer: "Turn",
								correctAnswer: "I got it right!",
								incorrectAnswer: "I got it wrong",
								round: "Round @round",
								cardsLeft: "Cards left: @number",
								nextRound: "Proceed to round @round",
								startOver: "Start over",
								showSummary: "Next",
								summary: "Summary",
								summaryCardsRight: "Cards you got right:",
								summaryCardsWrong: "Cards you got wrong:",
								summaryCardsNotShown: "Cards in pool not shown:",
								summaryOverallScore: "Overall Score",
								summaryCardsCompleted: "Cards you have completed learning:",
								summaryCompletedRounds: "Completed rounds:",
								summaryAllDone:
									"Well done! You got all @cards cards correct @max times in a row each!",
								progressText: "Card @card of @total",
								cardFrontLabel: "Card front",
								cardBackLabel: "Card back",
								tipButtonLabel: "Show tip",
								audioNotSupported: "Your browser does not support this audio",
								confirmStartingOver: {
									header: "Start over?",
									body: "All progress will be lost. Are you sure you want to start over?",
									cancelLabel: "Cancel",
									confirmLabel: "Start over",
								},
								dialogs: [
									{ text: "Horse", answer: "Hest" },
									{ text: "Cow", answer: "Ku" },
								],
								behaviour: {
									enableRetry: !0,
									disableBackwardsNavigation: !1,
									scaleTextNotCard: !1,
									randomCards: !1,
									maxProficiency: 5,
									quickProgression: !1,
								},
							},
							e,
						)),
						(i.cards = []),
						(i.currentCardId = 0),
						(i.round = 0),
						(i.results = i.previousState.results || []),
						(i.attach = function (e) {
							(i.$inner = e.addClass("h5p-dialogcards")),
								i.params.behaviour.scaleTextNotCard && e.addClass("h5p-text-scaling");
							var r = {
								mode: i.params.mode,
								dialogs: i.params.dialogs,
								audioNotSupported: i.params.audioNotSupported,
								answer: i.params.answer,
								showSummary: i.params.showSummary,
								incorrectAnswer: i.params.incorrectAnswer,
								correctAnswer: i.params.correctAnswer,
								progressText: i.params.progressText,
								tipButtonLabel: i.params.tipButtonLabel,
								behaviour: {
									scaleTextNotCard: i.params.behaviour.scaleTextNotCard,
									maxProficiency: i.params.behaviour.maxProficiency,
									quickProgression: i.params.behaviour.quickProgression,
								},
								cardPiles: i.previousState.cardPiles,
							};
							(i.cardManager = new b(r, i.id, {
								onCardTurned: i.handleCardTurned,
								onNextCard: i.nextCard,
							})),
								i.createDOM(0 === i.round),
								void 0 !== i.previousState.currentCardId &&
									(i.gotoCard(i.previousState.currentCardId),
									"repetition" === i.params.mode &&
										i.results.length === i.cardIds.length &&
										i.showSummary(!0)),
								i.updateNavigation(),
								i.trigger("resize");
						}),
						(i.createDOM = function (e) {
							if (
								((i.cardIds =
									e && i.previousState.cardIds
										? i.previousState.cardIds
										: i.cardManager.createSelection()),
								(i.cardPoolSize = i.cardPoolSize || i.cardManager.getSize()),
								!0 === e)
							) {
								var r = $("<div>" + i.params.title + "</div>")
									.text()
									.trim();
								(i.$header = $(
									(r
										? '<div class="h5p-dialogcards-title"><div class="h5p-dialogcards-title-inner">' +
											i.params.title +
											"</div></div>"
										: "") +
										'<div class="h5p-dialogcards-description">' +
										i.params.description +
										"</div>",
								)),
									(i.summaryScreen = new C(i.params, {
										nextRound: i.nextRound,
										retry: i.restartRepetition,
									}));
							}
							!0 === e
								? (i.$cardwrapperSet = i.initCards(i.cardIds))
								: (i.$cardwrapperSet.detach(),
									(i.$cardwrapperSet = i.initCards(i.cardIds)),
									i.$cardSideAnnouncer.before(i.$cardwrapperSet)),
								i.$cardwrapperSet.prepend(i.summaryScreen.getDOM()),
								!0 === e &&
									((i.$cardSideAnnouncer = $("<div>", {
										html: i.params.cardFrontLabel,
										class: "h5p-dialogcards-card-side-announcer",
										"aria-live": "polite",
										"aria-hidden": "true",
									})),
									(i.$footer = i.createFooter()),
									(i.$mainContent = $("<div>")
										.append(i.$header)
										.append(i.$cardwrapperSet)
										.append(i.$cardSideAnnouncer)
										.append(i.$footer)
										.appendTo(i.$inner)),
									i.on("reset", function () {
										this.reset();
									}),
									i.on("resize", i.resize),
									(i.round = void 0 !== i.previousState.round ? i.previousState.round : 1));
						}),
						(i.createFooter = function () {
							var e = $("<nav>", { class: "h5p-dialogcards-footer", role: "navigation" });
							return (
								"normal" === i.params.mode
									? ((i.$prev = P.createButton({
											class: "h5p-dialogcards-footer-button h5p-dialogcards-prev truncated",
											"aria-label": i.params.prev,
											title: i.params.prev,
										})
											.click(function () {
												i.prevCard();
											})
											.appendTo(e)),
										(i.$next = P.createButton({
											class: "h5p-dialogcards-footer-button h5p-dialogcards-next truncated",
											"aria-label": i.params.next,
											title: i.params.next,
										})
											.click(function () {
												i.nextCard();
											})
											.appendTo(e)),
										(i.$retry = P.createButton({
											class:
												"h5p-dialogcards-footer-button h5p-dialogcards-retry h5p-dialogcards-disabled",
											title: i.params.retry,
											html: i.params.retry,
										})
											.click(function () {
												i.trigger("reset");
											})
											.appendTo(e)),
										(i.$progress = $("<div>", {
											id: "h5p-dialogcards-progress-" + t.idCounter,
											class: "h5p-dialogcards-progress",
											"aria-live": "assertive",
										}).appendTo(e)))
									: ((i.$round = $("<div>", { class: "h5p-dialogcards-round" }).appendTo(e)),
										(i.$progress = $("<div>", {
											class: "h5p-dialogcards-cards-left",
											"aria-live": "assertive",
										}).appendTo(e))),
								e
							);
						}),
						(i.updateImageSize = function () {
							var e = 0,
								r = i.cards[i.currentCardId].getDOM().find(".h5p-dialogcards-card-content");
							if (
								(i.params.dialogs.forEach(function (t) {
									if (t.image) {
										var a =
											(t.image.height / t.image.width) * r.get(0).getBoundingClientRect().width;
										a > e && (e = a);
									}
								}),
								e > 0)
							) {
								var t = e / parseFloat(i.$inner.css("font-size"));
								t > 15 && (t = 15),
									i.cards.forEach(function (e) {
										e.getImage()
											.parent()
											.css("height", t + "em");
									});
							}
						}),
						(i.initCards = function (e) {
							(i.cards = []),
								(i.currentCardId = 0),
								i.params.behaviour.randomCards && (e = H5P.shuffleArray(e));
							for (
								var r = $("<div>", { class: "h5p-dialogcards-cardwrap-set" }), t = 0;
								t < e.length && !(t >= 2);
								t++
							) {
								var a = i.getCard(e[t]);
								a.setProgressText(t + 1, e.length), i.cards.push(a);
								var n = a.getDOM();
								t === i.currentCardId && (n.addClass("h5p-dialogcards-current"), (i.$current = n)),
									a.addTipToCard(n.find(".h5p-dialogcards-card-content"), "front", t),
									r.append(n);
							}
							return r;
						}),
						(i.handleCardTurned = function (e) {
							i.$cardSideAnnouncer.html(e ? i.params.cardFrontLabel : i.params.cardBackLabel),
								i.params.behaviour.enableRetry &&
									i.currentCardId + 1 === i.cardIds.length &&
									i.$retry &&
									(i.$retry.removeClass("h5p-dialogcards-disabled"), i.truncateRetryButton());
						}),
						(i.updateNavigation = function () {
							if ("normal" === i.params.mode)
								i.getCurrentSelectionIndex() < i.cardIds.length - 1
									? (i.$next.removeClass("h5p-dialogcards-disabled"),
										i.$retry.addClass("h5p-dialogcards-disabled"))
									: i.$next.addClass("h5p-dialogcards-disabled"),
									i.currentCardId > 0 && !i.params.behaviour.disableBackwardsNavigation
										? i.$prev.removeClass("h5p-dialogcards-disabled")
										: i.$prev.addClass("h5p-dialogcards-disabled"),
									i.$progress.text(
										i.params.progressText
											.replace("@card", i.getCurrentSelectionIndex() + 1)
											.replace("@total", i.cardIds.length),
									),
									i.cards[i.findCardPosition(i.cards[i.currentCardId].id)].resizeOverflowingText();
							else {
								i.$round.text(i.params.round.replace("@round", i.round));
								var e = i.getCurrentSelectionIndex();
								i.$progress.text(i.params.cardsLeft.replace("@number", i.cardIds.length - e));
							}
							i.trigger("resize");
						}),
						(i.showSummary = function () {
							var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
								r = e ? i.cardManager.getPileSizes() : i.cardManager.updatePiles(i.results),
								t = i.results.filter(function (e) {
									return !0 === e.result;
								}).length,
								a = i.results.length - t,
								n = i.cardPoolSize - t - a,
								s = r.slice(-1)[0],
								o = s === i.cardPoolSize,
								d = {
									round: i.round,
									results: [
										{ field: "h5p-dialogcards-round-cards-right", score: { value: t, max: a + t } },
										{ field: "h5p-dialogcards-round-cards-wrong", score: { value: a, max: a + t } },
										{ field: "h5p-dialogcards-round-cards-not-shown", score: { value: n } },
										{
											field: "h5p-dialogcards-overall-cards-completed",
											score: { value: s, max: i.cardPoolSize },
										},
										{
											field: "h5p-dialogcards-overall-completed-rounds",
											score: { value: i.round },
										},
									],
								};
							o &&
								((d.done = !0),
								(d.message = i.params.summaryAllDone
									.replace("@cards", i.cardPoolSize)
									.replace("@max", i.params.behaviour.maxProficiency - 1))),
								i.summaryScreen.update(d),
								i.summaryScreen.show(),
								i.hideCards(),
								i.trigger("resize");
						}),
						(i.showCards = function () {
							i.$cardwrapperSet
								.find(".h5p-dialogcards-cardwrap")
								.removeClass("h5p-dialogcards-gone"),
								i.$footer.removeClass("h5p-dialogcards-gone"),
								(i.cardsShown = !0);
						}),
						(i.hideCards = function () {
							i.$cardwrapperSet.find(".h5p-dialogcards-cardwrap").addClass("h5p-dialogcards-gone"),
								i.$footer.addClass("h5p-dialogcards-gone"),
								(i.cardsShown = !1);
						}),
						(i.nextCard = function (e) {
							void 0 !== e && i.results.push(e),
								i.cards[i.currentCardId].stopAudio(),
								i.cardIds.length - i.getCurrentSelectionIndex() != 1
									? i.gotoCard(i.getCurrentSelectionIndex() + 1)
									: "repetition" === i.params.mode &&
										(i.$progress.text(i.params.cardsLeft.replace("@number", 0)),
										i.cards[i.currentCardId].showSummaryButton(i.showSummary));
						}),
						(i.getCard = function (e) {
							var r = i.cardManager.getCard(e);
							return r.createButtonListeners(), r;
						}),
						(i.findCardPosition = function (e) {
							var r;
							return (
								i.cards.forEach(function (t, a) {
									r || t.id !== e || (r = a);
								}),
								r
							);
						}),
						(i.insertCardToDOM = function (e, r) {
							var t = e.getDOM();
							void 0 === r
								? t.appendTo(i.$cardwrapperSet)
								: 0 === r
									? i.$cardwrapperSet.prepend(t)
									: i.$cardwrapperSet.children().eq(r).after(t),
								e.addTipToCard(t.find(".h5p-dialogcards-card-content"), "front", r);
						}),
						(i.gotoCard = function (e) {
							if (!(e < 0 || e >= i.cardIds.length)) {
								var r = i.cards[i.currentCardId];
								r.stopAudio(), r.getDOM().removeClass("h5p-dialogcards-current");
								var t = [];
								e > 0 && t.push(e - 1),
									t.push(e),
									e + 1 < i.cardIds.length && t.push(e + 1),
									t.forEach(function (e) {
										if (void 0 === i.findCardPosition(i.cardIds[e])) {
											var r = i.getCard(i.cardIds[e]);
											r.setProgressText(e + 1, i.cardIds.length);
											var t = Math.min(e + 1, i.cardIds.length - 1),
												a = i.findCardPosition(i.cardIds[t]) || i.cards.length;
											i.cards.splice(a, 0, r), i.insertCardToDOM(r, a);
										}
									}),
									i.resize(),
									(e = i.findCardPosition(i.cardIds[e])),
									i.cards.forEach(function (r, t) {
										t < e
											? r.getDOM().addClass("h5p-dialogcards-previous")
											: (r.getDOM().removeClass("h5p-dialogcards-previous"),
												t === e && r.getDOM().addClass("h5p-dialogcards-current"));
									}),
									(i.currentCardId = e),
									i.updateNavigation(),
									i.cards[i.currentCardId].setCardFocus();
							}
						}),
						(i.prevCard = function () {
							i.gotoCard(i.getCurrentSelectionIndex() - 1);
						}),
						(i.showAllAudio = function () {
							i.$cardwrapperSet.find(".h5p-audio-inner").removeClass("hide");
						}),
						(i.restartRepetition = function () {
							i.cardManager.reset(), (i.round = 0), i.nextRound();
						}),
						(i.nextRound = function () {
							i.round++,
								i.summaryScreen.hide(),
								i.showCards(),
								i.reset(),
								i.createDOM(),
								i.updateNavigation(),
								i.cards[i.currentCardId].setCardFocus(!0),
								i.trigger("resize");
						}),
						(i.reset = function () {
							(i.results = []),
								i.cards[i.currentCardId].stopAudio(i.$current.index()),
								i.cards.forEach(function (e) {
									e.reset();
								}),
								(i.currentCardId = 0),
								"normal" === i.params.mode &&
									i.cards[i.currentCardId].getDOM().addClass("h5p-dialogcards-current"),
								i.updateNavigation(),
								i.$retry && i.$retry.addClass("h5p-dialogcards-disabled"),
								i.showAllAudio(),
								i.cards[i.currentCardId].resizeOverflowingText(),
								i.cards[i.currentCardId].setCardFocus();
						}),
						(i.resize = function () {
							var e = 0;
							i.updateImageSize(),
								i.params.behaviour.scaleTextNotCard ||
									!1 === i.cardsShown ||
									i.determineCardSizes(),
								i.$cardwrapperSet.css("height", "auto"),
								i.$cardwrapperSet.children(":not(.h5p-dialogcards-gone)").each(function () {
									var r = $(this).css("height", "initial").outerHeight();
									if (
										($(this).css("height", "inherit"),
										(e = r > e ? r : e),
										!$(this).next(".h5p-dialogcards-cardwrap").length)
									) {
										var t = $(this)
											.find(".h5p-dialogcards-cardholder")
											.css("height", "initial")
											.outerHeight();
										(e = t > e ? t : e),
											$(this).find(".h5p-dialogcards-cardholder").css("height", "inherit");
									}
								});
							var r = e / parseFloat(i.$cardwrapperSet.css("font-size"));
							i.$cardwrapperSet.css("height", r + "em"),
								i.scaleToFitHeight(),
								i.truncateRetryButton(),
								i.cards[i.currentCardId].resizeOverflowingText();
						}),
						(i.determineCardSizes = function () {
							var e = k(i);
							void 0 === i.cardSizeDetermined && (i.cardSizeDetermined = []),
								i.$cardwrapperSet.children(":visible").each(function (r) {
									var t = e.cards[r].id;
									if (-1 === e.cardSizeDetermined.indexOf(t)) {
										e.cardSizeDetermined.push(t);
										var a = $(".h5p-dialogcards-card-content", this),
											n = $(".h5p-dialogcards-card-text-inner-content", a),
											i = n[0].getBoundingClientRect().height,
											s = e.cards[r];
										s.changeText(s.getAnswer());
										var o = n[0].getBoundingClientRect().height,
											d = i > o ? i : o,
											c = parseFloat(n.parent().parent().css("minHeight"));
										d < c && (d = c),
											(d /= parseFloat(a.css("fontSize"))),
											n.parent().css("height", d + "em"),
											s.changeText(s.getText());
									}
								});
						}),
						(i.scaleToFitHeight = function () {
							if (
								i.$cardwrapperSet &&
								i.$cardwrapperSet.is(":visible") &&
								i.params.behaviour.scaleTextNotCard
							)
								if (i.$inner.parents(".h5p-course-presentation").length) {
									var e = i.$inner.parent();
									i.$inner.parents(".h5p-popup-container").length &&
										(e = i.$inner.parents(".h5p-popup-container"));
									var r = e.get(0).getBoundingClientRect().height,
										a = function () {
											var e = 0;
											return (
												i.$inner.children().each(function () {
													var r = $(this);
													e +=
														this.getBoundingClientRect().height +
														parseFloat(r.css("margin-top")) +
														parseFloat(r.css("margin-bottom"));
												}),
												e
											);
										},
										n = a(),
										s = parseFloat(i.$inner.parent().css("font-size")),
										o = parseFloat(i.$inner.css("font-size"));
									if (r < n)
										for (; r < n && !((o -= t.SCALEINTERVAL) < t.MINSCALE); )
											i.$inner.css("font-size", o / s + "em"), (n = a());
									else
										for (var d = !0; d; ) {
											if ((o += t.SCALEINTERVAL) > t.MAXSCALE) {
												d = !1;
												break;
											}
											var c = o / s;
											i.$inner.css("font-size", c + "em"),
												r <= (n = a()) &&
													((d = !1),
													(c = (o - t.SCALEINTERVAL) / s),
													i.$inner.css("font-size", c + "em"));
										}
								} else i.cards[i.currentCardId].resizeOverflowingText();
						}),
						(i.truncateRetryButton = function () {
							if (i.$retry) {
								i.$retry.removeClass("truncated"), i.$retry.html(i.params.retry);
								(i.$retry.get(0).getBoundingClientRect().width +
									parseFloat(i.$retry.css("margin-left")) +
									parseFloat(i.$retry.css("margin-right"))) /
									i.$retry.parent().get(0).getBoundingClientRect().width >
									0.3 && (i.$retry.addClass("truncated"), i.$retry.html(""));
							}
						}),
						(i.getCurrentSelectionIndex = function () {
							return i.cardIds.indexOf(i.cards[i.currentCardId].id);
						}),
						(i.getTitle = function () {
							return H5P.createTitle(
								i.contentData && i.contentData.metadata && i.contentData.metadata.title
									? i.contentData.metadata.title
									: "Dialog Cards",
							);
						}),
						(i.getCurrentState = function () {
							if (i.cardManager)
								return {
									cardPiles: i.cardManager.getPiles(),
									cardIds: i.cardIds,
									round: i.round,
									currentCardId: i.getCurrentSelectionIndex(),
									results: i.results,
								};
						}),
						i
					);
				}
				return t;
			})();
		(A.idCounter = 0), (A.SCALEINTERVAL = 0.2), (A.MAXSCALE = 16), (A.MINSCALE = 4);
		var O = A;
		H5P.Dialogcards = O;
	},
]);
