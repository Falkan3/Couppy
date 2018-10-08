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
        someVar: 123,
        initClass: 'js-Couppy',

        state: {
            active: true,
            open: false,
        },
        appearance: {
            style: 1, // card render style
            main: {
                classList: ['couppy-1']
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
            card: {
                classList: []
            }
        },
        data: {
            promo: {
                value: 5,
                suffix: '%',
                coupon: 'couponcode', // can be static or dynamically generated from API
            }
        },
        text: {
            title: 'Halloween sale', // the topmost paragraph on the card
            promo: 'off', // text after the promo "5%", for example "off" in "5% off"
            subtext: 'use the code above during the checkout', // the text just below the promo code, usually contains instructions on how to use the code
            link: {
                // link to collection or promo page
                text: 'Browse collection',
                target: '#'
            }
        },
        refs: {
            overlay: null,
            popupContainer: null,
            popup: null,
            card: null,
            btn: {
                close: null
            }
        },

        callbackOnInit: function() {
        },
        callbackBefore: function () {
        },
        callbackAfter: function () {
        },
        callbackOnOpen: function() {
        },
        callbackOnClose: function() {
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
        if(settings.state.open) {
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
        var right = document.documentElement.clientWidth - event.pageX;
        var bottom = document.documentElement.clientHeight - event.pageY;
        var left = event.pageX;

        if (top < document.documentElement.scrollTop + 10 || right < 20 || left < 20) {
            console.log("Mouse out of document bounds");
            Couppy.open();
        }
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
        if(className instanceof Array) {
            className.forEach(function(item, i) {
                className[i] = `${pluginClassPrefix}__${className[i]}`;
            });
            console.log(className);

            return formatClasses(className);
        } else if(typeof className === 'string') {
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
        if(classes instanceof Array) {
            let classes_string = '';
            classes.forEach(function(item, i) {
                classes_string += item;
                classes_string += i < classes.length - 1 ? ' ' : '';
            });

            return classes_string;
        } else if(typeof classes === 'string') {
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

        switch(section) {
            case 'promo':
                formatted = `${settings.data.promo.value}${settings.data.promo.suffix} ${settings.text.promo}`;
                break;
        }

        return formatted;
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
        settings = extend(defaults, options || {});

        // Add class to HTML element to activate conditional CSS
        document.documentElement.classList.add(settings.initClass);

        // @todo Do something...
        Couppy.renderHtml(settings.appearance.style);
        settings.state.open ? Couppy.open() : Couppy.close();

        // Listen for events -----------------
        settings.refs.overlay.addEventListener('click', eventHandler_Close, false);
        settings.refs.popup.addEventListener('click', eventHandler_Popup, false);
        settings.refs.btn.close.addEventListener('click', eventHandler_Close, false);
        settings.refs.btn.copy.addEventListener('click', eventHandler_CopyCode, false);
        document.addEventListener('keydown', eventHandler_Keydown, false);
        document.addEventListener('mouseout', eventHandler_Mouseout, false); // Check if mouse leaves the document

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
        settings.refs.btn.copy.removeEventListener('click', eventHandler_CopyCode, false);
        document.removeEventListener('keydown', eventHandler_Keydown, false);
        document.removeEventListener('mouseout', eventHandler_Mouseout, false);

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
        if(!settings.state.open) {
            settings.refs.overlay.classList.remove('hidden');
            settings.state.open = true;

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
        if(settings.state.open) {
            settings.refs.overlay.classList.add('hidden');
            settings.state.open = false;

            // On Close callback
            if (typeof settings.callbackOnClose === 'function') {
                settings.callbackOnClose.call(this);
            }
        }
    };

    /* =============== PRIVATE FUNCTIONS / HELPERS =============== */

    /**
     * Render card html
     * @private
     * @param {String} style ID of card style to use
     */
    Couppy.renderHtml = function (style) {
        switch(style) {
            case 1:
                Couppy.renderHtml_Style1();
                break;
            default:
                break;
        }
    };

    /**
     * Render card style 1
     * @private
     */
    Couppy.renderHtml_Style1 = function () {
        const body = document.getElementsByTagName('body')[0];
        const main = document.createElement('div');
        main.classList.add(...[pluginClassPrefix].concat(settings.appearance.main.classList)); // add multiple classes using spread syntax
        settings.refs.main = body.appendChild(main);

        /* ============== */

        /**
         * Render HTML overlay
         * @private
         */
        const templateHtml_Overlay = function() {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup container
         * @private
         */
        const templateHtml_PopupContainer = function() {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML popup
         * @private
         */
        const templateHtml_Popup = function() {
            const htmlTemplate = `
            `;
            return htmlTemplate;
        };

        /**
         * Render HTML card
         * @private
         */
        const templateHtml_Card = function() {
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
        const templateHtml_BtnClose = function() {
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

        // Render container
        const couppyCard = document.createElement('div');
        couppyCard.classList.add(...[classPrefix('container')].concat(settings.appearance.card.classList)); // add multiple classes using spread syntax
        couppyCard.innerHTML = templateHtml_Card();
        settings.refs.card = couppyPopup.appendChild(couppyCard);

        // Render Close Button
        const couppyBtnClose = document.createElement('span');
        couppyBtnClose.classList.add(classPrefix('btn-close'));
        couppyBtnClose.setAttribute("role", "button");
        couppyBtnClose.innerHTML = templateHtml_BtnClose();
        settings.refs.btn.close = couppyCard.appendChild(couppyBtnClose);

        // Copy Code Button
        settings.refs.btn.copy = couppyCard.querySelector('.' + classPrefix('btn-copy'));
    };


    //
    // Public APIs
    //

    return Couppy;

});