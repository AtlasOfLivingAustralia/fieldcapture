/*
This Knockout extender allows UTC ISODates to be displayed and edited as simple dates in the form
dd-MM-yyyy and with local timezone adjustment. Hours and minutes can optionally be shown and edited.

The date values in the ViewModel are maintained as UTC dates in ISO format (ISO8601 without milliseconds).

The extender adds a 'formattedDate' property to the observable. It is this property that should be bound
to an element, eg

    <input data-bind="value: myDate.formattedDate" type=...../>

The date is defined in the view model like this:

    self.myDate = ko.observable("${myDate}").extend({simpleDate: false});

The boolean indicates whether to show the time as well.

*/

Date.prototype.toISOStringNoMillis = function() {
    function pad(n) { return n < 10 ? '0' + n : n }
    return this.getUTCFullYear() + '-'
        + pad(this.getUTCMonth() + 1) + '-'
        + pad(this.getUTCDate()) + 'T'
        + pad(this.getUTCHours()) + ':'
        + pad(this.getUTCMinutes()) + ':'
        + pad(this.getUTCSeconds()) + 'Z';
};

function convertToSimpleDate(isoDate, includeTime) {
    if (!isoDate) { return ''}
    var date = new Date(isoDate), strDate;
    strDate = pad(date.getDate(),2) + '-' + pad(date.getMonth() + 1,2) + '-' + date.getFullYear();
    if (includeTime) {
        strDate = strDate + ' ' + pad(date.getHours(),2) + ':' + pad(date.getMinutes(),2);
    }
    return strDate;
}

function convertFromSimpleDate(date) {
    if (!date || date.length < 10) { return '' }
    var year = date.substr(6,4),
        month = Number(date.substr(3,2))- 1,
        day = date.substr(0,2),
        hours = date.length > 12 ? date.substr(11,2) : 0,
        minutes = date.length > 15 ? date.substr(14,2) : 0;
    return new Date(year, month, day, hours, minutes).toISOStringNoMillis();
}

(function() {
    ko.extenders.simpleDate = function (target, includeTime) {
        target.formattedDate = ko.computed({
            read: function () {
                return convertToSimpleDate(target(), includeTime);
            },

            write: function (newValue) {
                if (newValue) {
                    var current = target(),
                        valueToWrite = newValue.charAt(newValue.length - 1) === 'Z' ?
                            newValue : convertFromSimpleDate(newValue);

                    if (valueToWrite !== current) {
                        target(valueToWrite);
                    } else {
                        if (newValue !== current.toString())
                            //target.notifySubscribers(valueToWrite);
                            target.valueHasMutated();
                    }
                }
            }
        });

        target.formattedDate(target());

        return target;
    };
}());

function pad(number, length){
    var str = "" + number
    while (str.length < length) {
        str = '0'+str
    }
    return str
}
