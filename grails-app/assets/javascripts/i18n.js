/*
 * Copyright (C) 2019 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 * 
 * Created by Temi on 15/11/19.
 */

(function() {
    var messages = {},
        defer = $.Deferred();
    if (fcConfig.i18nURL) {
        $.get(fcConfig.i18nURL).done(function (data) {
            messages = data;
            defer.resolve();
        }).fail(function () {
            defer.reject();
        });
    }
    else {
        console.warn("No i18nURL defined in config");
        defer.reject();
    }

    $i18n = function(key, defaultValue) {
        if (messages[key] !== undefined) {
            return messages[key];
        } else {
            return _.isUndefined(defaultValue) ? key : defaultValue;
        }
    };

    $i18nAsync = function(key, defaultValue, callback) {
        if (callback) {
            defer.done(function () {
                callback($i18n(key, defaultValue));
            }).fail(function () {
                callback($i18n(key, defaultValue));
            })
        }
    }

})();
