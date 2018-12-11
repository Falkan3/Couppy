// Couppy Transaction complete script =====================

function getURLParameters(a) {
    var b = {},
        c = a.indexOf("?");
    if (-1 == c) return b;
    for (var d = a.substring(c + 1), e = d.split("&"), f = 0; f < e.length; f++) {
        var g = e[f].split("=");
        b[g[0]] = g[1]
    }
    return b
}

function appendTracking(params, utm_params, couppyCookie) {
    var tracker = '';
    var f = utm_params;
    if (typeof f.utm_source !== 'undefined' && f.utm_source) {
        switch (f.utm_source) {
            case 'webfield':
                tracker += "<!-- Offer Conversion: BostonSofa.pl --><img src=\"https://pixel.webfield.pl/aff_lsr?offer_id=687&adv_sub={order_id}&amount={float_sum_noship}&transaction_id=" + f.transaction_id + "\" width=\"1\" height=\"1\" /><!-- // End Offer Conversion -->";

                // remove transaction_id from cookie
                couppyCookie.utms.transaction_id = null;
                Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');

                break;
            default:
                break;
        }
    }

    if (tracker !== '')
        jQuery('body').append(tracker);
}

function cookieDefault(cookie, timeSpentOnSite, popupActive, popupTriggerActive, timer, hidden, utms, intervalActive) {
    if (cookie === null) {
        return {timeSpentOnSite: timeSpentOnSite, popupActive: popupActive, popupTriggerActive: popupTriggerActive, timer: timer, hidden: hidden, utms: utms, intervalActive: intervalActive};
    } else {
        if (typeof cookie.utms.transaction_id === "undefined" || cookie.utms.transaction_id === null) {
            cookie.utms.transaction_id = utms.transaction_id;
        }
        return cookie;
    }
}

//tracking
let f = getURLParameters(window.location.href);

document.addEventListener("DOMContentLoaded", function (event) {
    let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
    couppyCookie = cookieDefault(couppyCookie, 0, false, false, 300, true, {utm_source: f.utm_source, transaction_id: f.trans_id, at_gd: f.at_gd}, false);
    couppyCookie.lastVisit = typeof couppyCookie.currentVisit !== "undefined" ? {date: new Date(couppyCookie.currentVisit.date)} : {date: new Date()};
    couppyCookie.currentVisit = {date: new Date()};
    couppyCookie.lastTransaction = {date: new Date()};
    couppyCookie.hidden = true;
    Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');

    //add tracking
    appendTracking({}, couppyCookie.utms, couppyCookie);
});

// /Couppy Transaction complete script =====================