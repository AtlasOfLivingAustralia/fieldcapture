/**
 * Attaches a bootstrap popover to the bound element.  The details for the popover should be supplied as the
 * value of this binding.
 * e.g.  <a href="#" data-bind="popover: {title:"Popover title", content:"Popover content"}>My link with popover</a>
 *
 * The content and title must be supplied, other popover options have defaults.
 *
 */
ko.bindingHandlers.popover = {

  init: function(element, valueAccessor) {
    ko.bindingHandlers.popover.initPopover(element, valueAccessor);
  },
  update: function(element, valueAccessor) {

    var $element = $(element);
    $element.popover('dispose');
    var options = ko.bindingHandlers.popover.initPopover(element, valueAccessor);
    if (options.autoShow) {
      if ($element.data('firstPopover') === false) {
        $element.popover('show');
        $('body').on('click', function(e) {

          if (e.target != element && $element.find(e.target).length == 0) {
            $element.popover('dispose');
          }
        });
      }
      $element.data('firstPopover', false);
    }

  },

  defaultOptions: {
    placement: "right",
    animation: true,
    html: true,
    trigger: "hover"
  },

  initPopover: function(element, valueAccessor) {
    var options = ko.utils.unwrapObservable(valueAccessor());

    if (typeof(options.content) === "undefined"){
      options.content = ""
    }

    var combinedOptions = ko.utils.extend({}, ko.bindingHandlers.popover.defaultOptions);
    var content = ko.utils.unwrapObservable(options.content);
    ko.utils.extend(combinedOptions, options);
    combinedOptions.description = content;

    $(element).popover(combinedOptions);

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      $(element).popover("dispose");
    });
    return options;
  }
};

ko.bindingHandlers.independentlyValidated = {
  init: function(element, valueAccessor) {
    $(element).addClass('validationEngineContainer');
    $(element).find('thead').attr('data-validation-engine', 'validate'); // Horrible hack.
    $(element).validationEngine('attach', {scroll:false});
  }
};


ko.bindingHandlers.activityProgress = {
  update: function(element, valueAccessor) {
    var progressValue = ko.utils.unwrapObservable(valueAccessor());

    for (var progress in ACTIVITY_PROGRESS_CLASSES) {
      ko.utils.toggleDomNodeCssClass(element, ACTIVITY_PROGRESS_CLASSES[progress], false);
    }
    ko.utils.toggleDomNodeCssClass(element, ACTIVITY_PROGRESS_CLASSES[progressValue], true);
  }
};

ko.bindingHandlers.numeric = {
  init: function (element, valueAccessor) {
    $(element).on("keydown", function (event) {
      // Allow: backspace, delete, tab, escape, and enter
      if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
            // Allow: Ctrl+A
          (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: . ,
          (event.keyCode == 190 || event.keyCode == 110) ||
            // Allow: home, end, left, right
          (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
          event.preventDefault();
        }
      }
    });
  }
};

ko.bindingHandlers.slideVisible = {
  init: function(element, valueAccessor) {
    // Initially set the element to be instantly visible/hidden depending on the value
    var value = valueAccessor();
    $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function(element, valueAccessor) {
    // Whenever the value subsequently changes, slowly fade the element in or out
    var value = valueAccessor();
    ko.unwrap(value) ? $(element).slideDown() : $(element).slideUp();
  }
};

ko.bindingHandlers.booleanValue = {
  'after': ['options', 'foreach'],
  init: function(element, valueAccessor, allBindingsAccessor) {
    var observable = valueAccessor(),
        interceptor = ko.computed({
          read: function() {
            return (observable() !== undefined ? observable().toString() : undefined);
          },
          write: function(newValue) {
            observable(newValue === "true");
          }
        });

    ko.applyBindingsToNode(element, { value: interceptor });
  }
};

ko.bindingHandlers.onClickShowTab = {
  'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var originalFunction = valueAccessor();
    var newValueAccesssor = function() {
      return function () {
        var tabId = ko.utils.unwrapObservable(allBindingsAccessor().tabId);
        if (tabId) $(tabId).tab('show');
        originalFunction.apply(viewModel, arguments);
      }
    };
    ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
  }
};

ko.bindingHandlers.expandable = {

  'init': function() {
    var self = ko.bindingHandlers.expandable;
    self.truncate = function(cellWidth, originalTextWidth, originalText) {
      var fractionThatFits = cellWidth/originalTextWidth,
          truncationPoint = Math.floor(originalText.length * fractionThatFits) - 6;
      return originalText.substr(0,truncationPoint) + '...';
    };
  },
  'update':function(element, valueAccessor) {
    var self = ko.bindingHandlers.expandable;

    var text = ko.utils.unwrapObservable(valueAccessor());
    if ($.isArray(text)) {
      text = text.join(",");
    }
    var $element = $(element),
        textWidth = $element.textWidth(text),
        cellWidth = $element.availableWidth();

    $element.removeClass('truncated');
    var needsTruncation = cellWidth > 0 && textWidth > cellWidth;
    if (!needsTruncation) {
      $element.html(text);
      return;
    }

    var anchor = $('<a/>');
    anchor.click(function() {
      toggleTruncate($element);
    });
    $element.empty();
    $element.html("");
    $element.append(anchor);



    var toggleTruncate = function($element) {
      var truncate = !$element.hasClass('truncated');
      $element.toggleClass('truncated');
      var anchor = $element.find("a");
      if (truncate) {
        $element.attr('title', text);
        anchor.html(self.truncate(cellWidth, textWidth, text));
      } else {
        anchor.html(text);
        $element.removeAttr('title');
      }
    };
    toggleTruncate($element);

  }
};

// the following code handles resize-sensitive truncation of the description field
$.fn.textWidth = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  $.fn.textWidth.fakeEl.html(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.width();
};

$.fn.availableWidth = function() {
  if (this.css('display').match(/inline/)) {
    var siblingWidth = 0;
    this.siblings().each(function(i, sibling) {
      var $sibling = $(sibling);
      if ($sibling.css('display').match(/inline/)) {
        siblingWidth += $sibling.width();
      }
    });
    return this.parent().width() - siblingWidth;
  }
  else {
    return this.width();
  }
};

ko.bindingHandlers.elasticSearchAutocomplete = {
  init: function (element, params) {
    var param = params();
    var url = ko.utils.unwrapObservable(param.url);
    var valueProp = ko.utils.unwrapObservable(param.value);
    var labelProp = ko.utils.unwrapObservable(param.label);
    var result = param.result;

    var options = {};

    options.source = function(request, response) {
      $(element).addClass("ac_loading");

      var data = {searchTerm:request.term, offset:0, max:10};
      var items;
      $.ajax({
        url: url,
        dataType:'json',
        data: data,
        success: function(data) {
          if (data.hits) {
            var hits = data.hits.hits || [];
            items = $.map(hits, function (hit) {
              return {label: hit._source[labelProp], value: hit._source[valueProp], source:hit._source};
            });
            response(items);
          }
        },
        error: function() {
          items = [{label:"Error retrieving values", value:''}];
          response(items);
        },
        complete: function() {
          $(element).removeClass("ac_loading");
        }
      });
    };
    options.select = function(event, ui) {
      result(ui.item);
      $(this).val(""); // Clear the search field
    };

    $(element).autocomplete(options);

  }
};


ko.bindingHandlers.showModal = {
  init: function (element, valueAccessor) {
    $(element).modal({ backdrop: 'static', keyboard: true, show: false });
  },
  update: function (element, valueAccessor) {
    var value = valueAccessor();
    if (ko.utils.unwrapObservable(value)) {
      $(element).modal('show');
    }
    else {
      $(element).modal('hide');
    }
  }
};

ko.extenders.withPrevious = function (target) {
  // Define new properties for previous value and whether it's changed
  target.previous = ko.observable();
  target.changed = ko.computed(function () { return target() !== target.previous(); });
  target.revert = function () {
    target(target.previous());
  };

  // Subscribe to observable to update previous, before change.
  target.subscribe(function (v) {
    target.previous(v);
  }, null, 'beforeChange');

  // Return modified observable
  return target;
};

/**
 * This binding displays a warning based on the value of an observable.
 */
ko.bindingHandlers.warningPopup = {
  init: function(element, valueAccessor) {
    var target = valueAccessor();

    var $element = $(element);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (target.popoverInitialised) {
        $element.popover("destroy");
      }
    });
  },
  update: function(element, valueAccessor) {
    var $element = $(element);
    if ($element.prop("disabled")) {
      return;
    }
    var target = valueAccessor();
    var valid = target();
    if (!valid) {
      if (!target.popoverInitialised) {
        var popoverWarningOptions = {
          placement:'top',
          trigger:'manual',
          template: '<div class="popover warning"><h3 class="popover-header"></h3><div class="popover-body"></div><div class="arrow"></div></div>'
        };
        var warning = $element.data('warningmessage');
        $element.popover(_.extend({content:warning}, popoverWarningOptions));

        var popover = $element.data('bs.popover');
        $(popover.getTipElement()).click(function() {
          $element.popover('hide');
        });
        target.popoverInitialised = true;
      }
      setTimeout(function() {
        $element.popover('show');
      }, 1);

    }
    else {
      if (target.popoverInitialised) {
        $element.popover('hide');
      }
    }
  }
};

/**
 * Interacts with the "options" and "value" bindings for a select element.
 * Upon initialisation, if the current value of the select field does not exist in the options list, this
 * binding will add it.  This is to support backwards-compatible removal of options from select lists without
 * invalidating saved data that selected the removed value.
 * Note - if the value for the "options" binding is not an observable, this binding must be applied before the
 * options binding.
 * @type {{init: ko.bindingHandlers.addValueToOptionsIfMissing.init}}
 */
ko.bindingHandlers['addValueToOptionsIfMissing'] = {
  init: function(element, valueAccessor, allBindings) {
    var options = ko.utils.unwrapObservable(allBindings.get('options'));
    var value = ko.utils.unwrapObservable(allBindings.get('value'));

    // If the initial value is not in the options list, add it.
    if (value && options && _.isArray(options) && !_.contains(options, value)) {
      options.push(value);
    }
  }

}

ko.bindingHandlers['jqueryValidationEngine'] = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    var config = valueAccessor();
    var namespace = config.namespace;
    var validationFunction = config.validationFunction;

    if (!window.globalValidations) {
      window.globalValidations = {};
    }
    window.globalValidations[namespace] = validationFunction;

    element.setAttribute('data-validation-engine', 'validate[funcCallRequired[globalValidations.'+namespace+']]')
  }
}


function pad(number, length){
  var str = "" + number
  while (str.length < length) {
    str = '0'+str
  }
  return str
}
//wrapper for an observable that protects value until committed
// CG - Changed the way the protected observable works from value doesn't change until commit to
// value changes as edits are made with rollback.  This was to enable cross field dependencies in a table
// row - using a temp variable meant observers were not notified of changes until commit.
ko.protectedObservable = function(initialValue) {
  //private variables
  var _current = ko.observable(initialValue);
  var _committed = initialValue;

  var result = ko.dependentObservable({
    read: _current,
    write: function(newValue) {
      _current(newValue);
    }
  });

  //commit the temporary value to our observable, if it is different
  result.commit = function() {
    _committed = _current();
  };

  //notify subscribers to update their value with the original
  result.reset = function() {
    _current(_committed);
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
        dblclick = $(element).attr('data-edit-on-dblclick'),
        userPrompt = $(element).attr('data-prompt'),
        prompt = userPrompt || (dblclick ? 'Double-click to edit' : 'Click to edit'),
        linkBindings;

    // add any classes specified for the link element
    $(link).addClass($(element).attr('data-link-class'));
    // add any classes specified for the input element
    $(input).addClass($(element).attr('data-input-class'));

    element.appendChild(link);
    element.appendChild(input);

    observable.editing = ko.observable(false);
    observable.stopEditing = function () {
      $(input).blur();
      observable.editing(false)
    };

    linkBindings = {
      text: ko.computed(function() {
        // todo: style default text as grey
        var value = ko.utils.unwrapObservable(observable);
        return value !== "" ? value : prompt;
      }),
      visible: ko.computed(function() {
        return !observable.editing();
      })
    };

    // bind to either the click or dblclick event
    if (dblclick) {
      linkBindings.event = { dblclick: observable.editing.bind(null, true) };
    } else {
      linkBindings.click = observable.editing.bind(null, true);
    }

    ko.applyBindingsToNode(link, linkBindings);

    ko.applyBindingsToNode(input, {
      value: observable,
      visible: observable.editing,
      hasfocus: observable.editing
    });

    // quit editing on enter key
    $(input).keydown(function(e) {
      if (e.which === 13) {
        observable.stopEditing();
      }
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

ko.bindingHandlers.fileUploadNoImage = {
  init: function(element, options) {
    var dropzone = $(element).parent();
    var defaults = {autoUpload:true, dropZone: dropzone};
    var settings = {};
    $.extend(settings, defaults, options());
    $(element).fileupload(settings);
  }
}

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

/**
 * A vetoableObservable is an observable that provides a mechanism to prevent changes to its value under certain
 * conditions.  When a change is notified, the vetoCheck function is executed - if it returns false the change is
 * disallowed and the vetoCallback function is invoked.  Otherwise the change is allowed and the noVetoCallback
 * function is invoked.
 * The only current example of it's use is when the type of an activity is changed, it
 * can potentially invalidate any target score values that have been supplied by the user - hence the user is
 * asked if they wish to proceed, and if so, the targets can be removed.
 * @param initialValue the initial value for the observable.
 * @param vetoCheck a function or string that will be invoked when the value of the vetoableObservable changes.  Returning
 * false from this function will disallow the change.  If a string is supplied, it is used as the question text
 * for a window.confirm function.
 * @param noVetoCallback this callback will be invoked when a change to the vetoableObservable is allowed.
 * @param vetoCallback this callback will be invoked when a change to the vetoableObservable is disallowed (has been vetoed).
 * @returns {*}
 */
ko.vetoableObservable = function(initialValue, vetoCheck, noVetoCallback, vetoCallback) {
  //private variables
  var _current = ko.observable(initialValue);

  var vetoFunction = typeof (vetoCheck) === 'function' ? vetoCheck : function() {
    return window.confirm(vetoCheck);
  };
  var result = ko.dependentObservable({
    read: _current,
    write: function(newValue) {

      // The equality check is treating undefined as equal to an empty string to prevent
      // the initial population of the value with an empty select option from triggering the veto.
      if (_current() !== newValue && (_current() !== undefined || newValue !== '')) {

        if (vetoFunction()) {
          _current(newValue);
          if (noVetoCallback !== undefined) {
            noVetoCallback();
          }
        }
        else {
          _current.notifySubscribers();
          if (vetoCallback !== undefined) {
            vetoCallback();
          }
        }
      }

    }
  });

  return result;
};

/**
 *
 * @param target the knockoutjs object being extended.
 * @param options {currencySymbol, decimalSeparator, thousandsSeparator}
 */
ko.extenders.currency = function(target, options) {

  var symbol, d,t;
  if (options !== undefined) {
    symbol = options.currencySymbol;
    d = options.decimalSeparator;
    t = options.thousandsSeparator;
  }
  target.formattedCurrency = ko.computed(function() {
    var n = target(),
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        sym = symbol == undefined ? "$" : symbol,
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sym + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  });
  return target;
};

// custom validator to ensure that only one of two fields is populated
function exclusive (field, rules, i, options) {
  var otherFieldId = rules[i+2], // get the id of the other field
      otherValue = $('#'+otherFieldId).val(),
      thisValue = field.val(),
      message = rules[i+3];
  // checking thisValue is technically redundant as this validator is only called
  // if there is a value in the field
  if (otherValue !== '' && thisValue !== '') {
    return message;
  } else {
    return true;
  }
};

/**
 * Converts markdown formatted text into html, filters an allowed list of tags.  (To prevent script injection).
 * @param target the knockout observable holding the text.
 * @param options unused.
 * @returns {*}
 */
ko.extenders.markdown = function(target, options) {
  var converter = new window.Showdown.converter();
  var filterOptions = window.WMDEditor.defaults.tagFilter;

  target.markdownToHtml = ko.computed(function() {
    var text = target();
    if (text) {
      text = text.replace(/<[^<>]*>?/gi, function (tag) {
        return (tag.match(filterOptions.allowedTags) || tag.match(filterOptions.patternLink) || tag.match(filterOptions.patternImage) || tag.match(filterOptions.patternAudio)) ? tag : "";
      });
    }
    else {
      text = '';
    }
    return converter.makeHtml(text);
  });
  return target;
};


ko.bindingHandlers.stagedImageUpload = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

    var defaultConfig = {
      maxWidth: 300,
      minWidth:150,
      minHeight:150,
      maxHeight: 300,
      previewSelector: '.preview'
    };
    var size = ko.observable();
    var progress = ko.observable();
    var error = ko.observable();
    var complete = ko.observable(true);

    var uploadProperties = {
      size: size,
      progress: progress,
      error:error,
      complete:complete
    };
    var innerContext = bindingContext.createChildContext(bindingContext);
    ko.utils.extend(innerContext, uploadProperties);

    var target = valueAccessor();
    var $elem = $(element);
    var role = $elem.data('role');
    var ownerKey = $elem.data('owner-type');
    var ownerValue = $elem.data('owner-id');
    var url = $elem.data('url');
    var owner = {};
    owner[ownerKey] = ownerValue;
    var config = {
      url:url,
      role: role,
      owner:owner
    };
    config = $.extend({}, defaultConfig, config);

    // Expected to be a ko.observableArray
    $(element).fileupload({
      url:config.url,
      autoUpload:true
    }).on('fileuploadadd', function(e, data) {
      complete(false);
      progress(1);
    }).on('fileuploadprocessalways', function(e, data) {
      if (data.files[0].preview) {
        if (config.previewSelector !== undefined) {
          var previewElem = $(element).parent().find(config.previewSelector);
          previewElem.append(data.files[0].preview);
        }
      }
    }).on('fileuploadprogressall', function(e, data) {
      progress(Math.floor(data.loaded / data.total * 100));
      size(data.total);
    }).on('fileuploaddone', function(e, data) {

      var result = data.result;

      if (!result) {
        result = {};
        error('No response from server');
      }

      if (result.files[0]) {
        target.push(ko.bindingHandlers.stagedImageUpload.toDocument(result.files[0], config));
        complete(true);
      }
      else {
        error(result.error);
      }

    }).on('fileuploadfail', function(e, data) {
      error(data.errorThrown);
    });

    ko.applyBindingsToDescendants(innerContext, element);

    return { controlsDescendantBindings: true };
  },
  toDocument:function(f, config) {

    var data = {
      thumbnailUrl: f.thumbnail_url,
      url: f.url,
      contentType: f.contentType,
      filename: f.name,
      filesize: f.size,
      dateTaken: f.isoDate,
      lat: f.decimalLatitude,
      lng: f.decimalLongitude,
      name: f.name,
      type: 'image',
      role:config.role
    };

    return $.extend({}, data, config.owner);
  }
};

var ACTIVITY_PROGRESS_CLASSES = {
  'planned':'btn-warning',
  'started':'btn-success',
  'finished':'btn-info',
  'deferred':'btn-danger',
  'cancelled':'btn-inverse',
  'corrected':'btn-danger'
};


/** Returns a bootstrap class used to style activity progress labels */
function activityProgressClass(progress) {
  return ACTIVITY_PROGRESS_CLASSES[progress];
}

/** Allows a subscription to an observable that passes both the old and new value to the callback */
ko.subscribable.fn.subscribeChanged = function (callback) {
  var savedValue = this.peek();
  return this.subscribe(function (latestValue) {
    var oldValue = savedValue;
    savedValue = latestValue;
    callback(latestValue, oldValue);
  });
};

ko.extenders.url = function(target) {
  var result = ko.pureComputed({
    read:target,
    write: function(url) {
      var value = typeof url == 'string' && url.indexOf("://") < 0? ("http://" + url): url;
      target(value);
    }
  });
  result(target());
  return result;
};
