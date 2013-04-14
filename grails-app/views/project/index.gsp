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
        <div class="page-header span12">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name}</h1>
                <g:link action="edit" id="${project.projectId}" class="btn pull-right title-edit">Edit project</g:link>
            </div>
            <div class="row-fluid span12">
                <p class="well well-small">${project.description}</p>
            </div>
        </div>
    </div>
    <div class="row-fluid span12">
        <span class="span3">External Id: ${project.externalId}</span>
        <span class="span3">Manager: ${project.manager}</span>
        <span class="span3">Group: ${project.groupName}</span>
    </div>
    <div class="row-fluid span12">
        <span class="span6">Planned start date: ${project.plannedStartDate}</span>
        <span class="span3">Planned end date: ${project.plannedEndDate}</span>
    </div>
    <div class="row-fluid span12">
        <div class="pull-left">
            <h2>Activities</h2>
            <span>There are no activities.</span><br>
        </div>
        <div class="pull-right" style="margin-top: 30px;">
            <button data-bind="click: $root.notImplemented" type="button" class="btn">Add new activity</button>
        </div>
    </div>
    <div class="row-fluid span12">
        <div class="pull-left">
            <h2>Sites</h2>
            <div class="span12">There are <span data-bind="text: sites().length"></span> sites.</div>
        </div>
        <div class="pull-right" style="margin-top: 30px;">
            <button data-bind="click: $root.addSite" type="button" class="btn">Add new site</button>
            <button data-bind="click: $root.removeAllSites" type="button" class="btn">Delete all sites</button>
        </div>
    </div>
    <div class="row-fluid span12">
        <div class="span5">
            <ul class="unstyled inline" data-bind="foreach: sites">
                <li class="siteInstance" data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                    <a data-bind="text: name, click: $root.open"></a>
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
            <div>project : ${project}</div>
            <div>Map features : ${mapFeatures}</div>
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

            function SitesViewModel(siteData) {
                var self = this;
                this.sites = ko.mapping.fromJS(siteData);
                this.removeSite = function () {
                   var that = this,
                       url = fcConfig.siteDeleteUrl + '/' + this.siteId();
                    $.get(url, function (data) {
                        if (data.status === 'deleted') {
                            self.sites.remove(that);
                        }
                    });
                };
                this.open = function () {
                    document.location.href = fcConfig.siteViewUrl + '/' + this.siteId();
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

            var viewModel = new SitesViewModel(json);

            ko. applyBindings(viewModel);
        });

    </r:script>
</body>
</html>