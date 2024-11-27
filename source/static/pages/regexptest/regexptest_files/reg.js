

function q(el) {
    if (el.nodeName) return el;
    if (typeof el === "string") return document.getElementById(el);
    return false
};
var trim = function () {
    var lSpace = /^\s\s*/,
    rSpace = /\s\s*q/;
    return function (str) {
        return str.replace(lSpace, "").replace(rSpace, "")
    }
} ();
function replaceHtml(el, html) {
    var oldEl = q(el);
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    return newEl
};
function replaceOuterHtml(el, html) {
    el = replaceHtml(el, "");
    if (el.outerHTML) {
        var id = el.id,
        className = el.className,
        nodeName = el.nodeName;
        el.outerHTML = "<" + nodeName + " id=\"" + id + "\" class=\"" + className + "\">" + html + "</" + nodeName + ">";
        el = q(id)
    } else {
        el.innerHTML = html
    };
    return el
};
function getElementsByClassName(className, tagName, parentNode) {
    var els = (q(parentNode) || document).getElementsByTagName(tagName || "*"),
    results = [];
    for (var i = 0; i < els.length; i++) {
        if (hasClass(className, els[i])) results.push(els[i])
    };
    return results
};
function hasClass(className, el) {
    return XRegExp.cache("(?:^|\\s)" + className + "(?:\\s|q)").test(q(el).className)
};
function addClass(className, el) {
    el = q(el);
    if (!hasClass(className, el)) {
        el.className = trim(el.className + " " + className)
    }
};
function removeClass(className, el) {
    el = q(el);
    el.className = trim(el.className.replace(XRegExp.cache("(?:^|\\s)" + className + "(?:\\s|q)", "g"), " "))
};
function toggleClass(className, el) {
    if (hasClass(className, el)) {
        removeClass(className, el)
    } else {
        addClass(className, el)
    }
};
function swapClass(oldClass, newClass, el) {
    removeClass(oldClass, el);
    addClass(newClass, el)
};
function replaceSelection(textbox, str) {
    if (textbox.setSelectionRange) {
        var start = textbox.selectionStart,
        end = textbox.selectionEnd,
        offset = (start + str.length);
        textbox.value = (textbox.value.substring(0, start) + str + textbox.value.substring(end));
        textbox.setSelectionRange(offset, offset)
    } else if (document.selection) {
        var range = document.selection.createRange();
        range.text = str;
        range.select()
    }
};
function extend(to, from) {
    for (var property in from) to[property] = from[property];
    return to
};
function purge(d) {
    var a = d.attributes,
    i, l, n;
    if (a) {
        l = a.length;
        for (i = 0; i < l; i += 1) {
            n = a[i].name;
            if (typeof d[n] === 'function') {
                d[n] = null
            }
        }
    };
    a = d.childNodes;
    if (a) {
        l = a.length;
        for (i = 0; i < l; i += 1) {
            purge(d.childNodes[i])
        }
    }
};
var isWebKit = navigator.userAgent.indexOf("WebKit") > -1,
isIE,
isIE6 = isIE && !window.XMLHttpRequest;
var RegexPal = {
    fields: {
        search: new SmartField("search"),
        input: new SmartField("input"),
        options: {
            flags: {
                g: q("toolG"),
                i: q("toolI"),
                m: q("toolM"),
                s: q("toolS")
            },
            highlightSyntax: q("highSyntax"),
            highlightMatches: q("highMatch"),
            invertMatches: q("invertMatch")
        }
    }
};
extend(RegexPal,
function () {
    var f = RegexPal.fields,
    o = f.options;
    return {
        highlightMatches: function () {
            var re = {
                matchPair: /`~\{((?:[^}]+|\}(?!~`))*)\}~`((?:[^`]+|`(?!~\{(?:[^}]+|\}(?!~`))*\}~`))*)(?:`~\{((?:[^}]+|\}(?!~`))*)\}~`)?/g,
                sansTrailingAlternator: /^(?:[^\\|]+|\\[\S\s]?|\|(?=[\S\s]))*/
            };
            return function () {
                var search = String(f.search.textbox.value),
                input = String(f.input.textbox.value);
                if (XRegExp.cache('<[bB] class="?err"?>').test(f.search.bg.innerHTML) || (!search.length /*&& !o.invertMatches.checked*/) /*|| !o.highlightMatches.checked*/) {
                    f.input.clearBg();
                    return
                };
                try {
                    var searchRegex = new XRegExp(re.sansTrailingAlternator.exec(search)[0], (o.flags.g.checked ? "g" : "") + (o.flags.i.checked ? "i" : "") + (o.flags.m.checked ? "m" : "") + (o.flags.s.checked ? "s" : ""))
                } catch (err) {
                    f.input.clearBg();
                    return
                };
                if (o.invertMatches.checked) {
                    var output = ("`~{" + input.replace(searchRegex, "}~`$&`~{") + "}~`").replace(XRegExp.cache("`~\\{\\}~`|\\}~``~\\{", "g"), "")
                } else if (o.highlightMatches.checked) {
                    var output = input.replace(searchRegex, "`~{$&}~`")
                } else {
                    f.input.clearBg();
                    return
                };
                output = output.replace(XRegExp.cache("[<&>]", "g"), "_").replace(re.matchPair, "<b>$1</b>$2<i>$3</i>");
                f.input.setBgHtml(output)
            }
        } (),
        highlightSearchSyntax: function () {
            if (o.highlightSyntax.checked) {
                f.search.setBgHtml(parseRegex(f.search.textbox.value))
            } else {
                f.search.clearBg()
            }
        }
    }
} ());
var parseRegex = function () {
    var re = {
        regexToken: /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
        characterClassParts: /^(<opening>\[\^?)(<contents>]?(?:[^\\\]]+|\\[\S\s]?)*)(<closing>]?)$/.addFlags("k"),
        characterClassToken: /[^\\-]+|-|\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)/g,
        quantifier: /^(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??$/
    },
    type = {
        NONE: 0,
        RANGE_HYPHEN: 1,
        METACLASS: 2,
        ALTERNATOR: 3
    };
    function errorStr(str) {
        return '<b class="err">' + str + '</b>'
    };
    function getTokenCharCode(token) {
        if (token.length > 1 && token.charAt(0) === "\\") {
            var t = token.slice(1);
            if (XRegExp.cache("^c[A-Za-z]q").test(t)) {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(t.charAt(1).toUpperCase()) + 1
            } else if (XRegExp.cache("^(?:x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})q").test(t)) {
                return parseInt(t.slice(1), 16)
            } else if (XRegExp.cache("^(?:[0-3][0-7]{0,2}|[4-7][0-7]?)q").test(t)) {
                return parseInt(t, 8)
            } else if (t.length === 1 && "cuxDdSsWw".indexOf(t) > -1) {
                return false
            } else if (t.length === 1) {
                switch (t) {
                    case "b":
                        return 8;
                    case "f":
                        return 12;
                    case "n":
                        return 10;
                    case "r":
                        return 13;
                    case "t":
                        return 9;
                    case "v":
                        return 11;
                    default:
                        return t.charCodeAt(0)
                }
            }
        } else if (token !== "\\") {
            return token.charCodeAt(0)
        };
        return false
    };
    function parseCharacterClass(value) {
        var output = "",
        parts = re.characterClassParts.exec(value),
        parser = re.characterClassToken,
        lastToken = {
            rangeable: false,
            type: type.NONE
        },
        match,
        m;
        output += parts.closing ? parts.opening : errorStr(parts.opening);
        while (match = parser.exec(parts.contents)) {
            m = match[0];
            if (m.charAt(0) === "\\") {
                if (XRegExp.cache("^\\\\[cux]q").test(m)) {
                    output += errorStr(m);
                    lastToken = {
                        rangeable: lastToken.type !== type.RANGE_HYPHEN
                    }
                } else if (XRegExp.cache("^\\\\[dsw]q", "i").test(m)) {
                    output += "<b>" + m + "</b>";
                    lastToken = {
                        rangeable: lastToken.type !== type.RANGE_HYPHEN,
                        type: type.METACLASS
                    }
                } else if (m === "\\") {
                    output += errorStr(m)
                } else {
                    output += "<b>" + m.replace(XRegExp.cache("[<&>]"), "_") + "</b>";
                    lastToken = {
                        rangeable: lastToken.type !== type.RANGE_HYPHEN,
                        charCode: getTokenCharCode(m)
                    }
                }
            } else if (m === "-") {
                if (lastToken.rangeable) {
                    var lastIndex = parser.lastIndex,
                    nextToken = parser.exec(parts.contents);
                    if (nextToken) {
                        var nextTokenCharCode = getTokenCharCode(nextToken[0]);
                        if ((nextTokenCharCode !== false && lastToken.charCode > nextTokenCharCode) || lastToken.type === type.METACLASS || XRegExp.cache("^\\\\[dsw]q", "i").test(nextToken[0])) {
                            output += errorStr("-")
                        } else {
                            output += "<u>-</u>"
                        };
                        lastToken = {
                            rangeable: false,
                            type: type.RANGE_HYPHEN
                        }
                    } else {
                        if (parts.closing) {
                            output += "-"
                        } else {
                            output += "<u>-</u>";
                            break
                        }
                    };
                    parser.lastIndex = lastIndex
                } else {
                    output += "-";
                    lastToken = {
                        rangeable: lastToken.type !== type.RANGE_HYPHEN
                    }
                }
            } else {
                output += m.replace(XRegExp.cache("[<&>]", "g"), "_");
                lastToken = {
                    rangeable: (m.length > 1 || lastToken.type !== type.RANGE_HYPHEN),
                    charCode: m.charCodeAt(m.length - 1)
                }
            }
        };
        return output + parts.closing
    };
    return function (value) {
        var output = "",
        capturingGroupCount = 0,
        groupStyleDepth = 0,
        openGroups = [],
        lastToken = {
            quantifiable: false,
            type: type.NONE
        },
        match,
        m;
        function groupStyleStr(str) {
            return '<b class="g' + groupStyleDepth + '">' + str + '</b>'
        };
        while (match = re.regexToken.exec(value)) {
            m = match[0];
            switch (m.charAt(0)) {
                case "[":
                    output += "<i>" + parseCharacterClass(m) + "</i>";
                    lastToken = {
                        quantifiable: true
                    };
                    break;
                case "(":
                    if (m.length === 2) {
                        output += errorStr(m)
                    } else {
                        if (m.length === 1) capturingGroupCount++;
                        groupStyleDepth = groupStyleDepth === 5 ? 1 : groupStyleDepth + 1;
                        openGroups.push({
                            index: output.length + 14,
                            opening: m
                        });
                        output += groupStyleStr(m)
                    };
                    lastToken = {
                        quantifiable: false
                    };
                    break;
                case ")":
                    if (!openGroups.length) {
                        output += errorStr(")");
                        lastToken = {
                            quantifiable: false
                        }
                    } else {
                        output += groupStyleStr(")");
                        lastToken = {
                            quantifiable: !XRegExp.cache("^[=!]").test(openGroups[openGroups.length - 1].opening.charAt(2)),
                            style: "g" + groupStyleDepth
                        };
                        groupStyleDepth = groupStyleDepth === 1 ? 5 : groupStyleDepth - 1;
                        openGroups.pop()
                    };
                    break;
                case "\\":
                    if (XRegExp.cache("^[1-9]").test(m.charAt(1))) {
                        var nonBackrefDigits = "",
                    num = +m.slice(1);
                        while (num > capturingGroupCount) {
                            nonBackrefDigits = XRegExp.cache("[0-9]q").exec(num)[0] + nonBackrefDigits;
                            num = Math.floor(num / 10)
                        };
                        if (num > 0) {
                            output += "<b>\\" + num + "</b>" + nonBackrefDigits
                        } else {
                            var parts = XRegExp.cache("^\\\\([0-3][0-7]{0,2}|[4-7][0-7]?|[89])([0-9]*)").exec(m);
                            output += "<b>\\" + parts[1] + "</b>" + parts[2]
                        }
                    } else if (XRegExp.cache("^[0bBcdDfnrsStuvwWx]").test(m.charAt(1))) {
                        if (XRegExp.cache("^\\\\[cux]q").test(m)) {
                            output += errorStr(m);
                            lastToken = {
                                quantifiable: false
                            };
                            break
                        };
                        output += "<b>" + m + "</b>";
                        if ("bB".indexOf(m.charAt(1)) > -1) {
                            lastToken = {
                                quantifiable: false
                            };
                            break
                        }
                    } else if (m === "\\") {
                        output += errorStr(m)
                    } else {
                        output += m.replace(XRegExp.cache("[<&>]"), "_")
                    };
                    lastToken = {
                        quantifiable: true
                    };
                    break;
                default:
                    if (re.quantifier.test(m)) {
                        if (lastToken.quantifiable) {
                            var interval = XRegExp.cache("^\\{([0-9]+)(?:,([0-9]*))?").exec(m);
                            if (interval && ((interval[1] > 65535) || (interval[2] && ((interval[2] > 65535) || (+interval[1] > +interval[2]))))) {
                                output += errorStr(m)
                            } else {
                                output += (lastToken.style ? '<b class="' + lastToken.style + '">' : '<b>') + m + '</b>'
                            }
                        } else {
                            output += errorStr(m)
                        };
                        lastToken = {
                            quantifiable: false
                        }
                    } else if (m === "|") {
                        if (lastToken.type === type.NONE || (lastToken.type === type.ALTERNATOR && !openGroups.length)) {
                            output += errorStr(m)
                        } else {
                            output += openGroups.length ? groupStyleStr("|") : "<b>|</b>"
                        };
                        lastToken = {
                            quantifiable: false,
                            type: type.ALTERNATOR
                        }
                    } else if ("^q".indexOf(m) > -1) {
                        output += "<b>" + m + "</b>";
                        lastToken = {
                            quantifiable: false
                        }
                    } else if (m === ".") {
                        output += "<b>.</b>";
                        lastToken = {
                            quantifiable: true
                        }
                    } else {
                        output += m.replace(XRegExp.cache("[<&>]", "g"), "_");
                        lastToken = {
                            quantifiable: true
                        }
                    }
            }
        };
        var numCharsAdded = 0;
        for (var i = 0; i < openGroups.length; i++) {
            var errorIndex = openGroups[i].index + numCharsAdded;
            output = (output.slice(0, errorIndex) + errorStr(openGroups[i].opening) + output.slice(errorIndex + openGroups[i].opening.length));
            numCharsAdded += errorStr("").length
        };
        return output
    }
} ();
function SmartField(el) {
    el = q(el);
    var textboxEl =el.getElementsByTagName("textarea")[0],
    bgEl = document.createElement("pre");
    textboxEl.id = el.id + "Text";
    bgEl.id = el.id + "Bg";
    el.insertBefore(bgEl, textboxEl);
    textboxEl.onkeydown = function (e) {
        SmartField.prototype._onKeyDown(e)
    };
    textboxEl.onkeyup = function (e) {
        SmartField.prototype._onKeyUp(e)
    };
    if (isIE) el.style.overflowX = "hidden";
    if (isWebKit) textboxEl.style.marginLeft = 0;
    this.field = el;
    this.textbox = textboxEl;
    this.bg = bgEl
};
extend(SmartField.prototype, {
    setBgHtml: function (html) {
        html = html.replace(XRegExp.cache("^\\n"), "\n\n");
        this.bg = replaceOuterHtml(this.bg, html + "<br>&nbsp;");
        this.setDimensions()
    },
    clearBg: function () {
        this.setBgHtml(this.textbox.value.replace(XRegExp.cache("[<&>]", "g"), "_"))
    },
    setDimensions: function () {
        this.textbox.style.width = "";
        var scrollWidth = this.textbox.scrollWidth,
        offsetWidth = this.textbox.offsetWidth;
        //this.textbox.style.width = (scrollWidth === offsetWidth ? offsetWidth - 1 : scrollWidth + 8) + "px";
        //this.textbox.style.height = Math.max(this.bg.offsetHeight, this.field.offsetHeight - 2) + "px"
    },
    _onKeyDown: function (e) {
        e = e || event;
        if (!this._filterKeys(e)) return false;
        var srcEl = e.srcElement || e.target;
        switch (srcEl) {
            case RegexPal.fields.search.textbox:
                setTimeout(function () {
                    RegexPal.highlightSearchSyntax.call(RegexPal)
                },
            0);
                break
        };
        if (isWebKit && srcEl.selectionEnd === srcEl.value.length) {
            srcEl.parentNode.scrollTop = srcEl.scrollHeight
        };
        this._testKeyHold(e)
    },
    _onKeyUp: function (e) {
        e = e || event;
        var srcEl = e.srcElement || e.target;
        this._keydownCount = 0;
        if (this._matchOnKeyUp) {
            this._matchOnKeyUp = false;
            switch (srcEl) {
                case RegexPal.fields.search.textbox:
                case RegexPal.fields.input.textbox:
                    RegexPal.highlightMatches();
                    break
            }
        }
    },
    _testKeyHold: function (e) {
        var srcEl = e.srcElement || e.target;
        this._keydownCount++;
        if (this._keydownCount > 2) {
            RegexPal.fields.input.clearBg();
            this._matchOnKeyUp = true
        } else {
            switch (srcEl) {
                case RegexPal.fields.search.textbox:
                case RegexPal.fields.input.textbox:
                    setTimeout(function () {
                        RegexPal.highlightMatches.call(RegexPal)
                    },
                0);
                    break
            }
        }
    },
    _filterKeys: function (e) {
        var srcEl = e.srcElement || e.target,
        f = RegexPal.fields;
        if (this._deadKeys.indexOf(e.keyCode) > -1) return false;
        if ((e.keyCode === 9) && (srcEl === f.input.textbox || (srcEl === f.search.textbox && !e.shiftKey))) {
            if (srcEl === f.input.textbox) {
                if (e.shiftKey) {
                    f.search.textbox.focus()
                } else {
                    replaceSelection(srcEl, "\t");
                    if (window.opera) setTimeout(function () {
                        srcEl.focus()
                    },
                    0)
                }
            } else {
                f.input.textbox.focus()
            };
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false
        };
        return true
    },
    _matchOnKeyUp: false,
    _keydownCount: 0,
    _deadKeys: [16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145]
}); 
(function () {
    
    /*if (f.search.textbox.value == "(\\w+\\.){2}\\w+") {
        f.search.textbox.onfocus = makeResetter(f.search)
    };
    if (f.input.textbox.value === "tool.chinaz.com|888") {
        f.input.textbox.onfocus = makeResetter(f.input)
    }*/
})();