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
            popupTrigger: 'Coupon for you',
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
        var top = event.pageY;

        if (top < document.documentElement.scrollTop + 10) {
            console.log("Mouse out of document bounds (top)");
            Couppy.open();
        }
    };

    /**
     * Mouseout event (any side)
     * @private
     */
    const eventHandler_Mouseout2 = function (event) {
        var top = event.pageY;
        var right = document.documentElement.clientWidth - event.pageX;
        var bottom = document.documentElement.clientHeight - event.pageY;
        var left = event.pageX;

        if (top < document.documentElement.scrollTop + 10 || right < 20 || left < 20) {
            console.log("Mouse out of document bounds");
            Couppy.open();
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

            axios({
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
                    inputErrorsAdd(null, 'SMS API error');
                    return Promise.reject('SMS API error');
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
        settings.state.open ? Couppy.open() : Couppy.close();
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
     */
    Couppy.open = function () {
        if (!settings.state.open) {
            settings.refs.overlay.classList.remove('hidden');
            settings.state.open = true;

            clearTimeout(settings.state.submitTimeout);
            Couppy.reset();

            // On Open callback
            if (typeof settings.callbackOnOpen === 'function') {
                settings.callbackOnOpen.call(this);
            }
        }
    };

    /**
     * Close popup
     * @public
     */
    Couppy.close = function () {
        if (settings.state.open) {
            settings.refs.overlay.classList.add('hidden');
            settings.state.open = false;

            // On Close callback
            if (typeof settings.callbackOnClose === 'function') {
                settings.callbackOnClose.call(this);
            }
        }
    };

    /**
     * Toggle card visibility
     * @public
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
     * Toggle card visibility
     * @public
     */
    Couppy.popupTriggerToggle = function (active) {
        if(active) {
            settings.refs.popupTrigger.classList.remove('hidden');
        } else {
            settings.refs.popupTrigger.classList.add('hidden');
        }
    };

    /**
     * Reset appearance to the default state
     * @public
     */
    Couppy.reset = function (options) {
        const conf = mergeDeep({
            preserveInput: false
        }, options || {});

        if (!conf.preserveInput) {
            settings.refs.form.reset();
        }

        Couppy.cardToggle(settings.state.cardActiveDefault);
        switch (settings.appearance.style) {
            case 2:
                settings.refs.btn.submit.innerHTML = settings.text.btn.default;
                break;
        }
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
                <p>${settings.text.popupTrigger}</p>
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
                <h1 class="${classPrefix('tx-title')}">${settings.text.title}</h1>
                <p class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-highlight')])}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">${formatText('promo')}</span></p>
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
                <h1 class="${classPrefix('tx-title')}">${settings.text.title}</h1>
                <p class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-highlight')])}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">${formatText('promo')}</span></p>
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
                <p class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-highlight')])}">${settings.text.thankYou.top}</p>
                <p class="${formatClasses([classPrefix('tx-title')])}">${settings.text.thankYou.bottom}</p>
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