/**
 * Manages the species data type in the output model.
 * Allows species information to be searched for and displayed.
 */
var SpeciesViewModel = function(data, parentRow) {

    var self = this;
    self.guid = ko.observable();
    self.name = ko.observable();
    self.listId = ko.observable();
    self.transients = {};
    self.transients.speciesInformation = ko.observable();
    self.transients.availableLists = speciesLists;
    self.transients.focused = ko.observable();
    self.transients.editing = ko.observable();

    self.speciesSelected = function(event, data) {
        if (!data.listId) {
            data.listId = self.list();
        }
        self.loadData(data);
        self.transients.editing(!data.name);

    };
    self.edit = function(event, data) {
        self.transients.editing(true);
        self.transients.focused(true);
    };

    self.listName = function(listId) {
        if (listId == 'Atlas of Living Australia') {
            return listId;
        }
        var name = '';
        $.each(self.transients.availableLists, function(i, val) {
            if (val.listId === listId) {
                name = val.listName;
                return false;
            }
        });
        return name;
    };

    self.renderItem = function(row) {

        var result = '';
        if (!row.listId) {
            row.listId = 'Atlas of Living Australia';
        }
        if (row.listId !== 'unmatched' && self.renderItem.lastHeader !== row.listId) {
            result+='<div style="background:grey;color:white; padding-left:5px;"> '+self.listName(row.listId)+'</div>';
        }
        // We are keeping track of list headers so we only render each one once.
        self.renderItem.lastHeader = row.listId ? row.listId : 'Atlas of Living Australia';
        result+='<a>';
        if (row.listId && row.listId === 'unmatched') {
            result += '<i>Unlisted or unknown species</i>';
        }
        else {

            var commonNameMatches = row.commonNameMatches !== undefined ? row.commonNameMatches : "";

            result += (row.scientificNameMatches && row.scientificNameMatches.length>0) ? row.scientificNameMatches[0] : commonNameMatches ;
            if (row.name != result && row.rankString) {
                result = result + "<div class='autoLine2'>" + row.rankString + ": " + row.name + "</div>";
            } else if (row.rankString) {
                result = result + "<div class='autoLine2'>" + row.rankString + "</div>";
            }
        }
        result += '</a>';
        return result;
    };
    self.loadData = function(data) {
        if (!data) data = {};
        self['guid'](orBlank(data.guid));
        self['name'](orBlank(data.name));
        self['listId'](orBlank(data.listId));

        if (self.guid()) {
            var bieUrl = 'http://bie.ala.org.au/';
            // lookup taxon details in bie
            $.ajax({
                url: bieUrl + 'ws/species/info/' + self.guid() + '.json',
                dataType: 'jsonp',
                success: function (data) {
                    var profileInfo = "<a href='${grailsApplication.config.bie.baseURL}/species/urn:lsid:biodiversity.org.au:afd.taxon:b49d8b75-eac1-4e52-8729-3311b02098ad' target='_blank'>";
                    var imageUrl = data.taxonConcept.smallImageUrl;
                    if (imageUrl) {
                        profileInfo += "<img title='Click to show profile' class='taxon-image ui-corner-all' src='"+imageUrl+"'></a>";
                    }
                    else {
                        profileInfo += "No profile image available";
                    }
                    self.transients.speciesInformation(profileInfo);
                }
            });
        }
        else {
            self.transients.speciesInformation("No profile information is available.");
        }
        if (!self.name()) {
            self.transients.editing(true);
        }
    };
    self.list = ko.computed(function() {
        if (self.transients.availableLists.length) {
            // Only supporting a single species list per activity at the moment.
            return self.transients.availableLists[0].listId;
        }
        return '';
    });

    if (data) {
        self.loadData(data);
    }
    self.transients.focused.subscribe(function(value) {
        if (!value && self.name()) {
            self.transients.editing(false);
        }
    });

    // The editing behaviour of a species data type needs to be coordinated with the table row editing
    // if that row supports single row editing.  We check for this by the existence of the isSelected
    // field (note that it is a knockout observable so we are checking for it's definition, not it's value)
    if (parentRow && parentRow.isSelected) {

        parentRow.isSelected.subscribe(function(value) {
            console.log("Change "+value);
            if (value) {
                self.edit();
            }
            else {
                self.transients.editing(false);
            }
        });

    }



};