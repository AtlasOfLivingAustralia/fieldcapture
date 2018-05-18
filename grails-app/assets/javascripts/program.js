//= require tab-init.js

//= require mapWithFeatures.js
//= require sites
//= require document
//= require reporting

/**
 * Knockout view model for program pages.
 * @param props JSON/javascript representation of the program.
 * @param options an object specifying the following options:
 * validationContainerSelector, programDeleteUrl, returnToUrl, programEditUrl, programViewUrl
 * @constructor
 */
ProgramViewModel = function (props, options) {
    var self = $.extend(this, new Documents(options));

    var defaults = {
        validationContainerSelector: '.validationEngineContainer'
    };
    var config = _.extend({}, defaults, options);

    self.programId = props.programId;
    self.name = ko.observable(props.name);
    self.description = ko.observable(props.description).extend({markdown: true});
    self.url = ko.observable(props.url);
    self.newsAndEvents = ko.observable(props.newsAndEvents).extend({markdown: true});

    self.projects = props.projects;

    self.deleteProgram = function () {
        if (window.confirm("Delete this program?  Are you sure?")) {
            $.post(config.programDeleteUrl).complete(function () {
                    window.location = config.returnToUrl;
                }
            );
        }
    };

    self.editDescription = function () {
        editWithMarkdown('Edit organisation description', self.description);
    };

    self.editOrganisation = function () {
        window.location = config.programEditUrl;
    };

    self.transients = self.transients || {};

    self.toJS = function (includeDocuments) {
        var ignore = self.ignore.concat(['projects', 'reports']);
        var js = ko.mapping.toJS(self, {include: ['documents'], ignore: ignore});
        if (includeDocuments) {
            js.documents = ko.toJS(self.documents);
            js.links = ko.mapping.toJS(self.links());
        }
        return js;
    };

    self.modelAsJSON = function (includeDocuments) {
        var orgJs = self.toJS(includeDocuments);
        return JSON.stringify(orgJs);
    };

    self.save = function () {
        if ($(config.validationContainerSelector).validationEngine('validate')) {
            self.saveWithErrorDetection(
                function (data) {
                    var programId = self.programId ? self.programId : data.programId;

                    var url;
                    if (config.returnToUrl) {
                        url = config.returnToUrl;
                        url += (config.returnToUrl.indexOf('?') > 0) ? '&' : '?';
                        url += 'programId=' + programId;
                    }
                    else {
                        url = config.programViewUrl + '/' + programId;
                    }
                    window.location.href = url;
                },
                function (data) {
                    bootbox.alert('<span class="label label-important">Error</span><p>' + data.detail + '</p>');
                });
        }
    };

    if (props.documents !== undefined && props.documents.length > 0) {
        $.each(['logo', 'banner', 'mainImage'], function (i, role) {
            var document = self.findDocumentByRole(props.documents, role);
            if (document) {
                self.documents.push(document);
            }
        });
    }

    // links
    if (props.links) {
        $.each(props.links, function (i, link) {
            self.addLink(link.role, link.url);
        });
    }

    autoSaveModel(self, config.programSaveUrl,
        {
            blockUIOnSave: true,
            blockUISaveMessage: 'Saving programme....',
            serializeModel: function () {
                return self.modelAsJSON(true);
            }
        });



    return self;
};

var ProgramPageViewModel = function(props, options) {
    var self = this;
    _.extend(self, new ProgramViewModel(props, options));


    console.log(props.config);
    self.config = ko.observable(vkbeautify.json(props.config));
    self.firstMilestoneDate = ko.observable();
    self.milestonePeriod = ko.observable();
    self.coreServicesPeriod = ko.observable();

    self.saveProgramConfiguration = function() {
        var config = self.config();

        try {
            config = JSON.parse(config);
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }

        var json = {config: config};
        $.ajax({
            url: options.programSaveUrl,
            type: 'POST',
            data: JSON.stringify(json),
            dataType:'json',
            contentType: 'application/json'
        }).done(function () {
            bootbox.alert("Program configuration saved");
        }).fail(function() {
            bootbox.alert("Save failed");
        });
    };

    var tabs = {
        'about': {
            initialiser: function () {}
        },
        'projects': {
            initialiser: function() {
                $.fn.dataTable.moment( 'dd-MM-yyyy' );
                $('#projectList').DataTable();
            }
        },
        'sites': {
            initialiser: function () {
                generateMap(['programId:'+self.programId], false, {includeLegend:false});
            }
        },
        'admin': {
            initialiser: function () {
                populatePermissionsTable();
            }
        }
    };

    initialiseTabs(tabs, {tabSelector:'#program-tabs.nav a', tabStorageKey:'selected-program-tab'});
};