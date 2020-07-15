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
            popupTriggerActive: true,
            timerActive: false,
	        timerSuspended: false,
            timerInterval: null
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
            },
            pwdBy: {
                url: '',
                img: {
                    url: '',
                    alt: ''
                }
            },
            images: {
                title: {title: '', url: ''}
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
            },
            timer: {
                value: 300, // in seconds
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
            timer: {
                title: 'Our offer will be valid for 5 minutes only!'
            },
            api: {
                error: 'API error'
            },
            paragraphs: [

            ]
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
                pwdBy: null,
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
                agreements: [],
            },
            errors: [],
            readmore: {
                short: null,
                long: null
            },
            timer: null,
            pwdBy: null
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
        callbackOnTimerTick: function () {
        },
        callbackOnTimerUp: function () {
        }
    };

    //
    // Helpers
    //
    Couppy.Helpers = require('./modules/helpers.js');

    //
    // Methods
    //

    //
    // Event Handlers
    //

    /**
     * Handle events
     * @private
     */
    const eventHandler = function (event) {
        const toggle = event.target;
        const closest = Couppy.Helpers.getClosest(toggle, '[data-some-selector]');
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
        Couppy.Helpers.copyToClipboard(settings.data.promo.coupon);
        console.log('Copied ' + settings.data.promo.coupon + ' to clipboard');
    };

    /**
     * Mouseout event
     * @private
     */
    const eventHandler_Mouseout = function (event) {
        if (settings.state.active) {
            const top = event.pageY;

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
        if (settings.state.active) {
            const top = event.pageY;
            const right = document.documentElement.clientWidth - event.pageX;
            const bottom = document.documentElement.clientHeight - event.pageY;
            const left = event.pageX;

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
        const fieldData = settings.inputs.fields[event.target.dataset['couppyFieldId']];
        event.target.classList.remove(classPrefix('wrong'));
        inputErrorsRemove(fieldData);
    };

    /**
     * Input on input
     * @private
     */
    const eventHandler_InputOnInput = function (event) {
        const fieldData = settings.inputs.fields[event.target.dataset['couppyFieldId']];
        inputErrorsRemove(fieldData);
        if (validateInputs(event.target.value, fieldData.regex).valid) {
            setInputState(true, event.target);
        } else {
            setInputState(false, event.target);
        }
    };

    /**
     * Agreement change
     * @private
     */
    const eventHandler_AgreementChange = function (event) {
        const fieldData = settings.inputs.agreements[event.target.dataset['couppyAgreementId']];
        event.target.classList.remove(classPrefix('wrong'));
        inputErrorsRemove(fieldData, true);
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
            if (item.attributes.required) {
                const refEl = settings.refs.inputs.fields[item.refId];
                const result = validateInputs(refEl.input.value, item.regex, false);
                if (!result.valid) {
                    validationResponseFields.valid = false;
                    validationResponseFields.invalidElements.push(item);
                }
            }
        });
        settings.inputs.agreements.forEach(function (item, i) {
            if (item.attributes.required) {
                const refEl = settings.refs.inputs.agreements[item.refId];
                const result = validateInputs(refEl.input.checked, null, true);
                if (!result.valid) {
                    validationResponseAgreements.valid = false;
                    validationResponseAgreements.invalidElements.push(item);
                }
            }
        });
        validationResponseFields.valid ? console.log('%c Validation successful (fields)', 'color: #00ff00') : console.log('%c Validation failed (fields)', 'color: #ff0000');
        validationResponseAgreements.valid ? console.log('%c Validation successful (agreements)', 'color: #00ff00') : console.log('%c Validation failed (agreements)', 'color: #ff0000');

        inputErrorsReset(); // Remove input errors

        if (validationResponseFields.valid && validationResponseAgreements.valid) {
            settings.refs.btn.submit.innerHTML = settings.text.btn.sending;

            let params = {};
            let data = {};
            let formData = {};
            for (const [key, value] of new FormData(settings.refs.form).entries()) {
                let valueFormatted = value.replace(/-|\s/g, '');
                formData[key] = valueFormatted;
            }
            switch (settings.data.api.method.toLowerCase()) {
                case 'get':
                    params = Couppy.Helpers.mergeDeep(formData, settings.data.api.params);
                    break;
                case 'post':
                    data = Couppy.Helpers.mergeDeep(formData, settings.data.api.data);
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
                        Couppy.reset({suspendTimer: true, closePopup: true});
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
                inputErrorsAdd(item, undefined, false);
            });
            validationResponseAgreements.invalidElements.forEach(function (item) {
                inputErrorsAdd(item, undefined, true);
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
     * Agreement Readmore open
     * @private
     */
    const eventHandler_BtnAgreementReadmoreOpen = function (event) {
        settings.refs.inputs.agreements[event.currentTarget.dataset['couppyAgreementId']].div.classList.remove('hidden');
    };

    /**
     * Agreement Readmore close
     * @private
     */
    const eventHandler_BtnAgreementReadmoreClose = function (event) {
        settings.refs.inputs.agreements[event.currentTarget.dataset['couppyAgreementId']].div.classList.add('hidden');
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
        settings.refs.inputs.fields.forEach(function (item) {
            item.input.classList.remove(...[classPrefix('wrong'), classPrefix('right')]);
            if (item.error) {
                item.error.remove();
            }
        });
        settings.refs.inputs.agreements.forEach(function (item) {
            item.input.classList.remove(...[classPrefix('wrong'), classPrefix('right')]);
            if (item.error) {
                item.error.remove();
            }
        });
        settings.refs.errors.forEach(function (item) {
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
    const inputErrorsAdd = function (fieldData, errorMsg, agreement) {
        const txtError = document.createElement('p');
        txtError.classList.add(...[classPrefix('tx-error'), 'animated', 'appear']);
        txtError.innerHTML = typeof errorMsg === 'undefined' ? fieldData.text.invalid : errorMsg;

        if (typeof fieldData !== 'undefined' && fieldData !== null) {
            let refEl;
            if (typeof (agreement) !== 'undefined' && agreement === true) {
                // if agreement
                refEl = settings.refs.inputs.agreements[fieldData.refId];
            } else {
                // if field
                refEl = settings.refs.inputs.fields[fieldData.refId];
            }
            refEl.input.classList.add(classPrefix('wrong'));
            // insertAfter(txtError, refEl.container);
            refEl.container.appendChild(txtError);
            refEl.error = txtError;
        } else {
            //insertAfter(txtError, settings.refs.form);
            settings.refs.form.appendChild(txtError);
        }

        settings.refs.errors.push(txtError);
    };

    /**
     * Remove error message
     * @private
     * @param {JSON} fieldData
     * @param {Boolean} agreement - if the input is a field or an agreement
     */
    const inputErrorsRemove = function (fieldData, agreement) {
        if (typeof fieldData !== 'undefined' && fieldData !== null) {
            let refEl;
            if (typeof agreement !== 'undefined' && agreement === true) {
                // if agreement
                refEl = settings.refs.inputs.agreements[fieldData.refId];
            } else {
                refEl = settings.refs.inputs.fields[fieldData.refId];
            }
            if (refEl.error) {
                refEl.error.remove();
            }
        }
    };

    /**
     * Set cookie
     * @private
     * @param  {String} name
     * @param  {String} value
     * @param  {String} days
     */
    const setCookie = function (name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
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
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    /**
     * Invalidate a cookie
     * @private
     * @param  {String} name
     * @param {String} cPath
     * @param {String} cDomain
     */
    const eraseCookie = function (name, cPath, cDomain) {
        // document.cookie = name + '=; Max-Age=-99999999;';

        document.cookie = encodeURIComponent(name) +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (cDomain ? "; domain=" + cDomain : "") +
            (cPath ? "; path=" + cPath : "");
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
    const validateInputs = function (value, regExp_raw, agreement) {
        let response = {valid: true};

        if (typeof (agreement) !== 'undefined' && agreement === true) {
            response.valid = value;
        } else {
            if (typeof regExp_raw === 'string') {
                try {
                    const regExp = new RegExp(regExp_raw);
                    if (regExp.test(value)) {
                        response.valid = true;
                    } else {
                        response.valid = false;
                    }
                } catch (e) {
                    console.log('%c Regex invalid', 'color: #ff0000');
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
        settings = Couppy.Helpers.mergeDeep(defaults, options || {});
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
                settings.refs.inputs.fields.forEach(function (item) {
                    item.input.addEventListener('blur', eventHandler_InputBlur, false);
                    // todo: change these event listeners to oninput (which doesn't fire because of formatter.js)
                    item.input.addEventListener('input', eventHandler_InputOnInput, false);
                    item.input.addEventListener('keypress', eventHandler_InputOnInput, false);
                    item.input.addEventListener('keyup', eventHandler_InputOnInput, false);
                    item.input.addEventListener('paste', eventHandler_InputOnInput, false);
                });
                settings.refs.inputs.agreements.forEach(function (item) {
                    item.input.addEventListener('change', eventHandler_AgreementChange, false);
                });
                settings.refs.form.addEventListener('submit', eventHandler_FormSubmit, false);
                // settings.refs.btn.submit.addEventListener('click', eventHandler_BtnSubmit, false);
                settings.refs.btn.readmore.open.addEventListener('click', eventHandler_BtnReadmoreOpen, false);
                settings.refs.btn.readmore.close.addEventListener('click', eventHandler_BtnReadmoreClose, false);
                // agreements readmore
                settings.refs.inputs.agreements.forEach(function (item, i) {
                    item.btn_readmore.addEventListener('click', eventHandler_BtnAgreementReadmoreOpen, false);
                    item.btn_readless.addEventListener('click', eventHandler_BtnAgreementReadmoreClose, false);
                });
                // interval for timer
                Couppy.timerToggle(settings.state.timerActive);
                break;
            case 3:
                break;
        }
        settings.refs.popupTrigger.addEventListener('click', eventHandler_PopupTrigger, false);

        // Init custom scripts
        if (typeof window.Formatter !== 'undefined') {
            // todo: uncomment after fixing oninput event handler bug (doesn't fire with formatter.js)
            settings.inputs.fields.forEach(function (item) {
                if (typeof item.pattern !== 'undefined') {
                    new Formatter(settings.refs.inputs.fields[item.refId].input, {
                        'pattern': item.pattern,
                        'patterns': item.patterns,
                        'persistent': false
                    });
                }
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
                    item.input.removeEventListener('blur', eventHandler_InputBlur, false);
                    item.input.removeEventListener('input', eventHandler_InputOnInput, false);
                    item.input.removeEventListener('keypress', eventHandler_InputOnInput, false);
                    item.input.removeEventListener('keyup', eventHandler_InputOnInput, false);
                    item.input.removeEventListener('paste', eventHandler_InputOnInput, false);
                });
                settings.refs.inputs.agreements.forEach(function (item) {
                    item.input.removeEventListener('change', eventHandler_AgreementChange, false);
                });
                settings.refs.form.removeEventListener('submit', eventHandler_FormSubmit, false);
                // settings.refs.btn.submit.removeEventListener('click', eventHandler_BtnSubmit, false);
                settings.refs.btn.readmore.open.removeEventListener('click', eventHandler_BtnReadmoreOpen, false);
                settings.refs.btn.readmore.close.removeEventListener('click', eventHandler_BtnReadmoreClose, false);
                // agreements readmore
                settings.refs.inputs.agreements.forEach(function (item, i) {
                    item.btn_readmore.removeEventListener('click', eventHandler_BtnAgreementReadmoreOpen, false);
                    item.btn_readless.removeEventListener('click', eventHandler_BtnAgreementReadmoreClose, false);
                });
                // destroy timer
                Couppy.timerToggle(false);
                break;
            case 3:
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
        const conf = Couppy.Helpers.mergeDeep({
            callCallback: true
        }, options || {});

        document.documentElement.classList.add(classPrefix('overlay-hidden'));
        settings.refs.overlay.classList.remove('hidden');
        settings.state.open = true;

        clearTimeout(settings.state.submitTimeout); // Thank you card visibility timeout (after successful data send)
        Couppy.reset({clearErrors: true});

        if (conf.callCallback) {
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
        const conf = Couppy.Helpers.mergeDeep({
            callCallback: true
        }, options || {});

        document.documentElement.classList.remove(classPrefix('overlay-hidden'));
        settings.refs.overlay.classList.add('hidden');
        settings.state.open = false;

        if (conf.callCallback) {
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
        if (!!active) {
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
        const conf = Couppy.Helpers.mergeDeep({
            autoClose: true
        }, options || {});

        if (!!active) {
            settings.state.active = true;
        } else {
            settings.state.active = false;
            if (conf.autoClose) {
                Couppy.close();
            }
        }
    };

    /**
     * Reset appearance to the default state
     * @public
     */
    Couppy.reset = function (options) {
        const conf = Couppy.Helpers.mergeDeep({
            preserveInput: false,
            clearErrors: false,
	        suspendTimer: false,
            closePopup: false,
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
	            if (conf.suspendTimer) {
		            Couppy.timerSuspend(true);
	            }
                if (conf.closePopup) {
                    Couppy.close();
                }
                break;
        }
    };

    /**
     * Refresh timer HTML according to current timer value
     * @public
     * @returns {string} Returns html to be injected into timer element
     */
    Couppy.refreshTimerHTML = function () {
        const timerMinutes = Math.floor(settings.data.timer.value / 60); // get minutes from seconds
        const timerSeconds = settings.data.timer.value - timerMinutes * 60; // get remaining seconds
        let secondsFirstDigit = 0, secondsLastDigit = 0;
        if (timerSeconds !== 0) {
            // first digit
            const digits = Math.floor(Math.log10(timerSeconds));
            // if single digit number, the first digit is 0
            if (digits === 0) {
                secondsFirstDigit = 0;
                secondsLastDigit = Math.floor(timerSeconds / Math.pow(10, digits));
            } else {
                secondsFirstDigit = Math.floor(timerSeconds / Math.pow(10, digits));
                // last digit
                const l = Math.pow(10, Math.floor(Math.log(timerSeconds) / Math.log(10)) - 1);
                const b = Math.floor(timerSeconds / l);
                secondsLastDigit = b - Math.floor(b / 10) * 10;
            }
        }

        const timerHTML = `
        <span class="${classPrefix('tx-timer-box')}">${timerMinutes}</span>:<span class="${classPrefix('tx-timer-box')}">${secondsFirstDigit}</span><span class="${classPrefix('tx-timer-box')}">${secondsLastDigit}</span>
        `;

        if (typeof settings.callbackOnTimerTick === 'function') {
            settings.callbackOnTimerTick.call(this);
        }

        return timerHTML;
    };

    /**
     * Disable/enable timer
     * @public
     */
    Couppy.timerToggle = function (stateRaw) {
    	if (settings.state.timerSuspended) return;

        const state = !!stateRaw;
        if (state) {
            if (!settings.state.timerActive) {
                settings.state.timerInterval = setInterval(function () {
                    if (settings.data.timer.value > 0) {
                        settings.data.timer.value--;
                    } else {
                        clearInterval(settings.state.timerInterval);

                        if (typeof settings.callbackOnTimerUp === 'function') {
                            settings.callbackOnTimerUp.call(this);
                        }
                    }
                    settings.refs.timer.innerHTML = Couppy.refreshTimerHTML();
                }, 1000);
            }
        } else {
            clearInterval(settings.state.timerInterval);
        }

        settings.state.timerActive = state;
    };

	/**
	 * Suspend/unsuspend timer
	 * @public
	 */
	Couppy.timerSuspend = function (stateRaw) {
		const state = !!stateRaw;
		if (state) {
			Couppy.timerToggle(false);
		}

		settings.state.timerSuspended = state;
	};

    /**
     * Get time left on the timer
     * @public
     * @returns {Number} Returns the time left on the timer in seconds
     */
    Couppy.timerValue = function () {
        return typeof settings !== "undefined" ? settings.data.timer.value : null;
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
     * Set default values for fields and agreements
     * @private
     */
    Couppy.initFieldTemplates = function () {
        settings.inputs.fields.forEach(function (item, i) {
            settings.inputs.fields[i] = Couppy.Helpers.mergeDeep({
                attributes: {
                    id: classPrefix(`field-${i}`),
                    name: classPrefix(`field-${i}`),
                    type: 'text', // tel
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
            settings.inputs.agreements[i] = Couppy.Helpers.mergeDeep({
                attributes: {
                    id: classPrefix(`agreement-${i}`),
                    name: classPrefix(`agreement-${i}`),
                    type: 'checkbox',
                    value: 1,
                    // checked: false,
                    title: 'Agreement',
                    required: false
                },
                text: {
                    short: 'Agreement label',
                    long: '',
                    readmore: '',
                    readless: '',
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
            case 3:
                Couppy.renderHtml_Style3();
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
        const body = document.body; // document.getElementsByTagName('body')[0];
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
        const body = document.body; // document.getElementsByTagName('body')[0];
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
            let titleHTML = ``;
            if (settings.text.title) {
                titleHTML = `
                <h1 class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-bold')])}">${settings.text.title}</h1>
                `;
            }

            let promoHTML = ``;
            if (settings.text.promo) {
                promoHTML = `
                <p class="${classPrefix('tx-title')}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">${formatText('promo')}</span></p>
                `;
            }

            let timerHTML = ``;
            if (settings.appearance.timer) {
                timerHTML = `
                <p class="${formatClasses([classPrefix('sp-bold')])}">${settings.text.timer.title}</p>
                <p class="${classPrefix('tx-timer')}">${Couppy.refreshTimerHTML()}</p>
                `;
            }

            /* --- */

            const htmlTemplate = `
            <div class="${classPrefix('c-body')}">
                ${titleHTML}
                ${promoHTML}
                ${timerHTML}
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

        /**
         * Render powered by + logo
         * @private
         */
        const templateHtml_PoweredBy = function () {
            const htmlTemplate = `
            <p class="${classPrefix('tx-pwd-by')}">Powered by</p>
            <a href="${settings.appearance.pwdBy.url}" target="_blank" rel="nofollow"><img src="${settings.appearance.pwdBy.img.url}" class="${classPrefix('img-pwd-by')}" alt="${settings.appearance.pwdBy.img.alt}" /></a>
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
        // fields
        settings.inputs.fields.forEach(function (item, i) {
            const field_container = document.createElement('div');
            field_container.classList.add(...[classPrefix('fld'), classPrefix('fld--field')]);

            const field = document.createElement('input');
            field.classList.add(...[classPrefix('in'), classPrefix('in--block')]);
            field.setAttribute('data-couppy-field-id', i.toString());
            for (const key in item.attributes) {
                if (item.attributes.hasOwnProperty(key)) {
                    field.setAttribute(key, item.attributes[key]);
                }
            }
            field_container.appendChild(field);
            settings.refs.form.appendChild(field_container);
            settings.refs.inputs.fields.push({
                container: field_container,
                input: field,
                error: null
            });
            settings.inputs.fields[i].refId = settings.refs.inputs.fields.length - 1;
        });
        // agreements
        settings.inputs.agreements.forEach(function (item, i) {
            // container
            const field_container = document.createElement('div');
            field_container.classList.add(...[classPrefix('fld'), classPrefix('fld--agreement')]);

            // label
            const label = document.createElement('label');
            label.classList.add(...[classPrefix('label'), classPrefix('label--chk')]);
            label.setAttribute('for', classPrefix(`agreement-${i.toString()}`));

            // input
            const agreement = document.createElement('input');
            agreement.classList.add(...[classPrefix('chk')]);
            agreement.setAttribute('data-couppy-agreement-id', i.toString());
            for (const key in item.attributes) {
                if (item.attributes.hasOwnProperty(key)) {
                    agreement.setAttribute(key, item.attributes[key]);
                }
            }

            field_container.appendChild(agreement);
            field_container.appendChild(label);
            let ref = {
                container: field_container,
                input: agreement,
                error: null
            };

            if (item.text.long.length) {
                // short
                const btn_readmore = document.createElement('a');
                btn_readmore.setAttribute('href', 'javascript:void(0)');
                btn_readmore.setAttribute('class', classPrefix('btn-agreement-readmore'));
                btn_readmore.setAttribute('data-couppy-agreement-id', i.toString());
                btn_readmore.innerHTML = item.text.readmore;
                label.innerHTML = item.text.short;
                label.appendChild(btn_readmore);

                // long
                const btn_readless = document.createElement('a');
                btn_readless.setAttribute('href', 'javascript:void(0)');
                btn_readless.setAttribute('class', classPrefix('btn-agreement-readmore--close'));
                btn_readless.setAttribute('data-couppy-agreement-id', i.toString());
                btn_readless.innerHTML = item.text.readless;

                const readmore_div = document.createElement('div');
                readmore_div.classList.add(...[classPrefix('agreement-div'), 'animated', 'emerge', 'hidden']);
                const readmore = document.createElement('p');
                readmore.innerHTML = item.text.long;
                readmore.appendChild(btn_readless);
                readmore_div.appendChild(readmore);

                // refs
                field_container.appendChild(readmore_div);
                ref.div = readmore_div;
                ref.btn_readmore = btn_readmore;
                ref.btn_readless = btn_readless;
            } else {
                label.innerHTML = item.text.short;
            }

            settings.refs.form.appendChild(field_container);
            settings.refs.inputs.agreements.push(ref);
            settings.inputs.agreements[i].refId = settings.refs.inputs.agreements.length - 1;
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

        // Timer
        settings.refs.timer = couppyCard.querySelector('.' + classPrefix('tx-timer'));

        // Render Powered By
        const couppyPoweredBy = document.createElement('div');
        couppyPoweredBy.classList.add(classPrefix('pwd-by'));
        couppyPoweredBy.innerHTML = templateHtml_PoweredBy();
        settings.refs.pwdBy = couppyPopupContainer.appendChild(couppyPoweredBy);
        settings.refs.img.pwdBy = couppyPoweredBy.querySelector('.' + classPrefix('img-pwd-by'));
    };

    /**
     * Render card style 3 - warning alert
     * @private
     */
    Couppy.renderHtml_Style3 = function () {
        const body = document.body; // document.getElementsByTagName('body')[0];
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
            let titleImgHTML = `
            <img class="${formatClasses([classPrefix('img-title')])}" src="${settings.appearance.images.title.url}" alt="${settings.appearance.images.title.alt}" />
            `;

            let titleHTML = ``;
            if (settings.text.title) {
                titleHTML = `
                <h1 class="${formatClasses([classPrefix('tx-title')])}">${settings.text.title}</h1>
                `;
            }

            let paragraphsHTML = ``;
            if (settings.text.paragraphs) {
                Couppy.Helpers.forEach(settings.text.paragraphs, function(item, i) {
                    paragraphsHTML += `
                    <p class="${formatClasses([classPrefix('tx-p')])}">${item}</p>
                    `;
                });
            }

            /* --- */

            const htmlTemplate = `
            <div class="${classPrefix('c-body')}">
                ${titleImgHTML}
                ${titleHTML}
                ${paragraphsHTML}
            </div>
            
            <div class="${classPrefix('c-footer')}">
                
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
         * Render powered by + logo
         * @private
         */
        const templateHtml_PoweredBy = function () {
            const htmlTemplate = `
            <p class="${classPrefix('tx-pwd-by')}">${settings.appearance.pwdBy.text}</p>
            <a href="${settings.appearance.pwdBy.url}" target="_blank" rel="nofollow"><img src="${settings.appearance.pwdBy.img.url}" class="${classPrefix('img-pwd-by')}" alt="${settings.appearance.pwdBy.img.alt}" /></a>
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

        // Render Powered By
        const couppyPoweredBy = document.createElement('div');
        couppyPoweredBy.classList.add(classPrefix('pwd-by'));
        couppyPoweredBy.innerHTML = templateHtml_PoweredBy();
        settings.refs.pwdBy = couppyPopupContainer.appendChild(couppyPoweredBy);
        settings.refs.img.pwdBy = couppyPoweredBy.querySelector('.' + classPrefix('img-pwd-by'));
    };


    //
    // Public APIs
    //

    return Couppy;

});
