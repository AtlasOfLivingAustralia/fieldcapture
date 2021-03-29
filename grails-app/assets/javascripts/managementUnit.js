//= require tab-init.js
//= require slider-pro-master/js/jquery.sliderPro.min.js
//= require mapWithFeatures.js
//= require sites
//= require attach-document-no-ui
//= require reporting
//= require leaflet-manifest
//= require blog
//= require leaflet-heatmap/heatmap.js
//= require leaflet-heatmap/leaflet-heatmap.js



/**
 * Knockout view model for managementUnit pages.
 * @param props JSON/javascript representation of the managementUnit.
 * @param options an object specifying the following options:
 * validationContainerSelector, managementUnitDeleteUrl, returnToUrl, managementUnitEditUrl, managementUnitViewUrl
 * @constructor
 */
ManagementUnitViewModel = function (props, options) {
    var self = $.extend(this, new Documents(options));

    var defaults = {
        validationContainerSelector: '.validationEngineContainer'
    };
    var config = _.extend({}, defaults, options);

    self.managementUnitId = props.managementUnitId;
    self.name = ko.observable(props.name);
    self.description = ko.observable(props.description).extend({markdown: true});
    self.url = ko.observable(props.url);
    self.newsAndEvents = ko.observable(props.newsAndEvents).extend({markdown: true});
    self.managementUnitSiteId = ko.observable(props.managementUnitSiteId);
    self.mapFeatures =  ko.observable(props.mapFeatures);
    self.projects = props.projects;

    self.deleteManagementUnit = function () {
        if (window.confirm("Delete this managementUnit?  Are you sure?")) {
            $.post(config.managementUnitDeleteUrl).complete(function () {
                    window.location = config.returnToUrl;
                }
            );
        }
    };

    self.editDescription = function () {
        editWithMarkdown('Edit management unit description', self.description);
    };

    self.editOrganisation = function () {
        window.location = config.managementUnitEditUrl;
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
                    var managementUnitId = self.managementUnitId ? self.managementUnitId : data.managementUnitId;

                    var url;
                    if (config.returnToUrl) {
                        url = config.returnToUrl;
                        url += (config.returnToUrl.indexOf('?') > 0) ? '&' : '?';
                        url += 'managementUnitId=' + managementUnitId;
                    }
                    else {
                        url = config.managementUnitViewUrl + '/' + managementUnitId;
                    }
                    window.location.href = url;
                },
                function (data) {
                    bootbox.alert('<span class="label label-important">Error</span><p>' + data.detail + '</p>');
                });
        }
    };

    self.cancel = function() {
        var url = config.returnToUrl || config.managementUnitViewUrl;
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

    autoSaveModel(self, config.managementUnitSaveUrl,
        {
            healthCheckUrl: config.healthCheckUrl,
            blockUIOnSave: true,
            blockUISaveMessage: 'Saving the management unit....',
            serializeModel: function () {
                return self.modelAsJSON(true);
            }
        });



    return self;
};

var ManagementUnitPageViewModel = function(props, options) {
    var self = this;
    if (!options.$window) {
        options.$window = window;
    }
    _.extend(self, new ManagementUnitViewModel(props, options));

    var config = props.config || {};
    var priorities = props.priorities || [];

    self.config = ko.observable(vkbeautify.json(config));
    self.priorities = ko.observable(vkbeautify.json(priorities));

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
    var getManagementUnitReportConfig = function() {
        if (!config.managementUnitReports || config.managementUnitReports.length == 0) {
            config.managementUnitReports = [{type:'Administrative', category:coreServicesReportCategory}];
        }
        return config.managementUnitReports[0];
    };

    var activityReportConfig = getActivityReportConfig();
    var managementUnitReportConfig = getManagementUnitReportConfig();

    self.coreServicesOptions = [
        {label:'Monthly (First period ends 31 July 2018)', firstReportingPeriodEnd:'2018-07-31T14:00:00Z', reportingPeriodInMonths:1, reportConfigLabel:'Monthly'},
        {label:'Bi-monthly (First period ends 31 August 2018)', firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:2, reportConfigLabel:'Bi-monthly'},
        {label:"Quarterly - Group A (First period ends 30 September 2018)", firstReportingPeriodEnd:'2018-09-30T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarterly - Group A'},
        {label:"Quarterly - Group B (First period ends 31 August 2018)", firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarterly - Group B'}];

    var currentOption = _.find(self.coreServicesOptions, function(option) {
        return option.firstReportingPeriodEnd == managementUnitReportConfig.firstReportingPeriodEnd && option.reportingPeriodInMonths == managementUnitReportConfig.reportingPeriodInMonths;
    });
    self.coreServicesPeriod = ko.observable(currentOption ? currentOption.label : null);


    self.activityReportingOptions = [
        {label:"Quarterly (First period ends 30 September 2018)", firstReportingPeriodEnd:'2018-09-30T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarter'},
        {label:"Half-yearly (First period ends 31 December 2018)", firstReportingPeriodEnd:'2018-12-31T13:00:00Z', reportingPeriodInMonths:6, reportConfigLabel:'Semester'}];

    currentOption = _.find(self.activityReportingOptions, function(option) {
        return option.firstReportingPeriodEnd == activityReportConfig.firstReportingPeriodEnd && option.reportingPeriodInMonths == activityReportConfig.reportingPeriodInMonths;
    });
    self.activityReportingPeriod = ko.observable(currentOption ? currentOption.label : null);
    self.startDate = ko.observable(props.startDate).extend({simpleDate:false});
    self.endDate = ko.observable(props.endDate).extend({simpleDate:false});

    self.managementUnitReportCategories = ko.computed(function() {
        return _.map(config.managementUnitReports || [], function(report) {
            return report.category;
        });
    });
    self.selectedManagementUnitReportCategories = ko.observableArray();

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
            managementUnitReportConfig.firstReportingPeriodEnd = selectedCoreServicesPeriod.firstReportingPeriodEnd;
            managementUnitReportConfig.reportingPeriodInMonths = selectedCoreServicesPeriod.reportingPeriodInMonths;
            managementUnitReportConfig.label = selectedCoreServicesPeriod.reportConfigLabel;

            var selectedActivityReportingPeriod = _.find(self.activityReportingOptions, function(option) {
                return option.label == self.activityReportingPeriod();
            });
            activityReportConfig.firstReportingPeriodEnd = selectedActivityReportingPeriod.firstReportingPeriodEnd;
            activityReportConfig.reportingPeriodInMonths = selectedActivityReportingPeriod.reportingPeriodInMonths;
            activityReportConfig.label = selectedActivityReportingPeriod.reportConfigLabel;

            blockUIWithMessage("Saving configuration...");
            self.saveConfig(config).done(function() {
                blockUIWithMessage("Regenerating reports...");
                self.regenerateReports([coreServicesReportCategory], [projectOutputReportCategory]).done(function() {
                    options.$window.location.reload();
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
        return saveManagementUnit(json);
    };

    var saveManagementUnit = function(json) {
        return $.ajax({
            url: options.managementUnitSaveUrl,
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
        self.regenerateReports(self.selectedManagementUnitReportCategories(), self.selectedProjectReportCategories()).done(function() {
            blockUIWithMessage("Reports successfully regenerated, reloading page...");
            setTimeout(function(){
                window.location.reload();
            }, 1000);

        }).fail(function() {
            $.unblockUI();
        });
    };

    self.regenerateReports = function(managementUnitReportCategories, projectReportCategories) {
        var data = JSON.stringify({managementUnitReportCategories:managementUnitReportCategories, projectReportCategories:projectReportCategories});
        return $.ajax({
            url: options.regenerateManagementUnitReportsUrl,
            type: 'POST',
            data: data,
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Failed to regenerate management unit reports");
        });

    };

    self.saveManagementUnitConfiguration = function() {

        try {
            config = JSON.parse(self.config());
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }
        self.saveConfig(config).done(function (data) {
            bootbox.alert("Management Unit configuration saved");
        });

    };

    self.saveManagementUnitPriorities = function() {
        var priorities;
        try {
            priorities = JSON.parse(self.priorities());
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }
        saveManagementUnit({priorities:priorities}).done(function() {
            bootbox.alert("Management Unit priorities saved!");
        });
    };

     self.createHeatmapOfSites = function(map){
         var searchUrl = fcConfig.geoSearchUrl +"?max=10000&geo=true&markBy=false&heatmap=true"
             + "&fq=managementUnitId:" +self.managementUnitId;
         $.getJSON(searchUrl, function(data) {
             var heatMapPoints = [];
             _.each(data.projects, function(project) {
                if (project.geo && project.geo.length > 0) {
                    $.each(project.geo, function(k, el) {
                        var lat = parseFloat(el.loc.lat);
                        var lon = parseFloat(el.loc.lon);
                        var point = _.find(heatMapPoints, function(latLon) {
                            return (latLon.lat == lat && latLon.lon == lon);
                        });
                        if (point) {
                            point.count++;
                        }
                        else {
                            heatMapPoints.push({lat:lat,lon:lon,count:1});
                        }
                    });
                }
             });

             var data = {
                data: heatMapPoints
             };
             createHeatMap(map,data);
         });
     };

   var createHeatMap = function(map,heatPoints){
        var cfg = {
            "radius": 15,
            "gradient": { 0.25: "rgb(0,0,255)", 0.4: "rgb(0,255,0)", 0.7: "rgb(0,255,0)", 0.9: "rgb(0,255,0)"},
            "useLocalExtrema": true,
            latField: 'lat',
            lngField: 'lon',
            valueField: 'count'
        };

        var heatmapLayer = new HeatmapOverlay(cfg);

        map.featureLayer.addLayer(heatmapLayer)

        heatmapLayer.setData(heatPoints);
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
                $.fn.dataTable.moment( 'dd-MM-yyyy' );
                //Regex to pick up project tables in programs
                $("[id^=projectOverviewList-]").DataTable({displayLength:25, order:[[2, 'asc'], [3, 'asc']]});
                $("[id^=projectList-]").DataTable({displayLength:25, order:[[2, 'asc'], [3, 'asc']]});

                //create a empty map.
                var map = createMap({
                    useAlaMap:true,
                    zoomControl:false,
                    defaultLayersControl:false,
                    allowSearchLocationByAddress: false,
                    allowSearchRegionByAddress: false,
                    showFitBoundsToggle:false,
                    useMyLocation:false,
                    mapContainerId:'managementUnitSiteMap',
                    width: '100%'

                });
                if (self.managementUnitSiteId){
                    if (!self.mapFeatures()) {
                        console.log("There was a problem obtaining management unit site data");
                    } else{
                         map.addFeature(self.mapFeatures())
                    }
                }

                self.createHeatmapOfSites(map);
            }
        },
        'blog' : {
            initialiser: function() {}
        },
        'projects': {
            initialiser: function() {
                $.fn.dataTable.moment( 'dd-MM-yyyy' );
                $('#projectList').DataTable({displayLength:25, order:[[2, 'asc'], [3, 'asc']]});
            }
        },
        'sites': {
            initialiser: function () {
                generateMap(['managementUnitId:'+self.managementUnitId], false, {includeLegend:false});
            }
        },
        'admin': {
            initialiser: function () {
                populatePermissionsTable();
                $(options.reportingConfigSelector).validationEngine();

                var reports = _.map(props.reports || [], function(report) {
                    return {reportId:report.reportId, name:report.name};
                });
                var documentViewModelOptions = {
                    reports: reports,
                    owner: {
                        managementUnitId:props.managementUnitId
                    },
                    documentDefaults: {
                        role: DOCUMENT_CONTRACT_ASSURANCE,
                        public: false
                    },
                    modalSelector: '#attachDocument',
                    documentUpdateUrl: options.documentUpdateUrl,
                    documentDeleteUrl: options.documentDeleteUrl,
                    imageLocation: options.imageLocation
                };
                var viewModel = new EditableDocumentsViewModel(documentViewModelOptions);
                viewModel.loadDocuments(props.documents);
                ko.applyBindings(viewModel, document.getElementById('edit-documents'))
            }
        }
    };

    self.initialise = function() {
        initialiseTabs(tabs, {tabSelector:'#managementUnit-tabs.nav a', tabStorageKey:'selected-managementUnit-tab'});
    };
};