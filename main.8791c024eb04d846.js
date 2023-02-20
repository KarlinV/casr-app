"use strict";
(self.webpackChunkmy_app = self.webpackChunkmy_app || []).push([
  [179],
  {
    2: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function bo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Mo = bo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function Er(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class yt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ne(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Mo ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  ac(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Mo ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Mo(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) ac(t);
            else {
              if (t instanceof yt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && Er(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && Er(n, t), t instanceof yt && t._removeParent(this);
        }
      }
      yt.EMPTY = (() => {
        const e = new yt();
        return (e.closed = !0), e;
      })();
      const ic = yt.EMPTY;
      function sc(e) {
        return (
          e instanceof yt ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function ac(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const un = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Io = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Io;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Io;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function uc(e) {
        Io.setTimeout(() => {
          const { onUnhandledError: t } = un;
          if (!t) throw e;
          t(e);
        });
      }
      function lc() {}
      const MD = Ds("C", void 0, void 0);
      function Ds(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let ln = null;
      function So(e) {
        if (un.useDeprecatedSynchronousErrorHandling) {
          const t = !ln;
          if ((t && (ln = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = ln;
            if (((ln = null), n)) throw r;
          }
        } else e();
      }
      class _s extends yt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), sc(t) && t.add(this))
              : (this.destination = xD);
        }
        static create(t, n, r) {
          return new wr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Cs(
                (function SD(e) {
                  return Ds("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Cs(
                (function ID(e) {
                  return Ds("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Cs(MD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const TD = Function.prototype.bind;
      function vs(e, t) {
        return TD.call(e, t);
      }
      class ND {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Ao(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Ao(r);
            }
          else Ao(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Ao(n);
            }
        }
      }
      class wr extends _s {
        constructor(t, n, r) {
          let o;
          if ((super(), ne(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && un.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && vs(t.next, i),
                  error: t.error && vs(t.error, i),
                  complete: t.complete && vs(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new ND(o);
        }
      }
      function Ao(e) {
        un.useDeprecatedSynchronousErrorHandling
          ? (function AD(e) {
              un.useDeprecatedSynchronousErrorHandling &&
                ln &&
                ((ln.errorThrown = !0), (ln.error = e));
            })(e)
          : uc(e);
      }
      function Cs(e, t) {
        const { onStoppedNotification: n } = un;
        n && Io.setTimeout(() => n(e, t));
      }
      const xD = {
          closed: !0,
          next: lc,
          error: function FD(e) {
            throw e;
          },
          complete: lc,
        },
        Es =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function cc(e) {
        return e;
      }
      let we = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function OD(e) {
              return (
                (e && e instanceof _s) ||
                ((function PD(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  sc(e))
              );
            })(n)
              ? n
              : new wr(n, r, o);
            return (
              So(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = fc(r))((o, i) => {
              const s = new wr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [Es]() {
            return this;
          }
          pipe(...n) {
            return (function dc(e) {
              return 0 === e.length
                ? cc
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = fc(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function fc(e) {
        var t;
        return null !== (t = e ?? un.Promise) && void 0 !== t ? t : Promise;
      }
      const RD = bo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let ws = (() => {
        class e extends we {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new hc(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new RD();
          }
          next(n) {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            So(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? ic
              : ((this.currentObservers = null),
                i.push(n),
                new yt(() => {
                  (this.currentObservers = null), Er(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new we();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new hc(t, n)), e;
      })();
      class hc extends ws {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : ic;
        }
      }
      function Fn(e) {
        return (t) => {
          if (
            (function kD(e) {
              return ne(e?.lift);
            })(t)
          )
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function xn(e, t, n, r, o) {
        return new LD(e, t, n, r, o);
      }
      class LD extends _s {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function cn(e, t) {
        return Fn((n, r) => {
          let o = 0;
          n.subscribe(
            xn(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function dn(e) {
        return this instanceof dn ? ((this.v = e), this) : new dn(e);
      }
      function HD(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, g) {
                i.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof dn
                ? Promise.resolve(f.value.v).then(l, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function jD(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function mc(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const yc = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Dc(e) {
        return ne(e?.then);
      }
      function _c(e) {
        return ne(e[Es]);
      }
      function vc(e) {
        return Symbol.asyncIterator && ne(e?.[Symbol.asyncIterator]);
      }
      function Cc(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Ec = (function UD() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function wc(e) {
        return ne(e?.[Ec]);
      }
      function bc(e) {
        return HD(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield dn(n.read());
              if (o) return yield dn(void 0);
              yield yield dn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Mc(e) {
        return ne(e?.getReader);
      }
      function Ft(e) {
        if (e instanceof we) return e;
        if (null != e) {
          if (_c(e))
            return (function GD(e) {
              return new we((t) => {
                const n = e[Es]();
                if (ne(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (yc(e))
            return (function zD(e) {
              return new we((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Dc(e))
            return (function WD(e) {
              return new we((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, uc);
              });
            })(e);
          if (vc(e)) return Ic(e);
          if (wc(e))
            return (function qD(e) {
              return new we((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Mc(e))
            return (function KD(e) {
              return Ic(bc(e));
            })(e);
        }
        throw Cc(e);
      }
      function Ic(e) {
        return new we((t) => {
          (function ZD(e, t) {
            var n, r, o, i;
            return (function VD(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = jD(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Kt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function To(e, t, n = 1 / 0) {
        return ne(t)
          ? To((r, o) => cn((i, s) => t(r, i, o, s))(Ft(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Fn((r, o) =>
              (function XD(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let _ = !1;
                    Ft(n(g, c++)).subscribe(
                      xn(
                        t,
                        (y) => {
                          o?.(y), i ? h(y) : t.next(y);
                        },
                        () => {
                          _ = !0;
                        },
                        void 0,
                        () => {
                          if (_)
                            try {
                              for (l--; u.length && l < r; ) {
                                const y = u.shift();
                                s ? Kt(t, s, () => p(y)) : p(y);
                              }
                              f();
                            } catch (y) {
                              t.error(y);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    xn(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      const Sc = new we((e) => e.complete());
      function Ms(e) {
        return e[e.length - 1];
      }
      function Ac(e) {
        return (function JD(e) {
          return e && ne(e.schedule);
        })(Ms(e))
          ? e.pop()
          : void 0;
      }
      function Tc(e, t = 0) {
        return Fn((n, r) => {
          n.subscribe(
            xn(
              r,
              (o) => Kt(r, e, () => r.next(o), t),
              () => Kt(r, e, () => r.complete(), t),
              (o) => Kt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Nc(e, t = 0) {
        return Fn((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Fc(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new we((n) => {
          Kt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Kt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Is(e, t) {
        return t
          ? (function a_(e, t) {
              if (null != e) {
                if (_c(e))
                  return (function n_(e, t) {
                    return Ft(e).pipe(Nc(t), Tc(t));
                  })(e, t);
                if (yc(e))
                  return (function o_(e, t) {
                    return new we((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Dc(e))
                  return (function r_(e, t) {
                    return Ft(e).pipe(Nc(t), Tc(t));
                  })(e, t);
                if (vc(e)) return Fc(e, t);
                if (wc(e))
                  return (function i_(e, t) {
                    return new we((n) => {
                      let r;
                      return (
                        Kt(n, t, () => {
                          (r = e[Ec]()),
                            Kt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Mc(e))
                  return (function s_(e, t) {
                    return Fc(bc(e), t);
                  })(e, t);
              }
              throw Cc(e);
            })(e, t)
          : Ft(e);
      }
      function Ss(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new wr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return Ft(t(...n)).subscribe(r);
      }
      function K(e) {
        for (let t in e) if (e[t] === K) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function As(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function Y(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Y).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Ts(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const c_ = K({ __forward_ref__: K });
      function Q(e) {
        return (
          (e.__forward_ref__ = Q),
          (e.toString = function () {
            return Y(this());
          }),
          e
        );
      }
      function A(e) {
        return Ns(e) ? e() : e;
      }
      function Ns(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(c_) &&
          e.__forward_ref__ === Q
        );
      }
      function Fs(e) {
        return e && !!e.ɵproviders;
      }
      const xc = "https://g.co/ng/security#xss";
      class C extends Error {
        constructor(t, n) {
          super(
            (function No(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function F(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Fo(e, t) {
        throw new C(-201, !1);
      }
      function Qe(e, t) {
        null == e &&
          (function G(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function j(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Dt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function xo(e) {
        return Pc(e, Po) || Pc(e, Rc);
      }
      function Pc(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Oc(e) {
        return e && (e.hasOwnProperty(xs) || e.hasOwnProperty(D_))
          ? e[xs]
          : null;
      }
      const Po = K({ ɵprov: K }),
        xs = K({ ɵinj: K }),
        Rc = K({ ngInjectableDef: K }),
        D_ = K({ ngInjectorDef: K });
      var N = (() => (
        ((N = N || {})[(N.Default = 0)] = "Default"),
        (N[(N.Host = 1)] = "Host"),
        (N[(N.Self = 2)] = "Self"),
        (N[(N.SkipSelf = 4)] = "SkipSelf"),
        (N[(N.Optional = 8)] = "Optional"),
        N
      ))();
      let Ps;
      function Je(e) {
        const t = Ps;
        return (Ps = e), t;
      }
      function kc(e, t, n) {
        const r = xo(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & N.Optional
          ? null
          : void 0 !== t
          ? t
          : void Fo(Y(e));
      }
      const J = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        br = {},
        Os = "__NG_DI_FLAG__",
        Oo = "ngTempTokenPath",
        C_ = /\n/gm,
        Lc = "__source";
      let Mr;
      function Pn(e) {
        const t = Mr;
        return (Mr = e), t;
      }
      function w_(e, t = N.Default) {
        if (void 0 === Mr) throw new C(-203, !1);
        return null === Mr
          ? kc(e, void 0, t)
          : Mr.get(e, t & N.Optional ? null : void 0, t);
      }
      function V(e, t = N.Default) {
        return (
          (function __() {
            return Ps;
          })() || w_
        )(A(e), t);
      }
      function On(e, t = N.Default) {
        return V(e, Ro(t));
      }
      function Ro(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Rs(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = A(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = N.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = b_(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(V(o, i));
          } else t.push(V(r));
        }
        return t;
      }
      function Ir(e, t) {
        return (e[Os] = t), (e.prototype[Os] = t), e;
      }
      function b_(e) {
        return e[Os];
      }
      function Xt(e) {
        return { toString: e }.toString();
      }
      var it = (() => (
          ((it = it || {})[(it.OnPush = 0)] = "OnPush"),
          (it[(it.Default = 1)] = "Default"),
          it
        ))(),
        _t = (() => {
          return (
            ((e = _t || (_t = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            _t
          );
          var e;
        })();
      const xt = {},
        $ = [],
        ko = K({ ɵcmp: K }),
        ks = K({ ɵdir: K }),
        Ls = K({ ɵpipe: K }),
        Bc = K({ ɵmod: K }),
        Pt = K({ ɵfac: K }),
        Sr = K({ __NG_ELEMENT_ID__: K });
      let S_ = 0;
      function Vs(e) {
        return Xt(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === it.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || $,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || _t.Emulated,
              id: "c" + S_++,
              styles: e.styles || $,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
              findHostDirectiveDefs: null,
              hostDirectives: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = $c(e.inputs, r)),
            (o.outputs = $c(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Hc).filter(jc)
              : null),
            (o.pipeDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Pe).filter(jc)
              : null),
            o
          );
        });
      }
      function Hc(e) {
        return z(e) || be(e);
      }
      function jc(e) {
        return null !== e;
      }
      function Ot(e) {
        return Xt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || $,
          declarations: e.declarations || $,
          imports: e.imports || $,
          exports: e.exports || $,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function $c(e, t) {
        if (null == e) return xt;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const x = Vs;
      function z(e) {
        return e[ko] || null;
      }
      function be(e) {
        return e[ks] || null;
      }
      function Pe(e) {
        return e[Ls] || null;
      }
      const L = 11;
      function qe(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function at(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function js(e) {
        return 0 != (4 & e.flags);
      }
      function xr(e) {
        return e.componentOffset > -1;
      }
      function jo(e) {
        return 1 == (1 & e.flags);
      }
      function ut(e) {
        return null !== e.template;
      }
      function N_(e) {
        return 0 != (256 & e[2]);
      }
      function hn(e, t) {
        return e.hasOwnProperty(Pt) ? e[Pt] : null;
      }
      class P_ {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function kt() {
        return Kc;
      }
      function Kc(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = R_), O_;
      }
      function O_() {
        const e = Xc(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === xt) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function R_(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            Xc(e) ||
            (function k_(e, t) {
              return (e[Zc] = t);
            })(e, { previous: xt, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new P_(u && u.currentValue, t, a === xt)), (e[r] = t);
      }
      kt.ngInherit = !0;
      const Zc = "__ngSimpleChanges__";
      function Xc(e) {
        return e[Zc] || null;
      }
      function Ce(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function $o(e, t) {
        return Ce(t[e]);
      }
      function Ke(e, t) {
        return Ce(t[e.index]);
      }
      function Jc(e, t) {
        return e.data[t];
      }
      function Ze(e, t) {
        const n = t[e];
        return qe(n) ? n : n[0];
      }
      function Uo(e) {
        return 64 == (64 & e[2]);
      }
      function Yt(e, t) {
        return null == t ? null : e[t];
      }
      function ed(e) {
        e[18] = 0;
      }
      function Us(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const P = { lFrame: cd(null), bindingsEnabled: !0 };
      function nd() {
        return P.bindingsEnabled;
      }
      function D() {
        return P.lFrame.lView;
      }
      function H() {
        return P.lFrame.tView;
      }
      function Gs(e) {
        return (P.lFrame.contextLView = e), e[8];
      }
      function zs(e) {
        return (P.lFrame.contextLView = null), e;
      }
      function Ee() {
        let e = rd();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function rd() {
        return P.lFrame.currentTNode;
      }
      function Ct(e, t) {
        const n = P.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Ws() {
        return P.lFrame.isParent;
      }
      function Hn() {
        return P.lFrame.bindingIndex++;
      }
      function Z_(e, t) {
        const n = P.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Ks(t);
      }
      function Ks(e) {
        P.lFrame.currentDirectiveIndex = e;
      }
      function Xs(e) {
        P.lFrame.currentQueryIndex = e;
      }
      function Y_(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function ud(e, t, n) {
        if (n & N.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & N.Host ||
              ((o = Y_(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (P.lFrame = ld());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Ys(e) {
        const t = ld(),
          n = e[1];
        (P.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function ld() {
        const e = P.lFrame,
          t = null === e ? null : e.child;
        return null === t ? cd(e) : t;
      }
      function cd(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function dd() {
        const e = P.lFrame;
        return (
          (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const fd = dd;
      function Qs() {
        const e = dd();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function ke() {
        return P.lFrame.selectedIndex;
      }
      function pn(e) {
        P.lFrame.selectedIndex = e;
      }
      function oe() {
        const e = P.lFrame;
        return Jc(e.tView, e.selectedIndex);
      }
      function Go(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function zo(e, t, n) {
        hd(e, t, 3, n);
      }
      function Wo(e, t, n, r) {
        (3 & e[2]) === n && hd(e, t, n, r);
      }
      function Js(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function hd(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (sv(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function sv(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class Or {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function ta(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            gd(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function pd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function gd(e) {
        return 64 === e.charCodeAt(0);
      }
      function Rr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  md(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function md(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function yd(e) {
        return -1 !== e;
      }
      function qo(e) {
        return 32767 & e;
      }
      function Ko(e, t) {
        let n = (function cv(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let na = !0;
      function Zo(e) {
        const t = na;
        return (na = e), t;
      }
      let dv = 0;
      const Et = {};
      function Xo(e, t) {
        const n = vd(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          ra(r.data, e),
          ra(t, null),
          ra(r.blueprint, null));
        const o = oa(e, t),
          i = e.injectorIndex;
        if (yd(o)) {
          const s = qo(o),
            a = Ko(o, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function ra(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function vd(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function oa(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = Sd(o)), null === r)) return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function ia(e, t, n) {
        !(function fv(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Sr) && (r = n[Sr]),
            null == r && (r = n[Sr] = dv++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function Cd(e, t, n) {
        if (n & N.Optional || void 0 !== e) return e;
        Fo();
      }
      function Ed(e, t, n, r) {
        if (
          (n & N.Optional && void 0 === r && (r = null),
          !(n & (N.Self | N.Host)))
        ) {
          const o = e[9],
            i = Je(void 0);
          try {
            return o ? o.get(t, r, n & N.Optional) : kc(t, r, n & N.Optional);
          } finally {
            Je(i);
          }
        }
        return Cd(r, 0, n);
      }
      function wd(e, t, n, r = N.Default, o) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function yv(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = bd(i, s, n, r | N.Self, Et);
                if (a !== Et) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[21];
                  if (l) {
                    const c = l.get(n, Et, r);
                    if (c !== Et) return c;
                  }
                  (u = Sd(s)), (s = s[15]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, Et);
            if (s !== Et) return s;
          }
          const i = bd(e, t, n, r, Et);
          if (i !== Et) return i;
        }
        return Ed(t, n, r, o);
      }
      function bd(e, t, n, r, o) {
        const i = (function gv(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Sr) ? e[Sr] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : mv) : t;
        })(n);
        if ("function" == typeof i) {
          if (!ud(t, e, r)) return r & N.Host ? Cd(o, 0, r) : Ed(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & N.Optional) return s;
            Fo();
          } finally {
            fd();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = vd(e, t),
            u = -1,
            l = r & N.Host ? t[16][6] : null;
          for (
            (-1 === a || r & N.SkipSelf) &&
            ((u = -1 === a ? oa(e, t) : t[a + 8]),
            -1 !== u && Id(r, !1)
              ? ((s = t[1]), (a = qo(u)), (t = Ko(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (Md(i, a, c.data)) {
              const d = pv(a, t, n, s, r, l);
              if (d !== Et) return d;
            }
            (u = t[a + 8]),
              -1 !== u && Id(r, t[1].data[a + 8] === l) && Md(i, a, t)
                ? ((s = c), (a = qo(u)), (t = Ko(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function pv(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function Yo(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && ut(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? xr(a) && na : r != s && 0 != (3 & a.type),
            o & N.Host && i === a
          );
        return null !== c ? gn(t, s, c, a) : Et;
      }
      function gn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function av(e) {
            return e instanceof Or;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function d_(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function U(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : F(e);
              })(i[n])
            );
          const a = Zo(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? Je(s.injectImpl) : null;
          ud(e, r, N.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function iv(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Kc(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && Je(u), Zo(a), (s.resolving = !1), fd();
          }
        }
        return o;
      }
      function Md(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function Id(e, t) {
        return !(e & N.Self || (e & N.Host && t));
      }
      class $n {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return wd(this._tNode, this._lView, t, Ro(r), n);
        }
      }
      function mv() {
        return new $n(Ee(), D());
      }
      function Se(e) {
        return Xt(() => {
          const t = e.prototype.constructor,
            n = t[Pt] || sa(t),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[Pt] || sa(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function sa(e) {
        return Ns(e)
          ? () => {
              const t = sa(A(e));
              return t && t();
            }
          : hn(e);
      }
      function Sd(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      const Gn = "__parameters__";
      function Wn(e, t, n) {
        return Xt(() => {
          const r = (function ua(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(Gn)
                ? u[Gn]
                : Object.defineProperty(u, Gn, { value: [] })[Gn];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class M {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = j({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function mn(e, t) {
        e.forEach((n) => (Array.isArray(n) ? mn(n, t) : t(n)));
      }
      function Td(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Qo(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function Xe(e, t, n) {
        let r = qn(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function Cv(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function ca(e, t) {
        const n = qn(e, t);
        if (n >= 0) return e[1 | n];
      }
      function qn(e, t) {
        return (function Nd(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const ei = Ir(Wn("Optional"), 8),
        ti = Ir(Wn("SkipSelf"), 4);
      var $e = (() => (
        (($e = $e || {})[($e.Important = 1)] = "Important"),
        ($e[($e.DashCase = 2)] = "DashCase"),
        $e
      ))();
      const ma = new Map();
      let Uv = 0;
      const Da = "__ngContext__";
      function Ae(e, t) {
        qe(t)
          ? ((e[Da] = t[20]),
            (function zv(e) {
              ma.set(e[20], e);
            })(t))
          : (e[Da] = t);
      }
      function va(e, t) {
        return undefined(e, t);
      }
      function $r(e) {
        const t = e[3];
        return at(t) ? t[3] : t;
      }
      function Ca(e) {
        return Xd(e[13]);
      }
      function Ea(e) {
        return Xd(e[4]);
      }
      function Xd(e) {
        for (; null !== e && !at(e); ) e = e[4];
        return e;
      }
      function Zn(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          at(r) ? (i = r) : qe(r) && ((s = !0), (r = r[0]));
          const a = Ce(r);
          0 === e && null !== n
            ? null == o
              ? nf(t, n, a)
              : yn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? yn(t, n, a, o || null, !0)
            : 2 === e
            ? (function Ta(e, t, n) {
                const r = oi(e, t);
                r &&
                  (function dC(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function pC(e, t, n, r, o) {
                const i = n[7];
                i !== Ce(n) && Zn(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  Ur(u[1], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function ba(e, t, n) {
        return e.createElement(t, n);
      }
      function Qd(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        512 & t[2] && ((t[2] &= -513), Us(o, -1)), n.splice(r, 1);
      }
      function Ma(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && Qd(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = Qo(e, 10 + t);
          !(function rC(e, t) {
            Ur(e, t, t[L], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function Jd(e, t) {
        if (!(128 & t[2])) {
          const n = t[L];
          n.destroyNode && Ur(e, t, n, 3, null, null),
            (function sC(e) {
              let t = e[13];
              if (!t) return Ia(e[1], e);
              for (; t; ) {
                let n = null;
                if (qe(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    qe(t) && Ia(t[1], t), (t = t[3]);
                  null === t && (t = e), qe(t) && Ia(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function Ia(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function cC(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof Or)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function lC(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[(o = s)]() : r[(o = -s)].unsubscribe(), (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[L].destroy();
          const n = t[17];
          if (null !== n && at(t[3])) {
            n !== t[3] && Qd(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function Wv(e) {
            ma.delete(e[20]);
          })(t);
        }
      }
      function ef(e, t, n) {
        return (function tf(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === _t.None || i === _t.Emulated) return null;
            }
            return Ke(r, n);
          }
        })(e, t.parent, n);
      }
      function yn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function nf(e, t, n) {
        e.appendChild(t, n);
      }
      function rf(e, t, n, r, o) {
        null !== r ? yn(e, t, n, r, o) : nf(e, t, n);
      }
      function oi(e, t) {
        return e.parentNode(t);
      }
      let xa,
        af = function sf(e, t, n) {
          return 40 & e.type ? Ke(e, n) : null;
        };
      function ii(e, t, n, r) {
        const o = ef(e, r, t),
          i = t[L],
          a = (function of(e, t, n) {
            return af(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) rf(i, o, n[u], a, !1);
          else rf(i, o, n, a, !1);
      }
      function si(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Ke(t, e);
          if (4 & n) return Aa(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return si(e, r);
            {
              const o = e[t.index];
              return at(o) ? Aa(-1, o) : Ce(o);
            }
          }
          if (32 & n) return va(t, e)() || Ce(e[t.index]);
          {
            const r = lf(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : si($r(e[16]), r)
              : si(e, t.next);
          }
        }
        return null;
      }
      function lf(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function Aa(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return si(r, o);
        }
        return t[7];
      }
      function Na(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ae(Ce(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) Na(e, t, n.child, r, o, i, !1), Zn(t, e, o, a, i);
            else if (32 & u) {
              const l = va(n, r);
              let c;
              for (; (c = l()); ) Zn(t, e, o, c, i);
              Zn(t, e, o, a, i);
            } else 16 & u ? cf(e, t, r, n, o, i) : Zn(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Ur(e, t, n, r, o, i) {
        Na(n, r, e.firstChild, t, o, i, !1);
      }
      function cf(e, t, n, r, o, i) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) Zn(t, e, o, u[l], i);
        else Na(e, t, u, s[3], o, i, !0);
      }
      function df(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function ff(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && ta(e, t, r),
          null !== o && df(e, t, o),
          null !== i &&
            (function mC(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class yf {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${xc})`;
        }
      }
      function Qt(e) {
        return e instanceof yf ? e.changingThisBreaksApplicationSecurity : e;
      }
      const NC =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var fe = (() => (
        ((fe = fe || {})[(fe.NONE = 0)] = "NONE"),
        (fe[(fe.HTML = 1)] = "HTML"),
        (fe[(fe.STYLE = 2)] = "STYLE"),
        (fe[(fe.SCRIPT = 3)] = "SCRIPT"),
        (fe[(fe.URL = 4)] = "URL"),
        (fe[(fe.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        fe
      ))();
      function Va(e) {
        const t = (function Wr() {
          const e = D();
          return e && e[12];
        })();
        return t
          ? t.sanitize(fe.URL, e) || ""
          : (function Gr(e, t) {
              const n = (function IC(e) {
                return (e instanceof yf && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(`Required a safe ${t}, got a ${n} (see ${xc})`);
              }
              return n === t;
            })(e, "URL")
          ? Qt(e)
          : (function Oa(e) {
              return (e = String(e)).match(NC) ? e : "unsafe:" + e;
            })(F(e));
      }
      const Mf = new M("ENVIRONMENT_INITIALIZER"),
        If = new M("INJECTOR", -1),
        Sf = new M("INJECTOR_DEF_TYPES");
      class Af {
        get(t, n = br) {
          if (n === br) {
            const r = new Error(`NullInjectorError: No provider for ${Y(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function zC(...e) {
        return { ɵproviders: Tf(0, e), ɵfromNgModule: !0 };
      }
      function Tf(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          mn(t, (i) => {
            const s = i;
            Ba(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && Nf(o, n),
          n
        );
      }
      function Nf(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Ha(o, (i) => {
            t.push(i);
          });
        }
      }
      function Ba(e, t, n, r) {
        if (!(e = A(e))) return !1;
        let o = null,
          i = Oc(e);
        const s = !i && z(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = Oc(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Ba(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                mn(i.imports, (c) => {
                  Ba(c, t, n, r) && (l || (l = []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && Nf(l, t);
            }
            if (!a) {
              const l = hn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: l, deps: $ },
                { provide: Sf, useValue: o, multi: !0 },
                { provide: Mf, useValue: () => V(o), multi: !0 }
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              Ha(u, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Ha(e, t) {
        for (let n of e)
          Fs(n) && (n = n.ɵproviders), Array.isArray(n) ? Ha(n, t) : t(n);
      }
      const WC = K({ provide: String, useValue: K });
      function ja(e) {
        return null !== e && "object" == typeof e && WC in e;
      }
      function _n(e) {
        return "function" == typeof e;
      }
      const $a = new M("Set Injector scope."),
        ci = {},
        KC = {};
      let Ua;
      function di() {
        return void 0 === Ua && (Ua = new Af()), Ua;
      }
      class vn {}
      class Pf extends vn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            za(t, (s) => this.processProvider(s)),
            this.records.set(If, Xn(void 0, this)),
            o.has("environment") && this.records.set(vn, Xn(void 0, this));
          const i = this.records.get($a);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Sf.multi, $, N.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = Pn(this),
            r = Je(void 0);
          try {
            return t();
          } finally {
            Pn(n), Je(r);
          }
        }
        get(t, n = br, r = N.Default) {
          this.assertNotDestroyed(), (r = Ro(r));
          const o = Pn(this),
            i = Je(void 0);
          try {
            if (!(r & N.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function JC(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof M)
                    );
                  })(t) && xo(t);
                (a = u && this.injectableDefInScope(u) ? Xn(Ga(t), ci) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & N.Self ? di() : this.parent).get(
              t,
              (n = r & N.Optional && n === br ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Oo] = s[Oo] || []).unshift(Y(t)), o)) throw s;
              return (function M_(e, t, n, r) {
                const o = e[Oo];
                throw (
                  (t[Lc] && o.unshift(t[Lc]),
                  (e.message = (function I_(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = Y(t);
                    if (Array.isArray(t)) o = t.map(Y).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Y(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      C_,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[Oo] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Je(i), Pn(o);
          }
        }
        resolveInjectorInitializers() {
          const t = Pn(this),
            n = Je(void 0);
          try {
            const r = this.get(Mf.multi, $, N.Self);
            for (const o of r) o();
          } finally {
            Pn(t), Je(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Y(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = _n((t = A(t))) ? t : A(t && t.provide);
          const r = (function XC(e) {
            return ja(e) ? Xn(void 0, e.useValue) : Xn(Of(e), ci);
          })(t);
          if (_n(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Xn(void 0, ci, !0)),
              (o.factory = () => Rs(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === ci && ((n.value = KC), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function QC(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = A(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function Ga(e) {
        const t = xo(e),
          n = null !== t ? t.factory : hn(e);
        if (null !== n) return n;
        if (e instanceof M) throw new C(204, !1);
        if (e instanceof Function)
          return (function ZC(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Vr(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function m_(e) {
              const t = e && (e[Po] || e[Rc]);
              if (t) {
                const n = (function y_(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function Of(e, t, n) {
        let r;
        if (_n(e)) {
          const o = A(e);
          return hn(o) || Ga(o);
        }
        if (ja(e)) r = () => A(e.useValue);
        else if (
          (function xf(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Rs(e.deps || []));
        else if (
          (function Ff(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => V(A(e.useExisting));
        else {
          const o = A(e && (e.useClass || e.provide));
          if (
            !(function YC(e) {
              return !!e.deps;
            })(e)
          )
            return hn(o) || Ga(o);
          r = () => new o(...Rs(e.deps));
        }
        return r;
      }
      function Xn(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function za(e, t) {
        for (const n of e)
          Array.isArray(n) ? za(n, t) : n && Fs(n) ? za(n.ɵproviders, t) : t(n);
      }
      class e0 {}
      class Rf {}
      class n0 {
        resolveComponentFactory(t) {
          throw (function t0(e) {
            const t = Error(
              `No component factory found for ${Y(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let fi = (() => {
        class e {}
        return (e.NULL = new n0()), e;
      })();
      function r0() {
        return Yn(Ee(), D());
      }
      function Yn(e, t) {
        return new lt(Ke(e, t));
      }
      let lt = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = r0), e;
      })();
      class Lf {}
      let Cn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function s0() {
                const e = D(),
                  n = Ze(Ee().index, e);
                return (qe(n) ? n : e)[L];
              })()),
            e
          );
        })(),
        a0 = (() => {
          class e {}
          return (
            (e.ɵprov = j({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class hi {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const u0 = new hi("15.1.5"),
        Wa = {};
      function Ka(e) {
        return e.ngOriginalError;
      }
      class Qn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ka(t);
          for (; n && Ka(n); ) n = Ka(n);
          return n || null;
        }
      }
      function Za(e) {
        return e.ownerDocument;
      }
      function Bf(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Hf = "ng-template";
      function D0(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== Bf(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function jf(e) {
        return 4 === e.type && e.value !== Hf;
      }
      function _0(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Hf);
      }
      function v0(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function w0(e) {
            for (let t = 0; t < e.length; t++) if (pd(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !_0(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (ct(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!D0(e.attrs, l, n)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = C0(8 & r ? "class" : u, o, jf(e), n);
                if (-1 === d) {
                  if (ct(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Bf(h, l, 0)) || (2 & r && l !== f)) {
                    if (ct(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !ct(r) && !ct(u)) return !1;
            if (s && ct(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return ct(r) || s;
      }
      function ct(e) {
        return 0 == (1 & e);
      }
      function C0(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function b0(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function $f(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (v0(e, t[r], n)) return !0;
        return !1;
      }
      function Uf(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function I0(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !ct(s) && ((t += Uf(i, o)), (o = "")),
              (r = s),
              (i = i || !ct(r));
          n++;
        }
        return "" !== o && (t += Uf(i, o)), t;
      }
      const O = {};
      function dt(e) {
        Gf(H(), D(), ke() + e, !1);
      }
      function Gf(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && zo(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Wo(t, i, 0, n);
          }
        pn(n);
      }
      function Kf(e, t = null, n = null, r) {
        const o = Zf(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Zf(e, t = null, n = null, r, o = new Set()) {
        const i = [n || $, zC(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : Y(e))),
          new Pf(i, t || di(), r || null, o)
        );
      }
      let Jt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Kf({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Kf({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = br),
          (e.NULL = new Af()),
          (e.ɵprov = j({ token: e, providedIn: "any", factory: () => V(If) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function v(e, t = N.Default) {
        const n = D();
        return null === n ? V(e, t) : wd(Ee(), n, A(e), t);
      }
      function nh(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Xs(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function gi(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = o),
          (d[2] = 76 | r),
          (null !== c || (e && 1024 & e[2])) && (d[2] |= 1024),
          ed(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[L] = a || (e && e[L])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = l || (e && e[9]) || null),
          (d[6] = i),
          (d[20] = (function Gv() {
            return Uv++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function tr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function eu(e, t, n, r, o) {
            const i = rd(),
              s = Ws(),
              u = (e.data[t] = (function J0(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && (i.next = u)),
              u
            );
          })(e, t, n, r, o)),
            (function K_() {
              return P.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Pr() {
            const e = P.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Ct(i, !0), i;
      }
      function qr(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function tu(e, t, n) {
        Ys(t);
        try {
          const r = e.viewQuery;
          null !== r && du(1, r, n);
          const o = e.template;
          null !== o && rh(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && nh(e, t),
            e.staticViewQueries && du(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function X0(e, t) {
              for (let n = 0; n < t.length; n++) DE(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), Qs();
        }
      }
      function mi(e, t, n, r) {
        const o = t[2];
        if (128 != (128 & o)) {
          Ys(t);
          try {
            ed(t),
              (function id(e) {
                return (P.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && rh(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && zo(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && Wo(t, l, 0, null), Js(t, 0);
            }
            if (
              ((function mE(e) {
                for (let t = Ca(e); null !== t; t = Ea(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    512 & o[2] || Us(o[3], 1), (o[2] |= 512);
                  }
                }
              })(t),
              (function gE(e) {
                for (let t = Ca(e); null !== t; t = Ea(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    Uo(r) && mi(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && nh(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && zo(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && Wo(t, l, 1), Js(t, 1);
            }
            !(function K0(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) pn(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      Z_(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  pn(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function Z0(e, t) {
                for (let n = 0; n < t.length; n++) yE(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && du(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && zo(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && Wo(t, l, 2), Js(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), Us(t[3], -1));
          } finally {
            Qs();
          }
        }
      }
      function rh(e, t, n, r, o) {
        const i = ke(),
          s = 2 & r;
        try {
          pn(-1), s && t.length > 22 && Gf(e, t, 22, !1), n(r, o);
        } finally {
          pn(i);
        }
      }
      function nu(e, t, n) {
        if (js(t)) {
          const o = t.directiveEnd;
          for (let i = t.directiveStart; i < o; i++) {
            const s = e.data[i];
            s.contentQueries && s.contentQueries(1, n[i], i);
          }
        }
      }
      function ru(e, t, n) {
        nd() &&
          ((function iE(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            xr(n) &&
              (function fE(e, t, n) {
                const r = Ke(t, e),
                  o = oh(n),
                  i = e[10],
                  s = yi(
                    e,
                    gi(
                      e,
                      o,
                      null,
                      n.onPush ? 32 : 16,
                      r,
                      t,
                      i,
                      i.createRenderer(r, n),
                      null,
                      null,
                      null
                    )
                  );
                e[t.index] = s;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || Xo(n, t),
              Ae(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                l = gn(t, e, a, n);
              Ae(l, t),
                null !== s && hE(0, a - o, l, u, 0, s),
                ut(u) && (Ze(n.index, t)[8] = gn(t, e, a, n));
            }
          })(e, t, n, Ke(n, t)),
          64 == (64 & n.flags) && ch(e, t, n));
      }
      function ou(e, t, n = Ke) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function oh(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = iu(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function iu(e, t, n, r, o, i, s, a, u, l) {
        const c = 22 + r,
          d = c + o,
          f = (function Y0(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : O);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function sh(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? ah(n, t, o, i)
              : r.hasOwnProperty(o) && ah(n, t, r[o], i);
          }
        return n;
      }
      function ah(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function Ye(e, t, n, r, o, i, s, a) {
        const u = Ke(t, n);
        let c,
          l = t.inputs;
        !a && null != l && (c = l[r])
          ? (fu(e, n, c, r, o), xr(t) && uh(n, t.index))
          : 3 & t.type &&
            ((r = (function tE(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(r)),
            (o = null != s ? s(o, t.value || "", r) : o),
            i.setProperty(u, r, o));
      }
      function uh(e, t) {
        const n = Ze(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function su(e, t, n, r) {
        let o = !1;
        if (nd()) {
          const i = null === r ? null : { "": -1 },
            s = (function aE(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if ($f(t, s.selectors, !1))
                    if ((r || (r = []), ut(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          au(e, t, a.length);
                      } else r.unshift(s), au(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let a, u;
          null === s ? (a = u = null) : ([a, u] = s),
            null !== a && ((o = !0), lh(e, t, n, a, i, u)),
            i &&
              (function uE(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new C(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, i);
        }
        return (n.mergedAttrs = Rr(n.mergedAttrs, n.attrs)), o;
      }
      function lh(e, t, n, r, o, i) {
        for (let l = 0; l < r.length; l++) ia(Xo(n, t), e, r[l].type);
        !(function cE(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          u = qr(e, t, r.length, null);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          (n.mergedAttrs = Rr(n.mergedAttrs, c.hostAttrs)),
            dE(e, n, t, u, c),
            lE(u, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                n.index
              ),
              (a = !0)),
            u++;
        }
        !(function eE(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let u = null,
            l = null;
          for (let c = t.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (u = sh(d.inputs, c, u, f ? f.inputs : null)),
              (l = sh(d.outputs, c, l, p));
            const g = null === u || null === s || jf(t) ? null : pE(u, c, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (t.flags |= 8),
            u.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = u),
            (t.outputs = l);
        })(e, n, i);
      }
      function ch(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function X_() {
            return P.lFrame.currentDirectiveIndex;
          })();
        try {
          pn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              l = t[a];
            Ks(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                sE(u, l);
          }
        } finally {
          pn(-1), Ks(s);
        }
      }
      function sE(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function au(e, t, n) {
        (t.componentOffset = n),
          (e.components || (e.components = [])).push(t.index);
      }
      function lE(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          ut(t) && (n[""] = e);
        }
      }
      function dE(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = hn(o.type)),
          s = new Or(i, ut(o), v);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function rE(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function oE(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, qr(e, n, o.hostVars, O), o);
      }
      function wt(e, t, n, r, o, i) {
        const s = Ke(e, t);
        !(function uu(e, t, n, r, o, i, s) {
          if (null == i) e.removeAttribute(t, o, n);
          else {
            const a = null == s ? F(i) : s(i, r || "", o);
            e.setAttribute(t, o, a, n);
          }
        })(t[L], s, i, e.value, n, r, o);
      }
      function hE(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function pE(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function dh(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null];
      }
      function yE(e, t) {
        const n = Ze(t, e);
        if (Uo(n)) {
          const r = n[1];
          48 & n[2] ? mi(r, n, r.template, n[8]) : n[5] > 0 && lu(n);
        }
      }
      function lu(e) {
        for (let r = Ca(e); null !== r; r = Ea(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (Uo(i))
              if (512 & i[2]) {
                const s = i[1];
                mi(s, i, s.template, i[8]);
              } else i[5] > 0 && lu(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = Ze(n[r], e);
            Uo(o) && o[5] > 0 && lu(o);
          }
      }
      function DE(e, t) {
        const n = Ze(t, e),
          r = n[1];
        (function _E(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          tu(r, n, n[8]);
      }
      function yi(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function cu(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = $r(e);
          if (N_(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Di(e, t, n, r = !0) {
        const o = t[10];
        o.begin && o.begin();
        try {
          mi(e, t, e.template, n);
        } catch (s) {
          throw (r && gh(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function du(e, t, n) {
        Xs(0), t(e, n);
      }
      function fh(e) {
        return e[7] || (e[7] = []);
      }
      function hh(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function gh(e, t) {
        const n = e[9],
          r = n ? n.get(Qn, null) : null;
        r && r.handleError(t);
      }
      function fu(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function _i(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Ts(o, a))
              : 2 == i && (r = Ts(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function vi(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(Ce(i)), at(i)))
            for (let a = 10; a < i.length; a++) {
              const u = i[a],
                l = u[1].firstChild;
              null !== l && vi(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) vi(e, t, n.child, r);
          else if (32 & s) {
            const a = va(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = lf(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = $r(t[16]);
              vi(u[1], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Kr {
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return vi(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (at(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Ma(t, r), Qo(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Jd(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function ih(e, t, n, r) {
            const o = fh(t);
            null === n
              ? o.push(r)
              : (o.push(n), e.firstCreatePass && hh(e).push(r, o.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          cu(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          Di(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function iC(e, t) {
              Ur(e, t, t[L], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class vE extends Kr {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          Di(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class mh extends fi {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = z(t);
          return new Zr(n, this.ngModule);
        }
      }
      function yh(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class EE {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = Ro(r);
          const o = this.injector.get(t, Wa, r);
          return o !== Wa || n === Wa ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Zr extends Rf {
        get inputs() {
          return yh(this.componentDef.inputs);
        }
        get outputs() {
          return yh(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function S0(e) {
              return e.map(I0).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof vn ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new EE(t, i) : t,
            a = s.get(Lf, null);
          if (null === a) throw new C(407, !1);
          const u = s.get(a0, null),
            l = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function Q0(e, t, n) {
                  return e.selectRootElement(t, n === _t.ShadowDom);
                })(l, r, this.componentDef.encapsulation)
              : ba(
                  l,
                  c,
                  (function CE(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = iu(0, null, null, 1, 0, null, null, null, null, null),
            p = gi(null, h, null, f, null, null, a, l, u, s, null);
          let g, _;
          Ys(p);
          try {
            const y = this.componentDef;
            let w,
              m = null;
            y.findHostDirectiveDefs
              ? ((w = []),
                (m = new Map()),
                y.findHostDirectiveDefs(y, w, m),
                w.push(y))
              : (w = [y]);
            const S = (function bE(e, t) {
                const n = e[1];
                return (e[22] = t), tr(n, 22, 2, "#host", null);
              })(p, d),
              X = (function ME(e, t, n, r, o, i, s, a) {
                const u = o[1];
                !(function IE(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Rr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (_i(t, t.mergedAttrs, !0), null !== n && ff(r, n, t));
                })(r, e, t, s);
                const l = i.createRenderer(t, n),
                  c = gi(
                    o,
                    oh(n),
                    null,
                    n.onPush ? 32 : 16,
                    o[e.index],
                    e,
                    i,
                    l,
                    a || null,
                    null,
                    null
                  );
                return (
                  u.firstCreatePass && au(u, e, r.length - 1),
                  yi(o, c),
                  (o[e.index] = c)
                );
              })(S, d, y, w, p, a, l);
            (_ = Jc(h, 22)),
              d &&
                (function AE(e, t, n, r) {
                  if (r) ta(e, n, ["ng-version", u0.full]);
                  else {
                    const { attrs: o, classes: i } = (function A0(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!ct(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && ta(e, n, o),
                      i && i.length > 0 && df(e, n, i.join(" "));
                  }
                })(l, y, d, r),
              void 0 !== n &&
                (function TE(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(_, this.ngContentSelectors, n),
              (g = (function SE(e, t, n, r, o, i) {
                const s = Ee(),
                  a = o[1],
                  u = Ke(s, o);
                lh(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Ae(gn(o, a, s.directiveStart + c, s), o);
                ch(a, o, s), u && Ae(u, o);
                const l = gn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[8] = o[8] = l), null !== i)) for (const c of i) c(l, t);
                return nu(a, s, e), l;
              })(X, y, w, m, p, [NE])),
              tu(h, p, null);
          } finally {
            Qs();
          }
          return new wE(this.componentType, g, Yn(_, p), p, _);
        }
      }
      class wE extends e0 {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new vE(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            fu(i[1], i, o, t, n), uh(i, this._tNode.index);
          }
        }
        get injector() {
          return new $n(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function NE() {
        const e = Ee();
        Go(D()[1], e);
      }
      function q(e) {
        let t = (function Dh(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (ut(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = hu(e.inputs)),
                (s.declaredInputs = hu(e.declaredInputs)),
                (s.outputs = hu(e.outputs));
              const a = o.hostBindings;
              a && OE(e, a);
              const u = o.viewQuery,
                l = o.contentQueries;
              if (
                (u && xE(e, u),
                l && PE(e, l),
                As(e.inputs, o.inputs),
                As(e.declaredInputs, o.declaredInputs),
                As(e.outputs, o.outputs),
                ut(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === q && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function FE(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Rr(o.hostAttrs, (n = Rr(n, o.hostAttrs))));
          }
        })(r);
      }
      function hu(e) {
        return e === xt ? {} : e === $ ? [] : e;
      }
      function xE(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function PE(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function OE(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      let Ci = null;
      function En() {
        if (!Ci) {
          const e = J.Symbol;
          if (e && e.iterator) Ci = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (Ci = r);
            }
          }
        }
        return Ci;
      }
      function Ei(e) {
        return (
          !!pu(e) && (Array.isArray(e) || (!(e instanceof Map) && En() in e))
        );
      }
      function pu(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function Te(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function $t(e, t, n, r) {
        const o = D();
        return Te(o, Hn(), t) && (H(), wt(oe(), o, e, t, n, r)), $t;
      }
      function rr(e, t, n, r) {
        return Te(e, Hn(), n) ? t + F(n) + r : O;
      }
      function gu(e) {
        return (function Bn(e, t) {
          return e[t];
        })(
          (function q_() {
            return P.lFrame.contextLView;
          })(),
          22 + e
        );
      }
      function bn(e, t, n) {
        const r = D();
        return Te(r, Hn(), t) && Ye(H(), oe(), r, e, t, r[L], n, !1), bn;
      }
      function mu(e, t, n, r, o) {
        const s = o ? "class" : "style";
        fu(e, n, t.inputs[s], s, r);
      }
      function W(e, t, n, r) {
        const o = D(),
          i = H(),
          s = 22 + e,
          a = o[L],
          u = (o[s] = ba(
            a,
            t,
            (function ov() {
              return P.lFrame.currentNamespace;
            })()
          )),
          l = i.firstCreatePass
            ? (function WE(e, t, n, r, o, i, s) {
                const a = t.consts,
                  l = tr(t, e, 2, o, Yt(a, i));
                return (
                  su(t, n, l, Yt(a, s)),
                  null !== l.attrs && _i(l, l.attrs, !1),
                  null !== l.mergedAttrs && _i(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        return (
          Ct(l, !0),
          ff(a, u, l),
          32 != (32 & l.flags) && ii(i, o, u, l),
          0 ===
            (function $_() {
              return P.lFrame.elementDepthCount;
            })() && Ae(u, o),
          (function U_() {
            P.lFrame.elementDepthCount++;
          })(),
          jo(l) && (ru(i, o, l), nu(i, l, o)),
          null !== r && ou(o, l),
          W
        );
      }
      function Z() {
        let e = Ee();
        Ws()
          ? (function qs() {
              P.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Ct(e, !1));
        const t = e;
        !(function G_() {
          P.lFrame.elementDepthCount--;
        })();
        const n = H();
        return (
          n.firstCreatePass && (Go(n, e), js(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function uv(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            mu(n, t, D(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function lv(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            mu(n, t, D(), t.stylesWithoutHost, !1),
          Z
        );
      }
      function Mt(e, t, n, r) {
        return W(e, t, n, r), Z(), Mt;
      }
      function _u() {
        return D();
      }
      function bi(e) {
        return !!e && "function" == typeof e.then;
      }
      const Oh = function Ph(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Le(e, t, n, r) {
        const o = D(),
          i = H(),
          s = Ee();
        return (
          (function kh(e, t, n, r, o, i, s) {
            const a = jo(r),
              l = e.firstCreatePass && hh(e),
              c = t[8],
              d = fh(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = Ke(r, t),
                _ = s ? s(g) : g,
                y = d.length,
                w = s ? (S) => s(Ce(S[r.index])) : r.index;
              let m = null;
              if (
                (!s &&
                  a &&
                  (m = (function KE(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[7],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== m)
              )
                ((m.__ngLastListenerFn__ || m).__ngNextListenerFn__ = i),
                  (m.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Vh(r, t, c, i, !1);
                const S = n.listen(_, o, i);
                d.push(i, S), l && l.push(o, w, y, y + 1);
              }
            } else i = Vh(r, t, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let _ = 0; _ < g; _ += 2) {
                  const X = t[p[_]][p[_ + 1]].subscribe(i),
                    de = d.length;
                  d.push(i, X), l && l.push(o, r.index, de, -(de + 1));
                }
            }
          })(i, o, o[L], s, e, t, r),
          Le
        );
      }
      function Lh(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return gh(e, o), !1;
        }
      }
      function Vh(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          cu(e.componentOffset > -1 ? Ze(e.index, t) : t);
          let u = Lh(t, 0, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = Lh(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function Bh(e = 1) {
        return (function Q_(e) {
          return (P.lFrame.contextLView = (function J_(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, P.lFrame.contextLView))[8];
        })(e);
      }
      function vu(e, t, n) {
        return Cu(e, "", t, "", n), vu;
      }
      function Cu(e, t, n, r, o) {
        const i = D(),
          s = rr(i, t, n, r);
        return s !== O && Ye(H(), oe(), i, e, s, i[L], o, !1), Cu;
      }
      function Mi(e, t) {
        return (e << 17) | (t << 2);
      }
      function en(e) {
        return (e >> 17) & 32767;
      }
      function Eu(e) {
        return 2 | e;
      }
      function Mn(e) {
        return (131068 & e) >> 2;
      }
      function wu(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function bu(e) {
        return 1 | e;
      }
      function Kh(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? en(i) : Mn(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          rw(e[a], t) && ((u = !0), (e[a + 1] = r ? bu(c) : Eu(c))),
            (a = r ? en(c) : Mn(c));
        }
        u && (e[n + 1] = r ? Eu(i) : bu(i));
      }
      function rw(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && qn(e, t) >= 0)
        );
      }
      function Ii(e, t) {
        return (
          (function ft(e, t, n, r) {
            const o = D(),
              i = H(),
              s = (function Vt(e) {
                const t = P.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function rp(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[ke()],
                    s = (function np(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function ap(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function fw(e, t, n, r) {
                      const o = (function Zs(e) {
                        const t = P.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = Yr((n = Mu(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = Mu(o, e, t, n, r)), null === i)) {
                            let u = (function hw(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== Mn(r)) return e[en(r)];
                            })(e, t, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = Mu(null, e, t, u[1], r)),
                              (u = Yr(u, t.attrs, r)),
                              (function pw(e, t, n, r) {
                                e[en(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, u));
                          } else
                            i = (function gw(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = Yr(r, e[i].hostAttrs, n);
                              return Yr(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function tw(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = en(s),
                        u = Mn(s);
                      e[r] = n;
                      let c,
                        l = !1;
                      if (
                        (Array.isArray(n)
                          ? ((c = n[1]),
                            (null === c || qn(n, c) > 0) && (l = !0))
                          : (c = n),
                        o)
                      )
                        if (0 !== u) {
                          const f = en(e[a + 1]);
                          (e[r + 1] = Mi(f, a)),
                            0 !== f && (e[f + 1] = wu(e[f + 1], r)),
                            (e[a + 1] = (function JE(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = Mi(a, 0)),
                            0 !== a && (e[a + 1] = wu(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = Mi(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = wu(e[u + 1], r)),
                          (u = r);
                      l && (e[r + 1] = Eu(e[r + 1])),
                        Kh(e, c, r, !0),
                        Kh(e, c, r, !1),
                        (function nw(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            qn(i, t) >= 0 &&
                            (n[r + 1] = bu(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = Mi(a, u)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== O &&
                Te(o, s, t) &&
                (function ip(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const u = e.data,
                    l = u[a + 1],
                    c = (function ew(e) {
                      return 1 == (1 & e);
                    })(l)
                      ? sp(u, t, n, o, Mn(l), s)
                      : void 0;
                  Si(c) ||
                    (Si(i) ||
                      ((function QE(e) {
                        return 2 == (2 & e);
                      })(l) &&
                        (i = sp(u, null, n, o, a, s))),
                    (function gC(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : $e.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= $e.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, $o(ke(), n), o, i));
                })(
                  i,
                  i.data[ke()],
                  o,
                  o[L],
                  e,
                  (o[s + 1] = (function Dw(e, t) {
                    return (
                      null == e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e && (e = Y(Qt(e)))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          Ii
        );
      }
      function Mu(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = Yr(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Yr(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Xe(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function sp(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[o + 1];
          f === O && (f = d ? $ : void 0);
          let h = d ? ca(f, r) : c === r ? f : void 0;
          if ((l && !Si(h) && (h = ca(u, r)), Si(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? en(p) : Mn(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = ca(u, r));
        }
        return a;
      }
      function Si(e) {
        return void 0 !== e;
      }
      function he(e, t = "") {
        const n = D(),
          r = H(),
          o = e + 22,
          i = r.firstCreatePass ? tr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function wa(e, t) {
            return e.createText(t);
          })(n[L], t));
        ii(r, n, s, i), Ct(i, !1);
      }
      function Qr(e) {
        return Ai("", e, ""), Qr;
      }
      function Ai(e, t, n) {
        const r = D(),
          o = rr(r, e, t, n);
        return (
          o !== O &&
            (function jt(e, t, n) {
              const r = $o(t, e);
              !(function Yd(e, t, n) {
                e.setValue(t, n);
              })(e[L], r, n);
            })(r, ke(), o),
          Ai
        );
      }
      const hr = "en-US";
      let Tp = hr;
      function Au(e, t, n, r, o) {
        if (((e = A(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) Au(e[i], t, n, r, o);
        else {
          const i = H(),
            s = D();
          let a = _n(e) ? e : A(e.provide),
            u = Of(e);
          const l = Ee(),
            c = 1048575 & l.providerIndexes,
            d = l.directiveStart,
            f = l.providerIndexes >> 20;
          if (_n(e) || !e.multi) {
            const h = new Or(u, o, v),
              p = Nu(a, t, o ? c : c + f, d);
            -1 === p
              ? (ia(Xo(l, s), i, a),
                Tu(i, e, t.length),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = Nu(a, t, c + f, d),
              p = Nu(a, t, c, c + f),
              _ = p >= 0 && n[p];
            if ((o && !_) || (!o && !(h >= 0 && n[h]))) {
              ia(Xo(l, s), i, a);
              const y = (function kb(e, t, n, r, o) {
                const i = new Or(e, n, v);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  eg(i, o, r && !n),
                  i
                );
              })(o ? Rb : Ob, n.length, o, r, u);
              !o && _ && (n[p].providerFactory = y),
                Tu(i, e, t.length, 0),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(y),
                s.push(y);
            } else Tu(i, e, h > -1 ? h : p, eg(n[o ? p : h], u, !o && r));
            !o && r && _ && n[p].componentProviders++;
          }
        }
      }
      function Tu(e, t, n, r) {
        const o = _n(t),
          i = (function qC(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const u = (i ? A(t.useClass) : t).prototype.ngOnDestroy;
          if (u) {
            const l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = l.indexOf(n);
              -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
            } else l.push(n, u);
          }
        }
      }
      function eg(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function Nu(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function Ob(e, t, n, r) {
        return Fu(this.multi, []);
      }
      function Rb(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = gn(n, n[1], this.providerFactory.index, r);
          (i = a.slice(0, s)), Fu(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), Fu(o, i);
        return i;
      }
      function Fu(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function re(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function Pb(e, t, n) {
              const r = H();
              if (r.firstCreatePass) {
                const o = ut(e);
                Au(n, r.data, r.blueprint, o, !0),
                  Au(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class pr {}
      class Lb {}
      class tg extends pr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new mh(this));
          const r = (function We(e, t) {
            const n = e[Bc] || null;
            if (!n && !0 === t)
              throw new Error(
                `Type ${Y(e)} does not have '\u0275mod' property.`
              );
            return n;
          })(t);
          (this._bootstrapComponents = (function Ht(e) {
            return e instanceof Function ? e() : e;
          })(r.bootstrap)),
            (this._r3Injector = Zf(
              t,
              n,
              [
                { provide: pr, useValue: this },
                { provide: fi, useValue: this.componentFactoryResolver },
              ],
              Y(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class xu extends Lb {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new tg(this.moduleType, t);
        }
      }
      function Ou(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const Ne = class hM extends ws {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = Ou(i)), o && (o = Ou(o)), s && (s = Ou(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof yt && t.add(a), a;
        }
      };
      let Ut = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = yM), e;
      })();
      const gM = Ut,
        mM = class extends gM {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              o = gi(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            o[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (o[19] = s.createEmbeddedView(r)),
              tu(r, o, t),
              new Kr(o)
            );
          }
        };
      function yM() {
        return (function Pi(e, t) {
          return 4 & e.type ? new mM(t, e, Yn(e, t)) : null;
        })(Ee(), D());
      }
      let At = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = DM), e;
      })();
      function DM() {
        return (function mg(e, t) {
          let n;
          const r = t[e.index];
          if (at(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = Ce(r);
            else {
              const i = t[L];
              o = i.createComment("");
              const s = Ke(e, t);
              yn(
                i,
                oi(i, s),
                o,
                (function fC(e, t) {
                  return e.nextSibling(t);
                })(i, s),
                !1
              );
            }
            (t[e.index] = n = dh(r, t, o, e)), yi(t, n);
          }
          return new pg(n, e, t);
        })(Ee(), D());
      }
      const _M = At,
        pg = class extends _M {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Yn(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new $n(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = oa(this._hostTNode, this._hostLView);
            if (yd(t)) {
              const n = Ko(t, this._hostLView),
                r = qo(t);
              return new $n(n[1].data[r + 8], n);
            }
            return new $n(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = gg(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Lr(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new Zr(z(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(vn, null);
              f && (i = f);
            }
            const c = u.create(l, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function j_(e) {
                return at(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new pg(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function aC(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), Td(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function uC(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(o, r, s, i);
            const a = Aa(i, s),
              u = r[L],
              l = oi(u, s[7]);
            return (
              null !== l &&
                (function oC(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), Ur(e, r, n, 1, o, i);
                })(o, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              Td(ku(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = gg(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = Ma(this._lContainer, n);
            r && (Qo(ku(this._lContainer), n), Jd(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = Ma(this._lContainer, n);
            return r && null != Qo(ku(this._lContainer), n) ? new Kr(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function gg(e) {
        return e[8];
      }
      function ku(e) {
        return e[8] || (e[8] = []);
      }
      function Ri(...e) {}
      const Hg = new M("Application Initializer");
      let ki = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Ri),
              (this.reject = Ri),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (bi(i)) n.push(i);
                else if (Oh(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Hg, 8));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ao = new M("AppId", {
        providedIn: "root",
        factory: function jg() {
          return `${Wu()}${Wu()}${Wu()}`;
        },
      });
      function Wu() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const $g = new M("Platform Initializer"),
        qu = new M("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        XM = new M("appBootstrapListener"),
        Gt = new M("LocaleId", {
          providedIn: "root",
          factory: () =>
            On(Gt, N.Optional | N.SkipSelf) ||
            (function YM() {
              return (typeof $localize < "u" && $localize.locale) || hr;
            })(),
        }),
        nI = (() => Promise.resolve(0))();
      function Ku(e) {
        typeof Zone > "u"
          ? nI.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class Fe {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Ne(!1)),
            (this.onMicrotaskEmpty = new Ne(!1)),
            (this.onStable = new Ne(!1)),
            (this.onError = new Ne(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function rI() {
              let e = J.requestAnimationFrame,
                t = J.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function sI(e) {
              const t = () => {
                !(function iI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(J, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Xu(e),
                                (e.isCheckStableRunning = !0),
                                Zu(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Xu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return zg(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      Wg(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return zg(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), Wg(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Xu(e),
                          Zu(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Fe.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (Fe.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, oI, Ri, Ri);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const oI = {};
      function Zu(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Xu(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function zg(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Wg(e) {
        e._nesting--, Zu(e);
      }
      class aI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Ne()),
            (this.onMicrotaskEmpty = new Ne()),
            (this.onStable = new Ne()),
            (this.onError = new Ne());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const qg = new M(""),
        Li = new M("");
      let Ju,
        Yu = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Ju ||
                  ((function uI(e) {
                    Ju = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Fe.assertNotInAngularZone(),
                        Ku(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Ku(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(V(Fe), V(Qu), V(Li));
            }),
            (e.ɵprov = j({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Qu = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Ju?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = j({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        tn = null;
      const Kg = new M("AllowMultipleToken"),
        el = new M("PlatformDestroyListeners");
      function Xg(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new M(r);
        return (i = []) => {
          let s = tl();
          if (!s || s.injector.get(Kg, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function dI(e) {
                  if (tn && !tn.get(Kg, !1)) throw new C(400, !1);
                  tn = e;
                  const t = e.get(Qg);
                  (function Zg(e) {
                    const t = e.get($g, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function Yg(e = [], t) {
                    return Jt.create({
                      name: t,
                      providers: [
                        { provide: $a, useValue: "platform" },
                        { provide: el, useValue: new Set([() => (tn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function hI(e) {
            const t = tl();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function tl() {
        return tn?.get(Qg) ?? null;
      }
      let Qg = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function em(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new aI()
                      : ("zone.js" === e ? void 0 : e) || new Fe(t)),
                  n
                );
              })(
                r?.ngZone,
                (function Jg(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: Fe, useValue: o }];
            return o.run(() => {
              const s = Jt.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(Qn, null);
              if (!u) throw new C(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const l = o.onError.subscribe({
                    next: (c) => {
                      u.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    Vi(this._modules, a), l.unsubscribe();
                  });
                }),
                (function tm(e, t, n) {
                  try {
                    const r = n();
                    return bi(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const l = a.injector.get(ki);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function Np(e) {
                          Qe(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Tp = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(Gt, hr) || hr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = nm({}, r);
            return (function lI(e, t, n) {
              const r = new xu(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(nl);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(el, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Jt));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function nm(e, t) {
        return Array.isArray(t) ? t.reduce(nm, e) : { ...e, ...t };
      }
      let nl = (() => {
        class e {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new we((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new we((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    Fe.assertNotInAngularZone(),
                      Ku(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const l = this._zone.onUnstable.subscribe(() => {
                  Fe.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), l.unsubscribe();
                };
              });
            this.isStable = (function u_(...e) {
              const t = Ac(e),
                n = (function t_(e, t) {
                  return "number" == typeof Ms(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? Ft(r[0])
                  : (function YD(e = 1 / 0) {
                      return To(cc, e);
                    })(n)(Is(r, t))
                : Sc;
            })(
              i,
              s.pipe(
                (function l_(e = {}) {
                  const {
                    connector: t = () => new ws(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return Fn((g, _) => {
                      l++, !d && !c && f();
                      const y = (u = u ?? t());
                      _.add(() => {
                        l--, 0 === l && !d && !c && (a = Ss(p, o));
                      }),
                        y.subscribe(_),
                        !s &&
                          l > 0 &&
                          ((s = new wr({
                            next: (w) => y.next(w),
                            error: (w) => {
                              (d = !0), f(), (a = Ss(h, n, w)), y.error(w);
                            },
                            complete: () => {
                              (c = !0), f(), (a = Ss(h, r)), y.complete();
                            },
                          })),
                          Ft(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            const o = n instanceof Rf;
            if (!this._injector.get(ki).done)
              throw (
                (!o &&
                  (function Ar(e) {
                    const t = z(e) || be(e) || Pe(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, false))
              );
            let s;
            (s = o ? n : this._injector.get(fi).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function cI(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(pr),
              l = s.create(Jt.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(qg, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  Vi(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Vi(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(XM, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Vi(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Fe), V(vn), V(Qn));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Vi(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      class um {
        constructor() {}
        supports(t) {
          return Ei(t);
        }
        create(t) {
          return new EI(t);
        }
      }
      const CI = (e, t) => t;
      class EI {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || CI);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < cm(r, o, i)) ? n : r,
              a = cm(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const l = a - o,
                c = u - o;
              if (l != c) {
                for (let f = 0; f < l; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < l && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - l;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Ei(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function jE(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[En()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new wI(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new lm()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new lm()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class wI {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class bI {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class lm {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new bI()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function cm(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      class dm {
        constructor() {}
        supports(t) {
          return t instanceof Map || pu(t);
        }
        create() {
          return new MI();
        }
      }
      class MI {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || pu(t))) throw new C(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, o) => {
              if (n && n.key === o)
                this._maybeAddToChanges(n, r),
                  (this._appendAfter = n),
                  (n = n._next);
              else {
                const i = this._getOrCreateRecordForKey(o, r);
                n = this._insertBeforeOrAppend(n, i);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (
              (n._next = t),
              (n._prev = r),
              (t._prev = n),
              r && (r._next = n),
              t === this._mapHead && (this._mapHead = n),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
              : (this._mapHead = n),
            (this._appendAfter = n),
            null
          );
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const o = this._records.get(t);
            this._maybeAddToChanges(o, n);
            const i = o._prev,
              s = o._next;
            return (
              i && (i._next = s),
              s && (s._prev = i),
              (o._next = null),
              (o._prev = null),
              o
            );
          }
          const r = new II(t);
          return (
            this._records.set(t, r),
            (r.currentValue = n),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = n),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map
            ? t.forEach(n)
            : Object.keys(t).forEach((r) => n(t[r], r));
        }
      }
      class II {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function fm() {
        return new ji([new um()]);
      }
      let ji = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || fm()),
              deps: [[e, new ti(), new ei()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new C(901, !1);
          }
        }
        return (e.ɵprov = j({ token: e, providedIn: "root", factory: fm })), e;
      })();
      function hm() {
        return new uo([new dm()]);
      }
      let uo = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || hm()),
              deps: [[e, new ti(), new ei()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (r) return r;
            throw new C(901, !1);
          }
        }
        return (e.ɵprov = j({ token: e, providedIn: "root", factory: hm })), e;
      })();
      const TI = Xg(null, "core", []);
      let NI = (() => {
        class e {
          constructor(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(nl));
          }),
          (e.ɵmod = Ot({ type: e })),
          (e.ɵinj = Dt({})),
          e
        );
      })();
      function al(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let ul = null;
      function An() {
        return ul;
      }
      class PI {}
      const Tt = new M("DocumentToken");
      function wm(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === t) return decodeURIComponent(i);
        }
        return null;
      }
      class vS {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let Sm = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new vS(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Am(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Am(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(At), v(Ut), v(ji));
          }),
          (e.ɵdir = x({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function Am(e, t) {
        e.context.$implicit = t.item;
      }
      let Fm = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngEl = n),
                (this._differs = r),
                (this._renderer = o),
                (this._ngStyle = null),
                (this._differ = null);
            }
            set ngStyle(n) {
              (this._ngStyle = n),
                !this._differ &&
                  n &&
                  (this._differ = this._differs.find(n).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const n = this._differ.diff(this._ngStyle);
                n && this._applyChanges(n);
              }
            }
            _setStyle(n, r) {
              const [o, i] = n.split("."),
                s = -1 === o.indexOf("-") ? void 0 : $e.DashCase;
              null != r
                ? this._renderer.setStyle(
                    this._ngEl.nativeElement,
                    o,
                    i ? `${r}${i}` : r,
                    s
                  )
                : this._renderer.removeStyle(this._ngEl.nativeElement, o, s);
            }
            _applyChanges(n) {
              n.forEachRemovedItem((r) => this._setStyle(r.key, null)),
                n.forEachAddedItem((r) =>
                  this._setStyle(r.key, r.currentValue)
                ),
                n.forEachChangedItem((r) =>
                  this._setStyle(r.key, r.currentValue)
                );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(lt), v(uo), v(Cn));
            }),
            (e.ɵdir = x({
              type: e,
              selectors: [["", "ngStyle", ""]],
              inputs: { ngStyle: "ngStyle" },
              standalone: !0,
            })),
            e
          );
        })(),
        ZS = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ot({ type: e })),
            (e.ɵinj = Dt({})),
            e
          );
        })();
      class Rm {}
      class IA extends PI {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Il extends IA {
        static makeCurrent() {
          !(function xI(e) {
            ul || (ul = e);
          })(new Il());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function SA() {
            return (
              (ho = ho || document.querySelector("base")),
              ho ? ho.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function AA(e) {
                (Qi = Qi || document.createElement("a")),
                  Qi.setAttribute("href", e);
                const t = Qi.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          ho = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return wm(document.cookie, t);
        }
      }
      let Qi,
        ho = null;
      const Hm = new M("TRANSITION_ID"),
        NA = [
          {
            provide: Hg,
            useFactory: function TA(e, t, n) {
              return () => {
                n.get(ki).donePromise.then(() => {
                  const r = An(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Hm, Tt, Jt],
            multi: !0,
          },
        ];
      let xA = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Ji = new M("EventManagerPlugins");
      let es = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Ji), V(Fe));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class jm {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = An().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let $m = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = j({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        po = (() => {
          class e extends $m {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(Um), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(Um));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(V(Tt));
            }),
            (e.ɵprov = j({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function Um(e) {
        An().remove(e);
      }
      const Sl = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Al = /%COMP%/g;
      function Tl(e, t) {
        return t.flat(100).map((n) => n.replace(Al, e));
      }
      function Wm(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let Nl = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Fl(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case _t.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new VA(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case _t.ShadowDom:
                return new BA(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = Tl(r.id, r.styles);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(es), V(po), V(ao));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Fl {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(Sl[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (Km(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Km(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Sl[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = Sl[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & ($e.DashCase | $e.Important)
            ? t.style.setProperty(n, r, o & $e.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & $e.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Wm(r))
            : this.eventManager.addEventListener(t, n, Wm(r));
        }
      }
      function Km(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class VA extends Fl {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = Tl(o + "-" + r.id, r.styles);
          n.addStyles(i),
            (this.contentAttr = (function RA(e) {
              return "_ngcontent-%COMP%".replace(Al, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function kA(e) {
              return "_nghost-%COMP%".replace(Al, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class BA extends Fl {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = Tl(o.id, o.styles);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let HA = (() => {
        class e extends jm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Tt));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Zm = ["alt", "control", "meta", "shift"],
        jA = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        $A = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let UA = (() => {
        class e extends jm {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => An().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Zm.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = jA[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                Zm.forEach((s) => {
                  s !== o && (0, $A[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Tt));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const qA = Xg(TI, "browser", [
          { provide: qu, useValue: "browser" },
          {
            provide: $g,
            useValue: function GA() {
              Il.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Tt,
            useFactory: function WA() {
              return (
                (function vC(e) {
                  xa = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Qm = new M(""),
        Jm = [
          {
            provide: Li,
            useClass: class FA {
              addToWindow(t) {
                (J.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (J.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (J.getAllAngularRootElements = () => t.getAllRootElements()),
                  J.frameworkStabilizers || (J.frameworkStabilizers = []),
                  J.frameworkStabilizers.push((r) => {
                    const o = J.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? An().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: qg, useClass: Yu, deps: [Fe, Qu, Li] },
          { provide: Yu, useClass: Yu, deps: [Fe, Qu, Li] },
        ],
        ey = [
          { provide: $a, useValue: "root" },
          {
            provide: Qn,
            useFactory: function zA() {
              return new Qn();
            },
            deps: [],
          },
          { provide: Ji, useClass: HA, multi: !0, deps: [Tt, Fe, qu] },
          { provide: Ji, useClass: UA, multi: !0, deps: [Tt] },
          { provide: Nl, useClass: Nl, deps: [es, po, ao] },
          { provide: Lf, useExisting: Nl },
          { provide: $m, useExisting: po },
          { provide: po, useClass: po, deps: [Tt] },
          { provide: es, useClass: es, deps: [Ji, Fe] },
          { provide: Rm, useClass: xA, deps: [] },
          [],
        ];
      let KA = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: ao, useValue: n.appId },
                { provide: Hm, useExisting: ao },
                NA,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Qm, 12));
          }),
          (e.ɵmod = Ot({ type: e })),
          (e.ɵinj = Dt({ providers: [...ey, ...Jm], imports: [ZS, NI] })),
          e
        );
      })();
      typeof window < "u" && window;
      const { isArray: oT } = Array,
        { getPrototypeOf: iT, prototype: sT, keys: aT } = Object;
      const { isArray: cT } = Array;
      function hT(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function pT(...e) {
        const t = (function e_(e) {
            return ne(Ms(e)) ? e.pop() : void 0;
          })(e),
          { args: n, keys: r } = (function uT(e) {
            if (1 === e.length) {
              const t = e[0];
              if (oT(t)) return { args: t, keys: null };
              if (
                (function lT(e) {
                  return e && "object" == typeof e && iT(e) === sT;
                })(t)
              ) {
                const n = aT(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e),
          o = new we((i) => {
            const { length: s } = n;
            if (!s) return void i.complete();
            const a = new Array(s);
            let u = s,
              l = s;
            for (let c = 0; c < s; c++) {
              let d = !1;
              Ft(n[c]).subscribe(
                xn(
                  i,
                  (f) => {
                    d || ((d = !0), l--), (a[c] = f);
                  },
                  () => u--,
                  void 0,
                  () => {
                    (!u || !d) && (l || i.next(r ? hT(r, a) : a), i.complete());
                  }
                )
              );
            }
          });
        return t
          ? o.pipe(
              (function fT(e) {
                return cn((t) =>
                  (function dT(e, t) {
                    return cT(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(t)
            )
          : o;
      }
      let ry = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(Cn), v(lt));
            }),
            (e.ɵdir = x({ type: e })),
            e
          );
        })(),
        Tn = (() => {
          class e extends ry {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Se(e)))(r || e);
              };
            })()),
            (e.ɵdir = x({ type: e, features: [q] })),
            e
          );
        })();
      const Nt = new M("NgValueAccessor"),
        mT = { provide: Nt, useExisting: Q(() => ts), multi: !0 },
        DT = new M("CompositionEventMode");
      let ts = (() => {
        class e extends ry {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function yT() {
                  const e = An() ? An().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(Cn), v(lt), v(DT, 8));
          }),
          (e.ɵdir = x({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Le("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [re([mT]), q],
          })),
          e
        );
      })();
      function rn(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function iy(e) {
        return null != e && "number" == typeof e.length;
      }
      const xe = new M("NgValidators"),
        on = new M("NgAsyncValidators"),
        vT =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class Ol {
        static min(t) {
          return (function sy(e) {
            return (t) => {
              if (rn(t.value) || rn(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n < e
                ? { min: { min: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static max(t) {
          return (function ay(e) {
            return (t) => {
              if (rn(t.value) || rn(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n > e
                ? { max: { max: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return uy(t);
        }
        static requiredTrue(t) {
          return (function ly(e) {
            return !0 === e.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function cy(e) {
            return rn(e.value) || vT.test(e.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function dy(e) {
            return (t) =>
              rn(t.value) || !iy(t.value)
                ? null
                : t.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function fy(e) {
            return (t) =>
              iy(t.value) && t.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function hy(e) {
            if (!e) return ns;
            let t, n;
            return (
              "string" == typeof e
                ? ((n = ""),
                  "^" !== e.charAt(0) && (n += "^"),
                  (n += e),
                  "$" !== e.charAt(e.length - 1) && (n += "$"),
                  (t = new RegExp(n)))
                : ((n = e.toString()), (t = e)),
              (r) => {
                if (rn(r.value)) return null;
                const o = r.value;
                return t.test(o)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: o } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return _y(t);
        }
        static composeAsync(t) {
          return vy(t);
        }
      }
      function uy(e) {
        return rn(e.value) ? { required: !0 } : null;
      }
      function ns(e) {
        return null;
      }
      function py(e) {
        return null != e;
      }
      function gy(e) {
        return bi(e) ? Is(e) : e;
      }
      function my(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function yy(e, t) {
        return t.map((n) => n(e));
      }
      function Dy(e) {
        return e.map((t) =>
          (function CT(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function _y(e) {
        if (!e) return null;
        const t = e.filter(py);
        return 0 == t.length
          ? null
          : function (n) {
              return my(yy(n, t));
            };
      }
      function Rl(e) {
        return null != e ? _y(Dy(e)) : null;
      }
      function vy(e) {
        if (!e) return null;
        const t = e.filter(py);
        return 0 == t.length
          ? null
          : function (n) {
              return pT(yy(n, t).map(gy)).pipe(cn(my));
            };
      }
      function kl(e) {
        return null != e ? vy(Dy(e)) : null;
      }
      function Cy(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function Ey(e) {
        return e._rawValidators;
      }
      function wy(e) {
        return e._rawAsyncValidators;
      }
      function Ll(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function rs(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function by(e, t) {
        const n = Ll(t);
        return (
          Ll(e).forEach((o) => {
            rs(n, o) || n.push(o);
          }),
          n
        );
      }
      function My(e, t) {
        return Ll(t).filter((n) => !rs(e, n));
      }
      class Iy {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = Rl(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = kl(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class He extends Iy {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class sn extends Iy {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Sy {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let Ay = (() => {
          class e extends Sy {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(sn, 2));
            }),
            (e.ɵdir = x({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  Ii("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [q],
            })),
            e
          );
        })(),
        Ty = (() => {
          class e extends Sy {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(v(He, 10));
            }),
            (e.ɵdir = x({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  Ii("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [q],
            })),
            e
          );
        })();
      const go = "VALID",
        is = "INVALID",
        yr = "PENDING",
        mo = "DISABLED";
      function jl(e) {
        return (ss(e) ? e.validators : e) || null;
      }
      function $l(e, t) {
        return (ss(t) ? t.asyncValidators : e) || null;
      }
      function ss(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      function Fy(e, t, n) {
        const r = e.controls;
        if (!(t ? Object.keys(r) : r).length) throw new C(1e3, "");
        if (!r[n]) throw new C(1001, "");
      }
      function xy(e, t, n) {
        e._forEachChild((r, o) => {
          if (void 0 === n[o]) throw new C(1002, "");
        });
      }
      class as {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === go;
        }
        get invalid() {
          return this.status === is;
        }
        get pending() {
          return this.status == yr;
        }
        get disabled() {
          return this.status === mo;
        }
        get enabled() {
          return this.status !== mo;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(by(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(by(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(My(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(My(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return rs(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return rs(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = yr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = mo),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = go),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === go || this.status === yr) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? mo : go;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = yr), (this._hasOwnPendingAsyncValidator = !0);
            const n = gy(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new Ne()), (this.statusChanges = new Ne());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? mo
            : this.errors
            ? is
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(yr)
            ? yr
            : this._anyControlsHaveStatus(is)
            ? is
            : go;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          ss(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function AT(e) {
              return Array.isArray(e) ? Rl(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function TT(e) {
              return Array.isArray(e) ? kl(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class yo extends as {
        constructor(t, n, r) {
          super(jl(n), $l(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          xy(this, 0, t),
            Object.keys(t).forEach((r) => {
              Fy(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((t[r] = n.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      class Py extends yo {}
      const Dr = new M("CallSetDisabledState", {
          providedIn: "root",
          factory: () => us,
        }),
        us = "always";
      function Do(e, t, n = us) {
        Ul(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === n) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function FT(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && Oy(e, t);
            });
          })(e, t),
          (function PT(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function xT(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && Oy(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function NT(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function cs(e, t, n = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          fs(e, t),
          e &&
            (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function ds(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Ul(e, t) {
        const n = Ey(e);
        null !== t.validator
          ? e.setValidators(Cy(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = wy(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(Cy(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        ds(t._rawValidators, o), ds(t._rawAsyncValidators, o);
      }
      function fs(e, t) {
        let n = !1;
        if (null !== e) {
          if (null !== t.validator) {
            const o = Ey(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== t.validator);
              i.length !== o.length && ((n = !0), e.setValidators(i));
            }
          }
          if (null !== t.asyncValidator) {
            const o = wy(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== t.asyncValidator);
              i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
            }
          }
        }
        const r = () => {};
        return ds(t._rawValidators, r), ds(t._rawAsyncValidators, r), n;
      }
      function Oy(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function Ly(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function Vy(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const vo = class extends as {
        constructor(t = null, n, r) {
          super(jl(n), $l(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            ss(n) &&
              (n.nonNullable || n.initialValueIsDefault) &&
              (this.defaultValue = Vy(t) ? t.value : t);
        }
        setValue(t, n = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          this.setValue(t, n);
        }
        reset(t = this.defaultValue, n = {}) {
          this._applyFormState(t),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          Ly(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          Ly(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          Vy(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      };
      let Uy = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = x({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })(),
        zy = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ot({ type: e })),
            (e.ɵinj = Dt({})),
            e
          );
        })();
      const Kl = new M("NgModelWithFormControlWarning"),
        qT = { provide: He, useExisting: Q(() => hs) };
      let hs = (() => {
        class e extends He {
          constructor(n, r, o) {
            super(),
              (this.callSetDisabledState = o),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new Ne()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (fs(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              Do(r, n, this.callSetDisabledState),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            cs(n.control || null, n, !1),
              (function LT(e, t) {
                const n = e.indexOf(t);
                n > -1 && e.splice(n, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function ky(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                o = this.form.get(n.path);
              r !== o &&
                (cs(r || null, n),
                ((e) => e instanceof vo)(o) &&
                  (Do(o, n, this.callSetDisabledState), (n.control = o)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function Ry(e, t) {
              Ul(e, t);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function OT(e, t) {
                  return fs(e, t);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Ul(this.form, this), this._oldForm && fs(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(v(xe, 10), v(on, 10), v(Dr, 8));
          }),
          (e.ɵdir = x({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                Le("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [re([qT]), q, kt],
          })),
          e
        );
      })();
      const XT = { provide: sn, useExisting: Q(() => Yl) };
      let Yl = (() => {
          class e extends sn {
            set isDisabled(n) {}
            constructor(n, r, o, i, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.update = new Ne()),
                (this._ngModelWarningSent = !1),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Wl(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === ts
                        ? (n = i)
                        : (function kT(e) {
                            return Object.getPrototypeOf(e.constructor) === Tn;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              this._added || this._setUpControl(),
                (function zl(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            get path() {
              return (function ls(e, t) {
                return [...t.path, e];
              })(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(),
                (this.control = this.formDirective.addControl(this)),
                (this._added = !0);
            }
          }
          return (
            (e._ngModelWarningSentOnce = !1),
            (e.ɵfac = function (n) {
              return new (n || e)(
                v(He, 13),
                v(xe, 10),
                v(on, 10),
                v(Nt, 10),
                v(Kl, 8)
              );
            }),
            (e.ɵdir = x({
              type: e,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [re([XT]), q, kt],
            })),
            e
          );
        })(),
        Nn = (() => {
          class e {
            constructor() {
              this._validator = ns;
            }
            ngOnChanges(n) {
              if (this.inputName in n) {
                const r = this.normalizeInput(n[this.inputName].currentValue);
                (this._enabled = this.enabled(r)),
                  (this._validator = this._enabled
                    ? this.createValidator(r)
                    : ns),
                  this._onChange && this._onChange();
              }
            }
            validate(n) {
              return this._validator(n);
            }
            registerOnValidatorChange(n) {
              this._onChange = n;
            }
            enabled(n) {
              return null != n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = x({ type: e, features: [kt] })),
            e
          );
        })();
      const iN = { provide: xe, useExisting: Q(() => ps), multi: !0 };
      let ps = (() => {
          class e extends Nn {
            constructor() {
              super(...arguments),
                (this.inputName = "required"),
                (this.normalizeInput = al),
                (this.createValidator = (n) => uy);
            }
            enabled(n) {
              return n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = Se(e)))(r || e);
              };
            })()),
            (e.ɵdir = x({
              type: e,
              selectors: [
                [
                  "",
                  "required",
                  "",
                  "formControlName",
                  "",
                  3,
                  "type",
                  "checkbox",
                ],
                ["", "required", "", "formControl", "", 3, "type", "checkbox"],
                ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
              ],
              hostVars: 1,
              hostBindings: function (n, r) {
                2 & n && $t("required", r._enabled ? "" : null);
              },
              inputs: { required: "required" },
              features: [re([iN]), q],
            })),
            e
          );
        })(),
        dN = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ot({ type: e })),
            (e.ɵinj = Dt({ imports: [zy] })),
            e
          );
        })();
      class aD extends as {
        constructor(t, n, r) {
          super(jl(n), $l(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[this._adjustIndex(t)];
        }
        push(t, n = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, n, r = {}) {
          this.controls.splice(t, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, n = {}) {
          let r = this._adjustIndex(t);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(t, n, r = {}) {
          let o = this._adjustIndex(t);
          o < 0 && (o = 0),
            this.controls[o] &&
              this.controls[o]._registerOnCollectionChange(() => {}),
            this.controls.splice(o, 1),
            n && (this.controls.splice(o, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, n = {}) {
          xy(this, 0, t),
            t.forEach((r, o) => {
              Fy(this, !1, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (t.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = [], n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((t) => t.getRawValue());
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _adjustIndex(t) {
          return t < 0 ? t + this.length : t;
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((n, r) => {
            t(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((n) => n.enabled && t(n));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(t) {
          return this.at(t) ?? null;
        }
      }
      function uD(e) {
        return (
          !!e &&
          (void 0 !== e.asyncValidators ||
            void 0 !== e.validators ||
            void 0 !== e.updateOn)
        );
      }
      let fN = (() => {
          class e {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const n = new e();
              return (n.useNonNullable = !0), n;
            }
            group(n, r = null) {
              const o = this._reduceControls(n);
              let i = {};
              return (
                uD(r)
                  ? (i = r)
                  : null !== r &&
                    ((i.validators = r.validator),
                    (i.asyncValidators = r.asyncValidator)),
                new yo(o, i)
              );
            }
            record(n, r = null) {
              const o = this._reduceControls(n);
              return new Py(o, r);
            }
            control(n, r, o) {
              let i = {};
              return this.useNonNullable
                ? (uD(r)
                    ? (i = r)
                    : ((i.validators = r), (i.asyncValidators = o)),
                  new vo(n, { ...i, nonNullable: !0 }))
                : new vo(n, r, o);
            }
            array(n, r, o) {
              const i = n.map((s) => this._createControl(s));
              return new aD(i, r, o);
            }
            _reduceControls(n) {
              const r = {};
              return (
                Object.keys(n).forEach((o) => {
                  r[o] = this._createControl(n[o]);
                }),
                r
              );
            }
            _createControl(n) {
              return n instanceof vo || n instanceof as
                ? n
                : Array.isArray(n)
                ? this.control(
                    n[0],
                    n.length > 1 ? n[1] : null,
                    n.length > 2 ? n[2] : null
                  )
                : this.control(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = j({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        hN = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  {
                    provide: Kl,
                    useValue: n.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: Dr, useValue: n.callSetDisabledState ?? us },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ot({ type: e })),
            (e.ɵinj = Dt({ imports: [dN] })),
            e
          );
        })();
      class gs {}
      class ec {}
      class qt {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const o = n.slice(0, r),
                                i = o.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(o, i),
                                this.headers.has(i)
                                  ? this.headers.get(i).push(s)
                                  : this.headers.set(i, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((n) => {
                            let r = t[n];
                            const o = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(o, r),
                                this.maybeSetNormalizedName(n, o));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof qt
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new qt();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof qt
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class yN {
        encodeKey(t) {
          return lD(t);
        }
        encodeValue(t) {
          return lD(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const _N = /%(\d[a-f0-9])/gi,
        vN = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function lD(e) {
        return encodeURIComponent(e).replace(_N, (t, n) => vN[n] ?? t);
      }
      function ms(e) {
        return `${e}`;
      }
      class an {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new yN()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function DN(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [t.decodeKey(o), ""]
                            : [
                                t.decodeKey(o.slice(0, i)),
                                t.decodeValue(o.slice(i + 1)),
                              ],
                        u = n.get(s) || [];
                      u.push(a), n.set(s, u);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n],
                    o = Array.isArray(r) ? r.map(ms) : [ms(r)];
                  this.map.set(n, o);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const o = t[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new an({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(ms(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const o = r.indexOf(ms(t.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class CN {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function cD(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function dD(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function fD(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class Co {
        constructor(t, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function EN(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new qt()),
            this.context || (this.context = new CN()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new an()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : cD(this.body) ||
              dD(this.body) ||
              fD(this.body) ||
              (function wN(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof an
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || fD(this.body)
            ? null
            : dD(this.body)
            ? this.body.type || null
            : cD(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof an
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const n = t.method || this.method,
            r = t.url || this.url,
            o = t.responseType || this.responseType,
            i = void 0 !== t.body ? t.body : this.body,
            s =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let u = t.headers || this.headers,
            l = t.params || this.params;
          const c = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (u = Object.keys(t.setHeaders).reduce(
                (d, f) => d.set(f, t.setHeaders[f]),
                u
              )),
            t.setParams &&
              (l = Object.keys(t.setParams).reduce(
                (d, f) => d.set(f, t.setParams[f]),
                l
              )),
            new Co(n, r, i, {
              params: l,
              headers: u,
              context: c,
              reportProgress: a,
              responseType: o,
              withCredentials: s,
            })
          );
        }
      }
      var ye = (() => (
        ((ye = ye || {})[(ye.Sent = 0)] = "Sent"),
        (ye[(ye.UploadProgress = 1)] = "UploadProgress"),
        (ye[(ye.ResponseHeader = 2)] = "ResponseHeader"),
        (ye[(ye.DownloadProgress = 3)] = "DownloadProgress"),
        (ye[(ye.Response = 4)] = "Response"),
        (ye[(ye.User = 5)] = "User"),
        ye
      ))();
      class tc {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new qt()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class nc extends tc {
        constructor(t = {}) {
          super(t), (this.type = ye.ResponseHeader);
        }
        clone(t = {}) {
          return new nc({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class ys extends tc {
        constructor(t = {}) {
          super(t),
            (this.type = ye.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new ys({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class hD extends tc {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function rc(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let pD = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof Co) i = n;
            else {
              let u, l;
              (u = o.headers instanceof qt ? o.headers : new qt(o.headers)),
                o.params &&
                  (l =
                    o.params instanceof an
                      ? o.params
                      : new an({ fromObject: o.params })),
                (i = new Co(n, r, void 0 !== o.body ? o.body : null, {
                  headers: u,
                  context: o.context,
                  params: l,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = (function pN(...e) {
              return Is(e, Ac(e));
            })(i).pipe(
              (function gN(e, t) {
                return ne(t) ? To(e, t, 1) : To(e, 1);
              })((u) => this.handler.handle(u))
            );
            if (n instanceof Co || "events" === o.observe) return s;
            const a = s.pipe(
              (function mN(e, t) {
                return Fn((n, r) => {
                  let o = 0;
                  n.subscribe(xn(r, (i) => e.call(t, i, o++) && r.next(i)));
                });
              })((u) => u instanceof ys)
            );
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      cn((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      cn((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      cn((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return a.pipe(cn((u) => u.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new an().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, rc(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, rc(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, rc(o, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(gs));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function gD(e, t) {
        return t(e);
      }
      function bN(e, t) {
        return (n, r) => t.intercept(n, { handle: (o) => e(o, r) });
      }
      const IN = new M("HTTP_INTERCEPTORS"),
        Eo = new M("HTTP_INTERCEPTOR_FNS");
      function SN() {
        let e = null;
        return (t, n) => (
          null === e &&
            (e = (On(IN, { optional: !0 }) ?? []).reduceRight(bN, gD)),
          e(t, n)
        );
      }
      let mD = (() => {
        class e extends gs {
          constructor(n, r) {
            super(),
              (this.backend = n),
              (this.injector = r),
              (this.chain = null);
          }
          handle(n) {
            if (null === this.chain) {
              const r = Array.from(new Set(this.injector.get(Eo)));
              this.chain = r.reduceRight(
                (o, i) =>
                  (function MN(e, t, n) {
                    return (r, o) => n.runInContext(() => t(r, (i) => e(i, o)));
                  })(o, i, this.injector),
                gD
              );
            }
            return this.chain(n, (r) => this.backend.handle(r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(ec), V(vn));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const FN = /^\)\]\}',?\n/;
      let DD = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new we((r) => {
              const o = this.xhrFactory.build();
              if (
                (o.open(n.method, n.urlWithParams),
                n.withCredentials && (o.withCredentials = !0),
                n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(","))),
                n.headers.has("Accept") ||
                  o.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && o.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                o.responseType = "json" !== h ? h : "text";
              }
              const i = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = o.statusText || "OK",
                    p = new qt(o.getAllResponseHeaders()),
                    g =
                      (function xN(e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(o) || n.url;
                  return (
                    (s = new nc({
                      headers: p,
                      status: o.status,
                      statusText: h,
                      url: g,
                    })),
                    s
                  );
                },
                u = () => {
                  let { headers: h, status: p, statusText: g, url: _ } = a(),
                    y = null;
                  204 !== p &&
                    (y = typeof o.response > "u" ? o.responseText : o.response),
                    0 === p && (p = y ? 200 : 0);
                  let w = p >= 200 && p < 300;
                  if ("json" === n.responseType && "string" == typeof y) {
                    const m = y;
                    y = y.replace(FN, "");
                    try {
                      y = "" !== y ? JSON.parse(y) : null;
                    } catch (S) {
                      (y = m), w && ((w = !1), (y = { error: S, text: y }));
                    }
                  }
                  w
                    ? (r.next(
                        new ys({
                          body: y,
                          headers: h,
                          status: p,
                          statusText: g,
                          url: _ || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new hD({
                          error: y,
                          headers: h,
                          status: p,
                          statusText: g,
                          url: _ || void 0,
                        })
                      );
                },
                l = (h) => {
                  const { url: p } = a(),
                    g = new hD({
                      error: h,
                      status: o.status || 0,
                      statusText: o.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(g);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let p = { type: ye.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    "text" === n.responseType &&
                      o.responseText &&
                      (p.partialText = o.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: ye.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                o.addEventListener("load", u),
                o.addEventListener("error", l),
                o.addEventListener("timeout", l),
                o.addEventListener("abort", l),
                n.reportProgress &&
                  (o.addEventListener("progress", d),
                  null !== i &&
                    o.upload &&
                    o.upload.addEventListener("progress", f)),
                o.send(i),
                r.next({ type: ye.Sent }),
                () => {
                  o.removeEventListener("error", l),
                    o.removeEventListener("abort", l),
                    o.removeEventListener("load", u),
                    o.removeEventListener("timeout", l),
                    n.reportProgress &&
                      (o.removeEventListener("progress", d),
                      null !== i &&
                        o.upload &&
                        o.upload.removeEventListener("progress", f)),
                    o.readyState !== o.DONE && o.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Rm));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const oc = new M("XSRF_ENABLED"),
        _D = "XSRF-TOKEN",
        vD = new M("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => _D,
        }),
        CD = "X-XSRF-TOKEN",
        ED = new M("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => CD,
        });
      class wD {}
      let PN = (() => {
        class e {
          constructor(n, r, o) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = o),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = wm(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(V(Tt), V(qu), V(vD));
          }),
          (e.ɵprov = j({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function ON(e, t) {
        const n = e.url.toLowerCase();
        if (
          !On(oc) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          n.startsWith("http://") ||
          n.startsWith("https://")
        )
          return t(e);
        const r = On(wD).getToken(),
          o = On(ED);
        return (
          null != r &&
            !e.headers.has(o) &&
            (e = e.clone({ headers: e.headers.set(o, r) })),
          t(e)
        );
      }
      var ce = (() => (
        ((ce = ce || {})[(ce.Interceptors = 0)] = "Interceptors"),
        (ce[(ce.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (ce[(ce.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (ce[(ce.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (ce[(ce.JsonpSupport = 4)] = "JsonpSupport"),
        (ce[(ce.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        ce
      ))();
      function _r(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function RN(...e) {
        const t = [
          pD,
          DD,
          mD,
          { provide: gs, useExisting: mD },
          { provide: ec, useExisting: DD },
          { provide: Eo, useValue: ON, multi: !0 },
          { provide: oc, useValue: !0 },
          { provide: wD, useClass: PN },
        ];
        for (const n of e) t.push(...n.ɵproviders);
        return (function GC(e) {
          return { ɵproviders: e };
        })(t);
      }
      const bD = new M("LEGACY_INTERCEPTOR_FN");
      function LN({ cookieName: e, headerName: t }) {
        const n = [];
        return (
          void 0 !== e && n.push({ provide: vD, useValue: e }),
          void 0 !== t && n.push({ provide: ED, useValue: t }),
          _r(ce.CustomXsrfConfiguration, n)
        );
      }
      let VN = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Ot({ type: e })),
          (e.ɵinj = Dt({
            providers: [
              RN(
                _r(ce.LegacyInterceptors, [
                  { provide: bD, useFactory: SN },
                  { provide: Eo, useExisting: bD, multi: !0 },
                ]),
                LN({ cookieName: _D, headerName: CD })
              ),
            ],
          })),
          e
        );
      })();
      class vr {
        constructor(t) {
          this.http = t;
        }
        sendQuery(t) {
          return this.http.post("https://testologia.site/intensive-price", t);
        }
        getData() {
          return this.http.get("https://testologia.site/intensive-data");
        }
      }
      function BN(e, t) {
        if (1 & e) {
          const n = _u();
          W(0, "article", 32)(1, "div", 33),
            Mt(2, "img", 34),
            Z(),
            W(3, "div", 35),
            he(4),
            Z(),
            W(5, "div", 36)(6, "div", 37),
            Mt(7, "img", 38),
            W(8, "div"),
            he(9, "\u041f\u0440\u0438\u0432\u043e\u0434"),
            Z(),
            W(10, "div"),
            he(11),
            Z()(),
            W(12, "div", 37),
            Mt(13, "img", 39),
            W(14, "div"),
            he(15, "\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043b\u044c"),
            Z(),
            W(16, "div"),
            he(17),
            Z()(),
            W(18, "div", 37),
            Mt(19, "img", 40),
            W(20, "div"),
            he(21, "\u041a\u043e\u043b-\u0432\u043e \u043c\u0435\u0441\u0442"),
            Z(),
            W(22, "div"),
            he(23),
            Z()()(),
            W(24, "div", 41)(25, "button", 42),
            Le("click", function () {
              const i = Gs(n).$implicit,
                s = Bh(),
                a = gu(33);
              return zs(s.goScroll(a, i));
            }),
            he(
              26,
              " \u0417\u0410\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c "
            ),
            Z()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          dt(2),
            vu("src", n.image, Va),
            dt(2),
            Qr(n.name),
            dt(7),
            Qr(n.gear),
            dt(6),
            Ai("", n.engine, " \u043b.\u0441."),
            dt(6),
            Qr(n.places);
        }
      }
      (vr.ɵfac = function (t) {
        return new (t || vr)(V(pD));
      }),
        (vr.ɵprov = j({ token: vr, factory: vr.ɵfac, providedIn: "root" }));
      class wo {
        constructor(t, n) {
          (this.fb = t),
            (this.appService = n),
            (this.priceForm = this.fb.group({
              name: ["", Ol.required],
              phone: ["", Ol.required],
              car: ["", Ol.required],
            }));
        }
        ngOnInit() {
          this.appService.getData().subscribe((t) => (this.carsData = t));
        }
        goScroll(t, n) {
          t.scrollIntoView({ behavior: "smooth" }),
            n && this.priceForm.patchValue({ car: n.name });
        }
        onMouseMove(t) {
          this.trans = {
            transform:
              "translate3d(" +
              (0.05 * t.clientX) / 8 +
              "px," +
              (0.05 * t.clientY) / 8 +
              "px,0px)",
          };
        }
        onScroll() {
          this.bgPos = {
            backgroundPositionX: "0" + 1.3 * window.scrollY + "px",
          };
        }
        onSubmit() {
          this.priceForm.valid &&
            this.appService.sendQuery(this.priceForm.value).subscribe({
              next: (t) => {
                alert(t.message), this.priceForm.reset();
              },
              error: (t) => {
                alert(t.error.message);
              },
            });
        }
      }
      (wo.ɵfac = function (t) {
        return new (t || wo)(v(fN), v(vr));
      }),
        (wo.ɵcmp = Vs({
          type: wo,
          selectors: [["app-root"]],
          hostBindings: function (t, n) {
            1 & t &&
              Le(
                "mousemove",
                function (o) {
                  return n.onMouseMove(o);
                },
                0,
                Za
              )(
                "scroll",
                function (o) {
                  return n.onScroll(o);
                },
                !1,
                Za
              );
          },
          decls: 52,
          vars: 5,
          consts: [
            [1, "header"],
            [1, "container"],
            [1, "logo"],
            ["src", "assets/image/logo/logo.png", "alt", "logo"],
            [1, "menu"],
            [1, "menu__list"],
            [1, "menu__item"],
            ["href", "#"],
            ["href", "#cars"],
            ["href", "#price"],
            [1, "main", 3, "ngStyle"],
            [1, "main__nfo"],
            [1, "main__title"],
            [1, "main__text"],
            [1, "main__action"],
            ["id", "main-button", 1, "button", "main__button", 3, "click"],
            ["id", "cars", 1, "car"],
            ["cars", ""],
            [1, "sub__title"],
            [1, "car__cards"],
            ["class", "card", 4, "ngFor", "ngForOf"],
            ["id", "price", 1, "price"],
            ["price", ""],
            [1, "price__text"],
            ["action", "", 1, "price__form", 3, "formGroup"],
            [
              "type",
              "text",
              "id",
              "name",
              "placeholder",
              "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f",
              "required",
              "",
              "formControlName",
              "name",
              1,
              "price__input",
            ],
            [
              "type",
              "text",
              "id",
              "phone",
              "placeholder",
              "\u0412\u0430\u0448 \u0442\u0435\u043b\u0435\u0444\u043e\u043d",
              "required",
              "",
              "formControlName",
              "phone",
              1,
              "price__input",
            ],
            [
              "type",
              "text",
              "id",
              "car",
              "placeholder",
              "\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044c, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0432\u0430\u0441 \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442",
              "required",
              "",
              "formControlName",
              "car",
              1,
              "price__input",
            ],
            [
              "id",
              "price-button",
              1,
              "button",
              "price__button",
              3,
              "disabled",
              "click",
            ],
            [
              "src",
              "assets/image/img/rolls.png",
              "alt",
              "rolls",
              1,
              "price__img",
              3,
              "ngStyle",
            ],
            [1, "footer"],
            [1, "footer__right"],
            [1, "card"],
            [1, "card__img"],
            ["alt", "Image 1", 3, "src"],
            [1, "card__title"],
            [1, "card__info"],
            [1, "card__point"],
            ["src", "assets/image/card/icons/gear.svg", "alt", "icon-gear"],
            ["src", "assets/image/card/icons/wheel.svg", "alt", "icon-wheel"],
            ["src", "assets/image/card/icons/Group.svg", "alt", "icon-group"],
            [1, "card__action"],
            [1, "button", "card__button", 3, "click"],
          ],
          template: function (t, n) {
            if (1 & t) {
              const r = _u();
              W(0, "header", 0)(1, "div", 1)(2, "div", 2),
                Mt(3, "img", 3),
                Z(),
                W(4, "nav", 4)(5, "ul", 5)(6, "li", 6)(7, "a", 7),
                he(8, "\u0413\u043b\u0430\u0432\u043d\u0430\u044f"),
                Z()(),
                W(9, "li", 6)(10, "a", 8),
                he(
                  11,
                  "\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438"
                ),
                Z()(),
                W(12, "li", 6)(13, "a", 9),
                he(
                  14,
                  "\u0411\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0430\u0432\u0442\u043e"
                ),
                Z()()()()()(),
                W(15, "section", 10)(16, "div", 1)(17, "div", 11)(18, "h1", 12),
                he(
                  19,
                  "\u0410\u0440\u0435\u043d\u0434\u0430 \u043f\u0440\u0435\u043c\u0438\u0430\u043b\u044c\u043d\u044b\u0445 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u0439"
                ),
                Z(),
                W(20, "p", 13),
                he(
                  21,
                  " \u0412 \u043d\u0430\u0448\u0435\u043c \u043a\u043b\u0443\u0431\u0435 \u0438\u043c\u0435\u0435\u0442\u0441\u044f \u0441\u043e\u043b\u0438\u0434\u043d\u0430\u044f \u043a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u044f \u0441\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u044b\u0445 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u0439 \u2014 \u043e\u0442 \u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u0440\u0430\u0441\u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0435\u043d\u043d\u044b\u0445 \u0441\u0435\u0440\u0438\u0439\u043d\u044b\u0445 \u043c\u0430\u0448\u0438\u043d \u0434\u043e \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0433\u043e \u0433\u043e\u043d\u043e\u0447\u043d\u043e\u0433\u043e \u044d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u0430. \u0412\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435\u0441\u044c \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0439 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c\u044e \u043f\u043e\u0431\u044b\u0432\u0430\u0442\u044c \u0437\u0430 \u0440\u0443\u043b\u0435\u043c \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0439 \u043b\u0435\u0433\u0435\u043d\u0434\u044b \u0438 \u0443\u0437\u043d\u0430\u0442\u044c, \u043d\u0430 \u0447\u0442\u043e \u043e\u043d\u0430 \u0441\u043f\u043e\u0441\u043e\u0431\u043d\u0430 \u0437\u0430 \u043f\u0440\u0435\u0434\u0435\u043b\u0430\u043c\u0438 \u0433\u043e\u043d\u043e\u0447\u043d\u043e\u0439 \u0442\u0440\u0430\u0441\u0441\u044b! "
                ),
                Z()(),
                W(22, "div", 14)(23, "button", 15),
                Le("click", function () {
                  Gs(r);
                  const i = gu(26);
                  return zs(n.goScroll(i));
                }),
                he(
                  24,
                  " \u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438 "
                ),
                Z()()()(),
                W(25, "section", 16, 17)(27, "div", 1)(28, "h2", 18),
                he(
                  29,
                  "\u041d\u0430\u0448 \u0430\u0432\u0442\u043e\u043f\u0430\u0440\u043a"
                ),
                Z(),
                W(30, "div", 19),
                (function Fh(e, t, n, r, o, i, s, a) {
                  const u = D(),
                    l = H(),
                    c = e + 22,
                    d = l.firstCreatePass
                      ? (function GE(e, t, n, r, o, i, s, a, u) {
                          const l = t.consts,
                            c = tr(t, e, 4, s || null, Yt(l, a));
                          su(t, n, c, Yt(l, u)), Go(t, c);
                          const d = (c.tViews = iu(
                            2,
                            c,
                            r,
                            o,
                            i,
                            t.directiveRegistry,
                            t.pipeRegistry,
                            null,
                            t.schemas,
                            l
                          ));
                          return (
                            null !== t.queries &&
                              (t.queries.template(t, c),
                              (d.queries = t.queries.embeddedTView(c))),
                            c
                          );
                        })(c, l, u, t, n, r, o, i, s)
                      : l.data[c];
                  Ct(d, !1);
                  const f = u[L].createComment("");
                  ii(l, u, f, d),
                    Ae(f, u),
                    yi(u, (u[c] = dh(f, u, f, d))),
                    jo(d) && ru(l, u, d),
                    null != s && ou(u, d, a);
                })(31, BN, 27, 5, "article", 20),
                Z()()(),
                W(32, "section", 21, 22)(34, "div", 1)(35, "h2", 18),
                he(
                  36,
                  "\u041d\u0430\u0448 \u0430\u0432\u0442\u043e\u043f\u0430\u0440\u043a"
                ),
                Z(),
                W(37, "div", 23),
                he(
                  38,
                  " \u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u0435, \u0438 \u043c\u044b \u043f\u0435\u0440\u0435\u0437\u0432\u043e\u043d\u0438\u043c \u0432\u0430\u043c \u0434\u043b\u044f \u0443\u0442\u043e\u0447\u043d\u0435\u043d\u0438\u044f \u0432\u0441\u0435\u0445 \u0434\u0435\u0442\u0430\u043b\u0435\u0439 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f "
                ),
                Z(),
                W(39, "form", 24),
                Mt(40, "input", 25)(41, "input", 26)(42, "input", 27),
                W(43, "button", 28),
                Le("click", function () {
                  return n.onSubmit();
                }),
                he(
                  44,
                  " \u0423\u0437\u043d\u0430\u0442\u044c \u0446\u0435\u043d\u0443 "
                ),
                Z()(),
                Mt(45, "img", 29),
                Z()(),
                W(46, "footer", 30)(47, "div", 1)(48, "div", 2),
                Mt(49, "img", 3),
                Z(),
                W(50, "div", 31),
                he(
                  51,
                  "\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b"
                ),
                Z()()();
            }
            2 & t &&
              (dt(15),
              bn("ngStyle", n.bgPos),
              dt(16),
              bn("ngForOf", n.carsData),
              dt(8),
              bn("formGroup", n.priceForm),
              dt(4),
              bn("disabled", !n.priceForm.valid),
              dt(2),
              bn("ngStyle", n.trans));
          },
          dependencies: [Sm, Fm, Uy, ts, Ay, Ty, ps, hs, Yl],
          styles: [
            ".container[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto}.header[_ngcontent-%COMP%]{padding:25px 0;border-bottom:1px solid #e5e5e5}.header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{display:flex;align-items:center}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{vertical-align:bottom}.menu[_ngcontent-%COMP%]{margin-left:244px}.menu__list[_ngcontent-%COMP%]{display:flex;list-style:none}.menu__item[_ngcontent-%COMP%]:not(:last-child){margin-right:115px}.menu__item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:15px;color:#030305;text-decoration:none;border-bottom:2px solid transparent;transition:border-bottom-color .2s ease;-webkit-transition:border-bottom-color .2s ease;-moz-transition:border-bottom-color .2s ease;-ms-transition:border-bottom-color .2s ease;-o-transition:border-bottom-color .2s ease}.menu__item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{border-bottom-color:#000}.main[_ngcontent-%COMP%]{padding:104px 0 154px;background-image:url(background.04bd50c66ae58c63.png);background-position:center;background-size:cover;background-repeat:no-repeat}.maini__nfo[_ngcontent-%COMP%]{max-width:855px}.main__title[_ngcontent-%COMP%]{margin-bottom:40px;font-weight:700;font-size:80px;line-height:110%;color:#030305}.main__text[_ngcontent-%COMP%]{max-width:502px;margin-bottom:40px;font-size:16px;line-height:130%;color:#030305}.button[_ngcontent-%COMP%]{border:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;-o-border-radius:0;background:#030305;text-transform:uppercase;font-size:16px;line-height:150%;font-weight:700;color:#fff;cursor:pointer;transition:background .2s ease;-webkit-transition:background .2s ease;-moz-transition:background .2s ease;-ms-transition:background .2s ease;-o-transition:background .2s ease}.button[_ngcontent-%COMP%]:hover:not(:disabled){background:#575757}.button[_ngcontent-%COMP%]:disabled{cursor:not-allowed;color:gray;background-color:#343434}.main__button[_ngcontent-%COMP%]{padding:20px 53px}.car[_ngcontent-%COMP%]{margin-top:100px;margin-bottom:100px}.sub__title[_ngcontent-%COMP%]{margin-bottom:40px;font-size:60px;font-weight:700;line-height:70px;color:#030305}.car__cards[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.card[_ngcontent-%COMP%]{max-width:384px;margin-top:40px;margin-bottom:40px;text-align:center}.card__img[_ngcontent-%COMP%]{vertical-align:bottom;transform:scale(1);-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transition:transform .2s ease;-webkit-transition:transform .2s ease;-moz-transition:transform .2s ease;-ms-transition:transform .2s ease;-o-transition:transform .2s ease}.card__img[_ngcontent-%COMP%]:hover{transform:scale(1.1);-webkit-transform:scale(1.1);-moz-transform:scale(1.1);-ms-transform:scale(1.1);-o-transform:scale(1.1)}.card__title[_ngcontent-%COMP%]{padding:15px 0 17px;font-size:24px;font-weight:700;line-height:150%;letter-spacing:.02em;color:#030305}.card__info[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.card__point[_ngcontent-%COMP%]{width:110px;height:92px;margin:0 7.5px}.card__point[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{margin-bottom:11px}.card__point[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(2){font-weight:700}.card__action[_ngcontent-%COMP%]{margin-top:13px}.card__button[_ngcontent-%COMP%]{width:100%;padding:15px}.price[_ngcontent-%COMP%]{overflow:hidden}.price[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{position:relative;padding-bottom:120px}.price[_ngcontent-%COMP%]   .sub__title[_ngcontent-%COMP%]{margin-bottom:20px}.price__text[_ngcontent-%COMP%]{margin-bottom:60px;font-size:16px;line-height:130%;color:#5d5d5f}.price__form[_ngcontent-%COMP%]{max-width:344px}.price__input[_ngcontent-%COMP%]{width:100%;padding:22px 18px;margin-bottom:15px;border:1px solid #5d5d5f;background:#ffffff;font-size:16px;outline:none;transition:border-color .2s ease;-webkit-transition:border-color .2s ease;-moz-transition:border-color .2s ease;-ms-transition:border-color .2s ease;-o-transition:border-color .2s ease}.price__input.ng-touched.ng-valid[_ngcontent-%COMP%]{border-color:#5d5d5f}.price__input.ng-touched.ng-invalid[_ngcontent-%COMP%]{border-color:red}.price__input.price__input.ng-touched.ng-invalid[_ngcontent-%COMP%]::placeholder{color:red}.price__input.price__input.ng-touched.ng-valid[_ngcontent-%COMP%]::placeholder{color:#5d5d5f}.price__button[_ngcontent-%COMP%]{width:100%;padding:20px}.price__img[_ngcontent-%COMP%]{position:absolute;bottom:0;left:401px}.footer[_ngcontent-%COMP%]{border-top:1px solid #e5e5e5;padding:25px 0}.footer[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between}.footer__right[_ngcontent-%COMP%]{font-size:15px;line-height:18px;color:#030305}",
          ],
        }));
      class Cr {}
      (Cr.ɵfac = function (t) {
        return new (t || Cr)();
      }),
        (Cr.ɵmod = Ot({ type: Cr, bootstrap: [wo] })),
        (Cr.ɵinj = Dt({ imports: [KA, hN, VN] })),
        qA()
          .bootstrapModule(Cr)
          .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 2));
  },
]);
