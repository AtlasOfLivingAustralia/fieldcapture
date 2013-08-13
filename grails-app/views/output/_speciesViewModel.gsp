var SpeciesViewModel = function(data) {

    var self = this;
    self.guid = ko.observable();
    self.transients = {};
    self.name = ko.observable();
    self.listId = ko.observable();
    self.noAutoCompleteMatch = ko.observable(false);
    self.transients.availableLists = speciesLists;
    self.transients.editing = ko.observable(true);

    self.noSelection = function() {
        self.noAutoCompleteMatch(true);
        jQuery('form textarea').validationEngine('showPrompt', '<div>No species matches your search term.</div><div>Use this name anyway?</div>', 'load', undefined, true);
    };
    var speciesAutoCompleteOptions = function(noDataCallback) {
        return {
            extraParams: {limit: 100},
            dataType: 'json',
            parse: function(data) {
                var rows = new Array();
                data = data.autoCompleteList;
                for(var i=0; i<data.length; i++){
                    rows[i] = {
                        data:data[i],
                        value: data[i].guid,
                        result: data[i].name
                    };
                }
                if (!rows.length && (typeof noDataCallback === 'function')) {
                    noDataCallback();
                }
                return rows;
            },
            matchSubset: false,
            formatItem: function(row, i, n) {
                return row.name;
            },
            cacheLength: 10,
            minChars: 3,
            scroll: false,
            max: 10,
            selectFirst: true,
            close: function(event, ui) {
                self.transients.editing(false);
            }
        };
    };
    self.transients.speciesAutocompleteParams = ko.computed(function() {
        var options = speciesAutoCompleteOptions(self.noSelection);
        options.extraParams.druid = self.listId();
        return options;
    });

    self.speciesSelected = function(event, data) {
        data.listId = self.listId();
        self.transients.editing(false);
        self.loadData(data);
    };
    self.edit = function(event, data) {
        self.transients.editing(true);
    };

    self.loadData = function(data) {
        if (!data) data = {};
        self['guid'](data.guid);
        self['name'](data.name);
        self['listId'](data.listId);
        self.transients.editing(!data.name);
    };

    if (data) {
        self.loadData(data);
    }

};