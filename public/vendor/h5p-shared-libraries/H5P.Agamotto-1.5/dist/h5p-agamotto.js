(function (e) {
	function t(r) {
		if (a[r]) return a[r].exports;
		var o = (a[r] = { i: r, l: !1, exports: {} });
		return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
	}
	var a = {};
	return (
		(t.m = e),
		(t.c = a),
		(t.d = function (e, a, r) {
			t.o(e, a) || Object.defineProperty(e, a, { enumerable: !0, get: r });
		}),
		(t.r = function (e) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(e, "__esModule", { value: !0 });
		}),
		(t.t = function (e, a) {
			if ((1 & a && (e = t(e)), 8 & a)) return e;
			if (4 & a && "object" == typeof e && e && e.__esModule) return e;
			var r = Object.create(null);
			if (
				(t.r(r),
				Object.defineProperty(r, "default", { enumerable: !0, value: e }),
				2 & a && "string" != typeof e)
			)
				for (var o in e)
					t.d(
						r,
						o,
						function (t) {
							return e[t];
						}.bind(null, o),
					);
			return r;
		}),
		(t.n = function (e) {
			var a =
				e && e.__esModule
					? function () {
							return e["default"];
						}
					: function () {
							return e;
						};
			return t.d(a, "a", a), a;
		}),
		(t.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t);
		}),
		(t.p = ""),
		t((t.s = 102))
	);
})([
	function (e, t, a) {
		(function (t) {
			function a(e) {
				"@babel/helpers - typeof";
				return (
					(a =
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
								}),
					a(e)
				);
			}
			var r = function (e) {
				return e && e.Math == Math && e;
			};
			e.exports =
				r(
					"object" == ("undefined" == typeof globalThis ? "undefined" : a(globalThis)) &&
						globalThis,
				) ||
				r("object" == ("undefined" == typeof window ? "undefined" : a(window)) && window) ||
				r("object" == ("undefined" == typeof self ? "undefined" : a(self)) && self) ||
				r("object" == ("undefined" == typeof t ? "undefined" : a(t)) && t) ||
				Function("return this")();
		}).call(this, a(62));
	},
	function (e, t, a) {
		var r = a(0),
			o = a(36),
			i = a(3),
			s = a(40),
			n = a(41),
			l = a(63),
			p = o("wks"),
			c = r.Symbol,
			d = l ? c : (c && c.withoutSetter) || s;
		e.exports = function (e) {
			return i(p, e) || (n && i(c, e) ? (p[e] = c[e]) : (p[e] = d("Symbol." + e))), p[e];
		};
	},
	function (e, t, a) {
		var r = a(8);
		e.exports = function (e) {
			if (!r(e)) throw TypeError(e + " is not an object");
			return e;
		};
	},
	function (e) {
		var t = {}.hasOwnProperty;
		e.exports = function (e, a) {
			return t.call(e, a);
		};
	},
	function (e, t, a) {
		var r = a(6),
			o = a(7),
			i = a(18);
		e.exports = r
			? function (e, t, a) {
					return o.f(e, t, i(1, a));
				}
			: function (e, t, a) {
					return (e[t] = a), e;
				};
	},
	function (e) {
		e.exports = function (e) {
			try {
				return !!e();
			} catch (e) {
				return !0;
			}
		};
	},
	function (e, t, a) {
		var r = a(5);
		e.exports = !r(function () {
			return (
				7 !=
				Object.defineProperty({}, 1, {
					get: function () {
						return 7;
					},
				})[1]
			);
		});
	},
	function (e, t, a) {
		var r = a(6),
			o = a(38),
			i = a(2),
			s = a(39),
			n = Object.defineProperty;
		t.f = r
			? n
			: function (e, t, a) {
					if ((i(e), (t = s(t, !0)), i(a), o))
						try {
							return n(e, t, a);
						} catch (e) {}
					if ("get" in a || "set" in a) throw TypeError("Accessors not supported");
					return "value" in a && (e[t] = a.value), e;
				};
	},
	function (e) {
		function t(e) {
			"@babel/helpers - typeof";
			return (
				(t =
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
							}),
				t(e)
			);
		}
		e.exports = function (e) {
			return "object" === t(e) ? null !== e : "function" == typeof e;
		};
	},
	function (e, t, a) {
		function r(e) {
			"@babel/helpers - typeof";
			return (
				(r =
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
							}),
				r(e)
			);
		}
		var o = a(0),
			i = a(31).f,
			s = a(4),
			n = a(11),
			l = a(24),
			p = a(70),
			c = a(47);
		e.exports = function (e, t) {
			var a,
				d,
				m,
				g,
				u,
				h,
				y = e.target,
				f = e.global,
				b = e.stat;
			if (((d = f ? o : b ? o[y] || l(y, {}) : (o[y] || {}).prototype), d))
				for (m in t) {
					if (
						((u = t[m]),
						e.noTargetGet ? ((h = i(d, m)), (g = h && h.value)) : (g = d[m]),
						(a = c(f ? m : y + (b ? "." : "#") + m, e.forced)),
						!a && void 0 !== g)
					) {
						if (r(u) === r(g)) continue;
						p(u, g);
					}
					(e.sham || (g && g.sham)) && s(u, "sham", !0), n(d, m, u, e);
				}
		};
	},
	function (e, t, a) {
		var r = a(44),
			o = a(0),
			i = function (e) {
				return "function" == typeof e ? e : void 0;
			};
		e.exports = function (e, t) {
			return 2 > arguments.length ? i(r[e]) || i(o[e]) : (r[e] && r[e][t]) || (o[e] && o[e][t]);
		};
	},
	function (e, t, a) {
		var r = a(0),
			o = a(4),
			i = a(3),
			s = a(24),
			n = a(26),
			l = a(14),
			p = l.get,
			c = l.enforce,
			d = (String + "").split("String");
		(e.exports = function (e, t, a, n) {
			var l = !!n && !!n.unsafe,
				p = !!n && !!n.enumerable,
				m = !!n && !!n.noTargetGet;
			return ("function" == typeof a &&
				("string" == typeof t && !i(a, "name") && o(a, "name", t),
				(c(a).source = d.join("string" == typeof t ? t : ""))),
			e === r)
				? void (p ? (e[t] = a) : s(t, a))
				: void (l ? !m && e[t] && (p = !0) : delete e[t], p ? (e[t] = a) : o(e, t, a));
		})(Function.prototype, "toString", function () {
			return ("function" == typeof this && p(this).source) || n(this);
		});
	},
	function (e) {
		e.exports = function (e) {
			if ("function" != typeof e) throw TypeError(e + " is not a function");
			return e;
		};
	},
	function (e) {
		e.exports = !1;
	},
	function (e, t, a) {
		var r,
			o,
			i,
			s = a(64),
			n = a(0),
			l = a(8),
			p = a(4),
			c = a(3),
			d = a(27),
			m = a(28),
			g = n.WeakMap,
			u = function (e) {
				return i(e) ? o(e) : r(e, {});
			};
		if (s) {
			var h = new g(),
				y = h.get,
				f = h.has,
				b = h.set;
			(r = function (e, t) {
				return b.call(h, e, t), t;
			}),
				(o = function (e) {
					return y.call(h, e) || {};
				}),
				(i = function (e) {
					return f.call(h, e);
				});
		} else {
			var v = d("state");
			(m[v] = !0),
				(r = function (e, t) {
					return p(e, v, t), t;
				}),
				(o = function (e) {
					return c(e, v) ? e[v] : {};
				}),
				(i = function (e) {
					return c(e, v);
				});
		}
		e.exports = {
			set: r,
			get: o,
			has: i,
			enforce: u,
			getterFor: function (e) {
				return function (t) {
					var a;
					if (!l(t) || (a = o(t)).type !== e)
						throw TypeError("Incompatible receiver, " + e + " required");
					return a;
				};
			},
		};
	},
	function (e) {
		var t = {}.toString;
		e.exports = function (e) {
			return t.call(e).slice(8, -1);
		};
	},
	function (e) {
		e.exports = {};
	},
	function (e, t, a) {
		"use strict";
		var r = a(12),
			o = function (e) {
				var t, a;
				(this.promise = new e(function (e, r) {
					if (t !== void 0 || a !== void 0) throw TypeError("Bad Promise constructor");
					(t = e), (a = r);
				})),
					(this.resolve = r(t)),
					(this.reject = r(a));
			};
		e.exports.f = function (e) {
			return new o(e);
		};
	},
	function (e) {
		e.exports = function (e, t) {
			return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t };
		};
	},
	function (e, t, a) {
		var r = a(69),
			o = a(30);
		e.exports = function (e) {
			return r(o(e));
		};
	},
	function (e, t, a) {
		function r(e) {
			"@babel/helpers - typeof";
			return (
				(r =
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
							}),
				r(e)
			);
		}
		var o = a(2),
			i = a(90),
			s = a(46),
			n = a(52),
			l = a(91),
			p = a(92),
			c = function (e, t) {
				(this.stopped = e), (this.result = t);
			},
			d = (e.exports = function (e, t, a, d, m) {
				var g,
					u,
					h,
					y,
					f,
					b,
					v,
					x = n(t, a, d ? 2 : 1);
				if (m) g = e;
				else {
					if (((u = l(e)), "function" != typeof u)) throw TypeError("Target is not iterable");
					if (i(u)) {
						for (h = 0, y = s(e.length); y > h; h++)
							if (((f = d ? x(o((v = e[h]))[0], v[1]) : x(e[h])), f && f instanceof c)) return f;
						return new c(!1);
					}
					g = u.call(e);
				}
				for (b = g.next; !(v = b.call(g)).done; )
					if (((f = p(g, x, v.value, d)), "object" == r(f) && f && f instanceof c)) return f;
				return new c(!1);
			});
		d.stop = function (e) {
			return new c(!0, e);
		};
	},
	function (e) {
		e.exports = function (e) {
			try {
				return { error: !1, value: e() };
			} catch (e) {
				return { error: !0, value: e };
			}
		};
	},
	function (e, t, a) {
		var r = a(60);
		a(98), a(99), a(100), a(101), (e.exports = r);
	},
	function (e, t, a) {
		var r = a(1),
			o = r("toStringTag"),
			i = {};
		(i[o] = "z"), (e.exports = "[object z]" === i + "");
	},
	function (e, t, a) {
		var r = a(0),
			o = a(4);
		e.exports = function (e, t) {
			try {
				o(r, e, t);
			} catch (a) {
				r[e] = t;
			}
			return t;
		};
	},
	function (e, t, a) {
		var r = a(0),
			o = a(8),
			i = r.document,
			s = o(i) && o(i.createElement);
		e.exports = function (e) {
			return s ? i.createElement(e) : {};
		};
	},
	function (e, t, a) {
		var r = a(37),
			o = Function.toString;
		"function" != typeof r.inspectSource &&
			(r.inspectSource = function (e) {
				return o.call(e);
			}),
			(e.exports = r.inspectSource);
	},
	function (e, t, a) {
		var r = a(36),
			o = a(40),
			i = r("keys");
		e.exports = function (e) {
			return i[e] || (i[e] = o(e));
		};
	},
	function (e) {
		e.exports = {};
	},
	function (e) {
		var t = Math.ceil,
			a = Math.floor;
		e.exports = function (e) {
			return isNaN((e = +e)) ? 0 : (0 < e ? a : t)(e);
		};
	},
	function (e) {
		e.exports = function (e) {
			if (e == void 0) throw TypeError("Can't call method on " + e);
			return e;
		};
	},
	function (e, t, a) {
		var r = a(6),
			o = a(68),
			i = a(18),
			s = a(19),
			n = a(39),
			l = a(3),
			p = a(38),
			c = Object.getOwnPropertyDescriptor;
		t.f = r
			? c
			: function (e, t) {
					if (((e = s(e)), (t = n(t, !0)), p))
						try {
							return c(e, t);
						} catch (e) {}
					return l(e, t) ? i(!o.f.call(e, t), e[t]) : void 0;
				};
	},
	function (e) {
		e.exports = [
			"constructor",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"toLocaleString",
			"toString",
			"valueOf",
		];
	},
	function (e, t, a) {
		var r = a(3),
			o = a(77),
			i = a(27),
			s = a(78),
			n = i("IE_PROTO"),
			l = Object.prototype;
		e.exports = s
			? Object.getPrototypeOf
			: function (e) {
					return (
						(e = o(e)),
						r(e, n)
							? e[n]
							: "function" == typeof e.constructor && e instanceof e.constructor
								? e.constructor.prototype
								: e instanceof Object
									? l
									: null
					);
				};
	},
	function (e, t, a) {
		var r,
			o = a(2),
			i = a(79),
			s = a(32),
			n = a(28),
			l = a(49),
			p = a(25),
			c = a(27),
			d = ">",
			m = "<",
			g = "prototype",
			u = "script",
			h = c("IE_PROTO"),
			y = function () {},
			f = function (e) {
				return m + u + d + e + m + "/" + u + d;
			},
			b = function (e) {
				e.write(f("")), e.close();
				var t = e.parentWindow.Object;
				return (e = null), t;
			},
			v = function () {
				var e,
					t = p("iframe");
				return (
					(t.style.display = "none"),
					l.appendChild(t),
					(t.src = "java" + u + ":" + ""),
					(e = t.contentWindow.document),
					e.open(),
					e.write(f("document.F=Object")),
					e.close(),
					e.F
				);
			},
			x = function () {
				try {
					r = document.domain && new ActiveXObject("htmlfile");
				} catch (e) {}
				x = r ? b(r) : v();
				for (var e = s.length; e--; ) delete x[g][s[e]];
				return x();
			};
		(n[h] = !0),
			(e.exports =
				Object.create ||
				function (e, t) {
					var a;
					return (
						null === e ? (a = x()) : ((y[g] = o(e)), (a = new y()), (y[g] = null), (a[h] = e)),
						void 0 === t ? a : i(a, t)
					);
				});
	},
	function (e, t, a) {
		var r = a(7).f,
			o = a(3),
			i = a(1),
			s = i("toStringTag");
		e.exports = function (e, t, a) {
			e && !o((e = a ? e : e.prototype), s) && r(e, s, { configurable: !0, value: t });
		};
	},
	function (e, t, a) {
		var r = a(13),
			o = a(37);
		(e.exports = function (e, t) {
			return o[e] || (o[e] = t === void 0 ? {} : t);
		})("versions", []).push({
			version: "3.6.4",
			mode: r ? "pure" : "global",
			copyright: "\xA9 2020 Denis Pushkarev (zloirock.ru)",
		});
	},
	function (e, t, a) {
		var r = a(0),
			o = a(24),
			i = "__core-js_shared__",
			s = r[i] || o(i, {});
		e.exports = s;
	},
	function (e, t, a) {
		var r = a(6),
			o = a(5),
			i = a(25);
		e.exports =
			!r &&
			!o(function () {
				return (
					7 !=
					Object.defineProperty(i("div"), "a", {
						get: function () {
							return 7;
						},
					}).a
				);
			});
	},
	function (e, t, a) {
		var r = a(8);
		e.exports = function (e, t) {
			if (!r(e)) return e;
			var a, o;
			if (t && "function" == typeof (a = e.toString) && !r((o = a.call(e)))) return o;
			if ("function" == typeof (a = e.valueOf) && !r((o = a.call(e)))) return o;
			if (!t && "function" == typeof (a = e.toString) && !r((o = a.call(e)))) return o;
			throw TypeError("Can't convert object to primitive value");
		};
	},
	function (e) {
		var t = 0,
			a = Math.random();
		e.exports = function (e) {
			return "Symbol(" + ((e === void 0 ? "" : e) + "") + ")_" + (++t + a).toString(36);
		};
	},
	function (e, t, a) {
		var r = a(5);
		e.exports =
			!!Object.getOwnPropertySymbols &&
			!r(function () {
				return !(Symbol() + "");
			});
	},
	function (e, t, a) {
		var r = a(23),
			o = a(15),
			i = a(1),
			s = i("toStringTag"),
			n =
				"Arguments" ==
				o(
					(function () {
						return arguments;
					})(),
				),
			l = function (e, t) {
				try {
					return e[t];
				} catch (e) {}
			};
		e.exports = r
			? o
			: function (e) {
					var t, a, r;
					return e === void 0
						? "Undefined"
						: null === e
							? "Null"
							: "string" == typeof (a = l((t = Object(e)), s))
								? a
								: n
									? o(t)
									: "Object" == (r = o(t)) && "function" == typeof t.callee
										? "Arguments"
										: r;
				};
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(76),
			i = a(33),
			s = a(50),
			n = a(35),
			l = a(4),
			p = a(11),
			c = a(1),
			d = a(13),
			m = a(16),
			g = a(48),
			u = g.IteratorPrototype,
			h = g.BUGGY_SAFARI_ITERATORS,
			y = c("iterator"),
			f = "keys",
			b = "values",
			v = "entries",
			x = function () {
				return this;
			};
		e.exports = function (e, t, a, c, g, T, E) {
			o(a, t, c);
			var k,
				O,
				I,
				P = function (e) {
					return e === g && _
						? _
						: !h && e in C
							? C[e]
							: e === f
								? function () {
										return new a(this, e);
									}
								: e === b
									? function () {
											return new a(this, e);
										}
									: e === v
										? function () {
												return new a(this, e);
											}
										: function () {
												return new a(this);
											};
				},
				A = t + " Iterator",
				L = !1,
				C = e.prototype,
				S = C[y] || C["@@iterator"] || (g && C[g]),
				_ = (!h && S) || P(g),
				w = "Array" == t ? C.entries || S : S;
			if (
				(w &&
					((k = i(w.call(new e()))),
					u !== Object.prototype &&
						k.next &&
						(!d && i(k) !== u && (s ? s(k, u) : "function" != typeof k[y] && l(k, y, x)),
						n(k, A, !0, !0),
						d && (m[A] = x))),
				g == b &&
					S &&
					S.name !== b &&
					((L = !0),
					(_ = function () {
						return S.call(this);
					})),
				(!d || E) && C[y] !== _ && l(C, y, _),
				(m[t] = _),
				g)
			)
				if (((O = { values: P(b), keys: T ? _ : P(f), entries: P(v) }), E))
					for (I in O) (h || L || !(I in C)) && p(C, I, O[I]);
				else r({ target: t, proto: !0, forced: h || L }, O);
			return O;
		};
	},
	function (e, t, a) {
		var r = a(0);
		e.exports = r;
	},
	function (e, t, a) {
		var r = a(3),
			o = a(19),
			s = a(73).indexOf,
			i = a(28);
		e.exports = function (e, t) {
			var a,
				n = o(e),
				l = 0,
				p = [];
			for (a in n) !r(i, a) && r(n, a) && p.push(a);
			for (; t.length > l; ) r(n, (a = t[l++])) && (~s(p, a) || p.push(a));
			return p;
		};
	},
	function (e, t, a) {
		var r = a(29),
			o = Math.min;
		e.exports = function (e) {
			return 0 < e ? o(r(e), 9007199254740991) : 0;
		};
	},
	function (e, t, a) {
		var r = a(5),
			o = /#|\.prototype\./,
			i = function (e, t) {
				var a = n[s(e)];
				return !(a != p) || (a != l && ("function" == typeof t ? r(t) : !!t));
			},
			s = (i.normalize = function (e) {
				return (e + "").replace(o, ".").toLowerCase();
			}),
			n = (i.data = {}),
			l = (i.NATIVE = "N"),
			p = (i.POLYFILL = "P");
		e.exports = i;
	},
	function (e, t, a) {
		"use strict";
		var r,
			o,
			i,
			s = a(33),
			n = a(4),
			l = a(3),
			p = a(1),
			c = a(13),
			d = p("iterator"),
			m = !1;
		[].keys &&
			((i = [].keys()),
			"next" in i ? ((o = s(s(i))), o !== Object.prototype && (r = o)) : (m = !0)),
			r == void 0 && (r = {}),
			c ||
				l(r, d) ||
				n(r, d, function () {
					return this;
				}),
			(e.exports = { IteratorPrototype: r, BUGGY_SAFARI_ITERATORS: m });
	},
	function (e, t, a) {
		var r = a(10);
		e.exports = r("document", "documentElement");
	},
	function (e, t, a) {
		var r = a(2),
			o = a(81);
		e.exports =
			Object.setPrototypeOf ||
			("__proto__" in {}
				? (function () {
						var e,
							t = !1,
							a = {};
						try {
							(e = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set),
								e.call(a, []),
								(t = a instanceof Array);
						} catch (e) {}
						return function (a, i) {
							return r(a), o(i), t ? e.call(a, i) : (a.__proto__ = i), a;
						};
					})()
				: void 0);
	},
	function (e, t, a) {
		var r = a(0);
		e.exports = r.Promise;
	},
	function (e, t, a) {
		var r = a(12);
		e.exports = function (e, t, a) {
			return (r(e), void 0 === t)
				? e
				: 0 === a
					? function () {
							return e.call(t);
						}
					: 1 === a
						? function (r) {
								return e.call(t, r);
							}
						: 2 === a
							? function (r, a) {
									return e.call(t, r, a);
								}
							: 3 === a
								? function (r, a, o) {
										return e.call(t, r, a, o);
									}
								: function () {
										return e.apply(t, arguments);
									};
		};
	},
	function (e, t, a) {
		var r = a(2),
			o = a(12),
			i = a(1),
			s = i("species");
		e.exports = function (e, t) {
			var a,
				i = r(e).constructor;
			return i === void 0 || (a = r(i)[s]) == void 0 ? t : o(a);
		};
	},
	function (e, t, a) {
		var r,
			o,
			i,
			s = a(0),
			n = a(5),
			l = a(15),
			p = a(52),
			c = a(49),
			d = a(25),
			m = a(55),
			g = s.location,
			u = s.setImmediate,
			h = s.clearImmediate,
			y = s.process,
			f = s.MessageChannel,
			b = s.Dispatch,
			v = 0,
			x = {},
			T = "onreadystatechange",
			E = function (e) {
				if (x.hasOwnProperty(e)) {
					var t = x[e];
					delete x[e], t();
				}
			},
			k = function (e) {
				return function () {
					E(e);
				};
			},
			O = function (e) {
				E(e.data);
			},
			I = function (e) {
				s.postMessage(e + "", g.protocol + "//" + g.host);
			};
		(u && h) ||
			((u = function (e) {
				for (var t = [], a = 1; arguments.length > a; ) t.push(arguments[a++]);
				return (
					(x[++v] = function () {
						("function" == typeof e ? e : Function(e)).apply(void 0, t);
					}),
					r(v),
					v
				);
			}),
			(h = function (e) {
				delete x[e];
			}),
			"process" == l(y)
				? (r = function (e) {
						y.nextTick(k(e));
					})
				: b && b.now
					? (r = function (e) {
							b.now(k(e));
						})
					: f && !m
						? ((o = new f()), (i = o.port2), (o.port1.onmessage = O), (r = p(i.postMessage, i, 1)))
						: !s.addEventListener || "function" != typeof postMessage || s.importScripts || n(I)
							? T in d("script")
								? (r = function (e) {
										c.appendChild(d("script"))[T] = function () {
											c.removeChild(this), E(e);
										};
									})
								: (r = function (e) {
										setTimeout(k(e), 0);
									})
							: ((r = I), s.addEventListener("message", O, !1))),
			(e.exports = { set: u, clear: h });
	},
	function (e, t, a) {
		var r = a(56);
		e.exports = /(iphone|ipod|ipad).*applewebkit/i.test(r);
	},
	function (e, t, a) {
		var r = a(10);
		e.exports = r("navigator", "userAgent") || "";
	},
	function (e, t, a) {
		var r = a(2),
			o = a(8),
			i = a(17);
		e.exports = function (e, t) {
			if ((r(e), o(t) && t.constructor === e)) return t;
			var a = i.f(e),
				s = a.resolve;
			return s(t), a.promise;
		};
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(12),
			i = a(17),
			s = a(21),
			n = a(20);
		r(
			{ target: "Promise", stat: !0 },
			{
				allSettled: function (e) {
					var t = this,
						a = i.f(t),
						r = a.resolve,
						l = a.reject,
						p = s(function () {
							var a = o(t.resolve),
								i = [],
								s = 0,
								l = 1;
							n(e, function (e) {
								var o = s++,
									n = !1;
								i.push(void 0),
									l++,
									a.call(t, e).then(
										function (e) {
											n || ((n = !0), (i[o] = { status: "fulfilled", value: e }), --l || r(i));
										},
										function (t) {
											n || ((n = !0), (i[o] = { status: "rejected", reason: t }), --l || r(i));
										},
									);
							}),
								--l || r(i);
						});
					return p.error && l(p.value), a.promise;
				},
			},
		);
	},
	function () {},
	function (e, t, a) {
		a(61), a(66), a(82), a(86), a(58), a(97);
		var r = a(44);
		e.exports = r.Promise;
	},
	function (e, t, a) {
		var r = a(23),
			o = a(11),
			i = a(65);
		r || o(Object.prototype, "toString", i, { unsafe: !0 });
	},
	function (e) {
		function t(e) {
			"@babel/helpers - typeof";
			return (
				(t =
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
							}),
				t(e)
			);
		}
		var a = (function () {
			return this;
		})();
		try {
			a = a || new Function("return this")();
		} catch (r) {
			"object" === ("undefined" == typeof window ? "undefined" : t(window)) && (a = window);
		}
		e.exports = a;
	},
	function (e, t, a) {
		function r(e) {
			"@babel/helpers - typeof";
			return (
				(r =
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
							}),
				r(e)
			);
		}
		var o = a(41);
		e.exports = o && !Symbol.sham && "symbol" == r(Symbol.iterator);
	},
	function (e, t, a) {
		var r = a(0),
			o = a(26),
			i = r.WeakMap;
		e.exports = "function" == typeof i && /native code/.test(o(i));
	},
	function (e, t, a) {
		"use strict";
		var r = a(23),
			o = a(42);
		e.exports = r
			? {}.toString
			: function () {
					return "[object " + o(this) + "]";
				};
	},
	function (e, t, a) {
		"use strict";
		var r = a(67).charAt,
			o = a(14),
			i = a(43),
			s = "String Iterator",
			n = o.set,
			l = o.getterFor(s);
		i(
			String,
			"String",
			function (e) {
				n(this, { type: s, string: e + "", index: 0 });
			},
			function () {
				var e,
					t = l(this),
					a = t.string,
					o = t.index;
				return o >= a.length
					? { value: void 0, done: !0 }
					: ((e = r(a, o)), (t.index += e.length), { value: e, done: !1 });
			},
		);
	},
	function (e, t, a) {
		var r = a(29),
			o = a(30),
			i = function (e) {
				return function (t, a) {
					var i,
						s,
						n = o(t) + "",
						l = r(a),
						p = n.length;
					return 0 > l || l >= p
						? e
							? ""
							: void 0
						: ((i = n.charCodeAt(l)),
							55296 > i ||
							56319 < i ||
							l + 1 === p ||
							56320 > (s = n.charCodeAt(l + 1)) ||
							57343 < s
								? e
									? n.charAt(l)
									: i
								: e
									? n.slice(l, l + 2)
									: ((i - 55296) << 10) + (s - 56320) + 65536);
				};
			};
		e.exports = { codeAt: i(!1), charAt: i(!0) };
	},
	function (e, t) {
		"use strict";
		var a = {}.propertyIsEnumerable,
			r = Object.getOwnPropertyDescriptor,
			o = r && !a.call({ 1: 2 }, 1);
		t.f = o
			? function (e) {
					var t = r(this, e);
					return !!t && t.enumerable;
				}
			: a;
	},
	function (e, t, a) {
		var r = a(5),
			o = a(15),
			i = "".split;
		e.exports = r(function () {
			return !Object("z").propertyIsEnumerable(0);
		})
			? function (e) {
					return "String" == o(e) ? i.call(e, "") : Object(e);
				}
			: Object;
	},
	function (e, t, a) {
		var r = a(3),
			o = a(71),
			s = a(31),
			n = a(7);
		e.exports = function (e, t) {
			for (var a, l = o(t), p = n.f, c = s.f, d = 0; d < l.length; d++)
				(a = l[d]), r(e, a) || p(e, a, c(t, a));
		};
	},
	function (e, t, a) {
		var r = a(10),
			o = a(72),
			i = a(75),
			s = a(2);
		e.exports =
			r("Reflect", "ownKeys") ||
			function (e) {
				var t = o.f(s(e)),
					a = i.f;
				return a ? t.concat(a(e)) : t;
			};
	},
	function (e, t, a) {
		var r = a(45),
			o = a(32),
			i = o.concat("length", "prototype");
		t.f =
			Object.getOwnPropertyNames ||
			function (e) {
				return r(e, i);
			};
	},
	function (e, t, a) {
		var r = a(19),
			o = a(46),
			i = a(74),
			s = function (e) {
				return function (t, a, s) {
					var n,
						l = r(t),
						p = o(l.length),
						c = i(s, p);
					if (e && a != a) {
						for (; p > c; ) if (((n = l[c++]), n != n)) return !0;
					} else for (; p > c; c++) if ((e || c in l) && l[c] === a) return e || c || 0;
					return !e && -1;
				};
			};
		e.exports = { includes: s(!0), indexOf: s(!1) };
	},
	function (e, t, a) {
		var r = a(29),
			o = Math.max,
			i = Math.min;
		e.exports = function (e, t) {
			var a = r(e);
			return 0 > a ? o(a + t, 0) : i(a, t);
		};
	},
	function (e, t) {
		t.f = Object.getOwnPropertySymbols;
	},
	function (e, t, a) {
		"use strict";
		var r = a(48).IteratorPrototype,
			o = a(34),
			i = a(18),
			s = a(35),
			n = a(16),
			l = function () {
				return this;
			};
		e.exports = function (e, t, a) {
			var p = t + " Iterator";
			return (e.prototype = o(r, { next: i(1, a) })), s(e, p, !1, !0), (n[p] = l), e;
		};
	},
	function (e, t, a) {
		var r = a(30);
		e.exports = function (e) {
			return Object(r(e));
		};
	},
	function (e, t, a) {
		var r = a(5);
		e.exports = !r(function () {
			function e() {}
			return (e.prototype.constructor = null), Object.getPrototypeOf(new e()) !== e.prototype;
		});
	},
	function (e, t, a) {
		var r = a(6),
			o = a(7),
			i = a(2),
			s = a(80);
		e.exports = r
			? Object.defineProperties
			: function (e, t) {
					i(e);
					for (var a, r = s(t), n = r.length, l = 0; n > l; ) o.f(e, (a = r[l++]), t[a]);
					return e;
				};
	},
	function (e, t, a) {
		var r = a(45),
			o = a(32);
		e.exports =
			Object.keys ||
			function (e) {
				return r(e, o);
			};
	},
	function (e, t, a) {
		var r = a(8);
		e.exports = function (e) {
			if (!r(e) && null !== e) throw TypeError("Can't set " + (e + " as a prototype"));
			return e;
		};
	},
	function (e, t, a) {
		var r = a(0),
			o = a(83),
			i = a(84),
			s = a(4),
			n = a(1),
			l = n("iterator"),
			p = n("toStringTag"),
			c = i.values;
		for (var d in o) {
			var m = r[d],
				g = m && m.prototype;
			if (g) {
				if (g[l] !== c)
					try {
						s(g, l, c);
					} catch (e) {
						g[l] = c;
					}
				if ((g[p] || s(g, p, d), o[d]))
					for (var u in i)
						if (g[u] !== i[u])
							try {
								s(g, u, i[u]);
							} catch (e) {
								g[u] = i[u];
							}
			}
		}
	},
	function (e) {
		e.exports = {
			CSSRuleList: 0,
			CSSStyleDeclaration: 0,
			CSSValueList: 0,
			ClientRectList: 0,
			DOMRectList: 0,
			DOMStringList: 0,
			DOMTokenList: 1,
			DataTransferItemList: 0,
			FileList: 0,
			HTMLAllCollection: 0,
			HTMLCollection: 0,
			HTMLFormElement: 0,
			HTMLSelectElement: 0,
			MediaList: 0,
			MimeTypeArray: 0,
			NamedNodeMap: 0,
			NodeList: 1,
			PaintRequestList: 0,
			Plugin: 0,
			PluginArray: 0,
			SVGLengthList: 0,
			SVGNumberList: 0,
			SVGPathSegList: 0,
			SVGPointList: 0,
			SVGStringList: 0,
			SVGTransformList: 0,
			SourceBufferList: 0,
			StyleSheetList: 0,
			TextTrackCueList: 0,
			TextTrackList: 0,
			TouchList: 0,
		};
	},
	function (e, t, a) {
		"use strict";
		var r = a(19),
			o = a(85),
			i = a(16),
			s = a(14),
			n = a(43),
			l = "Array Iterator",
			p = s.set,
			c = s.getterFor(l);
		(e.exports = n(
			Array,
			"Array",
			function (e, t) {
				p(this, { type: l, target: r(e), index: 0, kind: t });
			},
			function () {
				var e = c(this),
					t = e.target,
					a = e.kind,
					r = e.index++;
				return !t || r >= t.length
					? ((e.target = void 0), { value: void 0, done: !0 })
					: "keys" == a
						? { value: r, done: !1 }
						: "values" == a
							? { value: t[r], done: !1 }
							: { value: [r, t[r]], done: !1 };
			},
			"values",
		)),
			(i.Arguments = i.Array),
			o("keys"),
			o("values"),
			o("entries");
	},
	function (e, t, a) {
		var r = a(1),
			o = a(34),
			i = a(7),
			s = r("unscopables"),
			n = Array.prototype;
		n[s] == void 0 && i.f(n, s, { configurable: !0, value: o(null) }),
			(e.exports = function (e) {
				n[s][e] = !0;
			});
	},
	function (e, t, a) {
		"use strict";
		var r,
			o,
			i,
			s,
			n = a(9),
			l = a(13),
			p = a(0),
			c = a(10),
			d = a(51),
			m = a(11),
			g = a(87),
			u = a(35),
			h = a(88),
			y = a(8),
			f = a(12),
			b = a(89),
			v = a(15),
			x = a(26),
			T = a(20),
			E = a(93),
			k = a(53),
			O = a(54).set,
			I = a(94),
			P = a(57),
			A = a(95),
			L = a(17),
			S = a(21),
			C = a(14),
			_ = a(47),
			w = a(1),
			R = a(96),
			M = w("species"),
			D = "Promise",
			N = C.get,
			j = C.set,
			H = C.getterFor(D),
			F = d,
			B = p.TypeError,
			G = p.document,
			z = p.process,
			W = c("fetch"),
			U = L.f,
			K = U,
			V = "process" == v(z),
			Y = !!(G && G.createEvent && p.dispatchEvent),
			X = "unhandledrejection",
			q = 0,
			Z = 1,
			Q = 1,
			J = 2,
			$ = _(D, function () {
				var e = x(F) !== F + "";
				if (!e) {
					if (66 === R) return !0;
					if (!V && "function" != typeof PromiseRejectionEvent) return !0;
				}
				if (l && !F.prototype["finally"]) return !0;
				if (51 <= R && /native code/.test(F)) return !1;
				var t = F.resolve(1),
					a = function (e) {
						e(
							function () {},
							function () {},
						);
					},
					r = (t.constructor = {});
				return (r[M] = a), !(t.then(function () {}) instanceof a);
			}),
			ee =
				$ ||
				!E(function (e) {
					F.all(e)["catch"](function () {});
				}),
			te = function (e) {
				var t;
				return !!(y(e) && "function" == typeof (t = e.then)) && t;
			},
			ae = function (e, t, a) {
				if (!t.notified) {
					t.notified = !0;
					var r = t.reactions;
					I(function () {
						for (var o = t.value, i = t.state == Z, s = 0; r.length > s; ) {
							var n,
								l,
								p,
								c = r[s++],
								d = i ? c.ok : c.fail,
								m = c.resolve,
								g = c.reject,
								u = c.domain;
							try {
								d
									? (!i && (t.rejection === J && se(e, t), (t.rejection = Q)),
										!0 === d ? (n = o) : (u && u.enter(), (n = d(o)), u && (u.exit(), (p = !0))),
										n === c.promise
											? g(B("Promise-chain cycle"))
											: (l = te(n))
												? l.call(n, m, g)
												: m(n))
									: g(o);
							} catch (e) {
								u && !p && u.exit(), g(e);
							}
						}
						(t.reactions = []), (t.notified = !1), a && !t.rejection && oe(e, t);
					});
				}
			},
			re = function (e, t, a) {
				var r, o;
				Y
					? ((r = G.createEvent("Event")),
						(r.promise = t),
						(r.reason = a),
						r.initEvent(e, !1, !0),
						p.dispatchEvent(r))
					: (r = { promise: t, reason: a }),
					(o = p["on" + e]) ? o(r) : e === X && A("Unhandled promise rejection", a);
			},
			oe = function (e, t) {
				O.call(p, function () {
					var a,
						r = t.value,
						o = ie(t);
					if (
						o &&
						((a = S(function () {
							V ? z.emit("unhandledRejection", r, e) : re(X, e, r);
						})),
						(t.rejection = V || ie(t) ? J : Q),
						a.error)
					)
						throw a.value;
				});
			},
			ie = function (e) {
				return e.rejection !== Q && !e.parent;
			},
			se = function (e, t) {
				O.call(p, function () {
					V ? z.emit("rejectionHandled", e) : re("rejectionhandled", e, t.value);
				});
			},
			ne = function (e, t, a, r) {
				return function (o) {
					e(t, a, o, r);
				};
			},
			le = function (e, t, a, r) {
				t.done || ((t.done = !0), r && (t = r), (t.value = a), (t.state = 2), ae(e, t, !0));
			},
			pe = function e(t, a, r, o) {
				if (!a.done) {
					(a.done = !0), o && (a = o);
					try {
						if (t === r) throw B("Promise can't be resolved itself");
						var i = te(r);
						i
							? I(function () {
									var o = { done: !1 };
									try {
										i.call(r, ne(e, t, o, a), ne(le, t, o, a));
									} catch (e) {
										le(t, o, e, a);
									}
								})
							: ((a.value = r), (a.state = Z), ae(t, a, !1));
					} catch (e) {
						le(t, { done: !1 }, e, a);
					}
				}
			};
		$ &&
			((F = function (e) {
				b(this, F, D), f(e), r.call(this);
				var t = N(this);
				try {
					e(ne(pe, this, t), ne(le, this, t));
				} catch (e) {
					le(this, t, e);
				}
			}),
			(r = function () {
				j(this, {
					type: D,
					done: !1,
					notified: !1,
					parent: !1,
					reactions: [],
					rejection: !1,
					state: q,
					value: void 0,
				});
			}),
			(r.prototype = g(F.prototype, {
				then: function (e, t) {
					var a = H(this),
						r = U(k(this, F));
					return (
						(r.ok = "function" != typeof e || e),
						(r.fail = "function" == typeof t && t),
						(r.domain = V ? z.domain : void 0),
						(a.parent = !0),
						a.reactions.push(r),
						a.state != q && ae(this, a, !1),
						r.promise
					);
				},
				catch: function (e) {
					return this.then(void 0, e);
				},
			})),
			(o = function () {
				var e = new r(),
					t = N(e);
				(this.promise = e), (this.resolve = ne(pe, e, t)), (this.reject = ne(le, e, t));
			}),
			(L.f = U =
				function (e) {
					return e === F || e === i ? new o(e) : K(e);
				}),
			!l &&
				"function" == typeof d &&
				((s = d.prototype.then),
				m(
					d.prototype,
					"then",
					function (e, t) {
						var a = this;
						return new F(function (e, t) {
							s.call(a, e, t);
						}).then(e, t);
					},
					{ unsafe: !0 },
				),
				"function" == typeof W &&
					n(
						{ global: !0, enumerable: !0, forced: !0 },
						{
							fetch: function () {
								return P(F, W.apply(p, arguments));
							},
						},
					))),
			n({ global: !0, wrap: !0, forced: $ }, { Promise: F }),
			u(F, D, !1, !0),
			h(D),
			(i = c(D)),
			n(
				{ target: D, stat: !0, forced: $ },
				{
					reject: function (e) {
						var t = U(this);
						return t.reject.call(void 0, e), t.promise;
					},
				},
			),
			n(
				{ target: D, stat: !0, forced: l || $ },
				{
					resolve: function (e) {
						return P(l && this === i ? F : this, e);
					},
				},
			),
			n(
				{ target: D, stat: !0, forced: ee },
				{
					all: function (e) {
						var t = this,
							a = U(t),
							r = a.resolve,
							o = a.reject,
							i = S(function () {
								var a = f(t.resolve),
									i = [],
									s = 0,
									n = 1;
								T(e, function (e) {
									var l = s++,
										p = !1;
									i.push(void 0),
										n++,
										a.call(t, e).then(function (e) {
											p || ((p = !0), (i[l] = e), --n || r(i));
										}, o);
								}),
									--n || r(i);
							});
						return i.error && o(i.value), a.promise;
					},
					race: function (e) {
						var t = this,
							a = U(t),
							r = a.reject,
							o = S(function () {
								var o = f(t.resolve);
								T(e, function (e) {
									o.call(t, e).then(a.resolve, r);
								});
							});
						return o.error && r(o.value), a.promise;
					},
				},
			);
	},
	function (e, t, a) {
		var r = a(11);
		e.exports = function (e, t, a) {
			for (var o in t) r(e, o, t[o], a);
			return e;
		};
	},
	function (e, t, a) {
		"use strict";
		var r = a(10),
			o = a(7),
			i = a(1),
			s = a(6),
			n = i("species");
		e.exports = function (e) {
			var t = r(e),
				a = o.f;
			s &&
				t &&
				!t[n] &&
				a(t, n, {
					configurable: !0,
					get: function () {
						return this;
					},
				});
		};
	},
	function (e) {
		e.exports = function (e, t, a) {
			if (!(e instanceof t)) throw TypeError("Incorrect " + (a ? a + " " : "") + "invocation");
			return e;
		};
	},
	function (e, t, a) {
		var r = a(1),
			o = a(16),
			i = r("iterator"),
			s = Array.prototype;
		e.exports = function (e) {
			return e !== void 0 && (o.Array === e || s[i] === e);
		};
	},
	function (e, t, a) {
		var r = a(42),
			o = a(16),
			i = a(1),
			s = i("iterator");
		e.exports = function (e) {
			if (e != void 0) return e[s] || e["@@iterator"] || o[r(e)];
		};
	},
	function (e, t, a) {
		var r = a(2);
		e.exports = function (e, t, a, o) {
			try {
				return o ? t(r(a)[0], a[1]) : t(a);
			} catch (t) {
				var i = e["return"];
				throw (void 0 !== i && r(i.call(e)), t);
			}
		};
	},
	function (e, t, a) {
		var r = a(1),
			o = r("iterator"),
			i = !1;
		try {
			var s = 0,
				n = {
					next: function () {
						return { done: !!s++ };
					},
					return: function () {
						i = !0;
					},
				};
			(n[o] = function () {
				return this;
			}),
				Array.from(n, function () {
					throw 2;
				});
		} catch (e) {}
		e.exports = function (e, t) {
			if (!t && !i) return !1;
			var a = !1;
			try {
				var r = {};
				(r[o] = function () {
					return {
						next: function () {
							return { done: (a = !0) };
						},
					};
				}),
					e(r);
			} catch (e) {}
			return a;
		};
	},
	function (e, t, a) {
		var r,
			o,
			i,
			s,
			n,
			l,
			p,
			c,
			d = a(0),
			m = a(31).f,
			g = a(15),
			u = a(54).set,
			h = a(55),
			y = d.MutationObserver || d.WebKitMutationObserver,
			f = d.process,
			b = d.Promise,
			v = "process" == g(f),
			x = m(d, "queueMicrotask"),
			T = x && x.value;
		T ||
			((r = function () {
				var e, t;
				for (v && (e = f.domain) && e.exit(); o; ) {
					(t = o.fn), (o = o.next);
					try {
						t();
					} catch (e) {
						throw (o ? s() : (i = void 0), e);
					}
				}
				(i = void 0), e && e.enter();
			}),
			v
				? (s = function () {
						f.nextTick(r);
					})
				: y && !h
					? ((n = !0),
						(l = document.createTextNode("")),
						new y(r).observe(l, { characterData: !0 }),
						(s = function () {
							l.data = n = !n;
						}))
					: b && b.resolve
						? ((p = b.resolve(void 0)),
							(c = p.then),
							(s = function () {
								c.call(p, r);
							}))
						: (s = function () {
								u.call(d, r);
							})),
			(e.exports =
				T ||
				function (e) {
					var t = { fn: e, next: void 0 };
					i && (i.next = t), o || ((o = t), s()), (i = t);
				});
	},
	function (e, t, a) {
		var r = a(0);
		e.exports = function (e, t) {
			var a = r.console;
			a && a.error && (1 === arguments.length ? a.error(e) : a.error(e, t));
		};
	},
	function (e, t, a) {
		var r,
			o,
			i = a(0),
			s = a(56),
			n = i.process,
			l = n && n.versions,
			p = l && l.v8;
		p
			? ((r = p.split(".")), (o = r[0] + r[1]))
			: s &&
				((r = s.match(/Edge\/(\d+)/)),
				(!r || 74 <= r[1]) && ((r = s.match(/Chrome\/(\d+)/)), r && (o = r[1]))),
			(e.exports = o && +o);
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(13),
			i = a(51),
			s = a(5),
			n = a(10),
			l = a(53),
			p = a(57),
			c = a(11),
			d =
				!!i &&
				s(function () {
					i.prototype["finally"].call({ then: function () {} }, function () {});
				});
		r(
			{ target: "Promise", proto: !0, real: !0, forced: d },
			{
				finally: function (t) {
					var a = l(this, n("Promise")),
						e = "function" == typeof t;
					return this.then(
						e
							? function (e) {
									return p(a, t()).then(function () {
										return e;
									});
								}
							: t,
						e
							? function (r) {
									return p(a, t()).then(function () {
										throw r;
									});
								}
							: t,
					);
				},
			},
		),
			o ||
				"function" != typeof i ||
				i.prototype["finally"] ||
				c(i.prototype, "finally", n("Promise").prototype["finally"]);
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(6),
			i = a(33),
			s = a(50),
			n = a(34),
			l = a(7),
			p = a(18),
			c = a(20),
			d = a(4),
			m = a(14),
			g = m.set,
			u = m.getterFor("AggregateError"),
			h = function (e, t) {
				var a = this;
				if (!(a instanceof h)) return new h(e, t);
				s && (a = s(new Error(t), i(a)));
				var r = [];
				return (
					c(e, r.push, r),
					o ? g(a, { errors: r, type: "AggregateError" }) : (a.errors = r),
					void 0 !== t && d(a, "message", t + ""),
					a
				);
			};
		(h.prototype = n(Error.prototype, {
			constructor: p(5, h),
			message: p(5, ""),
			name: p(5, "AggregateError"),
		})),
			o &&
				l.f(h.prototype, "errors", {
					get: function () {
						return u(this).errors;
					},
					configurable: !0,
				}),
			r({ global: !0 }, { AggregateError: h });
	},
	function (e, t, a) {
		a(58);
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(17),
			i = a(21);
		r(
			{ target: "Promise", stat: !0 },
			{
				try: function (e) {
					var t = o.f(this),
						a = i(e);
					return (a.error ? t.reject : t.resolve)(a.value), t.promise;
				},
			},
		);
	},
	function (e, t, a) {
		"use strict";
		var r = a(9),
			o = a(12),
			i = a(10),
			s = a(17),
			n = a(21),
			l = a(20),
			p = "No one promise resolved";
		r(
			{ target: "Promise", stat: !0 },
			{
				any: function (e) {
					var t = this,
						a = s.f(t),
						r = a.resolve,
						c = a.reject,
						d = n(function () {
							var a = o(t.resolve),
								s = [],
								n = 0,
								d = 1,
								m = !1;
							l(e, function (e) {
								var o = n++,
									l = !1;
								s.push(void 0),
									d++,
									a.call(t, e).then(
										function (e) {
											l || m || ((m = !0), r(e));
										},
										function (t) {
											l || m || ((l = !0), (s[o] = t), --d || c(new (i("AggregateError"))(s, p)));
										},
									);
							}),
								--d || c(new (i("AggregateError"))(s, p));
						});
					return d.error && c(d.value), a.promise;
				},
			},
		);
	},
	function (e, t, a) {
		"use strict";
		function r(e) {
			"@babel/helpers - typeof";
			return (
				(r =
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
							}),
				r(e)
			);
		}
		function o(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function i(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function s(e, t, a) {
			return t && i(e.prototype, t), a && i(e, a), e;
		}
		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function l(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function p(e, t, a) {
			return t && l(e.prototype, t), a && l(e, a), e;
		}
		function c(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function d(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function m(e, t, a) {
			return t && d(e.prototype, t), a && d(e, a), e;
		}
		function g(e) {
			"@babel/helpers - typeof";
			return (
				(g =
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
							}),
				g(e)
			);
		}
		function u(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function h(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function y(e, t, a) {
			return t && h(e.prototype, t), a && h(e, a), e;
		}
		function f(e, t) {
			return t && ("object" === g(t) || "function" == typeof t) ? t : b(e);
		}
		function b(e) {
			if (void 0 === e)
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return e;
		}
		function v(e) {
			return (
				(v = Object.setPrototypeOf
					? Object.getPrototypeOf
					: function (e) {
							return e.__proto__ || Object.getPrototypeOf(e);
						}),
				v(e)
			);
		}
		function x(e, t) {
			if ("function" != typeof t && null !== t)
				throw new TypeError("Super expression must either be null or a function");
			(e.prototype = Object.create(t && t.prototype, {
				constructor: { value: e, writable: !0, configurable: !0 },
			})),
				t && T(e, t);
		}
		function T(e, t) {
			return (
				(T =
					Object.setPrototypeOf ||
					function (e, t) {
						return (e.__proto__ = t), e;
					}),
				T(e, t)
			);
		}
		function E(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function k(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function O(e, t, a) {
			return t && k(e.prototype, t), a && k(e, a), e;
		}
		function I(e) {
			"@babel/helpers - typeof";
			return (
				(I =
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
							}),
				I(e)
			);
		}
		function P(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
		}
		function A(e, t) {
			for (var a, r = 0; r < t.length; r++)
				(a = t[r]),
					(a.enumerable = a.enumerable || !1),
					(a.configurable = !0),
					"value" in a && (a.writable = !0),
					Object.defineProperty(e, a.key, a);
		}
		function L(e, t, a) {
			return t && A(e.prototype, t), a && A(e, a), e;
		}
		function C(e, t) {
			return t && ("object" === I(t) || "function" == typeof t) ? t : _(e);
		}
		function S(e) {
			return (
				(S = Object.setPrototypeOf
					? Object.getPrototypeOf
					: function (e) {
							return e.__proto__ || Object.getPrototypeOf(e);
						}),
				S(e)
			);
		}
		function _(e) {
			if (void 0 === e)
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return e;
		}
		function w(e, t) {
			if ("function" != typeof t && null !== t)
				throw new TypeError("Super expression must either be null or a function");
			(e.prototype = Object.create(t && t.prototype, {
				constructor: { value: e, writable: !0, configurable: !0 },
			})),
				t && R(e, t);
		}
		function R(e, t) {
			return (
				(R =
					Object.setPrototypeOf ||
					function (e, t) {
						return (e.__proto__ = t), e;
					}),
				R(e, t)
			);
		}
		var M = Math.round,
			D = Math.max;
		a.r(t);
		var N = a(59),
			j = (function () {
				function e() {
					o(this, e);
				}
				return (
					s(e, null, [
						{
							key: "extend",
							value: function () {
								for (var e = 1; e < arguments.length; e++)
									for (var t in arguments[e])
										arguments[e].hasOwnProperty(t) &&
											("object" === r(arguments[0][t]) && "object" === r(arguments[e][t])
												? this.extend(arguments[0][t], arguments[e][t])
												: (arguments[0][t] = arguments[e][t]));
								return arguments[0];
							},
						},
						{
							key: "stripHTML",
							value: function (t) {
								var a = document.createElement("div");
								return (a.innerHTML = e.htmlDecode(t)), a.textContent || a.innerText || "";
							},
						},
						{
							key: "htmlDecode",
							value: function (e) {
								return e && "" !== e
									? new DOMParser().parseFromString(e, "text/html").documentElement.textContent
									: "";
							},
						},
						{
							key: "project",
							value: function (e, t, a, r, o) {
								return r + ((o - r) * (e - t)) / (a - t);
							},
						},
						{
							key: "constrain",
							value: function (e, t, a) {
								return Math.min(a, D(t, e));
							},
						},
						{
							key: "findClosest",
							value: function (e) {
								var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : ".";
								if (!e) return null;
								for (
									"." === t.substr(0, 1) && (t = t.substr(1));
									!e.classList.contains(t) && (e = e.parentElement);

								);
								return e;
							},
						},
						{
							key: "isMobileDevice",
							value: function () {
								var e = !1;
								return (
									(function (t) {
										(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
											t,
										) ||
											/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
												t.substr(0, 4),
											)) &&
											(e = !0);
									})(navigator.userAgent || navigator.vendor || window.opera),
									e
								);
							},
						},
					]),
					e
				);
			})(),
			H = j,
			F = (function () {
				function e(t, a, r) {
					n(this, e),
						(this.texts = t),
						(this.selector = a),
						(this.descriptionTop = document.createElement("div")),
						this.descriptionTop.classList.add("h5p-agamotto-description-top"),
						(this.descriptionTop.style.opacity = 1),
						(this.descriptionTop.innerHTML = t[0]),
						this.descriptionTop.setAttribute("aria-hidden", "true"),
						(this.descriptionBottom = document.createElement("div")),
						this.descriptionBottom.classList.add("h5p-agamotto-description-bottom"),
						(this.descriptionBottom.style.opacity = 0),
						(this.descriptionBottom.innerHTML = t[1]),
						(this.descriptionsContainer = document.createElement("div")),
						this.descriptionsContainer.classList.add("h5p-agamotto-descriptions-container"),
						this.descriptionsContainer.appendChild(this.descriptionTop),
						this.descriptionsContainer.appendChild(this.descriptionBottom),
						this.descriptionsContainer.addEventListener("mouseup", function (t) {
							-1 !== e.TAGS_FOR_PROPAGATION_STOPPING.indexOf(t.target.tagName) &&
								(t.stopPropagation(), r.xAPIInteracted());
						});
				}
				return (
					p(e, [
						{
							key: "getDOM",
							value: function () {
								return this.descriptionsContainer;
							},
						},
						{
							key: "getCurrentDescriptionText",
							value: function () {
								return this.descriptionTop.textContent;
							},
						},
						{
							key: "setText",
							value: function (e, t) {
								0.5 < t
									? ((this.descriptionTop.innerHTML = this.texts[e]),
										(this.descriptionBottom.innerHTML =
											this.texts[H.constrain(e + 1, 0, this.texts.length - 1)]),
										(this.descriptionTop.style.opacity = t),
										(this.descriptionBottom.style.opacity = 1 - t))
									: ((this.descriptionTop.innerHTML =
											this.texts[H.constrain(e + 1, 0, this.texts.length - 1)]),
										(this.descriptionBottom.innerHTML = this.texts[e]),
										(this.descriptionTop.style.opacity = 1 - t),
										(this.descriptionBottom.style.opacity = t));
							},
						},
						{
							key: "resize",
							value: function () {
								var e = this,
									t = 0;
								this.texts.forEach(function (a) {
									(e.descriptionBottom.innerHTML = a), (t = D(t, e.descriptionBottom.offsetHeight));
								}),
									(this.descriptionsContainer.style.height = t + "px");
							},
						},
					]),
					e
				);
			})();
		F.TAGS_FOR_PROPAGATION_STOPPING = ["A", "EM", "STRONG", "SUB", "SUP", "SPAN"];
		var B = a(22),
			G = a.n(B),
			z = (function () {
				function e(t) {
					var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "#000000";
					c(this, e),
						(this.images = t),
						this.images.map(function (e) {
							(e.alt = H.stripHTML(e.alt)),
								(e.title = H.stripHTML(e.title)),
								(e.description = H.stripHTML(e.description));
						}),
						(this.ratio = this.images[0].img.naturalWidth / this.images[0].img.naturalHeight);
					for (
						var r = this.images[0].img.naturalWidth, o = this.images[0].img.naturalHeight, s = 0;
						s < this.images.length;
						s++
					) {
						var i = r,
							n = o,
							l = this.images[s].img.naturalWidth,
							p = this.images[s].img.naturalHeight;
						l / p < this.ratio && p > n && ((p = n), (l *= n / this.images[s].img.naturalHeight)),
							l / p > this.ratio && l > i && ((l = i), (p *= i / this.images[s].img.naturalWidth)),
							l / p === this.ratio && ((i = D(i, l)), (n = D(n, p)));
						var d = H.constrain((i - l) / 2, 0, i),
							m = H.constrain((n - p) / 2, 0, n),
							g = document.createElement("canvas");
						g.setAttribute("width", i), g.setAttribute("height", n);
						var u = g.getContext("2d");
						u.beginPath(),
							u.rect(0, 0, i, n),
							(u.fillStyle = a),
							u.fill(),
							u.drawImage(this.images[s].img, d, m, l, p);
						var h = new Image(),
							y = g.toDataURL("image/jpeg");
						(h.crossOrigin = this.images[s].img.crossOrigin), (h.src = y), (this.images[s].img = h);
					}
					(this.imageTop = document.createElement("img")),
						this.imageTop.classList.add("h5p-agamotto-image-top"),
						(this.imageTop.src = t[0].img.src),
						this.imageTop.setAttribute("draggable", "false"),
						this.imageTop.setAttribute("alt", this.images[0].alt),
						this.imageTop.setAttribute("title", this.images[0].title),
						this.imageTop.setAttribute(
							"aria-label",
							"" === this.images[0].alt
								? this.images[0].description
								: "".concat(t[0].alt, ". ").concat(this.images[0].description),
						),
						(this.imageBottom = document.createElement("img")),
						this.imageBottom.classList.add("h5p-agamotto-image-bottom"),
						(this.imageBottom.src = this.images[1].img.src),
						this.imageBottom.setAttribute("draggable", "false"),
						this.imageBottom.setAttribute("aria-hidden", !0),
						(this.container = document.createElement("div")),
						this.container.classList.add("h5p-agamotto-images-container"),
						this.container.appendChild(this.imageTop),
						this.container.appendChild(this.imageBottom);
				}
				return (
					m(
						e,
						[
							{
								key: "getDOM",
								value: function () {
									return this.container;
								},
							},
							{
								key: "getCurrentAltTag",
								value: function () {
									return this.imageTop.getAttribute("alt");
								},
							},
							{
								key: "getAltTitleTags",
								value: function () {
									return this.images.map(function (e) {
										return e.alt || e.title;
									});
								},
							},
							{
								key: "setImage",
								value: function (e, t) {
									var a = H.constrain(e + M(1 - t), 0, this.images.length - 1);
									(this.imageBottom.src =
										this.images[H.constrain(e + 1, 0, this.images.length - 1)].img.src),
										(this.imageTop.src = this.images[e].img.src),
										this.imageTop.setAttribute("alt", this.images[a].alt),
										this.imageTop.setAttribute("title", this.images[a].title),
										this.imageTop.setAttribute(
											"aria-label",
											"" === this.images[a].alt
												? this.images[a].description
												: "".concat(this.images[a].alt, ". ").concat(this.images[a].description),
										),
										(this.imageTop.style.opacity = t);
								},
							},
							{
								key: "resize",
								value: function () {
									var e = this.container.style.height;
									return (
										(this.container.style.height = this.container.offsetWidth / this.ratio + "px"),
										this.container.style.height !== e
									);
								},
							},
							{
								key: "getRatio",
								value: function () {
									return this.ratio;
								},
							},
							{
								key: "getTopOpacity",
								value: function () {
									return parseFloat(this.imageTop.style.opacity || "");
								},
							},
						],
						[
							{
								key: "loadImage",
								value: function (e, t) {
									return new G.a(function (a, r) {
										var o = new Image();
										if (
											((o.onload = function () {
												a(o);
											}),
											(o.onerror = function (e) {
												r(e);
											}),
											void 0 !== H5P.setSource)
										)
											H5P.setSource(o, e.params.file, t);
										else {
											var i = H5P.getPath(e.params.file.path, t);
											(o.crossOrigin =
												void 0 === H5P.getCrossOrigin ? "Anonymous" : H5P.getCrossOrigin(i)),
												(o.src = i);
										}
									});
								},
							},
						],
					),
					e
				);
			})(),
			W = z,
			U = (function (e) {
				function t(e, a, r) {
					var o;
					u(this, t),
						(o = f(this, v(t).call(this))),
						(e = H.extend({ snap: !0, ticks: !1, labels: !1, startRatio: 0 }, e)),
						(o.params = e),
						(o.selector = a),
						(o.parent = r),
						(o.trackWidth = 0),
						(o.trackOffset = null),
						(o.thumbPosition = 0),
						(o.ratio = e.startRatio),
						(o.ticks = []),
						(o.labels = []),
						(o.sliderdown = !1),
						(o.keydown = !1),
						(o.interactionstarted = !1),
						(o.wasUsed = !1),
						(o.track = document.createElement("div")),
						o.track.classList.add("h5p-agamotto-slider-track"),
						(o.thumb = document.createElement("div")),
						o.thumb.classList.add("h5p-agamotto-slider-thumb"),
						o.thumb.setAttribute("tabindex", 0),
						o.thumb.setAttribute("role", "slider"),
						o.thumb.setAttribute("aria-label", o.params.a11y.imageSlider),
						(o.container = document.createElement("div")),
						o.container.classList.add("h5p-agamotto-slider-container"),
						o.container.appendChild(o.track),
						o.container.appendChild(o.thumb);
					var s = 0;
					if (!0 === o.params.ticks) {
						var i = function (e) {
							o.setPosition(parseInt(e.target.style.left) - t.TRACK_OFFSET, !0);
						};
						for (s = 0; s <= o.params.size; s++)
							(o.ticks[s] = document.createElement("div")),
								o.ticks[s].classList.add("h5p-agamotto-tick"),
								o.ticks[s].addEventListener("click", i),
								o.container.appendChild(o.ticks[s]);
					}
					if (!0 === o.params.labels)
						for (s = 0; s <= o.params.size; s++)
							(o.labels[s] = document.createElement("div")),
								o.labels[s].classList.add("h5p-agamotto-tick-label"),
								(o.labels[s].innerHTML = o.params.labelTexts[s]),
								o.container.appendChild(o.labels[s]);
					return (
						document.addEventListener("mousemove", function (e) {
							o.sliderdown && o.setPosition(e, !1);
						}),
						document.addEventListener("mouseup", function () {
							o.sliderdown && ((o.sliderdown = !1), o.snap());
						}),
						o.track.addEventListener("mousedown", function (e) {
							(e = e || window.event), (o.sliderdown = !0), o.setPosition(e, !1);
						}),
						o.thumb.addEventListener("mousedown", function (e) {
							(e = e || window.event), (o.sliderdown = !0), o.setPosition(e, !1);
						}),
						o.container.addEventListener("touchstart", function (e) {
							(e = e || window.event),
								e.preventDefault(),
								e.stopPropagation(),
								o.setPosition(e, !1);
						}),
						o.container.addEventListener("touchmove", function (e) {
							(e = e || window.event),
								e.preventDefault(),
								e.stopPropagation(),
								o.setPosition(e, !1);
						}),
						o.container.addEventListener("touchend", function (e) {
							(e = e || window.event), e.preventDefault(), e.stopPropagation(), o.snap();
						}),
						o.thumb.addEventListener("keydown", function (e) {
							if (!1 === o.keydown) {
								e = e || window.event;
								var t = e.which || e.keyCode;
								35 === t
									? o.handleKeyMove(e, o.params.size)
									: 36 === t
										? o.handleKeyMove(e, 0)
										: 37 === t || 38 === t
											? o.handleKeyMove(e, o.getCurrentItemId(!0) - 1)
											: 39 === t || 40 === t
												? o.handleKeyMove(e, o.getCurrentItemId(!0) + 1)
												: void 0;
							}
						}),
						o.thumb.addEventListener("keyup", function (e) {
							e = e || window.event;
							var t = e.which || e.keyCode;
							t === o.keydown && ((o.keydown = !1), r.xAPIInteracted(), r.xAPICompleted());
						}),
						o
					);
				}
				return (
					x(t, e),
					y(t, [
						{
							key: "handleKeyMove",
							value: function (e, t) {
								e.preventDefault(),
									(this.keydown = e.which || e.keyCode),
									(t = H.constrain(t, 0, this.params.size)),
									this.setPosition(H.project(t, 0, this.params.size, 0, this.getWidth()), !0);
							},
						},
						{
							key: "handleTouchMove",
							value: function (e) {
								(e = e || window.event),
									e.preventDefault(),
									e.stopPropagation(),
									this.setPosition(e, !1);
							},
						},
						{
							key: "getCurrentItemId",
							value: function () {
								var e = !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0],
									t = (this.getPosition() / this.getWidth()) * this.params.size;
								return e && (t = M(t)), t;
							},
						},
						{
							key: "getDOM",
							value: function () {
								return this.container;
							},
						},
						{
							key: "disable",
							value: function () {
								this.track.classList.add("h5p-agamotto-disabled"),
									this.thumb.classList.add("h5p-agamotto-disabled");
							},
						},
						{
							key: "enable",
							value: function () {
								this.track.classList.remove("h5p-agamotto-disabled"),
									this.thumb.classList.remove("h5p-agamotto-disabled");
							},
						},
						{
							key: "setWidth",
							value: function (e) {
								(this.trackWidth = e), (this.track.style.width = "".concat(e, "px"));
							},
						},
						{
							key: "getWidth",
							value: function () {
								return this.trackWidth;
							},
						},
						{
							key: "setPosition",
							value: function (e, a, r) {
								if (!this.thumb.classList.contains("h5p-agamotto-disabled")) {
									"string" == typeof e || "number" == typeof e
										? (e = parseInt(e))
										: "object" === g(e)
											? (null === this.trackOffset &&
													(this.trackOffset = this.computeTrackOffset()),
												(e = this.getPointerX(e) - this.trackOffset))
											: (e = 0),
										(e = H.constrain(e, 0, this.getWidth())),
										!0 === a
											? this.thumb.classList.add("h5p-agamotto-transition")
											: this.thumb.classList.remove("h5p-agamotto-transition"),
										r || (this.ratio = e / this.getWidth()),
										(this.thumb.style.left = e + t.THUMB_OFFSET + "px");
									var o = M(100 * (e / this.getWidth())),
										i = this.getCurrentItemId() || 0;
									this.thumb.setAttribute(
										"aria-valuetext",
										this.params.labels
											? this.labels[i].innerHTML
											: this.params.altTitleTexts[i] ||
													"".concat(this.params.a11y.image, " ").concat(i + 1),
									),
										this.trigger("update", { position: e, percentage: o });
								}
							},
						},
						{
							key: "getPosition",
							value: function () {
								return this.thumb.style.left ? parseInt(this.thumb.style.left) - t.THUMB_OFFSET : 0;
							},
						},
						{
							key: "isUsed",
							value: function () {
								return this.sliderdown;
							},
						},
						{
							key: "snap",
							value: function () {
								if (!0 === this.params.snap) {
									var e = M(H.project(this.ratio, 0, 1, 0, this.params.size));
									this.setPosition((e * this.getWidth()) / this.params.size, !0);
								}
								this.parent.xAPIInteracted(), this.parent.xAPICompleted();
							},
						},
						{
							key: "getPointerX",
							value: function (t) {
								var e = 0;
								return (e = t.touches ? t.touches[0].pageX : t.clientX), e;
							},
						},
						{
							key: "resize",
							value: function () {
								this.setWidth(parseInt(this.container.offsetWidth) - 2 * t.TRACK_OFFSET),
									this.setPosition(this.getWidth() * this.ratio, !1, !0);
								var e = 0;
								if (!0 === this.params.ticks)
									for (e = 0; e < this.ticks.length; e++)
										this.ticks[e].style.left =
											t.TRACK_OFFSET + (e * this.getWidth()) / (this.ticks.length - 1) + "px";
								var a = 0,
									r = !1;
								if (!0 === this.params.labels) {
									for (e = 0; e < this.labels.length; e++) {
										switch (
											((a = D(a, parseInt(window.getComputedStyle(this.labels[e]).height))), e)
										) {
											case 0:
												this.labels[e].style.left = t.TRACK_OFFSET / 2 + "px";
												break;
											case this.labels.length - 1:
												this.labels[e].style.right = t.TRACK_OFFSET / 2 + "px";
												break;
											default:
												var o =
													Math.ceil(parseInt(window.getComputedStyle(this.labels[e]).width)) / 2;
												this.labels[e].style.left =
													t.TRACK_OFFSET +
													(e * this.getWidth()) / (this.labels.length - 1) -
													o +
													"px";
										}
										e < this.labels.length - 1 &&
											!r &&
											(r = this.areOverlapping(this.labels[e], this.labels[e + 1]));
									}
									r
										? (this.labels.forEach(function (e) {
												e.classList.add("h5p-agamotto-hidden");
											}),
											(a = 0))
										: this.labels.forEach(function (e) {
												e.classList.remove("h5p-agamotto-hidden");
											});
									var i = !0 === this.params.ticks || r || 0 === a ? 0 : -7;
									this.container.style.height = t.CONTAINER_DEFAULT_HEIGHT + a + i + "px";
								}
							},
						},
						{
							key: "computeTrackOffset",
							value: function () {
								var e = parseInt(window.getComputedStyle(this.container).marginLeft || 0),
									a = H.findClosest(this.container, "h5p-question-content");
								if (a) {
									var r = window.getComputedStyle(a);
									e += parseInt(r.paddingLeft) + parseInt(r.marginLeft);
								}
								var o = H.findClosest(this.container, this.selector);
								if (o) {
									var i = window.getComputedStyle(o);
									e += parseInt(i.paddingLeft) + parseInt(i.marginLeft);
								}
								return (e += t.TRACK_OFFSET), e;
							},
						},
						{
							key: "areOverlapping",
							value: function (e, t) {
								var a = e.getBoundingClientRect(),
									r = t.getBoundingClientRect();
								return !(
									a.right < r.left ||
									a.left > r.right ||
									a.bottom < r.top ||
									a.top > r.bottom
								);
							},
						},
					]),
					t
				);
			})(H5P.EventDispatcher);
		(U.CONTAINER_DEFAULT_HEIGHT = 36), (U.TRACK_OFFSET = 16), (U.THUMB_OFFSET = 8);
		var K = (function () {
				function e(t) {
					E(this, e),
						(this.classNameBase = t),
						(this.container = document.createElement("div")),
						this.container.classList.add("".concat(this.classNameBase, "-container")),
						(this.spinnerElement = document.createElement("div")),
						this.spinnerElement.classList.add(t);
					var a = document.createElement("div");
					a.classList.add("".concat(this.classNameBase, "-circle-head")),
						this.spinnerElement.appendChild(a);
					var r = document.createElement("div");
					r.classList.add("".concat(this.classNameBase, "-circle-neck-upper")),
						this.spinnerElement.appendChild(r);
					var o = document.createElement("div");
					o.classList.add("".concat(this.classNameBase, "-circle-neck-lower")),
						this.spinnerElement.appendChild(o);
					var i = document.createElement("div");
					i.classList.add("".concat(this.classNameBase, "-circle-body")),
						this.spinnerElement.appendChild(i),
						this.container.appendChild(this.spinnerElement);
				}
				return (
					O(e, [
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
					e
				);
			})(),
			V = (function (e) {
				function t(e, a, r) {
					var o;
					return (P(this, t), (o = C(this, S(t).call(this, "agamotto"))), !e.items)
						? C(o)
						: ((o.params = e),
							(o.params.items = t.sanitizeItems(o.params.items)),
							(o.params = H.extend(
								{
									items: [],
									behaviour: {
										startImage: 1,
										snap: !0,
										ticks: !1,
										labels: !1,
										transparencyReplacementColor: "#000000",
									},
									a11y: { image: "Image", imageSlider: "Image slider" },
								},
								o.params,
							)),
							(o.extras = r),
							(o.maxItem = o.params.items.length - 1),
							(o.startImage = H.constrain(o.params.behaviour.startImage - 1, 0, o.maxItem)),
							(o.selector = ".h5p-agamotto-wrapper"),
							(o.hasDescription = o.params.items.some(function (e) {
								return "" !== e.description;
							})),
							(o.id = a),
							(o.imageContainer = void 0),
							(o.position = 0),
							(o.imagesViewed = []),
							(o.completed = !1),
							(o.updateContent = function (e, t) {
								(t = M(10 * t) / 10),
									(o.slider.isUsed() &&
										t === o.images.getTopOpacity() &&
										(1 !== t || o.position === e)) ||
										(o.images.setImage(e, t),
										o.hasDescription && o.descriptions.setText(e, t),
										(o.position = M(e + (1 - t))),
										!1 === o.completed &&
											-1 === o.imagesViewed.indexOf(o.position) &&
											o.imagesViewed.push(o.position));
							}),
							(o.registerDomElements = function () {
								o.setContent(o.createDOM());
							}),
							(o.createDOM = function () {
								var e = document.createElement("div");
								if ((e.classList.add("h5p-agamotto"), !o.params.items || 1 > o.maxItem)) {
									var a = document.createElement("div");
									return (
										a.classList.add("h5p-agamotto-warning"),
										(a.innerHTML = "I really need at least two images :-)"),
										e.appendChild(a),
										e
									);
								}
								(o.spinner = new K("h5p-agamotto-spinner")), e.appendChild(o.spinner.getDOM());
								var r = [];
								return (
									o.params.items.forEach(function (e) {
										r.push(W.loadImage(e.image, o.id));
									}),
									G.a
										.all(r)
										.then(function (a) {
											if (
												((o.images = a.map(function (e, t) {
													return {
														img: e,
														alt: o.params.items[t].image.params.alt,
														title: o.params.items[t].image.params.title,
														description: o.params.items[t].description,
													};
												})),
												o.spinner.hide(),
												(o.wrapper = document.createElement("div")),
												o.wrapper.classList.add("h5p-agamotto-wrapper"),
												o.wrapper.classList.add("h5p-agamotto-passepartout-horizontal"),
												o.wrapper.classList.add("h5p-agamotto-passepartout-top"),
												o.wrapper.classList.add("h5p-agamotto-passepartout-bottom"),
												e.appendChild(o.wrapper),
												o.params.title)
											) {
												var r = document.createElement("div");
												r.classList.add("h5p-agamotto-title"),
													(r.innerHTML = "<h2>".concat(o.params.title, "</h2>")),
													o.wrapper.appendChild(r);
											}
											(o.images = new W(o.images, o.params.behaviour.transparencyReplacementColor)),
												o.wrapper.appendChild(o.images.getDOM()),
												o.images.resize();
											for (var s = [], n = 0; n <= o.maxItem; n++)
												s[n] = o.params.items[n].labelText || "";
											if (
												((o.slider = new U(
													{
														snap: o.params.behaviour.snap,
														ticks: o.params.behaviour.ticks,
														labels: o.params.behaviour.labels,
														labelTexts: s,
														altTitleTexts: o.images.getAltTitleTags(),
														startRatio: o.startImage / o.maxItem,
														size: o.maxItem,
														a11y: {
															image: o.params.a11y.image,
															imageSlider: o.params.a11y.imageSlider,
														},
													},
													o.selector,
													_(o),
												)),
												o.wrapper.appendChild(o.slider.getDOM()),
												o.slider.resize(),
												o.hasDescription)
											) {
												for (var i = [], l = 0; l <= o.maxItem; l++)
													i[l] = o.params.items[l].description;
												(o.descriptions = new F(i, o.selector, _(o), o.contentId)),
													o.wrapper.appendChild(o.descriptions.getDOM()),
													o.descriptions.resize(),
													o.wrapper.classList.remove("h5p-agamotto-passepartout-bottom"),
													(o.heightDescriptions = o.descriptions.offsetHeight);
											} else o.heightDescriptions = 0;
											o.params.showTitle
												? o.wrapper.classList.remove("h5p-agamotto-passepartout-top")
												: !o.hasDescription &&
													(o.wrapper.classList.remove("h5p-agamotto-passepartout-horizontal"),
													o.wrapper.classList.remove("h5p-agamotto-passepartout-top"),
													o.wrapper.classList.remove("h5p-agamotto-passepartout-bottom")),
												(o.imageContainer = o.images.getDOM()),
												o.xAPIExperienced(),
												o.slider.on("update", function (e) {
													var t = 5,
														a = H.project(
															e.data.position,
															0 + t,
															o.slider.getWidth() - t,
															0,
															o.maxItem,
														),
														r = H.constrain(Math.floor(a), 0, o.maxItem),
														i = 1 - H.constrain(a - r, 0, 1),
														s = 0.5 * (1 - Math.cos(Math.PI * i));
													o.updateContent(r, s);
												}),
												window.addEventListener("resize", function () {
													if (!o.resizeCooling) {
														if (H.isMobileDevice() && 90 === Math.abs(window.orientation)) {
															var e = /iPhone/.test(navigator.userAgent)
																? screen.width
																: screen.height;
															o.wrapper.style.width = M((e / 2) * o.images.getRatio()) + "px";
														} else o.wrapper.style.width = "auto";
														o.images.resize(),
															o.slider.resize(),
															o.hasDescription && o.descriptions.resize(),
															setTimeout(function () {
																o.trigger("resize");
															}),
															(o.resizeCooling = setTimeout(function () {
																o.resizeCooling = null;
															}, t.RESIZE_COOLING_PERIOD));
													}
												}),
												o.trigger("resize");
										})
										["catch"](function (e) {
											console.warn(e);
										}),
									e
								);
							}),
							(o.announceARIA = function (e) {
								e = void 0 === e ? "" : H.htmlDecode("".concat(e, " "));
								var t = o.descriptions ? o.descriptions.getCurrentDescriptionText() : "",
									a = "".concat(e).concat(o.images.getCurrentAltTag(), ". ").concat(t);
								(a = H.stripHTML(a)), o.read(a);
							}),
							(o.xAPIExperienced = function () {
								o.triggerXAPI("experienced");
							}),
							(o.xAPIInteracted = function () {
								o.triggerXAPI("interacted");
							}),
							(o.xAPICompleted = function () {
								o.imagesViewed.length !== o.params.items.length ||
									o.completed ||
									(o.triggerXAPI("completed"), (o.completed = !0));
							}),
							(o.getTitle = function () {
								return H5P.createTitle(
									o.extras.metadata && o.extras.metadata.title
										? o.extras.metadata.title
										: "Agamotto",
								);
							}),
							o);
				}
				return (
					w(t, e),
					L(t, null, [
						{
							key: "sanitizeItems",
							value: function (e) {
								return (
									(e = e
										.filter(function (e) {
											return (
												!!(e.image && e.image.params && e.image.params.file) ||
												(console.warn(
													"An image is missing. I will continue without it, but please check your settings.",
												),
												!1)
											);
										})
										.splice(0, 50)
										.map(function (e) {
											return (
												(e.image.params.alt = e.image.params.alt || ""),
												(e.image.params.title = e.image.params.title || ""),
												e
											);
										})),
									e
								);
							},
						},
					]),
					t
				);
			})(H5P.Question);
		(V.DEFAULT_DESCRIPTION = "Agamotto"), (V.RESIZE_COOLING_PERIOD = 50);
		(H5P = H5P || {}), (H5P.Agamotto = V);
	},
]);
