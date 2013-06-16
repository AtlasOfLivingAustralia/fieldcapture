<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.project_name} | Field Capture</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
    var fcConfig = {
        siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
        activityCreateUrl: "${createLink(controller: 'activity', action: 'create')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
    </r:script>
    <r:require modules="gmap3,mapWithFeatures,knockout,amplify"/>
</head>
<body>
<div class="container-fluid">

    <legend>
        <table style="width: 100%">
            <tr>
                <td>Project<fc:navSeparator/>${project.name}</td>
            </tr>
        </table>
    </legend>

    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name}</h1>
                <g:link action="edit" id="${project.projectId}" class="btn pull-right title-btn">Edit project</g:link>
            </div>
            <div>
                <a href="${grailsApplication.config.collectory.baseURL +
                        'public/show/' + project.organisation}">${organisationName}</a>
            </div>
            <div>
                <p class="well well-small more">${project.description}</p>
            </div>
        </div>
    </div>

    <!-- content tabs -->
    <ul class="nav nav-tabs">
        <li class="active"><a href="#activity" data-toggle="tab">Activities</a></li>
        <li><a href="#site" id="site-tab" data-toggle="tab">Sites</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="activity">
            <div class="row-fluid">
                <div class="pull-left">
                    <h2>Activities</h2>
                </div>
                <div class="pull-right" style="margin-top: 30px;">
                    <button data-bind="click: $root.newActivity" type="button" class="btn">Add new activity</button>
                </div>
            </div>
            <div class="row-fluid">
                <table class="table table-condensed" id="activities">
                    <thead>
                    <tr><th></th><th>Type</th><th>From</th><th>To</th><th>Site</th></tr>
                    </thead>
                    <tbody data-bind="foreach:activities" id="activityList">
                    <tr data-bind="attr:{href:'#'+activityId}" data-toggle="collapse" class="accordion-toggle">
                        <td>
                            <div>
                                <a><i class="icon-plus" title="expand"></i></a>
                            </div>
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
                                <ul class="unstyled well well-small"
                                    data-bind="foreachModelOutput:metaModel.outputs">
                                    <li>
                                        <div class="row-fluid">
                                            <span class="span4" data-bind="text:name"></span>
                                            <span class="span3" data-bind="text:score"></span>
                                            <span class="span1 offset1">
                                                <a data-bind="attr: {href:editLink}">
                                                    <i data-bind="attr: {title: outputId == '' ? 'Add data' : 'Edit data'}" class="icon-edit"></i>
                                                </a>
                                            </span>
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="tab-pane" id="site">
            <div class="row-fluid">
                <div class="pull-left">
                    <h2>Sites</h2>
                    <div class="span12">There are <span data-bind="text: sites().length"></span> sites.</div>
                </div>
                <div class="pull-right" style="margin-top: 30px;">
                    <button data-bind="click: $root.addSite" type="button" class="btn">Add new site</button>
                    <button data-bind="click: $root.removeAllSites" type="button" class="btn">Delete all sites</button>
                </div>
            </div>

            <div class="row-fluid">
                <div class="span4 well list-box">
                    <div class="control-group">
                        <div class="input-append">
                            <g:textField class="filterinput input-medium" data-target="site"
                                         title="Type a few characters to restrict the list." name="sites"
                                         placeholder="filter"/>
                            <button type="button" class="btn clearFilterBtn"
                                    title="clear"><i class="icon-remove"></i></button>
                        </div>
                        <span id="site-filter-warning" class="label filter-label label-warning"
                              style="display:none;margin-left:4px;"
                              data-bind="visible:isSitesFiltered,valueUpdate:'afterkeyup'">Filtered</span>
                    </div>
                    <div class="scroll-list">
                        <ul id="siteList"
                            data-bind="template: {foreach:filteredSites},
                                              beforeRemove: hideElement,
                                              afterAdd: showElement">
                            <li data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                                <a data-bind="text: name, attr: {href:'${createLink(controller: "site", action: "index")}' + '/' + siteId}"></a>
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
                <div class="span7">
                    <div id="map"></div>
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
            %{--<pre>Map features : ${mapFeatures}</pre>--}%
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
            // change toggle icon when expanding and collapsing and track open state
            $('#activities').
            on('show', 'div.collapse', function() {
                $(this).parents('tr').prev().find('td:first-child i').
                    removeClass('icon-plus').addClass('icon-minus');
            }).
            on('hide', 'div.collapse', function() {
                $(this).parents('tr').prev().find('td:first-child i').
                    removeClass('icon-minus').addClass('icon-plus');
            }).
            on('shown', 'div.collapse', function() {
                trackState();
            }).
            on('hidden', 'div.collapse', function() {
                trackState();
            });

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
                }
            });
            // re-establish the previous tab state
            if (amplify.store('project-tab-state') === '#site') {
                $('#site-tab').tab('show');
            }

            function trackState () {
                var $leaves = $('#activityList div.collapse'),
                    state = [];
                $.each($leaves, function (i, leaf) {
                    state.push($(leaf).hasClass('in'));
                });
                amplify.store.sessionStorage('output-accordion-state',state);
            }

            function readState () {
                var hidden = $('#activityList div.collapse'),
                    state = amplify.store.sessionStorage('output-accordion-state');
                $.each(hidden, function (i, leaf) {
                    if (state !== undefined && i < state.length && state[i]) {
                        $(leaf).collapse('show');
                    }
                });
            }

            // bind filters
            $('.filterinput').keyup(function() {
                var a = $(this).val(),
                    target = $(this).attr('data-target'),
                    $target = $('#' + target + 'List li');
                if (a.length > 1) {
                    // this finds all links in the list that contain the input,
                    // and hide the ones not containing the input while showing the ones that do
                    var containing = $target.filter(function () {
                        var regex = new RegExp('\\b' + a, 'i');
                        return regex.test($('a', this).text());
                    }).slideDown();
                    containing.each(function () {
                        map.showFeatureById($(this).find('a').html());
                    });
                    $target.not(containing).slideUp();
                    $target.not(containing).each(function () {
                        map.hideFeatureById($(this).find('a').html());
                    });
                    $('#' + target + '-filter-warning').show();
                } else {
                    $('#' + target + '-filter-warning').hide();
                    $target.slideDown();
                    map.showAllfeatures();
                }
                return false;
            });
            $('.clearFilterBtn').click(function () {
                var $filterInput = $(this).prev(),
                    target = $filterInput.attr('data-target');
                $filterInput.val('');
                $('#' + target + '-filter-warning').hide();
                $('#' + target + "List li").slideDown();
                map.showAllfeatures();
            });

            //iterates over the outputs specified in the meta-model and builds a temp object for
            // each containing the name, and the score and id of any matching outputs in the data
            ko.bindingHandlers.foreachModelOutput = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    if (valueAccessor() === undefined) {
                        var dummyRow = {name: 'No model was found for this activity', score: '', outputId: '', editLink:''};
                        ko.applyBindingsToNode(element, { foreach: [dummyRow] });
                        return { controlsDescendantBindings: true };
                    }
                    var metaOutputs = ko.utils.unwrapObservable(valueAccessor()),
                        activity = bindingContext.$data,
                        transformedOutputs = [];

                    $.each(metaOutputs, function (i, name) {
                        var score = "Not assessed yet.",
                            outputId = '',
                            editLink = "${grailsApplication.config.grails.serverURL}/output/";

                        // search for corresponding outputs in the data
                        $.each(activity.outputs(), function (i,output) {
                            if (output.name === name) {
                                outputId = output.outputId;
                                // the data structure allows for multiple scores per output
                                // not clear yet if this is required but for now just assume one
                                for (var key in output.scores) {
                                    if (output.scores.hasOwnProperty(key)) {
                                        score = output.scores[key];
                                    }
                                }
                            }
                        });

                        if (outputId) {
                            // build edit link
                            editLink += 'edit/' + outputId +
                             "?returnTo=project/index/${project.projectId}";
                        } else {
                            // build create link
                            editLink += 'create?activityId=' + activity.activityId +
                             '&outputName=' + encodeURIComponent(name) +
                             "&returnTo=project/index/${project.projectId}";
                        }
                        // build the array that we will actually iterate over in the inner template
                        transformedOutputs.push({name: name, score: score, outputId: outputId,
                            editLink: editLink});
                    });

                    // re-cast the binding to iterate over our new array
                    ko.applyBindingsToNode(element, { foreach: transformedOutputs });
                    return { controlsDescendantBindings: true };
                }
            };

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

            // uses siteId to look up site name from the list of sites
            ko.bindingHandlers.siteName =  {
                init: function(element, valueAccessor, allBindingsAccessor, model, bindingContext) {
                    var siteId = ko.utils.unwrapObservable(valueAccessor()),
                        site,
                        sites = bindingContext.$root.sites();
                    if (siteId) {
                        site = $.grep(sites, function(obj, i) {
                            return (obj.siteId() === siteId);
                        });
                        if (site.length > 0) {
                            $(element).html(site[0].name());
                            return;
                        }
                    }
                    // no site so remove the link and replace with plain text
                    $(element).parent().empty().html('no site');
                }
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
                            metaModel: act.model || {}
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
                self.activities = self.loadActivities(activities);
                self.sites = ko.mapping.fromJS(sites);
                self.sitesFilter = ko.observable("");
                self.isSitesFiltered = ko.observable(false);
                // Animation callbacks for the lists
                self.showElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown() };
                self.hideElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); }) };
                self.filteredSites = ko.computed(function () {
                    var filter = self.sitesFilter().toLowerCase();
                    var regex = new RegExp('\\b' + filter, 'i');
                    if (!filter || filter.length === 1) {
                        self.isSitesFiltered(false);
                        return self.sites();
                    } else {
                        self.isSitesFiltered(true);
                        return ko.utils.arrayFilter(self.sites(), function (item) {
                            return regex.test(item.name);
                        })
                    }
                });
                self.clearSiteFilter = function () {
                    self.sitesFilter("");
                };
                this.removeSite = function () {
                   var that = this,
                       url = fcConfig.siteDeleteUrl + '/' + this.siteId();
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
                this.openActivity = function () {
                    document.location.href = fcConfig.activityViewUrl + '/' + this.activityId();
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
                    self.notImplemented();
                };
                self.newActivity = function () {
                    document.location.href = fcConfig.activityCreateUrl +
                    "?projectId=${project.projectId}&returnTo=project/index/${project.projectId}";
                };
                self.notImplemented = function () {
                    alert("Not implemented yet.")
                };
            }

            var viewModel = new ViewModel(${project},json,${activities ?: []},${assessments ?: []});

            ko. applyBindings(viewModel);

            readState();
        });

    </r:script>
</body>
</html>