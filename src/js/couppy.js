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
                classList: []
            },
            card: {
                classList: []
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
        }
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

    // @todo Do something...

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
        document.removeEventListener('click', eventHandler, false);

        // Reset variables
        settings = null;
        eventTimeout = null;
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
     * @param  {String} className
     */
    const classPrefix = function (className) {
        return `${pluginClassPrefix}__${className}`;
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
        } else if(classes instanceof String) {
            return classes;
        }

        return '';
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

        // Listen for events
        settings.refs.overlay.addEventListener('click', function(event) {
            Couppy.close();
        }, false);
        settings.refs.popup.addEventListener('click', function(event) {
            event.stopPropagation();
        }, false);

        // On Init callback
        if (typeof settings.callbackOnInit === 'function') {
            settings.callbackOnInit.call(this);
        }
    };

    /**
     * Open popup
     * @public
     */
    Couppy.open = function () {
        settings.refs.overlay.classList.remove('hidden');

        // On Open callback
        if (typeof settings.callbackOnOpen === 'function') {
            settings.callbackOnOpen.call(this);
        }
    };

    /**
     * Close popup
     * @public
     */
    Couppy.close = function () {
        settings.refs.overlay.classList.add('hidden');

        // On Close callback
        if (typeof settings.callbackOnClose === 'function') {
            settings.callbackOnClose.call(this);
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
                <h1 class="${classPrefix('tx-title')}">Halloween sale</h1>
                <p class="${formatClasses([classPrefix('tx-title'), classPrefix('sp-highlight')])}"><span class="${formatClasses([classPrefix('sp-super'), classPrefix('sp-highlight')])}">5% off</span></p>
                <p class="${classPrefix('tx-code')}">COUPONCODE</p>
                <p class="${classPrefix('tx-subtext')}">use the code above during the checkout</p>
            </div>
            
            <div class="${classPrefix('c-footer')}">
                <p><a href="#" class="${classPrefix('tx-link')}">See the collection <i class="fas fa-arrow-right"></i></a></p>
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
    };


    //
    // Public APIs
    //

    return Couppy;

});