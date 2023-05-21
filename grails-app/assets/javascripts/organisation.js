//= require tab-init.js
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

    var config = props.config || {};
    self.config = ko.observable(vkbeautify.json(props.config));

    self.managementUnitReportCategories = ko.computed(function() {
        return _.map(config.organisationReports || [], function(report) {
            return report.category;
        });
    });

    var coreServicesReportCategory = 'Core Services Reporting';
    var getOrganisationReportConfig = function() {
        if (!config.organisationReports || config.organisationReports.length == 0) {
            config.organisationReports = [{type:'Administrative', category:coreServicesReportCategory}];
        }
        return config.organisationReports[0];
    };

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

    var projectOutputReportCategory = 'Outputs Reporting';
    var activityReportConfig = getActivityReportConfig();
    var organisationReportConfig = getOrganisationReportConfig();

    self.coreServicesOptions = [
        {label:'Monthly (First period ends 31 July 2018)', firstReportingPeriodEnd:'2018-07-31T14:00:00Z', reportingPeriodInMonths:1, reportConfigLabel:'Monthly'},
        {label:'Bi-monthly (First period ends 31 August 2018)', firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:2, reportConfigLabel:'Bi-monthly'},
        {label:"Quarterly - Group A (First period ends 30 September 2018)", firstReportingPeriodEnd:'2018-09-30T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarterly - Group A'},
        {label:"Quarterly - Group B (First period ends 31 August 2018)", firstReportingPeriodEnd:'2018-08-31T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarterly - Group B'}];

    var currentOption = _.find(self.coreServicesOptions, function(option) {
        return option.firstReportingPeriodEnd == organisationReportConfig.firstReportingPeriodEnd && option.reportingPeriodInMonths == organisationReportConfig.reportingPeriodInMonths;
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

    self.saveReportingConfiguration = function() {

        if ($(options.reportingConfigSelector).validationEngine('validate')) {
            var selectedCoreServicesPeriod = _.find(self.coreServicesOptions, function(option) {
                return option.label == self.coreServicesPeriod();
            });

            organisationReportConfig.firstReportingPeriodEnd = selectedCoreServicesPeriod.firstReportingPeriodEnd;
            organisationReportConfig.reportingPeriodInMonths = selectedCoreServicesPeriod.reportingPeriodInMonths;
            organisationReportConfig.label = selectedCoreServicesPeriod.reportConfigLabel;

            var selectedActivityReportingPeriod = _.find(self.activityReportingOptions, function(option) {
                return option.label == self.activityReportingPeriod();
            });

            activityReportConfig.firstReportingPeriodEnd = selectedActivityReportingPeriod.firstReportingPeriodEnd;
            activityReportConfig.reportingPeriodInMonths = selectedActivityReportingPeriod.reportingPeriodInMonths;
            activityReportConfig.label = selectedActivityReportingPeriod.reportConfigLabel;

            blockUIWithMessage("Saving configuration...");
            self.saveConfig(config).done(function() {
                blockUIWithMessage("Regenerating reports XXX...");
                self.regenerateReports([coreServicesReportCategory], [projectOutputReportCategory]).done(function() {
                document.location.reload();
                }).fail(function() {
                    $.unblockUI();
                });
            });
        }
    };

    self.regenerateReports = function(organisationReportCategories, projectReportCategories) {
        var data = JSON.stringify({organisationReportCategories:organisationReportCategories, projectReportCategories:projectReportCategories});
        return $.ajax({
            url: options.regenerateOrganisationReportsUrl,
            type: 'POST',
            data: data,
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Failed to regenerate organisation reports");
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

    var tabs = {
        'admin': {
            initialiser: function () {
                populatePermissionsTable();
                $(options.reportingConfigSelector).validationEngine();
            }
        }
    };

    self.initialise = function() {
        $.fn.dataTable.moment( 'dd-MM-yyyy' );
        initialiseTabs(tabs, {tabSelector:'#orgTabs.nav a', tabStorageKey:'selected-organisation-tab'});
    };

    self.saveConfig = function(config) {
        var json = {
            config: config,
            startDate:self.startDate(),
            endDate:self.endDate()
        };
        return saveOrganisation(json);
    };

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

    self.deleteOrganisation = function() {
        if (window.confirm("Delete this organisation?  Are you sure?")) {
            $.post(config.organisationDeleteUrl).complete(function() {
                    window.location = fcConfig.organisationListUrl;
                }
            );
        };
    };

    self.editDescription = function() {
        editWithMarkdown('Edit organisation description', self.description);
    };

    self.editOrganisation = function() {
       window.location = fcConfig.organisationEditUrl;
    };

    self.saveOrganisationConfiguration = function() {
        try {
            config = JSON.parse(self.config());
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }
        self.saveConfig(config).done(function (data) {
            bootbox.alert("Organisation configuration saved");
        });

    };


    self.saveConfig = function(config) {
        var json = {
            config: config,
            startDate:self.startDate(),
            endDate:self.endDate(),
            organisationId: self.organisationId,
            abn: self.abn()
        };
        return saveOrganisation(json);
    };


    var saveOrganisation = function(json) {
        return $.ajax({
            url: fcConfig.organisationSaveUrl,
            type: 'POST',
            data: JSON.stringify(json),
            dataType:'json',
            contentType: 'application/json'
        }).fail(function() {
            bootbox.alert("Save failed");
        });
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
            $.ajax(fcConfig.organisationSaveUrl, {type:'POST', data:orgData, contentType:'application/json'}).done( function(data) {
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
