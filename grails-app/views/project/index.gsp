<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.project_name} | Field Capture</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
    var fcConfig = {
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
    </r:script>
    <r:require modules="gmap3,projectsMap,knockout"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li class="active">${project.name}</li>
</ul>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="pull-left">
            <h1>${project?.name}</h1>
        </div>
        <div class="pull-right">
            <g:link action="edit" id="${project.projectId}" class="btn" style="margin-top:20px;">Edit project</g:link>
        </div>
    </div>
    <div class="row-fluid">
        <div class="row-fluid span12">
            <p class="well well-small">${project.description}</p>
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
</div>
    <r:script>
        $(window).load(function () {
            var json = $.parseJSON('${json}');
            initMap('li.siteInstance', initMapForSites, json);

            function SitesViewModel(siteData) {
                var self = this;
                this.sites = ko.mapping.fromJS(siteData);
                this.removeSite = function () {
                   var that = this,
                       url = baseUrl + '/site/ajaxDelete/' + this.siteId();
                    $.get(url, function (data) {
                        if (data.status === 'deleted') {
                            self.sites.remove(that);
                        }
                    });
                };
                this.open = function () {
                    document.location.href = baseUrl + '/site/index/' + this.siteId();
                };
                this.highlight = function () {
                    sites.highlightMarker(sites.markers[this.name()]);
                };
                this.unhighlight = function () {
                    sites.unHighlightMarker(sites.markers[this.name()]);
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

        var baseUrl = "${grailsApplication.config.grails.serverURL}";
        $('.xsiteInstance button.close').click(function () {
            var siteInstance = $(this).parent(),
                siteId = siteInstance.attr('id'),
                url = baseUrl + '/site/ajaxDelete/' + siteId;
            $.get(url, function (data) {
                if (data.status === 'deleted') {
                    siteInstance.remove();
                }
            });
        });
    </r:script>
</body>
</html>