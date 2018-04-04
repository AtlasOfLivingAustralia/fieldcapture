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

    var storedTab = window.location.hash;
    if (!storedTab) {
        storedTab = amplify.store(config.tabStorageKey);
    }

    if (storedTab) {
        var $tab = $(storedTab + '-tab');
        if ($tab[0]) {
            $tab.tab('show');
        }
    }
}
