

var speciesFormatters = function() {

    var singleLineSpeciesFormatter = function(species) {

        if (species.scientificName && species.commonName) {
            return $('<span/>').append($('<span class="scientific-name"/>').text(scientificName(species))).append($('<span class="common-name"/>').text(' (' + commonName(species)+ ')'));
        }
        else if (species.scientificName) {
            return $('<span class="scientific-name"/>').text(scientificName(species));
        }
        else {
            return $('<span class="common-name"/>').html(commonName(species)); // Html is used to avoid double escaping user entered data.
        }
    };

    function image(species, config) {

        var imageUrl = config.noImageUrl;
        if (species.guid || species.lsid) {
            imageUrl = config.speciesImageUrl + '?id=' + encodeURIComponent(species.guid || species.lsid);
        }
        return $('<div class="species-image-holder"/>').css('background-image', 'url('+imageUrl+')').append();
    }

    function scientificName(species) {
        var scientificName = species.scientificNameMatches && species.scientificNameMatches.length > 0 ? species.scientificNameMatches[0] : species.scientificName;
        return scientificName || '';
    }

    function commonName(species) {
        var commonName = species.commonNameMatches && species.commonNameMatches.length > 0 ? species.commonNameMatches[0] : species.commonName;
        return  commonName || species.name;
    }
    var multiLineSpeciesFormatter = function(species, queryTerm, config) {

        if (!species) return '';

        var result = $("<div class='species-result'/>");;
        if (config.showImages) {
            result.append(image(species, config));
        }
        result.append($('<div class="name-holder"/>').append($('<div class="scientific-name"/>').html(scientificName(species))).append($('<div class="common-name"/>').html(commonName(species))));

        return result;
    };


    return {
        singleLineSpeciesFormatter:singleLineSpeciesFormatter,
        multiLineSpeciesFormatter:multiLineSpeciesFormatter
    }
}();



var speciesSearchEngines = function() {

    var speciesId = function (species) {
        if (species.guid || species.lsid) {
            return species.guid || species.lsid;
        }
        return species.name;
    };

    var speciesTokenizer = function (species) {
        var result = [];
        if (species.scientificName) {
            result = result.concat(species.scientificName.split(/\W+/));
        }
        if (species.commonName) {
            result = result.concat(species.commonName.split(/\W+/));
        }
        if (species.name) {
            result = result.concat(species.name.split(/\W+/));
        }
        if (species.kvpValues) {
            for (var i in species.kvpValues) {
                if (species.kvpValues[i].key.indexOf('name') >= 0) {
                    result = result.concat(species.kvpValues[i].value.split(/\W+/));
                }
            }
        }
        return result;
    };

    var select2ListTransformer = function (speciesArray) {
        if (!speciesArray) {
            return [];
        }
        for (var i in speciesArray) {
            speciesArray[i].id = speciesId(speciesArray[i]);
        }
        return speciesArray;
    };

    var select2AlaTransformer = function(alaResults) {
        var speciesArray = alaResults.autoCompleteList;
        if (!speciesArray) {
            return [];
        }
        for (var i in speciesArray) {
            speciesArray[i].id = speciesArray[i].guid;
            speciesArray[i].scientificName = speciesArray[i].name;
        }
        return speciesArray;

    };

    var engines = {};

    function engineKey(listId, alaFallback) {
        return listId || '' + alaFallback;
    }

    function get(config) {
        var key = engineKey(config.listId, config.useAla);
        var engine = engines[key];
        if (!engine) {
            engine = define(config);
            engines[key] = engine;
        }
        return engine;
    };

    function define(config) {
        var options = {
            datumTokenizer: speciesTokenizer,
            queryTokenizer: Bloodhound.tokenizers.nonword,
            identify: speciesId
        };
        if (config.listId) {
            options.prefetch = {
                url: config.speciesListUrl + '?druid='+config.listId+'&includeKvp=true',
                transform: select2ListTransformer
            };
        }
        if (config.useAla) {
            options.remote = {
                url: config.searchBieUrl + '?q=%',
                wildcard: '%',
                transform: select2AlaTransformer
            };
        }

        return new Bloodhound(options);
    };

    return {
        get:get,
        speciesId:speciesId
    };
}();


/**
 * Manages the species data type in the output model.
 * Allows species information to be searched for and displayed.
 */
var SpeciesViewModel = function(data, options) {

    var self = this;

    self.guid = ko.observable();
    self.name = ko.observable();
    self.scientificName = ko.observable();
    self.commonName = ko.observable();

    self.listId = ko.observable();
    self.transients = {};
    self.transients.speciesInformation = ko.observable();
    self.transients.speciesTitle = ko.observable();
    self.transients.editing = ko.observable(false);
    self.transients.textFieldValue = ko.observable();
    self.transients.bioProfileUrl =  ko.computed(function (){
        return options.bieUrl + '/species/' + self.guid();
    });

    self.transients.speciesSearchUrl = options.speciesSearchUrl+'&dataFieldName='+options.dataFieldName;

    self.speciesSelected = function(event, data) {
        self.loadData(data);
        self.transients.editing(!data.name);
    };

    self.textFieldChanged = function(newValue) {
        if (newValue != self.name()) {
            self.transients.editing(true);
        }
    };

    self.toJS = function() {
        return {
            guid:self.guid(),
            name:self.name(),
            scientificName:self.scientificName(),
            commonName:self.commonName(),
            listId:self.listId
        }
    };

    self.loadData = function(data) {
        if (!data) data = {};
        self.guid(orBlank(data.guid || data.lsid));
        self.name(orBlank(data.name));
        self.listId(orBlank(data.listId));
        self.scientificName(orBlank(data.scientificName));
        self.commonName(orBlank(data.commonName));

        self.transients.speciesTitle = speciesFormatters.multiLineSpeciesFormatter(self.toJS(), '', {showImage: false});
        self.transients.textFieldValue(self.name());
        if (self.guid() && !options.printable) {

            var profileUrl = fcConfig.bieUrl + '/species/' + encodeURIComponent(self.guid());
            $.ajax({
                url: options.speciesProfileUrl+'?id=' + encodeURIComponent(self.guid()),
                dataType: 'json',
                success: function (data) {
                    var profileInfo = '<a href="'+profileUrl+'" target="_blank">';
                    var imageUrl = data.thumbnail || (data.taxonConcept && data.taxonConcept.smallImageUrl);

                    if (imageUrl) {
                        profileInfo += "<img title='Click to show profile' class='taxon-image ui-corner-all' src='"+imageUrl+"'>";
                    }
                    else {
                        profileInfo += "No profile image available";
                    }
                    profileInfo += "</a>";
                    self.transients.speciesInformation(profileInfo);
                },
                error: function(request, status, error) {
                    console.log(error);
                }
            });

        }
        else {
            self.transients.speciesInformation("No profile information is available.");
        }

    };

    if (data) {
        self.loadData(data);
    }
    self.focusLost = function(event) {
        self.transients.editing(false);
        if (self.name()) {
            self.transients.textFieldValue(self.name());
        }
        else {
            self.transients.textFieldValue('');
        }
    };


    self.findSpeciesConfig = function(options) {
        var speciesConfig;
        if (options.speciesConfig) {
            if (options.speciesConfig.surveyConfig) {
                speciesConfig = _.find(options.speciesConfig.surveyConfig.speciesFields || [], function (conf) {
                    return conf.output == options.outputName && conf.dataFieldName == options.dataFieldName;
                });
                if (speciesConfig) {
                    speciesConfig = speciesConfig.config;
                }

                if (!speciesConfig) {
                    speciesConfig = options.speciesConfig.defaultSpeciesConfig;
                }
            }
        }
        if (!speciesConfig) {
            speciesConfig = {};
        }
        speciesConfig.listId = speciesConfig && speciesConfig.speciesLists && speciesConfig.speciesLists.length > 0 ? speciesConfig.speciesLists[0].dataResourceUid : '';

        var defaults = {
            showImages: true,
            useAla:true,
            allowUnmatched: true,
            unmatchedTermlength: 5
        };

        _.defaults(speciesConfig, defaults);
        _.defaults(speciesConfig, options);
        return speciesConfig;
    };

    var speciesConfig = self.findSpeciesConfig(options);

    self.formatSearchResult = function(species) {
        return speciesFormatters.multiLineSpeciesFormatter(species, self.transients.currentSearchTerm || '', speciesConfig);
    };
    self.formatSelectedSpecies = speciesFormatters.singleLineSpeciesFormatter;

    self.transients.engine = speciesSearchEngines.get(speciesConfig);
    self.id = function() {
        return speciesSearchEngines.speciesId({guid:self.guid(), name:self.name()});
    };

    function markMatch (text, term) {
        if (!text) {
            return {match:false, text:''};
        }
        // Find where the match is
        var match = text.toUpperCase().indexOf(term.toUpperCase());

        // If there is no match, move on
        if (match < 0) {
            return {match:false, text:text};
        }

        // Put in whatever text is before the match
        var result = text.substring(0, match);

        // Mark the match
        result += '<b>' + text.substring(match, match + term.length) + '</b>';

        // Put in whatever is after the match
        result += text.substring(match + term.length);

        return {match:true, text:result};
    }


    self.search = function(params, callback) {
        var term = params.term;
        self.transients.currentSearchTerm = term;
        var suppliedResults = false;
        if (term) {
            self.transients.engine.search(term,
                function (resultArr) {
                    var results = [];
                    if (resultArr.length > 0) {

                        for (var i in resultArr) {
                            resultArr[i].scientificNameMatches = [markMatch(resultArr[i].scientificName, term).text];
                            var match = markMatch(resultArr[i].commonName || resultArr[i].name, term);

                            if (resultArr[i].kvpValues && resultArr[i].kvpValues.length > 0) {
                                var j = 0;
                                while (!match.match && j<resultArr[i].kvpValues.length) {
                                    if (resultArr[i].kvpValues[j].key.indexOf('name') >= 0) {
                                        match = markMatch(resultArr[i].kvpValues[j].value, term);
                                    }
                                    j++;
                                }

                            }
                            resultArr[i].commonNameMatches = [match.text];

                        }
                        results.push({text: "Species List", children: resultArr});
                        suppliedResults = true;
                    }
                    if (!speciesConfig.useAla && speciesConfig.allowUnmatched && term.length >= speciesConfig.unmatchedTermlength) {
                        results.push({text: "Missing or unidentified species", children: [{id:name, name: _.escape(term), listId:"unmatched"}]});
                    }
                    if (results.length > 0) {
                        callback({results: results}, false);
                    }

                },
                function (resultArr) {
                    var results = [];
                    if (resultArr.length > 0) {
                        results.push({text: "Atlas of Living Australia", children: resultArr});
                    }
                    if (speciesConfig.allowUnmatched && term.length >= speciesConfig.unmatchedTermlength) {
                        results.push({text: "Missing or unidentified species", children: [{id:name, name:_.escape(term), listId:"unmatched"}]});
                    }
                    callback({results:results}, suppliedResults);
                });
        }
        else {
            var list = self.transients.engine.all();
            if (list.length > 0) {
                var pageLength = 10;
                var offset = (params.page || 0) * pageLength;
                var end = Math.min(offset+pageLength, list.length);
                var page = list.slice(offset, end);
                var results = offset > 0 ? page : [{text: "Species List", children: page}];

                callback({results: results, pagination: {more: end < list.length }});
            }
        }
    }
};

$.fn.select2.amd.define('select2/species', [
    'select2/data/ajax',
    'select2/utils'
], function (AjaxAdapter, Utils) {
    function SpeciesAdapter($element, options) {
        this.model = options.get("model");
        this.$element = $element;

        SpeciesAdapter.__super__.constructor.call(this, $element, options);

        var id = this.model.id();

        if (id) {
            this.addOptions(this.option({id:id, text:this.model.name()}));
        }
        else {
            this.addOptions(this.option({text:options.placeholder}));
        }

    }

    Utils.Extend(SpeciesAdapter, AjaxAdapter);

    SpeciesAdapter.prototype.query = function (params, callback) {
        var self = this;

        self.model.search(
            params, function (results, append) {
                if (!append) {
                    callback(results);
                }
                else {
                    self.trigger("results:append", {data: results, query: params});
                }
            }
        );

    };

    SpeciesAdapter.prototype.current = function (callback) {
        var data = this.model.toJS();
        data.id = speciesSearchEngines.speciesId(data);
        if (!data.id) {
            data = {id: -1, text: "Please select..."}
        }
        callback([data]);
    };

    SpeciesAdapter.prototype.select = function(data) {
        this.model.loadData(data);
        AjaxAdapter.__super__.select.call(this, data);
    };

    return SpeciesAdapter;
});
