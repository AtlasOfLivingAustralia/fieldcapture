/**
 * Optionally fetches tab content and runs a javascript initialiser the first time a tab is shown.
 */
function initialiseTabs(tabConfig, options) {
    var defaults = {
      tabSelector: '.nav a',
      initialisingHtmlSelector: '#loading',
      tabStorageKey:'selected-tab',
      tabShownEvent:'shown.bs.tab',
      initialiser:function() {
          $('.helphover').popover({trigger:'hover'});
      }
    };
    var config = _.extend({}, defaults, options);
    var runInitialiser = function(tabConfig) {
        if (_.isFunction(tabConfig.initialiser)) {
            tabConfig.initialiser();
        }
        if (_.isFunction(config.initialiser)) {
            config.initialiser();
        }
    };
    var initialiseTab = function(tab) {
        tab.initialised = true;
        // Get the remote content
        if (tab.url) {
            $(tab.selector).html($(config.initialisingHtmlSelector));

            return $.get(tab.url).done(function(data) {
                $(tab.selector).html(data);
                runInitialiser(tab)
            });
        }
        else {
            runInitialiser(tab);
            var deferred = $.Deferred();
            deferred.resolve();
            return deferred;
        }
    };

    var tabShown = function(tab) {
        if (_.isFunction(tab.onShown)) {
            tab.onShown(tab);
        }
    };

    $(config.tabSelector).on(config.tabShownEvent, function(e) {
        var tabContentTarget = $(this).attr('href');
        var tabId = tabContentTarget.substring(1, tabContentTarget.length);

        var tab = tabConfig[tabId];
        if (tab) {

            if (!tab.initialised) {
                initialiseTab(tab).done(tabShown(tab));
            }
            else {
                tabShown(tab);
            }
            var tab = e.currentTarget.hash;
            amplify.store(config.tabStorageKey, tab);
        }
    });

    // Select a tab to display when initialising.
    var activeTabSelectors = [
        function() { return window.location.hash; },
        function() { return amplify.store(config.tabStorageKey); },
        function() { return _.find(_.keys(tabConfig), function(key) { return tabConfig[key].default }); },
        function() { return _.keys(tabConfig)[0]; }
    ];
    _.find(activeTabSelectors, function(selector) {
        var tab = selector();
        if (tab) {
            if (tab.indexOf('#') != 0) {
                tab = '#'+tab;
            }
            var $tab = $(tab + '-tab');
            if ($tab[0]) {
                $tab.tab('show');
                $tab.trigger(config.tabShownEvent); // If the tab is already active, the event isn't fired.
                return true; // We've found a tab to show, break from the find.
            }
        }
        return false;
    });
}
