<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.project_name} | Field Capture</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
        activityCreateUrl: "${createLink(controller: 'activity', action: 'create')}",
        siteCreateUrl: "${createLink(controller: 'site', action: 'createForProject', params: [projectId:project.projectId])}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
        },
        returnTo = "project/index/${project.projectId}";

    </r:script>
    <r:require modules="gmap3,mapWithFeatures,knockout,amplify"/>
</head>
<body>
<div class="container-fluid">

    <legend>
        <table style="width: 100%">
            <tr>
                <td><g:link class="discreet" controller="home" action="index">Home</g:link><fc:navSeparator/>Project<fc:navSeparator/>${project.name}</td>
            </tr>
        </table>
    </legend>

    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name}</h1>
                <g:link action="edit" id="${project.projectId}" class="btn pull-right title-btn">Edit project</g:link>
            </div>
            <g:if test="${organisationName}">
                <div class="clearfix" style="padding-bottom:10px;">
                    <h4><a href="${grailsApplication.config.collectory.baseURL +
                            'public/show/' + project.organisation}">${organisationName}</a>
                    </h4>
                </div>
            </g:if>
            <g:if test="${project.description}">
            <div>
                <p class="well well-small more">${project.description}</p>
            </div>
            </g:if>
        </div>
    </div>

    <!-- content tabs -->
    <ul class="nav nav-tabs big-tabs">
        <li class="active"><a href="#activity" data-toggle="tab">Activities</a></li>
        <li><a href="#site" id="site-tab" data-toggle="tab">Sites</a></li>
    </ul>
    <div class="tab-content">
        <!-- ACTIVITIES -->
        <div class="tab-pane active" id="activity">
            <div class="row-fluid space-after">
                <div class="pull-right">
                    <button data-bind="click: $root.expandActivities" type="button" class="btn btn-link">Expand all</button>
                    <button data-bind="click: $root.collapseActivities" type="button" class="btn btn-link">Collapse all</button>
                    <button data-bind="click: $root.newActivity" type="button" class="btn">Add new activity</button>
                </div>
            </div>
            <div class="row-fluid">
                <p data-bind="visible: activities.length == 0">
                    This project current has not activities listed.
                </p>
                <table class="table table-condensed" id="activities">
                    <thead>
                    <tr data-bind="visible: activities.length > 0">
                        <th></th>
                        <th class="sort" data-bind="sortIcon:'',click:sortBy" data-column="type">Type</th>
                        <th class="sort" data-bind="sortIcon:'',click:sortBy" data-column="startDate">From</th>
                        <th class="sort" data-bind="sortIcon:'',click:sortBy" data-column="endDate">To</th>
                        <th class="sort" data-bind="sortIcon:'',click:sortBy" data-column="siteId">Site</th>
                    </tr>
                    </thead>
                    <tbody data-bind="foreach:activities" id="activityList">
                    <tr data-bind="attr:{href:'#'+activityId}" data-toggle="collapse" class="accordion-toggle">
                        <td>
                            <div><a><i class="icon-plus" title="expand"></i></a></div>
                        </td>
                        <td><span data-bind="text:type"></span></td>
                        <td><span data-bind="text:startDate.formattedDate"></span></td>
                        <td><span data-bind="text:endDate.formattedDate"></span></td>
                        <td><a data-bind="siteName:siteId,click:$root.openSite"></a></td>
                    </tr>
                    <tr class="hidden-row">
                        <td></td>
                        <td colspan="5">
                            <div class="collapse" data-bind="attr: {id:activityId}">
                                <ul class="unstyled well well-small">
                                    <!-- ko foreachModelOutput:metaModel.outputs -->
                                    <li>
                                        <div class="row-fluid">
                                            <span class="span4" data-bind="text:name"></span>
                                            <span class="span3" data-bind="text:score"></span>
                                            <span class="span2 offset1">
                                                <a data-bind="attr: {href:editLink}">
                                                    <span data-bind="text: outputId == '' ? 'Add data' : 'Edit data'"></span>
                                                    <i data-bind="attr: {title: outputId == '' ? 'Add data' : 'Edit data'}" class="icon-edit"></i>
                                                </a>
                                            </span>
                                        </div>
                                    </li>
                                    <!-- /ko -->
                                    %{--<li><button type="button" class="btn btn-link" style="padding:0" data-bind="click:edit">
                                        Edit activity</button></li>--}%
                                </ul>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="tab-pane" id="site">
            <!-- SITES -->
            <div data-bind="visible: sites.length == 0">
               <p>No sites are currently associated with this project.</p>
            </div>
            <div class="row-fluid"  data-bind="visible: sites.length > 0">
                <div class="span4 well list-box">
                    <div class="control-group">
                        <div class="input-append">
                            <g:textField class="filterinput input-medium" data-target="site"
                                         data-bind="event: {keyup:filterChanged}"
                                         title="Type a few characters to restrict the list." name="sites"
                                         placeholder="filter"/>
                            <button type="button" class="btn" data-bind="click:clearFilter"
                                    title="clear"><i class="icon-remove"></i></button>
                        </div>
                        <span id="site-filter-warning" class="label filter-label label-warning"
                              style="display:none;margin-left:4px;"
                              data-bind="visible:isSitesFiltered,valueUpdate:'afterkeyup'">Filtered</span>
                    </div>
                    <div class="scroll-list">
                        <ul id="siteList"
                            data-bind="template: {foreach:sites},
                                              beforeRemove: hideElement,
                                              afterAdd: showElement">
                            <li data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                                <a data-bind="text:name, attr: {href:'${createLink(controller: "site", action: "index")}' + '/' + siteId}"></a>
                                <span data-bind="text:state"></span><br>
                                <span data-bind="text:address" style="font-size:11px;color:#666;"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                 %{--<div class="span5" id="sites-scroller">
                    <ul class="unstyled inline" data-bind="foreach: sites">
                        <li class="siteInstance" data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                            <a data-bind="text: name, click: $root.openSite"></a>
                            <button data-bind="click: $root.removeSite" type="button" class="close" title="delete">&times;</button>
                        </li>
                    </ul>
                </div>--}%
                <div class="span6">
                    <div id="map" style="width:100%"></div>
                </div>
                <div class="span2">
                    <div class="btn-group btn-group-vertical">
                        <button data-bind="click: $root.addSite" type="button" class="btn pull-right">Add new site</button>
                        <button data-bind="click: $root.addExistingSite" type="button" class="btn pull-right">Add existing site</button>
                        <button data-bind="click: $root.removeAllSites" type="button" class="btn pull-right">Delete all sites</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hr />
    <div class="expandable-debug">
        <h3>Debug</h3>
        <div>
            <h4>KO model</h4>
            <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            <h4>Activities</h4>
            <pre data-bind="text:ko.toJSON(activities,null,2)"></pre>
            <h4>Sites</h4>
            <pre>${json}</pre>
            <h4>Project</h4>
            <pre>${project}</pre>
            <h4>Features</h4>
            <pre>${mapFeatures}</pre>
        </div>
    </div>
</div>
    <r:script>
        $(window).load(function () {
            var json = $.parseJSON('${json}'),
                map;
            // setup 'read more' for long text
            $('.more').shorten({
                moreText: 'read more',
                showChars: '270'
            });
            // setup confirm modals for deletions
            $(document).on("click", "a[data-bb]", function(e) {
                e.preventDefault();
                var type = $(this).data("bb"),
                    href = $(this).attr('href');
                if (type === 'confirm') {
                    bootbox.confirm("Delete this entire project? Are you sure?", function(result) {
                        if (result) {
                            document.location.href = href;
                        }
                    });
                }
            });
            // todo: not used here but is handy so should go into the common custom ko bindings
            ko.bindingHandlers.foreachprop = {
                transformObject: function (obj) {
                    var properties = [];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            properties.push({ key: key, value: obj[key] });
                        }
                    }
                    return properties;
                },
                init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var value = ko.utils.unwrapObservable(valueAccessor()),
                        properties = ko.bindingHandlers.foreachprop.transformObject(value);
                    ko.applyBindingsToNode(element, { foreach: properties });
                    return { controlsDescendantBindings: true };
                }
            };

            //
            ko.bindingHandlers.sortIcon = {
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var $element = $(element),
                        name = $element.data('column'),
                        $icon = $element.find('i'),
                        className = "icon-blank";
                    if (viewModel.activitiesSortBy() === name) {
                        className = viewModel.activitiesSortOrder() === 'desc' ? 'icon-chevron-down' : 'icon-chevron-up';
                    }
                    if ($icon.length === 0) {
                        $icon = $("<i class='icon-blank'></i>").appendTo($element);
                    }
                    $icon.removeClass().addClass(className);
                }
            };

            // uses siteId to look up site name from the list of sites
            ko.bindingHandlers.siteName =  {
                init: function(element, valueAccessor, allBindingsAccessor, model, bindingContext) {
                    var siteId = ko.utils.unwrapObservable(valueAccessor()),
                        siteName = bindingContext.$root.getSiteName(siteId);
                    if (siteName === '') {
                        // no site so remove the link and replace with plain text
                        $(element).parent().empty().html('no site');
                    } else {
                        $(element).html(siteName);
                    }
                }
            };

            var Site = function (site) {
                var self = this;
                this.name = ko.observable(site.name);
                this.siteId = site.siteId;
                this.state = ko.observable('');
                this.nrm = ko.observable('');
                this.address = ko.observable("");
                this.setAddress = function (address) {
                    if (address.indexOf(', Australia') === address.length - 11) {
                        address = address.substr(0, address.length - 11);
                    }
                    self.address(address);
                };
                /*$.getJSON("${createLink(controller: 'site', action: 'locationLookup')}/" + site.siteId, function (data) {
                    if (data.error) {
                        //console.log(data.error);
                    } else {
                        self.state(' (' + initialiseState(data.state) + ')');
                        self.nrm(' (' + data.nrm + ')');
                    }
                });*/
            };

            function ViewModel(project, sites, activities, assessments) {
                var self = this;
                this.loadActivities = function (activities) {
                    var acts = ko.observableArray([]);
                    $.each(activities, function (i, act) {
                        var activity = {
                            activityId: act.activityId,
                            siteId: act.siteId,
                            type: act.type,
                            startDate: ko.observable(act.startDate).extend({simpleDate:false}),
                            endDate: ko.observable(act.endDate).extend({simpleDate:false}),
                            outputs: ko.observableArray([]),
                            collector: act.collector,
                            metaModel: act.model || {},
                            edit: function () {
                                document.location.href = fcConfig.activityEditUrl + '/' + this.activityId +
                                    "?returnTo=${createLink(controller:'project', action='index', id:project.projectId)}";
                            }
                        };
                        $.each(act.outputs, function (j, out) {
                            activity.outputs.push({
                                outputId: out.outputId,
                                name: out.name,
                                collector: out.collector,
                                assessmentDate: out.assessmentDate,
                                scores: out.scores
                            });
                        });
                        acts.push(activity);
                    });
                    return acts;
                };
                self.name = ko.observable(project.name);
                self.description = ko.observable(project.description);
                self.externalId = ko.observable(project.externalId);
                self.grantId = ko.observable(project.grantId);
                self.manager = ko.observable(project.manager);
                self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
                self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
                self.organisation = ko.observable(project.organisation);
                self.mapLoaded = ko.observable(false);
                self.activities = self.loadActivities(activities);
                self.activitiesSortBy = ko.observable("");
                self.activitiesSortOrder = ko.observable("");
                self.sortActivities = function () {
                    var field = self.activitiesSortBy(),
                        order = self.activitiesSortOrder();
                    self.activities.sort(function (left, right) {
                        var l = ko.utils.unwrapObservable(left[field]),
                            r = ko.utils.unwrapObservable(right[field]);
                        if (field === 'siteId') {
                            l = self.getSiteName(l);
                            r = self.getSiteName(r);
                        }
                        return l == r ? 0 : (l < r ? -1 : 1);
                    });
                    if (order === 'desc') {
                        self.activities.reverse();
                    }
                };
                self.sortBy = function (data, event) {
                    var element = event.currentTarget;
                    state = $(element).find('i').hasClass('icon-chevron-up');
                    self.activitiesSortOrder(state ? 'desc' : 'asc');
                    self.activitiesSortBy($(element).data('column'));
                    self.sortActivities();
                };
                self.sites = $.map(sites, function (obj,i) {return new Site(obj)});
                self.sitesFilter = ko.observable("");
                self.isSitesFiltered = ko.observable(false);
                self.getSiteName = function (siteId) {
                    var site;
                    if (siteId !== undefined && siteId !== '') {
                        site = $.grep(self.sites, function(obj, i) {
                                return (obj.siteId === siteId);
                        });
                        if (site.length > 0) {
                             return site[0].name();
                        }
                    }
                    return '';
                };
                // Animation callbacks for the lists
                self.showElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown() };
                self.hideElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); }) };
                self.clearSiteFilter = function () {
                    self.sitesFilter("");
                };
                self.filterChanged = function (model, event) {
                    var element = event.target,
                        a = $(element).val(),
                        target = $(element).attr('data-target'),
                        $target = $('#' + target + 'List li'),
                        regex = new RegExp('\\b' + a, 'i');
                    if (a.length > 1) {
                        /*ko.utils.arrayForEach(self.sites, function (site) {
                            site.visible = regex.test(site.name());
                        });*/
                        // this finds all links in the list that contain the input,
                        // and hides the ones not containing the input
                        var containing = $target.filter(function () {
                            //var regex = new RegExp('\\b' + a, 'i');
                            return regex.test($('a', this).text());
                        }).slideDown();
                        // make sure filtered-in sites are visible
                        containing.each(function () {
                            map.showFeatureById($(this).find('a').html());
                        });
                        $target.not(containing).slideUp();
                        // make sure filtered-out sites are hidden
                        $target.not(containing).each(function () {
                            map.hideFeatureById($(this).find('a').html());
                        });
                        // show 'filtered' icon
                        $('#' + target + '-filter-warning').show();
                    } else {
                        // hide 'filtered' icon
                        $('#' + target + '-filter-warning').hide();
                        // show all sites
                        $target.slideDown();
                        // show all markers
                        map.showAllfeatures();
                    }
                    return true;
                };
                self.clearFilter = function (model, event) {
                    var element = event.currentTarget,
                        $filterInput = $(element).prev(),
                        target = $filterInput.attr('data-target');
                    $filterInput.val('');
                    $('#' + target + '-filter-warning').hide();
                    $('#' + target + "List li").slideDown();
                    map.showAllfeatures();
                };
                this.removeSite = function () {
                   var that = this,
                       url = fcConfig.siteDeleteUrl + '/' + this.siteId;
                    $.get(url, function (data) {
                        if (data.status === 'deleted') {
                            self.sites.remove(that);
                        }
                    });
                };
                this.openSite = function () {
                    var site = ko.toJS(this);
                    if (site.siteId !== '') {
                        document.location.href = fcConfig.siteViewUrl + '/' + site.siteId;
                    }
                };
                this.highlight = function () {
                    map.highlightFeatureById(this.name());
                };
                this.unhighlight = function () {
                    map.unHighlightFeatureById(this.name());
                };
                this.removeAllSites = function () {
                    self.notImplemented();
                };
                this.addSite = function () {
                     document.location.href = fcConfig.siteCreateUrl;
                };
                this.addExistingSite = function () {
                    self.notImplemented();
                };
                self.newActivity = function () {
                    document.location.href = fcConfig.activityCreateUrl +
                    "?projectId=${project.projectId}&returnTo=${createLink(controller:'project', action:'index', id:project.projectId)}";
                };
                self.notImplemented = function () {
                    alert("Not implemented yet.")
                };
                self.triggerGeocoding = function () {
                    ko.utils.arrayForEach(self.sites, function (site) {
                        if (map) {
                            map.getAddressById(site.name(), site.setAddress);
                        }
                    });
                };
                self.expandActivities = function () {
                    $('#activityList div.collapse').collapse('show');
                };
                self.collapseActivities = function () {
                    $('#activityList div.collapse').collapse('hide');
                }
            }

            var viewModel = new ViewModel(${project},json,${activities ?: []},${assessments ?: []});

            ko. applyBindings(viewModel);

            readState();

            // retain tab state for future re-visits
            $('a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-tab-state', tab);
                // only init map when the tab is first shown
                if (tab === '#site' && map === undefined) {
                    map = init_map_with_features({
                            mapContainer: "map",
                            scrollwheel: false
                        },
                        $.parseJSON('${mapFeatures}')
                    );
                    // set trigger for site reverse geocoding
                    viewModel.triggerGeocoding();
                }
            });
            // re-establish the previous tab state
            if (amplify.store('project-tab-state') === '#site') {
                $('#site-tab').tab('show');
            }

        });

    </r:script>
</body>
</html>