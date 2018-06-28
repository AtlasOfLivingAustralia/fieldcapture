/**
 * Optionally fetches tab content and runs a javascript initialiser the first time a tab is shown.
 */
function initialiseTabs(tabConfig, options) {
    var defaults = {
      tabSelector: '.nav a',
      initialisingHtmlSelector: '#loading',
      tabStorageKey:'selected-tab'
    };
    var config = _.extend({}, defaults, options);

    $(config.tabSelector).on('shown.bs.tab', function(e) {
        var tabContentTarget = $(this).attr('href');
        var tabId = tabContentTarget.substring(1, tabContentTarget.length);

        var tab = tabConfig[tabId];
        if (tab && !tab.initialised) {
            tab.initialised = true;
            // Get the remote content
            if (tab.url) {
                $(tab.selector).html($(config.initialisingHtmlSelector));

                $.get(tab.url, function(data) {
                    $(tab.selector).html(data);
                    if (tab.initialiser) {
                        tab.initialiser();
                    }
                });
            }
            else if (_.isFunction(tab.initialiser)) {
                tab.initialiser();
            }

        }
        var tab = e.currentTarget.hash;
        amplify.store(config.tabStorageKey, tab);
    });

    // Select a tab to display when initialising.
    var activeTabSelectors = [
        function() { return window.location.hash; },
        function() { return amplify.store(config.tabStorageKey); },
        function() { return _.find(_.values(tabConfig), function(tab) { return tab.default }); },
        function() { return _.keys(tabConfig)[0]; }
    ];
    _.find(activeTabSelectors, function(selector) {
        var tab = selector();
        if (tab) {
            if (!tab.startsWith('#')) {
                tab = '#'+tab;
            }
            var $tab = $(tab + '-tab');
            if ($tab[0]) {
                $tab.tab('show');
                return true; // We've found a tab to show, break from the find.
            }
        }
        return false;
    });
}
