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
                $networkWarningBanner.show();
            } else if (xhr.status == 401) {
                $networkWarningBanner.hide();
                // Session timed out.
                $logoutWarningBanner.show();
            }
        }).done(function (xhr) {
            $networkWarningBanner.hide();
            $logoutWarningBanner.hide();
        });
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
        $logoutWarningBanner.hide();
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
}
