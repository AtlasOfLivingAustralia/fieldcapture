
function healthCheck(healthCheckUrl) {

    var result = $.Deferred();
    if (healthCheckUrl) {
        $.ajax(healthCheckUrl).done(function(data) {
            // There are a few scenarios that can happen here that will result in the done() method being called.
            // 1. Everything is normal, the health check returns status 200 application/json "{status:"ok"}"
            // 2. The user session has timed out, but the CAS TGT is still active, this should log the user back in and
            //    return the same value as (1).
            // 3. The user session has timed out, and so has the CAS TGT.  (Or the user has explicitly logged out in a other tab).  In this
            //    case, the request will be redirected to the CAS login page so we will get a status 200 text/html with the contents of the CAS login page.
            // For 1. and 2. we return true, for 3 we return false as the user needs to explicitly log in again.

            if (_.isObject(data) && data.status == 'ok') {
                result.resolve();
            }
            else {
                result.reject(true);
            }

        }).fail(function() {
            // This will happen if MERIT is down or the network between the user and MERIT is down.
            result.reject(false);
        });
    }
    else {
        result.resolve();
    }

    return result;
};