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
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
    </r:script>
    <r:require modules="gmap3,mapWithFeatures,knockout"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li class="active">${project.name}</li>
</ul>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name}</h1>
                <g:link data-bb="confirm" action="delete" id="${project.projectId}" class="btn pull-right title-btn">Delete project</g:link>
                <g:link action="edit" id="${project.projectId}" class="btn pull-right title-btn">Edit project</g:link>
            </div>
            <div>
                <p class="well well-small more" %{--style="height:93px;overflow:auto";--}%>${project.description}</p>
            </div>
        </div>
    </div>
    <div class="row-fluid space-after">
        <span class="span3">
            <span class="label preLabel">External Id:</span> <span data-bind="text:externalId"></span>
        </span>
        <span class="span3">
            <span class="label preLabel">Manager:</span> <span data-bind="text:manager"></span>
        </span>
        <span class="span6">
            <span class="label preLabel">Organisation:</span>
            <a href="${grailsApplication.config.collectory.baseURL +
                    'public/show/' + project.organisation}">${organisationName}</a>
        </span>
    </div>
    <div class="row-fluid">
        <span class="span3">
            <span class="label preLabel">Grant Id:</span> <span data-bind="text:grantId"></span>
        </span>
        <span class="span3">
            <span class="label preLabel">Planned start date:</span> <span data-bind="text:plannedStartDate.formattedDate"></span>
        </span>
        <span class="span6">
            <span class="label preLabel">Planned end date:</span> <span data-bind="text:plannedEndDate.formattedDate"></span>
        </span>
    </div>
    <div class="row-fluid">
        <div class="pull-left">
            <h2>Activities</h2>
        </div>
        <div class="pull-right" style="margin-top: 30px;">
            <button data-bind="click: $root.notImplemented" type="button" class="btn">Add new activity</button>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <table class="table table-condensed">
                <thead>
                    <tr><th>Site</th><th>Collector</th><th>Type - dates</th></tr>
                </thead>
                <tbody data-bind="foreach: activities"><tr>
                    <td><span data-bind="siteName:$data"></span></td>
                    <td>
                        <span data-bind="text:collector"></span>
                    </td>
                    <td>
                        <a data-bind="text: name, click: $root.openActivity"></a>
                        <button data-bind="click: $root.notImplemented" type="button" class="close" title="delete">&times;</button>
                    </td>
                </tr></tbody>
            </table>
        </div>
    </div>
    <div class="row-fluid">
        <div class="pull-left">
            <h2>Assessments</h2>
        </div>
        <div class="pull-right" style="margin-top: 30px;">
            <button data-bind="click: $root.notImplemented" type="button" class="btn">Add new assessment</button>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <table class="table table-condensed">
                <thead>
                    <tr><th>Site</th><th>Assessor</th><th>Type - dates</th></tr>
                </thead>
                <tbody data-bind="foreach: assessments"><tr>
                    <td><span data-bind="siteName:$data"></span></td>
                    <td>
                        <span data-bind="text:collector"></span>
                    </td>
                    <td>
                        <a data-bind="text: name, click: $root.openActivity"></a>
                        <button data-bind="click: $root.notImplemented" type="button" class="close" title="delete">&times;</button>
                    </td>
                </tr></tbody>
            </table>
        </div>
    </div>
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
        <div class="span5">
            <ul class="unstyled inline" data-bind="foreach: sites">
                <li class="siteInstance" data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                    <a data-bind="text: name, click: $root.openSite"></a>
                    <button data-bind="click: $root.removeSite" type="button" class="close" title="delete">&times;</button>
                </li>
            </ul>
        </div>
        <div class="span7">
            <div id="map"></div>
        </div>
    </div>

    <hr />
    <div class="debug">
        <h3 id="debug">Debug</h3>
        <div style="display: none">
            <pre data-bind="text: 'activities: ' + ko.toJSON(activities, null, 2)"></pre>
            <pre data-bind="text: 'assessments: ' + ko.toJSON(assessments, null, 2)"></pre>
            <pre>sites : ${json}</pre>
            <pre>project : ${project}</pre>
            %{--<pre>Map features : ${mapFeatures}</pre>--}%
        </div>
    </div>
</div>
    <r:script>
        $(window).load(function () {
            var json = $.parseJSON('${json}');
            var map = init_map_with_features({
                    mapContainer: "map"
                },
                $.parseJSON('${mapFeatures}')
            );
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

            ko.bindingHandlers.siteName =  {
                init: function(element, valueAccessor, allBindingsAccessor, model, bindingContext) {
                    var activity = ko.utils.unwrapObservable(valueAccessor()),
                        siteId, site,
                        sites = bindingContext.$root.sites();
                    if (activity) {
                        siteId = activity.siteId();
                        if (siteId) {
                            site = $.grep(sites, function(obj, i) {
                                return (obj.siteId() === siteId);
                            });
                            if (site.length > 0) {
                                $(element).html(site[0].name());
                                return;
                            }
                        }
                    }
                    $(element).html('no site');
                }
            };

            function ViewModel(project, sites, activities, assessments) {
                var self = this;
                self.name = ko.observable(project.name);
                self.description = ko.observable(project.description);
                self.externalId = ko.observable(project.externalId);
                self.grantId = ko.observable(project.grantId);
                self.manager = ko.observable(project.manager);
                self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
                self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
                self.organisation = ko.observable(project.organisation);
                self.activities = ko.mapping.fromJS(activities);
                self.assessments = ko.mapping.fromJS(assessments);
                this.sites = ko.mapping.fromJS(sites);
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
                    document.location.href = fcConfig.siteViewUrl + '/' + this.siteId();
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
                self.notImplemented = function () {
                    alert("Not implemented yet.")
                };
            }

            var viewModel = new ViewModel(${project},json,${activities},${assessments});

            ko. applyBindings(viewModel);
        });

    </r:script>
</body>
</html>