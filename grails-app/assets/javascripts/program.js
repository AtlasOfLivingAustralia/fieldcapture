//= require tab-init.js
//= require slider-pro-master/js/jquery.sliderPro.min.js
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

    self.cancel = function() {
        var url = config.returnToUrl || config.programViewUrl;
        if (url) {
            window.location.href = url;
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

    var config = props.config || {};

    self.config = ko.observable(vkbeautify.json(config));

    var projectOutputReportCategory = 'Outputs Reporting';
    /**
     * Returns the currently configured activity report configuration.
     * Side effect: it is created if it doesn't exist.
     */
    var getActivityReportConfig = function() {
        var activityReportConfig;
        if (!config.projectReports) {
            config.projectReports = [];
        }
        activityReportConfig = _.find(config.projectReports, function(report) {
            return report.category == projectOutputReportCategory;
        });
        if (!activityReportConfig) {
            activityReportConfig = {reportType:'Activity', category:projectOutputReportCategory};
            config.projectReports.push(activityReportConfig);
        }

        return activityReportConfig;
    };

    var coreServicesReportCategory = 'Core Services Reporting';
    var getProgramReportConfig = function() {
        if (!config.programReports || config.programReports.length == 0) {
            config.programReports = [{type:'Administrative', category:coreServicesReportCategory}];
        }
        return config.programReports[0];
    };

    var activityReportConfig = getActivityReportConfig();
    var programReportConfig = getProgramReportConfig();

    self.coreServicesOptions = [
        {label:'Monthly (First period ends 31 July 2018)', firstReportingPeriodEnd:'2018-07-31T14:00:00Z', reportingPeriodInMonths:1},
        {label:'Bi-monthly (First period ends 31 August 2018)', firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:2},
        {label:"Quarterly - Group A (First period ends 30 September 2018)", firstReportingPeriodEnd:'2018-09-30T14:00:00Z', reportingPeriodInMonths:3},
        {label:"Quarterly - Group B (First period ends 31 August 2018)", firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:3}];

    var currentOption = _.find(self.coreServicesOptions, function(option) {
        return option.firstReportingPeriodEnd == programReportConfig.firstReportingPeriodEnd && option.reportingPeriodInMonths == programReportConfig.reportingPeriodInMonths;
    });
    self.coreServicesPeriod = ko.observable(currentOption ? currentOption.label : null);


    self.activityReportingOptions = [
        {label:"Quarterly (First period ends 30 September 2018)", firstReportingPeriodEnd:'2018-09-30T14:00:00Z', reportingPeriodInMonths:3},
        {label:"Half-yearly (First period ends 31 December 2018)", firstReportingPeriodEnd:'2018-12-31T13:00:00Z', reportingPeriodInMonths:6}];

    currentOption = _.find(self.activityReportingOptions, function(option) {
        return option.firstReportingPeriodEnd == activityReportConfig.firstReportingPeriodEnd && option.reportingPeriodInMonths == activityReportConfig.reportingPeriodInMonths;
    });
    self.activityReportingPeriod = ko.observable(currentOption ? currentOption.label : null);
    self.startDate = ko.observable(props.startDate).extend({simpleDate:false});
    self.endDate = ko.observable(props.endDate).extend({simpleDate:false});

    self.programReportCategories = ko.computed(function() {
        return _.map(config.programReports || [], function(report) {
            return report.category;
        });
    });
    self.selectedProgramReportCategories = ko.observableArray();

    self.projectReportCategories = ko.computed(function() {
       return _.map(config.projectReports || [], function(report) {
            return report.category;
        });
    });
    self.selectedProjectReportCategories = ko.observableArray();

    self.saveReportingConfiguration = function() {

        if ($(options.reportingConfigSelector).validationEngine('validate')) {
            var selectedCoreServicesPeriod = _.find(self.coreServicesOptions, function(option) {
                return option.label == self.coreServicesPeriod();
            });
            programReportConfig.firstReportingPeriodEnd = selectedCoreServicesPeriod.firstReportingPeriodEnd;
            programReportConfig.reportingPeriodInMonths = selectedCoreServicesPeriod.reportingPeriodInMonths;

            var selectedActivityReportingPeriod = _.find(self.activityReportingOptions, function(option) {
                return option.label == self.activityReportingPeriod();
            });
            activityReportConfig.firstReportingPeriodEnd = selectedActivityReportingPeriod.firstReportingPeriodEnd;
            activityReportConfig.reportingPeriodInMonths = selectedActivityReportingPeriod.reportingPeriodInMonths;

            blockUIWithMessage("Saving configuration...");
            self.saveConfig(config).done(function() {
                blockUIWithMessage("Regenerating reports...");
                self.regenerateReports([coreServicesReportCategory], [projectOutputReportCategory]).done(function() {
                    window.location.reload();
                }).fail(function() {
                    $.unblockUI();
                });
            });
        }
    };

    self.saveConfig = function(config) {
        var json = {
            config: config,
            startDate:self.startDate(),
            endDate:self.endDate()
        };
        return $.ajax({
            url: options.programSaveUrl,
            type: 'POST',
            data: JSON.stringify(json),
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Save failed");
        });
    };

    self.regenerateReportsByCategory = function() {
        blockUIWithMessage("Regenerating reports...");
        self.regenerateReports(self.selectedProgramReportCategories(), self.selectedProjectReportCategories()).done(function() {
            blockUIWithMessage("Reports successfully regenerated, reloading page...");
            setTimeout(function(){
                window.location.reload();
            }, 1000);

        }).fail(function() {
            $.unblockUI();
        });
    };

    self.regenerateReports = function(programReportCategories, projectReportCategories) {
        var data = JSON.stringify({programReportCategories:programReportCategories, projectReportCategories:projectReportCategories});
        return $.ajax({
            url: options.regenerateProgramReportsUrl,
            type: 'POST',
            data: data,
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Failed to regenerate program reports");
        });

    };

    self.saveProgramConfiguration = function() {

        try {
            config = JSON.parse(self.config());
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }
        self.saveConfig(config).done(function (data) {
            bootbox.alert("Program configuration saved");
        });

    };

    var tabs = {
        'about': {
            initialiser: function () {
                if (self.mainImageUrl()) {
                    $('#carousel').sliderPro({
                        width: '100%',
                        height: 'auto',
                        autoHeight: true,
                        arrows: false, // at the moment we only support 1 image
                        buttons: false,
                        waitForLayers: true,
                        fade: true,
                        autoplay: false,
                        autoScaleLayers: false,
                        touchSwipe: false // at the moment we only support 1 image
                    });
                }
            }
        },
        'projects': {
            initialiser: function() {
                $.fn.dataTable.moment( 'dd-MM-yyyy' );
                $('#projectList').DataTable({displayLength:25, order:[[2, 'asc'], [3, 'asc']]});
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
                $(options.reportingConfigSelector).validationEngine();
            }
        }
    };

    self.initialise = function() {
        initialiseTabs(tabs, {tabSelector:'#program-tabs.nav a', tabStorageKey:'selected-program-tab'});
    };
};