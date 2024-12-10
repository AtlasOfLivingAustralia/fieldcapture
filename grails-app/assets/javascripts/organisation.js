//= require tab-init.js
//= require attach-document-no-ui
//= require reportService
//= require components.js
//= require ecodata-components.js
//= require budget.js
/**
 * Knockout view model for organisation pages.
 * @param props JSON/javascript representation of the organisation.
 * @param options an object specifying the following options:
 * validationContainerSelector, organisationDeleteUrl,organisationListUrl, returnToUrl, organisationSaveUrl, organisationEditUrl
 * viewProjectUrl, documentUpdateUrl, documentDeleteUrl, prepopulateAbnUrl
 * @constructor
 */
OrganisationViewModel = function (props, options) {
    var self = $.extend(this, new Documents(options));

    var defaults = {
        validationContainerSelector: '.validationEngineContainer',
    };

    var config = _.extend({}, defaults, options);

    // Organisation entity types from the ABN lookup service
    self.entityTypes = [

    {code:"ADF", label:"Approved Deposit Fund"},
    {code:"ARF", label:"APRA Regulated Fund (Fund Type Unknown)"},
    {code:"CCB", label:"Commonwealth Government Public Company"},
    {code:"CCC",label:"Commonwealth Government Co-operative"},
    {code:"CCL", label:"Commonwealth Government Limited Partnership"},
    {code:"CCN", label:"Commonwealth Government Other Unincorporated Entity"},
    {code:"CCO", label:"Commonwealth Government Other Incorporated Entity"},
    {code:"CCP", label:"Commonwealth Government Pooled Development Fund"},
    {code:"CCR", label:"Commonwealth Government Private Company"},
    {code:"CCS", label:"Commonwealth Government Strata Title"},
    {code:"CCT", label:"Commonwealth Government Public Trading Trust"},
    {code:"CCU", label:"Commonwealth Government Corporate Unit Trust"},
    {code:"CGA", label:"Commonwealth Government Statutory Authority"},
    {code:"CGC", label:"Commonwealth Government Company"},
    {code:"CGE", label:"Commonwealth Government Entity"},
    {code:"CGP", label:"Commonwealth Government Partnership"},
    {code:"CGS", label:"Commonwealth Government Super Fund"},
    {code:"CGT", label:"Commonwealth Government Trust"},
    {code:"CMT", label:"Cash Management Trust"},
    {code:"COP", label:"Co-operative"},
    {code:"CSA", label:"Commonwealth Government APRA Regulated Public Sector Fund"},
    {code:"CSP", label:"Commonwealth Government APRA Regulated Public Sector Scheme"},
    {code:"CSS", label:"Commonwealth Government Non-Regulated Super Fund"},
    {code:"CTC", label:"Commonwealth Government Cash Management Trust"},
    {code:"CTD", label:"Commonwealth Government Discretionary Services Management Trust"},
    {code:"CTF", label:"Commonwealth Government Fixed Trust"},
    {code:"CTH", label:"Commonwealth Government Hybrid Trust"},
    {code:"CTI", label:"Commonwealth Government Discretionary Investment Trust"},
    {code:"CTL", label:"Commonwealth Government Listed Public Unit Trust"},
    {code:"CTQ", label:"Commonwealth Government Unlisted Public Unit Trust"},
    {code:"CTT", label:"Commonwealth Government Discretionary Trading Trust"},
    {code:"CTU", label:"Commonwealth Government Fixed Unit Trust"},
    {code:"CUT", label:"Corporate Unit Trust"},
    {code:"DES", label:"Deceased Estate"},
    {code:"DIP", label:"Diplomatic/Consulate Body or High Commissioner"},
    {code:"DIT", label:"Discretionary Investment Trust"},
    {code:"DST", label:"Discretionary Services Management Trust"},
    {code:"DTT", label:"Discretionary Trading Trust"},
    {code:"FHS", label:"First Home Saver Accounts Trust"},
    {code:"FPT", label:"Family Partnership"},
    {code:"FUT", label:"Fixed Unit Trust"},
    {code:"FXT", label:"Fixed Trust"},
    {code:"HYT", label:"Hybrid Trust"},
    {code:"IND", label:"Individual/Sole Trader"},
    {code:"LCB", label:"Local Government Public Company"},
    {code:"LCC", label:"Local Government Co-operative"},
    {code:"LCL", label:"Local Government Limited Partnership"},
    {code:"LCN", label:"Local Government Other Unincorporated Entity"},
    {code:"LCO", label:"Local Government Other Incorporated Entity"},
    {code:"LCP", label:"Local Government Pooled Development Fund"},
    {code:"LCR", label:"Local Government Private Company"},
    {code:"LCS", label:"Local Government Strata Title"},
    {code:"LCT", label:"Local Government Public Trading Trust"},
    {code:"LCU", label:"Local Government Corporate Unit Trust"},
    {code:"LGA", label:"Local Government Statutory Authority"},
    {code:"LGC", label:"Local Government Company"},
    {code:"LGE", label:"Local Government Entity"},
    {code:"LGP", label:"Local Government Partnership"},
    {code:"LGT", label:"Local Government Trust"},
    {code:"LPT", label:"Limited Partnership"},
    {code:"LSA", label:"Local Government APRA Regulated Public Sector Fund"},
    {code:"LSP", label:"Local Government APRA Regulated Public Sector Scheme"},
    {code:"LSS", label:"Local Government Non-Regulated Super Fund"},
    {code:"LTC", label:"Local Government Cash Management Trust"},
    {code:"LTD", label:"Local Government Discretionary Services Management Trust"},
    {code:"LTF", label:"Local Government Fixed Trust"},
    {code:"LTH", label:"Local Government Hybrid Trust"},
    {code:"LTI", label:"Local Government Discretionary Investment Trust"},
    {code:"LTL", label:"Local Government Listed Public Unit Trust"},
    {code:"LTQ", label:"Local Government Unlisted Public Unit Trust"},
    {code:"LTT", label:"Local Government Discretionary Trading Trust"},
    {code:"LTU", label:"Local Government Fixed Unit Trust"},
    {code:"NPF", label:"APRA Regulated Non-Public Offer Fund"},
    {code:"NRF", label:"Non-Regulated Superannuation Fund"},
    {code:"OIE", label:"Other Incorporated Entity"},
    {code:"PDF", label:"Pooled Development Fund"},
    {code:"POF", label:"APRA Regulated Public Offer Fund"},
    {code:"PQT", label:"Unlisted Public Unit Trust"},
    {code:"PRV", label:"Australian Private Company"},
    {code:"PST", label:"Pooled Superannuation Trust"},
    {code:"PTR", label:"Other Partnership"},
    {code:"PTT", label:"Public Trading trust"},
    {code:"PUB", label:"Australian Public Company"},
    {code:"PUT", label:"Listed Public Unit Trust"},
    {code:"SAF", label:"Small APRA Regulated Fund"},
    {code:"SCB", label:"State Government Public Company"},
    {code:"SCC", label:"State Government Co-operative"},
    {code:"SCL", label:"State Government Limited Partnership"},
    {code:"SCN", label:"State Government Other Unincorporated Entity"},
    {code:"SCO", label:"State Government Other Incorporated Entity"},
    {code:"SCP", label:"State Government Pooled Development Fund"},
    {code:"SCR", label:"State Government Private Company"},
    {code:"SCS", label:"State Government Strata Title"},
    {code:"SCT", label:"State Government Public Trading Trust"},
    {code:"SCU", label:"State Government Corporate Unit Trust"},
    {code:"SGA", label:"State Government Statutory Authority"},
    {code:"SGC", label:"State Government Company"},
    {code:"SGE", label:"State Government Entity"},
    {code:"SGP", label:"State Government Partnership"},
    {code:"SGT", label:"State Government Trust"},
    {code:"SMF", label:"ATO Regulated Self-Managed Superannuation Fund"},
    {code:"SSA", label:"State Government APRA Regulated Public Sector Fund"},
    {code:"SSP", label:"State Government APRA Regulated Public Sector Scheme"},
    {code:"SSS", label:"State Government Non-Regulated Super Fund"},
    {code:"STC", label:"State Government Cash Management Trust"},
    {code:"STD", label:"State Government Discretionary Services Management Trust"},
    {code:"STF", label:"State Government Fixed Trust"},
    {code:"STH", label:"State Government Hybrid Trust"},
    {code:"STI", label:"State Government Discretionary Investment Trust"},
    {code:"STL", label:"State Government Listed Public Unit Trust"},
    {code:"STQ", label:"State Government Unlisted Public Unit Trust"},
    {code:"STR", label:"Strata-title"},
    {code:"STT", label:"State Government Discretionary Trading Trust"},
    {code:"STU", label:"State Government Fixed Unit Trust"},
    {code:"SUP", label:"Super Fund"},
    {code:"TCB", label:"Territory Government Public Company"},
    {code:"TCC", label:"Territory Government Co-operative"},
    {code:"TCL", label:"Territory Government Limited Partnership"},
    {code:"TCN", label:"Territory Government Other Unincorporated Entity"},
    {code:"TCO", label:"Territory Government Other Incorporated Entity"},
    {code:"TCP", label:"Territory Government Pooled Development Fund"},
    {code:"TCR", label:"Territory Government Private Company"},
    {code:"TCS", label:"Territory Government Strata Title"},
    {code:"TCT", label:"Territory Government Public Trading Trust"},
    {code:"TCU", label:"Territory Government Corporate Unit Trust"},
    {code:"TGA", label:"Territory Government Statutory Authority"},
    {code:"TGE", label:"Territory Government Entity"},
    {code:"TGP", label:"Territory Government Partnership"},
    {code:"TGT", label:"Territory Government Trust"},
    {code:"TRT", label:"Other trust"},
    {code:"TSA", label:"Territory Government APRA Regulated Public Sector Fund"},
    {code:"TSP", label:"Territory Government APRA Regulated Public Sector Scheme"},
    {code:"TSS", label:"Territory Government Non-Regulated Super Fund"},
    {code:"TTC", label:"Territory Government Cash Management Trust"},
    {code:"TTD", label:"Territory Government Discretionary Services Management Trust"},
    {code:"TTF", label:"Territory Government Fixed Trust"},
    {code:"TTH", label:"Territory Government Hybrid Trust"},
    {code:"TTI", label:"Territory Government Discretionary Investment Trust"},
    {code:"TTL", label:"Territory Government Listed Public Unit Trust"},
    {code:"TTQ", label:"Territory Government Unlisted Public Unit Trust"},
    {code:"TTT", label:"Territory Government Discretionary Trading Trust"},
    {code:"TTU", label:"Territory Government Fixed Unit Trust"},
    {code:"UIE", label:"Other Unincorporated Entity"}];

    self.organisationId = props.organisationId;
    self.entityType = ko.observable(props.entityType);
    self.orgType = ko.observable(props.orgType);
    self.name = ko.observable(props.name);
    self.entityName = ko.observable(props.entityName);
    self.businessNames = ko.observableArray(props.businessNames);
    self.contractNames = ko.observableArray(props.contractNames);
    self.acronym = ko.observable(props.acronym);
    self.description = ko.observable(props.description).extend({markdown:true});
    self.abn = ko.observable(props.abn);
    self.abnStatus = ko.observable(props.abnStatus);
    self.postcode = ko.observable(props.postcode);
    self.state = ko.observable(props.state);
    self.url = ko.observable(props.url);
    self.newsAndEvents = ko.observable(props.newsAndEvents).extend({markdown:true});;
    self.collectoryInstitutionId = props.collectoryInstitutionId;
    self.breadcrumbName = ko.computed(function() {
        return self.name()?self.name():'New Organisation';
    });
    self.associatedOrgs = ko.observableArray(props.associatedOrgs);
    self.externalIds = ko.observableArray(_.map(props.externalIds, function (externalId) {
        return {
            idType: ko.observable(externalId.idType),
            externalId: ko.observable(externalId.externalId)
        };
    }));
    self.externalIdTypes = [
        'TECH_ONE_PARTY_ID'
    ];
    self.indigenousOrganisationTypes = [
        'Office of the Registrar of Indigenous Corporations (ORIC)',
        'Under the Corporations (Aboriginal and Torres Strait Islander) Act 2006 (CATSI Act)',
        'Australian Securities and Investments Commission (ASIC)'
    ];
    self.indigenousOrganisationRegistration = ko.observableArray(props.indigenousOrganisationRegistration);
    self.organisationSearchUrl = options && options.organisationSearchUrl;


    self.orgType = ko.pureComputed(function() {
       var entityType = _.find(self.entityTypes, function(entityType) {
           return entityType.code == self.entityType();
       });
       return entityType ? entityType.label : null;
    });
    self.clearAbnDetails = function() {
        self.abn(null);
        self.entityName(null);
        self.businessNames(null);
        self.entityType(null);
    };

    self.projects = props.projects;

    self.editDescription = function() {
        editWithMarkdown('Edit organisation description', self.description);
    };

    self.transients = self.transients || {};

    self.prepopulateFromABN = function() {
        if ($(config.abnSelector).validationEngine()) {
            var abn = self.abn;
            $.get(config.prepopulateAbnUrl, {abn:abn, contentType:'application/json'}).done(function (orgDetails) {
                if (orgDetails.error === "invalid") {
                    bootbox.alert("Abn Number is invalid");
                } else {
                    self.entityName(orgDetails.entityName);
                    self.businessNames(orgDetails.businessNames);
                    self.postcode(orgDetails.postcode);
                    self.state(orgDetails.state);
                    self.abnStatus(orgDetails.abnStatus);
                    self.entityType(orgDetails.entityType);
                    if (!self.name()) {
                        var defaultName = '';
                        if (self.businessNames().length > 0) {
                            defaultName = self.businessNames()[0];
                        }
                        else if (self.entityName()) {
                            defaultName = self.entityName();
                        }
                        self.name(defaultName);
                    }
                }
            }).fail(function () {
                bootbox.alert("Abn Web Service is failed to lookup abn name. Please press ok to continue to create organisation");
                self.name(" ");
            });

        }
    };

    self.abnStatus.subscribe(function(value) {
        if (value == 'N/A') {
            self.clearAbnDetails();
        }
    });

    if (props.documents !== undefined && props.documents.length > 0) {
        $.each(['logo', 'banner', 'mainImage'], function(i, role){
            var document = self.findDocumentByRole(props.documents, role);
            if (document) {
                self.documents.push(document);
            }
        });
    }

    // links
    if (props.links) {
        $.each(props.links, function(i, link) {
            self.addLink(link.role, link.url, link.documentId);
        });
    }

    return self;

};

EditOrganisationViewModel = function(props, options) {
    var self = this;
    _.extend(self, new OrganisationViewModel(props, options));

    self.onPasteAbn = function(vm, event) {

        if (event.originalEvent && event.originalEvent.clipboardData) {
            text = event.originalEvent.clipboardData.getData("text/plain");

            // remove any non digit characters from the data - this is because if you copy and paste an ABN it
            // is normally formatted with spaces.
            self.abn(text.replaceAll(/\D/g, ''));
        }


        // Indicate that text could be added into textbox
        return false;
    };

    /** We need to track changes to contract names so we can update the contract names in projects. */
    var contractNameChangeTracking = _.map(props.contractNames, function(name) {
        return {
            originalName: name,
            currentName: name,
            projects: props.contractNamesAndProjects[name],
            projectCount: function() {
                return props.contractNamesAndProjects[name] ? props.contractNamesAndProjects[name].length : 0;
            }
        }
    });

    self.getProjectCountForName = function(name) {
        var nameAndProjects = _.find(contractNameChangeTracking, function(nameAndProjects) {
            return nameAndProjects.currentName == name;
        });
        return nameAndProjects.projectCount();
    }

    self.getHelpText = function(name) {
        var projectCount = self.getProjectCountForName(name);
        if (projectCount > 0) {
            helpText = "This name is used by "+projectCount+" projects";
        }
        else {
            helpText = "This name is not used by any projects";
        }
        return helpText;
    };

    self.nameUsed = function(name) {
        return self.getProjectCountForName(name) > 0;
    }


    self.contractNames.subscribe(function(value) {

        var namesBeforeEdit = _.filter(_.map(contractNameChangeTracking, function(previous) {return previous.currentName} ), function(name) { return name != null});
        var namesAfterEdit = self.contractNames();
        var added = _.difference(namesAfterEdit, namesBeforeEdit);
        var removed = _.difference(namesBeforeEdit, namesAfterEdit);

        // New name added.  No project renaming action required here except to exclude it from appearing in the next edit
        if (added.length == 1 && removed.length == 0) {
            contractNameChangeTracking.push({originalName: null, currentName: added[0], projects:[], projectCount: function() { return 0; }});
        }

        // Name removed.  We will update project contract names to the organsiation name.
        if (removed.length == 1 && added.length == 0) {
            var name = _.find(contractNameChangeTracking, function(previous) {return previous.currentName == removed[0]});
            name.currentName = null;
        }

        // Name changed.  We will update project contract names to the new name.
        if (removed.length == 1 && added.length == 1) {
            var name = _.find(contractNameChangeTracking, function(previous) {return previous.currentName == removed[0]});
            name.currentName = added[0];
        }
    });

    self.getModifiedNames = function() {

        var modifiedNames = [];
        for (var i=0; i<contractNameChangeTracking.length; i++) {
            var nameAndProjects = contractNameChangeTracking[i];

            if (nameAndProjects.projectCount()) { // Don't need action for new names or unused names
                if (nameAndProjects.currentName == null) {
                    // need to update any contract names with the original name to the organisation name.
                    modifiedNames.push({oldName:nameAndProjects.originalName, newName:nameAndProjects.currentName});
                }
                else if (nameAndProjects.currentName != nameAndProjects.originalName) {
                    // need to update any contract names with the original name to the new name.
                    modifiedNames.push({oldName:nameAndProjects.originalName, newName:nameAndProjects.currentName});
                }
            }

        }

        return modifiedNames;
    };


    autoSaveModel(self, options.organisationSaveUrl,
        {
            blockUIOnSave:true,
            blockUISaveMessage:'Saving organisation....',
            healthCheckUrl: options.healthCheckUrl,
            serializeModel:function() {return self.modelAsJSON(true);}
        });

    self.save = function() {
        if ($(options.validationContainerSelector).validationEngine('validate')) {

            self.saveWithErrorDetection(
                function(data) {
                    var url = options.organisationViewUrl;
                    // When creating a new organisation we need the organisationId.
                    if (!self.organisationId && data.organisationId) {
                        url += '/' + data.organisationId;
                    }
                    window.location.href = url;
                },
                function(data) {
                    bootbox.alert('<span class="label label-important">Error</span><p>'+data.detail+'</p>');
                }
            );
        }
    };

    self.cancel = function() {
        window.location = options.returnTo;
    }

    self.attachValidation = function() {
        $(options.validationContainerSelector).validationEngine();
    };

    self.toJS = function(includeDocuments) {
        var ignore = self.ignore.concat(['breadcrumbName', 'entityTypes', 'externalIdTypes', 'organisationSearchUrl', 'collectoryInstitutionId', 'projects', 'reports', 'indigenousOrganisationTypes', 'dirtyFlag', 'selectedOrganisation']);
        var js = ko.mapping.toJS(self, {include:['documents'], ignore:ignore} );
        if (self.externalIds().length > 0) {
            js.externalIds = ko.mapping.toJS(self.externalIds);
        }
        if (includeDocuments) {
            js.documents = ko.toJS(self.documents);
            js.links = ko.mapping.toJS(self.links());
        }
        var contractNameChanges = self.getModifiedNames();
        if (contractNameChanges.length > 0) {
            js.contractNameChanges = contractNameChanges;
        }

        return js;
    };

    self.modelAsJSON = function(includeDocuments) {
        var orgJs = self.toJS(includeDocuments);
        orgJs.postcode = Number(orgJs.postcode);
        return JSON.stringify(orgJs);
    };

}


OrganisationPageViewModel = function (props, options) {
    var self = this;
    _.extend(self, new OrganisationViewModel(props, options));

    var tabs = {
        'about': {
            initialiser: function() {
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
        'dashboard': {
            initialiser: function() {
                var SELECTED_REPORT_KEY = 'selectedOrganisationReport';
                var selectedReport = amplify.store(SELECTED_REPORT_KEY);
                var $dashboardType = $('#dashboardType');
                // This check is to prevent errors when a particular organisation is missing a report or the user
                // permission set if different when viewing different organisations.
                if (!$dashboardType.find('option[value='+selectedReport+']')[0]) {
                    selectedReport = 'dashboard';
                }
                $dashboardType.val(selectedReport);
                $dashboardType.change(function(e) {
                    var $content = $('#dashboard-content');
                    var $loading = $('.loading-message');
                    $content.hide();
                    $loading.show();

                    var reportType = $dashboardType.val();

                    $.get(fcConfig.dashboardUrl, {report:reportType}).done(function(data) {
                        $content.html(data);
                        $loading.hide();
                        $content.show();
                        $('#dashboard-content .helphover').popover({animation: true, trigger:'hover', container:'body'});
                        amplify.store(SELECTED_REPORT_KEY, reportType);
                    });

                }).trigger('change');
            }
        },
        'projects': {
            initialiser: function() {}
        },
        'sites': {
            initialiser: function () {
                generateMap(['organisationFacet:' + self.name], false, {includeLegend: false});
            }
        },
        'admin': {
            initialiser: function () {
                populatePermissionsTable();
                $(options.reportingConfigSelector).validationEngine();
                var adminTabStateStorageKey = 'organisation-admin-tab-state'
                // remember state of admin nav (vertical tabs)
                $('#admin a.nav-link').on('shown.bs.tab', function (e) {
                    var tab = e.currentTarget.hash;
                    amplify.store(adminTabStateStorageKey, tab);
                });
                var storedAdminTab = amplify.store(adminTabStateStorageKey);
                // restore state if saved
                if (storedAdminTab) {
                    $(storedAdminTab + "-tab").tab('show');
                }

                var documentViewModelOptions = {
                    reports: undefined,
                    owner: {
                        organisationId:props.organisationId
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
                if (document.getElementById('edit-documents')) {
                    ko.applyBindings(viewModel, document.getElementById('edit-documents'))
                }
            }
        }
    };
    var organisationService = new OrganisationService(options);
    self.periods = options.targetPeriods || [];

    self.initialise = function() {
        $.fn.dataTable.moment( 'dd-MM-yyyy' );
        initialiseTabs(tabs, {tabSelector:'#orgTabs.nav a', tabStorageKey:'selected-organisation-tab'});
    };

    self.deleteOrganisation = function() {
        if (window.confirm("Delete this organisation?  Are you sure?")) {
            $.post(options.organisationDeleteUrl).complete(function() {
                    window.location = fcConfig.organisationListUrl;
                }
            );
        };
    };

    self.editOrganisation = function() {
       window.location = fcConfig.organisationEditUrl;
    };

    var reportService = new ReportService(options)

    var defaults = {
        validationContainerSelector: '.validationEngineContainer',
    };

    var config = props.config || {};
    self.config = ko.observable(vkbeautify.json(config));

    self.availableReportCategories = _.flatten(_.map(options.availableReportCategories || {}, function(reports, label) {
        return reports;
    }));

    self.organisationReportCategories = ko.computed(function() {
        return config.organisationReports || [];
    });

    var parsedConfig = function(suppressAlert) {
        var currentConfig = null;
        try {
            currentConfig = JSON.parse(self.config());
        }
        catch (e) {
            if (!suppressAlert) {
                bootbox.alert("The configuration is invalid. Please fix the configuration and try again.");
            }
        }
        return currentConfig;
    }

    self.isReportingEnabled = ko.computed(function() {
        var currentConfig = parsedConfig(true);
        if (!currentConfig) {
            return false;
        }
        if (self.availableReportCategories.length > 0) {
            return _.find(currentConfig.organisationReports || [], function(reportCategory) {
                return reportCategory.category == self.availableReportCategories[0].category;
            });
        }
        return false;
    });
    self.enableReporting = function() {
        if (self.isReportingEnabled()) {
            return;
        }
        var currentConfig = parsedConfig();
        if (!currentConfig) {
            return;
        }
        if (!currentConfig.organisationReports) {
            currentConfig.organisationReports = [];
        }
        // We want to put the reports at the front of the configuration so the (for some organisations) existing
        // performance management reports are at the end.
        for (var i=0; i<self.availableReportCategories.length; i++) {
            currentConfig.organisationReports.splice(i, 0, self.availableReportCategories[i]);
        }
        self.config(vkbeautify.json(currentConfig));
        setStartAndEndDateDefaults();
    };

    self.startDate = ko.observable().extend({simpleDate:false});
    self.endDate = ko.observable().extend({simpleDate:false});
    self.reportingEnabled = ko.observable();
    self.selectedOrganisationReportCategories = ko.observableArray();

    // List of service / target measure
    self.allTargetMeasures = [];
    var services = options.services || [];
    for (var i=0; i<services.length; i++) {
        if (services[i].scores) {
            for (var j=0; j<services[i].scores.length; j++) {
                self.allTargetMeasures.push( {
                    label:services[i].name+' - '+services[i].scores[j].label,
                    serviceId:services[i].id,
                    scoreId:services[i].scores[j].scoreId,
                    service:services[i],
                    score:services[i].scores[j],
                    value:services[i].scores[j].scoreId
                });
            }
        }
    }

    self.allTargetMeasures = _.sortBy(self.allTargetMeasures, 'label');
    var propDetails = props && props.custom && props.custom.details || {};
    self.selectedTargetMeasures = ko.observableArray();
    var details = new OrganisationDetailsViewModel(propDetails, props, self.periods, self.allTargetMeasures, options);
    updatedTargetMeasures(details);
    self.reportingTargetsAndFunding = ko.observable(details);
    self.isProjectDetailsLocked = ko.observable(false);

    var setStartAndEndDateDefaults = function() {
        var currentConfig = parsedConfig();
        if (!currentConfig || !currentConfig.organisationReports || currentConfig.organisationReports.length == 0) {
            return;
        }
        var periodStart = null;
        var periodEnd = null;
        for (var i=0; i<currentConfig.organisationReports.length; i++) {
            if (currentConfig.organisationReports[i].periodStart) {
                periodStart = currentConfig.organisationReports[i].periodStart;
            }
            if (currentConfig.organisationReports[i].periodEnd) {
                periodEnd = currentConfig.organisationReports[i].periodEnd;
            }
        }
        self.startDate(periodStart);
        self.endDate(periodEnd);
    };
    setStartAndEndDateDefaults();

    self.saveReportingConfiguration = function() {

        if ($(options.reportingConfigSelector).validationEngine('validate')) {

            var currentConfig = parsedConfig();
            if (!currentConfig) {
                return;
            }

            _.each(currentConfig.organisationReports, function(reportCategory) {
                reportCategory.periodStart = self.startDate();

                // The end date will be set to midnight at the start of the day because the datepicker
                // isn't supplying the time.  This causes issues with the display of the end date of the final
                // report because the final report end date is fudged because project end dates are a day early.
                // Setting a time of 23:59:59 fixes this.
                var periodEnd = moment(self.endDate());
                periodEnd.set('hour', 23);
                periodEnd.set('minute', 59);
                periodEnd.set('second', 59);

                reportCategory.periodEnd = periodEnd.toDate().toISOStringNoMillis();
            });

            blockUIWithMessage("Saving configuration...");
            self.saveConfig(currentConfig).done(function() {
                blockUIWithMessage("Configuration saved.  Reloading page...");
                window.location.reload();
            });
        }
    };

    self.regenerateReportsByCategory = function() {
        blockUIWithMessage("Regenerating reports...");
        var data = JSON.stringify({organisationReportCategories:self.selectedOrganisationReportCategories()});
        reportService.regenerateReports(data,options.regenerateOrganisationReportsUrl);
    };

    function updatedTargetMeasures (details) {
        var reportingTargets = details,
            selectedServices = reportingTargets.services.services(),
            allServices = self.allTargetMeasures;

        _.each(allServices, function (service) {
            var found = _.find(selectedServices, function (selectedService) {
                return selectedService.scoreId() === service.scoreId;
            });

            if (!found) {
                reportingTargets.services.addServiceTarget(service);
            }
        })
    }

    self.attachValidation = function() {
        $(options.organisationDetailsSelector).validationEngine('attach');
    };

    self.saveOrganisationConfiguration = function() {
        var currentConfig = parsedConfig();
        if (!currentConfig) {
            return;
        }
        blockUIWithMessage("Saving configuration...");
        return self.saveConfig(currentConfig).done(function (data) {
            blockUIWithMessage("Configuration saved...");
            setTimeout($.unblockUI, 1000);
        });

    };

    self.saveConfig = function(config) {
        var json = {
            config: config,
            abn: self.abn()
        };
        return saveOrganisation(json);
    };

    self.saveCustomFields = function() {
        if ($(options.organisationDetailsSelector).validationEngine('validate')) {
            blockUIWithMessage("Saving organisation data...");
            var json = JSON.parse(self.reportingTargetsAndFunding().modelAsJSON());
            saveOrganisation(json).done(function() {
                blockUIWithMessage("Organisation data saved...");
                setTimeout($.unblockUI, 1000);
            }).fail(function(){
                $.unblockUI();
            });
        }
    };


    var saveOrganisation = function(json) {
        return $.ajax({
            url: options.organisationSaveUrl,
            type: 'POST',
            data: JSON.stringify(json),
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Save failed");
        });
    };

    return self;

};

var ServerSideOrganisationsViewModel = function() {
    var self = this;
    self.pagination = new PaginationViewModel({}, self);
    self.organisations = ko.observableArray([]);
    self.searchTerm = ko.observable('').extend({throttle:500});
    self.searchTerm.subscribe(function(term) {
       self.refreshPage(0);
    });
    self.refreshPage = function(offset) {
        var url = fcConfig.organisationSearchUrl;
        var params = {offset:offset, max:self.pagination.resultsPerPage()};
        if (self.searchTerm()) {
            params.searchTerm = self.searchTerm();
        }
        else {
            params.sort = "nameSort"; // Sort by name unless there is a search term, in which case we sort by relevence.
        }
        $.get(url, params, function(data) {
            if (data.hits) {
                var orgs = data.hits.hits || [];
                self.organisations($.map(orgs, function(hit) {
                    if (hit._source.logoUrl) {
                        hit._source.documents = [{
                            role:'logo',
                            url: hit._source.logoUrl
                        }]
                    }
                    return new OrganisationViewModel(hit._source);
                }));
            }
            if (offset == 0) {
                self.pagination.loadPagination(0, data.hits.total);
            }

        });
    };
    self.refreshPage(0);
};


var OrganisationsViewModel = function(organisations, userOrgIds) {
    var self = this;

    var userOrgList = [], otherOrgList = [];
    for (var i=0; i<organisations.length; i++) {

        // Attach images to each organisations for display
        var orgView = new OrganisationViewModel(organisations[i]);
        orgView.searchableName = organisations[i].name;
        orgView.searchableDescription = organisations[i].description;

        if (userOrgIds && userOrgIds.indexOf(organisations[i].organisationId) >= 0) {
            userOrgList.push(orgView);
        }
        else {
            otherOrgList.push(orgView)
        }
    }

    var searchableUserList, searchableOtherList;

    self.searchTerm = ko.observable('');
    self.searchName = ko.observable(true);
    self.searchDescription = ko.observable(false);
    self.caseSensitive = ko.observable(false);

    var buildSearch = function() {
        var keys = [];
        if (self.searchName()) {
            keys.push('searchableName');
        }
        if (self.searchDescription()) {
            keys.push('searchableDescription');
        }

        var options = {keys:keys, caseSensitive:self.caseSensitive()};

        searchableUserList = new SearchableList(userOrgList, keys, options);
        searchableOtherList = new SearchableList(otherOrgList, keys, options);
    };

    buildSearch();

    self.delayedSearchTerm = ko.pureComputed(self.searchTerm).extend({rateLimit:{method:'notifyWhenChangesStop', timeout:400}});

    self.delayedSearchTerm.subscribe(function(term) {
        searchableUserList.term(term);
        searchableOtherList.term(term);
        self.pageNum(1);
        self.pageList(buildPageList());
    });

    this.userOrganisations = searchableUserList.results;
    this.otherOrganisations = searchableOtherList.results;

    this.pageNum = ko.observable(1);
    this.organisationsPerPage = 20;
    var maxPageButtons = 10;

    this.totalPages = ko.computed(function() {
        var count = self.userOrganisations().length + self.otherOrganisations().length;
        var pageCount = Math.floor(count / self.organisationsPerPage);
        return count % self.organisationsPerPage > 0 ? pageCount + 1 : pageCount;
    });

    this.currentPage = ko.computed(function() {
        var results = [].concat(self.userOrganisations(), self.otherOrganisations());
        var first = (self.pageNum()-1) * self.organisationsPerPage;
        return results.slice(first, first+self.organisationsPerPage);

    });

    function buildPageList() {
        var pages = [];
        var i;
        var currentPage = self.pageNum();
        var total = self.totalPages();
        if (total <= maxPageButtons) {
            for (i=1; i<=total; i++) {
                pages.push(i);
            }
            return pages;
        }

        if (currentPage <= (maxPageButtons / 2) + 1) {
            for (i=1; i<maxPageButtons; i++) {
                pages.push(i);
            }
            pages.push('..');
            pages.push(total);
            return pages;

        }

        if (currentPage > (total - (maxPageButtons / 2))) {
            pages.push(1);
            pages.push('..');
            for (i=total - maxPageButtons+2; i<=total; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push(1);
        pages.push('..');
        var start = currentPage-(maxPageButtons/2)+1;
        for (i=start; i<start+maxPageButtons-2; i++) {
            pages.push(i);
        }
        pages.push('..');
        pages.push(total);
        return pages;
    };

    this.pageList = ko.observableArray(buildPageList());

    this.hasPrev = ko.computed(function() {
        return self.pageNum() > 1;
    });

    this.hasNext = ko.computed(function() {
        return self.pageNum() < self.totalPages();
    });

    this.next = function() {
        if (self.hasNext()) {
            self.gotoPage(self.pageNum()+1);
        }
    };
    this.prev = function() {
        if (self.hasPrev()) {
            self.gotoPage(self.pageNum()-1);
        }
    };

    this.gotoPage = function(page) {
        if (page != '..') {
            self.pageNum(page);
            self.pageList(buildPageList());
            self.pageList.notifySubscribers();
        }
    };

    this.addOrganisation = function() {
        window.location = fcConfig.createOrganisationUrl;
    };

};
