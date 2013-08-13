/*
Handles the display and editing of UTC dates.

Declares a Knockout extender that allows UTC ISODates to be displayed and edited as simple dates in the form
 dd-MM-yyyy and with local timezone adjustment. Hours and minutes can optionally be shown and edited.

Declares a custom binding that allows dates to be changed using the Bootstrap datepicker
 (https://github.com/eternicode/bootstrap-datepicker).

The date values in the ViewModel are maintained as UTC dates as strings in ISO format (ISO8601 without milliseconds).

The extender adds a 'formattedDate' property to the observable. It is this property that should be bound
 to an element, eg

    <input data-bind="value: myDate.formattedDate" type=...../> or
    <span data-bind="text: myDate.formattedDate" />

The date is defined in the view model like this:

    self.myDate = ko.observable("${myDate}").extend({simpleDate: false});

The boolean indicates whether to show the time as well.

The extender also adds a 'date' property to the observable that holds the value as a Javascript date object.
This is used by the datepicker custom binding.

The custom binding listens for changes via the datepicker as well as direct edits to the input field and
 updates the model. It also updates the datepicker on change to the model.

*/

(function(){

    // creates an ISO8601 date string but without millis - to match the format used by the java thingy for BSON dates
    Date.prototype.toISOStringNoMillis = function() {
        function pad(n) { return n < 10 ? '0' + n : n }
        return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
    };

    // Use native ISO date parsing or shim for old browsers (IE8)
    var D= new Date('2011-06-02T09:34:29+02:00');
    if(!D || +D!== 1307000069000){
        Date.fromISO= function(s){
            var day, tz,
                rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
                p= rx.exec(s) || [];
            if(p[1]){
                day= p[1].split(/\D/);
                for(var i= 0, L= day.length; i<L; i++){
                    day[i]= parseInt(day[i], 10) || 0;
                }
                day[1]-= 1;
                day= new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) return NaN;
                if(p[5]){
                    tz= (parseInt(p[5], 10)*60);
                    if(p[6]) tz+= parseInt(p[6], 10);
                    if(p[4]== '+') tz*= -1;
                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else{
        Date.fromISO= function(s){
            return new Date(s);
        }
    }
})();

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}

function convertToSimpleDate(isoDate, includeTime) {
    if (!isoDate) { return ''}
    var date = isoDate, strDate;
    if (typeof isoDate === 'string') {
        date = Date.fromISO(isoDate);
    }
    if (!isValidDate(date)) { return '' }
    strDate = pad(date.getDate(),2) + '-' + pad(date.getMonth() + 1,2) + '-' + date.getFullYear();
    strDate = pad(date.getDate(),2) + '-' + pad(date.getMonth() + 1,2) + '-' + date.getFullYear();
    if (includeTime) {
        strDate = strDate + ' ' + pad(date.getHours(),2) + ':' + pad(date.getMinutes(),2);
    }
    return strDate;
}

function convertToIsoDate(date) {
    if (typeof date === 'string') {
        if (date.length === 20 && date.charAt(19) === 'Z') {
            // already an ISO date string
            return date;
        } else if (date.length > 9){
            // assume a short date of the form dd-mm-yyyy
            var year = date.substr(6,4),
                month = Number(date.substr(3,2))- 1,
                day = date.substr(0,2),
                hours = date.length > 12 ? date.substr(11,2) : 0,
                minutes = date.length > 15 ? date.substr(14,2) : 0;
            return new Date(year, month, day, hours, minutes).toISOStringNoMillis();
        } else {
            return '';
        }
    } else if (typeof date === 'object') {
        // assume a date object
        return date.toISOStringNoMillis();
    } else {
        return '';
    }
}

function stringToDate(date) {
    if (typeof date === 'string') {
        if (date.length === 20 && date.charAt(19) === 'Z') {
            // already an ISO date string
            return Date.fromISO(date);
        } else if (date.length > 9){
            // assume a short date of the form dd-mm-yyyy
            var year = date.substr(6,4),
                month = Number(date.substr(3,2))- 1,
                day = date.substr(0,2),
                hours = date.length > 12 ? date.substr(11,2) : 0,
                minutes = date.length > 15 ? date.substr(14,2) : 0;
            return new Date(year, month, day, hours, minutes);
        } else {
            return undefined;
        }
    } else if (typeof date === 'object') {
        // assume a date object
        return date;
    } else {
        return undefined;
    }
}

(function() {

    // Binding to exclude the contained html from the current binding context.
    // Used when you want to bind a section of html to a different viewModel.
    ko.bindingHandlers.stopBinding = {
        init: function() {
            return { controlsDescendantBindings: true };
        }
    };
    ko.virtualElements.allowedBindings.stopBinding = true;

    // This extends an observable that holds a UTC ISODate. It creates properties that hold:
    //  a JS Date object - useful with datepicker; and
    //  a simple formatted date of the form dd-mm-yyyy useful for display.
    // The formatted date will include hh:MM if the includeTime argument is true
    ko.extenders.simpleDate = function (target, includeTime) {
        target.date = ko.computed({
            read: function () {
                return Date.fromISO(target());
            },

            write: function (newValue) {
                if (newValue) {
                    var current = target(),
                        valueToWrite = convertToIsoDate(newValue);

                    if (valueToWrite !== current) {
                        target(valueToWrite);
                    }
                } else {
                    // date has been cleared
                    target("");
                }
            }
        });
        target.formattedDate = ko.computed({
            read: function () {
                return convertToSimpleDate(target(), includeTime);
            },

            write: function (newValue) {
                if (newValue) {
                    var current = target(),
                        valueToWrite = convertToIsoDate(newValue);

                    if (valueToWrite !== current) {
                        target(valueToWrite);
                    }
                }
            }
        });

        target.date(target());
        target.formattedDate(target());

        return target;
    };

    /* Custom binding for Bootstrap datepicker */
    // This binds an element and a model observable to the bootstrap datepicker.
    // The element can be an input or container such as span, div, td.
    // The datepicker is 2-way bound to the model. An input element will be updated automatically,
    //  other elements may need an explicit text binding to the formatted model date (see
    //  clickToPickDate for an example of a simple element).
    ko.bindingHandlers.datepicker = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            // set current date into the element
            var $element = $(element),
                initialDate = ko.utils.unwrapObservable(valueAccessor()),
                initialDateStr = convertToSimpleDate(initialDate);
            if ($element.is('input')) {
                $element.val(initialDateStr);
            } else {
                $element.data('date', initialDateStr);
            }

            //initialize datepicker with some optional options
            $element.datepicker({format: 'dd-mm-yyyy', autoclose: true});

            // if the parent container holds any element with the class 'open-datepicker'
            // then add a hook to do so
            $element.parent().find('.open-datepicker').click(function () {
                $element.datepicker('show');
            });

            //when a user changes the date via the datepicker, update the view model
            ko.utils.registerEventHandler(element, "changeDate", function(event) {
                var value = valueAccessor();
                if (ko.isObservable(value)) {
                    value(event.date);
                }
            });

            //when a user changes the date via the input, update the view model
            ko.utils.registerEventHandler(element, "change", function() {
                var value = valueAccessor();
                if (ko.isObservable(value)) {
                    value(stringToDate(element.value));
                }
            });
        },
        update: function(element, valueAccessor)   {
            var widget = $(element).data("datepicker");
            //when the view model is updated, update the widget
            if (widget) {
                widget.date = ko.utils.unwrapObservable(valueAccessor());
                if (!isNaN(widget.date)) {
                    widget.setDate(widget.date);
                }
            }
        }
    };

}());

function pad(number, length){
    var str = "" + number
    while (str.length < length) {
        str = '0'+str
    }
    return str
}

//wrapper for an observable that protects value until committed
ko.protectedObservable = function(initialValue) {
    //private variables
    var _temp = initialValue;
    var _actual = ko.observable(initialValue);

    var result = ko.dependentObservable({
        read: _actual,
        write: function(newValue) {
            _temp = newValue;
        }
    });

    //commit the temporary value to our observable, if it is different
    result.commit = function() {
        if (_temp !== _actual()) {
            _actual(_temp);
        }
    };

    //notify subscribers to update their value with the original
    result.reset = function() {
        _actual.valueHasMutated();
        _temp = _actual();
    };

    return result;
};

// This binding allows dates to be displayed as simple text that can be clicked to access
//  a date picker for in-place editing.
// A user prompt appears if the model has no value. this can be customised.
// A calendar icon is added after the bound element as a visual indicator that the date can be edited.
// A computed 'hasChanged' property provides an observable isDirty flag for external save/revert mechanisms.
// The 'datepicker' binding is applied to the element to integrate the bootstrap datepicker.
// NOTE you can use the datepicker binding directly if you have an input as your predefined element.
ko.bindingHandlers.clickToPickDate = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var observable = valueAccessor(),
            userPrompt = $(element).attr('data-prompt'),
            prompt = userPrompt || 'Click to edit',
            icon = $('<i class="icon-calendar open-datepicker" title="Click to change date"></i>');

        observable.originalValue = observable.date();
        observable.hasChanged = ko.computed(function () {
            //console.log("original: " + observable.originalValue + " current: " + observable.date());
            var original = observable.originalValue.getTime();
            var current = observable.date().getTime();
            return (original != current) && (!isNaN(original) || !isNaN(current));
        });

        $(element).parent().append(icon);

        ko.applyBindingsToNode(element, {
            text: ko.computed(function() {
                // todo: style default text as grey
                return ko.utils.unwrapObservable(observable) !== "" ? observable.formattedDate() : prompt;
            }),
            datepicker: observable.date
        });
    }
};

/*
This binding allows text values to be displayed as simple text that can be clicked to access
 an input control for in-place editing.
 */
ko.bindingHandlers.clickToEdit = {
    init: function(element, valueAccessor) {
        var observable = valueAccessor(),
            link = document.createElement("a"),
            input = document.createElement("input"),
            userPrompt = $(element).attr('data-prompt'),
            prompt = userPrompt || 'Click to edit';

        // add any classes specified for the link element
        $(link).addClass($(element).attr('data-link-class'));
        // add any classes specified for the input element
        $(input).addClass($(element).attr('data-input-class'));

        element.appendChild(link);
        element.appendChild(input);


        observable.editing = ko.observable(false);

        ko.applyBindingsToNode(link, {
            text: ko.computed(function() {
                // todo: style default text as grey
                var value = ko.utils.unwrapObservable(observable);
                return value !== "" ? value : prompt;
            }),
            visible: ko.computed(function() {
                return !observable.editing();
            }),
            click: observable.editing.bind(null, true)
        });

        ko.applyBindingsToNode(input, {
            value: observable,
            visible: observable.editing,
            hasfocus: observable.editing
        });
    }
};

/*
This binding allows small non-negative integers in the model to be displayed as a number of ticks
 and edited by spinner buttons.
 */
ko.bindingHandlers.ticks = {
    init: function(element, valueAccessor) {
        var observable = valueAccessor(),
            $parent = $(element).parent(),
            $buttons,
            $widget = $('<div class="tick-controls btn-group btn-group-vertical"></div>');

        $parent.css('padding','4px');
        $widget.append($('<button class="up btn btn-mini"><i class="icon-chevron-up"></i></button>'));
        $widget.append($('<button class="down btn btn-mini"><i class="icon-chevron-down"></i></button>'));
        $parent.append($widget);
        $buttons = $parent.find('button');

        $buttons.hide();

        ko.utils.registerEventHandler($parent, "mouseover", function() {
            $buttons.show();
        });

        ko.utils.registerEventHandler($parent, "mouseout", function() {
            $buttons.hide();
        });

        ko.utils.registerEventHandler($buttons, "click", function() {
            var isUp = $(this).hasClass('up'),
                value = Number(observable());
            if (isNaN(value)) { value = 0; }

            if (isUp) {
                observable("" + (value + 1));
            } else {
                if (value > 0) {
                    observable("" + (value - 1));
                }
            }
            return false;
        });
    },
    update: function(element, valueAccessor) {
        var observable = valueAccessor(), value,
            tick = '<i class="icon-ok"></i>', ticks = "";
        if (observable) {
            value = Number(ko.utils.unwrapObservable(observable));
            if (isNaN(value)) {
                $(element).html("");
            } else {
                //$(element).html(value);
                $(element).empty();
                for (i=0; i < value; i++) {
                    ticks += tick;
                }
                $(element).html(ticks);
            }
        }
    }
};

// handles simple or deferred computed objects
// see activity/edit.gsp for an example of use
ko.extenders.async = function(computedDeferred, initialValue) {

    var plainObservable = ko.observable(initialValue), currentDeferred;
    plainObservable.inProgress = ko.observable(false);

    ko.computed(function() {
        if (currentDeferred) {
            currentDeferred.reject();
            currentDeferred = null;
        }

        var newDeferred = computedDeferred();
        if (newDeferred &&
            (typeof newDeferred.done == "function")) {

            // It's a deferred
            plainObservable.inProgress(true);

            // Create our own wrapper so we can reject
            currentDeferred = $.Deferred().done(function(data) {
                plainObservable.inProgress(false);
                plainObservable(data);
            });
            newDeferred.done(currentDeferred.resolve);
        } else {
            // A real value, so just publish it immediately
            plainObservable(newDeferred);
        }
    });

    return plainObservable;
};

ko.bindingHandlers.fileUpload = {
    init: function(element, valueAccessor) {

        var Image = function(props) {
            this.name = props.name;
            this.size = props.size;
            this.url = props.url;
            this.thumbnail_url = props.thumbnail_url;

        };
        var observable = valueAccessor();  // Expected to be a ko.observableArray.

        var addCallbacks = function() {
            // The upload URL is specified using the data-url attribute to allow it to be easily pulled from the
            // application configuration.
            $(element).fileupload('option', 'completed', function(e, data) {
                $.each(data.result, function(index, obj) {
                    if (observable.hasOwnProperty('push')) {
                        observable.push(new Image(obj));
                    }
                    else {
                        observable(new Image(obj))
                    }
                });
            });
            $(element).fileupload('option', 'destroyed', function(e, data) {
                var filename = $(e.currentTarget).attr('data-filename');

                if (observable.hasOwnProperty('remove')) {
                    var images = observable();

                    // We rely on the template rendering the filename into the delete button so we can identify which
                    // object has been deleted.
                    $.each(images, function(index, obj) {
                        if (obj.name === filename) {
                            observable.remove(obj);
                            return false;
                        }
                    });
                }
                else {
                    observable({})
                }
            });

        };

        $(element).fileupload({autoUpload:true});

        var value = ko.utils.unwrapObservable(observable);
        var isArray = value.hasOwnProperty('length');

        if ((isArray && value.length > 0) || (!isArray && value['name'] !== undefined)) {
            // Render the existing model items - we are currently storing all of the metadata needed by the
            // jquery-file-upload plugin in the model but we should probably only store the core data and decorate
            // it in the templating code (e.g. the delete URL and HTTP method).
            $(element).fileupload('option', 'completed', function(e, data) {
                addCallbacks();
            });
            var data = isArray ? {result:value} : {result:[value]};
            $(element).fileupload('option', 'done').call(element, '', data);
        }
        else {
            addCallbacks();
        }

        // Enable iframe cross-domain access via redirect option:
        $(element).fileupload(
            'option',
            'redirect',
            window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
            )
        );

    }

};

// A handy binding to iterate over the properties of an object.
ko.bindingHandlers.foreachprop = {
    transformObject: function (obj) {
        var properties = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                properties.push({ key: key, value: obj[key] });
            }
        }
        return properties;
    },
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            properties = ko.bindingHandlers.foreachprop.transformObject(value);
        ko.applyBindingsToNode(element, { foreach: properties });
        return { controlsDescendantBindings: true };
    }
};

// Compares this column to the current sort parameters and displays the appropriate sort icons.
// If this is the column that the model is currently sorted by, then shows an up or down icon
//  depending on the current sort order.
// Usage example: <th data-bind="sortIcon:sortParamsObject,click:sortBy" data-column="type">Type</th>
// The sortIcon binding takes an object or observable that contains a 'by' property and an 'order' property.
// The data-column attr defines the model value that the column holds. This is compared to the
//  current sort by value to see if this is the active column.
ko.bindingHandlers.sortIcon = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            name = $element.data('column'),
            $icon = $element.find('i'),
            className = "icon-blank",
            sortParams = ko.utils.unwrapObservable(valueAccessor());
        // see if this is the active sort column
        if (sortParams.by() === name) {
            // and if so, choose an icon based on sort order
            className = sortParams.order() === 'desc' ? 'icon-chevron-down' : 'icon-chevron-up';
        }
        // insert the icon markup if it doesn't exist
        if ($icon.length === 0) {
            $icon = $("<i class='icon-blank'></i>").appendTo($element);
        }
        // set the computed class
        $icon.removeClass('icon-chevron-down').removeClass('icon-chevron-up').removeClass('icon-blank').addClass(className);
    }
};


ko.bindingHandlers.autocomplete = {
    init: function (element, params) {
        var param = params();
        var url = ko.utils.unwrapObservable(param.url);
        var options = ko.utils.unwrapObservable(param.options);
        options.source = function(request, response) {
            $(element).addClass("ac_loading");
            $.ajax({
                url: url,
                dataType:'json',
                data: {
                    q:request.term
                },
                success: function(data) {
                    var items = $.map(data.autoCompleteList, function(item) {
                        return {
                            label:item.name,
                            value: item.name,
                            source: item
                        }
                    });
                    items = [{label:"Missing or unidentified species", value:request.term, source: {listId:'unmatched', name: request.term}}].concat(items);
                    response(items);

                },
                complete: function() {
                    $(element).removeClass("ac_loading");
                }
            });
        };
        options.select = function(event, ui) {
            ko.utils.unwrapObservable(param.result)(event, ui.item.source);
        };

        $(element).autocomplete(options).data("ui-autocomplete");
        //._renderItem = function(ul, item) {
//            console.log(item);
//            var value = '';
//            if (item) {
//                value = "<li>"+item['label']+"</li>";
//            }
//            //console.log(item.name);
//            return $(ul).append(value);
//        };
    },
    update: function (element, params, allBindingsAccessor, bindingContext) {

        $(element).val(bindingContext.name());
        if (bindingContext.transients.editing()) {
            setTimeout(function() {

                $(element).select();
                $(element).focus();
                $(element).autocomplete("search");

            }, 250);
        };

    }
};
