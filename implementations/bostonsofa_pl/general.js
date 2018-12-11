// DOM loaded event listener, can be placed anywhere, will fire when DOM is loaded and ready
document.addEventListener("DOMContentLoaded", function (event) {
    // Your code to run since DOM is loaded and ready
    function mobileAndTabletcheck() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    let CouppySettings = {
        state: {
            popupTriggerActive: false,
            active: false,
            timerActive: false
        },
        appearance: {
            style: 2,
            logo: {
                url: 'https://bostonsofa.pl/skins/user/rwd_shoper_3/images/logo.png',
                alt: 'bostonsofa logo'
            },
            pwdBy: {
                url: 'https://properad.pl/theme/ProperAd/img/logo.jpg',
                alt: 'Properad'
            },
            popupTrigger: {
                classList: ['js-couppy__popup-trigger--right']
            },
            timer: true
        },
        data: {
            api: {
                url: 'https://webfield.pl/xbonus/', // TEST: 'https://webfield.pl/xbonus/index2.php/'
                params: {
                    key: 'FYrw7mEuKfT5', // TEST: 'FYrw7mEuKfT5'
                }
            },
            promo: {
                value: 5,
                suffix: '%',
            },
            timer: {
                value: 300
            }
        },
        text: {
            popupTrigger: {
                first: '5%',
                second: 'Rabat',
            },
            title: 'ZACZEKAJ - podaj nr telefonu i email, na który<br>wyślemy Twój indywidualny kod rabatowy',
            promo: 'zniżki',
            btn: {
                default: 'Prześlij mi kod rabatowy',
                sending: 'Wysyłanie...',
                success: 'Sukces'
            },
            footerText: {
                btn: {
                    more: 'Więcej\xa0szczegółów',
                    less: 'Mniej\xa0szczegółów',
                },
                short: 'Administratorem danych jest Bostonsofa Paweł Seroka. Dane będą przetwarzane w celu marketingu bezpośredniego naszych produktów i usług. Podstawą prawną przetwarzania jest uzasadniony interes Administratora.',
                long: 'Administratorem Twoich danych jest Bostonsofa Paweł Seroka. Dane będą przetwarzane w celu marketingu bezpośredniego naszych produktów i usług. Podstawą prawną przetwarzania jest uzasadniony interes Administratora. Każdorazowo przysługuje Ci prawo żądania dostępu do danych, sprostowania ich, usunięcia lub cofnięcia wyrażonej zgody, a także inne prawa opisane szczegółowo w polityce prywatności. Odbiorcami Twoich danych, czyli podmiotami, którym Twoje dane mogą zostać przekazane, będą podmioty pomagające Nam w działaniach związanych z opisanym wyżej marketingiem bezpośrednim produktów i usług własnych oraz inne podmioty uprawnione do uzyskania danych na podstawie obowiązującego prawa.'
            },
            thankYou: {
                top: '<i class="fas fa-check"></i> Twój kod rabatowy został wysłany!',
                bottom: 'Użyj go robiąc zakupy online lub w\xa0trakcie rozmowy z\xa0naszym konsultantem.',
            },
            timer: {
                title: 'Nasza oferta będzie ważna tylko przez 5 minut!'
            },
            api: {
                error: 'Błąd wysyłki na podany numer'
            }
        },
        inputs: {
            fields: [
                {
                    regex: "(?<!\\w)(\\(?(\\+|00)?48\\)?)?[ -]?\\d\{3\}[ -]?\\d\{3\}[ -]?\\d\{3\}(?!\\w)",
                    pattern: '{\{999\}}-{\{999\}}-{\{999\}}',
                    patterns: [
                        {'^\d{3}[-]?\d{3}[-]?\d{3}$': 'mobile: {\{999\}}-{\{999\}}-{\{999\}}'},
                        {'^\d{2}[ -]?\d{3}[-]?\d{2}[-]?\d{2}$': 'landline: {\{99\}} {\{999\}}-{\{99\}}-{\{99\}}'},
                    ],
                    text: {
                        invalid: 'Telefon jest nieprawidłowy'
                    },
                    attributes: {
                        name: 'number',
                        placeholder: "000-000-000",
                        title: 'Numer telefonu'
                    }
                },
                {
                    regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                    text: {
                        invalid: 'Email jest nieprawidłowy'
                    },
                    attributes: {
                        name: 'email',
                        placeholder: "email",
                        title: 'Email'
                    }
                }
            ],
            agreements: [
                {
                    text: {
                        short: 'Wyrażam zgodę na otrzymywanie od Bostonsofa Paweł Seroka oraz operatora SMS/email WebField Sp. z o.o. informacji handlowej',
                        long: 'w rozumieniu art. 10 ust. 2 Ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (Dz.U. Nr 144, poz. 1204) na podany adres poczty elektronicznej oraz numer telefonu.',
                        readmore: 'Rozwiń',
                        readless: 'Zwiń',
                        invalid: 'Regulacje RODO wymagają od nas zebrania odpowiednich zgód - bez nich nie możemy przesłać kodu rabatowego.'
                    },
                    attributes: {
                        name: 'agreement_1',
                        required: true,
                    },
                },
                {
                    text: {
                        short: 'Wyrażam zgodę na używanie telekomunikacyjnych urządzeń końcowych i automatycznych systemów wywołujących',
                        long: 'w stosunku do podanego przeze mnie numeru telefonu oraz adresu email dla celów marketingu bezpośredniego przez Bostonsofa Paweł Seroka oraz operatora SMS/email WebField Sp. z o.o..',
                        readmore: 'Rozwiń',
                        readless: 'Zwiń',
                        invalid: 'Regulacje RODO wymagają od nas zebrania odpowiednich zgód - bez nich nie możemy przesłać kodu rabatowego.'
                    },
                    attributes: {
                        name: 'agreement_2',
                        required: true,
                    },
                }
            ]
        },
        callbackOnOpen: function () {
            Couppy.activeToggle(false, {autoClose: false});
            Couppy.timerToggle(true);
            let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
            if (couppyCookie === null) {
                couppyCookie = {
                    timeSpentOnSite: 0,
                    popupActive: false,
                    popupTriggerActive: false,
                    timer: CouppySettings.data.timer.value,
                    hidden: true,
                    utms: {utm_source: Couppy.Helpers.getURLParameters(window.location.href).utm_source},
                    intervalActive: false
                };
            } else {
                couppyCookie.popupActive = false;
                couppyCookie.hidden = true;
            }
            Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');
        },
        callbackOnClose: function () {
            Couppy.popupTriggerToggle(true);
            let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
            if (couppyCookie === null) {
                couppyCookie = {
                    timeSpentOnSite: 0,
                    popupActive: false,
                    popupTriggerActive: true,
                    timer: CouppySettings.data.timer.value,
                    hidden: false,
                    utms: {utm_source: Couppy.Helpers.getURLParameters(window.location.href).utm_source},
                    intervalActive: false
                };
            } else {
                couppyCookie.popupTriggerActive = true;
                couppyCookie.hidden = true;
            }
            Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');
        }
    };

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

    function hide() {
        let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
        couppyCookie = cookieDefault(couppyCookie, 0, true, false, CouppySettings.data.timer.value, false, {utm_source: Couppy.Helpers.getURLParameters(window.location.href).utm_source}, false);
        couppyCookie.hidden = true;

        Couppy.destroy();
        CouppySettings.state.active = false;
        CouppySettings.state.popupTriggerActive = false;
    }

    try {
        //tracking
        let f = Couppy.Helpers.getURLParameters(window.location.href);

        let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
        couppyCookie = cookieDefault(couppyCookie, 0, true, false, CouppySettings.data.timer.value, false, {utm_source: f.utm_source, transaction_id: f.trans_id, at_gd: f.at_gd}, true);
        couppyCookie.lastVisit = typeof couppyCookie.currentVisit !== "undefined" ? {date: new Date(couppyCookie.currentVisit.date)} : {date: new Date()};
        couppyCookie.currentVisit = {date: new Date()};
        couppyCookie.lastTransaction = typeof couppyCookie.lastTransaction !== 'undefined' ? {date: new Date(couppyCookie.lastTransaction.date)} : undefined;
        couppyCookie.timer = (typeof couppyCookie.timer === "undefined" || couppyCookie.timer === null) ? CouppySettings.data.timer.value : couppyCookie.timer;
        Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');

        CouppySettings.data.timer.value = couppyCookie.timer;

        // Conditionals and criteria =====================

        const ONE_HOUR = 60 * 60 * 1000; // hour in ms
        const ONE_DAY = ONE_HOUR * 24;
        const ONE_WEEK = ONE_DAY * 7;
        const ONE_MONTH = ONE_DAY * 30;

        // site specific - Shopper
        const basketInfo = (typeof frontAPI !== "undefined" && typeof frontAPI.getBasketInfo !== "undefined") ? frontAPI.getBasketInfo() : null;

        // check if the user hasn't made a transaction in the last 7 days
        const madeTransaction = typeof couppyCookie.lastTransaction !== 'undefined' && typeof couppyCookie.lastTransaction.date !== 'undefined' && couppyCookie.lastTransaction.date !== null && couppyCookie.lastTransaction.date.getTime() + ONE_WEEK > Date.now();
        const returningVisitor = couppyCookie.lastVisit.date.getTime() + ONE_DAY < Date.now() && Date.now() < couppyCookie.lastVisit.date.getTime() + ONE_MONTH;
        const spentTime = couppyCookie.timeSpentOnSite >= 5;
        const basketNotEmpty = basketInfo !== null ? basketInfo.basket.count > 0 : false;
        const hidden = typeof couppyCookie.hidden !== 'undefined' && couppyCookie.hidden;
        const srcFromAff = (typeof couppyCookie.utms.utm_source !== 'undefined' && couppyCookie.utms.utm_source === 'webfield') || (typeof f.utm_source !== 'undefined' && f.utm_source === 'webfield') ? true : false;

        // check if all criteria have been met before the popup opens
        if (!hidden && !madeTransaction && !srcFromAff && (returningVisitor || spentTime || basketNotEmpty)) {
            Couppy.destroy();
            CouppySettings.state.popupTriggerActive = couppyCookie.popupTriggerActive;
            CouppySettings.state.active = couppyCookie.popupActive;
            // hide couppy in future visits
            // couppyCookie.hidden = true;
            // Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');
            // /hide couppy in future visits
            Couppy.init(CouppySettings);
        }

        // /Conditionals and criteria =====================

        // Interval =====================

        if (!hidden && !madeTransaction && !srcFromAff) {
            if (typeof couppyCookie.intervalActive === "undefined" || couppyCookie.intervalActive) {
                const couppyInterval = setInterval(function () {
                    let couppyCookie = JSON.parse(Couppy.getCookie('couppy'));
                    couppyCookie = cookieDefault(couppyCookie, 0, false, false, CouppySettings.data.timer.value, false, {utm_source: f.utm_source, trans_id: f.trans_id, at_gd: f.at_gd}, true);

                    couppyCookie.timeSpentOnSite += 5;
                    couppyCookie.timer = Couppy.timerValue();
                    if (Couppy.timerValue() === 0) {
                        hide();
                        clearInterval(couppyInterval);
                    }
                    if (couppyCookie.popupActive && couppyCookie.timeSpentOnSite >= 5) {
                        // couppyCookie.popupActive = false;
                        couppyCookie.intervalActive = false;
                        Couppy.destroy();
                        CouppySettings.state.active = true;
                        CouppySettings.state.popupTriggerActive = false;

                        if (Couppy.Helpers.mobileAndTabletCheck()) {
                            if (!basketNotEmpty) {
                                CouppySettings.text.title = 'Zostaw swój numer, abyśmy mogli wysłać Ci Twój indywidualny kod rabatowy';
                                console.log(CouppySettings);
                                Couppy.init(CouppySettings);
                                Couppy.open();
                            }
                        } else {
                            console.log(CouppySettings);
                            Couppy.init(CouppySettings);
                        }

                        clearInterval(couppyInterval);
                        // couppyCookie.hidden = true;
                    }
                    Couppy.setCookie('couppy', JSON.stringify(couppyCookie), '30');
                }, 5000);
            }
        }

        // /Interval =====================
    } catch (ex) {
        console.log('Couppy init error');
    }
});