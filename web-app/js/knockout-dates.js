var isodatePattern = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
    simpleDatePattern = /\d\d-\d\d-\d\d\d\d/;

function convertToSimpleDate(isoDate) {
    //var date = new Date(isoDate);
    //alert(date.toString() + ' ' + date.toUTCString() + ' ' + date.toLocaleString());
    //var test = date.toLocaleString();
    if (isoDate && isodatePattern.test(isoDate)) {
        return isoDate.substr(8,2) + '-' +  isoDate.substr(5,2) +  '-' + isoDate.substr(0,4);
    }
    return isoDate;
    //return test;
}

function convertFromSimpleDate(date) {
    if (date && simpleDatePattern.test(date)) {
        return date.substr(6,4) + '-' + date.substr(3,2) + '-' + date.substr(0, 2) + 'T00:00:00Z';
    }
    return date;
}

ko.bindingHandlers.simpleDate = {
    init: function(element, valueAccessor) {
        var underlyingObservable = valueAccessor();

        var interceptor = ko.computed({
            read: function () {
                return convertToSimpleDate(underlyingObservable());
            },

            write: function (newValue) {
                var current = underlyingObservable(),
                    valueToWrite = convertFromSimpleDate(newValue);

                if (valueToWrite !== current) {
                    underlyingObservable(valueToWrite);
                } else {
                    if (newValue !== current.toString())
                        underlyingObservable.valueHasMutated();
                }
            }
        });

        ko.applyBindingsToNode(element, { value: interceptor });
    }
};

function getLocalOffset() {
    var offset = new Date().getTimezoneOffset();
    offset = ((offset<0? '+':'-')+ // Note the reversed sign!
        pad(parseInt(Math.abs(offset/60)), 2)+
        pad(Math.abs(offset%60), 2));
    return offset;
}

function pad(number, length){
    var str = "" + number
    while (str.length < length) {
        str = '0'+str
    }
    return str
}

