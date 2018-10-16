(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
/* axios v0.18.0 | (c) 2018 by Matt Zabriskie */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axios=t():e.axios=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new s(e),n=i(s.prototype.request,t);return o.extend(n,s.prototype,t),o.extend(n,t),n}var o=n(2),i=n(3),s=n(5),u=n(6),a=r(u);a.Axios=s,a.create=function(e){return r(o.merge(u,e))},a.Cancel=n(23),a.CancelToken=n(24),a.isCancel=n(20),a.all=function(e){return Promise.all(e)},a.spread=n(25),e.exports=a,e.exports.default=a},function(e,t,n){"use strict";function r(e){return"[object Array]"===R.call(e)}function o(e){return"[object ArrayBuffer]"===R.call(e)}function i(e){return"undefined"!=typeof FormData&&e instanceof FormData}function s(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function u(e){return"string"==typeof e}function a(e){return"number"==typeof e}function c(e){return"undefined"==typeof e}function f(e){return null!==e&&"object"==typeof e}function p(e){return"[object Date]"===R.call(e)}function d(e){return"[object File]"===R.call(e)}function l(e){return"[object Blob]"===R.call(e)}function h(e){return"[object Function]"===R.call(e)}function m(e){return f(e)&&h(e.pipe)}function y(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function w(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function g(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function v(e,t){if(null!==e&&"undefined"!=typeof e)if("object"!=typeof e&&(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}function x(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=x(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function b(e,t,n){return v(t,function(t,r){n&&"function"==typeof t?e[r]=E(t,n):e[r]=t}),e}var E=n(3),C=n(4),R=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:o,isBuffer:C,isFormData:i,isArrayBufferView:s,isString:u,isNumber:a,isObject:f,isUndefined:c,isDate:p,isFile:d,isBlob:l,isFunction:h,isStream:m,isURLSearchParams:y,isStandardBrowserEnv:g,forEach:v,merge:x,extend:b,trim:w}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t){function n(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function r(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&n(e.slice(0,0))}/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */
e.exports=function(e){return null!=e&&(n(e)||r(e)||!!e._isBuffer)}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new s,response:new s}}var o=n(6),i=n(2),s=n(17),u=n(18);r.prototype.request=function(e){"string"==typeof e&&(e=i.merge({url:arguments[0]},arguments[1])),e=i.merge(o,{method:"get"},this.defaults,e),e.method=e.method.toLowerCase();var t=[u,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},i.forEach(["delete","get","head","options"],function(e){r.prototype[e]=function(t,n){return this.request(i.merge(n||{},{method:e,url:t}))}}),i.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(i.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e,t){!i.isUndefined(e)&&i.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(8):"undefined"!=typeof process&&(e=n(8)),e}var i=n(2),s=n(7),u={"Content-Type":"application/x-www-form-urlencoded"},a={adapter:o(),transformRequest:[function(e,t){return s(t,"Content-Type"),i.isFormData(e)||i.isArrayBuffer(e)||i.isBuffer(e)||i.isStream(e)||i.isFile(e)||i.isBlob(e)?e:i.isArrayBufferView(e)?e.buffer:i.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):i.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};a.headers={common:{Accept:"application/json, text/plain, */*"}},i.forEach(["delete","get","head"],function(e){a.headers[e]={}}),i.forEach(["post","put","patch"],function(e){a.headers[e]=i.merge(u)}),e.exports=a},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(9),i=n(12),s=n(13),u=n(14),a=n(10),c="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||n(15);e.exports=function(e){return new Promise(function(t,f){var p=e.data,d=e.headers;r.isFormData(p)&&delete d["Content-Type"];var l=new XMLHttpRequest,h="onreadystatechange",m=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in l||u(e.url)||(l=new window.XDomainRequest,h="onload",m=!0,l.onprogress=function(){},l.ontimeout=function(){}),e.auth){var y=e.auth.username||"",w=e.auth.password||"";d.Authorization="Basic "+c(y+":"+w)}if(l.open(e.method.toUpperCase(),i(e.url,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,l[h]=function(){if(l&&(4===l.readyState||m)&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in l?s(l.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?l.response:l.responseText,i={data:r,status:1223===l.status?204:l.status,statusText:1223===l.status?"No Content":l.statusText,headers:n,config:e,request:l};o(t,f,i),l=null}},l.onerror=function(){f(a("Network Error",e,null,l)),l=null},l.ontimeout=function(){f(a("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",l)),l=null},r.isStandardBrowserEnv()){var g=n(16),v=(e.withCredentials||u(e.url))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in l&&r.forEach(d,function(e,t){"undefined"==typeof p&&"content-type"===t.toLowerCase()?delete d[t]:l.setRequestHeader(t,e)}),e.withCredentials&&(l.withCredentials=!0),e.responseType)try{l.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){l&&(l.abort(),f(e),l=null)}),void 0===p&&(p=null),l.send(p)})}},function(e,t,n){"use strict";var r=n(10);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},function(e,t,n){"use strict";var r=n(11);e.exports=function(e,t,n,o,i){var s=new Error(e);return r(s,t,n,o,i)}},function(e,t){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e}},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(o.isURLSearchParams(t))i=t.toString();else{var s=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)?t+="[]":e=[e],o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),s.push(r(t)+"="+r(e))}))}),i=s.join("&")}return i&&(e+=(e.indexOf("?")===-1?"?":"&")+i),e}},function(e,t,n){"use strict";var r=n(2),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,s={};return e?(r.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(s[t]&&o.indexOf(t)>=0)return;"set-cookie"===t?s[t]=(s[t]?s[t]:[]).concat([n]):s[t]=s[t]?s[t]+", "+n:n}}),s):s}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t){"use strict";function n(){this.message="String contains an invalid character"}function r(e){for(var t,r,i=String(e),s="",u=0,a=o;i.charAt(0|u)||(a="=",u%1);s+=a.charAt(63&t>>8-u%1*8)){if(r=i.charCodeAt(u+=.75),r>255)throw new n;t=t<<8|r}return s}var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n.prototype=new Error,n.prototype.code=5,n.prototype.name="InvalidCharacterError",e.exports=r},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,i,s){var u=[];u.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&u.push("expires="+new Date(n).toGMTString()),r.isString(o)&&u.push("path="+o),r.isString(i)&&u.push("domain="+i),s===!0&&u.push("secure"),document.cookie=u.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),i=n(19),s=n(20),u=n(6),a=n(21),c=n(22);e.exports=function(e){r(e),e.baseURL&&!a(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=i(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||u.adapter;return t(e).then(function(t){return r(e),t.data=i(t.data,t.headers,e.transformResponse),t},function(t){return s(t)||(r(e),t&&t.response&&(t.response.data=i(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(23);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});

}).call(this,require('_process'))
},{"_process":1}],3:[function(require,module,exports){
!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.returnExportsGlobal=b()}):"object"==typeof exports?module.exports=b():a.Formatter=b()}(this,function(){var a=function(){var a={},b=4,c=new RegExp("{{([^}]+)}}","g"),d=function(a){for(var b,d=[];b=c.exec(a);)d.push(b);return d};return a.parse=function(a){var c={inpts:{},chars:{}},e=d(a),f=a.length,g=0,h=0,i=0,j=function(a){for(var d=a.length,e=0;d>e;e++)c.inpts[h]=a.charAt(e),h++;g++,i+=a.length+b-1};for(i;f>i;i++)g<e.length&&i===e[g].index?j(e[g][1]):c.chars[i-g*b]=a.charAt(i);return c.mLength=i-g*b,c},a}(),b=function(){var a={};"undefined"!=typeof navigator?navigator.userAgent:null;return a.extend=function(a){for(var b=1;b<arguments.length;b++)for(var c in arguments[b])a[c]=arguments[b][c];return a},a.addChars=function(a,b,c){return a.substr(0,c)+b+a.substr(c,a.length)},a.removeChars=function(a,b,c){return a.substr(0,b)+a.substr(c,a.length)},a.isBetween=function(a,b){return b.sort(function(a,b){return a-b}),a>b[0]&&a<b[1]},a.addListener=function(a,b,c){return"undefined"!=typeof a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},a.preventDefault=function(a){return a.preventDefault?a.preventDefault():a.returnValue=!1},a.getClip=function(a){return a.clipboardData?a.clipboardData.getData("Text"):window.clipboardData?window.clipboardData.getData("Text"):void 0},a.getMatchingKey=function(a,b,c){for(var d in c){var e=c[d];if(a===e.which&&b===e.keyCode)return d}},a.isDelKeyDown=function(b,c){var d={backspace:{which:8,keyCode:8},"delete":{which:46,keyCode:46}};return a.getMatchingKey(b,c,d)},a.isDelKeyPress=function(b,c){var d={backspace:{which:8,keyCode:8,shiftKey:!1},"delete":{which:0,keyCode:46}};return a.getMatchingKey(b,c,d)},a.isSpecialKeyPress=function(b,c){var d={tab:{which:0,keyCode:9},enter:{which:13,keyCode:13},end:{which:0,keyCode:35},home:{which:0,keyCode:36},leftarrow:{which:0,keyCode:37},uparrow:{which:0,keyCode:38},rightarrow:{which:0,keyCode:39},downarrow:{which:0,keyCode:40},F5:{which:116,keyCode:116}};return a.getMatchingKey(b,c,d)},a.isModifier=function(a){return a.ctrlKey||a.altKey||a.metaKey},a.forEach=function(a,b,c){if(a.hasOwnProperty("length"))for(var d=0,e=a.length;e>d&&b.call(c,a[d],d,a)!==!1;d++);else for(var f in a)if(a.hasOwnProperty(f)&&b.call(c,a[f],f,a)===!1)break},a}(),c=function(a,b){function c(c){var e=[],f=[];b.forEach(c,function(c){b.forEach(c,function(b,c){var g=a.parse(b),h=d(c);return e.push(h),f.push(g),!1})});var g=function(a){var c;return b.forEach(e,function(b,d){return b.test(a)?(c=d,!1):void 0}),void 0===c?null:f[c]};return{getPattern:g,patterns:f,matchers:e}}var d=function(a){return"*"===a?/.*/:new RegExp(a)};return c}(a,b),d=function(){var a={};return a.get=function(a){if("number"==typeof a.selectionStart)return{begin:a.selectionStart,end:a.selectionEnd};var b=document.selection.createRange();if(b&&b.parentElement()===a){var c=a.createTextRange(),d=a.createTextRange(),e=a.value.length;return c.moveToBookmark(b.getBookmark()),d.collapse(!1),c.compareEndPoints("StartToEnd",d)>-1?{begin:e,end:e}:{begin:-c.moveStart("character",-e),end:-c.moveEnd("character",-e)}}return{begin:0,end:0}},a.set=function(a,b){if("object"!=typeof b&&(b={begin:b,end:b}),a.setSelectionRange)a.focus(),a.setSelectionRange(b.begin,b.end);else if(a.createTextRange){var c=a.createTextRange();c.collapse(!0),c.moveEnd("character",b.end),c.moveStart("character",b.begin),c.select()}},a}(),e=function(a,b,c){function d(b,d){var f=this;if(f.el=b,!f.el)throw new TypeError("Must provide an existing element");if(f.opts=c.extend({},e,d),"undefined"!=typeof f.opts.pattern&&(f.opts.patterns=f._specFromSinglePattern(f.opts.pattern),delete f.opts.pattern),"undefined"==typeof f.opts.patterns)throw new TypeError("Must provide a pattern or array of patterns");f.patternMatcher=a(f.opts.patterns),f._updatePattern(),f.hldrs={},f.focus=0,c.addListener(f.el,"keydown",function(a){f._keyDown(a)}),c.addListener(f.el,"keypress",function(a){f._keyPress(a)}),c.addListener(f.el,"paste",function(a){f._paste(a)}),f.opts.persistent&&(f._processKey("",!1),f.el.blur(),c.addListener(f.el,"focus",function(a){f._focus(a)}),c.addListener(f.el,"click",function(a){f._focus(a)}),c.addListener(f.el,"touchstart",function(a){f._focus(a)}))}var e={persistent:!1,repeat:!1,placeholder:" "},f={9:/[0-9]/,a:/[A-Za-z]/,A:/[A-Z]/,"?":/[A-Z0-9]/,"*":/[A-Za-z0-9]/};return d.addInptType=function(a,b){f[a]=b},d.prototype.resetPattern=function(c){this.opts.patterns=c?this._specFromSinglePattern(c):this.opts.patterns,this.sel=b.get(this.el),this.val=this.el.value,this.delta=0,this._removeChars(),this.patternMatcher=a(this.opts.patterns);var d=this.patternMatcher.getPattern(this.val);this.mLength=d.mLength,this.chars=d.chars,this.inpts=d.inpts,this._processKey("",!1,!0)},d.prototype._updatePattern=function(){var a=this.patternMatcher.getPattern(this.val);a&&(this.mLength=a.mLength,this.chars=a.chars,this.inpts=a.inpts)},d.prototype._keyDown=function(a){var b=a.which||a.keyCode;return b&&c.isDelKeyDown(a.which,a.keyCode)?(this._processKey(null,b),c.preventDefault(a)):void 0},d.prototype._keyPress=function(a){var b,d;return b=a.which||a.keyCode,d=c.isSpecialKeyPress(a.which,a.keyCode),c.isDelKeyPress(a.which,a.keyCode)||d||c.isModifier(a)?void 0:(this._processKey(String.fromCharCode(b),!1),c.preventDefault(a))},d.prototype._paste=function(a){return this._processKey(c.getClip(a),!1),c.preventDefault(a)},d.prototype._focus=function(){var a=this;setTimeout(function(){var c=b.get(a.el),d=c.end>a.focus,e=0===c.end;(d||e)&&b.set(a.el,a.focus)},0)},d.prototype._processKey=function(a,d,e){if(this.sel=b.get(this.el),this.val=this.el.value,this.delta=0,this.sel.begin!==this.sel.end)this.delta=-1*Math.abs(this.sel.begin-this.sel.end),this.val=c.removeChars(this.val,this.sel.begin,this.sel.end);else if(d&&46===d)this._delete();else if(d&&this.sel.begin-1>=0)this.val=c.removeChars(this.val,this.sel.end-1,this.sel.end),this.delta-=1;else if(d)return!0;d||(this.val=c.addChars(this.val,a,this.sel.begin),this.delta+=a.length),this._formatValue(e)},d.prototype._delete=function(){for(;this.chars[this.sel.begin];)this._nextPos();this.sel.begin<this.val.length&&(this._nextPos(),this.val=c.removeChars(this.val,this.sel.end-1,this.sel.end),this.delta=-1)},d.prototype._nextPos=function(){this.sel.end++,this.sel.begin++},d.prototype._formatValue=function(a){this.newPos=this.sel.end+this.delta,this._removeChars(),this._updatePattern(),this._validateInpts(),this._addChars(),this.el.value=this.val.substr(0,this.mLength),("undefined"==typeof a||a===!1)&&b.set(this.el,this.newPos)},d.prototype._removeChars=function(){this.sel.end>this.focus&&(this.delta+=this.sel.end-this.focus);for(var a=0,b=0;b<=this.mLength;b++){var d,e=this.chars[b],f=this.hldrs[b],g=b+a;g=b>=this.sel.begin?g+this.delta:g,d=this.val.charAt(g),(e&&e===d||f&&f===d)&&(this.val=c.removeChars(this.val,g,g+1),a--)}this.hldrs={},this.focus=this.val.length},d.prototype._validateInpts=function(){for(var a=0;a<this.val.length;a++){var b=this.inpts[a];if("?"===b||"A"===b){var d=this.val.charAt(a).toUpperCase();this.val=c.addChars(c.removeChars(this.val,a,a+1),d,a)}var e=!f[b],g=!e&&!f[b].test(this.val.charAt(a)),h=this.inpts[a];(e||g)&&h&&(this.val=c.removeChars(this.val,a,a+1),this.focusStart--,this.newPos--,this.delta--,a--)}},d.prototype._addChars=function(){if(this.opts.persistent){for(var a=0;a<=this.mLength;a++)this.val.charAt(a)||(this.val=c.addChars(this.val,this.opts.placeholder,a),this.hldrs[a]=this.opts.placeholder),this._addChar(a);for(;this.chars[this.focus];)this.focus++}else for(var b=0;b<=this.val.length;b++){if(this.delta<=0&&b===this.focus)return!0;this._addChar(b)}},d.prototype._addChar=function(a){var b=this.chars[a];return b?(c.isBetween(a,[this.sel.begin-1,this.newPos+1])&&(this.newPos++,this.delta++),a<=this.focus&&this.focus++,this.hldrs[a]&&(delete this.hldrs[a],this.hldrs[a+1]=this.opts.placeholder),void(this.val=c.addChars(this.val,b,a))):!0},d.prototype._specFromSinglePattern=function(a){return[{"*":a}]},d}(c,d,b);return e});
},{}],4:[function(require,module,exports){
try {
    // Dependencies =======
    // js
    window.Axios = require('../../libs/axios/axios.min');
    window.Formatter = require('../../libs/formatter/formatter.min');

    // Main ======
    // js
    window.Couppy = require('./couppy.js');
} catch (ex) {

}
},{"../../libs/axios/axios.min":2,"../../libs/formatter/formatter.min":3,"./couppy.js":5}],5:[function(require,module,exports){
(function (global){
/**
 *
 * Couppy v0.0.1
 *
 * Made by Adam Kocić [Falkan3]
 * http://github.com/Falkan3/
 *
 * Boilerplate description by Chris Ferdinandi.
 * http://gomakethings.com
 *
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Couppy = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    const Couppy = {}; // Object for public APIs
    const supports = !!document.querySelector && !!root.addEventListener; // Feature test
    let settings, eventTimeout;
    const pluginName = 'Couppy';
    const pluginNameLower = pluginName.toLowerCase();
    const pluginClassPrefix = `js-${pluginNameLower}`;

    // Default settings
    const defaults = {
        initClass: 'js-Couppy',

        state: {
            active: true,
            open: false,
            cardActive: 0,
            cardActiveDefault: 0,
            submitTimeout: null,
            popupTriggerActive: true
        },
        appearance: {
            style: 1, // card render style
            popupTrigger: {
                classList: []
            },
            main: {
                classList: []
            },
            overlay: {
                classList: []
            },
            popupContainer: {
                classList: []
            },
            popup: {
                classList: ['animated', 'lightSpeedIn']
            },
            card: [
                {
                    classList: ['animated', 'emerge']
                },
                {
                    classList: ['animated', 'emerge']
                }
            ],
            logo: {
                url: '',
                alt: ''
            }
        },
        data: {
            api: {
                url: 'https://jsonplaceholder.typicode.com/posts',
                method: 'get',
                params: {
                    key: ''
                },
                data: {}
            },
            promo: {
                value: 5,
                suffix: '%',
                coupon: 'couponcode', // can be static or dynamically generated from API
            }
        },
        text: {
            popupTrigger: {
                first: 'Coupon',
                second: 'for you',
            },
            /* --- */
            title: 'Halloween sale', // the topmost paragraph on the card
            promo: 'off', // text after the promo "5%", for example "off" in "5% off"
            subtext: 'use the code above during the checkout', // the text just below the promo code, usually contains instructions on how to use the code
            link: {
                // link to collection or promo page
                text: 'Browse collection',
                target: '#'
            },
            inputs: {
                invalid: 'Input value is invalid'
            },
            btn: {
                default: '<i class="far fa-envelope"></i>',
                sending: '<i class="fas fa-spinner"></i>',
                success: '<i class="fas fa-check"></i>',
            },
            footerText: {
                btn: {
                    more: 'More details',
                    less: 'Less details',
                },
                short: 'Lorem ipsum',
                long: 'Lorem ipsum dolor'
            },
            thankYou: {
                top: '<i class="fas fa-check"></i> Success',
                bottom: 'We\'ll be in touch to provide you with the promo details.',
            },
            api: {
                error: 'API error'
            }
        },
        inputs: {
            templates: {
                field: {
                    attributes: {},
                    regex: ''
                },
                agreement: {
                    attributes: {}
                }
            },
            fields: [],
            agreements: []
        },
        refs: {
            overlay: null,
            popupContainer: null,
            popup: null,
            card: [],
            img: {
                logo: null,
            },
            btn: {
                close: null,
                submit: null,
                readmore: {
                    open: null,
                    close: null
                }
            },
            inputs: {
                fields: [],
                agreements: []
            },
            errors: [],
            readmore: {
                short: null,
                long: null
            }
        },

        callbackOnInit: function () {
        },
        callbackBefore: function () {
        },
        callbackAfter: function () {
        },
        callbackOnOpen: function () {
        },
        callbackOnClose: function () {
        },
        callbackOnSubmit: function () {
        },
        callbackOnSendSuccess: function () {
        },
        callbackOnSendError: function () {
        },
        callbackOnSend: function () {
        },
    };


    //
    // Methods
    //

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    const forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (let prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (let i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    const extend = function (defaults, options) {
        var extended = {};
        forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function (value, prop) {
            extended[prop] = options[prop];
        });
        return extended;
    };

    /**
     * Check if an item is an object
     * @private
     * @param {Object} item The item to be checked
     * @returns {Boolean}
     */
    const isObject = function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} target Object to be extended
     * @param {Object} source
     * @returns {Object} Merged values of target and source
     */
    const mergeDeep = function (target, source) {
        let output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, {[key]: source[key]});
                    else
                        output[key] = mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, {[key]: source[key]});
                }
            });
        }
        return output;
    };

    /**
     * Convert data-options attribute into an object of key/value pairs
     * @private
     * @param {String} options Link-specific options as a data attribute string
     * @returns {Object}
     */
    const getDataOptions = function (options) {
        return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse(options);
    };

    /**
     * Get the closest matching element up the DOM tree
     * @param {Element} elem Starting element
     * @param {String} selector Selector to match against (class, ID, or data attribute)
     * @return {Boolean|Element} Returns false if not match found
     */
    const getClosest = function (elem, selector) {
        const firstChar = selector.charAt(0);
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    return elem;
                }
            } else if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            } else if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }
        }
        return false;
    };

    const copyToClipboard = str => {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =
            document.getSelection().rangeCount > 0        // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0)     // Store selection if found
                : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
            document.getSelection().addRange(selected);   // Restore the original selection
        }
    };

    /**
     * Handle events
     * @private
     */
    const eventHandler = function (event) {
        const toggle = event.target;
        const closest = getClosest(toggle, '[data-some-selector]');
        if (closest) {
            // run methods
        }
    };

    /**
     * Popup trigger event
     * @private
     */
    const eventHandler_PopupTrigger = function (event) {
        Couppy.open();
    };

    /**
     * Close button event
     * @private
     */
    const eventHandler_Close = function (event) {
        Couppy.close();
    };

    /**
     * Popup click event
     * @private
     */
    const eventHandler_Popup = function (event) {
        event.stopPropagation();
    };

    /**
     * Keydown event
     * @private
     */
    const eventHandler_Keydown = function (event) {
        event = event || window.event;
        if (settings.state.open) {
            let isEscape = false;
            if ("key" in event) {
                isEscape = (event.key === "Escape" || event.key === "Esc");
            } else {
                isEscape = (event.keyCode === 27);
            }
            if (isEscape) {
                Couppy.close();
            }
        }
    };

    /**
     * Keydown event
     * @private
     */
    const eventHandler_CopyCode = function (event) {
        copyToClipboard(settings.data.promo.coupon);
        console.log('Copied ' + settings.data.promo.coupon + ' to clipboard');
    };

    /**
     * Mouseout event
     * @private
     */
    const eventHandler_Mouseout = function (event) {
        if(settings.state.active) {
            var top = event.pageY;

            if (top < document.documentElement.scrollTop + 10) {
                console.log("Mouse out of document bounds (top)");
                Couppy.open();
            }
        }
    };

    /**
     * Mouseout event (any side)
     * @private
     */
    const eventHandler_Mouseout2 = function (event) {
        if(settings.state.active) {
            var top = event.pageY;
            var right = document.documentElement.clientWidth - event.pageX;
            var bottom = document.documentElement.clientHeight - event.pageY;
            var left = event.pageX;

            if (top < document.documentElement.scrollTop + 10 || right < 20 || left < 20) {
                console.log("Mouse out of document bounds");
                Couppy.open();
            }
        }
    };

    /* =========== Style 2 =========== */

    /**
     * Input blur
     * @private
     */
    const eventHandler_InputBlur = function (event) {
        event.target.classList.remove(classPrefix('wrong'));
    };

    /**
     * Input on input
     * @private
     */
    const eventHandler_InputOnInput = function (event) {
        const fieldData = settings.inputs.fields[event.target.dataset['couppyFieldId']];
        if (validateInputs(event.target.value, fieldData.regex).valid) {
            setInputState(true, event.target);
        } else {
            setInputState(false, event.target);
        }
    };

    /**
     * Form submit event
     * @private
     */
    const eventHandler_FormSubmit = function (event) {
        event.preventDefault();

        // On Submit callback -----------------
        if (typeof settings.callbackOnSubmit === 'function') {
            settings.callbackOnSubmit.call(this);
        }

        let validationResponseFields = {valid: true, invalidElements: []};
        let validationResponseAgreements = {valid: true, invalidElements: []};

        settings.inputs.fields.forEach(function (item, i) {
            if(item.attributes.required) {
                const refEl = settings.refs.inputs.fields[item.refId];
                const result = validateInputs(refEl.value, item.regex);
                if (!result.valid) {
                    validationResponseFields.valid = false;
                    validationResponseFields.invalidElements.push(item);
                }
            }
        });
        validationResponseFields.valid ? console.log('%c Validation successful', 'color: #00ff00') : console.log('%c Validation failed', 'color: #ff0000');

        inputErrorsReset(); // Remove input errors

        if (validationResponseFields.valid) {
            settings.refs.btn.submit.innerHTML = settings.text.btn.sending;

            let params = {};
            let data = {};
            let formData = {};
            for (const [key, value] of new FormData(settings.refs.form).entries()) {
                let valueFormatted = value.replace(/-/g, '');
                formData[key] = valueFormatted;
            }
            switch(settings.data.api.method.toLowerCase()) {
                case 'get':
                    params = mergeDeep(formData, settings.data.api.params);
                    break;
                case 'post':
                    data = mergeDeep(formData, settings.data.api.data);
                    break;
            }

            Axios({
                url: settings.data.api.url,
                method: settings.data.api.method,
                params: params,
                data: data,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then(function (response) {
                console.log(response);

                if (response.status === 200 && response.data.code === 200) {
                        settings.refs.form.reset();

                        switch (settings.appearance.style) {
                            case 2:
                                Couppy.cardToggle(1);
                                settings.refs.btn.submit.innerHTML = settings.text.btn.success;
                                break;
                        }

                        clearTimeout(settings.state.submitTimeout);
                        settings.state.submitTimeout = setTimeout(function () {
                            Couppy.reset();
                        }, 5000);

                    // On SendSuccess callback -----------------
                    if (typeof settings.callbackOnSendSuccess === 'function') {
                        settings.callbackOnSendSuccess.call(this);
                    }
                } else {
                    inputErrorsAdd(null, settings.text.api.error);
                    return Promise.reject(settings.text.api.error);
                }
            }).catch(function (error) {
                console.log(error);

                Couppy.reset({preserveInput: true});

                // On SendError callback -----------------
                if (typeof settings.callbackOnSendError === 'function') {
                    settings.callbackOnSendError.call(this);
                }
            }).then(function () {
                // always executed

                // On Send callback -----------------
                if (typeof settings.callbackOnSend === 'function') {
                    settings.callbackOnSend.call(this);
                }
            });
        } else {
            settings.refs.errors = [];
            validationResponseFields.invalidElements.forEach(function (item) {
                inputErrorsAdd(item);
            });
        }
    };

    /**
     * Readmore open
     * @private
     */
    const eventHandler_BtnReadmoreOpen = function (event) {
        settings.refs.readmore.long.classList.remove('hidden');
        settings.refs.readmore.short.classList.add('hidden');
    };

    /**
     * Readmore close
     * @private
     */
    const eventHandler_BtnReadmoreClose = function (event) {
        settings.refs.readmore.long.classList.add('hidden');
        settings.refs.readmore.short.classList.remove('hidden');
    };

    /**
     * On window scroll and resize, only run events at a rate of 15fps for better performance
     * @private
     * @param  {Function} eventTimeout Timeout function
     * @param  {Object} settings
     */
    const eventThrottler = function () {
        if (!eventTimeout) {
            eventTimeout = setTimeout(function () {
                eventTimeout = null;
                actualMethod(settings);
            }, 66);
        }
    };

    /**
     * Return class prefix
     * @private
     * @param  {String/Array} className
     */
    const classPrefix = function (className) {
        if (className instanceof Array) {
            className.forEach(function (item, i) {
                className[i] = `${pluginClassPrefix}__${className[i]}`;
            });
            console.log(className);

            return formatClasses(className);
        } else if (typeof className === 'string') {
            return `${pluginClassPrefix}__${className}`;
        }

        return '';
    };

    /**
     * Format an array of classes to a string
     * @private
     * @param  {Array} classes
     */
    const formatClasses = function (classes) {
        if (classes instanceof Array) {
            let classes_string = '';
            classes.forEach(function (item, i) {
                classes_string += item;
                classes_string += i < classes.length - 1 ? ' ' : '';
            });

            return classes_string;
        } else if (typeof classes === 'string') {
            return classes;
        }

        return '';
    };

    /**
     * Return promo literal value
     * @private
     * @param  {String} section
     */
    const formatText = function (section) {
        let formatted = '';

        switch (section) {
            case 'promo':
                formatted = `${settings.data.promo.value}${settings.data.promo.suffix} ${settings.text.promo}`;
                break;
        }

        return formatted;
    };

    /**
     * Remove all input errors
     * @private
     */
    const inputErrorsReset = function () {
        settings.refs.inputs.fields.forEach(function(item) {
            item.classList.remove(...[classPrefix('wrong'), classPrefix('right')]);
        });
        settings.refs.errors.forEach(function(item) {
            item.remove();
        });
        settings.refs.errors = [];
    };

    /**
     * Add error message to the input
     * @private
     * @param {JSON}  fieldData
     * @param errorMsg
     */
    const inputErrorsAdd = function (fieldData, errorMsg) {
        const txtError = document.createElement('p');
        txtError.classList.add(...[classPrefix('tx-error'), 'animated', 'appear']);
        txtError.innerHTML = typeof errorMsg === 'undefined' ? fieldData.text.invalid : errorMsg;

        if(typeof fieldData !== 'undefined' && fieldData !== null) {
            const refEl = settings.refs.inputs.fields[fieldData.refId];
            refEl.classList.add(classPrefix('wrong'));
            insertAfter(txtError, refEl);
        } else {
            insertAfter(txtError, settings.refs.form);
        }

        settings.refs.errors.push(txtError);
    };

    /**
     * Set cookie
     * @private
     * @param  {String} name
     * @param  {String} value
     * @param  {String} days
     */
    const setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    /**
     * Return cookie value or null
     * @private
     * @param  {String} name
     */
    const getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    /**
     * Invalidate a cookie
     * @private
     * @param  {String} name
     */
    const eraseCookie = function (name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    };

    /**
     * Insert a new node after a given node
     * @private
     * @param  newNode
     * @param  referenceNode
     */
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    /**
     * Validate inputs
     * @private
     */
    const validateInputs = function (value, regExp_raw) {
        let response = {valid: true};

        if (typeof regExp_raw === 'string') {
            const regExp = new RegExp(regExp_raw);
            if (regExp.test(value)) {
                response.valid = true;
            } else {
                response.valid = false;
            }
        } else if (regExp_raw instanceof Array) {
            response.valid = true;
            regExp_raw.forEach(function (item, i) {
                const regExp = new RegExp(item);
                if (regExp.test(value)) {
                } else {
                    response.valid = false;
                }
            });
        }

        return response;
    };

    /**
     * Set input state
     * @private
     */
    const setInputState = function (state, ele) {
        switch (state) {
            case true:
                ele.classList.remove(classPrefix('wrong'));
                break;
            case false:
                ele.classList.add(classPrefix('wrong'));
                break;
        }
    };

    /* =============== PUBLIC FUNCTIONS =============== */

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    Couppy.init = function (options) {
        // feature test
        if (!supports) return;

        // Destroy any existing initializations
        Couppy.destroy();

        // Merge user options with defaults
        settings = mergeDeep(defaults, options || {});
        // Merge field and agreement templates with those from settings
        Couppy.initFieldTemplates();

        // Add class to HTML element to activate conditional CSS
        document.documentElement.classList.add(settings.initClass);

        Couppy.renderHtml(settings.appearance.style);
        settings.state.open ? Couppy.open({callCallback: false}) : Couppy.close({callCallback: false});
        Couppy.popupTriggerToggle(settings.state.popupTriggerActive);

        // Listen for events -----------------
        settings.refs.overlay.addEventListener('click', eventHandler_Close, false);
        settings.refs.popup.addEventListener('click', eventHandler_Popup, false);
        settings.refs.btn.close.addEventListener('click', eventHandler_Close, false);
        document.addEventListener('keydown', eventHandler_Keydown, false);
        document.addEventListener('mouseout', eventHandler_Mouseout, false); // Check if mouse leaves the document
        switch (settings.appearance.style) {
            case 1:
                settings.refs.btn.copy.addEventListener('click', eventHandler_CopyCode, false);
                break;
            case 2:
                console.log(settings.refs);
                settings.refs.inputs.fields.forEach(function (item) {
                    item.addEventListener('blur', eventHandler_InputBlur, false);
                    // todo: change these event listeners to oninput (which doesn't fire because of formatter.js)
                    item.addEventListener('input', eventHandler_InputOnInput, false);
                    item.addEventListener('keypress', eventHandler_InputOnInput, false);
                    item.addEventListener('keyup', eventHandler_InputOnInput, false);
                    item.addEventListener('paste', eventHandler_InputOnInput, false);
                });
                settings.refs.form.addEventListener('submit', eventHandler_FormSubmit, false);
                // settings.refs.btn.submit.addEventListener('click', eventHandler_BtnSubmit, false);
                settings.refs.btn.readmore.open.addEventListener('click', eventHandler_BtnReadmoreOpen, false);
                settings.refs.btn.readmore.close.addEventListener('click', eventHandler_BtnReadmoreClose, false);
                break;
        }
        settings.refs.popupTrigger.addEventListener('click', eventHandler_PopupTrigger, false);

        // Init custom scripts
        if (typeof window.Formatter !== 'undefined') {
            // todo: uncomment after fixing oninput event handler bug (doesn't fire with formatter.js)
            settings.inputs.fields.forEach(function (item) {
                new Formatter(settings.refs.inputs.fields[item.refId], {
                    'pattern': item.pattern,
                    'patterns': item.patterns,
                    'persistent': false
                });
            });
        }

        console.log(settings);

        // On Init callback -----------------
        if (typeof settings.callbackOnInit === 'function') {
            settings.callbackOnInit.call(this);
        }
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    Couppy.destroy = function () {

        // If plugin isn't already initialized, stop
        if (!settings) return;

        // Remove init class for conditional CSS
        document.documentElement.classList.remove(settings.initClass);

        // @todo Undo any other init functions...

        // Remove event listeners
        settings.refs.overlay.removeEventListener('click', eventHandler, false);
        settings.refs.popup.removeEventListener('click', eventHandler_Close, false);
        settings.refs.btn.close.removeEventListener('click', eventHandler_Popup, false);
        document.removeEventListener('keydown', eventHandler_Keydown, false);
        document.removeEventListener('mouseout', eventHandler_Mouseout, false);
        switch (settings.appearance.style) {
            case 1:
                settings.refs.btn.copy.removeEventListener('click', eventHandler_CopyCode, false);
                break;
            case 2:
                settings.refs.inputs.fields.forEach(function (item) {
                    item.removeEventListener('blur', eventHandler_InputBlur, false);
                    item.removeEventListener('input', eventHandler_InputOnInput, false);
                    item.removeEventListener('keypress', eventHandler_InputOnInput, false);
                    item.removeEventListener('keyup', eventHandler_InputOnInput, false);
                    item.removeEventListener('paste', eventHandler_InputOnInput, false);
                });
                settings.refs.form.removeEventListener('submit', eventHandler_FormSubmit, false);
                // settings.refs.btn.submit.removeEventListener('click', eventHandler_BtnSubmit, false);
                settings.refs.btn.readmore.open.removeEventListener('click', eventHandler_BtnReadmoreOpen, false);
                settings.refs.btn.readmore.close.removeEventListener('click', eventHandler_BtnReadmoreClose, false);
                break;
        }
        settings.refs.popupTrigger.removeEventListener('click', eventHandler_PopupTrigger, false);

        // Remove HTML
        settings.refs.main.remove();

        // Reset variables
        settings = null;
        eventTimeout = null;
    };

    /**
     * Open popup
     * @public
     * @param options
     */
    Couppy.open = function (options) {
        const conf = mergeDeep({
            callCallback: true
        }, options || {});

        settings.refs.overlay.classList.remove('hidden');
        settings.state.open = true;

        clearTimeout(settings.state.submitTimeout); // Thank you card visibility timeout (after successful data send)
        Couppy.reset({clearErrors: true});

        if(conf.callCallback) {
            // On Open callback
            if (typeof settings.callbackOnOpen === 'function') {
                settings.callbackOnOpen.call(this);
            }
        }
    };

    /**
     * Close popup
     * @public
     * @param options
     */
    Couppy.close = function (options) {
        const conf = mergeDeep({
            callCallback: true
        }, options || {});

        settings.refs.overlay.classList.add('hidden');
        settings.state.open = false;

        if(conf.callCallback) {
            // On Close callback
            if (typeof settings.callbackOnClose === 'function') {
                settings.callbackOnClose.call(this);
            }
        }
    };

    /**
     * Toggle card visibility
     * @public
     * @param cardId
     */
    Couppy.cardToggle = function (cardId) {
        settings.refs.card.forEach(function (item, i) {
            settings.refs.card[i].classList.add(classPrefix('card--hidden'));
        });
        if (typeof settings.refs.card[cardId] !== 'undefined') {
            settings.refs.card[cardId].classList.remove(classPrefix('card--hidden'));
        }
    };

    /**
     * Toggle popup trigger active state
     * @public
     * @param {Boolean} active
     */
    Couppy.popupTriggerToggle = function (active) {
        if(!!active) {
            settings.state.popupTriggerActive = true;
            settings.refs.popupTrigger.classList.remove('hidden');
        } else {
            settings.state.popupTriggerActive = false;
            settings.refs.popupTrigger.classList.add('hidden');
        }
    };

    /**
     * Change the active state
     * @public
     * @param {Boolean} active
     * @param options
     */
    Couppy.activeToggle = function (active, options) {
        const conf = mergeDeep({
            autoClose: true
        }, options || {});

        if(!!active) {
            settings.state.active = true;
        } else {
            settings.state.active = false;
            if(conf.autoClose) {
                Couppy.close();
            }
        }
    };

    /**
     * Reset appearance to the default state
     * @public
     */
    Couppy.reset = function (options) {
        const conf = mergeDeep({
            preserveInput: false,
            clearErrors: false
        }, options || {});

        Couppy.cardToggle(settings.state.cardActiveDefault);

        switch (settings.appearance.style) {
            case 2:
                settings.refs.btn.submit.innerHTML = settings.text.btn.default;
                eventHandler_BtnReadmoreClose();
                if (!conf.preserveInput) {
                    settings.refs.form.reset();
                }
                if (conf.clearErrors) {
                    inputErrorsReset();
                }
                break;
        }
    };

    /**
     * Set cookie
     * @public
     * @param  {String} name
     * @param  {String} value
     * @param  {String} days
     */
    Couppy.setCookie = function (name, value, days) {
        setCookie(name, value, days);
    };

    /**
     * Return cookie value or null
     * @public
     * @param  {String} name
     */
    Couppy.getCookie = function (name) {
        return getCookie(name);
    };

    /**
     * Invalidate a cookie
     * @public
     * @param  {String} name
     */
    Couppy.eraseCookie = function (name) {
        eraseCookie(name);
    };

    /* =============== PRIVATE FUNCTIONS / HELPERS =============== */

    /**
     * Set default values for fields
     * @private
     */
    Couppy.initFieldTemplates = function () {
        settings.inputs.fields.forEach(function (item, i) {
            settings.inputs.fields[i] = mergeDeep({
                attributes: {
                    id: classPrefix(`field-${i}`),
                    name: classPrefix(`field-${i}`),
                    type: 'tel',
                    value: '',
                    placeholder: '000-000-000',
                    title: 'Input field',
                    required: true
                },
                regex: ["(?<!\\w)(\\(?(\\+|00)?48\\)?)?[ -]?\\d{3}[ -]?\\d{3}[ -]?\\d{3}(?!\\w)"],
                text: {
                    invalid: settings.text.inputs.invalid
                }
            }, settings.inputs.fields[i] || {});
        });
        settings.inputs.agreements.forEach(function (item, i) {
            settings.inputs.fields[i] = mergeDeep({
                attributes: {
                    id: classPrefix(`agreement-${i}`),
                    name: classPrefix(`agreement-${i}`),
                    type: 'checkbox',
                    checked: false,
                    title: 'Agreement',
                    required: false
                },
                text: {
                    invalid: settings.text.inputs.invalid
                }
            }, settings.inputs.agreements[i] || {});
        });
    };

    /**
     * Render card html
     * @private
     * @param {String} style ID of card style to use
     */
    Couppy.renderHtml = function (style) {
        switch (style) {
            case 1:
                Couppy.renderHtml_Style1();
                break;
            case 2:
                Couppy.renderHtml_Style2();
                break;
            default:
                break;
        }

        Couppy.renderHtml_TriggerButton();

        // Set active card visible, and hide others
        Couppy.cardToggle(settings.state.cardActive);
    };

    /**
     * Render trigger button
     * Call after the renderHtml of a chosen style
     * @private
     */
    Couppy.renderHtml_TriggerButton = function () {
        const popupTrigger = document.createElement('div');
        popupTrigger.classList.add(...[classPrefix('popup-trigger')].concat(settings.appearance.popupTrigger.classList));
        settings.refs.popupTrigger = settings.refs.main.appendChild(popupTrigger);

        /**
         * Render HTML trigger button body
         * @private
         */
        const templateHtml_Overlay = function () {
            const htmlTemplate = `
            <div class="${classPrefix('popup-trigger__body')}">
                <div class="${classPrefix('popup-trigger__body__section')}">
                    <p>${settings.text.popupTrigger.first}</p>
                </div>
                <div class="${classPrefix('popup-trigger__body__section')}">
                    <p>${settings.text.popupTrigger.second}</p>
                </div>
            </div>
            `;
            return htmlTemplate;
        };

        // Popup trigger body
        popupTrigger.innerHTML = templateHtml_Overlay();
    };

    /**
     * Render card style 1 - promo code
     * @private
     */
    Couppy.renderHtml_Style1 = function () {
        const body = document.getElementsByTagName('body')[0];
        const main = document.createElement('div');
        main.classList.add(...[pluginClassPrefix, `couppy-${settings.appearance.style}`].concat(settings.appearance.main.classList)); // add multiple classes using spread syntax
        settings.refs.main = body.appendChild(main);

        /* ============== */

        /**
         * Render HTML overlay
         * @private
         */
        const templateHtml_Overlay = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup container
         * @private
         */
        const templateHtml_PopupContainer = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup
         * @private
         */
        const templateHtml_Popup = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML card
         * @private
         */
        const templateHtml_Card = function () {
            const htmlTemplate = `
            <div class="${classPrefix('c-body')}">
                <h1 class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-bold')])}">${settings.text.title}</h1>
                <p class="${classPrefix('tx-title')}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">${formatText('promo')}</span></p>
                <p class="${classPrefix('tx-code')}">${settings.data.promo.coupon}</p>
                <p class="${classPrefix('tx-subtext')}"><span class="${classPrefix('btn-copy')}" role="button"><i class="far fa-copy"></i></span>${settings.text.subtext}</p>
            </div>
            
            <div class="${classPrefix('c-footer')}">
                <p><a href="${settings.text.link.target}" class="${classPrefix('tx-link')}">${settings.text.link.text} <i class="fas fa-arrow-right"></i></a></p>
            </div>
           `;
            return htmlTemplate;
        };

        /**
         * Render HTML close button
         * @private
         */
        const templateHtml_BtnClose = function () {
            const htmlTemplate = `
            <i class="fas fa-times"></i>
            `;
            return htmlTemplate;
        };

        /* ============== */

        // Render overlay
        const couppyOverlay = document.createElement('div');
        couppyOverlay.classList.add(...[classPrefix('overlay')].concat(settings.appearance.overlay.classList)); // add multiple classes using spread syntax
        couppyOverlay.innerHTML = templateHtml_Overlay();
        settings.refs.overlay = main.appendChild(couppyOverlay);

        // Render popup container
        const couppyPopupContainer = document.createElement('div');
        couppyPopupContainer.classList.add(...[classPrefix('popup-container')].concat(settings.appearance.popupContainer.classList)); // add multiple classes using spread syntax
        couppyPopupContainer.innerHTML = templateHtml_PopupContainer();
        settings.refs.popupContainer = couppyOverlay.appendChild(couppyPopupContainer);

        // Render popup
        const couppyPopup = document.createElement('div');
        couppyPopup.classList.add(...[classPrefix('popup')].concat(settings.appearance.popup.classList)); // add multiple classes using spread syntax
        couppyPopup.innerHTML = templateHtml_Popup();
        settings.refs.popup = couppyPopupContainer.appendChild(couppyPopup);

        // Render Close Button
        const couppyBtnClose = document.createElement('span');
        couppyBtnClose.classList.add(classPrefix('btn-close'));
        couppyBtnClose.setAttribute("role", "button");
        couppyBtnClose.innerHTML = templateHtml_BtnClose();
        settings.refs.btn.close = couppyPopup.appendChild(couppyBtnClose);

        // Render card
        const couppyCard = document.createElement('div');
        couppyCard.classList.add(...[classPrefix('card')].concat(settings.appearance.card[0].classList)); // add multiple classes using spread syntax
        couppyCard.innerHTML = templateHtml_Card();
        settings.refs.card[0] = couppyPopup.appendChild(couppyCard);

        // Copy Code Button
        settings.refs.btn.copy = couppyCard.querySelector('.' + classPrefix('btn-copy'));
    };

    /**
     * Render card style 2 - phone form
     * @private
     */
    Couppy.renderHtml_Style2 = function () {
        const body = document.getElementsByTagName('body')[0];
        const main = document.createElement('div');
        main.classList.add(...[pluginClassPrefix, `couppy-${settings.appearance.style}`].concat(settings.appearance.main.classList)); // add multiple classes using spread syntax
        settings.refs.main = body.appendChild(main);

        /* ============== */

        /**
         * Render HTML overlay
         * @private
         */
        const templateHtml_Overlay = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup container
         * @private
         */
        const templateHtml_PopupContainer = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup
         * @private
         */
        const templateHtml_Popup = function () {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML card
         * @private
         */
        const templateHtml_Card = function () {
            const htmlTemplate = `
            <div class="${classPrefix('c-body')}">
                <h1 class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-bold')])}">${settings.text.title}</h1>
                <p class="${classPrefix('tx-title')}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">${formatText('promo')}</span></p>
                <form class="${classPrefix('form')}" novalidate></form>
            </div>
            
            <div class="${classPrefix('c-footer')}">
                <div class="${formatClasses([classPrefix('readmore'), 'animated', 'emerge', 'hidden'])}">
                    <p>${settings.text.footerText.long} <a class="${classPrefix('btn-readmore--close')}" href="javascript:void(0)">${settings.text.footerText.btn.less}</a></p>
                </div>
                <p class="${formatClasses([classPrefix('tx-footer-txt'), 'animated', 'emerge'])}">${settings.text.footerText.short} <a class="${classPrefix('btn-readmore')}" href="javascript:void(0)">${settings.text.footerText.btn.more}</a></p>
            </div>
           `;
            return htmlTemplate;
        };

        /**
         * Render HTML card
         * @private
         */
        const templateHtml_Card2 = function () {
            const htmlTemplate = `
            <div class="${classPrefix('c-body')}">
                <p class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-highlight'), classPrefix('sp-bold')])}">${settings.text.thankYou.top}</p>
                <p class="${classPrefix('tx-title')}">${settings.text.thankYou.bottom}</p>
            </div>
           `;
            return htmlTemplate;
        };

        /**
         * Render HTML close button
         * @private
         */
        const templateHtml_BtnClose = function () {
            const htmlTemplate = `
            <i class="fas fa-times"></i>
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML submit button
         * @private
         */
        const templateHtml_BtnSubmit = function () {
            const htmlTemplate = `
            ${settings.text.btn.default}
            `;
            return htmlTemplate;
        };

        /* ============== */

        // Render overlay
        const couppyOverlay = document.createElement('div');
        couppyOverlay.classList.add(...[classPrefix('overlay')].concat(settings.appearance.overlay.classList)); // add multiple classes using spread syntax
        couppyOverlay.innerHTML = templateHtml_Overlay();
        settings.refs.overlay = main.appendChild(couppyOverlay);

        // Render popup container
        const couppyPopupContainer = document.createElement('div');
        couppyPopupContainer.classList.add(...[classPrefix('popup-container')].concat(settings.appearance.popupContainer.classList)); // add multiple classes using spread syntax
        couppyPopupContainer.innerHTML = templateHtml_PopupContainer();
        settings.refs.popupContainer = couppyOverlay.appendChild(couppyPopupContainer);

        // Render popup
        const couppyPopup = document.createElement('div');
        couppyPopup.classList.add(...[classPrefix('popup')].concat(settings.appearance.popup.classList)); // add multiple classes using spread syntax
        couppyPopup.innerHTML = templateHtml_Popup();
        settings.refs.popup = couppyPopupContainer.appendChild(couppyPopup);

        // Render Close Button
        const couppyBtnClose = document.createElement('span');
        couppyBtnClose.classList.add(classPrefix('btn-close'));
        couppyBtnClose.setAttribute("role", "button");
        couppyBtnClose.innerHTML = templateHtml_BtnClose();
        settings.refs.btn.close = couppyPopup.appendChild(couppyBtnClose);

        // Render Logo
        const couppyImgLogo = document.createElement('img');
        couppyImgLogo.classList.add(classPrefix('img-logo'));
        couppyImgLogo.setAttribute("src", settings.appearance.logo.url);
        couppyImgLogo.setAttribute("alt", settings.appearance.logo.alt);
        settings.refs.img.logo = couppyPopup.appendChild(couppyImgLogo);

        // Render card
        const couppyCard = document.createElement('div');
        couppyCard.classList.add(...[classPrefix('card')].concat(settings.appearance.card[0].classList)); // add multiple classes using spread syntax
        couppyCard.innerHTML = templateHtml_Card();
        settings.refs.card[0] = couppyPopup.appendChild(couppyCard);

        // Render card 2
        const couppyCard2 = document.createElement('div');
        couppyCard2.classList.add(...[classPrefix('card')].concat(settings.appearance.card[1].classList)); // add multiple classes using spread syntax
        couppyCard2.innerHTML = templateHtml_Card2();
        settings.refs.card[1] = couppyPopup.appendChild(couppyCard2);

        // Form
        settings.refs.form = couppyCard.querySelector('.' + classPrefix('form'));

        // Render Form elements - fields, agreements and submit button
        settings.inputs.fields.forEach(function (item, i) {
            const field = document.createElement('input');
            field.classList.add(...[classPrefix('in'), classPrefix('in--block')]);
            field.setAttribute('data-couppy-field-id', i.toString());
            for (const key in item.attributes) {
                if (item.attributes.hasOwnProperty(key)) {
                    field.setAttribute(key, item.attributes[key]);
                }
            }
            settings.refs.inputs.fields.push(settings.refs.form.appendChild(field));
            settings.inputs.fields[i].refId = settings.refs.inputs.fields.length - 1;
        });

        // Form - Submit button
        const couppyBtnSubmit = document.createElement('button');
        couppyBtnSubmit.classList.add(...[classPrefix('btn-submit'), classPrefix('btn-submit--block')]);
        couppyBtnSubmit.setAttribute("type", "submit");
        couppyBtnSubmit.innerHTML = templateHtml_BtnSubmit();
        settings.refs.btn.submit = settings.refs.form.appendChild(couppyBtnSubmit);

        // Button readmore
        settings.refs.btn.readmore.open = couppyCard.querySelector('.' + classPrefix('btn-readmore'));
        settings.refs.btn.readmore.close = couppyCard.querySelector('.' + classPrefix('btn-readmore--close'));

        // Readmore
        settings.refs.readmore.short = couppyCard.querySelector('.' + classPrefix('tx-footer-txt'));
        settings.refs.readmore.long = couppyCard.querySelector('.' + classPrefix('readmore'));
    };


    //
    // Public APIs
    //

    return Couppy;

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4]);
