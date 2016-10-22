(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.Plaid = f();
    }
})(function() {

    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            "use strict";
            var _extends = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
                    }
                    return e
                },
                PLAID_NAMESPACE = "plaid_link",
                find = function(e, t) {
                    var n = e.length,
                        i = void 0;
                    for (i = 0; i < n; i += 1)
                        if (t(e[i])) return e[i]
                },
                script = function() {
                    for (var e = document.getElementsByTagName("script"), t = 0, n = e.length; t < n; t += 1)
                        if (/link-initialize[.]js$/.test(e[t].src)) return e[t];
                    throw new Error("Failed to find script")
                }(),
                loc = window.location,
                origin = void 0;
            origin = null != loc.origin ? loc.origin : loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");
            var PlaidInstitutions = [{
                    name: "American Express",
                    type: "amex",
                    auth: !1,
                    connect: !0,
                    creditdetails: !1,
                    income: !0,
                    info: !1,
                    risk: !0
                }, {
                    name: "Bank of America",
                    type: "bofa",
                    auth: !0,
                    connect: !0,
                    creditdetails: !0,
                    income: !0,
                    info: !0,
                    risk: !0
                }],
                iframe = document.createElement("iframe"),
                iframeLoaded = !1;
            iframe.id = "plaid-link-iframe", iframe.src = "https://cdn.plaid.com/link/1.0.11/link.html", iframe.width = "100%", iframe.height = "100%", iframe.style.position = "fixed", iframe.style.top = "0", iframe.style.left = "0", iframe.style.right = "0", iframe.style.bottom = "0", iframe.style.zIndex = "99999999", iframe.style.borderWidth = "0", iframe.style.display = "none", iframe.style.overflowX = "hidden", iframe.style.overflowY = "auto", document.body.appendChild(iframe);
            var formId = script.getAttribute("data-form-id"),
                form = document.getElementById(formId),
                onSuccessHandler = void 0,
                onExitHandler = void 0,
                onLoadHandler = void 0,
                linkSimpleButton = void 0,
                originalDocumentStyles = {
                    body: document.body.style.overflow,
                    html: document.documentElement.style.overflow
                },
                PRODUCTS = ["auth", "connect", "income", "info", "risk"];
            null == formId ? ! function() {
                var e = null;
                iframe.onload = function() {
                    "function" == typeof onLoadHandler && onLoadHandler(), null != e && (sendMessage(e), iframe.style.display = "block", document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", iframe.contentWindow.focus()), iframeLoaded = !0
                }, module.exports = {
                    create: function(t) {
                        if (null == t.clientName) throw new Error("Missing clientName");
                        if ("development" !== t.env && "tartan" !== t.env && "production" !== t.env) throw new Error('Invalid env: env must be "tartan" or "production"');
                        if ("production" === t.env && "test_key" === t.key) throw new Error('Invalid env: env must be "tartan" when key is "test_key"');
                        if (PRODUCTS.indexOf(t.product) < 0) throw new Error('Invalid product: product must be "' + PRODUCTS.join('", "') + '"');
                        if (null == t.key) throw new Error("Missing key");
                        if ("function" != typeof t.onSuccess) throw new Error("Invalid onSuccess function");
                        onExitHandler = t.onExit, onLoadHandler = t.onLoad, onSuccessHandler = t.onSuccess;
                        var n = PlaidInstitutions.filter(function(e) {
                            return e[t.product]
                        });
                        return {
                            institutions: n,
                            open: function(n) {
                                if (null != n) {
                                    var i = find(PlaidInstitutions, function(e) {
                                        return e.type === n
                                    });
                                    if (null != i && !i[t.product]) throw new Error('"' + n + '" is not supported with "' + t.product + '". Use the "institutions" property of the Plaid Link handler to determine supported institution types.');
                                    if (null == i && !/^\d+$/.test(n)) throw new Error('"' + n + '" is not a valid Plaid institution.')
                                }
                                return iframeLoaded ? (null != t.longTail && console.warn('Warning: The Plaid Link option "longTail" will be deprecated in a future version. Please use "longtail" instead.'), sendMessage({
                                    action: "open",
                                    clientName: t.clientName,
                                    env: t.env,
                                    institution: n,
                                    key: t.key,
                                    longtail: t.longtail === !0 || t.longTail === !0,
                                    origin: origin,
                                    product: t.product,
                                    selectAccount: t.selectAccount === !0,
                                    token: t.token,
                                    webhook: t.webhook
                                }), iframe.style.display = "block", document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", void iframe.contentWindow.focus()) : (e = _extends({}, t, {
                                    action: "open",
                                    institution: n,
                                    longtail: t.longtail === !0 || t.longTail === !0,
                                    origin: origin
                                }), void("function" == typeof onLoadHandler && console.error("Unable to open Plaid Link: wait until your onLoad function has been called before attempting to call .open() on your Plaid Link handler.")))
                            }
                        }
                    }
                }
            }() : ! function() {
                if (null == form) throw new Error("Uncaught Error: Specify a valid data-form-id");
                var e = script.getAttribute("data-client-name"),
                    t = script.getAttribute("data-env"),
                    n = script.getAttribute("data-key"),
                    i = "true" === script.getAttribute("data-longtail") || "true" === script.getAttribute("data-long-tail"),
                    o = script.getAttribute("data-product"),
                    r = "true" === script.getAttribute("data-select-account"),
                    a = script.getAttribute("data-token"),
                    l = script.getAttribute("data-webhook");
                if (null == e) throw new Error("Missing data-client-name");
                if ("development" !== t && "tartan" !== t && "production" !== t) throw new Error('Invalid data-env: data-env must be "tartan" or "production"');
                if ("production" === t && "test_key" === n) throw new Error('Invalid data-env: data-env must be "tartan" when data-key is "test_key"');
                if (null == n) throw new Error("Missing data-key");
                if (PRODUCTS.indexOf(o) < 0) throw new Error('Invalid data-product: valid products are "' + PRODUCTS.join('", "') + '"');
                null != script.getAttribute("data-long-tail") && console.warn('Warning: The Plaid Link option "data-long-tail" will be deprecated in a future version. Please use "data-longtail" instead.'), linkSimpleButton = document.createElement("button"), linkSimpleButton.id = "plaid-link-button", linkSimpleButton.textContent = null != a ? "Relink your bank account" : "Link your bank account", linkSimpleButton.onclick = function(d) {
                    d.preventDefault(), sendMessage({
                        action: "open",
                        clientName: e,
                        env: t,
                        key: n,
                        longtail: i,
                        origin: origin,
                        product: o,
                        selectAccount: r,
                        token: a,
                        webhook: l
                    }), iframe.style.display = "block", document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", iframe.contentWindow.focus()
                }, form.appendChild(linkSimpleButton);
                var d = function(e, t) {
                    var n = document.createElement("input");
                    return n.type = "hidden", n.name = e, n.value = t, n
                };
                onSuccessHandler = function(e, t) {
                    for (var n in t) "institution" === n ? (form.appendChild(d("institution[name]", t.institution.name)), form.appendChild(d("institution[type]", t.institution.type))) : form.appendChild(d(n, t[n]));
                    form.submit()
                }
            }();
            var sendMessage = function(e) {
                    var t = _extends({}, e, {
                        action: PLAID_NAMESPACE + "::" + e.action
                    });
                    iframe.contentWindow.postMessage(JSON.stringify(t), "https://cdn.plaid.com/link")
                },
                hideIframe = function() {
                    iframe.style.display = "none", document.body.style.overflow = originalDocumentStyles.body, document.documentElement.style.overflow = originalDocumentStyles.html, window.parent.focus()
                };
            window.addEventListener("message", function(e) {
                var t = void 0;
                try {
                    t = JSON.parse(e.data)
                } catch (e) {
                    t = {}
                }
                switch (t.action) {
                    case PLAID_NAMESPACE + "::exit":
                        return "function" == typeof onExitHandler && onExitHandler(t.error, t.metadata), hideIframe();
                    case PLAID_NAMESPACE + "::connected":
                        return onSuccessHandler(t.metadata.public_token, t.metadata), hideIframe();
                    case PLAID_NAMESPACE + "::acknowledged":
                        null != linkSimpleButton && (linkSimpleButton.disabled = !1)
                }
            }, !1);

        }, {}]
    }, {}, [1])(1)
});
//# sourceMappingURL=link-initialize.js.map