(function e(t, n, r) {
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
        var ActionTypes = require("../constants/ActionTypes"),
            initializeConfig = function(i) {
                return {
                    type: ActionTypes.INITIALIZE_CONFIG,
                    config: i
                }
            },
            updateConfig = function(i) {
                return {
                    type: ActionTypes.UPDATE_CONFIG,
                    config: i
                }
            };
        module.exports = {
            initializeConfig: initializeConfig,
            updateConfig: updateConfig
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    2: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            connectedContinue = function() {
                return function(n, e) {
                    var t = e();
                    n({
                        type: ActionTypes.CONNECTED_CONTINUE,
                        state: t
                    })
                }
            };
        module.exports = {
            connectedContinue: connectedContinue
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    3: [function(require, module, exports) {
        "use strict";
        var authenticateApi = require("../api/endpoints/authenticate"),
            ActionTypes = require("../constants/ActionTypes"),
            MfaStatus = require("../constants/MfaStatus"),
            useLoader = require("./loader"),
            util = require("../utilities"),
            updateUsername = function(t) {
                return {
                    type: ActionTypes.UPDATE_USERNAME,
                    username: t
                }
            },
            updatePassword = function(t) {
                return {
                    type: ActionTypes.UPDATE_PASSWORD,
                    password: t
                }
            },
            updatePin = function(t) {
                return {
                    type: ActionTypes.UPDATE_PIN,
                    pin: t
                }
            },
            submitCredentials = function() {
                return function(t, e) {
                    var n = e(),
                        s = n.institutionSelect.selectedInstitution.fields,
                        u = s.filter(function(t) {
                            return 0 === n.credentials[t.name].length
                        }).map(function(t) {
                            return t.name
                        });
                    if (0 === u.length) {
                        t({
                            type: ActionTypes.SUBMIT_CREDENTIALS
                        });
                        var i = authenticateApi.submit(n);
                        return useLoader(MfaStatus.REQUIRES_CREDENTIALS, t, e, i).then(function(e) {
                            return util.hasNoDepositoryAccounts(n, e) ? Promise.reject({
                                body: {
                                    code: "no-depository-accounts"
                                },
                                statusCode: e.statusCode
                            }) : void t({
                                type: util.mapStatusToAction(e.data.status),
                                data: e.data,
                                statusCode: e.statusCode
                            })
                        }).catch(function(e) {
                            return t({
                                type: ActionTypes.CREDENTIALS_REQUEST_FAILURE,
                                error: e.body,
                                statusCode: e.statusCode
                            })
                        })
                    }
                    t({
                        type: ActionTypes.INVALIDATE_INPUT_FIELD,
                        fieldError: u[0]
                    }), setTimeout(function() {
                        return t({
                            type: ActionTypes.RESTORE_INPUT_FIELD
                        })
                    }, 510)
                }
            };
        module.exports = {
            submitCredentials: submitCredentials,
            updatePassword: updatePassword,
            updatePin: updatePin,
            updateUsername: updateUsername
        };

    }, {
        "../api/endpoints/authenticate": 18,
        "../constants/ActionTypes": 63,
        "../constants/MfaStatus": 66,
        "../utilities": 87,
        "./loader": 9
    }],
    4: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            acknowledgeError = function() {
                return function(r, t) {
                    var e = t();
                    r({
                        type: ActionTypes.ACKNOWLEDGE_ERROR,
                        configuration: e.configuration,
                        error: e.error,
                        institution: e.institutionSelect.selectedInstitution
                    })
                }
            };
        module.exports = {
            acknowledgeError: acknowledgeError
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    5: [function(require, module, exports) {
        "use strict";
        var configuration = require("./configuration"),
            connected = require("./connected"),
            credentials = require("./credentials"),
            error = require("./error"),
            initialize = require("./initialize"),
            institutionSearch = require("./institutionSearch"),
            institutionSelect = require("./institutionSelect"),
            windowActions = require("./window"),
            loader = require("./loader"),
            longtailAuth = require("./longtailAuth"),
            mfa = require("./mfa"),
            panes = require("./panes"),
            selectAccount = require("./selectAccount");
        module.exports = {
            configuration: configuration,
            connected: connected,
            credentials: credentials,
            error: error,
            initialize: initialize,
            institutionSearch: institutionSearch,
            institutionSelect: institutionSelect,
            window: windowActions,
            loader: loader,
            longtailAuth: longtailAuth,
            mfa: mfa,
            panes: panes,
            selectAccount: selectAccount
        };

    }, {
        "./configuration": 1,
        "./connected": 2,
        "./credentials": 3,
        "./error": 4,
        "./initialize": 6,
        "./institutionSearch": 7,
        "./institutionSelect": 8,
        "./loader": 9,
        "./longtailAuth": 10,
        "./mfa": 11,
        "./panes": 12,
        "./selectAccount": 13,
        "./window": 14
    }],
    6: [function(require, module, exports) {
        "use strict";
        var getByTokenApi = require("../api/endpoints/institutions/getByToken"),
            getByTypeApi = require("../api/endpoints/institutions/getByType"),
            institutionSelect = require("./institutionSelect"),
            configuration = require("./configuration"),
            windowActions = require("./window"),
            PlaidInstitutions = require("../constants/PlaidInstitutions"),
            windowClient = require("../window"),
            initializeInstitutionSelect = function() {
                return function(i, t) {
                    var n = t();
                    windowClient.acknowledge(n.configuration.origin), i(windowActions.openLink())
                }
            },
            initializeLongtailType = function(i) {
                return function(t, n) {
                    var e = n();
                    return "auth" !== e.configuration.product || e.configuration.longtailAuthEnabled ? getByTypeApi(e.configuration, i).then(function(i) {
                        t(configuration.updateConfig({
                            isCustomInitializer: !0
                        })), t(institutionSelect.selectInstitution(i.data)), t(windowActions.openLink())
                    }).catch(function(i) {
                        t(actions.window.closeLink()), console.error("Error retrieving requested institution type. Please refer to the documentation for details on supported institutions.")
                    }) : (console.error("Error authenticating public key. This public key is not enabled for longtail and Auth. Please contact support@plaid.com to be enabled."), t(windowActions.closeLink()))
                }
            },
            initializePlaidType = function(i) {
                return function(t, n) {
                    var e = n();
                    windowClient.acknowledge(e.configuration.origin), t(configuration.updateConfig({
                        isCustomInitializer: !0
                    }));
                    var o = PlaidInstitutions[i];
                    t(institutionSelect.selectInstitution(o)), t(windowActions.openLink())
                }
            },
            initializeWithToken = function() {
                return function(i, t) {
                    var n = t();
                    return getByTokenApi(n.configuration).then(function(t) {
                        i(configuration.updateConfig({
                            isPatch: !0,
                            isCustomInitializer: !0
                        })), i(institutionSelect.selectInstitution(t.data)), i(windowActions.openLink())
                    }).catch(function(t) {
                        i(windowActions.closeLink()), console.error("Error retrieving institution for public token. Make sure that the entered token is correct. If error persists, contact support@plaid.com.")
                    })
                }
            };
        module.exports = {
            initializeInstitutionSelect: initializeInstitutionSelect,
            initializeLongtailType: initializeLongtailType,
            initializePlaidType: initializePlaidType,
            initializeWithToken: initializeWithToken
        };

    }, {
        "../api/endpoints/institutions/getByToken": 21,
        "../api/endpoints/institutions/getByType": 22,
        "../constants/PlaidInstitutions": 68,
        "../window": 88,
        "./configuration": 1,
        "./institutionSelect": 8,
        "./window": 14
    }],
    7: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            api = require("../api/interface"),
            institutionsApi = require("../api/endpoints/institutions/search"),
            search = function(e) {
                return function(t, n) {
                    var i = n();
                    institutionsApi.search(i, e).then(function(e) {
                        t({
                            type: ActionTypes.INSTITUTION_SEARCH_SUCCESS,
                            results: e.data,
                            statusCode: e.statusCode
                        }), e.data.length > 0 && t({
                            type: ActionTypes.INSTITUTION_SEARCH_SELECT_INDEX,
                            selectedIndex: 0
                        })
                    }).catch(function(e) {
                        t({
                            type: ActionTypes.INSTITUTION_SEARCH_FAILURE,
                            isTimeout: e.reason === api.TIMEOUT,
                            errorMessage: e.message,
                            statusCode: e.statusCode
                        })
                    }), t({
                        type: ActionTypes.INSTITUTION_SEARCH_BEGIN,
                        query: e
                    })
                }
            },
            toggleSearch = function(e) {
                return function(t, n) {
                    var i = n();
                    t({
                        type: ActionTypes.TOGGLE_INSTITUTION_SEARCH,
                        isVisible: e || "" !== i.institutionSearch.query
                    })
                }
            },
            moveSelectedIndex = function(e) {
                return function(t, n) {
                    var i = n(),
                        s = i.institutionSearch.results.length,
                        r = i.institutionSearch.selectedIndex + ~~e;
                    0 !== s && r >= 0 && r < s && t({
                        type: ActionTypes.INSTITUTION_SEARCH_SELECT_INDEX,
                        selectedIndex: r
                    })
                }
            },
            selectCurrentIndex = function() {
                return function(e, t) {
                    var n = t(),
                        i = n.institutionSearch.results,
                        s = n.institutionSearch.selectedIndex,
                        r = i[s];
                    null != r && e({
                        type: ActionTypes.SELECT_INSTITUTION,
                        institution: r
                    })
                }
            };
        module.exports = {
            moveSelectedIndex: moveSelectedIndex,
            search: search,
            selectCurrentIndex: selectCurrentIndex,
            toggleSearch: toggleSearch
        };

    }, {
        "../api/endpoints/institutions/search": 23,
        "../api/interface": 24,
        "../constants/ActionTypes": 63
    }],
    8: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            goToSelectPage = function(t) {
                return {
                    type: ActionTypes.GO_TO_SELECT_PAGE,
                    page: t
                }
            },
            selectInstitution = function(t) {
                return {
                    type: ActionTypes.SELECT_INSTITUTION,
                    institution: t
                }
            };
        module.exports = {
            goToSelectPage: goToSelectPage,
            selectInstitution: selectInstitution
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    9: [function(require, module, exports) {
        "use strict";
        var _Promise = "undefined" == typeof Promise ? require("es6-promise").Promise : Promise,
            ActionTypes = require("../constants/ActionTypes"),
            LoaderMessages = require("../constants/LoaderMessages"),
            util = require("../utilities"),
            getCurrentMessage = function(e, r) {
                return util.find(LoaderMessages[e], function(e) {
                    return e.percentage > r || e.percentage >= 100
                }).message
            },
            beginLoader = function() {
                return {
                    type: ActionTypes.BEGIN_LOADER
                }
            },
            updateLoader = function(e, r, n) {
                return {
                    type: ActionTypes.UPDATE_LOADER,
                    message: getCurrentMessage(e, r),
                    parameter: n,
                    percentage: r
                }
            },
            finishLoader = function(e) {
                return {
                    type: ActionTypes.FINISH_LOADER,
                    percentage: e
                }
            },
            fastPower = function(e) {
                return Math.pow(e + (1 - e) / 2, 8)
            },
            onLoaderFrame = function e(r, n, t, a) {
                return function() {
                    var o = t(),
                        s = o.loader.isLoading,
                        i = o.loader.percentage;
                    if (s) i < 90 && n(updateLoader(r, i + .05, 0)), util.requestFrame(e(r, n, t, a));
                    else if (i < 100) {
                        var u = o.loader.finishPercentage,
                            d = o.loader.parameter + .01,
                            c = u + (100 - u) * fastPower(d);
                        n(updateLoader(r, c, d)), util.requestFrame(e(r, n, t, a))
                    } else a()
                }
            },
            useLoader = function(e, r, n, t) {
                if (null == LoaderMessages[e]) throw new Error("Invalid messageType: " + e);
                var a = null,
                    o = null;
                return t.then(function(e) {
                    var t = n();
                    a = e, r(finishLoader(t.loader.percentage))
                }, function(e) {
                    var t = n();
                    o = e, r(finishLoader(t.loader.percentage))
                }), new _Promise(function(t, s) {
                    r(beginLoader());
                    var i = onLoaderFrame(e, r, n, function() {
                        return null != a ? t(a) : s(o)
                    });
                    util.requestFrame(i)
                })
            };
        module.exports = useLoader;

    }, {
        "../constants/ActionTypes": 63,
        "../constants/LoaderMessages": 65,
        "../utilities": 87,
        "es6-promise": "es6-promise"
    }],
    10: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            MfaStatus = require("../constants/MfaStatus"),
            accountNumbers = require("../api/endpoints/accountNumbers"),
            useLoader = require("./loader"),
            util = require("../utilities"),
            goBack = function() {
                return function(t, u) {
                    var e = u().longtailAuth.currentStep;
                    switch (e) {
                        case "account":
                            return t({
                                type: ActionTypes.STEP_TO_ROUTING
                            });
                        case "routing":
                            return t({
                                type: ActionTypes.GO_BACK_TO_SELECT_ACCOUNT
                            });
                        default:
                            throw new Error("invalid longtailAuth step ")
                    }
                }
            },
            submitAccount = function() {
                return function(t, u) {
                    var e = u().longtailAuth.accountNumber,
                        n = /^[a-z0-9]{4,17}$/i.test(e);
                    return n !== !1 ? t(submitLongtailAuth()) : (t({
                        type: ActionTypes.INVALIDATE_LONGTAIL_AUTH,
                        errorMessage: "Invalid account number"
                    }), void setTimeout(function() {
                        return t({
                            type: ActionTypes.RESTORE_LONGTAIL_AUTH
                        })
                    }, 500))
                }
            },
            submitRouting = function() {
                return function(t, u) {
                    var e = u().longtailAuth.routingNumber,
                        n = util.validateRoutingNumber(e);
                    n === !1 ? (t({
                        type: ActionTypes.INVALIDATE_LONGTAIL_AUTH,
                        errorMessage: "Invalid routing number"
                    }), setTimeout(function() {
                        return t({
                            type: ActionTypes.RESTORE_LONGTAIL_AUTH
                        })
                    }, 500)) : t({
                        type: ActionTypes.STEP_TO_ACCOUNT
                    })
                }
            },
            submitLongtailAuth = function() {
                return function(t, u) {
                    t({
                        type: ActionTypes.LONGTAIL_AUTH_REQUEST_SUBMIT
                    });
                    var e = u(),
                        n = accountNumbers.submit(e);
                    return useLoader(MfaStatus.REQUIRES_CREDENTIALS, t, u, n).then(function(u) {
                        return t({
                            type: ActionTypes.LONGTAIL_AUTH_REQUEST_SUCCESS,
                            statusCode: u.statusCode
                        })
                    }).catch(function(u) {
                        return t({
                            type: ActionTypes.LONGTAIL_AUTH_REQUEST_FAILURE,
                            error: u.body,
                            statusCode: u.statusCode
                        })
                    })
                }
            },
            updateInput = function(t) {
                return function(u, e) {
                    var n = e().longtailAuth.currentStep;
                    switch (n) {
                        case "account":
                            return u({
                                type: ActionTypes.UPDATE_ACCOUNT_NUMBER,
                                accountNumber: t
                            });
                        case "routing":
                            return u({
                                type: ActionTypes.UPDATE_ROUTING_NUMBER,
                                routingNumber: t
                            });
                        default:
                            throw new Error("invalid longtailAuth step")
                    }
                }
            };
        module.exports = {
            goBack: goBack,
            submitAccount: submitAccount,
            submitRouting: submitRouting,
            updateInput: updateInput
        };

    }, {
        "../api/endpoints/accountNumbers": 17,
        "../constants/ActionTypes": 63,
        "../constants/MfaStatus": 66,
        "../utilities": 87,
        "./loader": 9
    }],
    11: [function(require, module, exports) {
        "use strict";

        function _toConsumableArray(t) {
            if (Array.isArray(t)) {
                for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
                return n
            }
            return Array.from(t)
        }
        var ActionTypes = require("../constants/ActionTypes"),
            MfaStatus = require("../constants/MfaStatus"),
            authenticateMfaApi = require("../api/endpoints/authenticateMfa"),
            useLoader = require("./loader"),
            util = require("../utilities"),
            submitMfaDevice = function(t) {
                return function(e, n) {
                    e({
                        type: ActionTypes.UPDATE_MFA_DEVICE,
                        device: t
                    });
                    var r = n().mfa.device.value,
                        u = JSON.stringify(r);
                    return e(submitMfa(u))
                }
            },
            updateMfaCode = function(t) {
                return {
                    type: ActionTypes.UPDATE_MFA_CODE,
                    code: t
                }
            },
            submitMfaCode = function() {
                return function(t, e) {
                    var n = e().mfa.code.value;
                    return 0 !== n.length ? t(submitMfa(n)) : (t({
                        type: ActionTypes.INVALIDATE_MFA_CODE
                    }), void setTimeout(function() {
                        return t({
                            type: ActionTypes.RESTORE_MFA_CODE
                        })
                    }, 510))
                }
            },
            resendMfaCode = function() {
                return function(t, e) {
                    t({
                        type: ActionTypes.RESEND_MFA_CODE
                    });
                    var n = e().mfa.device.value,
                        r = JSON.stringify(n);
                    return t(submitMfa(r))
                }
            },
            updateMfaQuestionCurrentAnswer = function(t) {
                return {
                    type: ActionTypes.UPDATE_MFA_QUESTION_CURRENT_ANSWER,
                    answer: t
                }
            },
            submitMfaQuestion = function() {
                return function(t, e) {
                    var n = e(),
                        r = n.mfa.question.currentAnswer,
                        u = n.mfa.question.answers,
                        s = n.response.mfa;
                    return 0 !== r.length ? t(u.length + 1 < s.length ? {
                        type: ActionTypes.NEXT_MFA_QUESTION
                    } : submitMfa([].concat(_toConsumableArray(u), [r]))) : (t({
                        type: ActionTypes.INVALIDATE_MFA_QUESTION
                    }), void setTimeout(function() {
                        return t({
                            type: ActionTypes.RESTORE_MFA_QUESTION
                        })
                    }, 510))
                }
            },
            selectMfaAnswer = function(t) {
                return function(e, n) {
                    e({
                        type: ActionTypes.UPDATE_MFA_SELECTION,
                        answer: t
                    });
                    var r = n();
                    if (r.mfa.selection.answers.length === r.response.mfa.length) {
                        var u = JSON.stringify(r.mfa.selection.answers);
                        return e(submitMfa(u))
                    }
                }
            },
            submitMfa = function(t) {
                return function(e, n) {
                    e({
                        type: ActionTypes.SUBMIT_MFA
                    });
                    var r = n(),
                        u = authenticateMfaApi.submit(t, r);
                    return useLoader(MfaStatus.REQUIRES_CREDENTIALS, e, n, u).then(function(t) {
                        return util.hasNoDepositoryAccounts(r, t) ? Promise.reject({
                            body: {
                                code: "no-depository-accounts"
                            },
                            statusCode: t.statusCode
                        }) : void e({
                            type: util.mapStatusToAction(t.data.status),
                            data: t.data,
                            statusCode: t.statusCode
                        })
                    }).catch(function(t) {
                        return e({
                            type: ActionTypes.MFA_REQUEST_FAILURE,
                            error: t.body,
                            statusCode: t.statusCode
                        })
                    })
                }
            };
        module.exports = {
            resendMfaCode: resendMfaCode,
            selectMfaAnswer: selectMfaAnswer,
            submitMfaCode: submitMfaCode,
            submitMfaDevice: submitMfaDevice,
            submitMfaQuestion: submitMfaQuestion,
            updateMfaCode: updateMfaCode,
            updateMfaQuestionCurrentAnswer: updateMfaQuestionCurrentAnswer
        };

    }, {
        "../api/endpoints/authenticateMfa": 19,
        "../constants/ActionTypes": 63,
        "../constants/MfaStatus": 66,
        "../utilities": 87,
        "./loader": 9
    }],
    12: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            Panes = require("../constants/Panes"),
            util = require("../utilities"),
            connected = require("./connected"),
            windowActions = require("./window"),
            closeExitPrompt = function() {
                return {
                    type: ActionTypes.CLOSE_EXIT_PROMPT
                }
            },
            openExitPrompt = function() {
                return function(e, n) {
                    var t = n();
                    switch (t.panes.currentPane) {
                        case Panes.CONNECTED_PANE:
                            return e(t.configuration.selectAccount || util.isLongtailAuth(t) ? {
                                type: ActionTypes.OPEN_EXIT_PROMPT
                            } : connected.connectedContinue());
                        case Panes.INSTITUTION_SELECT_PANE:
                            return e(windowActions.closeLink());
                        default:
                            return e({
                                type: ActionTypes.OPEN_EXIT_PROMPT
                            })
                    }
                }
            },
            goBack = function() {
                return function(e, n) {
                    var t = n();
                    switch (t.panes.currentPane) {
                        case Panes.CREDENTIAL_PANE:
                        case Panes.LOADING_PANE:
                            return e({
                                type: ActionTypes.GO_BACK_TO_INSTITUTION_SELECT
                            });
                        case Panes.MFA_CODE_PANE:
                            return e({
                                type: ActionTypes.GO_BACK_TO_MFA_DEVICE
                            });
                        case Panes.LONGTAIL_AUTH_PANE:
                            return e({
                                type: ActionTypes.GO_BACK_TO_SELECT_ACCOUNT
                            });
                        default:
                            throw new Error("Invalid goBack action, specify an explicit pane")
                    }
                }
            };
        module.exports = {
            closeExitPrompt: closeExitPrompt,
            openExitPrompt: openExitPrompt,
            goBack: goBack
        };

    }, {
        "../constants/ActionTypes": 63,
        "../constants/Panes": 67,
        "../utilities": 87,
        "./connected": 2,
        "./window": 14
    }],
    13: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            confirmAccount = function() {
                return function(n, t) {
                    var c = t();
                    return n({
                        type: ActionTypes.CONFIRM_ACCOUNT,
                        state: c
                    })
                }
            },
            selectAccount = function(n) {
                return {
                    type: ActionTypes.SELECT_ACCOUNT,
                    account: n
                }
            },
            deselectAccount = function() {
                return {
                    type: ActionTypes.DESELECT_ACCOUNT
                }
            },
            incrementAccountPagination = function() {
                return {
                    type: ActionTypes.INCREMENT_ACCOUNT_PAGINATION
                }
            },
            decrementAccountPagination = function() {
                return {
                    type: ActionTypes.DECREMENT_ACCOUNT_PAGINATION
                }
            };
        module.exports = {
            confirmAccount: confirmAccount,
            deselectAccount: deselectAccount,
            decrementAccountPagination: decrementAccountPagination,
            incrementAccountPagination: incrementAccountPagination,
            selectAccount: selectAccount
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    14: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../constants/ActionTypes"),
            openLink = function() {
                return function(n, t) {
                    var e = t();
                    n(null != e.institutionSelect.selectedInstitution.id ? {
                        type: ActionTypes.OPEN_LINK_AT_INSTITUTION
                    } : {
                        type: ActionTypes.OPEN_LINK
                    })
                }
            },
            closeLink = function() {
                return {
                    type: ActionTypes.EXIT_LINK
                }
            },
            handoff = function() {
                return {
                    type: ActionTypes.HANDOFF
                }
            };
        module.exports = {
            closeLink: closeLink,
            handoff: handoff,
            openLink: openLink
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    15: [function(require, module, exports) {
        "use strict";
        var mixpanel = require("mixpanel-browser"),
            Rollbar = require("rollbar-browser"),
            MIXPANEL_TOKEN = "34cfc1f72d1be25870021a9a571e12a6",
            ROLLBAR_CONFIG = {
                accessToken: "d451244886ce466ea37424b4c706e64f",
                captureUncaught: !0,
                payload: {
                    environment: "production"
                }
            };
        mixpanel.init(MIXPANEL_TOKEN);
        var sanitizeState = function(e, t) {
                return {
                    actionType: t.type,
                    apiRequestId: e.response.apiRequestId,
                    clientName: e.configuration.clientName,
                    currentPane: e.panes.currentPane,
                    env: e.configuration.env,
                    errorCode: e.error.code,
                    errorMessage: e.error.message,
                    institution: e.institutionSelect.selectedInstitution,
                    isCustomInitializer: e.configuration.isCustomInitializer,
                    isMobile: e.configuration.isMobile,
                    isPatch: e.configuration.isPatch,
                    itemStatus: e.response.status,
                    linkRequestId: e.response.linkRequestId,
                    longtail: e.configuration.longtail,
                    longtailAuthEnabled: e.configuration.longtailAuthEnabled,
                    origin: e.configuration.origin,
                    product: e.configuration.product,
                    productsEnabled: e.configuration.productsEnabled,
                    selectAccount: e.configuration.selectAccount,
                    statusCode: e.response.statusCode,
                    useSandbox: e.configuration.useSandbox
                }
            },
            reportError = function(e, t, n) {
                var i = Rollbar.init(ROLLBAR_CONFIG),
                    r = t(),
                    o = sanitizeState(r, n);
                i.configure({
                    payload: {
                        link_state: o
                    }
                }), i.error(e)
            },
            trackEvent = function(e, t, n) {
                var i = t();
                if ("production" === i.configuration.env) {
                    var r = sanitizeState(i, n);
                    mixpanel.track(e, r)
                }
            };
        module.exports = {
            _sanitizeState: sanitizeState,
            reportError: reportError,
            trackEvent: trackEvent
        };

    }, {
        "mixpanel-browser": "mixpanel-browser",
        "rollbar-browser": "rollbar-browser"
    }],
    16: [function(require, module, exports) {
        "use strict";
        var _Promise = "undefined" == typeof Promise ? require("es6-promise").Promise : Promise,
            AbortablePromise = function o(t) {
                if (!(this instanceof o)) return new o(t);
                this._onAbort = null, this._isAborted = !1;
                var r = this;
                this._promise = new _Promise(function(o, e) {
                    new _Promise(t).then(function(t) {
                        return r._isAborted ? null : o(t)
                    }, function(o) {
                        return r._isAborted ? null : e(o)
                    })
                })
            },
            proxyMethod = function(o, t) {
                return function() {
                    return this[o][t].apply(this[o], arguments)
                }
            };
        AbortablePromise.prototype.abort = function() {
            this._isAborted = !0, "function" == typeof this._onAbort && this._onAbort()
        }, AbortablePromise.prototype.onAbort = function(o) {
            if ("function" != typeof o) throw new Error("onAbort must be a Function");
            this._onAbort = o
        }, AbortablePromise.prototype.then = proxyMethod("_promise", "then"), AbortablePromise.prototype.catch = proxyMethod("_promise", "catch"), module.exports = AbortablePromise;

    }, {
        "es6-promise": "es6-promise"
    }],
    17: [function(require, module, exports) {
        "use strict";
        var api = require("../interface"),
            createBody = function(e) {
                return {
                    account_id: e.selectAccount.selectedAccount._id,
                    account_number: e.longtailAuth.accountNumber,
                    public_key: e.configuration.key,
                    public_token: e.response.publicToken,
                    routing_number: e.longtailAuth.routingNumber
                }
            },
            submit = function(e) {
                return api.request({
                    method: "POST",
                    url: e.configuration.linkUrl + "/account/numbers",
                    body: createBody(e)
                })
            };
        module.exports = {
            submit: submit
        };

    }, {
        "../interface": 24
    }],
    18: [function(require, module, exports) {
        "use strict";
        var api = require("../interface"),
            util = require("../../utilities"),
            createBody = function(t) {
                return {
                    env: t.configuration.env,
                    include_accounts: t.configuration.selectAccount || util.isLongtailAuth(t),
                    institution_type: t.institutionSelect.selectedInstitution.id,
                    password: t.credentials.password,
                    pin: t.credentials.pin,
                    product: t.configuration.product,
                    public_key: t.configuration.key,
                    public_token: t.configuration.token,
                    username: t.credentials.username,
                    webhook: t.configuration.webhook
                }
            },
            getUrl = function(t) {
                return t.configuration.isPatch ? "/authenticate/update" : "/authenticate"
            },
            submit = function(t) {
                return api.request({
                    method: "POST",
                    url: t.configuration.linkUrl + getUrl(t),
                    body: createBody(t)
                })
            };
        module.exports = {
            _getUrl: getUrl,
            submit: submit
        };

    }, {
        "../../utilities": 87,
        "../interface": 24
    }],
    19: [function(require, module, exports) {
        "use strict";
        var api = require("../interface"),
            util = require("../../utilities"),
            createBody = function(i, t) {
                return {
                    env: t.configuration.env,
                    include_accounts: t.configuration.selectAccount || util.isLongtailAuth(t),
                    mfa: i,
                    product: t.configuration.product,
                    public_key: t.configuration.key,
                    public_token: t.response.publicToken,
                    webhook: t.configuration.webhook
                }
            },
            submit = function(i, t) {
                return api.request({
                    method: "POST",
                    url: t.configuration.linkUrl + "/authenticate/mfa",
                    body: createBody(i, t)
                })
            };
        module.exports = {
            submit: submit
        };

    }, {
        "../../utilities": 87,
        "../interface": 24
    }],
    20: [function(require, module, exports) {
        "use strict";
        var api = require("../interface"),
            validate = function(e) {
                return api.request({
                    method: "POST",
                    url: e.linkUrl + "/client/info",
                    body: {
                        public_key: e.key
                    }
                })
            };
        module.exports = {
            validate: validate
        };

    }, {
        "../interface": 24
    }],
    21: [function(require, module, exports) {
        "use strict";
        var api = require("../../interface");
        module.exports = function(e) {
            return api.request({
                method: "POST",
                url: e.linkUrl + "/institution/token",
                body: {
                    public_key: e.key,
                    public_token: e.token
                }
            })
        };

    }, {
        "../../interface": 24
    }],
    22: [function(require, module, exports) {
        "use strict";
        var api = require("../../interface");
        module.exports = function(t, e) {
            return api.request({
                method: "POST",
                url: t.linkUrl + "/institution/type",
                body: {
                    public_key: t.key,
                    institution_type: e
                }
            })
        };

    }, {
        "../../interface": 24
    }],
    23: [function(require, module, exports) {
        "use strict";
        var api = require("../../interface"),
            util = require("../../../utilities"),
            getUrlParameters = function(e, r) {
                return util.filterNull(["q=" + encodeURIComponent(r), util.isLongtailAuth(e) ? null : "p=" + e.configuration.product]).join("&")
            },
            currentSearchRequest = null,
            search = function(e, r) {
                null != currentSearchRequest && (currentSearchRequest.abort(), currentSearchRequest = null);
                var t = "zzz PROVIDENT BANK NY (NOW STERLING NATIONAL BANK)",
                    n = {
                        id: "11544",
                        name: "ZZZ Provident Bank NY (now Sterling National Bank)",
                        products: {
                            auth: !1,
                            balance: !0,
                            connect: !0,
                            info: !1
                        },
                        forgottenPassword: "https://www.snb.com/",
                        accountLocked: "https://www.snb.com/",
                        accountSetup: "https://www.snb.com/",
                        video: null,
                        fields: [{
                            name: "username",
                            label: "Username",
                            type: "text"
                        }, {
                            name: "password",
                            label: "Password",
                            type: "password"
                        }],
                        colors: {
                            light: "#327faa",
                            primary: "#00668f",
                            dark: "#004369",
                            darker: "#00375c"
                        },
                        logo: null,
                        nameBreak: null
                    };
                if (r === t) return Promise.resolve(api.ApiResponse([n], 200));
                switch (r) {
                    case "":
                        return Promise.resolve(api.ApiResponse([], 200));
                    default:
                        return currentSearchRequest = api.request({
                            method: "GET",
                            url: [e.configuration.apiUrl, "/institutions/search?", getUrlParameters(e, r)].join("")
                        })
                }
            };
        module.exports = {
            search: search
        };

    }, {
        "../../../utilities": 87,
        "../../interface": 24
    }],
    24: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                }
                return e
            },
            AbortablePromise = require("./AbortablePromise"),
            request = require("./request"),
            util = require("../utilities"),
            ApiErrorType = {
                ERROR: "ERROR",
                TIMEOUT: "TIMEOUT"
            },
            ApiError = function e(r, t, n, o) {
                return this instanceof e ? (this.body = util.checkType(function(e) {
                    return null != e
                }, "body must be non-null", t), this.type = util.checkType(function(e) {
                    return null != ApiErrorType[e]
                }, "type was not an ApiErrorType", r), this.message = util.checkTypeName("string", !1, "message was not a String", n), void(this.statusCode = util.checkTypeName("number", !1, "statusCode was not a Number", o))) : new e(r, t, n, o)
            },
            ApiResponse = function e(r, t) {
                return this instanceof e ? (this.data = r, void(this.statusCode = util.checkTypeName("number", !1, "statusCode was not a Number", t))) : new e(r, t)
            },
            apiRequest = function(e) {
                util.checkTypeName("object", !1, "config must be an Object", e), util.checkTypeName("object", !0, "config.body must be an Object if provided", e.body), util.checkTypeName("string", !0, "config.contentType must be a String if provided", e.contentType), util.checkType(function(e) {
                    return null == e || /^GET|POST$/.test(e)
                }, 'config.method must be "GET" or "POST" if provided', e.method), util.checkTypeName("string", !1, "config.url must be a String", e.url);
                var r = null,
                    t = new AbortablePromise(function(t, n) {
                        r = request(_extends({}, e, {
                            onError: function(e, t) {
                                var o = "string" == typeof r.responseText.resolve ? r.responseText.resolve : "";
                                n(ApiError(ApiErrorType.ERROR, t, o, e))
                            },
                            onLoad: function(e, r) {
                                return t(ApiResponse(r, e))
                            },
                            onTimeout: function() {
                                return n(ApiError(ApiErrorType.TIMEOUT, {}, "", -1))
                            },
                            parameters: e.body
                        }))
                    });
                return t.onAbort(function() {
                    return r.abort()
                }), t
            };
        module.exports = {
            ApiError: ApiError,
            ApiResponse: ApiResponse,
            request: apiRequest,
            ErrorType: ApiErrorType
        };

    }, {
        "../utilities": 87,
        "./AbortablePromise": 16,
        "./request": 25
    }],
    25: [function(require, module, exports) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
            },
            _extends = Object.assign || function(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = arguments[e];
                    for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o])
                }
                return t
            },
            isIE10 = function() {
                return null != navigator && null != navigator.appVersion && navigator.appVersion.indexOf("MSIE 10") !== -1
            },
            FIVE_MINUTE_TIMEOUT = 3e5,
            normalizeStatusCode = function(t, e) {
                return null != e.statusCode ? e.statusCode : "number" == typeof t.status ? 1223 === t.status ? 204 : t.status : 200
            };
        module.exports = function(t) {
            var e = {
                    contentType: "application/json",
                    method: "post",
                    onTimeout: function() {
                        return null
                    },
                    onError: function() {
                        return null
                    },
                    onLoad: function() {
                        return null
                    },
                    parameters: {},
                    url: ""
                },
                n = _extends({}, e, t),
                o = "function" == typeof XMLHttpRequest || "object" === ("undefined" == typeof XMLHttpRequest ? "undefined" : _typeof(XMLHttpRequest)) ? new XMLHttpRequest : {};
            return "withCredentials" in o ? (o.open(n.method, n.url), o.timeout = FIVE_MINUTE_TIMEOUT, isIE10() ? (o.setRequestHeader("Content-Type", "text/plain"), o.send(JSON.stringify(_extends({}, n.parameters, {
                isXDomainRequest: !0
            })))) : (o.setRequestHeader("Content-Type", n.contentType), o.send(JSON.stringify(n.parameters))), o.onreadystatechange = function(t) {
                if (o.readyState === XMLHttpRequest.DONE) {
                    var e = void 0;
                    try {
                        e = JSON.parse(o.responseText)
                    } catch (t) {
                        e = {}
                    }
                    var r = normalizeStatusCode(o, e);
                    r >= 200 && r < 300 ? n.onLoad(r, e) : n.onError(r, e)
                }
            }) : "undefined" != typeof XDomainRequest ? (o = new XDomainRequest, o.open(n.method, n.url), o.onprogress = function() {
                return null
            }, o.ontimeout = n.onTimeout, o.onerror = n.onError.bind(null, 500, {
                statusCode: 500
            }), o.onload = function() {
                try {
                    var t = JSON.parse(o.responseText),
                        e = normalizeStatusCode(o, t);
                    e >= 200 && e < 300 ? n.onLoad(e, t) : n.onError(e, t)
                } catch (t) {
                    n.onError(500, {
                        statusCode: 500
                    })
                }
            }, setTimeout(function() {
                var t = _extends({}, n.parameters, {
                    isXDomainRequest: !0
                });
                o.send(JSON.stringify(t))
            }, 0)) : n.onError(null, "Failed attempt to make request: incompatible browser."), o
        };

    }, {}],
    26: [function(require, module, exports) {
        "use strict";
        var actions = require("./actions"),
            analytics = require("./analytics"),
            util = require("./utilities"),
            clientInfoApi = require("./api/endpoints/clientInfo"),
            create = function(i) {
                return function(t) {
                    return i.dispatch(actions.configuration.initializeConfig(t))
                }
            },
            open = function(i) {
                return function(t) {
                    var e = i.getState();
                    clientInfoApi.validate(e.configuration).then(function(n) {
                        var a = n.data.products;
                        return i.dispatch(actions.configuration.updateConfig({
                            longtailAuthEnabled: n.data.longtailAuthEnabled === !0,
                            productsEnabled: a
                        })), a && a.indexOf(e.configuration.product) < 0 ? Promise.reject('Error authenticating public key. This public key is not enabled for product "' + e.configuration.product + '". Please contact support@plaid.com to be enabled.') : void(util.isPlaidInstitution(t) ? i.dispatch(actions.initialize.initializePlaidType(t)) : util.isLongtailInstitution(t) ? i.dispatch(actions.initialize.initializeLongtailType(t)) : util.isPatch(e.configuration) ? i.dispatch(actions.initialize.initializeWithToken()) : i.dispatch(actions.initialize.initializeInstitutionSelect()))
                    }).catch(function(t) {
                        switch (t.statusCode) {
                            case 0:
                            case 401:
                                break;
                            default:
                                try {
                                    analytics.reportError("Link Error: " + JSON.stringify(t), i.getState, {})
                                } catch (e) {
                                    analytics.reportError("Link Error: " + t, i.getState, {})
                                }
                        }
                        var e = null != t ? t : "Error retrieving info for public key. Make sure that the entered key is correct. If error persists, contact support@plaid.com";
                        console.error(e), i.dispatch(actions.window.closeLink())
                    })
                }
            },
            createApi = function(i) {
                return {
                    create: create(i),
                    open: open(i)
                }
            };
        module.exports = {
            create: createApi
        };

    }, {
        "./actions": 5,
        "./analytics": 15,
        "./api/endpoints/clientInfo": 20,
        "./utilities": 87
    }],
    27: [function(require, module, exports) {
        "use strict";
        var classnames = require("classnames"),
            React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../actions"),
            Panes = require("../constants/Panes"),
            PropTypes = require("../constants/PropTypes"),
            SandboxMessage = require("./partials/SandboxMessage"),
            ConnectedPane = require("./ConnectedPane").connect,
            CredentialPane = require("./CredentialPane").connect,
            ErrorPane = require("./ErrorPane").connect,
            ExitButton = require("./partials/ExitButton"),
            ExitPane = require("./ExitPane").connect,
            InstitutionSelectPane = require("./InstitutionSelectPane").connect,
            LoadingPane = require("./LoadingPane").connect,
            LongtailAuthPane = require("./LongtailAuthPane").connect,
            MfaCodePane = require("./MfaCodePane").connect,
            MfaDevicePane = require("./MfaDevicePane").connect,
            MfaQuestionPane = require("./MfaQuestionPane").connect,
            MfaSelectionPane = require("./MfaSelectionPane").connect,
            SelectAccountPane = require("./SelectAccountPane").connect,
            selectPane = function(e) {
                switch (e) {
                    case Panes.CONNECTED_PANE:
                        return React.createElement(ConnectedPane, null);
                    case Panes.CREDENTIAL_PANE:
                        return React.createElement(CredentialPane, null);
                    case Panes.ERROR_PANE:
                        return React.createElement(ErrorPane, null);
                    case Panes.EXIT_PANE:
                        return React.createElement(ExitPane, null);
                    case Panes.INSTITUTION_SELECT_PANE:
                        return React.createElement(InstitutionSelectPane, null);
                    case Panes.LOADING_PANE:
                        return React.createElement(LoadingPane, null);
                    case Panes.LONGTAIL_AUTH_PANE:
                        return React.createElement(LongtailAuthPane, null);
                    case Panes.MFA_CODE_PANE:
                        return React.createElement(MfaCodePane, null);
                    case Panes.MFA_DEVICE_PANE:
                        return React.createElement(MfaDevicePane, null);
                    case Panes.MFA_QUESTION_PANE:
                        return React.createElement(MfaQuestionPane, null);
                    case Panes.MFA_SELECTION_PANE:
                        return React.createElement(MfaSelectionPane, null);
                    case Panes.SELECT_ACCOUNT_PANE:
                        return React.createElement(SelectAccountPane, null);
                    case "":
                        return null;
                    default:
                        throw new Error("Invalid pane: " + e)
                }
            },
            App = function(e) {
                var n = classnames({
                        "disable-animations": e.disableAnimations,
                        "disable-effects": e.disableEffects,
                        ie9: e.isIE9,
                        "margin-top": !e.isMobile && window.innerHeight <= 588,
                        mobile: e.isMobile,
                        "sandbox-mode": e.useSandbox
                    }),
                    a = 0 !== e.currentPane.length,
                    t = classnames("overlay-view", {
                        active: e.isActive,
                        inactive: !e.isActive
                    }),
                    i = classnames(e.animationClass, {
                        "credentials-pane": e.currentPane === Panes.CREDENTIAL_PANE && a,
                        "large-pane": e.currentPane === Panes.INSTITUTION_SELECT_PANE && a,
                        "small-pane": e.currentPane !== Panes.INSTITUTION_SELECT_PANE && e.currentPane !== Panes.CREDENTIAL_PANE && a,
                        "three-input-form": "usaa" === e.selectedInstitution.id && a
                    });
                return React.createElement("div", {
                    className: n
                }, React.createElement("div", {
                    className: t
                }, React.createElement("div", {
                    className: "link-view"
                }, React.createElement("div", {
                    className: i
                }, e.showExitPane ? null : React.createElement(ExitButton, {
                    onClick: e.onClickExit
                }), selectPane(e.currentPane), e.showExitPane ? React.createElement(ExitPane, null) : null))), e.useSandbox && !e.isMobile ? React.createElement(SandboxMessage, null) : null)
            };
        App.displayName = "App", App.propTypes = {
            animationClass: React.PropTypes.string,
            currentPane: React.PropTypes.string.isRequired,
            disableAnimations: React.PropTypes.bool.isRequired,
            disableEffects: React.PropTypes.bool.isRequired,
            isActive: React.PropTypes.bool.isRequired,
            isIE9: React.PropTypes.bool.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onClickExit: React.PropTypes.func.isRequired,
            selectedInstitution: PropTypes.institution,
            showExitPane: React.PropTypes.bool.isRequired,
            useSandbox: React.PropTypes.bool.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    animationClass: e.panes.animationClass,
                    currentPane: e.panes.currentPane,
                    disableAnimations: e.configuration.disableAnimations,
                    disableEffects: e.configuration.disableEffects,
                    isActive: e.panes.isActive,
                    isIE9: e.configuration.isIE9,
                    isMobile: e.configuration.isMobile,
                    selectedInstitution: e.institutionSelect.selectedInstitution,
                    showExitPane: e.panes.showExitPane,
                    useSandbox: e.configuration.useSandbox
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onClickExit: function() {
                        return e(actions.panes.openExitPrompt())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App),
            App: App
        };

    }, {
        "../actions": 5,
        "../constants/Panes": 67,
        "../constants/PropTypes": 69,
        "./ConnectedPane": 28,
        "./CredentialPane": 30,
        "./ErrorPane": 31,
        "./ExitPane": 32,
        "./InstitutionSelectPane": 37,
        "./LoadingPane": 39,
        "./LongtailAuthPane": 41,
        "./MfaCodePane": 43,
        "./MfaDevicePane": 45,
        "./MfaQuestionPane": 46,
        "./MfaSelectionPane": 48,
        "./SelectAccountPane": 53,
        "./partials/ExitButton": 55,
        "./partials/SandboxMessage": 60,
        "classnames": "classnames",
        "react": "react",
        "react-redux": "react-redux"
    }],
    28: [function(require, module, exports) {
        "use strict";
        var classnames = require("classnames"),
            React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            util = require("../../utilities"),
            InstitutionVideo = require("../partials/InstitutionVideo"),
            Logos = require("../partials/Logos"),
            StaticLogo = require("../partials/StaticLogo"),
            paneStyles = function(e, t) {
                var n = e.colors.primary;
                return t === !1 && null != e.video ? n = "url(img/bgp-" + e.video + ".jpg)" : null != e.colors.dark && (n = "linear-gradient(0deg, " + e.colors.darker + ", " + e.colors.primary + ")"), {
                    borderRadius: "8px",
                    backgroundColor: e.colors.primary,
                    background: n,
                    textAlign: "center",
                    color: "#fff"
                }
            },
            overlayStyles = function(e, t) {
                if (null != Logos[e.id]) {
                    var n = t ? util.rgba.apply(null, util.parseRgbaString(e.colors.primary).concat("0.05")) : util.rgbaFromHexAlpha(e.colors.primary, .05);
                    return {
                        backgroundColor: e.colors.primary,
                        background: "linear-gradient(0deg, " + e.colors.primary + " 20%, " + n + ")"
                    }
                }
                return {}
            },
            successMessageClass = function(e) {
                return classnames("success-message", {
                    "long-success-message": e.clientName.length > 14 || e.isPatch
                })
            },
            messageText = function(e) {
                return e.isPatch ? "reconnected" : "linked"
            },
            ConnectedPane = function(e) {
                return React.createElement("div", {
                    className: "account-connected account-message",
                    style: paneStyles(e.institution, e.isMobile)
                }, React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    display: "block",
                    isMobile: e.isMobile
                }), React.createElement(StaticLogo, {
                    institution: e.institution
                }), React.createElement("div", {
                    className: "color-overlay",
                    style: overlayStyles(e.institution, e.isPatch)
                }), React.createElement("i", {
                    className: "sprite sprite-check"
                }), React.createElement("div", {
                    className: successMessageClass(e)
                }, "Your account was successfully ", messageText(e), " to ", e.clientName), React.createElement("input", {
                    className: "button connected-next-button",
                    type: "button",
                    value: e.selectAccount ? "Select Account" : "Continue",
                    onClick: e.onClickContinue
                }))
            };
        ConnectedPane.displayName = "ConnectedPane", ConnectedPane.propTypes = {
            clientName: React.PropTypes.string.isRequired,
            institution: PropTypes.institution.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            isPatch: React.PropTypes.bool.isRequired,
            onClickContinue: React.PropTypes.func.isRequired,
            selectAccount: React.PropTypes.bool.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    clientName: e.configuration.clientName,
                    institution: e.institutionSelect.selectedInstitution,
                    isMobile: e.configuration.isMobile,
                    isPatch: e.configuration.isPatch,
                    selectAccount: e.configuration.selectAccount
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onClickContinue: function() {
                        return e(actions.connected.connectedContinue())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ConnectedPane),
            ConnectedPane: ConnectedPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../../utilities": 87,
        "../partials/InstitutionVideo": 58,
        "../partials/Logos": 59,
        "../partials/StaticLogo": 61,
        "classnames": "classnames",
        "react": "react",
        "react-redux": "react-redux"
    }],
    29: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ResetPassword = function(e) {
                return React.createElement("a", {
                    className: "outrigger outrigger-forgot fade-up-and-in",
                    href: e.href,
                    target: "_blank"
                }, "Forget your password? ", React.createElement("br", null), "You can reset it ", React.createElement("span", {
                    style: {
                        borderBottom: "1px dotted white"
                    }
                }, "here"), ".")
            };
        ResetPassword.displayName = "ResetPassword", ResetPassword.propTypes = {
            href: React.PropTypes.string.isRequired
        }, module.exports = ResetPassword;

    }, {
        "react": "react"
    }],
    30: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            util = require("../../utilities"),
            ResetPassword = require("./ResetPassword"),
            Banner = require("../partials/Banner"),
            FormError = require("../partials/FormError"),
            Input = require("../partials/Input"),
            InstitutionVideo = require("../partials/InstitutionVideo"),
            submitForm = function(e) {
                return function(t) {
                    t.preventDefault(), e.onSubmit()
                }
            },
            onChange = function(e) {
                return function(t) {
                    switch (t) {
                        case "username":
                            return function(t) {
                                return e.onChangeUsername(t.target.value)
                            };
                        case "password":
                            return function(t) {
                                return e.onChangePassword(t.target.value)
                            };
                        case "pin":
                            return function(t) {
                                return e.onChangePin(t.target.value)
                            };
                        default:
                            throw new Error("invalid fieldName")
                    }
                }
            },
            onKeyDown = function(e) {
                return function(t) {
                    13 === t.keyCode && submitForm(e)(t)
                }
            },
            getFirstEmptyField = function(e, t) {
                return util.find(e.institution.fields, function(t) {
                    return 0 === e[t.name].length
                }) === t
            },
            credentialInputs = function(e) {
                return e.institution.fields.map(function(t, n) {
                    return React.createElement(Input, {
                        autoFocus: getFirstEmptyField(e, t),
                        defaultValue: e[t.name],
                        focus: t.name === e.fieldError,
                        isDirty: t.name === e.fieldError,
                        isMobile: e.isMobile,
                        key: t.name,
                        label: t.label,
                        maxLength: "pin" === t.name ? 4 : null,
                        name: t.name,
                        onChange: onChange(e)(t.name),
                        onKeyDown: onKeyDown(e),
                        type: t.type
                    })
                })
            },
            backButton = function(e) {
                return e.hideBackButton ? null : React.createElement("input", {
                    type: "button",
                    className: "button back-button",
                    onClick: e.onClickBack
                })
            },
            errors = function(e) {
                var t = ["1200", "1201", "1202", "1209"];
                return t.indexOf(e.errorCode) === -1 || e.hideOutriggers ? null : React.createElement(FormError, {
                    errorCode: e.errorCode
                })
            },
            resetPassword = function(e) {
                return e.hideOutriggers ? null : React.createElement(ResetPassword, {
                    href: e.institution.forgottenPassword
                })
            },
            submitButtonClasses = function(e) {
                return util.filter(["button", "submit-button", e ? "sans-back-button" : void 0], function(e) {
                    return null != e
                })
            },
            CredentialPane = function(e) {
                return React.createElement("div", {
                    className: "a-form credentials-component",
                    "data-institution": e.institution.id,
                    style: {
                        paddingTop: "38px"
                    }
                }, React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    noVideo: !0,
                    isMobile: e.isMobile
                }), React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    display: "none",
                    isMobile: e.isMobile
                }), React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !1
                })), React.createElement("form", {
                    className: "credentials-form",
                    onSubmit: submitForm(e),
                    autoComplete: "off",
                    noValidate: "novalidate"
                }, credentialInputs(e), backButton(e), React.createElement("input", {
                    className: submitButtonClasses(e.hideBackButton).join(" "),
                    type: "submit",
                    value: "Submit"
                }), React.createElement("span", {
                    style: {
                        clear: "both"
                    }
                })), errors(e), resetPassword(e))
            };
        CredentialPane.displayName = "CredentialPane", CredentialPane.propTypes = {
            errorCode: React.PropTypes.string,
            hideBackButton: React.PropTypes.bool.isRequired,
            hideOutriggers: React.PropTypes.bool.isRequired,
            institution: PropTypes.institution.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onChangePassword: React.PropTypes.func.isRequired,
            onChangePin: React.PropTypes.func,
            onChangeUsername: React.PropTypes.func.isRequired,
            onClickBack: React.PropTypes.func.isRequired,
            onSubmit: React.PropTypes.func.isRequired,
            password: React.PropTypes.string.isRequired,
            pin: React.PropTypes.string,
            username: React.PropTypes.string
        };
        var mapStateToProps = function(e) {
                return {
                    errorCode: e.error.code,
                    fieldError: e.credentials.fieldError,
                    hideBackButton: e.credentials.hideBackButton,
                    hideOutriggers: e.panes.hideOutriggers,
                    institution: e.institutionSelect.selectedInstitution,
                    isMobile: e.configuration.isMobile,
                    password: e.credentials.password,
                    pin: e.credentials.pin,
                    username: e.credentials.username
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onChangePassword: function(t) {
                        return e(actions.credentials.updatePassword(t))
                    },
                    onChangePin: function(t) {
                        return e(actions.credentials.updatePin(t))
                    },
                    onChangeUsername: function(t) {
                        return e(actions.credentials.updateUsername(t))
                    },
                    onClickBack: function() {
                        return e(actions.panes.goBack())
                    },
                    onSubmit: function() {
                        return e(actions.credentials.submitCredentials())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CredentialPane),
            CredentialPane: CredentialPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../../utilities": 87,
        "../partials/Banner": 54,
        "../partials/FormError": 56,
        "../partials/Input": 57,
        "../partials/InstitutionVideo": 58,
        "./ResetPassword": 29,
        "react": "react",
        "react-redux": "react-redux"
    }],
    31: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            InstitutionVideo = require("../partials/InstitutionVideo"),
            StaticLogo = require("../partials/StaticLogo"),
            overlayStyles = function(e) {
                return {
                    borderRadius: "0 0 6px 6px",
                    backgroundColor: e.colors.primary,
                    backgroundImage: "linear-gradient(" + e.colors.darker + "," + e.colors.darker + ")"
                }
            },
            paneStyles = function(e) {
                var r = void 0,
                    t = e.institution;
                return r = e.isMobile === !1 && null != t.video ? 'url("img/bgp-' + t.video + '.jpg")' : null != t.colors.dark ? "linear-gradient(0deg," + [t.colors.darker, t.colors.primary].join(",") + ")" : t.colors.primary, {
                    borderRadius: "8px",
                    backgroundColor: t.colors.primary,
                    background: r,
                    textAlign: "center",
                    color: "#fff"
                }
            },
            ErrorPane = function(e) {
                return React.createElement("div", {
                    className: "account-message error-view",
                    style: paneStyles(e)
                }, React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    display: "block",
                    isMobile: e.isMobile
                }), React.createElement(StaticLogo, {
                    institution: e.institution
                }), React.createElement("div", {
                    className: "color-overlay",
                    style: overlayStyles(e.institution)
                }), React.createElement("i", {
                    className: "sprite sprite-" + e.error.icon
                }), React.createElement("div", {
                    className: e.error.code + "-error error-content"
                }, React.createElement("div", {
                    className: "title"
                }, e.error.title), React.createElement("p", {
                    className: "message",
                    dangerouslySetInnerHTML: {
                        __html: e.error.message
                    }
                }), React.createElement("input", {
                    className: "button error-button",
                    type: "button",
                    value: e.error.button,
                    onClick: e.onClickAcknowledge
                })))
            };
        ErrorPane.displayName = "ErrorPane", ErrorPane.propTypes = {
            error: PropTypes.error.isRequired,
            institution: PropTypes.institution.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onClickAcknowledge: React.PropTypes.func.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    error: e.error,
                    institution: e.institutionSelect.selectedInstitution,
                    isMobile: e.configuration.isMobile
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onClickAcknowledge: function() {
                        return e(actions.error.acknowledgeError())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ErrorPane),
            ErrorPane: ErrorPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/InstitutionVideo": 58,
        "../partials/StaticLogo": 61,
        "react": "react",
        "react-redux": "react-redux"
    }],
    32: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            ExitPane = function(e) {
                return React.createElement("div", {
                    className: "account-message exit-view"
                }, React.createElement("div", {
                    className: "exit-content"
                }, React.createElement("i", {
                    className: "sprite sprite-exit"
                }), React.createElement("div", {
                    className: "title"
                }, "Are you sure", React.createElement("br", null), " you want to exit?"), React.createElement("div", {
                    className: "subhead"
                }, "Your progress will be lost and your credentials will be removed for your security"), React.createElement("div", {
                    className: "button-container"
                }, React.createElement("input", {
                    className: "button",
                    type: "button",
                    value: "Back",
                    onClick: e.onClickContinue
                }), React.createElement("input", {
                    className: "button",
                    type: "button",
                    value: "Confirm",
                    onClick: e.onClickExit
                }))))
            };
        ExitPane.displayName = "ExitPane", ExitPane.propTypes = {
            onClickContinue: React.PropTypes.func.isRequired,
            onClickExit: React.PropTypes.func.isRequired
        };
        var mapDispatchToProps = function(e) {
            return {
                onClickContinue: function() {
                    return e(actions.panes.closeExitPrompt())
                },
                onClickExit: function() {
                    return e(actions.window.closeLink())
                }
            }
        };
        module.exports = {
            connect: ReactRedux.connect(function() {
                return {}
            }, mapDispatchToProps)(ExitPane),
            ExitPane: ExitPane
        };

    }, {
        "../../actions": 5,
        "react": "react",
        "react-redux": "react-redux"
    }],
    33: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            renderError = function(e) {
                return React.createElement("div", {
                    className: "fade-in"
                }, React.createElement("i", {
                    className: "search-icon-alert"
                }), React.createElement("div", {
                    className: "search-message search-message-error"
                }, e))
            },
            renderInitial = function() {
                return React.createElement("div", {
                    className: "message-box fade-in"
                }, React.createElement("div", {
                    className: "bank-icon"
                }), React.createElement("div", {
                    className: "search-message search-message-intro"
                }, "Currently supporting over ", React.createElement("span", null, "15,000"), " banks and credit unions"))
            },
            renderLoading = function() {
                return React.createElement("div", {
                    className: "loading-spinner"
                })
            },
            renderNoResults = function(e) {
                return React.createElement("div", {
                    className: "fade-in"
                }, React.createElement("i", {
                    className: "search-icon-alert"
                }), React.createElement("div", {
                    className: "search-message empty-results"
                }, "No Institutions were found by the name of ", React.createElement("span", null, e)))
            },
            renderTimeout = function() {
                return React.createElement("div", {
                    className: "fade-in"
                }, React.createElement("i", {
                    className: "search-icon-alert"
                }), React.createElement("div", {
                    className: "search-message empty-results"
                }, "Your search request timed-out, please try again with a better connection"))
            },
            Message = function(e) {
                return e.isTimeout ? renderTimeout() : e.results.length > 0 ? React.createElement("span", null) : 0 === e.query.length ? renderInitial() : e.isLoading ? renderLoading() : 200 === e.requestStatus && 0 === e.results.length ? renderNoResults(e.query) : renderError(e.errorMessage)
            };
        Message.displayName = "Message", Message.propTypes = {
            errorMessage: React.PropTypes.string.isRequired,
            isLoading: React.PropTypes.bool.isRequired,
            isTimeout: React.PropTypes.bool.isRequired,
            query: React.PropTypes.string.isRequired,
            requestStatus: React.PropTypes.number.isRequired,
            results: React.PropTypes.arrayOf(PropTypes.institution).isRequired
        }, module.exports = Message;

    }, {
        "../../constants/PropTypes": 69,
        "react": "react"
    }],
    34: [function(require, module, exports) {
        "use strict";
        var classnames = require("classnames"),
            React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            TYPE_BIG = "TYPE_BIG",
            TYPE_SMALL = "TYPE_SMALL",
            bigLogoStyle = function(e) {
                return {
                    backgroundImage: "url(data:image/png;base64," + e.logo + ")"
                }
            },
            smallLogoStyle = function(e) {
                return {
                    background: e.colors.primary
                }
            },
            itemClasses = function(e, t) {
                return classnames({
                    "big-search-item": e === TYPE_BIG,
                    "small-search-item": e === TYPE_SMALL,
                    focused: t
                })
            },
            PrimaryName = function(e) {
                var t = null != e.institution.nameBreak ? e.institution.name.substr(0, e.institution.nameBreak).trim() : e.institution.name.trim();
                return React.createElement("span", {
                    className: "search-item-primary-name"
                }, t)
            },
            SecondaryName = function(e) {
                if (null != e.institution.nameBreak) {
                    var t = e.institution.name.substr(e.institution.nameBreak).trim();
                    return React.createElement("span", {
                        className: "search-item-secondary-name"
                    }, t)
                }
                return React.createElement("span", null)
            },
            BigSearchItem = function(e) {
                return React.createElement("li", {
                    className: itemClasses(TYPE_BIG, e.isFocused),
                    onClick: e.onClick
                }, React.createElement("i", {
                    className: "big-search-item__logo",
                    style: bigLogoStyle(e.institution)
                }), React.createElement("span", {
                    className: "big-search-item__text"
                }, React.createElement(PrimaryName, {
                    institution: e.institution
                }), React.createElement(SecondaryName, {
                    institution: e.institution
                })))
            },
            SmallSearchItem = function(e) {
                return React.createElement("li", {
                    className: itemClasses(TYPE_SMALL, e.isFocused),
                    onClick: e.onClick
                }, React.createElement("i", {
                    className: "small-search-item__logo-color",
                    style: smallLogoStyle(e.institution)
                }), React.createElement("span", {
                    className: "small-search-item__text"
                }, React.createElement(PrimaryName, {
                    institution: e.institution
                }), React.createElement(SecondaryName, {
                    institution: e.institution
                })))
            },
            Result = function(e) {
                return null != e.institution.logo ? React.createElement(BigSearchItem, {
                    isFocused: e.isFocused,
                    institution: e.institution,
                    onClick: e.onClick
                }) : React.createElement(SmallSearchItem, {
                    isFocused: e.isFocused,
                    institution: e.institution,
                    onClick: e.onClick
                })
            };
        Result._SmallSearchItem = SmallSearchItem, Result._BigSearchItem = BigSearchItem, Result.displayName = "Result", Result.propTypes = {
            institution: PropTypes.institution.isRequired,
            isFocused: React.PropTypes.bool.isRequired,
            onClick: React.PropTypes.func.isRequired
        }, module.exports = Result;

    }, {
        "../../constants/PropTypes": 69,
        "classnames": "classnames",
        "react": "react"
    }],
    35: [function(require, module, exports) {
        "use strict";
        var classnames = require("classnames"),
            React = require("react"),
            ReactCSSTransitionGroup = require("react-addons-css-transition-group"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            Message = require("./Message"),
            Result = require("./Result"),
            KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_ENTER = 13,
            createNavKeyHandler = function(e, t, n) {
                return function(r) {
                    switch (r.keyCode) {
                        case KEY_DOWN:
                            return t();
                        case KEY_ENTER:
                            return n();
                        case KEY_UP:
                            return e();
                        default:
                            return function() {
                                return null
                            }
                    }
                }
            },
            resultsListClasses = function(e) {
                return classnames("search-results", {
                    displayNone: 0 === e.length
                })
            },
            longtailContainerClasses = function(e) {
                return classnames("longtail-container", {
                    "show-results": e
                })
            },
            renderSearchOptions = function(e, t, n) {
                return t.map(function(t, r) {
                    return React.createElement(Result, {
                        key: t.id,
                        onClick: function() {
                            return e(t)
                        },
                        institution: t,
                        isFocused: r === n
                    })
                })
            },
            InstitutionSearch = function(e) {
                return React.createElement("div", {
                    className: "institution-search"
                }, React.createElement("div", {
                    className: "search-container"
                }, React.createElement("i", {
                    className: "icon icon-search"
                }), React.createElement("input", {
                    className: "search-input",
                    placeholder: "Search for your bank",
                    type: "text",
                    defaultValue: e.query,
                    onChange: function(t) {
                        return e.onChangeQuery(t.target.value)
                    },
                    onKeyDown: createNavKeyHandler(e.onMoveUp, e.onMoveDown, e.onSelectIndex),
                    onFocus: e.onFocusQuery,
                    onBlur: e.onBlurQuery
                })), React.createElement("div", {
                    className: longtailContainerClasses(e.isVisible)
                }, React.createElement(Message, {
                    errorMessage: e.errorMessage,
                    isLoading: e.isLoading,
                    isTimeout: e.isTimeout,
                    query: e.query,
                    requestStatus: e.requestStatus,
                    results: e.results
                }), React.createElement(ReactCSSTransitionGroup, {
                    component: "ul",
                    className: resultsListClasses(e.results),
                    transitionName: "institutionSearchItem",
                    transitionEnterTimeout: 1e3,
                    transitionLeaveTimeout: 1e3
                }, renderSearchOptions(e.onSelectInstitution, e.results, e.selectedIndex))))
            };
        InstitutionSearch._renderSearchOptions = renderSearchOptions, InstitutionSearch._createNavKeyHandler = createNavKeyHandler, InstitutionSearch.displayName = "InstitutionSearch", InstitutionSearch.propTypes = {
            errorMessage: React.PropTypes.string.isRequired,
            isLoading: React.PropTypes.bool.isRequired,
            isTimeout: React.PropTypes.bool.isRequired,
            isVisible: React.PropTypes.bool.isRequired,
            onBlurQuery: React.PropTypes.func.isRequired,
            onChangeQuery: React.PropTypes.func.isRequired,
            onFocusQuery: React.PropTypes.func.isRequired,
            onMoveDown: React.PropTypes.func.isRequired,
            onMoveUp: React.PropTypes.func.isRequired,
            onSelectIndex: React.PropTypes.func.isRequired,
            onSelectInstitution: React.PropTypes.func.isRequired,
            query: React.PropTypes.string.isRequired,
            requestStatus: React.PropTypes.number.isRequired,
            results: React.PropTypes.arrayOf(PropTypes.institution).isRequired,
            selectedIndex: React.PropTypes.number.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    errorMessage: e.institutionSearch.errorMessage,
                    isLoading: e.institutionSearch.isLoading,
                    isTimeout: e.institutionSearch.isTimeout,
                    isVisible: e.institutionSearch.isVisible,
                    query: e.institutionSearch.query,
                    requestStatus: e.institutionSearch.requestStatus,
                    results: e.institutionSearch.results,
                    selectedIndex: e.institutionSearch.selectedIndex
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onBlurQuery: function() {
                        return e(actions.institutionSearch.toggleSearch(!1))
                    },
                    onChangeQuery: function(t) {
                        return e(actions.institutionSearch.search(t))
                    },
                    onFocusQuery: function() {
                        return e(actions.institutionSearch.toggleSearch(!0))
                    },
                    onMoveUp: function() {
                        return e(actions.institutionSearch.moveSelectedIndex(-1))
                    },
                    onMoveDown: function() {
                        return e(actions.institutionSearch.moveSelectedIndex(1))
                    },
                    onSelectIndex: function() {
                        return e(actions.institutionSearch.selectCurrentIndex())
                    },
                    onSelectInstitution: function(t) {
                        return e(actions.institutionSelect.selectInstitution(t))
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(InstitutionSearch),
            InstitutionSearch: InstitutionSearch
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "./Message": 33,
        "./Result": 34,
        "classnames": "classnames",
        "react": "react",
        "react-addons-css-transition-group": "react-addons-css-transition-group",
        "react-redux": "react-redux"
    }],
    36: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            Logos = require("../partials/Logos"),
            Option = function(t) {
                var i = "institution-button-logo " + t.institution.id;
                return React.createElement("li", {
                    className: "institution-button button enabled",
                    "data-institution": t.institution.id,
                    onClick: t.onClick
                }, React.createElement("div", {
                    className: i
                }, Logos[t.institution.id]))
            };
        Option.displayName = "Option", Option.propTypes = {
            institution: PropTypes.institution.isRequired,
            onClick: React.PropTypes.func
        }, module.exports = Option;

    }, {
        "../../constants/PropTypes": 69,
        "../partials/Logos": 59,
        "react": "react"
    }],
    37: [function(require, module, exports) {
        "use strict";
        var classnames = require("classnames"),
            React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PlaidInstitutions = require("../../constants/PlaidInstitutions"),
            PropTypes = require("../../constants/PropTypes"),
            Option = require("./Option"),
            InstitutionSearch = require("../InstitutionSearch").connect,
            institutionListClasses = function(t, e) {
                return classnames("institution-list", {
                    "hide-institutions": t && 1 === e
                })
            },
            getPaginationState = function(t, e) {
                switch (t) {
                    case 0:
                        return {
                            className: "view-more",
                            text: "VIEW MORE",
                            nextPageIndex: 1,
                            pageInstitutions: e.slice(0, 8)
                        };
                    case 1:
                        return {
                            className: "go-back",
                            text: "GO BACK",
                            nextPageIndex: 0,
                            pageInstitutions: e.slice(8, e.length)
                        };
                    default:
                        throw new Error("Error retrieving institution list pagination state.")
                }
            },
            getValidInstitutions = function(t, e) {
                return Object.keys(e).map(function(t) {
                    return e[t]
                }).filter(function(e) {
                    return e.products[t] === !0
                }).sort(function(t, e) {
                    return t.index - e.index
                })
            },
            InstitutionSelectPane = function(t) {
                var e = getValidInstitutions(t.product, PlaidInstitutions),
                    n = getPaginationState(t.page, e),
                    i = t.longtail && 1 === t.page ? React.createElement(InstitutionSearch, null) : null,
                    a = n.pageInstitutions.map(function(e) {
                        return React.createElement(Option, {
                            institution: e,
                            key: e.id,
                            onClick: function() {
                                return t.onSelectInstitution(e)
                            }
                        })
                    });
                return React.createElement("div", {
                    className: "institution-select"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement("h1", {
                    className: "header-title"
                }, "Select your bank"), React.createElement("div", {
                    className: "header-stripe"
                })), i, React.createElement("ul", {
                    className: institutionListClasses(t.isSearchVisible, t.page)
                }, a), React.createElement("div", {
                    className: "footer " + n.className,
                    onClick: function() {
                        return t.goToSelectPage(n.nextPageIndex)
                    }
                }, n.text))
            };
        InstitutionSelectPane.displayName = "InstitutionSelectPane", InstitutionSelectPane.propTypes = {
            isSearchVisible: React.PropTypes.bool.isRequired,
            longtail: React.PropTypes.bool.isRequired,
            onSelectInstitution: React.PropTypes.func.isRequired,
            page: React.PropTypes.number.isRequired,
            product: PropTypes.product.isRequired
        }, InstitutionSelectPane._getPaginationState = getPaginationState, InstitutionSelectPane._getValidInstitutions = getValidInstitutions;
        var mapStateToProps = function(t) {
                return {
                    isSearchVisible: t.institutionSearch.isVisible,
                    longtail: t.configuration.longtail,
                    page: t.institutionSelect.page,
                    product: t.configuration.product
                }
            },
            mapDispatchToProps = function(t) {
                return {
                    goToSelectPage: function(e) {
                        return t(actions.institutionSelect.goToSelectPage(e))
                    },
                    onSelectInstitution: function(e) {
                        return t(actions.institutionSelect.selectInstitution(e))
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(InstitutionSelectPane),
            InstitutionSelectPane: InstitutionSelectPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PlaidInstitutions": 68,
        "../../constants/PropTypes": 69,
        "../InstitutionSearch": 35,
        "./Option": 36,
        "classnames": "classnames",
        "react": "react",
        "react-redux": "react-redux"
    }],
    38: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ChooseNewAccount = function(e) {
                return React.createElement("a", {
                    className: "outrigger outrigger-toolong fade-up-and-in",
                    onClick: e.onClick
                }, "Taking too long? ", React.createElement("br", null), "Try a ", React.createElement("span", {
                    style: {
                        borderBottom: "1px dotted white"
                    }
                }, "different account"), ".")
            };
        ChooseNewAccount.displayName = "ChooseNewAccount", ChooseNewAccount.propTypes = {
            onClick: React.PropTypes.func.isRequired
        }, module.exports = ChooseNewAccount;

    }, {
        "react": "react"
    }],
    39: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            ChooseNewAccount = require("./ChooseNewAccount"),
            InstitutionVideo = require("../partials/InstitutionVideo"),
            StaticLogo = require("../partials/StaticLogo"),
            paneStyles = function(e) {
                var t = void 0;
                return t = e.isMobile === !1 && null != e.institution.video ? "url(img/bgp-" + e.institution.video + ".jpg)" : "linear-gradient(0deg, " + e.institution.colors.darker + ", " + e.institution.colors.primary + ")", {
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    backgroundColor: e.institution.colors.primary,
                    backgroundImage: t,
                    textAlign: "center",
                    color: "#fff"
                }
            },
            progressBarStyles = function(e) {
                return {
                    background: e.institution.colors.primary,
                    width: e.percentage + "%"
                }
            },
            progressBarFooterStyles = function(e) {
                return {
                    background: e.institution.colors.darker
                }
            },
            LoadingPane = function(e) {
                return React.createElement("span", null, React.createElement("div", {
                    className: "awaiting-response",
                    style: paneStyles(e)
                }, React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    display: "block",
                    isMobile: e.isMobile
                }), React.createElement(StaticLogo, {
                    institution: e.institution
                }), React.createElement("div", {
                    className: "progress-bar-footer",
                    style: progressBarFooterStyles(e)
                }, React.createElement("div", {
                    className: "progress-bar",
                    style: progressBarStyles(e)
                }), React.createElement("span", {
                    style: {
                        position: "relative"
                    }
                }, e.message))), e.isCustomInitializer || e.hideOutriggers ? null : React.createElement(ChooseNewAccount, {
                    onClick: e.onClickChooseNewAccount
                }))
            };
        LoadingPane.displayName = "LoadingPane", LoadingPane.propTypes = {
            hideOutriggers: React.PropTypes.bool.isRequired,
            institution: PropTypes.institution.isRequired,
            isCustomInitializer: React.PropTypes.bool.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            message: React.PropTypes.string.isRequired,
            onClickChooseNewAccount: React.PropTypes.func.isRequired,
            percentage: React.PropTypes.number.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    hideOutriggers: e.panes.hideOutriggers,
                    institution: e.institutionSelect.selectedInstitution,
                    isCustomInitializer: e.configuration.isCustomInitializer,
                    isMobile: e.configuration.isMobile,
                    message: e.loader.message,
                    percentage: e.loader.percentage
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onClickChooseNewAccount: function() {
                        return e(actions.panes.goBack())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoadingPane),
            LoadingPane: LoadingPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/InstitutionVideo": 58,
        "../partials/StaticLogo": 61,
        "./ChooseNewAccount": 38,
        "react": "react",
        "react-redux": "react-redux"
    }],
    40: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            classnames = require("classnames"),
            util = require("../../utilities"),
            PropTypes = require("../../constants/PropTypes"),
            numberViewStyles = function(e) {
                return {
                    background: util.shadeColor(e.colors.darker, .85),
                    borderBottom: "1px solid " + util.shadeColor(e.colors.darker, .8)
                }
            },
            numberViewFadeStyles = function(e) {
                return {
                    background: ["linear-gradient(to right,", util.shadeColor(e.colors.darker, .85) + " 0%,", "rgba(255, 255, 255, 0) 25%,", "rgba(255, 255, 255, 0) 75%,", util.shadeColor(e.colors.darker, .85) + " 100%)"].join(" "),
                    opacity: 1
                }
            },
            numberViewSliderClass = function(e) {
                return classnames("number-view-slider", {
                    "number-view-slider-large": e.accountNumber.length > 12
                })
            },
            wrapChars = function(e, r) {
                return React.createElement("span", {
                    className: "number-view-masked-digit",
                    key: r
                }, e)
            },
            maskNumber = function(e, r) {
                var t = Array(r + 1).join("â€¢");
                return util.map(wrapChars, e + t.slice(e.length))
            },
            NumberBanner = function(e) {
                return React.createElement("div", {
                    className: "longtail-auth-number-view",
                    style: numberViewStyles(e.institution)
                }, React.createElement("div", {
                    className: numberViewSliderClass(e),
                    style: {
                        left: e.stepData.sliderValue
                    }
                }, React.createElement("div", {
                    className: "number-view-routing"
                }, React.createElement("span", {
                    className: "number-view-masked-digit"
                }, "A"), maskNumber(e.routingNumber, 9)), React.createElement("div", {
                    className: "number-view-account"
                }, maskNumber(e.accountNumber, 12), React.createElement("span", {
                    className: "number-view-masked-digit"
                }, "C"))), React.createElement("div", {
                    className: "number-view-fade",
                    style: numberViewFadeStyles(e.institution)
                }))
            };
        NumberBanner.displayName = "NumberBanner", NumberBanner.propTypes = {
            accountNumber: React.PropTypes.string.isRequired,
            institution: PropTypes.institution.isRequired,
            routingNumber: React.PropTypes.string.isRequired,
            stepData: React.PropTypes.object.isRequired
        }, module.exports = NumberBanner;

    }, {
        "../../constants/PropTypes": 69,
        "../../utilities": 87,
        "classnames": "classnames",
        "react": "react"
    }],
    41: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            NumberBanner = require("./NumberBanner"),
            Banner = require("../partials/Banner"),
            Input = require("../partials/Input"),
            STEPS = {
                routing: {
                    sliderValue: "25%",
                    maxNumberLength: 9,
                    nextButtonValue: "Continue",
                    numberName: "Routing",
                    message: "Your Routing Number is located on the bottom right hand of your checkbook or accessible online."
                },
                account: {
                    sliderValue: "-25%",
                    maxNumberLength: 17,
                    nextButtonValue: "Submit",
                    numberName: "Account",
                    message: "Your Account Number is specific to your personal account, located on your checkbook or online."
                }
            },
            submitForm = function(e, t) {
                switch (e.preventDefault(), t.currentStep) {
                    case "account":
                        return t.onSubmitAccount();
                    case "routing":
                        return t.onSubmitRouting();
                    default:
                        throw new Error("Invalid step")
                }
            },
            getCurrentNumber = function(e) {
                switch (e.currentStep) {
                    case "account":
                        return e.accountNumber;
                    case "routing":
                        return e.routingNumber;
                    default:
                        throw new Error("Invalid step")
                }
            },
            LongtailAuthPane = function(e) {
                var t = STEPS[e.currentStep];
                return React.createElement("div", {
                    className: "a-form"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !0
                })), React.createElement(NumberBanner, {
                    institution: e.institution,
                    accountNumber: e.accountNumber,
                    routingNumber: e.routingNumber,
                    stepData: t
                }), React.createElement("form", {
                    className: "longtail-auth-form",
                    autoComplete: "off",
                    onSubmit: function(t) {
                        return submitForm(t, e)
                    },
                    noValidate: !0
                }, React.createElement("div", {
                    className: "number-input"
                }, React.createElement(Input, {
                    autoFocus: "routing" === e.currentStep,
                    focus: e.isInvalidForm,
                    isDirty: e.isInvalidForm,
                    isMobile: e.isMobile,
                    label: t.numberName,
                    maxLength: t.maxNumberLength,
                    name: "number",
                    onChange: function(t) {
                        return e.onChangeInput(t.target.value)
                    },
                    onKeyDown: function(t) {
                        return 13 === t.keyCode ? submitForm(t, e) : null
                    },
                    type: "text",
                    value: getCurrentNumber(e)
                })), React.createElement("p", {
                    className: "longtail-auth-error"
                }, e.errorMessage), React.createElement("p", {
                    className: "longtail-auth-message"
                }, t.message), React.createElement("input", {
                    type: "button",
                    className: "button back-button",
                    onClick: e.onClickBack
                }), React.createElement("input", {
                    type: "submit",
                    className: "button submit-button",
                    value: t.nextButtonValue
                })))
            };
        LongtailAuthPane.displayName = "LongtailAuthPane", LongtailAuthPane.propTypes = {
            accountNumber: React.PropTypes.string,
            currentStep: React.PropTypes.string.isRequired,
            errorMessage: React.PropTypes.string,
            institution: PropTypes.institution.isRequired,
            isInvalidForm: React.PropTypes.bool.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onChangeInput: React.PropTypes.func.isRequired,
            onClickBack: React.PropTypes.func.isRequired,
            onSubmitAccount: React.PropTypes.func.isRequired,
            onSubmitRouting: React.PropTypes.func.isRequired,
            routingNumber: React.PropTypes.string
        };
        var mapStateToProps = function(e) {
                return {
                    accountNumber: e.longtailAuth.accountNumber,
                    currentStep: e.longtailAuth.currentStep,
                    errorMessage: e.longtailAuth.errorMessage,
                    institution: e.institutionSelect.selectedInstitution,
                    isInvalidForm: e.longtailAuth.isInvalidForm,
                    isMobile: e.configuration.isMobile,
                    routingNumber: e.longtailAuth.routingNumber
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onChangeInput: function(t) {
                        return e(actions.longtailAuth.updateInput(t))
                    },
                    onClickBack: function() {
                        return e(actions.longtailAuth.goBack())
                    },
                    onSubmitAccount: function() {
                        return e(actions.longtailAuth.submitAccount())
                    },
                    onSubmitRouting: function() {
                        return e(actions.longtailAuth.submitRouting())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LongtailAuthPane),
            LongtailAuthPane: LongtailAuthPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/Banner": 54,
        "../partials/Input": 57,
        "./NumberBanner": 40,
        "react": "react",
        "react-redux": "react-redux"
    }],
    42: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ResendCode = function(e) {
                return React.createElement("a", {
                    className: "outrigger outrigger-resend fade-up-and-in",
                    onClick: e.onClick
                }, "Don't see your code? ", React.createElement("br", null), React.createElement("span", {
                    style: {
                        borderBottom: "1px dotted white"
                    }
                }, "Resend it"))
            };
        ResendCode.displayName = "ResendCode", ResendCode.propTypes = {
            onClick: React.PropTypes.func.isRequired
        }, module.exports = ResendCode;

    }, {
        "react": "react"
    }],
    43: [function(require, module, exports) {
        "use strict";
        var classNames = require("classnames"),
            React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            ResendCode = require("./ResendCode"),
            Banner = require("../partials/Banner"),
            Input = require("../partials/Input"),
            SubBanner = require("../partials/SubBanner"),
            backButtonClasses = function(e) {
                return classNames("button back-button", {
                    displayNone: 1 === e.institutionData.send_methods.length
                })
            },
            submitButtonClasses = function(e) {
                return classNames("button submit-button", {
                    "sans-back-button": 1 === e.institutionData.send_methods.length
                })
            },
            submitForm = function(e, t) {
                e.preventDefault(), t.onSubmitForm()
            },
            codeMessage = function(e) {
                return e.institutionData.send_methods.map(function(t) {
                    var n = e.mfa.substring("Code sent to ".length);
                    if (t.mask !== n) return null;
                    switch (t.type) {
                        case "email":
                            return "A message was sent to " + n + ".";
                        case "phone":
                            return "A text was sent to " + n + ".";
                        default:
                            return "Enter a SafePass code."
                    }
                })
            },
            MfaCodePane = function(e) {
                return React.createElement("div", null, React.createElement("div", {
                    className: "a-form code-form"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !0
                }), React.createElement(SubBanner, {
                    institution: e.institution,
                    message: "Insert Security Code"
                })), React.createElement("form", {
                    onSubmit: function(t) {
                        return submitForm(t, e)
                    },
                    noValidate: !0,
                    autoComplete: "off"
                }, React.createElement("h2", null, "Enter your code"), React.createElement("p", {
                    className: "code-message"
                }, codeMessage(e)), React.createElement(Input, {
                    autoFocus: !0,
                    focus: e.isInvalidForm,
                    isDirty: e.isInvalidForm,
                    isMobile: e.isMobile,
                    label: "Code",
                    name: "code",
                    onChange: function(t) {
                        return e.onChangeCode(t.target.value)
                    },
                    pattern: "[0-9]*",
                    type: "number"
                }), React.createElement("input", {
                    type: "button",
                    className: backButtonClasses(e),
                    onClick: e.onClickBack
                }), React.createElement("input", {
                    type: "submit",
                    value: "Submit",
                    className: submitButtonClasses(e)
                }))), e.hideOutriggers ? null : React.createElement(ResendCode, {
                    onClick: e.onClickResendCode
                }))
            };
        MfaCodePane.displayName = "MfaCodePane", MfaCodePane.propTypes = {
            hideOutriggers: React.PropTypes.bool.isRequired,
            institution: PropTypes.institution.isRequired,
            institutionData: PropTypes.institutionData.isRequired,
            isInvalidForm: React.PropTypes.bool.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            mfa: PropTypes.mfaCode.isRequired,
            onChangeCode: React.PropTypes.func.isRequired,
            onClickBack: React.PropTypes.func.isRequired,
            onClickResendCode: React.PropTypes.func.isRequired,
            onSubmitForm: React.PropTypes.func.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    hideOutriggers: e.panes.hideOutriggers,
                    institution: e.institutionSelect.selectedInstitution,
                    institutionData: e.response.institutionData,
                    isInvalidForm: e.mfa.code.isInvalid,
                    isMobile: e.configuration.isMobile,
                    mfa: e.response.mfa
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onChangeCode: function(t) {
                        return e(actions.mfa.updateMfaCode(t))
                    },
                    onClickBack: function() {
                        return e(actions.panes.goBack())
                    },
                    onClickResendCode: function() {
                        return e(actions.mfa.resendMfaCode())
                    },
                    onSubmitForm: function() {
                        return e(actions.mfa.submitMfaCode())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MfaCodePane),
            MfaCodePane: MfaCodePane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/Banner": 54,
        "../partials/Input": 57,
        "../partials/SubBanner": 62,
        "./ResendCode": 42,
        "classnames": "classnames",
        "react": "react",
        "react-redux": "react-redux"
    }],
    44: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            SendMethod = function(e) {
                return React.createElement("div", {
                    className: "send-method-button",
                    onClick: e.onClick
                }, React.createElement("div", {
                    className: "send-method-type " + e.method.type + "-icon"
                }, e.method.type), React.createElement("div", {
                    className: "send-method-mask"
                }, e.method.mask), React.createElement("div", {
                    style: {
                        clear: "both"
                    }
                }))
            };
        SendMethod.displayName = "SendMethod", SendMethod.propTypes = {
            method: React.PropTypes.shape({
                mask: React.PropTypes.string.isRequired,
                type: React.PropTypes.string.isRequired
            }).isRequired,
            onClick: React.PropTypes.func.isRequired
        }, module.exports = SendMethod;

    }, {
        "react": "react"
    }],
    45: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            SendMethod = require("./SendMethod"),
            Banner = require("../partials/Banner"),
            SubBanner = require("../partials/SubBanner"),
            MfaDevicePane = function(e) {
                return React.createElement("div", {
                    className: "a-form send-method"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !0
                }), React.createElement(SubBanner, {
                    institution: e.institution,
                    message: "Send Security Code"
                })), React.createElement("p", null, "Where would you ", React.createElement("br", null), " like to send your code?"), e.mfa.slice(0, 3).map(function(t, n) {
                    return React.createElement(SendMethod, {
                        key: "send_method_" + n,
                        method: t,
                        onClick: function() {
                            return e.onSubmitForm(t)
                        }
                    })
                }))
            };
        MfaDevicePane.displayName = "MfaDevicePane", MfaDevicePane.propTypes = {
            institution: PropTypes.institution.isRequired,
            mfa: PropTypes.mfaDevice,
            onSubmitForm: React.PropTypes.func.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    institution: e.institutionSelect.selectedInstitution,
                    mfa: e.response.mfa
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onSubmitForm: function(t) {
                        return e(actions.mfa.submitMfaDevice(t))
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MfaDevicePane),
            MfaDevicePane: MfaDevicePane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/Banner": 54,
        "../partials/SubBanner": 62,
        "./SendMethod": 44,
        "react": "react",
        "react-redux": "react-redux"
    }],
    46: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            Banner = require("../partials/Banner"),
            FormError = require("../partials/FormError"),
            Input = require("../partials/Input"),
            SubBanner = require("../partials/SubBanner"),
            submitForm = function(e) {
                return function(t) {
                    t.preventDefault(), e.onSubmitForm()
                }
            },
            handleKeyPress = function(e) {
                return function(t) {
                    e.onChangeAnswer(t.target.value)
                }
            },
            MfaQuestionPane = function(e) {
                return React.createElement("div", {
                    className: "a-form question-form"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !0
                }), React.createElement(SubBanner, {
                    institution: e.institution,
                    message: "Security Question"
                })), React.createElement("form", {
                    autoComplete: "off",
                    onSubmit: submitForm(e),
                    style: {
                        padding: "7px 24px 24px 24px"
                    }
                }, React.createElement("p", {
                    className: "question-content"
                }, e.questions[e.answers.length]), React.createElement(FormError, {
                    errorCode: e.errorCode
                }), React.createElement(Input, {
                    autoFocus: !0,
                    focus: e.isInvalidForm,
                    isDirty: e.isInvalidForm,
                    isMobile: e.isMobile,
                    label: "Answer",
                    name: "answer",
                    onChange: handleKeyPress(e),
                    type: "text",
                    value: e.currentAnswer
                }), React.createElement("input", {
                    type: "submit",
                    className: "button answer-button",
                    value: e.answers.length + 1 === e.questions.length ? "Answer" : "Next"
                })))
            };
        MfaQuestionPane.displayName = "MfaQuestionPane", MfaQuestionPane.propTypes = {
            answers: PropTypes.mfaAnswers.isRequired,
            currentAnswer: React.PropTypes.string,
            errorCode: React.PropTypes.string,
            institution: PropTypes.institution.isRequired,
            isInvalidForm: React.PropTypes.bool.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onChangeAnswer: React.PropTypes.func.isRequired,
            onSubmitForm: React.PropTypes.func.isRequired,
            questions: PropTypes.mfaQuestions.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    answers: e.mfa.question.answers,
                    currentAnswer: e.mfa.question.currentAnswer,
                    errorCode: e.error.code,
                    isInvalidForm: e.mfa.question.isInvalid,
                    institution: e.institutionSelect.selectedInstitution,
                    isMobile: e.configuration.isMobile,
                    questions: e.response.mfa
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onChangeAnswer: function(t) {
                        return e(actions.mfa.updateMfaQuestionCurrentAnswer(t))
                    },
                    onSubmitForm: function() {
                        return e(actions.mfa.submitMfaQuestion())
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MfaQuestionPane),
            MfaQuestionPane: MfaQuestionPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/Banner": 54,
        "../partials/FormError": 56,
        "../partials/Input": 57,
        "../partials/SubBanner": 62,
        "react": "react",
        "react-redux": "react-redux"
    }],
    47: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            getQuestion = function(e) {
                var n = /'([^']*)'/.exec(e.question),
                    t = null == n ? "Plaid Checking " + Math.random().toFixed(3).substring(2) : n[1];
                return "Northern" === e.answers[0] || "tomato" === e.answers[0] ? 'Did you open account "' + t + '" in Northern California (including San Francisco and central California)?' : 'Did you open account "' + t + '" in Las Vegas?'
            },
            cleanupAnswers = function(e) {
                return ["Yes", "No"]
            },
            selectionAnswers = function(e) {
                return cleanupAnswers(e.selection.answers).map(function(n, t) {
                    var a = 0 === t ? "affirmative" : "negatory";
                    return React.createElement("span", {
                        key: n,
                        className: "radio-button radio-" + a,
                        onClick: function() {
                            return e.onSelect(e.selection.answers[t])
                        }
                    }, n)
                })
            },
            MfaSelection = function(e) {
                return React.createElement("div", null, React.createElement("p", {
                    className: "question-content"
                }, getQuestion(e.selection)), selectionAnswers(e))
            };
        MfaSelection.displayName = "MfaSelection", MfaSelection.propTypes = {
            onSelect: React.PropTypes.func.isRequired,
            selection: PropTypes.mfaSelection.isRequired
        }, module.exports = MfaSelection;

    }, {
        "../../constants/PropTypes": 69,
        "react": "react"
    }],
    48: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactCSSTransitionGroup = require("react-addons-css-transition-group"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            MfaSelection = require("./MfaSelection"),
            Banner = require("../partials/Banner"),
            SubBanner = require("../partials/SubBanner"),
            MfaSelectionPane = function(e) {
                return React.createElement("div", {
                    className: "a-form selections-form"
                }, React.createElement("div", {
                    className: "header"
                }, React.createElement(Banner, {
                    institution: e.institution,
                    rounded: !0
                }), React.createElement(SubBanner, {
                    institution: e.institution,
                    message: "Security Selections " + (e.questionIndex + 1) + " / " + e.mfa.length
                })), React.createElement(ReactCSSTransitionGroup, {
                    component: "form",
                    autoComplete: "off",
                    className: "selections-form",
                    style: {
                        padding: "6px 17px"
                    },
                    transitionName: "selections-form",
                    transitionLeave: !1,
                    transitionEnterTimeout: 1e3,
                    transitionLeaveTimeout: 1e3
                }, React.createElement(MfaSelection, {
                    onSelect: e.onSelectAnswer,
                    selection: e.mfa[e.questionIndex]
                })))
            };
        MfaSelectionPane.displayName = "MfaSelectionPane", MfaSelectionPane.propTypes = {
            institution: PropTypes.institution.isRequired,
            mfa: PropTypes.mfaSelections.isRequired,
            onSelectAnswer: React.PropTypes.func.isRequired,
            questionIndex: React.PropTypes.number.isRequired
        };
        var mapStateToProps = function(e) {
                return {
                    institution: e.institutionSelect.selectedInstitution,
                    mfa: e.response.mfa,
                    questionIndex: e.mfa.selection.answers.length
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onSelectAnswer: function(t) {
                        return e(actions.mfa.selectMfaAnswer(t))
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MfaSelectionPane),
            MfaSelectionPane: MfaSelectionPane
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/Banner": 54,
        "../partials/SubBanner": 62,
        "./MfaSelection": 47,
        "react": "react",
        "react-addons-css-transition-group": "react-addons-css-transition-group",
        "react-redux": "react-redux"
    }],
    49: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            util = require("../../utilities"),
            Logos = require("../partials/Logos"),
            overlayStyles = function(e) {
                var a = e.institution;
                if (null != Logos[a.id]) {
                    var t = a.colors.primary,
                        c = e.isPatch ? util.rgba.apply(null, util.parseRgbaString(t).concat("0.7")) : util.rgbaFromHexAlpha(t, .7),
                        n = e.isMobile ? "170%" : "100%";
                    return {
                        backgroundColor: a.colors.primary,
                        background: "linear-gradient(180deg, " + t + " 0%, " + c + " 50%, rgba(0, 0, 0, 0) " + n + ")",
                        backgroundSize: "540px"
                    }
                }
                return {}
            },
            accountBalance = function(e) {
                var a = void 0;
                return a = "credit" === e.type ? util.defaultTo(e.balance.available, e.balance.current) : util.defaultTo(e.balance.current, e.balance.available), util.formatCurrency(a)
            },
            AccountItem = function(e) {
                return React.createElement("li", {
                    className: "select-account-button",
                    style: overlayStyles(e),
                    onClick: e.onClick
                }, React.createElement("span", {
                    className: "account-name"
                }, e.account.meta.name), null == e.account.meta.number ? null : React.createElement("span", {
                    className: "account-number"
                }, "â€¢â€¢â€¢â€¢" + e.account.meta.number), React.createElement("span", {
                    className: "account-balance"
                }, accountBalance(e.account)))
            };
        AccountItem.displayName = "AccountItem", AccountItem.propTypes = {
            account: PropTypes.account.isRequired,
            institution: PropTypes.institution.isRequired,
            onClick: React.PropTypes.func
        }, module.exports = AccountItem;

    }, {
        "../../constants/PropTypes": 69,
        "../../utilities": 87,
        "../partials/Logos": 59,
        "react": "react"
    }],
    50: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            AccountItem = require("./AccountItem"),
            AccountScroller = require("./AccountScroller"),
            groupedAccounts = function(c) {
                for (var e = [], t = 0, n = 0; n < c.accounts.length; t += 1, n += 3) e[t] = c.accounts.slice(n, n + 3);
                return e
            },
            AccountList = function(c) {
                return React.createElement("ul", {
                    className: "account-list"
                }, groupedAccounts(c)[c.pageIndex].map(function(e) {
                    return React.createElement(AccountItem, {
                        account: e,
                        institution: c.institution,
                        key: e._id,
                        onClick: function() {
                            return c.onClickSelectAccount(e)
                        }
                    })
                }), React.createElement(AccountScroller, {
                    groupedAccountsLength: groupedAccounts(c).length,
                    institution: c.institution,
                    onClickScrollDown: c.onClickScrollDown,
                    onClickScrollUp: c.onClickScrollUp,
                    pageIndex: c.pageIndex
                }))
            };
        AccountList.displayName = "AccountList", AccountList.propTypes = {
            accounts: PropTypes.accounts.isRequired,
            institution: PropTypes.institution.isRequired,
            onClickScrollDown: React.PropTypes.func.isRequired,
            onClickScrollUp: React.PropTypes.func.isRequired,
            onClickSelectAccount: React.PropTypes.func.isRequired,
            pageIndex: React.PropTypes.number.isRequired
        }, module.exports = AccountList;

    }, {
        "../../constants/PropTypes": 69,
        "./AccountItem": 49,
        "./AccountScroller": 51,
        "react": "react"
    }],
    51: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            Logos = require("../partials/Logos"),
            backgroundStyles = function(e) {
                return null != Logos[e.institution.id] ? e.institution.colors.primary : "rgba(0,0,0,0)"
            },
            getBiScroller = function(e) {
                return React.createElement("div", null, React.createElement("div", {
                    className: "scroller bi-scroller-1",
                    onClick: e.onClickScrollDown
                }, React.createElement("i", null)), React.createElement("div", {
                    className: "scroller bi-scroller-2",
                    onClick: e.onClickScrollUp
                }, React.createElement("i", null)))
            },
            getTopScroller = function(e) {
                return React.createElement("div", {
                    className: "scroller top-scroller",
                    onClick: e.onClickScrollDown
                }, React.createElement("i", null))
            },
            getBottomScroller = function(e) {
                return React.createElement("div", {
                    className: "scroller bottom-scroller",
                    style: {
                        background: backgroundStyles(e)
                    },
                    onClick: e.onClickScrollUp
                }, React.createElement("i", null))
            },
            AccountScroller = function(e) {
                if (e.groupedAccountsLength > 1) {
                    if (e.pageIndex < e.groupedAccountsLength - 1 && 0 !== e.pageIndex && e.pageIndex !== e.groupedAccountsLength) return getBiScroller(e);
                    if (e.pageIndex < e.groupedAccountsLength - 1) return getBottomScroller(e);
                    if (e.pageIndex === e.groupedAccountsLength - 1) return getTopScroller(e)
                }
                return React.createElement("span", null)
            };
        AccountScroller.displayName = "AccountScroller", AccountScroller.propTypes = {
            groupedAccountsLength: React.PropTypes.number.isRequired,
            institution: PropTypes.institution.isRequired,
            onClickScrollDown: React.PropTypes.func.isRequired,
            onClickScrollUp: React.PropTypes.func.isRequired,
            pageIndex: React.PropTypes.number.isRequired
        }, module.exports = AccountScroller;

    }, {
        "../../constants/PropTypes": 69,
        "../partials/Logos": 59,
        "react": "react"
    }],
    52: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            AccountItem = require("./AccountItem"),
            ConfirmAccount = function(c) {
                return React.createElement("div", {
                    className: "confirm-account"
                }, React.createElement(AccountItem, {
                    account: c.selectedAccount,
                    institution: c.institution
                }), React.createElement("div", {
                    className: "confirm-account-back-button",
                    onClick: c.onClickGoBack
                }, "Go Back"), React.createElement("div", {
                    className: "button use-account-button",
                    onClick: c.onClickConfirm
                }, "Use Account"))
            };
        ConfirmAccount.displayName = "ConfirmAccount", ConfirmAccount.propTypes = {
            institution: PropTypes.institution.isRequired,
            onClickConfirm: React.PropTypes.func.isRequired,
            onClickGoBack: React.PropTypes.func.isRequired,
            selectedAccount: PropTypes.account.isRequired
        }, module.exports = ConfirmAccount;

    }, {
        "../../constants/PropTypes": 69,
        "./AccountItem": 49,
        "react": "react"
    }],
    53: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ReactRedux = require("react-redux"),
            actions = require("../../actions"),
            PropTypes = require("../../constants/PropTypes"),
            AccountList = require("./AccountList"),
            ConfirmAccount = require("./ConfirmAccount"),
            InstitutionVideo = require("../partials/InstitutionVideo"),
            Logos = require("../partials/Logos"),
            StaticLogo = require("../partials/StaticLogo"),
            paneStyles = function(e) {
                var t = e.institution,
                    c = t.colors.primary;
                return e.isMobile === !1 && null != t.video ? c = "url(img/bgp-" + t.video + ".jpg)" : null != t.colors.dark && (c = "linear-gradient(0deg, " + [t.colors.darker, t.colors.primary].join(", ") + ")"), {
                    borderRadius: "8px",
                    background: c,
                    backgroundColor: t.colors.primary,
                    textAlign: "center",
                    color: "#fff"
                }
            },
            backgroundStyles = function(e) {
                return null != Logos[e.institution.id] ? e.institution.colors.primary : "rgba(0,0,0,0)"
            },
            SelectAccount = function(e) {
                return React.createElement("div", {
                    className: "account-select account-message",
                    style: paneStyles(e)
                }, React.createElement(InstitutionVideo, {
                    institution: e.institution,
                    display: "block",
                    isMobile: e.isMobile
                }), React.createElement(StaticLogo, {
                    institution: e.institution
                }), React.createElement("div", {
                    className: "select-account-title",
                    style: {
                        background: backgroundStyles(e)
                    }
                }, React.createElement("span", {
                    className: "select-account-title__text"
                }, (null == e.selectedAccount ? "Select" : "Selected") + " Account")), null == e.selectedAccount ? React.createElement(AccountList, {
                    accounts: e.accounts,
                    institution: e.institution,
                    pageIndex: e.pageIndex,
                    onClickScrollDown: e.onClickScrollDown,
                    onClickScrollUp: e.onClickScrollUp,
                    onClickSelectAccount: e.onClickSelectAccount
                }) : React.createElement(ConfirmAccount, {
                    institution: e.institution,
                    selectedAccount: e.selectedAccount,
                    onClickConfirm: e.onClickConfirm,
                    onClickGoBack: e.onClickGoBack
                }))
            };
        SelectAccount.displayName = "SelectAccount", SelectAccount.propTypes = {
            accounts: PropTypes.accounts.isRequired,
            institution: PropTypes.institution.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            onClickConfirm: React.PropTypes.func.isRequired,
            onClickGoBack: React.PropTypes.func.isRequired,
            onClickScrollDown: React.PropTypes.func.isRequired,
            onClickScrollUp: React.PropTypes.func.isRequired,
            onClickSelectAccount: React.PropTypes.func.isRequired,
            pageIndex: React.PropTypes.number.isRequired,
            selectedAccount: PropTypes.account
        };
        var mapStateToProps = function(e) {
                return {
                    accounts: e.response.accounts,
                    institution: e.institutionSelect.selectedInstitution,
                    isMobile: e.configuration.isMobile,
                    pageIndex: e.selectAccount.pageIndex,
                    selectedAccount: e.selectAccount.selectedAccount
                }
            },
            mapDispatchToProps = function(e) {
                return {
                    onClickConfirm: function() {
                        return e(actions.selectAccount.confirmAccount())
                    },
                    onClickGoBack: function() {
                        return e(actions.selectAccount.deselectAccount())
                    },
                    onClickScrollDown: function() {
                        return e(actions.selectAccount.decrementAccountPagination())
                    },
                    onClickScrollUp: function() {
                        return e(actions.selectAccount.incrementAccountPagination())
                    },
                    onClickSelectAccount: function(t) {
                        return e(actions.selectAccount.selectAccount(t))
                    }
                }
            };
        module.exports = {
            connect: ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SelectAccount),
            SelectAccount: SelectAccount
        };

    }, {
        "../../actions": 5,
        "../../constants/PropTypes": 69,
        "../partials/InstitutionVideo": 58,
        "../partials/Logos": 59,
        "../partials/StaticLogo": 61,
        "./AccountList": 50,
        "./ConfirmAccount": 52,
        "react": "react",
        "react-redux": "react-redux"
    }],
    54: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            Logos = require("./Logos"),
            StaticLogo = require("./StaticLogo"),
            getBackgroundColor = function(e) {
                return (null != Logos[e.id] ? e.colors.gradient : [e.colors.dark, e.colors.primary]).join(",")
            },
            bannerStyles = function(e, r) {
                return {
                    borderRadius: r ? "6px 6px 0 0" : "0",
                    backgroundColor: e.colors.primary,
                    backgroundImage: "linear-gradient(0deg," + getBackgroundColor(e) + ")"
                }
            },
            Banner = function(e) {
                return React.createElement("div", {
                    className: "banner-container"
                }, React.createElement("div", {
                    className: "banner",
                    style: bannerStyles(e.institution, e.rounded)
                }), React.createElement(StaticLogo, {
                    institution: e.institution
                }))
            };
        Banner.displayName = "Banner", Banner.propTypes = {
            institution: PropTypes.institution.isRequired,
            rounded: React.PropTypes.bool
        }, Banner._getBackgroundColor = getBackgroundColor, Banner._bannerStyles = bannerStyles, module.exports = Banner;

    }, {
        "../../constants/PropTypes": 69,
        "./Logos": 59,
        "./StaticLogo": 61,
        "react": "react"
    }],
    55: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            ExitButton = function(t) {
                return React.createElement("div", {
                    className: "exit-button",
                    onClick: t.onClick
                }, "Ã—")
            };
        ExitButton.displayName = "ExitButton", ExitButton.propTypes = {
            onClick: React.PropTypes.func.isRequired
        }, module.exports = ExitButton;

    }, {
        "react": "react"
    }],
    56: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            errors = require("plaid-errors/errors.json"),
            errorFromCode = function(r) {
                var e = parseInt(r, 10);
                switch (e) {
                    case 1200:
                        return "Invalid credentials";
                    default:
                        for (var o = 0, t = errors.length; o < t; o += 1)
                            if (errors[o].code === e) return errors[o].message;
                        return "Unhandled error code (" + r + ")"
                }
            },
            FormError = function(r) {
                return null == r.errorCode || 0 === r.errorCode.length ? React.createElement("span", null) : React.createElement("div", {
                    className: "error-tooltip fade-right"
                }, errorFromCode(r.errorCode))
            };
        FormError.displayName = "FormError", FormError.propTypes = {
            errorCode: React.PropTypes.string
        }, module.exports = FormError;

    }, {
        "plaid-errors/errors.json": 89,
        "react": "react"
    }],
    57: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            classnames = require("classnames");
        module.exports = React.createClass({
            displayName: "Input",
            propTypes: {
                autoFocus: React.PropTypes.bool,
                defaultValue: React.PropTypes.string,
                focus: React.PropTypes.bool,
                isDirty: React.PropTypes.bool,
                isMobile: React.PropTypes.bool.isRequired,
                label: React.PropTypes.string.isRequired,
                maxLength: React.PropTypes.number,
                name: React.PropTypes.string.isRequired,
                onBlur: React.PropTypes.func,
                onChange: React.PropTypes.func,
                onFocus: React.PropTypes.func,
                onKeyDown: React.PropTypes.func,
                onKeyUp: React.PropTypes.func,
                pattern: React.PropTypes.any,
                style: React.PropTypes.object,
                type: React.PropTypes.string.isRequired,
                value: React.PropTypes.string
            },
            getInitialState: function() {
                return {
                    isFocused: !1,
                    value: ""
                }
            },
            componentDidMount: function() {
                this.props.focus && !this.props.isMobile && this._input.focus()
            },
            componentDidUpdate: function(e, t) {
                this.props.focus !== !0 || e.focus === !0 || this.props.isMobile || this._input.focus()
            },
            handleOnBlur: function(e) {
                this.setState({
                    isFocused: !1
                }), "function" == typeof this.props.onBlur && this.props.onBlur(e)
            },
            handleOnFocus: function(e) {
                this.setState({
                    isFocused: !0
                }), "function" == typeof this.props.onFocus && this.props.onFocus(e)
            },
            handleOnChange: function(e) {
                this.setState({
                    value: e.target.value
                }), "function" == typeof this.props.onChange && this.props.onChange(e)
            },
            render: function() {
                var e = this,
                    t = classnames({
                        blurred: !this.state.isFocused && this.state.value.length > 0,
                        focused: this.state.isFocused && this.state.value.length > 0,
                        invalid: this.props.isDirty
                    });
                return React.createElement("div", {
                    style: {
                        position: "relative"
                    },
                    className: t
                }, React.createElement("label", {
                    htmlFor: this.props.name
                }, this.props.label), React.createElement("input", {
                    "aria-required": !0,
                    autoCapitalize: "off",
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoFocus: this.props.autoFocus && !this.props.isMobile,
                    defaultValue: this.props.defaultValue,
                    id: this.props.name,
                    maxLength: this.props.maxLength,
                    name: this.props.name,
                    onBlur: this.handleOnBlur,
                    onChange: this.handleOnChange,
                    onFocus: this.handleOnFocus,
                    onKeyDown: this.props.onKeyDown,
                    onKeyUp: this.props.onKeyUp,
                    pattern: this.props.pattern,
                    placeholder: this.props.label,
                    ref: function(t) {
                        return e._input = t
                    },
                    spellCheck: "off",
                    style: this.props.style,
                    type: this.props.type,
                    value: this.props.value
                }))
            }
        });

    }, {
        "classnames": "classnames",
        "react": "react"
    }],
    58: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            backgroundStyles = function(i) {
                var e = i.institution,
                    o = void 0;
                return i.isMobile === !1 && null != e.video ? o = 'url("img/bgp-' + e.video + '.jpg")' : null != e.colors.gradient && e.colors.gradient.length > 0 ? o = "linear-gradient(0deg, " + e.colors.gradient.join(", ") + ")" : null != e.colors.darker && null != e.colors.primary && (o = "linear-gradient(0deg, " + e.colors.darker + ", " + e.colors.primary + ")"), {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: e.colors.primary,
                    backgroundImage: o
                }
            },
            InstitutionVideo = function(i) {
                return i.isMobile || null == i.institution.video || i.noVideo ? React.createElement("div", {
                    className: "bg-visual",
                    style: backgroundStyles(i)
                }) : React.createElement("video", {
                    className: "bg-visual",
                    preload: "auto",
                    loop: !0,
                    autoPlay: !0,
                    style: {
                        display: i.display
                    },
                    poster: "img/bgp-" + i.institution.video + ".jpg"
                }, React.createElement("source", {
                    src: "img/bgv-" + i.institution.video + "_1.mp4",
                    type: "video/mp4"
                }))
            };
        InstitutionVideo.displayName = "InstitutionVideo", InstitutionVideo.propTypes = {
            display: React.PropTypes.string,
            institution: PropTypes.institution.isRequired,
            isMobile: React.PropTypes.bool.isRequired,
            noVideo: React.PropTypes.bool
        }, module.exports = InstitutionVideo;

    }, {
        "../../constants/PropTypes": 69,
        "react": "react"
    }],
    59: [function(require, module, exports) {
        "use strict";
        var React = require("react");
        exports.amex = React.createElement("svg", {
            className: "amex-logo",
            width: "428.9",
            height: "40",
            viewBox: "0 0 428.9 136.5"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M241.6 0h12.1v50.1h-12.1zM425.3 109.9c-3-2.4-7.3-3.9-14-3.9h-6.5c-1.7 0-3.2-.4-4.7-.7-1.3-.6-2.4-1.7-2.4-3.6 0-1.7.7-2.8 1.9-3.9.9-.7 2.4-.7 4.7-.7h22V86.4h-23.9c-12.5 0-17.2 7.9-17.2 15 0 15.9 14 15.1 25 15.5 2.2 0 3.5.4 4.3 1.1.7.6 1.5 2.1 1.5 3.5 0 1.3-.7 2.4-1.5 3.2-.7.7-2.4 1.1-4.7 1.1h-23.1v10.7h23.1c12.1 0 19-5 19-15.7.1-5.1-1.4-8.3-3.5-10.9zM178 39.8h-28V29.7h27.6V19.4H150v-8.9h28V0h-40.1v50.1H178zM283.4 50.1h14l4.7-11h25l4.7 11H356V12.5l22.6 37.6h17.2V0h-12.3v34.8L362.3 0h-18.5v47.3L323.7 0H306l-17.2 39.4h-5.4c-3.2 0-6.5-.7-8.2-2.4-2.2-2.6-3.2-6.5-3.2-12 0-5.2.9-9.2 3.2-11.4 2.4-2.1 5-2.8 9.3-2.8h11.4V0h-11.4c-8.2 0-14.7 1.9-18.3 5.8-5.4 5.4-6.3 12.2-6.5 19.6 0 9 2.2 14.8 6.2 19.1 4.2 4.3 11.7 5.6 17.5 5.6zm31.1-41.5l8.2 19.8h-16.4l8.2-19.8zM364.5 106H358c-1.7 0-3.2-.4-4.7-.7-1.3-.6-2.4-1.7-2.4-3.6 0-1.7.4-2.8 1.9-3.9.9-.7 2.4-.7 4.7-.7h22V86.4h-23.9c-12.9 0-17.2 7.9-17.2 15 0 15.9 14 15.1 25 15.5 2.2 0 3.5.4 4.3 1.1.7.6 1.5 2.1 1.5 3.5 0 1.3-.8 2.4-1.5 3.2-1.1.7-2.4 1.1-4.7 1.1h-23.1v10.7H363c12.1 0 19-5 19-15.7 0-5-1.5-8.2-3.5-10.8-3-2.5-7.3-4-14-4zM292.7 136.5h39.9v-10.3h-28.1v-10.1h27.6V106h-27.6v-9.2h28.1V86.4h-39.9zM211.9 86.4h-38.2l-15.5 16.5-14.6-16.5H95.3v50.1h47.6l15.3-16.5 14.7 16.5H196v-16.8h15.1c10.3 0 20.7-2.8 20.7-16.8.1-13.7-10.6-16.5-19.9-16.5zm-75.2 39.8H107v-10.1h26.5V106H107v-9.2h30l13.3 14.6-13.6 14.8zm47.6 6l-18.5-20.7 18.5-19.6v40.3zm27.6-22.6H196V96.8h15.9c4.3 0 7.1 1.7 7.1 6s-2.8 6.8-7.1 6.8zM116.8 10.8v39.3h12.1V0h-19.6L94.6 34 78.9 0H59.7v47.3L39.2 0H21.5L0 50.1h12.9l4.5-11h25.2l4.5 11h24.4V10.8L89 50.1h10.3l17.5-39.3zM21.6 28.4L30 8.6l8.2 19.8H21.6zM285.8 100c0-5.8-2.1-9-6-11.2-3.9-2.1-8.6-2.4-14.7-2.4h-27.4v50.1h12.1v-18.3h12.9c4.3 0 6.7.4 8.6 2.2 2.1 2.4 2.1 6.7 2.1 10.1v6h11.9v-9.7c0-4.5-.4-6.7-1.9-9.2-1.1-1.5-3.2-3.4-6.2-4.3 3.4-1.1 8.6-5.4 8.6-13.3zm-15.7 7.1c-1.9.8-3.6.8-5.8.8l-14.5.4V96.8h14.5c2.2 0 4.3 0 5.8.9 1.5.8 2.4 2.2 2.4 4.3.1 2.3-.9 4-2.4 5.1zM234.7 13.6c0-5.8-2.4-9-6.3-11.4C224.4 0 220.1 0 214 0h-27.4v50.1h11.8V32h12.9c4.3 0 7.1.4 9 2.1 2.1 2.6 1.7 6.9 1.7 9.7v6.4h12.3v-9.9c0-4.3-.4-6.5-2.2-9-1.1-1.5-3.2-3.2-5.8-4.3 3.2-1.6 8.4-5.5 8.4-13.4zM219 20.4c-1.9 1.1-3.5 1.1-6 1.1h-14.7v-11H213c2.1 0 4.5 0 6 .7 1.5.9 2.2 2.4 2.2 4.7 0 2.1-.7 3.9-2.2 4.5z"
        }))), exports.bbt = React.createElement("svg", {
            className: "bbt-logo",
            width: "126",
            height: "69.3",
            viewBox: "0 0 208.2 69.3"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M169.2 54.9l-1.6-1.2c-1 2.1-2.7 3.7-4.9 3.7-4 0-4.3-1.6-9-6.3 4.7-6.9 4.4-10.4 7-14.1 2.6-3.7 4.8-5.8 9.2-5.9v-1.8h-16.2v1.6c3.2-.2 3.8 2.3 3.3 4.4-.8 4.3-5.4 13.2-6 12.6-6.9-7.3-15.4-23.1-15.4-23.1 6.2-3.4 8.7-10.5 8.7-12.3 0-6.1-3.2-11.3-12.3-12.5-5.4-.6-15.8 4-16 13.5-.1 4.3 2.6 8.7 5.4 14.1-7.3 2.9-13 8.5-15.4 15.9-2.9-6.8-10.7-9.5-15.8-10.8h.2c3.8-1.3 15.5-3.6 15-14.5C104.7 3.9 86.5 1.5 80 1.9H51.6v1.9c4.2.3 8.4-.9 8.4 6.2v48.8c0 5.9-3.2 6-8.3 6.5V67h29.5c16 .2 22.7-4.4 24.9-11.4 2.7 5.4 9.3 13.5 20.3 13.7 6.1.1 11.7-1.5 18.4-7.9 2.4 2.1 5.8 5.6 11 5.9 1.5.1 5.9-.8 9.6-5.4 3-3.9 3.7-6.9 3.8-7zM74.6 5.4c.1 0 3.1-.1 4.1 0 9.1.6 11.5 8.5 11.5 11.4 0 8.7-2.7 15.4-15.7 15V5.4zM80 63.8c-3.9 0-5.4-1.4-5.4-5.7V34.9h3.6c9.4-.8 12.8 6 13.3 13 .5 8.5-2.9 15.9-11.5 15.9zm54.4-57.7c5.8 0 6.9 6.1 5.5 9.2-2.5 5.1-6 6.4-6.1 6.2-2-3.3-4.6-6.9-4.7-10 0-2.5 1.9-5.4 5.3-5.4zM120 49.3c-4.5-8.5-1.2-14.6 3.2-18.2 0 0 8.6 17.3 17.5 26.3-3.4 3.1-14 4.6-20.7-8.1zM55.8 48.9c0-11-9.6-14.4-16-16.1 3.5-.7 14.1-4.9 13.9-14.8C53.5 3.7 34.9 1.5 28.4 1.9H0v1.9c4.2.3 8.4-.9 8.4 6.2v48.6c0 5.9-3.2 6.1-8.3 6.7V67h29.5c20.4-.7 26.2-7.5 26.2-18.1zM23 5.4c.1 0 3.1-.1 4.1 0 9.1.6 11.5 8.5 11.5 11.4 0 8.7-2.7 15.4-15.7 15V5.4zm5.4 58.2c-3.8 0-5.4-1.4-5.4-5.7V34.8h3.6c8.3-.2 13.1 4.5 13.7 13 .4 8.5-3.1 15.7-11.9 15.8zM153.2 1.9v16.3h1.7c.7-8.3 5.5-13.4 10.4-13.4h8.2V59c.4 4.6-3.7 6.3-8.7 6.3V67h32.4v-1.7c-5.1-.6-9.4-.4-9.3-5.4v-55h7.6c4.9 0 10.9 4.2 10.9 13.4h1.9V1.9h-55.1z"
        })), "make"), exports.bofa = React.createElement("svg", {
            className: "bofa-logo",
            width: "231",
            height: "42",
            viewBox: "-216 376 231 42",
            enableBackground: "new -216 376 231 42"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M-147.7 397.5c-3.5 0-5.3 2.6-5.3 6.1 0 3.6 1.7 6.2 5.3 6.2 3.6 0 5.3-2.5 5.3-6.2-.1-3.5-1.8-6.1-5.3-6.1zm0 9.9c-.9 0-1.4-.8-1.4-3.8 0-2.7.3-3.7 1.4-3.7 1.1 0 1.4 1 1.4 3.7-.1 3-.5 3.8-1.4 3.8zM-136.2 396.6c0-.7.4-1.1 1.4-1.1.2 0 .5 0 .7.1v-2.9c-.6-.1-1.2-.1-1.9-.1-2.5 0-3.9 1.1-3.9 3.9v1.3h-1.5v2.7h1.5v9.1h3.8v-9.1h2.1v-2.7h-2.1v-1.2zM-180.4 401.1c0-2.6-2.4-3.6-4.6-3.6-2.1 0-4.3.9-4.7 3.2l3.3.7c0-.7.3-1.5 1.2-1.5.7 0 1 .5 1 1.2v1c-2.5.3-6 1.2-6 4.2-.1 2.2 1.4 3.4 3.3 3.4 1.1 0 2.2-.6 2.9-1.3 0 .2 0 .7.1 1.1h3.9c-.1-.2-.4-.6-.4-1.9v-6.5zm-5 6.2c-.7 0-1.1-.4-1.1-1.2 0-1.5 1-2 2.3-2.1v2.6c-.3.4-.8.7-1.2.7zM-171.1 397.6c-1.5 0-2.5.7-3.3 1.5v-1.2h-3.7v11.7h3.8v-8.4c.3-.4.8-.7 1.2-.7.6 0 .9.4.9 1v8.1h3.8v-9.3c-.1-1.6-1-2.7-2.7-2.7zM-155.8 397.8h-3.7l-2.8 3.6h-.1v-8.5h-3.8v16.7h3.8v-4.2l.8-.9h.1l1.8 5.1h4l-3.2-8.1zM-194.3 400.9v-.1c1.2-.5 2.7-1.6 2.7-3.8 0-2.3-1.9-4.1-4.9-4.1h-6.6v16.6h6.4c3.2 0 5.4-1.6 5.4-4.5.2-2-1.1-3.5-3-4.1zm-4.6-5h1.5c1 0 2 .3 2 1.8 0 1-.6 1.8-2.1 1.8h-1.4v-3.6zm1.5 10.6h-1.5v-4.2h1.5c1.4 0 2.1.8 2.1 2.1.1 1.7-1.2 2.1-2.1 2.1zM-53.6 407.7v-6.5c0-2.6-2.4-3.6-4.6-3.6-2.2 0-4.3.9-4.7 3.2l3.3.7c0-.7.3-1.5 1.2-1.5.7 0 1 .5 1 1.2v1c-2.5.3-6 1.2-6 4.2-.1 2.2 1.4 3.4 3.3 3.4 1.1 0 2.2-.6 2.9-1.3 0 .2 0 .7.1 1.1h3.9c-.2-.2-.4-.6-.4-1.9zm-5-.4c-.7 0-1.1-.4-1.1-1.2 0-1.5 1-2 2.3-2.1v2.6c-.3.4-.8.7-1.2.7zM-94.9 397.5c-3.5 0-5.2 2.8-5.2 6.1 0 3.2 1.6 6.2 5.3 6.2 3.4 0 4.5-2.7 4.7-3.2l-2.6-.9c-.2.9-1 1.6-1.9 1.6-1.5 0-1.8-1.7-1.8-2.8h6.3v-.8c.1-3-1.2-6.2-4.8-6.2zm1.4 4.8h-2.8c-.1-1.1.3-2.4 1.4-2.4 1.3 0 1.4 1.3 1.4 2.4zM-79.8 397.8h3.8v11.7h-3.8zM-79.8 392.9h3.8v3.4h-3.8zM-68.9 399.9c.6 0 .9.3 1.1.8.2.4.2 1 .2 1.5h3.2c0-1.2-.6-4.6-4.6-4.6-3.6 0-5.4 3.2-5.4 6.4 0 2.9 1.8 5.9 5.2 5.9 2.8 0 4.4-1.5 4.7-4.3l-2.9-.4c0 .9-.1 2.2-1.5 2.2-1 0-1.4-.9-1.4-3.5 0-2.4.1-4 1.4-4zM-127.6 392.9l-3.9 16.6h3.6l.7-3.4h3.9l.7 3.4h4.1l-3.6-16.6h-5.5zm1.1 10.4l1.4-6.8h.1l1.2 6.8h-2.7zM-84.7 399.4l-.1-1.6h-3.7v11.7h3.8V402c.4-.5 1.1-.9 2.1-.9.7 0 1.1.2 1.5.3v-3.8c-1.4 0-2.8.6-3.6 1.8zM-104.4 397.6c-1.6 0-2.7.9-3.4 1.6-.4-.9-1.1-1.6-2.3-1.6-1.4 0-2.6.7-3.4 1.5v-1.2h-3.7v11.7h3.7v-8.4c.3-.4.9-.7 1.3-.7.7 0 .9.4.9 1.1v8h3.7v-8.4c.2-.3.8-.7 1.3-.7.7 0 .9.4.9 1.1v8h3.7v-9.4c-.1-1.6-1.2-2.6-2.7-2.6z"
        })), React.createElement("path", {
            d: "M-30.4 390.3c1.5.6 3 1.2 4.5 1.9-4.7 1.9-9.2 4.1-13.5 6.7-1.5-.8-2.9-1.5-4.4-2.2 4.3-2.4 8.8-4.6 13.4-6.4M-35.9 388.3c-4.8 1.5-9.5 3.5-13.9 6 1.4.5 2.8 1.1 4.2 1.6 4.3-2.5 8.8-4.6 13.5-6.3-1.3-.4-2.5-.9-3.8-1.3"
        }), React.createElement("path", {
            id: "bofa-red-part",
            d: "M-20.2 390.1c-3.8-1.8-7.8-3.4-11.8-4.6-1.4.4-2.8.9-4.3 1.3 4.2 1.2 8.3 2.8 12.2 4.7 1.2-.5 2.6-1 3.9-1.4M-14 388.3c-3.9-1.7-7.9-3.1-12-4.3l-3.9.9c4.1 1.2 8.1 2.7 11.9 4.5 1.3-.4 2.6-.8 4-1.1M-4 391.6c-9.8 3.3-18.9 8-27.2 13.9 2.1 1.3 4.1 2.6 6.1 4 7.8-6.2 16.5-11.4 25.8-15.3-1.6-.9-3.2-1.8-4.7-2.6M-10.8 388.4c-10.2 2.7-19.7 7-28.3 12.7 1.9 1 3.8 2 5.7 3.1 8.4-5.8 17.8-10.4 27.8-13.4-1.7-.8-3.4-1.6-5.2-2.4"
        })), exports.capone360 = React.createElement("svg", {
            className: "capone360-logo",
            width: "197.2",
            height: "50",
            viewBox: "-296 584.7 197.2 57.3",
            enableBackground: "new -296 584.7 197.2 57.3"
        }, React.createElement("path", {
            d: "M-192.6 626.1s-.1 0 0 0c-7 3.9-14 7.7-20.2 10.9 8-3.6 14.6-6.8 20.8-10.1-.2-.2-.4-.5-.6-.8"
        }), React.createElement("path", {
            d: "M-150.6 591v.2c-.2-.5-.5-1-.9-1.5-10-11.1-75.2-1.1-102.9 5l-.6.1c-.1 0-.2.2-.2.3 0 .1.1.2.3.2l.6-.1c23-4.1 70.7-9.8 81 .4 3.1 3.1 2.4 7.1-1.2 11.8 1.9 1.2 3.3 3.2 4 5.6.1.4.2.9.3 1.3 0 0 .1 0 .1-.1 15.7-9.6 24.4-15.8 19.5-23.2zm.2.6c0-.1 0-.2-.1-.2 0 0 .1.1.1.2zm-43.2 32.3c-6.4 4.5-14 9.3-22.2 14.3l-.3.2c-.1.1-.1.2-.1.3.1.1.2.1.3.1l.3-.1c6.9-3.6 14.9-7.9 22.9-12.3 0 0 .1 0 .1-.1-.4-.8-.7-1.6-1-2.4z"
        }), React.createElement("path", {
            id: "capone360-type",
            d: "M-259.9 623.1l1.1-6.3c.2-.9.3-1.5.3-2.1 0-1.7-1.4-3-6.1-3-2.9 0-5.7.3-8.6.7l-1.2 3.3c2.2-.6 6.6-1.3 8.9-.9.9.2 1.1.5.9 1.2-.1.4-.2.6-.7.7-.3.1-1 .4-2.1.5-2.1.2-3.7.4-4.8.5-1.1.2-1.9.4-2.6.7-.7.3-1.3.7-1.7 1.2s-.7 1.3-.8 1.9c0 1 .4 1.5 1.2 2.3.8.7 2 .9 4.1.9 1.2 0 2.1-.1 3.1-.4 1-.3 2.2-.8 3.1-1.3l.1 1.6h6.4v-.2c-.5-.3-.7-.7-.6-1.3zm-5.5-2.8c-.1.3-.3.6-.6.8-.3.3-.8.5-1.3.7-.5.2-1 .3-1.6.3-.7 0-1.2-.1-1.5-.3-.3-.2-.4-.5-.3-.8.1-.3.2-.6.5-.8.3-.2.9-.4 1.7-.5 1.2-.2 2-.3 2.4-.4.4-.1.8-.2 1.1-.3-.3.6-.4 1.1-.4 1.3zm25.5 4.3h6.2l2.2-12.5h-6.1l-2.3 12.5zm6.2-17.3c-1.8 0-3.5.8-3.6 1.9-.2 1 1.1 1.9 3 1.9 1.8 0 3.5-.8 3.7-1.9.1-1.1-1.2-1.9-3.1-1.9zm30.4 9.5c.2-.9.3-1.5.3-2.1 0-1.7-1.4-3-6.1-3-2.9 0-5.7.3-8.6.7l-1.2 3.3c2.2-.6 6.6-1.3 8.9-.9.9.2 1.1.6.9 1.2-.1.4-.2.6-.7.7-.3.1-1 .4-2.1.5-2.1.2-3.7.4-4.8.5-1.1.2-1.9.4-2.6.7-.7.3-1.3.7-1.7 1.2s-.8 1.3-.8 1.9c0 1 .4 1.5 1.2 2.3.8.7 2 .9 4.1.9 1.2 0 2.1-.1 3.1-.4 1-.3 2.2-.7 3.1-1.3l.1 1.6h6.4v-.2c-.5-.3-.7-.7-.6-1.3l1.1-6.3zm-6.7 3.5c-.1.3-.3.6-.5.8-.3.3-.8.5-1.3.7-.5.2-1 .2-1.6.2-.7 0-1.2-.1-1.5-.3-.3-.2-.4-.5-.4-.8.1-.3.2-.6.5-.8.3-.2.9-.4 1.7-.5 1.2-.2 2-.3 2.4-.4.4-.1.8-.2 1.1-.3-.2.7-.3 1.2-.4 1.4zm-78.4-3.8c.1-1.8 2.2-5.5 7.6-5.5 1.7 0 3 .3 4.8 1.3l.8-4.4c-2.4-.9-4-1-6.1-1-7 .1-13.8 3.3-14.6 9.8-.9 6.6 7.2 8.3 10.8 8.3 2.1 0 4.2-.1 6.2-.3l.8-4.5c-2 .4-3.1.5-5.1.5-3 0-5.3-1.5-5.2-4.2zm69.6-4.5h-3.2l.7-4-6.4 1.4-.4 2.6h-2.4l-.5 2.5h2.3l-1.8 10.1h6.2l1.9-10.1h3.1l.5-2.5zm18.9-4.9l-3.1 17.5h6.2l3-17.4-6.1-.1zm-40.1 7.8c-.4-1-1.1-1.8-2.2-2.4-1.1-.5-1.9-.6-3.3-.6-1.3 0-2.4.3-3.5.7-1 .4-1.8 1-2.3 1.6l.4-2.2h-5.4l-3 16.9h6.1l1-5.8c.4.4.7.7 1 .9s.7.4 1.2.5c.5.1 1.1.2 1.9.2 2.1 0 3.6-.3 5.3-1.5s2.7-2.8 3-4.9c.3-1.2.2-2.3-.2-3.4zm-5.7 3.1c-.1.6-.3 1.2-.7 1.7-.3.5-.7.8-1.2 1-.4.2-1 .3-1.6.3-.8 0-1.5-.2-1.9-.7-.4-.5-.5-1.3-.4-2.4.2-1 .6-1.7 1.2-2.2.6-.5 1.4-.7 2.2-.7.8 0 1.4.2 1.9.8.5.4.7 1.2.5 2.2zM-151.8 627.4c-2.2 0-3.3-1.5-3.4-3.3 0-.7 0-1.1.2-1.6 4-.1 10-1.4 9.8-5.7-.1-1.9-1.7-2.7-3.5-2.7-4.1 0-9.2 5-9 10.4v.4c-.5.8-1.5 2.3-2.3 2.3-.3 0-.5-.2-.5-.6 0-.6.2-1.4.4-2l1.6-5.7c.4-1.6.6-2.6.6-3.1 0-1.1-.7-1.6-1.6-1.6-1.6 0-3.8 1.2-8.3 6.4h-.1l.6-2.6c.3-1.4.6-2.9.9-3.9-1.5.6-3.7 1.2-5.1 1.5-.2-5.2-3.5-8.5-8.6-8.5-7.6 0-12.9 6.9-12.7 13.6.2 5.2 3.5 8.6 8.6 8.6 7.7 0 12.5-6 12.6-12.8.4-.1 1.1-.1 1.3-.1.5 0 .9.1.9.5 0 .3-.5 2.2-.6 2.6l-1 4.2c-.4 1.7-.8 3.5-1.2 5h2.5l1.4-6.7c4.2-4.4 5.9-5.8 6.9-5.8.4 0 .8.2.8.8 0 .8-.5 2.5-.6 3l-1.4 4.9c-.3 1.1-.6 2.1-.5 2.8 0 1.1.7 1.6 1.7 1.6 1.7 0 2.9-1.6 4-3.3.5 2.2 2.3 3.3 4.3 3.3 2.9 0 5.5-2 6.7-4.5l-.5-.3c-1 1.3-3 2.9-4.9 2.9zm2.7-12.5c1 0 1.6.7 1.6 1.7.1 2.8-3.1 5.2-7.3 5.2.5-2 3.2-6.9 5.7-6.9zm-34.6 13.1c-3.2 0-5.7-3.2-5.9-7.1-.2-5.2 3.3-12.9 8.7-12.9 3.2 0 5.8 3.2 5.9 7.2.3 5-2.4 12.8-8.7 12.8z"
        }), React.createElement("g", null, React.createElement("path", {
            d: "M-104.5 619.5h-3.9l-2.3 6.7h3.9zM-116.5 624.2h-3.9l-.7 2h3.9zM-98.8 622.8c0-10.6-8.6-19.2-19.2-19.2-10.6.1-19.2 8.7-19.2 19.2v.1c0 10.6 8.6 19.1 19.2 19.1s19.2-8.6 19.2-19.1v-.1zm-10.9-5.3c.5-.4 1.1-.6 1.6-.6h5.2c.5 0 1 .2 1.2.6.3.4.3.9.1 1.4l-2.8 8c-.2.5-.5 1-1.1 1.4-.5.4-1.1.6-1.6.6h-5.2c-.5 0-.9-.2-1.2-.6-.3-.4-.3-.9-.1-1.4l2.8-8c.2-.5.5-1 1.1-1.4zm-21.8 6.7c-.5 0-.9-.2-1.2-.6-.2-.4-.3-.9-.1-1.4l.2-.7h6.5l.7-2.1h-4.5c-.5 0-.9-.2-1.2-.6-.2-.4-.3-.9-.1-1.4l.2-.7h7.2v.2h.4c.3.1.6.3.8.5.2.4.3.9.1 1.4l-.2.7-1.4 4-.2.7-.9 2.7c-.2.5-.5 1-1.1 1.4-.5.4-1.1.6-1.6.6h-5.2c-.5 0-.9-.2-1.2-.6-.2-.4-.3-.9-.1-1.4l.2-.7h6.5l.7-2h-4.5zm8.9 4.6c-.5 0-.9-.2-1.2-.6-.3-.4-.3-.9-.1-1.4l.9-2.7.2-.7 1.4-4 .2-.7c.2-.5.5-1 1.1-1.4.4-.3.8-.5 1.2-.5h7.6l-.2.7c-.2.5-.5 1-1.1 1.4-.5.4-1.1.6-1.6.6h-4.5l-.7 2.1h4.5c.5 0 .9.2 1.2.6.2.3.2.8.1 1.3l-.2.7-.9 2.5v.1c-.2.5-.5 1-1.1 1.4-.5.4-1.1.6-1.6.6h-5.2z"
        }))), exports.chase = React.createElement("svg", {
            className: "chase-logo",
            fill: "white",
            width: "202.5",
            height: "37.4",
            viewBox: "0 0 202.5 37.4"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M96.4 33.1c1.1-1.7 2-3.2 3-4.7.2-.2.7-.3 1-.3h14.3c2.4 0 2.9-.5 2.9-2.9v-1.7c0-2-.5-2.5-2.5-2.5-3.9 0-7.7.1-11.6 0-1.2 0-2.5-.3-3.5-.8-1.7-.8-2.7-2.3-3.1-4.1-.5-2.2-.5-4.4 0-6.6.6-2.7 2.8-4.6 5.6-4.9 1.4-.1 2.8-.1 4.2-.1h16c-.7 1.2-1.5 2.2-2 3.3-.6 1.3-1.6 1.7-3 1.6-4.3-.1-8.5 0-12.8 0-1.9 0-2.4.5-2.4 2.4v2c0 1.5.6 2.1 2.1 2.1h10.9c.8 0 1.5 0 2.3.1 3.1.4 5.2 2.3 5.6 5.4.3 2.1.3 4.2 0 6.3-.5 3.5-3 5.5-7 5.5-6.6 0-13.2-.1-20-.1zM134.7 9.3v6.6h15.7v4.8h-15.6v7.4H150.2c.6 0 1 .2 1.4.7.8 1.4 1.7 2.7 2.7 4.2H129V5.4c0-.7.1-1.1 1-1.1h23.3c.2 0 .5 0 .9.1-1 1.6-2 3.1-3 4.6-.1.2-.7.2-1 .2H136c-.5.1-.8.1-1.3.1zM36.2 15.7h15.9V5.4c0-.7.2-1 .9-1 1.6.1 3.1 0 4.7 0V33h-5.6V20.8H36.2V33h-5.7V4.5h5.6c.1 3.7.1 7.4.1 11.2zM61.2 33.1c.2-.5.4-.9.5-1.2 4.2-8.9 8.4-17.7 12.6-26.6.3-.7.7-1 1.4-.9 1.3.1 2.7 0 4 0 .3 0 .8.3 1 .6 4.4 9.2 8.8 18.5 13.2 27.7v.3h-6c-.2 0-.4-.4-.5-.6-.7-1.5-1.4-3-2-4.6-.2-.5-.5-.7-1.1-.7H71.1c-.6 0-.9.2-1.1.7-.6 1.5-1.3 3.1-2 4.6-.1.3-.6.6-.9.7h-5.9zm21.6-10.8c-1.7-4-3.4-7.9-5.2-11.9-1.8 4.1-3.5 8-5.2 11.9h10.4zM27.1 33.1c-6.4 0-12.6.1-18.7 0C3.3 33 .1 29.6.1 24.5 0 20.6 0 16.8 0 13c.1-5 3-8.3 8-8.4 6.2-.2 12.4-.1 18.6-.1.1 0 .2.1.4.1-1 1.6-2 3.1-3 4.6-.1.2-.6.3-1 .3H9.9c-2.8.1-4 1.2-4 4v10.4c0 2.8 1.2 4 4 4h12.5c1 0 1.5.3 2 1.1.9 1.3 1.8 2.6 2.7 4.1z"
        }), React.createElement("path", {
            d: "M201.3 10.4h-22.7c-.9 0-1.3-.2-1.3-1.2.1-2.5 0-4.9 0-7.4 0-1.4.4-1.8 1.8-1.8h10.5c.4 0 1 .2 1.3.4 3.4 3.2 6.7 6.4 10.1 9.5.1.2.1.3.3.5zM192.3 36.1V13.4c0-1 .3-1.3 1.2-1.2 2.4.1 4.9 0 7.3 0 1.4 0 1.7.3 1.7 1.7v10.7c0 .5-.2 1.1-.5 1.4-3 3.2-6.1 6.4-9.2 9.7-.1.1-.3.2-.5.4zM166.6 27.2h22.5c1.3 0 1.3 0 1.3 1.3v7.2c0 1.3-.4 1.7-1.7 1.7H178c-.4 0-.9-.1-1.2-.4-3.3-3.1-6.6-6.2-9.9-9.4 0 0-.1-.1-.3-.4zM175.4 1.5c0 .5.1.8.1 1.1V24c0 1-.3 1.3-1.3 1.3-2.5-.1-4.9 0-7.4 0-1.2 0-1.6-.4-1.6-1.6V13c0-.4.1-1 .4-1.3 3.1-3.3 6.2-6.5 9.3-9.8.1-.1.3-.2.5-.4z"
        }))), exports.citi = React.createElement("svg", {
            className: "citi-logo",
            width: "135",
            height: "60",
            viewBox: "-1250 709.5 135 87",
            enableBackground: "new -1250 709.5 135 87"
        }, React.createElement("path", {
            d: "M-1189.6 735.8c3.7-3.8 7.8-6.6 12.5-8.7 4.5-2 9.3-2.9 14.3-2.9s9.8 1 14.4 2.9c4.6 2 8.7 4.9 12.4 8.7l.2.1h10.8l-.4-.6c-4.3-6-9.8-10.8-16.4-14.2-6.7-3.5-13.6-5.2-21-5.2-7.2 0-14.2 1.7-20.9 5.1-6.6 3.5-12.2 8.2-16.4 14.2l-.4.7h10.8l.1-.1z"
        }), React.createElement("g", null, React.createElement("path", {
            d: "M-1216.2 751.6c4 0 7.7 1.8 11.1 5.2l.2.2 5.3-6.5-.2-.2c-4.3-5.3-9.7-7.8-16.2-7.8-6.8 0-12.4 2.1-16.8 6.2-4.8 4.4-7.2 10.2-7.2 17.6 0 7.3 2.4 13.1 7.1 17.5 4.4 4.1 10.1 6.2 16.8 6.2 6.5 0 11.9-2.6 16.2-7.8l.2-.2-5.3-6.4-.1.3c-3.4 3.4-7.1 5.2-11.1 5.2-4.1 0-7.6-1.4-10.3-4.2-2.7-2.7-4-6.3-4-10.6s1.3-7.8 4-10.6c2.7-2.7 6.1-4.1 10.3-4.1zM-1194.2 743.3h9.3v45.8h-9.3zM-1154.7 781.5c-2.9 0-4.4-1.7-4.4-5.2V752h9.6v-8.6h-9.6V729l-9.2 5v9.4h-8v8.6h7.9v25.9c0 3.6 1 6.4 2.9 8.6 1.9 2.2 4.4 3.3 7.6 3.4 3.1.1 5.9-.6 8.3-2.1l.2-.1v-.2l2.2-8.7-.6.4c-2.5 1.5-4.8 2.3-6.9 2.3zM-1140.4 743.3h9.5v45.8h-9.5z"
        })), React.createElement("path", {
            id: "citi-logo-hat",
            d: "M-1125.4 735.3c-4.3-6-9.8-10.8-16.4-14.2-6.7-3.5-13.6-5.2-21-5.2-7.2 0-14.2 1.7-20.9 5.1-6.6 3.5-12.2 8.2-16.4 14.2l-.4.7h10.8l.1-.1c3.7-3.8 7.8-6.6 12.5-8.7 4.5-2 9.3-2.9 14.3-2.9s9.8 1 14.4 2.9c4.6 2 8.7 4.9 12.4 8.7l.2.1h10.8l-.4-.6z"
        })), exports.fidelity = React.createElement("svg", {
            className: "fidelity-logo",
            width: "212.5",
            height: "49.7",
            viewBox: "0 0 212.5 49.7"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M34.1 15.7H19.9l1.8-6.5h14.2L38.5 0H10.8L0 38.6h13.5l4-14.4h14.2zM39.3 10.4l-7.9 28.2h13.4l7.9-28.2zM55.6 0H42.2l-2.1 7.7h13.3zM76.9 0l-3.7 13.6c-1.1-2.1-3.9-3.7-7.7-3.7-4.4 0-8.1 2-10.2 5.7-2.8 5.1-4.8 12.3-4.8 17.2 0 4.4 2.7 6.5 7.1 6.5 4.3 0 7-1.6 9.6-3.8l-.9 3.2h13.1L90.2 0H76.9zm-8.1 29.2c-.6.4-1.2.7-2.3.7-1.3 0-2.1-.9-2.1-2 0-2.3.9-4.7 1.9-7 .7-1.7 1.9-2 3.1-2 .8 0 1.7.5 2.1 1.1l-2.7 9.2zM104.9 9.7c-5.4 0-11.2 1.7-14.6 6.1-2.8 3.7-4.9 10.6-4.9 14.8 0 7.6 6.2 8.7 14.1 8.7 5.8 0 15.4-2.7 17-10.8h-13.1c-.8 2.7-1.6 3.5-3.5 3.5s-2-1.4-2-2c0-1.2.4-2.2.7-3.7H117c.7-2.3 1.4-6.1 1.4-7.8.2-7.1-5.2-8.8-13.5-8.8zm.8 11.1h-5.5c.7-2.8 1.9-4 3.5-4 1.4 0 2.3.5 2.3 2 .1.6-.1 1.4-.3 2zM128 0l-10.8 38.6h13.3L141.3 0zM159 0h-13.4l-2.1 7.7h13.3zM142.7 10.4l-7.9 28.2h13.4l7.9-28.2zM198.8 10.4L191.6 26l.2-15.6v-.1h-18.2l1.8-6.3H162l-7.2 25.7c-.4 1.4-.6 2.7-.6 3.9 0 2.9 1.5 4.8 5.4 4.8h11.9l2-6.9h-2.8c-1.8 0-2.3-.4-2.3-1.7 0-.7.2-1.7.5-2.5l3-10.7h7.1l2 21.8c-.2 1.2-.6 2.1-1.2 2.6-.2.2-.4.3-.7.4-1.1.5-3.7.4-4.6.4H174.2l-2.1 7.7h9.1c5.4 0 8-2.7 11.9-8.7l19.5-30.6h-13.8z"
        }))), exports.nfcu = React.createElement("svg", {
            className: "nfcu-logo",
            height: "32.7",
            viewBox: "0 0 86 32.7",
            width: "86"
        }, React.createElement("path", {
            d: "M0 18.2h9.7V21H3.8v3.4h5.5v2.8H3.8v5.5H0V18.2zm10.6 14.5H21v-2.8h-6.7v-3.1h6.1V24h-6.1v-3h6.5v-2.8H10.6v14.5zm11.6 0H28c.9 0 2.6 0 4-.6 2.8-1.2 3.7-3.5 3.7-6.8 0-2.2-.5-4.6-2.6-6-1.4-1-3.6-1.2-5.2-1.2h-5.8v14.6zM26 20.9h1.5c1.2 0 4.3 0 4.3 4.4 0 3.4-1.6 4.5-4.1 4.6H26v-9zm10.7 11.8h10.4v-2.8h-6.7v-3.1h6.1V24h-6.1v-3h6.5v-2.8H36.7v14.5zm11.4 0h3.8V27h1.6c1.7 0 1.8.6 1.9 2.4.1 1.3.2 2.4.5 3.3H60c-.3-1-.5-2.6-.6-3.6-.3-2.2-.5-3.5-3.1-3.6v-.1c.4-.1 1.2-.2 2.1-.7.6-.4 1.2-1.1 1.2-2.7s-.5-2.4-.9-2.8c-.8-.9-1.7-1.1-4.2-1.1h-6.3v14.6zm3.8-11.9h1.4c1.1 0 2.6 0 2.6 1.8 0 .5-.2 1.4-1 1.7-.3.1-.7.1-1.6.1h-1.4v-3.6zm8.3 11.9H64l.9-2.9h5.5l.9 2.9h4.3l-5.4-14.6h-4.6l-5.4 14.6zm5.6-5.6l1.9-6.1h.1l1.8 6.1h-3.8zM76 32.7h10v-2.9h-6.1V18.1H76v14.6zM0 16.6h3.3V5.3L8 16.6h5.1V2H9.8v10.9L5.2 2H0v14.6zm14.1 0h3.8l.9-2.9h5.5l.9 2.9h4.3L24.1 2h-4.6l-5.4 14.6zm5.6-5.6l1.9-6.1h.1l1.8 6.1h-3.8zm11.8 5.6H36L41 2h-3.8L34 12.6 30.9 2h-4.2l4.8 14.6zM40.9 2l5.2 9.3v5.3h3.8v-5.2L55.2 2h-3.9l-3.1 6.1-3-6.1h-4.3zm35.5 6.5c0 4.4-3.4 8.1-7.7 8.5-.2 0-.5.1-.8.1-.3 0-.5 0-.8-.1-4.3-.4-7.7-4-7.7-8.5 0-1.7.5-3.3 1.4-4.7l.2-.2.2-.2c1.5-1.9 3.7-3.1 6-3.3.2-.1.5-.1.7-.1.3 0 .5 0 .8.1 4.3.3 7.7 4 7.7 8.4m-4.6 6.3c.7-.6 1.2-1.4 1.6-2.4h-2c-.2.9-.5 1.7-.8 2.4h1.2m-9.4-2.4c.4.9 1 1.7 1.6 2.4h1.2c-.3-.7-.6-1.5-.8-2.4h-2m-2.5-3.6c0 1.1.3 2.2.7 3.1h.9c-.3-1-.5-2-.6-3.1h-1m2.6-4.4c0 .1-.1.1-.1.2h2v-.1l.1-.3V4c.2-.7.4-1.3.7-1.8H64c-.6.6-1.1 1.4-1.5 2.2m10.9.2c-.4-.9-1-1.7-1.6-2.4h-1.2c.3.7.6 1.5.8 2.4h2m2.5 3.6c0-1.1-.3-2.2-.7-3.1h-.9c.3 1 .5 2 .6 3.1h1m-1.7 0c0-1.1-.2-2.2-.6-3.1h-2.1c.2 1 .3 2 .3 3.1h2.4M65 4.4v.2h2.7V2.2h-1.8c-.4.6-.7 1.4-.9 2.2m.5-2.7c.2-.3.4-.6.6-.8-.5.2-1 .5-1.5.8h.9M67.6.6c-.5.1-1 .5-1.5 1.1h1.5V.6m2.1 1.1c-.4-.6-1-1-1.5-1.1v1.1h1.5zm-1.5.5v2.4h2.7c-.2-.9-.5-1.7-.9-2.4h-1.8zm-3.4 2.9c-.2 1-.3 2-.3 3.1h3.2V5.1h-2.9zm-.3 3.7c0 1.1.1 2.2.3 3.1h2.8V8.8h-3.1zm.4 3.6c.2.9.5 1.7.9 2.4h1.8v-2.4h-2.7zm1.2 2.9c.4.6 1 1 1.5 1.1v-1.1h-1.5zm2.1 1.2c.5-.1 1-.5 1.5-1.1h-1.5v1.1zm1.8-1.7c.4-.6.7-1.5.9-2.4h-2.7v2.4H70zm1-2.9c.2-1 .3-2 .3-3.1h-3.2v3.1H71zm.3-3.7c0-1.1-.1-2.2-.3-3.1h-2.8v3.1h3.1zm-.1-6.5c-.5-.4-1-.7-1.5-.9.2.2.4.5.6.9h.9zm-9 3.4c-.4 1-.6 2-.6 3.1H64c0-1.1.1-2.1.3-3.1h-2.1zM61 8.2c0-1.1.2-2.1.6-3.1h-.9c-.5 1-.7 2-.7 3.1h1m.6.6c0 1.1.2 2.2.6 3.1h2.1c-.2-1-.3-2-.3-3.1h-2.4m3 6.5c.5.4 1 .6 1.5.8-.2-.2-.5-.5-.6-.8h-.9zm5.7 0c-.2.3-.4.6-.6.8.5-.2 1.1-.5 1.5-.8h-.9m3.3-3.4c.4-.9.6-2 .6-3.1h-2.4c0 1.1-.1 2.2-.3 3.1h2.1zm1.2-3.1c0 1.1-.2 2.2-.6 3.1h.9c.4-.9.7-2 .7-3.1h-1m0-4.2c-.5-.9-1.2-1.7-2-2.4h-.3c.6.7 1.1 1.5 1.5 2.4h.8M72 1.7m-9 .5c-.6.5-1.1 1-1.6 1.7-.2.2-.3.5-.5.7h.8c0-.1.1-.1.1-.2l.2-.2.1-.2c.3-.6.7-1.2 1.2-1.7H63m-2 10.1c.5.9 1.2 1.7 2 2.4h.3c-.6-.7-1.1-1.5-1.5-2.4H61m2.8 2.9 8.2 0 .8-.5c.8-.6 1.5-1.4 2-2.4H74c-.4.9-.9 1.7-1.5 2.4h.3"
        })), exports.pnc = React.createElement("svg", {
            className: "pnc-logo",
            height: "53.4",
            viewBox: "-605.1 1071.5 176.4 53.4",
            width: "176.4",
            enableBackground: "new -605.1 1071.5 176.4 53.4"
        }, React.createElement("path", {
            id: "pnc-logo-circle",
            d: "M-576.8 1073.5c-13.7 0-24.7 11.1-24.7 24.7 0 13.7 11.1 24.7 24.7 24.7s24.7-11.1 24.7-24.7c.2-13.7-11.1-24.7-24.7-24.7zm-13.3 12.1v-.8c0-2.8 1.2-5 2.6-5.4 2-.6 4.8 1.8 7.5 6.7l2.6 4.4c-.8.2-1.4.6-1.8 1.4l-8.2 14.4c-1.2 2-2.1 4-2.6 5.7-.1-3.9-.3-11.5-.1-26.4zm8.8 30.5l-.8.4c-2.4 1.4-4.8 1.6-6 .4-1.4-1.4-.8-5 2-9.9l2.6-4.4c.4.6 1.2.8 2.2.8h16.7c2.4 0 4.4-.2 6.2-.6-3.3 2.3-9.8 6.1-22.9 13.3zm16.7-14.2h-5c.2-.8.2-1.4-.4-2.4l-8.2-14.4c-1.2-2.1-2.4-3.9-3.6-5 3.4 1.8 10.1 5.7 22.7 13.1l.8.4c2.4 1.4 3.9 3.4 3.4 5-.6 2-4 3.3-9.7 3.3z"
        }), React.createElement("path", {
            id: "pnc-logo-type",
            d: "M-526.3 1080.1H-543v1.6h.4c5.8.6 6.4 1.4 6.4 4.4v30.8h6.7V1101h2.6c6.2 0 19.3 0 19.3-10.4 0-10.5-12.1-10.5-18.7-10.5m-.9 18.1h-2.6v-11.9c0-2.8 0-3.2 5.4-3.2 6.1 0 9.3 2.6 9.3 7.6.2 6.6-6 7.5-12.1 7.5m56.8-18.1h-3.9v28.7l-20.5-28.7h-14.1v1.6h.4c5.7.8 6.4 1 6.4 5v30.1h4.2v-30.7c1 1.4 22.1 30.8 22.1 30.8h5.7v-36.8h-.3zm5.4 17.3c0 10.1 6 20.1 20 20.1 6.4 0 9.7-.8 12.6-1.6h.2v-3l-.4.2c-3.2.8-6.2 1.4-8.9 1.4-10.8 0-16.3-6.1-16.3-18.5 0-8.2 4-13.3 10.4-13.3 4.4 0 7.1 1.8 7.6 5.3v.2h7.3v-.2c-.2-2.1-2-8.2-14.4-8.2-11.9 0-18.1 5.8-18.1 17.6"
        })), exports.schwab = React.createElement("svg", {
            className: "schwab-logo",
            width: "228.8",
            height: "31.1",
            viewBox: "0 0 228.8 31.1"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M105.4 24.8c0 3.3-3.8 6.3-7.2 6.3-2.2 0-4-1.4-4-2.2 0-.5.2-2.1.9-2.1 1.2 0 2.4 2.6 4.8 2.6 1.5 0 2.9-1 2.9-2.6 0-2.2-3.8-4.2-3.8-7.7 0-3.6 3.9-8 7.4-8 1.8 0 2.5 1 2.5 1.9 0 .7-.6 1.6-1.6 1.6-1.4 0-2.3-1.1-3.7-1.1-1.5 0-2.4 1-2.4 2.8.3 2.6 4.2 5 4.2 8.5M34.1 25.8c-2 2.3-4.7 5.3-7.5 5.3-1.1 0-1.4-.5-1.4-1.4 0-2.4 5-10.8 5-13.8 0-1-.3-1.5-1.4-1.5-3.1 0-9.5 8.1-11.8 15.7-.1.5-.5.6-1.7.6s-1.4-.1-1.4-.6c0-.8 4.5-11.8 6.6-17.9 1.8-5.1 3.3-9 3.3-10.1 0-.5-.3-.9-1.3-1-.3 0-1-.1-1.2-.1l-.1-.1V.1c0-.1 0-.1.1-.1h5.9c.5 0 .6.1.6.5 0 .3-1.3 4.4-4.2 11.8-2 5.2-3 7.1-2.6 7.1.5 0 5.4-8.3 9.6-8.3 1.7 0 2.8 1.1 2.8 3.5 0 3.9-4 11.8-4 12.6 0 .4.2.5.7.5.7 0 2.4-1.8 3.3-2.7.1-.1.1 0 .2 0l.5.5v.3M13.2 26.5c-.5 1-3.8 4.5-7.7 4.5-4 0-5.3-3-5.4-5.6C-.3 17.6 8.9 11 14.2 11c2.6 0 3.7 1.7 3.7 3 0 .8-.6 1.4-1.2 1.4-1.6 0-2.1-3.2-4.2-3.2-3 0-9.1 8.6-8.9 13.2 0 2.6 1.8 3.7 3.4 3.7 1.8 0 3.4-1.2 4.3-2 .6-.4 1.2-1.1 1.3-1.2h.1l.4.5.1.1M56.5 16.6l.4.4h.2c0-.1.1-.1.2-.2.7-.8 2.3-2.9 3.1-2.9.4 0 .7.4.7 1.2 0 2.8-4.7 14.3-4.7 15.1 0 .4.2.5.4.5h1.7c.3 0 .4-.2.7-.7 0 0 .9-2 1.3-3 3.6-7.3 5.4-10.8 6.8-12.1 3.1-3 2.7-.1 4.1 0 1 .1 1.6-1 1.6-2.2 0-1.3-.9-1.7-1.6-1.7-2.8 0-4.8 2.6-8.3 8.7-.3.5-.4.8-.6.8-.1 0-.2 0-.2-.3 0-.5 1.6-6.4 1.6-7.6 0-1-.5-1.4-1.4-1.4-1.7 0-5.1 3.7-6.2 5.4.2-.1.2-.1.2 0"
        }), React.createElement("path", {
            d: "M39.9 28.3c-.9 0-1.4-.4-1.4-2 0-5.5 4.6-13.8 9.2-13.8 1.7 0 2.4 1.2 2.4 2.6-.1 2.3-6.3 13.2-10.2 13.2m14.2-16.8l-1.1-.7c-.1-.1-.3-.2-.4-.1-.6.2-.6 1.1-1.3 1.1-.7 0-1.4-.3-2.7-.3-8.8 0-13.3 11.9-13.3 15.8 0 2.6 1.4 3.8 3 3.8 2 0 4.4-1 7.5-5.6.8-1.1.8-1.4 1-1.4.1 0 .2.1.2.3 0 .4-1.4 2.8-1.4 4.8 0 1.2.5 1.8 1.5 1.8 2.5 0 5.4-3.7 6.5-5.3v-.1l-.5-.6c-.1-.1-.1 0-.2 0-1 1-2.6 3.3-3.5 3.3-.4 0-.6-.1-.6-.8 0-1.7 5.4-14.6 5.5-15.6 0-.1 0-.3-.2-.4zM86.4 18.1C87 17 90.1 12 92.7 12c1 0 1.7.9 1.7 1.9.1 2.7-3.4 4.2-8 4.2m6.6 8.3l-.4-.4h-.1c-1 .7-3.3 2.8-5.6 2.8-2.1 0-3.3-1.4-3.3-3.4 0-2.6 1.2-4.7 2.1-6.1.6.1 1.1.1 2.2.1 3 0 9.3-1.3 9.3-5.1 0-1.6-1.4-3.1-3.9-3.1-5.5 0-13.5 7.6-13.5 14.7 0 3.2 2.1 5.3 5.1 5.3 3.6 0 7.2-3.3 8.1-4.5.1-.2.1-.3 0-.3zM78.4 25.8c-1.6 2-4.2 5.3-6.5 5.3-1.6 0-2.4-.9-2.3-2.6.1-2.5 5.3-15.3 5.7-16.2 2-5.1 3.7-9.1 3.7-10.1 0-.5-.3-.9-1.2-1-.4-.1-1.1-.1-1.3-.1l-.1-.1V.2c0-.1.1-.1.1-.1h5.9c.5 0 .6.1.6.4 0 .3-1.7 4.4-4.6 11.9-2.5 6.6-5.1 13.8-5.2 15.1 0 .5.2.7.7.7.8 0 1.9-1.1 3.7-3.1 0-.1.1 0 .2 0l.5.6c.1 0 .2.1.1.1"
        }), React.createElement("path", {
            d: "M123.9 16.2c-.5-1.7-1.4-3.7-3.9-3.7-1.9 0-3 1.4-3 3.1 0 1.6 1.2 2.7 3.4 3.7l.8.4c2.3 1 4.4 2.6 4.4 5.6 0 3.5-2.7 5.9-6.7 5.9-1.1 0-2.2-.2-2.9-.5-.8-.3-1.3-.5-1.7-.6-.2-.8-.6-2.7-.9-4.5l.9-.3c.6 1.5 2.2 4.8 5.2 4.8 1.9 0 3.1-1.5 3.1-3.3 0-1.6-.8-2.8-3.1-3.9l-.9-.5c-1.9-1-4.4-2.5-4.4-5.4 0-3.1 2.3-5.6 6.2-5.6.8 0 1.8.1 2.7.4.5.2.9.2 1.2.4.1 1 .3 2.3.6 3.9l-1 .1M144.1 16.8c-.9-3.3-2.8-4.3-5.5-4.3-4.8 0-6.9 4-6.9 8.3 0 5.4 2.7 9.2 6.9 9.2 3.2 0 4.6-1.6 6.1-4.7l.8.2c-.4 1.4-1 3.7-1.5 4.8-.8.2-3.4.9-5.5.9-7.6 0-10.7-5-10.7-9.6 0-6.1 4.7-10.2 11.3-10.2 2.5 0 4.4.6 5.3.8.2 1.6.4 2.9.5 4.6h-.8M155.1 11.7v.8c-2.2.2-2.4.4-2.4 3.6V20h8.9v-3.9c0-3.2-.2-3.4-2.5-3.6v-.8h8.3v.8c-2.3.2-2.6.4-2.6 3.6v10.2c0 3.2.2 3.4 2.5 3.6v.8h-8.5v-.8c2.5-.2 2.7-.4 2.7-3.6v-5h-8.9v5c0 3.2.2 3.4 2.5 3.6v.8h-8.3v-.8c2.3-.2 2.6-.4 2.6-3.6V16.1c0-3.2-.2-3.4-2.7-3.6v-.8h8.4M183.5 11.9l5.1 13.9h.1c1.1-3.6 2.5-9 2.9-10.9.5-1.8.2-2.2-1-2.3-.2 0-1-.1-1-.1v-.8h6.7v.8c-1.9.2-2.1.4-3.1 3-.4 1.2-2.5 7.3-4.9 15.4H187l-5-13.7h-.1l-4.6 13.7H176l-4.8-15.5c-.8-2.5-1.3-2.7-2.9-2.9v-.8h7.9v.8s-.7 0-.9.1c-1.1.1-1.4.4-1 1.9l3.4 11.4h.1l4.4-13.9h1.3"
        }), React.createElement("path", {
            d: "M202.4 11.6l-5.9 15.3c-1 2.6-1.3 2.7-3.2 3v.8h6.5v-.8l-.8-.1c-1.3-.1-1.5-.5-1-2.1.4-1.2.9-2.9 1.3-3.7h5.4c.6 1.5 1.3 3.3 1.6 4.2.4 1.1.3 1.4-.8 1.6l-.8.1v.8h7.7v-.8c-1.7-.2-2.1-.4-3.1-3-1.1-2.9-2.4-6.5-3.7-10.1l-2-5.3-1.2.1m-.5 4.6l2.4 6.4h-4.6l2.2-6.4zM220.1 21.1c3 0 5.1 1.4 5.1 4.4 0 3-2 4.1-3.9 4.1-1.9.1-2.2-.5-2.2-3.3v-5.2h1m-6.5-9.4v.8c2.1.2 2.3.4 2.3 3.6v10.2c0 3.2-.2 3.4-2.5 3.6v.8h7.3c2.1 0 4.2-.3 5.6-1.2 1.6-1 2.6-2.3 2.6-4.4 0-2.9-2.3-4.5-5.3-4.9v-.1c1.7-.3 4.1-1.7 4.1-4.2 0-1.5-.6-2.6-1.6-3.3-1-.7-2.2-1-4.5-1h-8zm5.5 2.6c0-.7 0-1.2.2-1.3.2-.1.6-.1 1.3-.1 1.8 0 3.7.9 3.7 3.6 0 2.5-1.6 3.6-4.1 3.6H219v-5.8z"
        }))), exports.suntrust = React.createElement("svg", {
            className: "suntrust-logo",
            height: "65",
            viewBox: "0 0 247.5 142.5",
            width: "220"
        }, React.createElement("g", null, React.createElement("path", {
            d: "M163.5 139.5v2.1h-6c-3.5 0-5.2-.6-6.6-3.4-1.1-2.2-7.1-14.4-7.1-14.4h2.4c4.4 0 5.6-3.4 5.6-6.5 0-4.8-2.4-6-5.5-6h-4v26c0 1.6 1.1 2.1 3.5 2.1v2.1h-15.2v-2.1c2.5 0 3.5-.6 3.5-2.1V113c0-1.6-.2-2.1-2.6-2.1h-3.2v-3.7c0-3.1-.2-6.7-4.7-6.7h-5.1v35.1c0 3 .8 3.8 4.2 3.8h1.1v2.1h-19.6v-2.1h1.2c3.4 0 4-.9 4-3.8v-35.1h-5.1c-4.6 0-4.8 3.6-4.8 6.7v3.7H97c-2.4 0-2.7.7-2.7 2.2v28.4h-7.8l-13.9-24.8v20.5c0 1.5.3 2.2 2.7 2.2h.8v2.1H65.9v-2.1h.8c2.4 0 2.7-.6 2.7-2.2v-24.4c0-1.6-.2-2-2.6-2H65c-2.4 0-2.6.5-2.6 0v16.8c0 6.8-.6 14.7-11.7 14.7-2.3 0-7.4 0-10.5-3-1.8-1.9-2.8-5-2.8-9.7v-16.9c0-1.6-1-2-3.4-2v-2.1h14.8v2.1c-2.4 0-3.4.4-3.4 2v18c0 4.1.3 8.6 6.4 8.8 6.8.2 7.4-5.5 7.4-9.4v-17.4c0-1.6-.3-2-2.7-2h-.8v-2.1h21.6L91 133.2v-20.3c0-1.6-.3-2.2-2.7-2.2h-.8v-2.1H96V97.2h35.5v11.6h14.9c5.3 0 13.3.4 13.3 8.5 0 4.4-2.9 7.4-6.9 8.3l7.1 12.4c1.1 1.4 2.7 1.5 3.6 1.5zM16.7 113.8c-8.2-1.8-9.7-3.6-9.6-7.5.1-3.9 3.8-6.2 8.5-6.3 3.3-.1 6 .3 8.7 2.2.8.6 1.6 1.8 1.9 3.1.2 1.1.3 2.5.3 3.5h3.2v-9.7c-2.9-1.4-6.5-2.7-13.1-2.7-11.1 0-16.5 6-16.5 13.5 0 8 5.4 11 13.5 13 8.5 2.1 11.7 3.4 11.8 8 0 3.7-2.5 8-10 7.9-5.1-.1-8-1.8-10-4.3-.7-1-1.1-2.2-1.3-3.3-.2-1.2-.2-2.3-.3-3.5H.3v10.9c2.5 1.9 8.9 3.8 15.1 3.8 11.2 0 16.2-5.9 16.9-12.4.5-4.5 0-8.2-2.9-11.2-2.3-2.1-5.9-3.5-12.7-5zm203.4-5v8.7h2.8c0-1.6 0-3.8.6-4.7.6-.8 1.2-1.2 2.9-1.2h3.2v25.3c0 1.6-.6 2.6-3.1 2.6h-1.1v2.1h16.4v-2.1h-1.1c-2.5 0-3.1-1.1-3.1-2.6v-25.3h3.2c1.7 0 2.4.4 2.9 1.2.6.9.6 3.1.6 4.7h2.9v-8.7h-27.1zm-36.9 2.1h.8c2.4 0 2.7.5 2.7 2.1v17.2c0 3.9-.5 9.6-7.4 9.4-6.1-.2-6.4-4.7-6.4-8.8v-18c0-1.6 1-2 3.4-2v-2.1h-14.8v2.1c2.4 0 3.4.4 3.4 2v16.9c0 4.7.9 7.8 2.8 9.7 3 3 8 3 10.4 3 11.2 0 11.8-7.9 11.8-12.7V113c0-1.6.3-2.1 2.6-2.1h.8v-2.1h-10.2v2.1zm24.2 9.5c-6.2-1.3-7.4-2.3-7.4-5.3 0-3.1 3.5-4.5 6.2-4.6 2-.1 4.9 0 7.1 1.8.8.6 1 1.5 1.1 2.4.1 1 .2 1.9.2 2.7h2.9v-7.6c-2.4-1.1-5.1-2-10.2-2.1h-1.6c-7.6.5-11.1 5.1-11.2 10.3 0 5.8 2.9 8.5 10 10.2 7.2 1.6 9.2 2.3 9.2 6 0 2.6-2.3 5.5-7.5 5.4-4.1-.1-6.3-1.6-7.4-2.9-.6-.7-.9-1.5-1-2.4-.2-1.1-.2-2-.2-2.9h-2.9v8.1c1.9 1.4 6.8 2.9 11.5 2.9 8.5 0 12.7-4.6 13.2-10 .3-3.3-.4-6.2-2.4-8.3-1.7-1.8-4-2.6-9.6-3.7z"
        }), React.createElement("path", {
            id: "suntrust-logo-fan",
            d: "M33.5 81l-3.6-18.8c-.5-1.6-.4-4.5.2-6.1l.7-2c.6-1.6 1.3-1.6 1.5 0L35 79c.3 2.8.4 4.1-.2 4.2-.5.1-1-.5-1.3-2.2zm3.6-6c.3 2.1.6 2.7 1.1 2.6.6-.1.4-2.1.3-3.7l-.7-15.4c-.1-1.6-.6-1.9-1.2-.7s-.9 4.5-.7 6.1L37.1 75zm4.3-2.9c.5.1.6-1.7.7-3.2l1.4-32.3c.1-1.3-.6-1.3-1.3 0l-1 1.8c-.7 1.3-1.2 3.5-1.2 4.8l.6 26.5c.1 1.5.4 2.3.8 2.4zm3.7-.8c.5 0 .8-1.8 1-3.5l2.2-24.6c.2-1.3-.3-1.9-.9-.7-.6 1.2-1.7 3.5-1.8 5l-.9 21.1c-.3 1.6 0 2.7.4 2.7zm4-5.2c.5 0 .7-1.3 1-2.9L56 24.5c.3-1.2-.4-1.3-1.4-.2l-.3.4c-.9 1.1-1.8 3.1-2 4.3l-3.4 34.1c-.2 1.2-.2 2.9.2 3zm3.1 2.4c.6.1 1.1-1.8 1.4-3.1L61.1 31c.3-1.2-1-1.7-1.7-.9-.8.8-1.6 2.7-1.8 3.9l-5.4 31.1c-.4 1.5-.4 3.3 0 3.4zm6-.9c.8.3 1.4-1.4 2-2.6 5.5-11.8 8.7-18.4 20.1-43.9.5-1.2 1.9-3.7.6-4.4-1.5-.7-2.8 1-3.4 2.3L58.7 64.7s-1.1 2.7-.5 2.9zm6.2-4.8c.4.3 1.5-.9 2.3-2.3l34.2-57c.6-1 1-2.7-.3-3.3-1-.5-2.6.5-3.4 1.8L65.4 59.4c-.9 1.7-1.5 3-1 3.4zm.8 6.1c.5.5 1.6-.8 2.6-2.3l39.9-52.8c1-1.4 1-2.9-.2-3.6-1.3-.8-3.5.9-4.5 2.4l-36.6 53c-.9 1.5-1.7 2.9-1.2 3.3zm9.4-7.1c-1.1 1.4-2.1 2.4-1.5 3 .5.6 2.9-2 2.9-2L131.3 7c.9-.9 1-2.6.1-3.6l-1.5-1.9c-1.1-.8-2.2-.8-3 .3L75.8 60.3l-1.2 1.5zm53.6-42.5L73.9 69.2c-1.6 1.4-2.5 2.6-2.1 3 .5.4 1.7-.4 3.1-1.7l56.5-45c1.1-1 2-1.7 1.7-3.3-.2-1-.6-2-1.7-3.1-.9-.8-2.2-.8-3.2.2zM80.5 70.5c.4.6 2-.3 3.6-1.3L148.4 32c1.3-.9 2.2-2.6 1.8-3.8l-1.5-5.1c-.3-1.2-1.4-1.4-2.6-.5l-63 45.1c-1.5 1.2-3.1 2.1-2.6 2.8zm58.5-17l-.2-6.3c0-1.3-1.2-1.7-2.7-.9L79.6 74.8c-1.8.9-3.4 1.6-3.2 2.3.2.7 1.9.3 3.8-.5l55.7-19.4c1.7-.6 3.1-2.3 3.1-3.7zm7.6 15l.8-6.5c.2-1.4-1.3-2.1-3.1-1.5L87.8 77.7c-2 .7-3.8 1.1-3.6 1.9.2.6 1.7.3 3.9 0l54.5-7.8c2-.3 3.8-1.8 4-3.3zM84.8 85.7H131c2.2.1 4-1 4.6-2.6l1-2.5c.7-1.9-1.1-3-3.2-2.8l-48.2 5.7c-2.1.2-4.8.7-4.7 1.5.1.7 2.3.7 4.3.7zM56.6 63.1c.7.2 1.6-2 2.4-4.5.8-2.3 14.8-45.2 14.8-45.2.4-1.2 1.2-3.5-.2-3.8-.8-.2-2.7 1.5-3.4 3.3L57 59.4c-.5 1.9-.9 3.5-.4 3.7z"
        }))), exports.svb = React.createElement("svg", {
            className: "svb-logo",
            enableBackground: "new -997.1 1493.7 81.8 38.8",
            height: "38.8",
            viewBox: "-997.1 1493.7 81.8 38.8",
            width: "81.8"
        }, React.createElement("path", {
            d: "M-952 1504.6c-2 0-3.9 1.2-5.1 2.4v-10.3h-6.6v2.4l2.2.5v24.7h3.2l.5-2c1.2 1.4 2.9 2.4 5.3 2.4 4.1 0 6.9-2 6.9-10.3-.1-7.7-3-9.8-6.4-9.8m-1.7 17.2c-1.4 0-2.5-.8-3.6-1.7v-10.7c1-1 2.2-1.7 3.7-1.7 2.4 0 3.2 2 3.2 6.8.3 5.3-.6 7.3-3.3 7.3m-15.4-13.8l-2.4 8.5c-.5 1.5-.8 2.9-1 4.6-.3-1.5-.5-2.9-1-4.4l-2.5-8.5 2-.3v-2.5h-8.1v2.5l1.7.3 5.6 16.3h3.9l5.6-16.3 1.9-.3v-2.5h-7.3v2.5l1.6.1zm-20.5 4.6c-2.7-.7-3.6-1.5-3.6-2.9 0-1.5 1.2-2.2 2.9-2.2 1 0 1.7.2 2.1.3l.7 2.7h2.9v-4.7c-1.5-.7-3.2-1.2-5.8-1.2-4.4 0-6.6 2.4-6.6 5.6 0 3.7 2.2 5.3 5.4 6.1 2.7.7 3.7 1.5 3.7 3.2 0 1.9-1 2.5-3.2 2.5-1.2 0-1.7-.2-2.4-.5l-.7-2.9h-3.1v4.7c1.5.8 3.4 1.5 6.1 1.5 4.4 0 7.1-2 7.1-5.9.3-4.1-2.3-5.4-5.5-6.3",
            id: "svb-2"
        }), React.createElement("path", {
            className: "st0",
            d: "M-932.7 1493.7l17.1 19.5h-6.1l-12.9-17.3 1.9-2.2z",
            id: "svb-3"
        }), React.createElement("path", {
            className: "st1",
            d: "M-937.2 1496.7l9.8 16.6h6.1l-12.9-17.3-3 .7z",
            id: "svb-4"
        }), React.createElement("path", {
            className: "st2",
            d: "M-927.6 1513.2h6.1l-12.9 17.1-3.1-.7 9.9-16.4z",
            id: "svb-5"
        }), React.createElement("path", {
            className: "st3",
            d: "M-921.5 1513.2h6.1l-17.3 19.3-1.7-2.2 12.9-17.1z",
            id: "svb-6"
        }), React.createElement("path", {
            className: "st4",
            d: "M-937.4 1529.6l4.7 2.9-.7-3.6-4 .7z",
            id: "svb-7"
        }), React.createElement("path", {
            className: "st5",
            d: "M-937.2 1496.7l3.9.7.8-3.6-4.7 2.9z",
            id: "svb-8"
        })), exports.td = React.createElement("svg", {
            className: "td-logo",
            height: "51.1",
            viewBox: "-340 265.4 168.4 51.1",
            width: "168.4",
            enableBackground: "new -340 265.4 168.4 51.1"
        }, React.createElement("path", {
            className: "st0",
            d: "M-254.3 289.1h2.4c1.6 0 3.3.4 3.3 2.3 0 1.8-1.7 2.4-3.4 2.4h-2.3v-4.7zm-8.3 9.4h13.3c4.8 0 9.4-.6 9.4-6.4 0-2.3-2-4.8-5.2-5.2v-.1c3.1-.8 4.7-2.5 4.7-5.6 0-4.4-3.9-5.6-7.9-5.6h-14.4l.1 22.9zm8.3-18.6h2.4c1.6 0 3 .5 3 2.2 0 1.7-1.7 2.2-3.2 2.2h-2.2v-4.4zM-226.5 291.5c0 1.5-.9 3.1-2.6 3.1-1.3 0-1.9-.5-1.9-1.6 0-1.8 2-1.9 3.7-1.9h.8v.4zm-10.1-4.7c1.6-.8 3.7-1.4 5.7-1.4 2.1 0 4.3.3 4.4 2.5-.8-.1-2.1-.2-3.2-.2-4.1 0-8.8 1.1-8.8 6.3 0 3.6 3.1 5 6.3 5 2.3 0 4.4-.9 5.6-2.9h.1v2.5h7.7v-10.4c0-6.2-5.8-7.1-10.5-7.1-3.2 0-4.7.3-7.2 1l-.1 4.7zM-216.6 281.4h7.8v3h.1c1-2.4 3.3-3.3 5.6-3.3 4.4 0 6 2.3 6 5.6v11.9h-8.3v-9.9c0-1 0-2.3-1.4-2.3-1.5 0-1.5 1.3-1.5 2.3v9.9h-8.3v-17.2zM-186 288.2l4.8-6.8h9.4l-5.8 7.6 6 9.6h-9.7l-4.7-8.3h-.1v8.3h-8.3V274h8.3v14.2z"
        }), React.createElement("path", {
            className: "st1",
            d: "M-340 316.5h60.8v-51.1H-340v51.1zm39.9-11h-14.2v-24h7.1v19.7h6.8c4.7 0 6.7-3.1 6.7-11 0-8-2.3-10.3-7-10.3h-15.6v25.5h-7V280h-10.3v-4.2h35.1c8.5 0 12.5 4.1 12.5 14.5 0 13.5-6 15.2-14.1 15.2"
        })), exports.us = React.createElement("svg", {
            className: "us-logo",
            width: "199.8",
            height: "51.4",
            viewBox: "0 0 199.8 51.4"
        }, React.createElement("path", {
            id: "us-logo-shield",
            d: "M0 0v39.9l33.8 11.5 33.8-11.5V0H0z"
        }), React.createElement("g", {
            id: "us-logo-bank-text"
        }, React.createElement("path", {
            d: "M71.4 0h10.7v13.6h.1c1.6-2.4 4.5-3.8 7.7-3.8 9.4 0 12 8 12 14.6 0 7-3.8 14.9-11.8 14.9-5.3 0-6.9-2-8.2-3.8h-.1v3.1H71.4V0zm15.1 17.7c-3.8 0-4.7 3.6-4.7 6.9 0 3.4.9 7 4.7 7 3.8 0 4.7-3.6 4.7-7 0-3.3-.9-6.9-4.7-6.9"
        }), React.createElement("path", {
            d: "M131.8 32.4c0 2.1.1 4.5 1.3 6.3h-10.9c-.3-.8-.4-1.9-.4-2.7h-.1c-2.3 2.6-5.6 3.4-9 3.4-5.4 0-9.9-2.6-9.9-8.5 0-8.9 10.4-8.5 15.9-9.6 1.5-.3 2.9-.7 2.9-2.5 0-1.9-1.8-2.6-3.5-2.6-3.3 0-3.9 1.7-4 2.9h-10c.3-7.9 7.8-9.2 14.4-9.2 13.4 0 13.3 5.6 13.3 11v11.5zM121.5 26c-1.3.6-2.8 1-4.2 1.4-2.4.5-3.6 1.1-3.6 3 0 1.3 1.4 2.6 3.4 2.6 2.4 0 4.3-1.5 4.5-4.4V26zM135.6 10.6h10.3v3.6h.1c2-2.8 4.9-4.3 9.1-4.3 5 0 9.6 3.1 9.6 9.5v19.3H154V23.9c0-3.2-.4-5.5-3.5-5.5-1.8 0-4.3.9-4.3 5.4v14.8h-10.7v-28zM168.6 0h10.7v18.7l6.8-8.1h12.1l-10 10.6 11.6 17.4h-12.9l-5.7-10.1-1.9 2v8.1h-10.7z"
        })), React.createElement("path", {
            id: "us-logo-us-text",
            d: "M33.8 38.6H23.4V35h-.1c-2 2.8-4.9 4.3-9.1 4.3-5 0-9.6-3.1-9.6-9.5V10.6h10.7v14.7c0 3.3.4 5.5 3.5 5.5 1.8 0 4.3-.9 4.3-5.4V10.6h10.7v28zM50 39.4c-6.6 0-13.8-2.7-14-9.9h10.2c.1 1 .5 1.8 1.3 2.5.5.5 1.6.8 2.9.8 1.4 0 3.6-.5 3.6-2.2 0-1.6-.9-2.1-5.9-3-8.2-1.4-11.5-4-11.5-8.8 0-7.1 7.6-8.9 13.3-8.9 6.1 0 13.4 1.7 13.6 8.9h-9.7c-.1-.9-.5-1.6-1.2-2.1-.6-.5-1.5-.8-2.4-.8-1.5 0-3.2.3-3.2 2.2 0 .8.7 1.2 1.2 1.5 1.8.8 5.8 1 9.4 2.2 3.6 1.1 6.7 3.2 6.7 7.8-.1 7.6-7.5 9.8-14.3 9.8z"
        })), exports.usaa = React.createElement("svg", {
            className: "usaa-logo",
            fill: "white",
            width: "211.3",
            height: "52",
            viewBox: "0 0 211.3 52"
        }, React.createElement("path", {
            d: "M26.6 25.8c1.5-6.3 2.9-12.3 4.3-18.4.7 1.6 1 3.1 1.5 4.7.3.8.8 1.7 1.5 2.1 7.2 4.3 14.5 8.5 21.8 12.8 1.7 1 3.5 1.5 5.4.5.5-.3 1.2-.8 1.2-1.3.1-1.8.1-3.6.1-5.7-2.8 1.7-5 1.1-7.3-.3-4.6-2.8-9.2-5.7-14-8.1-2.8-1.4-3.9-3.5-4.1-6.8 1.4-.1 2.9-.3 4.4-.4.1-1.3.3-3-1.6-3.5C37.7.8 35.5.3 33.3.3 26.2.3 27.6-.9 25.8 6c-1 3.7-1.9 7.4-2.9 11.4-5.5-3.4-10.8-6.5-16-9.5-1.8-1.1-3.7-1.7-5.7-.7-.5.3-1 1-1.1 1.5-.2 1.7-.1 3.4-.1 5.3 2.9-1.7 5.2-.8 7.7.6 6.2 3.8 12.5 7.4 18.9 11.2zm6.5-10.5c.5 2.4.9 4.3 1.4 6.1.2.7.8 1.5 1.4 1.9 6.5 3.8 12.9 7.6 19.4 11.4 1 .6 2.3 1.2 3.3 1.1 1.2-.1 3.1-.8 3.4-1.7.6-1.6.2-3.5.2-5.4-3.8 1.2-4.2 1.2-7.4-.7-3.8-2.2-7.6-4.5-11.5-6.7-3.2-1.9-6.5-3.8-10.2-6zm2.1 9.2c.5 2.3.8 4.1 1.4 5.9.3.8.9 1.7 1.6 2.2C44 36 49.7 39.4 55.5 42.7c.9.5 1.9 1 2.9 1.1 1.5.1 3.4 0 3.8-1.8.4-1.6.1-3.4.1-5.2-4.3 1-4.3 1-8.3-1.3-.8-.5-1.6-.9-2.4-1.4-5.3-3.1-10.6-6.2-16.4-9.6zm-9 2.6c-6.8-4-13.4-7.8-20-11.6-1.7-1-3.5-1.2-5.2-.2-.4.2-.9.8-1 1.2V22c2.8-1.6 5.1-.9 7.4.5 5.7 3.4 11.5 6.7 17.4 10.2.6-1.9 1-3.7 1.4-5.6zm-1.7 7c-6.2-3.6-12.2-7.3-18.4-10.6-1.3-.7-3.3-.4-5-.3-.4 0-1 .9-1.1 1.5-.1 1.6 0 3.3 0 5.2 2.9-1.7 5.3-.8 7.7.7 3.6 2.2 7.4 4.4 11.1 6.5 1.4.8 2.9 1.6 4.4 2.5.5-2 .9-3.7 1.3-5.5zm-3 12.5c.5-1.9.9-3.7 1.4-5.6-5.8-3.3-11.4-6.7-17.2-9.9-.6-.4-1.5-.5-2.2-.6-2.4-.1-3.5 1-3.5 3.3v3.8c4.1-1.1 4.1-1.1 8 1.2 4.4 2.5 8.9 5.1 13.5 7.8z"
        }), React.createElement("path", {
            d: "M87.8 52c-.7-.2-1.4-.4-2.2-.5-6.4-1.1-10.8-4.8-11.3-11.3-.8-10.4-.7-20.9-1-31.4h8.5V34.4c0 1.3.1 2.7.4 4 1.1 4.8 4.4 7.1 9.2 6.6 4.4-.5 7.2-3.6 7.3-8.3.1-8.5 0-17 0-25.5V8.8h7.4c0 .5.1 1 .1 1.4 0 8.2.2 16.3-.1 24.5-.1 3.1-.8 6.4-2 9.3-1.9 4.6-5.9 6.8-10.7 7.6-.5.1-1 .3-1.6.4h-4zM122.9 52c-2.3-.3-4.7-.5-7-.8-3.7-.5-3.7-.5-4-4.1-.1-1.5-.3-3.1-.4-4.5 3.1.9 6.1 1.9 9.2 2.4 1.9.3 4-.1 5.9-.6 1.9-.5 3.1-2.1 3.2-4.2.1-2.2-.9-3.8-2.8-4.8-2.3-1.3-4.8-2.4-7.2-3.6-3.5-1.8-6.4-4.1-7.5-8.1-1.8-7 2.1-13.1 9.6-15 4.7-1.2 9.4-.6 13.8 1.3.5.2 1.1.9 1.1 1.5.1 2.1.1 4.2.1 6.7l-2.1-1.4c-3.3-2-6.7-2.7-10.5-1.8-2.1.5-3.7 1.8-4.2 4-.4 2.2.6 3.9 2.3 5.1 1.3.9 2.8 1.6 4.2 2.3 1.4.7 2.8 1.3 4.2 2 5.4 2.7 7.9 6.9 7.3 12.3-.6 5.1-4.4 9.2-9.8 10.6-1.3.3-2.7.6-4.1.8-.5-.1-.9-.1-1.3-.1zM58.3 52c-6.1-3.5-12.3-7-18.4-10.5-.4-.2-.8-.6-.9-1-.5-2.1-1-4.2-1.6-6.8 4.3 2.5 8.2 4.8 12.1 7.1 1.8 1.1 3.7 2.1 5.4 3.2 2.2 1.4 4.5 2 6.9.6 1.3 3.6.6 6-2.3 7.4h-1.2zM26.6 25.8C20.2 22 13.9 18.4 7.7 14.7 5.3 13.2 2.9 12.3 0 14c0-2-.1-3.6.1-5.3 0-.5.6-1.2 1.1-1.5 2-1.1 3.9-.5 5.8.6 5.2 3.1 10.4 6.1 15.9 9.3 1-3.9 1.9-7.6 2.9-11.4 1.8-6.9.4-5.7 7.5-5.7 2.2 0 4.4.5 6.5 1.1 1.9.5 1.7 2.3 1.6 3.5-1.6.2-3 .3-4.4.4 0 3.5 1.1 5.6 4 7 4.8 2.5 9.4 5.4 14 8.1 2.3 1.4 4.5 2 7.3.3 0 2.1.1 3.9-.1 5.7 0 .5-.7 1-1.2 1.3-1.9 1-3.7.5-5.4-.5-7.3-4.2-14.6-8.5-21.8-12.8-.7-.4-1.2-1.3-1.5-2.1-.5-1.5-.8-3.1-1.5-4.7-1.3 6.1-2.7 12.2-4.2 18.5zM33.1 15.3c3.7 2.2 7 4.1 10.2 6 3.8 2.2 7.6 4.5 11.5 6.7 3.2 1.9 3.6 1.9 7.4.7 0 1.9.4 3.8-.2 5.4-.3.9-2.2 1.6-3.4 1.7-1.1.1-2.3-.5-3.3-1.1-6.5-3.7-13-7.5-19.4-11.4-.6-.4-1.2-1.2-1.4-1.9-.5-1.8-.8-3.7-1.4-6.1zM35.2 24.5c5.8 3.4 11.1 6.5 16.4 9.6.8.5 1.6.9 2.4 1.4 4 2.3 4 2.3 8.3 1.3 0 1.8.3 3.6-.1 5.2-.4 1.8-2.3 1.9-3.8 1.8-1-.1-2-.6-2.9-1.1C49.7 39.4 44 36 38.2 32.6c-.7-.4-1.3-1.4-1.6-2.2-.5-1.8-.8-3.6-1.4-5.9zM26.2 27.1c-.5 1.9-.9 3.7-1.3 5.6-6-3.5-11.7-6.8-17.4-10.2-2.4-1.4-4.6-2.1-7.5-.5 0-2-.1-3.8 0-5.6 0-.4.5-.9 1-1.2 1.8-1 3.5-.7 5.2.2 6.7 3.9 13.3 7.8 20 11.7zM24.5 34.1c-.4 1.9-.8 3.6-1.3 5.5-1.6-.9-3-1.7-4.4-2.5-3.7-2.2-7.4-4.3-11.1-6.5-2.4-1.5-4.8-2.3-7.7-.7 0-1.9-.1-3.6.1-5.3 0-.5.7-1.5 1.1-1.5 1.7-.1 3.7-.5 5 .3 6.1 3.4 12.1 7 18.3 10.7zM21.5 46.6c-4.6-2.7-9-5.3-13.5-7.8-3.8-2.2-3.8-2.2-8-1.2v-3.8c0-2.3 1.1-3.4 3.4-3.3.8 0 1.6.2 2.2.6 5.7 3.3 11.4 6.6 17.2 9.9-.4 1.9-.8 3.7-1.3 5.6zM210.3 48c-1.8-5.1-3.7-10.3-5.5-15.4-2.8-8.1-5.7-16.3-8.6-24.3h-8.4c.1 2 .7 3.6.2 5-3.9 10.9-8 21.8-12.1 32.6-.2.5-.5.9-.9 1.8-4.7-13.4-9.3-26.4-13.9-39.4h-9c2.2 3 .9 5.4-.1 8l-6.3 16.8c-2.2 5.8-4.3 11.6-6.5 17.4 7.2 1.2 7.7.9 9.9-5.5.4-1.2.9-1.7 2.2-1.6 2.5.1 5.1 0 7.6 0 5.6 0 5.6 0 7.5 5.4.1.2.1.5.2.6.6.5 1.2 1.3 1.8 1.3 4.1.1 8.3.1 12.4 0 .6 0 1.5-.7 1.8-1.2.7-1.5 1.1-3.2 1.8-4.7.3-.6 1.1-1.2 1.7-1.3 4.1-.1 8.2-.1 12.2 0 .6 0 1.4.6 1.6 1.1 1 2 1.2 4.9 2.7 5.9 1.6 1 4.5.3 6.7.3.6 0 .8 0 1.8-.1v-.8c.2-.7-.5-1.2-.8-1.9zm-58.4-10.7c1.9-5 3.7-10.5 5.7-16.1 1.8 5.7 3.4 11.1 5.1 16.1h-10.8zm35.1 0c1.8-5 3.6-10.2 5.4-15.3.2 0 .3-.1.5-.1 1.6 5.1 3.2 10.4 4.9 15.4H187z"
        })), exports.wells = React.createElement("svg", {
            className: "wells-logo",
            width: "210",
            height: "50",
            viewBox: "0 0 210 89.3"
        }, React.createElement("path", {
            d: "M26.9 68.1h-2.7V57.6H33c4.2 0 6.6.3 7.8 2.4.8 1.9 1.4 4.2 1.4 6.9v.2h3.9V53.6H10.2v3.9h2c3.1 0 4.1.3 4.1 3.2v20.7c0 2.9-1 3.2-4.1 3.2h-2v3.9h21.5v-3.9h-4.1c-3.1 0-3.6-.3-3.6-3.2v-9.2h2.7c4.4 0 5.1 1.2 5.1 7.1h3.4V61.9H32c0 5.4-.6 6.2-5.1 6.2zM23.4 36.1L31 16.6l8 19.3h6.3l10-26.8c1.2-3.1 2.2-4.2 5.1-4.2h.5c3.1 0 4.7.3 4.7 3.2v20.7c0 2.9-1.7 3.2-4.7 3.2h-2v3.9h38.5v-14h-4.1c-.5 6.9-2 10-8.5 10H73.6V19.7h2.5c4.4 0 4.9.8 5.3 6.8h4.1V8.6h-4.1c-.3 5.3-1 6.8-5.4 6.8h-2.5V5.1h9.8c7.1 0 9.2 1.4 9.3 9.5h4.1V1H44.9v3.9h2.4c1.9 0 2.9.3 2.9 1.5 0 .7 0 1.5-.5 2.7l-6.8 17.6h-.3c-3.1-8.8-7.3-19-7.3-19-.3-.5-.3-1-.3-1.5 0-1 .7-1.4 2.4-1.4h3.1V1h-19v4.1h2.4c3.1 0 3.9 1.5 4.2 4.4L21.2 27h-.5c-3.2-9.5-7.3-19.2-7.3-19.2-.2-.5-.2-1-.2-1.2 0-1.2.8-1.7 2.9-1.7h1.7V1H0v3.9h.8c2.5 0 4.4 1.7 5.6 4.7L16.7 36h6.7zM144.4 8.3v20.5c0 2.9-1.4 3.2-4.4 3.2h-.5v4.1h34.7V22h-4.1c0 3.4-.5 5.4-1.5 7.3-1.2 2-3.6 2.5-7.8 2.5h-8.5V8.1c0-2.9.7-3.2 4.1-3.2h2.5V1h-21.2v4.1h2.2c3.2 0 4.5.3 4.5 3.2zM106.8 8.3v20.5c0 2.9-1.4 3.2-4.4 3.2h-2v4.1h35.9V22h-4.1c0 3.4-.5 5.4-1.5 7.3-1 2-3.6 2.5-7.6 2.5h-8.5V8.1c0-2.9.7-3.2 4.1-3.2h2.5V1H100v4.1h2c3.1 0 4.8.3 4.8 3.2zM196.6 14.6l-7.3-1.4c-3.4-.7-5.9-1-5.9-3.6 0-2.9 2.9-5.3 6.9-5.4 5.8-.2 12.4 1.9 13.2 8.6h3.9V.7h-3.1l-1.7 2.9C199 .7 194.1 0 190.3 0c-7.8.2-13.6 4.2-13.4 10.7.2 5.8 3.1 8.5 12 10l5.9 1.2c4.1.8 9 .5 8.5 4.9-.3 3.9-4.2 5.3-9.8 5.1-6.4-.2-10.8-3.1-12-9.8h-4.1v14.1h3.6l1.2-3.7c1.2 1 6.6 4.2 12.2 4.2 9.3 0 15.6-2.9 15.6-10.8 0-8.6-5.8-10.1-13.4-11.3zM146.6 73.9h1.7c3.4 0 3.9 0 3.9 2.4v1.9c0 4.1-4.2 6.4-9 6.4-6.6-.2-10.2-5.1-10.2-14.1 0-8.8 4.4-13.6 10.2-13.6s9.3 2.4 11 7.6h3.4V53.1h-2.7l-1.9 3.6c-2.5-2.7-7.1-3.7-11-3.7-4.7-.2-9.3 1.5-12.4 4.6-3.6 3.6-5.3 7.8-5.3 13.2-.2 5.4 1.9 10 5.3 13.6 3.4 3.2 7.5 4.9 12.2 4.9 4.1 0 8.6-1.2 11.9-3.7l1.9 2.9h2.9V76.6c0-2.9.3-2.7 2.9-2.7h1.4v-4.1h-16.1v4.1zM117.6 84.2c-1 .2-1.9-.8-2-2.9v-2.2c-.3-4.7-1.2-6.9-7.5-8.5 6.8-.8 10.7-3.9 10.7-9 0-5.6-4.2-8.3-13.2-8.3H81.5v3.9h2.9c3.1 0 3.6.3 3.6 3.2v20.8c0 2.5-1.7 3.2-3.7 3.2h-3.1v.1c-1.6-.1-2.6-.9-3.6-3.4L66.4 53.7h-8.6L46.1 81.4c-1 2.4-1.9 3.4-4.6 3.4H40v3.9h18.1v-3.9h-3.6c-1.9 0-2.9 0-2.9-1.2 0-.5.2-1 .5-1.7l1.7-4.4h13.7l1.5 4.1c.3.7.5 1.2.5 1.7 0 1.2-1 1.4-3.1 1.4h-3.7v4.1h20.5v-.2h19.3v-3.9h-3.2c-3.1 0-3.6-.3-3.6-3.2V72h3.6c6.1 0 8 1.2 8.1 7.1l.2 4.1c.2 4.7 3.4 6.1 8.1 6.1 4.2 0 7.1-2.5 7.1-9 0-.7 0-1.2.2-2h-3.4c.4 4.2.2 5.8-2 5.9zm-61.8-11L61 59.8l5.3 13.4H55.8zm47.8-5.1H96V57.5h7.5c4.9 0 7.3 1.2 7.3 5.3-.1 3.6-2.5 5.2-7.2 5.3zM186.1 52.7c-11.5 0-20.5 7.1-20.5 18.1 0 11 9 18.3 20.7 18.3 11.5 0 20.3-7.3 20.2-18.3-.1-11-8.7-18.1-20.4-18.1zm0 32.4c-6.8 0-12-4.9-12-14.1s5.3-13.9 12-13.9c6.8 0 11.9 4.7 11.9 13.9s-5.1 14.1-11.9 14.1z"
        }));

    }, {
        "react": "react"
    }],
    60: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            SandboxMessage = function() {
                return React.createElement("div", {
                    className: "sandbox-view"
                }, "You are currently in Sandbox mode. Credentials Â» username: plaid_test | password: plaid_good | answer: tomato | code: 1234")
            };
        SandboxMessage.displayName = "SandboxMessage", module.exports = SandboxMessage;

    }, {
        "react": "react"
    }],
    61: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            Logos = require("./Logos"),
            logoStyles = function(t) {
                return {
                    backgroundImage: "url(data:image/png;base64," + t + ")"
                }
            },
            PrimaryName = function(t) {
                var e = t.institution,
                    n = null != e.nameBreak ? e.name.substr(0, e.nameBreak).trim() : e.name.trim();
                return React.createElement("span", {
                    className: "banner-big-text"
                }, n)
            },
            SecondaryName = function(t) {
                if (null != t.institution.nameBreak) {
                    var e = t.institution.name.substr(t.institution.nameBreak).trim();
                    return React.createElement("span", {
                        className: "banner-small-text"
                    }, e)
                }
                return React.createElement("span", null)
            },
            SmallLogo = function(t) {
                return React.createElement("div", null, React.createElement("span", {
                    className: "banner-small-logo",
                    style: logoStyles(t.institution.logo)
                }), React.createElement("div", {
                    className: "banner-title-name"
                }, React.createElement(PrimaryName, {
                    institution: t.institution
                }), React.createElement(SecondaryName, {
                    institution: t.institution
                })))
            },
            NoLogo = function(t) {
                return React.createElement("div", {
                    className: "banner-no-logo"
                }, React.createElement(PrimaryName, {
                    institution: t.institution
                }), React.createElement(SecondaryName, {
                    institution: t.institution
                }))
            },
            StaticLogo = function(t) {
                return null != Logos[t.institution.id] ? Logos[t.institution.id] : t.institution.logo ? React.createElement(SmallLogo, t) : React.createElement(NoLogo, t)
            };
        StaticLogo.displayName = "StaticLogo", StaticLogo.propTypes = {
            institution: PropTypes.institution.isRequired
        }, module.exports = StaticLogo;

    }, {
        "../../constants/PropTypes": 69,
        "./Logos": 59,
        "react": "react"
    }],
    62: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            PropTypes = require("../../constants/PropTypes"),
            subBannerStylesFor = function(e) {
                return {
                    height: "48px",
                    lineHeight: "51px",
                    color: "#fff",
                    fontSize: "16px",
                    paddingLeft: "16px",
                    position: "relative",
                    background: e.colors.darker,
                    backgroundSize: "27px"
                }
            },
            SubBanner = function(e) {
                return React.createElement("div", {
                    className: "sub-banner",
                    style: subBannerStylesFor(e.institution)
                }, React.createElement("i", {
                    className: "sprite sprite-i-circle"
                }), React.createElement("span", {
                    className: "sub-banner__text"
                }, e.message))
            };
        SubBanner.displayName = "SubBanner", SubBanner.propTypes = {
            institution: PropTypes.institution.isRequired,
            message: React.PropTypes.string.isRequired
        }, module.exports = SubBanner;

    }, {
        "../../constants/PropTypes": 69,
        "react": "react"
    }],
    63: [function(require, module, exports) {
        "use strict";
        exports.EXIT_LINK = "EXIT_LINK", exports.HANDOFF = "HANDOFF", exports.RESET_STATE = "RESET_STATE", exports.INITIALIZE_CONFIG = "INITIALIZE_CONFIG", exports.UPDATE_CONFIG = "UPDATE_CONFIG", exports.CONNECTED_CONTINUE = "CONNECTED_CONTINUE", exports.INSTITUTION_SEARCH_BEGIN = "INSTITUTION_SEARCH_BEGIN", exports.INSTITUTION_SEARCH_SUCCESS = "INSTITUTION_SEARCH_SUCCESS", exports.INSTITUTION_SEARCH_FAILURE = "INSTITUTION_SEARCH_FAILURE", exports.INSTITUTION_SEARCH_SELECT_INDEX = "INSTITUTION_SEARCH_SELECT_INDEX", exports.TOGGLE_INSTITUTION_SEARCH = "TOGGLE_INSTITUTION_SEARCH", exports.CREDENTIALS_REQUEST_FAILURE = "CREDENTIALS_REQUEST_FAILURE", exports.INVALIDATE_INPUT_FIELD = "INVALIDATE_INPUT_FIELD", exports.RESTORE_INPUT_FIELD = "RESTORE_INPUT_FIELD", exports.SUBMIT_CREDENTIALS = "SUBMIT_CREDENTIALS", exports.UPDATE_PASSWORD = "UPDATE_PASSWORD", exports.UPDATE_PIN = "UPDATE_PIN", exports.UPDATE_USERNAME = "UPDATE_USERNAME", exports.ACKNOWLEDGE_ERROR = "ACKNOWLEDGE_ERROR", exports.GO_TO_SELECT_PAGE = "GO_TO_SELECT_PAGE", exports.SELECT_INSTITUTION = "SELECT_INSTITUTION", exports.BEGIN_LOADER = "BEGIN_LOADER", exports.UPDATE_LOADER = "UPDATE_LOADER", exports.FINISH_LOADER = "FINISH_LOADER", exports.GO_BACK_TO_SELECT_ACCOUNT = "GO_BACK_TO_SELECT_ACCOUNT", exports.INVALIDATE_LONGTAIL_AUTH = "INVALIDATE_LONGTAIL_AUTH", exports.RESTORE_LONGTAIL_AUTH = "RESTORE_LONGTAIL_AUTH", exports.LONGTAIL_AUTH_REQUEST_FAILURE = "LONGTAIL_AUTH_REQUEST_FAILURE", exports.LONGTAIL_AUTH_REQUEST_SUBMIT = "LONGTAIL_AUTH_REQUEST_SUBMIT", exports.LONGTAIL_AUTH_REQUEST_SUCCESS = "LONGTAIL_AUTH_REQUEST_SUCCESS", exports.STEP_TO_ACCOUNT = "STEP_TO_ACCOUNT", exports.STEP_TO_ROUTING = "STEP_TO_ROUTING", exports.UPDATE_ACCOUNT_NUMBER = "UPDATE_ACCOUNT_NUMBER", exports.UPDATE_ROUTING_NUMBER = "UPDATE_ROUTING_NUMBER", exports.MFA_REQUEST_FAILURE = "MFA_REQUEST_FAILURE", exports.INVALIDATE_MFA_CODE = "INVALIDATE_MFA_CODE", exports.INVALIDATE_MFA_QUESTION = "INVALIDATE_MFA_QUESTION", exports.NEXT_MFA_QUESTION = "NEXT_MFA_QUESTION", exports.RESTORE_MFA_CODE = "RESTORE_MFA_CODE", exports.RESTORE_MFA_QUESTION = "RESTORE_MFA_QUESTION", exports.RESEND_MFA_CODE = "RESEND_MFA_CODE", exports.SUBMIT_MFA = "SUBMIT_MFA", exports.UPDATE_MFA_CODE = "UPDATE_MFA_CODE", exports.UPDATE_MFA_DEVICE = "UPDATE_MFA_DEVICE", exports.ADD_MFA_QUESTION_ANSWER = "ADD_MFA_QUESTION_ANSWER", exports.UPDATE_MFA_QUESTION_CURRENT_ANSWER = "UPDATE_MFA_QUESTION_CURRENT_ANSWER", exports.UPDATE_MFA_SELECTION = "UPDATE_MFA_SELECTION", exports.CONNECTED = "CONNECTED", exports.CHOOSE_DEVICE = "CHOOSE_DEVICE", exports.REQUIRES_CODE = "REQUIRES_CODE", exports.REQUIRES_CREDENTIALS = "REQUIRES_CREDENTIALS", exports.REQUIRES_QUESTIONS = "REQUIRES_QUESTIONS", exports.REQUIRES_SELECTIONS = "REQUIRES_SELECTIONS", exports.CLOSE_EXIT_PROMPT = "CLOSE_EXIT_PROMPT", exports.OPEN_EXIT_PROMPT = "OPEN_EXIT_PROMPT", exports.GO_BACK_TO_MFA_DEVICE = "GO_BACK_TO_MFA_DEVICE", exports.GO_BACK_TO_INSTITUTION_SELECT = "GO_BACK_TO_INSTITUTION_SELECT", exports.OPEN_LINK = "OPEN_LINK", exports.OPEN_LINK_AT_INSTITUTION = "OPEN_LINK_AT_INSTITUTION", exports.ANIMATE_BACK = "ANIMATE_BACK", exports.ANIMATE_IN = "ANIMATE_IN", exports.ANIMATE_NEXT = "ANIMATE_NEXT", exports.ANIMATE_NONE = "ANIMATE_NONE", exports.ANIMATE_DEFAULT = "ANIMATE_DEFAULT", exports.DESELECT_ACCOUNT = "DESELECT_ACCOUNT", exports.SELECT_ACCOUNT = "SELECT_ACCOUNT", exports.CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT", exports.DECREMENT_ACCOUNT_PAGINATION = "DECREMENT_ACCOUNT_PAGINATION", exports.INCREMENT_ACCOUNT_PAGINATION = "INCREMENT_ACCOUNT_PAGINATION";

    }, {}],
    64: [function(require, module, exports) {
        "use strict";
        var getErrorByCode = function(e) {
            return {
                title: "Please try connecting a different account",
                message: "There was a problem processing your request. Your account could not be connected at this time.",
                button: "Restart",
                icon: "x",
                code: e
            }
        };
        module.exports = {
            "-2": {
                title: "The account number you provided was incorrect",
                message: "Your Account Number is specific to your personal account, located on your checkbook or online.",
                button: "Retry",
                icon: "x",
                code: "-2"
            },
            "-1": {
                title: "Invalid key",
                message: "The public key you provided was incorrect. Your public key is available from the Plaid dashboard.",
                button: "Exit",
                icon: "x",
                code: "-1"
            },
            1005: {
                title: "Credentials missing",
                message: "Please provide a username and password.",
                button: "Retry login",
                icon: "x",
                code: "1005"
            },
            1104: {
                title: "Unauthorized Product",
                message: 'Your client ID does not have access to this product. If you believe this is an error, please contact <a href="mailto:support@plaid.com">support@plaid.com</a>.',
                button: "Exit",
                icon: "x",
                code: "1104"
            },
            1109: {
                title: "Sandbox Error",
                message: "When using the sandbox 'test_key', only sandbox API credentials are supported. See <a href=\"https://plaid.com/docs/api#sandbox\">our docs</a> for more.",
                button: "Retry login",
                icon: "x",
                code: "1109"
            },
            1112: {
                title: "Addition Limit Exceeded",
                message: 'The client_id associated with this account has exceeded the maximum number of additions allowed in development mode. Contact <a href="mailto:support@plaid.com">support@plaid.com</a> to resolve.',
                button: "Exit",
                icon: "x",
                code: "1112"
            },
            1114: {
                title: "Unauthorized Environment",
                message: 'Your Client ID is not authorized to access this API environment. Contact <a href="mailto:support@plaid.com">support@plaid.com</a> to gain access.',
                button: "Exit",
                icon: "x",
                code: "1114"
            },
            1200: {
                title: "The credentials you provided were incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry login",
                icon: "x",
                code: "1200"
            },
            1201: {
                title: "The username you provided was incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry login",
                icon: "x",
                code: "1201"
            },
            1202: {
                title: "The password you provided was incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry login",
                icon: "x",
                code: "1202"
            },
            1209: {
                title: "The PIN you provided was incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry login",
                icon: "x",
                code: "1209"
            },
            "1203:choose_device": {
                title: "The device selected was invalid",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Reselect device",
                icon: "x",
                code: "1203:choose_device"
            },
            "1203:requires_questions": {
                title: "Your answer was incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry answer",
                icon: "x",
                code: "1203:requires_questions"
            },
            "1203:requires_code": {
                title: "Your security code was incorrect",
                message: "For security reasons, your account may be locked after several unsuccessful attempts.",
                button: "Retry",
                icon: "x",
                code: "1203:requires_code"
            },
            "1203:requires_selections": {
                title: "Your answers were incorrect",
                message: 'When using the sandbox, please answer "Yes" to both security selections.',
                button: "Retry selections",
                icon: "x",
                code: "1203:requires_selections"
            },
            1205: {
                title: "Your account has been temporarily locked",
                message: "For your protection, your account has been locked. Click below to unlock your account.",
                button: "Unlock account",
                icon: "lock",
                code: "1205"
            },
            1206: {
                title: "Your account is not yet authorized for online use",
                message: "Please complete the account setup process in order to continue.",
                button: "Setup Account",
                icon: "lock",
                code: "1206"
            },
            1207: {
                title: "Account not currently supported",
                message: "Please login using a different account.",
                button: "Return",
                icon: "x",
                code: "1207"
            },
            1208: {
                title: "Account not currently supported",
                message: "Multifactor authentication is not currently supported for this account. Please log in using a different account.",
                button: "Return",
                icon: "x",
                code: "1208"
            },
            1210: {
                title: "Account not currently supported",
                message: "Please use a different account.",
                button: "Return",
                icon: "x",
                code: "1210"
            },
            1211: {
                title: "Restricted Access",
                message: 'The security rules for this account restrict access. Disable "Extra Security at Sign-In" in your Bank of America settings.',
                button: "Return",
                icon: "x",
                code: "1211"
            },
            1212: {
                title: "Account not currently supported",
                message: "Please use a different account.",
                button: "Return",
                icon: "x",
                code: "1212"
            },
            1302: getErrorByCode("1302"),
            1303: getErrorByCode("1303"),
            1700: getErrorByCode("1700"),
            1701: getErrorByCode("1701"),
            1702: getErrorByCode("1702"),
            1800: getErrorByCode("1800"),
            "no-depository-accounts": {
                title: "No eligible accounts",
                message: "None of your accounts are eligible for money movement via ACH. Please connect using a different bank.",
                button: "Return",
                icon: "x",
                code: "no-depository-accounts"
            }
        };

    }, {}],
    65: [function(require, module, exports) {
        "use strict";
        var MfaStatus = require("./MfaStatus");
        module.exports = {}, module.exports[MfaStatus.REQUIRES_CREDENTIALS] = [{
            percentage: 20,
            message: "Sending credentials"
        }, {
            percentage: 40,
            message: "Average loading time: 15 seconds"
        }, {
            percentage: 100,
            message: "Authorizing with our servers"
        }], module.exports[MfaStatus.CHOOSE_DEVICE] = [{
            percentage: 20,
            message: "Communicating with servers"
        }, {
            percentage: 40,
            message: "Sending over network"
        }, {
            percentage: 100,
            message: "Requesting code"
        }], module.exports[MfaStatus.REQUIRES_CODE] = [{
            percentage: 20,
            message: "Communicating with servers"
        }, {
            percentage: 40,
            message: "Sending over network"
        }, {
            percentage: 100,
            message: "Verifying code"
        }], module.exports[MfaStatus.REQUIRES_QUESTIONS] = [{
            percentage: 20,
            message: "Communicating with servers"
        }, {
            percentage: 40,
            message: "Sending over network"
        }, {
            percentage: 100,
            message: "Verifying response"
        }], module.exports[MfaStatus.REQUIRES_SELECTIONS] = [{
            percentage: 20,
            message: "Communicating with servers"
        }, {
            percentage: 40,
            message: "Sending over network"
        }, {
            percentage: 100,
            message: "Verifying selections"
        }];

    }, {
        "./MfaStatus": 66
    }],
    66: [function(require, module, exports) {
        "use strict";
        exports.CONNECTED = "connected", exports.CHOOSE_DEVICE = "choose_device", exports.REQUIRES_CODE = "requires_code", exports.REQUIRES_CREDENTIALS = "requires_credentials", exports.REQUIRES_QUESTIONS = "requires_questions", exports.REQUIRES_SELECTIONS = "requires_selections";

    }, {}],
    67: [function(require, module, exports) {
        "use strict";
        exports.CONNECTED_PANE = "ConnectedPane", exports.CREDENTIAL_PANE = "CredentialPane", exports.ERROR_PANE = "ErrorPane", exports.EXIT_PANE = "ExitPane", exports.INSTITUTION_SELECT_PANE = "InstitutionSelectPane", exports.LOADING_PANE = "LoadingPane", exports.LONGTAIL_AUTH_PANE = "LongtailAuthPane", exports.MFA_CODE_PANE = "MfaCodePane", exports.MFA_DEVICE_PANE = "MfaDevicePane", exports.MFA_QUESTION_PANE = "MfaQuestionPane", exports.MFA_SELECTION_PANE = "MfaSelectionPane", exports.SELECT_ACCOUNT_PANE = "SelectAccountPane", exports.HANDOFF_EXIT = "Exit", exports.HANDOFF_SUCCESS = "Handoff";

    }, {}],
    68: [function(require, module, exports) {
        "use strict";
        var toHex = function(e) {
                return ("0" + e.toString(16)).slice(-2)
            },
            rgba = function(e, t, o, s) {
                return "rgba(" + e + ", " + t + ", " + o + ", " + s + ")"
            },
            rgb = function(e, t, o) {
                return "#" + toHex(e) + toHex(t) + toHex(o)
            };
        exports.amex = {
            id: "amex",
            index: 10,
            name: "American Express",
            products: {
                auth: !1,
                connect: !0,
                creditdetails: !1,
                income: !0,
                info: !1,
                risk: !0
            },
            colors: {
                primary: rgb(0, 135, 196),
                darker: rgb(0, 84, 122),
                gradient: [rgb(0, 135, 196), rgb(71, 198, 255)]
            },
            forgottenPassword: "https://online.americanexpress.com/myca/fuidfyp/us/action/fuidfyp?request_type=un_fuid&Face=en_US",
            accountLocked: "https://online.americanexpress.com/myca/fuidfyp/us/action/fuidfyp?request_type=NewPassword&Face=en_US&AccountRevoked=1",
            accountSetup: "https://www.americanexpress.com/",
            video: "amex",
            fields: [{
                name: "username",
                label: "User ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.bofa = {
            id: "bofa",
            index: 1,
            name: "Bank of America",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(220, 20, 48),
                darker: rgb(180, 11, 35),
                gradient: [rgb(227, 24, 55), rgb(250, 20, 51)]
            },
            forgottenPassword: "https://secure.bankofamerica.com/login/reset/entry/forgotPwdScreen.go",
            accountLocked: "https://securemessaging.bankofamerica.com/srt/help.do?appid=12",
            accountSetup: "https://secure.bankofamerica.com",
            video: "bofa",
            fields: [{
                name: "username",
                label: "Online ID",
                type: "text"
            }, {
                name: "password",
                label: "Passcode",
                type: "password"
            }]
        }, exports.capone360 = {
            id: "capone360",
            index: 8,
            name: "Capital One 360",
            products: {
                auth: !0,
                connect: !1,
                creditdetails: !1,
                income: !1,
                info: !1,
                risk: !1
            },
            colors: {
                primary: rgb(161, 40, 49),
                darker: rgb(98, 24, 29),
                gradient: [rgb(161, 40, 49), rgb(255, 93, 106)]
            },
            forgottenPassword: "https://secure.capitalone360.com/myaccount/banking/forgot_cif_input.vm",
            accountLocked: "https://secure.capitalone360.com/myaccount/banking/forgotpassword?execution=e2s1&stateId=collectsecurityinfo",
            accountSetup: "https://secure.capitalone360.com",
            video: "capone360",
            fields: [{
                name: "username",
                label: "Username / Customer #",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.chase = {
            id: "chase",
            index: 0,
            name: "Chase",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(23, 93, 165),
                darker: rgb(16, 63, 116),
                gradient: [rgb(23, 93, 165), rgb(58, 128, 200)]
            },
            forgottenPassword: "https://chaseonline.chase.com/Public/Reidentify/ReidentifyFilterView.aspx?LOB=RBGLogon",
            accountLocked: "https://chaseonline.chase.com/Public/Error.aspx?logonReason=sso_logon_loc&LOB=RBGLogon",
            accountSetup: "https://chaseonline.chase.com",
            video: "chase",
            fields: [{
                name: "username",
                label: "User ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.citi = {
            id: "citi",
            index: 3,
            name: "Citi",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(9, 40, 105),
                darker: rgb(5, 29, 81),
                gradient: [rgb(9, 40, 105), rgba(16, 71, 188, .91)]
            },
            forgottenPassword: "https://online.citibank.com/US/JSO/uidn/RequestUserIDReminder.do",
            accountLocked: "https://online.citibank.com/US/JSO/signon/uname/Next.do",
            accountSetup: "https://online.citibank.com",
            video: "citi",
            fields: [{
                name: "username",
                label: "User ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.fidelity = {
            id: "fidelity",
            index: 6,
            name: "Fidelity",
            products: {
                auth: !0,
                connect: !1,
                creditdetails: !1,
                income: !1,
                info: !1,
                risk: !1
            },
            colors: {
                primary: rgb(117, 169, 35),
                darker: rgb(78, 110, 33),
                gradient: [rgb(117, 169, 35), rgb(63, 152, 26)]
            },
            forgottenPassword: "https://fps.fidelity.com/ftgw/Fps/Fidelity/RtlCust/Resolve/Init",
            accountLocked: "http://wps.fidelity.com/servlets/Help/newlog/trouble.html#question3",
            accountSetup: "https://login.fidelity.com/ftgw/Fas/Fidelity/RtlCust/Login/Init",
            video: "fidelity",
            fields: [{
                name: "username",
                label: "Username",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.nfcu = {
            id: "nfcu",
            index: 12,
            name: "Navy Federal Credit Union",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !1,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(10, 68, 125),
                darker: rgb(8, 51, 94),
                gradient: [rgb(9, 61, 113), rgb(14, 92, 170)]
            },
            forgottenPassword: "https://www.navyfederal.org/forgot_password.html",
            accountLocked: "https://www.navyfederal.org/",
            accountSetup: "https://www.navyfederal.org/",
            video: "nfcu",
            fields: [{
                name: "username",
                label: "Access Number",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.pnc = {
            id: "pnc",
            index: 7,
            name: "PNC",
            products: {
                auth: !0,
                connect: !1,
                creditdetails: !0,
                income: !1,
                info: !0,
                risk: !1
            },
            colors: {
                primary: rgb(14, 105, 170),
                darker: rgb(11, 83, 136),
                gradient: [rgb(5, 77, 127), rgb(14, 105, 170)]
            },
            forgottenPassword: "https://www.onlinebanking.pnc.com/alservlet/ForgotUserIdServlet",
            accountLocked: "https://www.pnc.com",
            accountSetup: "https://www.pnc.com",
            video: "pnc",
            fields: [{
                name: "username",
                label: "Username",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.schwab = {
            id: "schwab",
            index: 14,
            name: "Charles Schwab",
            products: {
                auth: !0,
                connect: !1,
                creditdetails: !1,
                income: !1,
                info: !1,
                risk: !1
            },
            colors: {
                primary: rgb(0, 140, 218),
                darker: rgb(0, 106, 163),
                gradient: [rgb(0, 140, 218), rgba(51, 184, 255, .9)]
            },
            forgottenPassword: "https://client.schwab.com/Areas/Login/ForgotPassword/FYPIdentification.aspx",
            accountLocked: "https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx",
            accountSetup: "https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx",
            video: "schwab",
            fields: [{
                name: "username",
                label: "Login ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.suntrust = {
            id: "suntrust",
            index: 11,
            name: "SunTrust",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(0, 74, 128),
                darker: rgb(0, 48, 82),
                gradient: [rgb(0, 44, 93), rgb(0, 68, 125)]
            },
            forgottenPassword: "https://onlinebanking.suntrust.com/UI/login#/forgotcredentials",
            accountLocked: "https://www.suntrust.com",
            accountSetup: "https://www.suntrust.com",
            video: "usaa",
            fields: [{
                name: "username",
                label: "User ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.td = {
            id: "td",
            index: 9,
            name: "TD Bank",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !1
            },
            colors: {
                primary: rgb(53, 178, 51),
                darker: rgb(40, 123, 41),
                gradient: [rgb(33, 170, 33), rgb(44, 208, 44)]
            },
            forgottenPassword: "https://onlinebanking.tdbank.com/default.asp",
            accountLocked: "http://www.tdbank.com/",
            accountSetup: "http://www.tdbank.com/",
            video: "td",
            fields: [{
                name: "username",
                label: "User Name",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.us = {
            id: "us",
            index: 4,
            name: "US Bank",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(12, 32, 116),
                darker: rgb(18, 20, 64),
                gradient: [rgb(12, 32, 116), rgb(62, 82, 165)]
            },
            forgottenPassword: "https://onlinebanking.usbank.com/Auth/LoginAssistanceDesktop/LoadLoginAssistance",
            accountLocked: "https://onlinebanking.usbank.com/Auth/LoginAssistanceDesktop/LoadLoginAssistance",
            accountSetup: "https://onlinebanking.usbank.com",
            video: "us",
            fields: [{
                name: "username",
                label: "Personal ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.usaa = {
            id: "usaa",
            index: 5,
            name: "USAA",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !1,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(0, 54, 91),
                darker: rgb(0, 37, 61),
                gradient: [rgb(0, 54, 91), rgb(76, 114, 144)]
            },
            forgottenPassword: "https://www.usaa.com/inet/ent_proof/proofingEvent?action=Init&event=forgotPassword&wa_ref=pub_auth_nav_forgotpwd",
            accountLocked: "https://mobile.usaa.com/inet/ent_auth_password/locked?akredirect=true",
            accountSetup: "https://www.usaa.com/inet/ent_logon/Logon",
            video: "usaa",
            fields: [{
                name: "username",
                label: "Online ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }, {
                name: "pin",
                label: "PIN",
                type: "password"
            }]
        }, exports.bbt = {
            id: "bbt",
            index: 18,
            name: "BB&T",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !1,
                info: !0,
                risk: !1
            },
            colors: {
                primary: rgb(138, 0, 37),
                darker: rgb(96, 9, 33),
                gradient: [rgb(116, 13, 41), rgb(138, 0, 37)]
            },
            forgottenPassword: "https://online.bbt.com/bbtpassreset/",
            accountLocked: "https://www.bbt.com/privacy-and-security/security/online-security/online-security-measures.page",
            accountSetup: "https://www.bbt.com/roao/showHome",
            video: "capone360",
            fields: [{
                name: "username",
                label: "User ID",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        }, exports.wells = {
            id: "wells",
            index: 2,
            name: "Wells Fargo",
            products: {
                auth: !0,
                connect: !0,
                creditdetails: !0,
                income: !0,
                info: !0,
                risk: !0
            },
            colors: {
                primary: rgb(186, 9, 36),
                darker: rgb(117, 6, 22),
                gradient: [rgb(186, 9, 36), rgb(220, 33, 62)]
            },
            forgottenPassword: "https://online.wellsfargo.com/das/channel/identifyDisplay",
            accountLocked: "https://www.wellsfargo.com/help/faqs/sign-on",
            accountSetup: "https://online.wellsfargo.com",
            video: "wells",
            fields: [{
                name: "username",
                label: "Username",
                type: "text"
            }, {
                name: "password",
                label: "Password",
                type: "password"
            }]
        };

    }, {}],
    69: [function(require, module, exports) {
        "use strict";
        var React = require("react"),
            account = React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                balance: React.PropTypes.shape({
                    available: React.PropTypes.number,
                    current: React.PropTypes.number
                }),
                meta: React.PropTypes.shape({
                    name: React.PropTypes.string,
                    number: React.PropTypes.string
                })
            }),
            institution = React.PropTypes.shape({
                accountLocked: React.PropTypes.string,
                accountSetup: React.PropTypes.string,
                colors: React.PropTypes.shape({
                    primary: React.PropTypes.string,
                    dark: React.PropTypes.string,
                    darker: React.PropTypes.string,
                    gradient: React.PropTypes.arrayOf(React.PropTypes.string)
                }),
                fields: React.PropTypes.arrayOf(React.PropTypes.shape({
                    name: React.PropTypes.string.isRequired,
                    label: React.PropTypes.string.isRequired,
                    type: React.PropTypes.string.isRequired
                })),
                products: React.PropTypes.shape({
                    auth: React.PropTypes.bool,
                    balance: React.PropTypes.bool,
                    connect: React.PropTypes.bool,
                    info: React.PropTypes.bool
                }),
                forgottenPassword: React.PropTypes.string,
                id: React.PropTypes.string,
                index: React.PropTypes.number,
                name: React.PropTypes.string,
                video: React.PropTypes.string
            }),
            institutionData = React.PropTypes.shape({
                send_methods: React.PropTypes.arrayOf(React.PropTypes.shape({
                    mask: React.PropTypes.string.isRequired,
                    type: React.PropTypes.string.isRequired
                }).isRequired)
            }),
            mfaCode = React.PropTypes.string,
            mfaDevice = React.PropTypes.arrayOf(React.PropTypes.shape({
                mask: React.PropTypes.string.isRequired,
                type: React.PropTypes.string.isRequired
            })),
            mfaQuestions = React.PropTypes.arrayOf(React.PropTypes.string),
            mfaAnswers = React.PropTypes.arrayOf(React.PropTypes.string),
            mfaSelection = React.PropTypes.shape({
                answers: React.PropTypes.arrayOf(React.PropTypes.string),
                question: React.PropTypes.string
            }),
            mfaSelections = React.PropTypes.arrayOf(mfaSelection),
            product = React.PropTypes.oneOf(["auth", "connect", "income", "info", "risk"]),
            error = React.PropTypes.shape({
                button: React.PropTypes.string,
                code: React.PropTypes.string,
                icon: React.PropTypes.string,
                message: React.PropTypes.string,
                title: React.PropTypes.string
            });
        module.exports = {
            account: account,
            accounts: React.PropTypes.arrayOf(account),
            error: error,
            institution: institution,
            institutionData: institutionData,
            mfaAnswers: mfaAnswers,
            mfaCode: mfaCode,
            mfaDevice: mfaDevice,
            mfaQuestions: mfaQuestions,
            mfaSelection: mfaSelection,
            mfaSelections: mfaSelections,
            product: product
        };

    }, {
        "react": "react"
    }],
    70: [function(require, module, exports) {
        "use strict";

        function _toConsumableArray(e) {
            if (Array.isArray(e)) {
                for (var r = 0, a = Array(e.length); r < e.length; r++) a[r] = e[r];
                return a
            }
            return Array.from(e)
        }
        var React = require("react"),
            ReactDOM = require("react-dom"),
            Provider = require("react-redux").Provider,
            redux = require("redux"),
            App = require("./components/App").connect,
            analytics = require("./analytics"),
            client = require("./client"),
            middleware = require("./middleware"),
            reducers = require("./reducers"),
            windowHandler = require("./window"),
            updateDevTools = function(e) {
                return e
            },
            middlewareArr = [middleware.thunk, middleware.paneTransition, middleware.windowListener];
        middlewareArr = [middleware.rollbarLogger(analytics), middleware.mixpanelAnalytics(analytics)].concat(_toConsumableArray(middlewareArr));
        var appliedMiddleware = redux.applyMiddleware.apply(redux, _toConsumableArray(middlewareArr)),
            store = redux.createStore(reducers, redux.compose(appliedMiddleware, updateDevTools)),
            Plaid = window.Plaid = client.create(store);
        windowHandler.loadGlobalHandlers(Plaid, store), ReactDOM.render(React.createElement(Provider, {
            store: store
        }, React.createElement(App, null)), document.getElementById("plaid-link-container"));

    }, {
        "./analytics": 15,
        "./client": 26,
        "./components/App": 27,
        "./middleware": 71,
        "./reducers": 78,
        "./window": 88,
        "react": "react",
        "react-dom": "react-dom",
        "react-redux": "react-redux",
        "redux": "redux"
    }],
    71: [function(require, module, exports) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
                return typeof n
            } : function(n) {
                return n && "function" == typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n
            },
            _extends = Object.assign || function(n) {
                for (var t = 1; t < arguments.length; t++) {
                    var e = arguments[t];
                    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r])
                }
                return n
            },
            ActionTypes = require("./constants/ActionTypes"),
            actions = require("./actions"),
            Panes = require("./constants/Panes"),
            flowReducer = require("./reducers/flows"),
            windowHandler = require("./window"),
            catchAll = function(n) {
                return function(n) {
                    return function(t) {
                        try {
                            return n(t)
                        } catch (n) {
                            throw console.error("Caught an exception!", n), console.error(n.stack), n
                        }
                    }
                }
            },
            INACTIVE_ANIMATION_DELAY = 300,
            windowListener = function(n) {
                return function(t) {
                    return function(e) {
                        var r = n.getState();
                        if (null == e._nextPane) {
                            var i = flowReducer(r.panes.currentPane, e);
                            if (i.pane === Panes.HANDOFF_SUCCESS) return n.dispatch(_extends({}, actions.window.handoff(), {
                                delay: i.delay
                            }));
                            if (i.pane === Panes.HANDOFF_EXIT) return n.dispatch(actions.window.closeLink())
                        }
                        switch (e.type) {
                            case ActionTypes.EXIT_LINK:
                                return t(e), void setTimeout(function() {
                                    windowHandler.exitLink(r), n.dispatch({
                                        type: ActionTypes.RESET_STATE
                                    })
                                }, r.configuration.disableAnimations ? 0 : INACTIVE_ANIMATION_DELAY);
                            case ActionTypes.HANDOFF:
                                return n.dispatch({
                                    type: ActionTypes.ANIMATE_NEXT
                                }), void setTimeout(function() {
                                    t(e), setTimeout(function() {
                                        windowHandler.handoff(r), n.dispatch({
                                            type: ActionTypes.RESET_STATE
                                        })
                                    }, r.configuration.disableAnimations ? 0 : INACTIVE_ANIMATION_DELAY)
                                }, r.configuration.disableAnimations ? 0 : e.delay);
                            default:
                                return t(e)
                        }
                    }
                }
            },
            paneTransition = function(n) {
                return function(t) {
                    return function(e) {
                        var r = n.getState();
                        if (null == e._nextPane) {
                            var i = function() {
                                var i = r.panes.currentPane,
                                    o = flowReducer(i, e);
                                if (o.pane === Panes.HANDOFF_EXIT || o.pane === Panes.HANDOFF_SUCCESS) return {
                                    v: t(e)
                                };
                                if (0 !== o.length && o.pane !== i) {
                                    if (r.configuration.isMobile || r.configuration.disableAnimations) return {
                                        v: n.dispatch(_extends({}, e, {
                                            _nextPane: o.pane
                                        }))
                                    };
                                    if (o.type === ActionTypes.ANIMATE_NONE) return n.dispatch(_extends({}, e, {
                                        _nextPane: o.pane
                                    })), {
                                        v: n.dispatch({
                                            type: ActionTypes.ANIMATE_NONE
                                        })
                                    };
                                    var a = o.delay || 0;
                                    return setTimeout(function() {
                                        n.dispatch(_extends({}, e, {
                                            _nextPane: o.pane
                                        })), setTimeout(function() {
                                            return n.dispatch({
                                                type: ActionTypes.ANIMATE_IN
                                            })
                                        }, 1)
                                    }, a), {
                                        v: n.dispatch({
                                            type: o.type,
                                            delay: o.delay
                                        })
                                    }
                                }
                            }();
                            if ("object" === ("undefined" == typeof i ? "undefined" : _typeof(i))) return i.v
                        }
                        return t(e)
                    }
                }
            },
            thunk = function(n) {
                return function(t) {
                    return function(e) {
                        return "function" == typeof e ? e(n.dispatch, n.getState) : t(e)
                    }
                }
            },
            mixpanelAnalytics = function(n) {
                return function(t) {
                    return function(e) {
                        return function(r) {
                            return null != r._nextPane && n.trackEvent(r._nextPane, t.getState, r), e(r)
                        }
                    }
                }
            },
            rollbarLogger = function(n) {
                return function(t) {
                    return function(e) {
                        return function(r) {
                            try {
                                return e(r)
                            } catch (e) {
                                throw n.reportError(e, t.getState, r), e
                            }
                        }
                    }
                }
            };
        module.exports = {
            catchAll: catchAll,
            mixpanelAnalytics: mixpanelAnalytics,
            paneTransition: paneTransition,
            rollbarLogger: rollbarLogger,
            thunk: thunk,
            windowListener: windowListener
        };

    }, {
        "./actions": 5,
        "./constants/ActionTypes": 63,
        "./constants/Panes": 67,
        "./reducers/flows": 76,
        "./window": 88
    }],
    72: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            util = require("../utilities"),
            INITIAL_STATE = {
                apiUrl: "",
                clientName: "",
                disableAnimations: !1,
                disableEffects: !1,
                env: "",
                isCustomInitializer: !1,
                isIE9: !1,
                isMobile: !1,
                isPatch: !1,
                key: "",
                linkUrl: "",
                longtail: !1,
                longtailAuthEnabled: !1,
                origin: "",
                product: "",
                productsEnabled: null,
                selectAccount: !1,
                token: null,
                useSandbox: !1,
                webhook: ""
            },
            getLinkUrl = function(e) {
                var t = util.isSandboxKey(e.key) ? "/sandbox" : "";
                switch (e.env) {
                    case "development":
                        return "https://link-testing.plaid.com" + t;
                    case "tartan":
                        return "https://link-tartan.plaid.com" + t;
                    case "production":
                        return "https://link.plaid.com" + t;
                    default:
                        throw new Error("Invalid environment")
                }
            },
            getApiUrl = function(e) {
                switch (e.env) {
                    case "development":
                        return "https://api-testing.plaid.com";
                    case "tartan":
                        return "https://tartan.plaid.com";
                    case "production":
                        return "https://api.plaid.com";
                    default:
                        throw new Error("Invalid environment")
                }
            },
            isMobile = function() {
                var e = /android mobile|iemobile|iphone|ipod|windows phone/i.test(navigator.userAgent),
                    t = document.documentElement.clientWidth <= 480 && 0 !== document.documentElement.clientWidth;
                return e || t
            },
            isHybridApp = function() {
                return !!window.location.href && /^file:/i.test(window.location.href)
            },
            isIEBrowser = function() {
                return /MSIE |Trident/i.test(navigator.userAgent)
            },
            isIE9 = function() {
                var e = document.createElement("div");
                return e.innerHTML = "<!--[if IE 9]><i></i><![endif]-->", 1 === e.getElementsByTagName("i").length
            },
            getOrigin = function(e) {
                switch (e.origin) {
                    case "file://":
                        return "*";
                    default:
                        return e.origin
                }
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                t = arguments[1];
            switch (t.type) {
                case ActionTypes.INITIALIZE_CONFIG:
                    var i = t.config;
                    return _extends({}, e, {
                        apiUrl: getApiUrl(i),
                        clientName: i.clientName,
                        disableAnimations: isMobile() || isIEBrowser(),
                        disableEffects: isMobile() && isHybridApp(),
                        env: i.env,
                        isIE9: isIE9(),
                        isMobile: isMobile(),
                        isPatch: util.isPatch(i),
                        key: i.key,
                        linkUrl: getLinkUrl(i),
                        longtail: i.longtail,
                        origin: getOrigin(i),
                        product: i.product,
                        selectAccount: i.selectAccount,
                        token: i.token || null,
                        useSandbox: util.isSandboxKey(i.key),
                        webhook: i.webhook
                    });
                case ActionTypes.UPDATE_CONFIG:
                    return _extends({}, e, t.config);
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63,
        "../utilities": 87
    }],
    73: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var s = arguments[r];
                    for (var n in s) Object.prototype.hasOwnProperty.call(s, n) && (e[n] = s[n])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                fieldError: "",
                hideBackButton: !1,
                password: "",
                pin: "",
                username: ""
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                r = arguments[1];
            switch (r.type) {
                case ActionTypes.CONNECTED:
                case ActionTypes.RESTORE_INPUT_FIELD:
                    return _extends({}, e, {
                        fieldError: ""
                    });
                case ActionTypes.INVALIDATE_INPUT_FIELD:
                    return _extends({}, e, {
                        fieldError: r.fieldError
                    });
                case ActionTypes.OPEN_LINK_AT_INSTITUTION:
                    return _extends({}, e, {
                        hideBackButton: !0
                    });
                case ActionTypes.GO_BACK_TO_INSTITUTION_SELECT:
                case ActionTypes.OPEN_LINK:
                case ActionTypes.SELECT_INSTITUTION:
                case ActionTypes.CHOOSE_DEVICE:
                case ActionTypes.REQUIRES_CODE:
                case ActionTypes.REQUIRES_CREDENTIALS:
                case ActionTypes.REQUIRES_QUESTIONS:
                case ActionTypes.REQUIRES_SELECTIONS:
                    return _extends({}, e, INITIAL_STATE);
                case ActionTypes.SUBMIT_CREDENTIALS:
                    return _extends({}, e, {
                        password: "",
                        pin: ""
                    });
                case ActionTypes.UPDATE_PASSWORD:
                    return _extends({}, e, {
                        fieldError: "password" === e.fieldError ? "" : e.fieldError,
                        password: r.password
                    });
                case ActionTypes.UPDATE_PIN:
                    return _extends({}, e, {
                        fieldError: "pin" === e.fieldError ? "" : e.fieldError,
                        pin: r.pin
                    });
                case ActionTypes.UPDATE_USERNAME:
                    return _extends({}, e, {
                        fieldError: "username" === e.fieldError ? "" : e.fieldError,
                        username: r.username
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    74: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            Errors = require("../constants/Errors"),
            INITIAL_STATE = {
                button: "",
                code: "",
                icon: "",
                message: "",
                title: ""
            },
            parseError = function(e) {
                var r = null != e.code ? String(e.code) : "1702";
                return "1203" === r ? Errors["1203:" + e.status] : Object.prototype.hasOwnProperty.call(Errors, r) ? Errors[r] : Errors[1702]
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                r = arguments[1];
            switch (r.type) {
                case ActionTypes.CONNECTED:
                case ActionTypes.CHOOSE_DEVICE:
                case ActionTypes.REQUIRES_CODE:
                case ActionTypes.REQUIRES_CREDENTIALS:
                case ActionTypes.REQUIRES_SELECTIONS:
                case ActionTypes.REQUIRES_QUESTIONS:
                case ActionTypes.GO_BACK_TO_INSTITUTION_SELECT:
                case ActionTypes.GO_BACK_TO_MFA_DEVICE:
                    return _extends({}, e, INITIAL_STATE);
                case ActionTypes.ACKNOWLEDGE_ERROR:
                    switch (r.error.code) {
                        case "1005":
                        case "1109":
                        case "1200":
                        case "1201":
                        case "1202":
                        case "1209":
                            return e;
                        default:
                            return _extends({}, e, INITIAL_STATE)
                    }
                case ActionTypes.CREDENTIALS_REQUEST_FAILURE:
                case ActionTypes.MFA_REQUEST_FAILURE:
                case ActionTypes.LONGTAIL_AUTH_REQUEST_FAILURE:
                    var t = parseError(r.error);
                    return _extends({}, e, {
                        button: t.button,
                        code: t.code,
                        icon: t.icon,
                        message: t.message,
                        title: t.title
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63,
        "../constants/Errors": 64
    }],
    75: [function(require, module, exports) {
        "use strict";
        var Panes = require("../../constants/Panes"),
            flowUtilities = require("./utilities"),
            animateNone = flowUtilities.animateNone,
            animateDefault = flowUtilities.animateDefault,
            INITIAL_STATE = "";
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                a = arguments[1],
                t = a.configuration.isCustomInitializer ? Panes.HANDOFF_EXIT : Panes.INSTITUTION_SELECT_PANE;
            switch (a.error.code) {
                case "-2":
                    return animateDefault(Panes.LONGTAIL_AUTH_PANE);
                case "-1":
                    return animateDefault(Panes.HANDOFF_EXIT);
                case "1005":
                    return animateNone(Panes.CREDENTIAL_PANE);
                case "1104":
                    return animateDefault(Panes.HANDOFF_EXIT);
                case "1109":
                    return animateNone(Panes.CREDENTIAL_PANE);
                case "1112":
                case "1114":
                    return animateDefault(Panes.HANDOFF_EXIT);
                case "1200":
                case "1201":
                case "1202":
                    return animateNone(Panes.CREDENTIAL_PANE);
                case "1203:choose_device":
                    return animateDefault(Panes.MFA_DEVICE_PANE);
                case "1203:requires_code":
                    return animateDefault(Panes.MFA_CODE_PANE);
                case "1203:requires_questions":
                    return animateDefault(Panes.MFA_QUESTION_PANE);
                case "1203:requires_selections":
                    return animateDefault(Panes.MFA_SELECTION_PANE);
                case "1205":
                    return window.open(a.institution.accountLocked), animateDefault(t);
                case "1206":
                    return window.open(a.institution.accountSetup), animateDefault(t);
                case "1207":
                case "1208":
                    return animateDefault(t);
                case "1209":
                    return animateDefault(Panes.CREDENTIAL_PANE);
                case "1210":
                    return animateDefault(t);
                case "1211":
                    return window.open("https://www.bankofamerica.com/privacy/online-mobile-banking-privacy/security-center.go"), animateDefault(t);
                case "1212":
                    return animateDefault(t);
                case "1302":
                case "1303":
                case "1700":
                case "1701":
                case "1702":
                case "1800":
                case "no-depository-accounts":
                    return animateDefault(t);
                default:
                    return animateDefault(e)
            }
        };

    }, {
        "../../constants/Panes": 67,
        "./utilities": 77
    }],
    76: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../../constants/ActionTypes"),
            Panes = require("../../constants/Panes"),
            errorFlowReducer = require("./errors"),
            flowUtilities = require("./utilities"),
            util = require("../../utilities"),
            animateBack = flowUtilities.animateBack,
            animateDefault = flowUtilities.animateDefault,
            animateNext = flowUtilities.animateNext,
            animateNone = flowUtilities.animateNone,
            INITIAL_STATE = "";
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                a = arguments[1];
            switch (a.type) {
                case ActionTypes.OPEN_LINK:
                    return animateNone(Panes.INSTITUTION_SELECT_PANE);
                case ActionTypes.OPEN_LINK_AT_INSTITUTION:
                    return animateNone(Panes.CREDENTIAL_PANE)
            }
            switch (e) {
                case Panes.INSTITUTION_SELECT_PANE:
                    switch (a.type) {
                        case ActionTypes.SELECT_INSTITUTION:
                            return animateDefault(Panes.CREDENTIAL_PANE)
                    }
                case Panes.CREDENTIAL_PANE:
                    switch (a.type) {
                        case ActionTypes.GO_BACK_TO_INSTITUTION_SELECT:
                            return animateBack(Panes.INSTITUTION_SELECT_PANE, 500);
                        case ActionTypes.SUBMIT_CREDENTIALS:
                            return animateNext(Panes.LOADING_PANE, 600)
                    }
                case Panes.LOADING_PANE:
                    switch (a.type) {
                        case ActionTypes.GO_BACK_TO_INSTITUTION_SELECT:
                            return animateDefault(Panes.INSTITUTION_SELECT_PANE);
                        case ActionTypes.CREDENTIALS_REQUEST_FAILURE:
                            return animateDefault(Panes.ERROR_PANE);
                        case ActionTypes.MFA_REQUEST_FAILURE:
                            return animateDefault(Panes.ERROR_PANE);
                        case ActionTypes.LONGTAIL_AUTH_REQUEST_FAILURE:
                            return animateDefault(Panes.ERROR_PANE);
                        case ActionTypes.LONGTAIL_AUTH_REQUEST_SUCCESS:
                            return animateDefault(Panes.CONNECTED_PANE);
                        case ActionTypes.CONNECTED:
                            return animateDefault(Panes.CONNECTED_PANE);
                        case ActionTypes.CHOOSE_DEVICE:
                            return animateDefault(Panes.MFA_DEVICE_PANE);
                        case ActionTypes.REQUIRES_CODE:
                            return animateDefault(Panes.MFA_CODE_PANE);
                        case ActionTypes.REQUIRES_CREDENTIALS:
                            return animateDefault(Panes.CREDENTIAL_PANE);
                        case ActionTypes.REQUIRES_QUESTIONS:
                            return animateDefault(Panes.MFA_QUESTION_PANE);
                        case ActionTypes.REQUIRES_SELECTIONS:
                            return animateDefault(Panes.MFA_SELECTION_PANE)
                    }
                case Panes.MFA_DEVICE_PANE:
                    switch (a.type) {
                        case ActionTypes.SUBMIT_MFA:
                            return animateDefault(Panes.LOADING_PANE)
                    }
                case Panes.MFA_CODE_PANE:
                    switch (a.type) {
                        case ActionTypes.SUBMIT_MFA:
                            return animateDefault(Panes.LOADING_PANE);
                        case ActionTypes.GO_BACK_TO_MFA_DEVICE:
                            return animateDefault(Panes.MFA_DEVICE_PANE)
                    }
                case Panes.MFA_QUESTION_PANE:
                    switch (a.type) {
                        case ActionTypes.SUBMIT_MFA:
                            return animateDefault(Panes.LOADING_PANE)
                    }
                case Panes.MFA_SELECTION_PANE:
                    switch (a.type) {
                        case ActionTypes.SUBMIT_MFA:
                            return animateDefault(Panes.LOADING_PANE)
                    }
                case Panes.ERROR_PANE:
                    switch (a.type) {
                        case ActionTypes.ACKNOWLEDGE_ERROR:
                            return errorFlowReducer(e, a)
                    }
                case Panes.CONNECTED_PANE:
                    switch (a.type) {
                        case ActionTypes.CONNECTED_CONTINUE:
                            return a.state.longtailAuth.connected === !0 ? animateDefault(Panes.HANDOFF_SUCCESS) : a.state.configuration.selectAccount === !0 || util.isLongtailAuth(a.state) ? animateDefault(Panes.SELECT_ACCOUNT_PANE) : animateNext(Panes.HANDOFF_SUCCESS, 650)
                    }
                case Panes.SELECT_ACCOUNT_PANE:
                    switch (a.type) {
                        case ActionTypes.CONFIRM_ACCOUNT:
                            return animateDefault(util.isLongtailAuth(a.state) ? Panes.LONGTAIL_AUTH_PANE : Panes.HANDOFF_SUCCESS)
                    }
                case Panes.LONGTAIL_AUTH_PANE:
                    switch (a.type) {
                        case ActionTypes.LONGTAIL_AUTH_REQUEST_SUBMIT:
                            return animateDefault(Panes.LOADING_PANE);
                        case ActionTypes.GO_BACK_TO_SELECT_ACCOUNT:
                            return animateDefault(Panes.SELECT_ACCOUNT_PANE)
                    }
            }
            return animateDefault(e)
        };

    }, {
        "../../constants/ActionTypes": 63,
        "../../constants/Panes": 67,
        "../../utilities": 87,
        "./errors": 75,
        "./utilities": 77
    }],
    77: [function(require, module, exports) {
        "use strict";
        var ActionTypes = require("../../constants/ActionTypes"),
            animateBack = function(e, t) {
                return {
                    type: ActionTypes.ANIMATE_BACK,
                    delay: t,
                    pane: e
                }
            },
            animateDefault = function(e) {
                return {
                    type: ActionTypes.ANIMATE_DEFAULT,
                    pane: e
                }
            },
            animateNext = function(e, t) {
                return {
                    type: ActionTypes.ANIMATE_NEXT,
                    delay: t,
                    pane: e
                }
            },
            animateNone = function(e) {
                return {
                    type: ActionTypes.ANIMATE_NONE,
                    pane: e
                }
            };
        module.exports = {
            animateBack: animateBack,
            animateDefault: animateDefault,
            animateNext: animateNext,
            animateNone: animateNone
        };

    }, {
        "../../constants/ActionTypes": 63
    }],
    78: [function(require, module, exports) {
        "use strict";
        var redux = require("redux"),
            configuration = require("./configuration"),
            credentials = require("./credentials"),
            error = require("./error"),
            institutionSearch = require("./institutionSearch"),
            institutionSelect = require("./institutionSelect"),
            loader = require("./loader"),
            longtailAuth = require("./longtailAuth"),
            mfa = require("./mfa"),
            panes = require("./panes"),
            response = require("./response"),
            selectAccount = require("./selectAccount"),
            ActionTypes = require("../constants/ActionTypes"),
            appReducer = redux.combineReducers({
                configuration: configuration,
                credentials: credentials,
                error: error,
                institutionSearch: institutionSearch,
                institutionSelect: institutionSelect,
                loader: loader,
                longtailAuth: longtailAuth,
                mfa: mfa,
                panes: panes,
                response: response,
                selectAccount: selectAccount
            }),
            rootReducer = function(e, r) {
                switch (r.type) {
                    case ActionTypes.RESET_STATE:
                        e = void 0
                }
                return appReducer(e, r)
            };
        module.exports = rootReducer;

    }, {
        "../constants/ActionTypes": 63,
        "./configuration": 72,
        "./credentials": 73,
        "./error": 74,
        "./institutionSearch": 79,
        "./institutionSelect": 80,
        "./loader": 81,
        "./longtailAuth": 82,
        "./mfa": 83,
        "./panes": 84,
        "./response": 85,
        "./selectAccount": 86,
        "redux": "redux"
    }],
    79: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var s = 1; s < arguments.length; s++) {
                    var t = arguments[s];
                    for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                errorMessage: "",
                isLoading: !1,
                isTimeout: !1,
                isVisible: !1,
                query: "",
                requestStatus: -1,
                results: [],
                selectedIndex: -1
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                s = arguments[1];
            switch (s.type) {
                case ActionTypes.INSTITUTION_SEARCH_BEGIN:
                    return _extends({}, e, {
                        isLoading: !0,
                        query: s.query
                    });
                case ActionTypes.INSTITUTION_SEARCH_SUCCESS:
                    return _extends({}, e, {
                        errorMessage: "",
                        isLoading: !1,
                        isTimeout: !1,
                        requestStatus: s.statusCode,
                        results: s.results
                    });
                case ActionTypes.INSTITUTION_SEARCH_FAILURE:
                    return _extends({}, e, {
                        errorMessage: s.errorMessage,
                        isLoading: !1,
                        isTimeout: s.isTimeout,
                        requestStatus: s.statusCode,
                        results: []
                    });
                case ActionTypes.INSTITUTION_SEARCH_SELECT_INDEX:
                    return _extends({}, e, {
                        selectedIndex: s.selectedIndex
                    });
                case ActionTypes.TOGGLE_INSTITUTION_SEARCH:
                    return _extends({}, e, {
                        isVisible: s.isVisible
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    80: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                page: 0,
                selectedInstitution: {}
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                t = arguments[1];
            switch (t.type) {
                case ActionTypes.SELECT_INSTITUTION:
                    return _extends({}, e, {
                        selectedInstitution: t.institution
                    });
                case ActionTypes.GO_BACK_TO_INSTITUTION_SELECT:
                    return _extends({}, e, {
                        selectedInstitution: {}
                    });
                case ActionTypes.GO_TO_SELECT_PAGE:
                    return _extends({}, e, {
                        page: t.page
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    81: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                finishPercentage: 0,
                isLoading: !1,
                message: "",
                parameter: 0,
                percentage: 0
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                t = arguments[1];
            switch (t.type) {
                case ActionTypes.BEGIN_LOADER:
                    return _extends({}, e, {
                        finishPercentage: 0,
                        isLoading: !0,
                        message: "",
                        percentage: 0
                    });
                case ActionTypes.UPDATE_LOADER:
                    return _extends({}, e, {
                        message: t.message,
                        percentage: t.percentage,
                        parameter: t.parameter
                    });
                case ActionTypes.FINISH_LOADER:
                    return _extends({}, e, {
                        finishPercentage: t.percentage,
                        isLoading: !1
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    82: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                accountNumber: "",
                connected: !1,
                currentStep: "routing",
                errorMessage: "",
                isInvalidForm: !1,
                routingNumber: ""
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                r = arguments[1];
            switch (r.type) {
                case ActionTypes.GO_BACK_TO_SELECT_ACCOUNT:
                    return _extends({}, e, INITIAL_STATE);
                case ActionTypes.INVALIDATE_LONGTAIL_AUTH:
                    return _extends({}, e, {
                        errorMessage: r.errorMessage,
                        isInvalidForm: !0
                    });
                case ActionTypes.RESTORE_LONGTAIL_AUTH:
                    return _extends({}, e, {
                        isInvalidForm: !1
                    });
                case ActionTypes.UPDATE_ACCOUNT_NUMBER:
                    return _extends({}, e, {
                        accountNumber: r.accountNumber,
                        errorMessage: "",
                        isInvalidForm: !1
                    });
                case ActionTypes.UPDATE_ROUTING_NUMBER:
                    return _extends({}, e, {
                        errorMessage: "",
                        isInvalidForm: !1,
                        routingNumber: r.routingNumber
                    });
                case ActionTypes.LONGTAIL_AUTH_REQUEST_SUCCESS:
                    return _extends({}, e, {
                        connected: !0
                    });
                case ActionTypes.LONGTAIL_AUTH_REQUEST_FAILURE:
                case ActionTypes.STEP_TO_ACCOUNT:
                    return _extends({}, e, {
                        currentStep: "account",
                        errorMessage: ""
                    });
                case ActionTypes.STEP_TO_ROUTING:
                    return _extends({}, e, {
                        currentStep: "routing",
                        errorMessage: ""
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    83: [function(require, module, exports) {
        "use strict";

        function _toConsumableArray(e) {
            if (Array.isArray(e)) {
                for (var n = 0, r = Array(e.length); n < e.length; n++) r[n] = e[n];
                return r
            }
            return Array.from(e)
        }
        var _extends = Object.assign || function(e) {
                for (var n = 1; n < arguments.length; n++) {
                    var r = arguments[n];
                    for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t])
                }
                return e
            },
            redux = require("redux"),
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE_CODE = {
                value: "",
                isInvalid: !1
            },
            code = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE_CODE : arguments[0],
                    n = arguments[1];
                switch (n.type) {
                    case ActionTypes.RESEND_MFA_CODE:
                        return _extends({}, e, {
                            value: ""
                        });
                    case ActionTypes.UPDATE_MFA_CODE:
                        return _extends({}, e, {
                            value: n.code
                        });
                    case ActionTypes.INVALIDATE_MFA_CODE:
                        return _extends({}, e, {
                            isInvalid: !0
                        });
                    case ActionTypes.RESTORE_MFA_CODE:
                        return _extends({}, e, {
                            isInvalid: !1
                        });
                    case ActionTypes.GO_BACK_TO_MFA_DEVICE:
                        return _extends({}, e, {
                            value: "",
                            isInvalid: !1
                        });
                    default:
                        return e
                }
            },
            INITIAL_STATE_DEVICE = {
                value: null
            },
            device = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE_DEVICE : arguments[0],
                    n = arguments[1];
                switch (n.type) {
                    case ActionTypes.UPDATE_MFA_DEVICE:
                        return _extends({}, e, {
                            value: n.device
                        });
                    case ActionTypes.GO_BACK_TO_MFA_DEVICE:
                        return _extends({}, e, {
                            value: null
                        });
                    default:
                        return e
                }
            },
            INITIAL_STATE_QUESTION = {
                currentAnswer: "",
                answers: [],
                isInvalid: !1
            },
            question = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE_QUESTION : arguments[0],
                    n = arguments[1];
                switch (n.type) {
                    case ActionTypes.UPDATE_MFA_QUESTION_CURRENT_ANSWER:
                        return _extends({}, e, {
                            currentAnswer: n.answer
                        });
                    case ActionTypes.NEXT_MFA_QUESTION:
                        return _extends({}, e, {
                            answers: [].concat(_toConsumableArray(e.answers), [e.currentAnswer]),
                            currentAnswer: ""
                        });
                    case ActionTypes.INVALIDATE_MFA_QUESTION:
                        return _extends({}, e, {
                            isInvalid: !0
                        });
                    case ActionTypes.RESTORE_MFA_QUESTION:
                        return _extends({}, e, {
                            isInvalid: !1,
                            currentAnswer: ""
                        });
                    case ActionTypes.MFA_REQUEST_FAILURE:
                        return _extends({}, e, {
                            answers: [],
                            currentAnswer: ""
                        });
                    case ActionTypes.REQUIRES_QUESTIONS:
                        return _extends({}, e, {
                            answers: [],
                            currentAnswer: "",
                            isInvalid: !1
                        });
                    case ActionTypes.SUBMIT_MFA:
                        return _extends({}, e, {
                            currentAnswer: ""
                        });
                    default:
                        return e
                }
            },
            INITIAL_STATE_SELECTION = {
                answers: []
            },
            selection = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE_SELECTION : arguments[0],
                    n = arguments[1];
                switch (n.type) {
                    case ActionTypes.UPDATE_MFA_SELECTION:
                        return _extends({}, e, {
                            answers: [].concat(_toConsumableArray(e.answers), [n.answer])
                        });
                    case ActionTypes.MFA_REQUEST_FAILURE:
                        return _extends({}, e, {
                            answers: []
                        });
                    default:
                        return e
                }
            };
        module.exports = redux.combineReducers({
            code: code,
            device: device,
            question: question,
            selection: selection
        });

    }, {
        "../constants/ActionTypes": 63,
        "redux": "redux"
    }],
    84: [function(require, module, exports) {
        "use strict";
        var redux = require("redux"),
            ActionTypes = require("../constants/ActionTypes"),
            animationClass = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
                    t = arguments[1];
                switch (t.type) {
                    case ActionTypes.ANIMATE_BACK:
                        return "animate-back";
                    case ActionTypes.ANIMATE_DEFAULT:
                        return "";
                    case ActionTypes.ANIMATE_IN:
                        return "animate-in";
                    case ActionTypes.ANIMATE_NEXT:
                        return "animate-next";
                    case ActionTypes.ANIMATE_NONE:
                        return "animate-none";
                    case ActionTypes.OPEN_LINK_AT_INSTITUTION:
                        return "animate-none";
                    default:
                        return e
                }
            },
            currentPane = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
                    t = arguments[1];
                return null != t._nextPane ? t._nextPane : e
            },
            hideOutriggers = function() {
                var e = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
                    t = arguments[1];
                switch (t.type) {
                    case ActionTypes.ANIMATE_BACK:
                        return !0;
                    case ActionTypes.ANIMATE_DEFAULT:
                        return !1;
                    case ActionTypes.ANIMATE_IN:
                        return !1;
                    case ActionTypes.ANIMATE_NEXT:
                        return !0;
                    case ActionTypes.ANIMATE_NONE:
                        return !1;
                    case ActionTypes.CLOSE_EXIT_PROMPT:
                        return !1;
                    case ActionTypes.OPEN_EXIT_PROMPT:
                        return !0;
                    default:
                        return e
                }
            },
            showExitPane = function() {
                var e = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
                    t = arguments[1];
                switch (t.type) {
                    case ActionTypes.OPEN_EXIT_PROMPT:
                        return !0;
                    case ActionTypes.CLOSE_EXIT_PROMPT:
                        return !1;
                    default:
                        return e
                }
            },
            isActive = function() {
                var e = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
                    t = arguments[1];
                switch (t.type) {
                    case ActionTypes.EXIT_LINK:
                        return !1;
                    case ActionTypes.HANDOFF:
                        return !1;
                    case ActionTypes.OPEN_LINK_AT_INSTITUTION:
                        return !0;
                    case ActionTypes.OPEN_LINK:
                        return !0;
                    default:
                        return e
                }
            };
        module.exports = redux.combineReducers({
            animationClass: animationClass,
            currentPane: currentPane,
            hideOutriggers: hideOutriggers,
            isActive: isActive,
            showExitPane: showExitPane
        });

    }, {
        "../constants/ActionTypes": 63,
        "redux": "redux"
    }],
    85: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var s = arguments[e];
                    for (var a in s) Object.prototype.hasOwnProperty.call(s, a) && (t[a] = s[a])
                }
                return t
            },
            ActionTypes = require("../constants/ActionTypes"),
            MfaStatus = require("../constants/MfaStatus"),
            INITIAL_STATE = {
                accounts: [],
                apiRequestId: null,
                institutionData: null,
                linkRequestId: null,
                mfa: null,
                publicToken: null,
                status: "requires_credentials",
                statusCode: null
            };
        module.exports = function() {
            var t = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                e = arguments[1];
            switch (e.type) {
                case ActionTypes.GO_BACK_TO_MFA_DEVICE:
                    return _extends({}, t, {
                        mfa: t.institutionData.send_methods,
                        status: MfaStatus.CHOOSE_DEVICE
                    });
                case ActionTypes.CREDENTIALS_REQUEST_FAILURE:
                case ActionTypes.LONGTAIL_AUTH_REQUEST_FAILURE:
                case ActionTypes.MFA_REQUEST_FAILURE:
                    return _extends({}, t, {
                        apiRequestId: e.error.plaid_api_request_id,
                        linkRequestId: e.error.request_id,
                        statusCode: e.statusCode
                    });
                case ActionTypes.CONNECTED:
                case ActionTypes.CHOOSE_DEVICE:
                case ActionTypes.REQUIRES_CODE:
                case ActionTypes.REQUIRES_CREDENTIALS:
                case ActionTypes.REQUIRES_SELECTIONS:
                case ActionTypes.REQUIRES_QUESTIONS:
                    return _extends({}, t, {
                        accounts: e.data.accounts,
                        apiRequestId: e.data.plaid_api_request_id,
                        institutionData: e.data.institution_data,
                        linkRequestId: e.data.request_id,
                        mfa: e.data.mfa,
                        publicToken: e.data.public_token,
                        status: e.data.status,
                        statusCode: e.statusCode
                    });
                default:
                    return t
            }
        };

    }, {
        "../constants/ActionTypes": 63,
        "../constants/MfaStatus": 66
    }],
    86: [function(require, module, exports) {
        "use strict";
        var _extends = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var c in n) Object.prototype.hasOwnProperty.call(n, c) && (e[c] = n[c])
                }
                return e
            },
            ActionTypes = require("../constants/ActionTypes"),
            INITIAL_STATE = {
                selectedAccount: null,
                pageIndex: 0
            };
        module.exports = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? INITIAL_STATE : arguments[0],
                t = arguments[1];
            switch (t.type) {
                case ActionTypes.SELECT_ACCOUNT:
                    return _extends({}, e, {
                        selectedAccount: t.account
                    });
                case ActionTypes.DESELECT_ACCOUNT:
                    return _extends({}, e, {
                        selectedAccount: null
                    });
                case ActionTypes.INCREMENT_ACCOUNT_PAGINATION:
                    return _extends({}, e, {
                        pageIndex: e.pageIndex + 1
                    });
                case ActionTypes.DECREMENT_ACCOUNT_PAGINATION:
                    return _extends({}, e, {
                        pageIndex: e.pageIndex - 1
                    });
                default:
                    return e
            }
        };

    }, {
        "../constants/ActionTypes": 63
    }],
    87: [function(require, module, exports) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
            },
            _extends = Object.assign || function(t) {
                for (var n = 1; n < arguments.length; n++) {
                    var e = arguments[n];
                    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r])
                }
                return t
            },
            ActionTypes = require("./constants/ActionTypes"),
            PlaidInstitutions = require("./constants/PlaidInstitutions"),
            PLAID_NAMESPACE = "plaid_link",
            postMessage = function(t, n) {
                try {
                    var e = _extends({}, t, {
                        action: PLAID_NAMESPACE + "::" + t.action
                    });
                    window.parent.postMessage(JSON.stringify(e), n)
                } catch (t) {
                    console.log("Error: couldn't postMessage to parent window. ", t)
                }
            },
            checkType = function(t, n, e) {
                if (t(e) === !0) return e;
                throw new Error(n)
            },
            checkTypeName = function(t, n, e, r) {
                return n === !0 ? checkType(function(n) {
                    return null == n || ("undefined" == typeof n ? "undefined" : _typeof(n)) === t
                }, e, r) : checkType(function(n) {
                    return null != n && ("undefined" == typeof n ? "undefined" : _typeof(n)) === t
                }, e, r)
            },
            filter = function(t, n) {
                for (var e = [], r = t.length, o = 0; o < r; o += 1) n(t[o]) && e.push(t[o]);
                return e
            },
            filterNull = function(t) {
                return filter(t, function(t) {
                    return null != t
                })
            },
            find = function(t, n) {
                var e = t.length,
                    r = void 0;
                for (r = 0; r < e; r += 1)
                    if (n(t[r])) return t[r]
            },
            fromPairs = function(t) {
                var n = {};
                return t.forEach(function(t) {
                    n[t[0]] = t[1]
                }), n
            },
            map = function(t, n) {
                return Array.prototype.map.call(n, t)
            },
            eq = function(t) {
                return function(n) {
                    return n === t
                }
            },
            concat = function(t, n) {
                return t.concat(n)
            },
            addClassName = function(t, n) {
                var e = n.className.split(" ");
                e.indexOf(t) < 0 && (n.className = concat(e, [t]).join(" ").trim())
            },
            removeClassName = function(t, n) {
                var e = n.className.split(" "),
                    r = e.indexOf(t);
                r >= 0 && (n.className = concat(e.slice(0, r), e.slice(r + 1)).join(" ").trim())
            },
            toggleClassName = function(t, n, e) {
                (e ? addClassName : removeClassName)(t, n)
            },
            parseHex = function(t) {
                return parseInt(t, 16)
            },
            rgba = function(t, n, e, r) {
                return "rgba(" + t + ", " + n + ", " + e + ", " + r + ")"
            },
            rgbaFromHexAlpha = function(t, n) {
                return t.match(/^rgba\(/i) ? t : rgba.apply(null, t.match(/[0-9A-F]{2}/gi).map(parseHex).concat(n))
            },
            parseRgbaString = function(t) {
                return t.split("(")[1].split(")")[0].split(",", 3)
            },
            toPX = function(t) {
                return t.toString() + "px"
            },
            formatCurrency = function(t) {
                return null == t ? "" : "$" + t.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            },
            shadeColor = function(t, n) {
                var e = parseInt(t.slice(1), 16),
                    r = n < 0 ? 0 : 255,
                    o = n < 0 ? n * -1 : n,
                    i = e >> 16,
                    a = e >> 8 & 255,
                    u = 255 & e;
                return "#" + (16777216 + 65536 * (Math.round((r - i) * o) + i) + 256 * (Math.round((r - a) * o) + a) + (Math.round((r - u) * o) + u)).toString(16).slice(1)
            },
            requestFrame = function() {
                if ("function" == typeof window.requestAnimationFrame) return function(t) {
                    return window.requestAnimationFrame(t)
                };
                var t = function() {
                    var t = 0;
                    return {
                        v: function(n) {
                            var e = (new Date).getTime(),
                                r = Math.max(0, 16 - (e - t)),
                                o = setTimeout(function() {
                                    return n(e + r)
                                }, r);
                            return t = e + r, o
                        }
                    }
                }();
                return "object" === ("undefined" == typeof t ? "undefined" : _typeof(t)) ? t.v : void 0
            }(),
            validateRoutingNumber = function(t) {
                if (null == t.match(/^\d{9}$/)) return !1;
                var n = Array.prototype.reduce.call(t, function(t, n, e) {
                    switch ((e + 1) % 3) {
                        case 1:
                            return t + 3 * parseInt(n, 10);
                        case 2:
                            return t + 7 * parseInt(n, 10);
                        case 0:
                            return t + 1 * parseInt(n, 10)
                    }
                }, 0);
                return 0 !== n && n % 10 === 0
            },
            mapStatusToAction = function(t) {
                switch (t) {
                    case "connected":
                        return ActionTypes.CONNECTED;
                    case "choose_device":
                        return ActionTypes.CHOOSE_DEVICE;
                    case "requires_code":
                        return ActionTypes.REQUIRES_CODE;
                    case "requires_credentials":
                        return ActionTypes.REQUIRES_CREDENTIALS;
                    case "requires_questions":
                        return ActionTypes.REQUIRES_QUESTIONS;
                    case "requires_selections":
                        return ActionTypes.REQUIRES_SELECTIONS;
                    default:
                        throw new Error("invalid response status")
                }
            },
            hasNoDepositoryAccounts = function(t, n) {
                return (t.configuration.selectAccount || isLongtailAuth(t)) && "connected" === n.data.status && null != n.data.accounts && 0 === n.data.accounts.length
            },
            isPatch = function(t) {
                return null != t.token
            },
            isPlaidInstitution = function(t) {
                return null != t && null != PlaidInstitutions[t]
            },
            isLongtailInstitution = function(t) {
                return null != t && null == PlaidInstitutions[t]
            },
            isLongtailAuth = function(t) {
                return t.configuration.longtail && t.configuration.longtailAuthEnabled && "auth" === t.configuration.product && null == PlaidInstitutions[t.institutionSelect.selectedInstitution.id]
            },
            isSandboxKey = function(t) {
                return ["test_key", "test_key_long_tail_auth"].indexOf(t) >= 0
            },
            defaultTo = function(t, n) {
                return null == n ? t : n
            };
        module.exports = {
            PLAID_NAMESPACE: PLAID_NAMESPACE,
            addClassName: addClassName,
            checkType: checkType,
            checkTypeName: checkTypeName,
            concat: concat,
            defaultTo: defaultTo,
            eq: eq,
            filter: filter,
            filterNull: filterNull,
            find: find,
            formatCurrency: formatCurrency,
            fromPairs: fromPairs,
            hasNoDepositoryAccounts: hasNoDepositoryAccounts,
            isLongtailAuth: isLongtailAuth,
            isLongtailInstitution: isLongtailInstitution,
            isPatch: isPatch,
            isPlaidInstitution: isPlaidInstitution,
            isSandboxKey: isSandboxKey,
            map: map,
            mapStatusToAction: mapStatusToAction,
            parseHex: parseHex,
            parseRgbaString: parseRgbaString,
            postMessage: postMessage,
            removeClassName: removeClassName,
            requestFrame: requestFrame,
            rgba: rgba,
            rgbaFromHexAlpha: rgbaFromHexAlpha,
            shadeColor: shadeColor,
            toggleClassName: toggleClassName,
            toPX: toPX,
            validateRoutingNumber: validateRoutingNumber
        };

    }, {
        "./constants/ActionTypes": 63,
        "./constants/PlaidInstitutions": 68
    }],
    88: [function(require, module, exports) {
        "use strict";
        var attachFastClick = require("fastclick"),
            plaidErrors = require("plaid-errors/errors"),
            panes = require("./actions/panes"),
            util = require("./utilities"),
            acknowledge = function(e) {
                return util.postMessage({
                    action: "acknowledged"
                }, e)
            },
            getAccountId = function(e) {
                return null != e ? e._id : null
            },
            getAccountName = function(e) {
                return null != e && null != e.meta ? e.meta.name : null
            },
            getInstitution = function(e) {
                return null == e.id ? {} : {
                    name: e.name,
                    type: e.id
                }
            },
            mapPlaidError = function(e) {
                return util.defaultTo({}, plaidErrors.find(function(t) {
                    return t.code === parseInt(e, 10)
                }))
            },
            getError = function(e) {
                if (e.response.statusCode >= 300 && null != e.error.code && "" !== e.error.code) {
                    var t = e.error.code.split(":")[0],
                        n = mapPlaidError(t);
                    return {
                        code: t || e.error.code,
                        message: n.message || e.error.message
                    }
                }
                return null
            },
            exitLink = function(e) {
                return util.postMessage({
                    action: "exit",
                    error: getError(e),
                    metadata: {
                        institution: getInstitution(e.institutionSelect.selectedInstitution),
                        link_request_id: e.response.linkRequestId,
                        plaid_api_request_id: e.response.apiRequestId,
                        status: e.response.status
                    }
                }, e.configuration.origin)
            },
            handoff = function(e) {
                return util.postMessage({
                    action: "connected",
                    metadata: {
                        account: {
                            id: getAccountId(e.selectAccount.selectedAccount),
                            name: getAccountName(e.selectAccount.selectedAccount)
                        },
                        account_id: getAccountId(e.selectAccount.selectedAccount),
                        institution: {
                            name: e.institutionSelect.selectedInstitution.name,
                            type: e.institutionSelect.selectedInstitution.id
                        },
                        public_token: e.response.publicToken
                    }
                }, e.configuration.origin)
            },
            initializeMessageHandler = function(e) {
                return window.addEventListener("message", function(t) {
                    var n = void 0;
                    try {
                        n = JSON.parse(t.data)
                    } catch (e) {
                        n = {}
                    }
                    switch (n.action) {
                        case null:
                        case void 0:
                            return;
                        case "plaid_link::active":
                            return e.open(n.institution);
                        case "plaid_link::open":
                            return e.create(n), e.open(n.institution);
                        default:
                            return
                    }
                }, !1)
            },
            initializeFastclick = function() {
                return attachFastClick(document.body)
            },
            initializeEscapeListener = function(e) {
                return document.addEventListener("keydown", function(t) {
                    27 !== t.keyCode && 27 !== t.which || e.dispatch(panes.openExitPrompt())
                })
            },
            initializeOrentiationListener = function() {
                return window.addEventListener("orientationchange", function() {
                    util.toggleClassName("landscape-overlay", document.body, window.orientation === -90 || 90 === window.orientation)
                })
            },
            loadGlobalHandlers = function(e, t) {
                initializeFastclick(), initializeEscapeListener(t), initializeMessageHandler(e), initializeOrentiationListener()
            };
        module.exports = {
            acknowledge: acknowledge,
            handoff: handoff,
            exitLink: exitLink,
            loadGlobalHandlers: loadGlobalHandlers
        };

    }, {
        "./actions/panes": 12,
        "./utilities": 87,
        "fastclick": "fastclick",
        "plaid-errors/errors": 89
    }],
    89: [function(require, module, exports) {
        module.exports = [{
            "http_code": 400,
            "code": 1000,
            "old_code": 1000,
            "message": "access_token missing",
            "resolve": "You need to include the access_token that you received from the original submit call."
        }, {
            "http_code": 400,
            "code": 1001,
            "old_code": 1001,
            "message": "type missing",
            "resolve": "You need to include a type parameter. Ex. bofa, wells, amex, chase, citi, etc."
        }, {
            "http_code": 400,
            "code": 1003,
            "old_code": 1003,
            "message": "access_token disallowed",
            "resolve": "You included an access_token on a submit call - this is only allowed on step and get routes."
        }, {
            "http_code": 400,
            "code": 1008,
            "message": "unsupported access_token",
            "resolve": "This access token format is no longer supported. Contact support to resolve."
        }, {
            "http_code": 400,
            "code": 1004,
            "old_code": 1004,
            "message": "invalid options format",
            "resolve": "Options need to be JSON or stringified JSON."
        }, {
            "http_code": 400,
            "code": 1005,
            "old_code": 1005,
            "message": "credentials missing",
            "resolve": "Provide username, password, and pin if appropriate."
        }, {
            "http_code": 400,
            "code": 1006,
            "old_code": 1006,
            "message": "invalid credentials format",
            "resolve": "Credentials need to be JSON or stringified JSON."
        }, {
            "http_code": 400,
            "code": 1007,
            "message": "upgrade_to required",
            "resolve": "In order to upgrade an account, an upgrade_to field is required , ex. connect"
        }, {
            "http_code": 400,
            "code": 1009,
            "message": "invalid content-type",
            "resolve": "Valid 'Content-Type' headers are 'application/json' and 'application/x-www-form-urlencoded' with an optional 'UTF-8' charset."
        }, {
            "http_code": 401,
            "code": 1100,
            "old_code": 1007,
            "message": "client_id missing",
            "resolve": "Include your Client ID so we know who you are."
        }, {
            "http_code": 401,
            "code": 1101,
            "old_code": 1008,
            "message": "secret missing",
            "resolve": "Include your Secret so we can verify your identity."
        }, {
            "http_code": 401,
            "code": 1102,
            "old_code": 1009,
            "message": "secret or client_id invalid",
            "resolve": "The Client ID does not exist or the Secret does not match the Client ID you provided."
        }, {
            "http_code": 401,
            "code": 1104,
            "old_code": 1011,
            "message": "unauthorized product",
            "resolve": "Your Client ID does not have access to this product. Contact us to purchase this product."
        }, {
            "http_code": 401,
            "code": 1105,
            "old_code": 1014,
            "message": "bad access_token",
            "resolve": "This access_token appears to be corrupted."
        }, {
            "http_code": 401,
            "code": 1106,
            "message": "bad public_token",
            "resolve": "This public_token is corrupt or does not exist in our database. See https://github.com/plaid/link for docs."
        }, {
            "http_code": 401,
            "code": 1107,
            "message": "missing public_token",
            "resolve": "Include the public_token received from the Plaid Link module. See https://github.com/plaid/link for docs."
        }, {
            "http_code": 401,
            "code": 1108,
            "old_code": 1029,
            "message": "invalid type",
            "resolve": "This institution is not currently supported."
        }, {
            "http_code": 401,
            "code": 1109,
            "message": "unauthorized product",
            "resolve": "The sandbox client_id and secret can only be used with sandbox credentials and access tokens. See https://plaid.com/docs/#sandbox."
        }, {
            "http_code": 401,
            "code": 1110,
            "message": "product not enabled",
            "resolve": "This product is not enabled for this item. Use the upgrade route to add it."
        }, {
            "http_code": 401,
            "code": 1111,
            "message": "invalid upgrade",
            "resolve": "Specify a valid product to upgrade this item to."
        }, {
            "http_code": 401,
            "code": 1112,
            "message": "addition limit exceeded",
            "resolve": "You have reached the maximum number of additions. Contact us to raise your limit."
        }, {
            "http_code": 429,
            "code": 1113,
            "message": "rate limit exceeded",
            "resolve": "You have exceeded your request rate limit for this product. Try again soon."
        }, {
            "http_code": 402,
            "code": 1200,
            "old_code": 1015,
            "message": "invalid credentials",
            "resolve": "The username or password provided were not correct."
        }, {
            "http_code": 402,
            "code": 1201,
            "old_code": 1022,
            "message": "invalid username",
            "resolve": "The username provided was not correct."
        }, {
            "http_code": 402,
            "code": 1202,
            "old_code": 1023,
            "message": "invalid password",
            "resolve": "The password provided was not correct."
        }, {
            "http_code": 402,
            "code": 1203,
            "old_code": 1016,
            "message": "invalid mfa",
            "resolve": "The MFA response provided was not correct."
        }, {
            "http_code": 402,
            "code": 1204,
            "old_code": 1026,
            "message": "invalid send_method",
            "resolve": "The MFA send_method provided was invalid. Consult the documentation for the proper format."
        }, {
            "http_code": 402,
            "code": 1205,
            "old_code": 1017,
            "message": "account locked",
            "resolve": "The account is locked. Prompt the user to visit the issuing institution's site and unlock their account."
        }, {
            "http_code": 402,
            "code": 1206,
            "old_code": 1018,
            "message": "account not setup",
            "resolve": "The account has not been fully set up. Prompt the user to visit the issuing institution's site and finish the setup process."
        }, {
            "http_code": 402,
            "code": 1207,
            "old_code": 1024,
            "message": "country not supported",
            "resolve": "We're United States-only at this point!"
        }, {
            "http_code": 402,
            "code": 1208,
            "old_code": 1028,
            "message": "mfa not supported",
            "resolve": "This account requires MFA to access - we're currently not supporting MFA through this institution."
        }, {
            "http_code": 402,
            "code": 1209,
            "message": "invalid pin",
            "resolve": "The pin provided was not correct."
        }, {
            "http_code": 402,
            "code": 1210,
            "message": "account not supported",
            "resolve": "This account is currently not supported."
        }, {
            "http_code": 402,
            "code": 1211,
            "message": "account not supported",
            "resolve": "The SafePass rules for this Bank of America account restrict external access. To resolve, disable \"Require SafePass to sign in to Online Banking\"."
        }, {
            "http_code": 402,
            "code": 1212,
            "message": "no accounts",
            "resolve": "No valid accounts exist for this user."
        }, {
            "http_code": 402,
            "code": 1214,
            "message": "invalid state",
            "resolve": "We either could not understand the state you sent or the state is not supported by the institution."
        }, {
            "http_code": 402,
            "code": 1215,
            "message": "mfa reset",
            "resolve": "MFA access has changed or this application's access has been revoked. Submit a PATCH call to resolve."
        }, {
            "http_code": 401,
            "code": 1218,
            "message": "mfa not required",
            "resolve": "This item does not require the MFA process at this time."
        }, {
            "http_code": 404,
            "code": 1300,
            "message": "institution not available",
            "resolve": "This institution is not yet available in this environment."
        }, {
            "http_code": 404,
            "code": 1301,
            "message": "unable to find institution",
            "resolve": "Double-check the provided institution ID."
        }, {
            "http_code": 402,
            "code": 1302,
            "message": "institution not responding",
            "resolve": "The institution is failing to respond to our request, if you resubmit the query the request may go through."
        }, {
            "http_code": 402,
            "code": 1303,
            "message": "institution down",
            "resolve": "The institution is down for an indeterminate amount of time, if you resubmit in a couple hours it may go through."
        }, {
            "http_code": 404,
            "code": 1501,
            "message": "unable to find category",
            "resolve": "Double-check the provided category ID."
        }, {
            "http_code": 400,
            "code": 1502,
            "message": "type required",
            "resolve": "You must include a type parameter."
        }, {
            "http_code": 400,
            "code": 1503,
            "message": "invalid type",
            "resolve": "The specified type is not supported."
        }, {
            "http_code": 400,
            "code": 1507,
            "message": "invalid date",
            "resolve": "Consult the documentation for valid date formats."
        }, {
            "http_code": 404,
            "code": 1600,
            "old_code": 1021,
            "message": "product not found",
            "resolve": "This product doesn't exist yet, we're actually not sure how you reached this error..."
        }, {
            "http_code": 404,
            "code": 1601,
            "message": "product not available",
            "resolve": "This product is not yet available for this institution."
        }, {
            "http_code": 404,
            "code": 1605,
            "message": "user not found",
            "resolve": "User was previously deleted from our system."
        }, {
            "http_code": 404,
            "code": 1606,
            "message": "account not found",
            "resolve": "The account ID provided was not correct."
        }, {
            "http_code": 404,
            "code": 1610,
            "message": "item not found",
            "resolve": "No matching items found; go add an account!"
        }, {
            "http_code": 501,
            "code": 1700,
            "old_code": 1019,
            "message": "extractor error",
            "resolve": "We failed to pull the required information from the institution - make sure the user can access their account; we have been notified."
        }, {
            "http_code": 502,
            "code": 1701,
            "old_code": 1027,
            "message": "extractor error retry",
            "resolve": "We failed to pull the required information from the institution - resubmit this query."
        }, {
            "http_code": 500,
            "code": 1702,
            "message": "plaid error",
            "resolve": "An unexpected error has occurred on our systems; we've been notified and are looking into it!"
        }, {
            "http_code": 503,
            "code": 1800,
            "message": "planned maintenance",
            "resolve": "Portions of our system are down for maintence. This route is inaccessible. GET requests to Auth and Connect may succeed."
        }]

    }, {}]
}, {}, [70])
//# sourceMappingURL=link.js.map