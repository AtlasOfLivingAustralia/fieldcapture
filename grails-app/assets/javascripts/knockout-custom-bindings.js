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
    $element.popover('destroy');
    var options = ko.bindingHandlers.popover.initPopover(element, valueAccessor);
    if (options.autoShow) {
      if ($element.data('firstPopover') === false) {
        $element.popover('show');
        $('body').on('click', function(e) {

          if (e.target != element && $element.find(e.target).length == 0) {
            $element.popover('hide');
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

    var combinedOptions = ko.utils.extend({}, ko.bindingHandlers.popover.defaultOptions);
    var content = ko.utils.unwrapObservable(options.content);
    ko.utils.extend(combinedOptions, options);
    combinedOptions.description = content;

    $(element).popover(combinedOptions);

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      $(element).popover("destroy");
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
    var callback = param.callback;

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

      if(callback && typeof callback === "function"){
        callback()
      }
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
          template: '<div class="popover warning"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        };
        var warning = $element.data('warningmessage');
        $element.popover(_.extend({content:warning}, popoverWarningOptions));
        $element.data('popover').tip().click(function() {
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
