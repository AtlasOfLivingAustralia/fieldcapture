//= require html5shiv/html5shiv.js
//= require jquery/jquery.js
//= require js-cookie/js.cookie.js
//= require bootstrap/js/bootstrap.bundle.js
/**
 * This function sets up a timeout warning banner that will be displayed when the session has expired
 * or network has been lost.
 * It is called in the nrm_bs4.gsp template file.
 */
function setupTimeoutWarning(options) {
    var $logoutWarningBanner = $('#' + options.logoutWarningBannerId);
    var $networkWarningBanner = $('#' + options.networkWarningBannerId);
    var $logoutButton = $(options.logoutButtonSelector);
    var $loginButton = $(options.loginButtonSelector);

    // Set up a timer that will periodically poll the server to keep the session alive
    var intervalSeconds = 5 * 60;

    function fireKeepAlive() {
        $.ajax(options.keepSessionAliveUrl).fail(function (xhr) {
            if (xhr.status == 0) {
                // Network outage?
                showNetworkBanner();
            } else if (xhr.status == 401) {
                hideNetworkBanner();
                // Session timed out.
                showTimeoutBanner();
            }
        }).done(function (xhr) {
            hideNetworkBanner();
            hideTimeoutBanner();
        });
    }

    function showBanner(banner) {
        banner.show();
        var height = banner.outerHeight();
        $('body').css("margin-top", height);
    }

    function hideBanner(banner) {
        banner.hide();
        $('body').css("margin-top", "0");
    }

    function showTimeoutBanner() {
        showBanner($logoutWarningBanner);
    }

    function hideTimeoutBanner() {
        hideBanner($logoutWarningBanner);
    }

    function showNetworkBanner() {
        showBanner($networkWarningBanner);
        hideBanner($logoutWarningBanner)
    }

    function hideNetworkBanner() {
        hideBanner($networkWarningBanner);
    }

    setInterval(fireKeepAlive, intervalSeconds * 1000);

    if (!window.localStorage) {
        return;
    }
    var LOGOUT_PRESSED_KEY = 'logout';
    var LOGIN_PRESSED_KEY = 'login';

    $logoutButton.click(function () {
        window.localStorage.setItem(LOGOUT_PRESSED_KEY, new Date().getTime());
    });
    $loginButton.click(function () {
        window.localStorage.setItem(LOGIN_PRESSED_KEY, new Date().getTime());
    });
    $logoutWarningBanner.find('a').click(function () {
        hideTimeoutBanner();
    });
    window.addEventListener('storage', function (e) {
        if (e.key == LOGOUT_PRESSED_KEY) {
            fireKeepAlive();
        }
        if (e.key == LOGIN_PRESSED_KEY) {
            fireKeepAlive();
        }
    });
    window.addEventListener('online', function() {
        fireKeepAlive();
    });
    window.addEventListener('offline', function() {
        fireKeepAlive();
    });
    window.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            fireKeepAlive();
        }
    });


}
