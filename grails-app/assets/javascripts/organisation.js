//= require tab-init.js
//= require reportService
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

    var orgTypesMap = {
        aquarium:'Aquarium',
        archive:'Archive',
        botanicGarden:'Botanic Garden',
        conservation:'Conservation',
        fieldStation:'Field Station',
        government:'Government',
        governmentDepartment:'Government Department',
        herbarium:'Herbarium',
        historicalSociety:'Historical Society',
        horticulturalInstitution:'Horticultural Institution',
        independentExpert:'Independent Expert',
        industry:'Industry',
        laboratory:'Laboratory',
        library:'Library',
        management:'Management',
        museum:'Museum',
        natureEducationCenter:'Nature Education Center',
        nonUniversityCollege:'Non-University College',
        park:'Park',
        repository:'Repository',
        researchInstitute:'Research Institute',
        school:'School',
        scienceCenter:'Science Center',
        society:'Society',
        university:'University',
        voluntaryObserver:'Voluntary Observer',
        zoo:'Zoo'
    };

    self.organisationId = props.organisationId;
    self.orgType = ko.observable(props.orgType);
    self.orgTypeDisplayOnly = ko.computed(function() {
        return orgTypesMap[self.orgType()] || "Unspecified";
    });
    self.name = ko.observable(props.name);
    self.acronym = ko.observable(props.acronym);
    self.description = ko.observable(props.description).extend({markdown:true});
    self.abn = ko.observable(props.abn);
    self.url = ko.observable(props.url);
    self.newsAndEvents = ko.observable(props.newsAndEvents).extend({markdown:true});;
    self.collectoryInstitutionId = props.collectoryInstitutionId;
    self.breadcrumbName = ko.computed(function() {
        return self.name()?self.name():'New Organisation';
    });

    self.projects = props.projects;

    self.editDescription = function() {
        editWithMarkdown('Edit organisation description', self.description);
    };

    self.transients = self.transients || {};
    self.transients.orgTypes = [];
    for (var ot in orgTypesMap) {
        if (orgTypesMap.hasOwnProperty(ot))
            self.transients.orgTypes.push({orgType:ot, name:orgTypesMap[ot]});
    }

    self.toJS = function(includeDocuments) {
        var ignore = self.ignore.concat(['breadcrumbName', 'orgTypeDisplayOnly', 'collectoryInstitutionId', 'projects', 'reports']);
        var js = ko.mapping.toJS(self, {include:['documents'], ignore:ignore} );
        if (includeDocuments) {
            js.documents = ko.toJS(self.documents);
            js.links = ko.mapping.toJS(self.links());
        }
        return js;
    };

    self.modelAsJSON = function(includeDocuments) {
        var orgJs = self.toJS(includeDocuments);
        return JSON.stringify(orgJs);
    };

    self.save = function() {
        if ($('.validationEngineContainer').validationEngine('validate')) {

            var orgData = self.modelAsJSON(true);
            $.ajax(config.organisationSaveUrl, {type:'POST', data:orgData, contentType:'application/json'}).done( function(data) {
                if (data.errors) {

                }
                else {
                    var orgId = self.organisationId?self.organisationId:data.organisationId;
                    window.location = config.organisationViewUrl+'/'+orgId;
                }

            }).fail( function() {

            });
        }
    };

    self.prepopulateFromABN = function() {
        if ($(config.abnSelector).validationEngine()) {
            var abn = self.abn;
            $.get(config.prepopulateAbnUrl, {abn:abn, contentType:'application/json'}).done(function (orgDetails) {
                if (orgDetails.error === "invalid"){
                    bootbox.alert("Abn Number is invalid");
                }else{
                    self.name(orgDetails.name);
                }
            }).fail(function () {
                bootbox.alert("Abn Web Service is failed to lookup abn name. Please press ok to continue to create organisation");
                self.name(" ");
            });

        }
    };

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
            self.addLink(link.role, link.url);
        });
    }

    return self;

};


OrganisationPageViewModel = function (props, options) {
    var self = $.extend(this, new Documents(options));

    self.organisationId = props.organisationId;
    self.description = ko.observable(props.description).extend({markdown:true});
    self.abn = ko.observable(props.abn);
    self.url = ko.observable(props.url);
    self.name = props.name;


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
            }
        }
    };

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
                reportCategory.periodEnd = self.endDate();
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

/**
 * Provides the ability to search a user's organisations and other organisations at the same time.  The results
 * are maintained as separate lists for ease of display (so a users existing organisations can be prioritised).
 * @param organisations the organisations not belonging to the user.
 * @param userOrganisations the organisations that belong to the user.
 * @param (optional) if present, this value should contain the organisationId of an organisation to pre-select.
 */
OrganisationSelectionViewModel = function(organisations, userOrganisations, inititialSelection) {

    var self = this;
    var userOrgList = new SearchableList(userOrganisations, ['name']);
    var otherOrgList = new SearchableList(organisations, ['name']);

    self.term = ko.observable('');
    self.term.subscribe(function() {
        userOrgList.term(self.term());
        otherOrgList.term(self.term());
    });

    self.selection = ko.computed(function() {
        return userOrgList.selection() || otherOrgList.selection();
    });

    self.userOrganisationResults = userOrgList.results;
    self.otherResults = otherOrgList.results;

    self.clearSelection = function() {

        userOrgList.clearSelection();
        otherOrgList.clearSelection();
        self.term('');
    };
    self.isSelected = function(value) {
        return userOrgList.isSelected(value) || otherOrgList.isSelected(value);
    };
    self.select = function(value) {
        self.term(value['name']);

        userOrgList.select(value);
        otherOrgList.select(value);
    };

    self.allViewed = ko.observable(false);

    self.scrolled = function(blah, event) {
        var elem = event.target;
        var scrollPos = elem.scrollTop;
        var maxScroll = elem.scrollHeight - elem.clientHeight;

        if ((maxScroll - scrollPos) < 9) {
            self.allViewed(true);
        }
    };

    self.visibleRows = ko.computed(function() {
        var count = 0;
        if (self.userOrganisationResults().length) {
            count += self.userOrganisationResults().length+1; // +1 for the "user orgs" label.
        }
        if (self.otherResults().length) {
            count += self.otherResults().length;
            if (self.userOrganisationResults().length) {
                count ++; // +1 for the "other orgs" label (it will only show if the my organisations label is also showing.
            }
        }
        return count;
    });

    self.visibleRows.subscribe(function() {
        if (self.visibleRows() <= 4 && !self.selection()) {
            self.allViewed(true);
        }
    });
    self.visibleRows.notifySubscribers();


    self.organisationNotPresent = ko.observable();

    var findByOrganisationId = function(list, organisationId) {
        for (var i=0; i<list.length; i++) {
            if (list[i].organisationId === organisationId) {
                return list[i];
            }
        }
        return null;
    };

    if (inititialSelection) {
        var userOrg = findByOrganisationId(userOrganisations, inititialSelection);
        var orgToSelect = userOrg ? userOrg : findByOrganisationId(organisations, inititialSelection);
        if (orgToSelect) {
            self.select(orgToSelect);
        }
    }

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
