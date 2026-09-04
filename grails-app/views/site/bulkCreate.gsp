<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="nrm_bs4"/>
        <title>Create multiple sites | Sites | MERIT</title>
        <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
        <script>
            var fcConfig = {
                    returnTo: "${createLink(controller: 'project', action: 'index', id: project?.projectId)}",
                    projectId: "${project?.projectId ?: ''}",
                    spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
                    featureService: "${createLink(controller: 'proxy', action:'feature')}",
                    validateShapesUrl: "${createLink(controller: 'site', action:'isGeometryWithinAustralia')}",
                    createSiteUrl: "${createLink(action:'ajaxUpdate')}",
                },
                here = window.location.href;
        </script>
        <asset:stylesheet src="base-bs4.css"/>
        <asset:stylesheet src="leaflet-manifest.css"/>
    </head>
    <body>
    <div class="container-fluid">
        <section aria-labelledby="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                <li class="breadcrumb-item"><g:link controller="project" action="index" id="${project.projectId}">Project</g:link> </li>
                <li class="breadcrumb-item active">Create multiple sites</li>
            </ol>
        </section>
        <h1>Create multiple sites for a project</h1>
        <div class="row" style="height: 800px">
            <div class="col-md-8">
                <div id="alaMap" class="ala-map h-100">

                </div>
            </div>
            <div class="col-md-4 h-100" id="sites">
                <div class="row h-75  overflow-y-auto">
                    <div class="col-sm-12">
                        <div class="alert alert-info alert-dismissible fade show" role="alert">
                            <p>
                                Create sites by drawing geometries on the map.You can draw multiple geometries and then
                                create a site for each shape, or merge multiple shapes into one site.
                                Or, you can create a site by importing a file such as shapefile, KML, GeoJSON, etc.
                                Each site can have multiple geometries. Sites with multiple geometries can be unpacked
                                into sites with one geometry each.
                            </p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        <!-- ko foreach: {data: sites, afterAdd: fadeIn, beforeRemove: fadeOut, afterRender: enablePopovers} -->
                        <div class="card mb-3" data-bind="event: { 'mouseover': $parent.highlightSite, 'mouseout': $parent.unhighlightSite }">
                            <div class="card-header">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" data-bind="value: transients.tempSiteId,
                                        checked: $parent.selectedSites, disable: $parent.isSiteDisabled.apply($data),
                                        attr: {id: 'site-selection-' + $index()}">
                                    <label class="form-check-label" data-bind="attr: {for: 'site-selection-' + $index()}">Select site</label>
                                    <div class="float-end">
                                        <span class="badge rounded-pill text-bg-success" data-bind="visible: $parent.isSitePublished.apply($data)">Published</span>
                                        <span class="badge rounded-pill text-bg-warning" data-bind="visible: !$parent.isSitePublished.apply($data)">Draft</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div data-bind="visible: transients.loading">
                                    <div class="d-flex justify-content-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control site-name" placeholder="Site name" data-bind="value: name, disable: $parent.isSiteDisabled.apply($data), attr: {id: 'site-name-' + $index()}"/>
                                    <label class="form-label" data-bind="attr: {for: 'site-name-' + $index()}">Site name</label>
                                </div>
                                <div class="accordion accordion-flush mb-3" data-bind="visible: features().length > 0, attr: {id: 'site-features-' + $index()}">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button" type="button" data-bind="attr: {'data-bs-target': '#site-features-panel-' + $index(), 'aria-controls': 'site-features-' + $index()}" data-bs-toggle="collapse" aria-expanded="true">

                                                Site contains <!-- ko text: features().length --><!-- /ko --> geometry(s)
                                            </button>
                                        </h2>
                                        <div class="accordion-collapse collapse show" data-bs-parent="#selectedSiteNames" data-bind="attr: {'id': 'site-features-panel-' + $index(), 'data-bs-parent': '#site-features-' + $index()}">
                                            <div class="accordion-body">
                                                <table class="table table-sm table-striped table-hover">
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Type</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody data-bind="foreach: {data: features, afterAdd: $root.fadeIn, beforeRemove: $root.fadeOut}">
                                                    <tr data-bind="event: {mouseover: $root.highlightFeature, mouseout: $root.unhighlightFeature}, mouseoverBubble: false, mouseoutBubble: false">
                                                        <td data-bind="text: properties.name"></td>
                                                        <td data-bind="text: $root.getFeatureType($data)"></td>
                                                        <td>
                                                            <button class="btn btn-sm btn-secondary"
                                                                    data-bind="click: $root.unpackFeature.bind($data, $parent),
                                                                    disable: $root.isFeatureUnpackDisabled.apply($data)"
                                                                    title="Unpack geometries into individual geometry on this site.
                                                                    For example, MultiPolygons are converted to Polygons or MultiPoints to Points">
                                                                <i class="fa fa-chain-broken" aria-hidden="true"></i>
                                                            </button>
                                                            <button class="btn btn-sm btn-secondary" data-bind="click: $root.zoomToFeature.bind($data)" title="Zoom to geometry"><i class="fa fa-search-plus" aria-hidden="true"></i></button>
                                                            <button class="btn btn-sm btn-danger" data-bind="click: $root.deleteFeature.bind($data, $parent), disable: $root.isFeatureDeleteDisabled.apply($parent)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <button href="#" class="btn btn-sm btn-primary mt-1" data-bind="click: $parent.createSite, disable: $parent.isSiteDisabled.apply($data)" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Create a site with the attached geometries.">Create</button>
                                <button href="#" class="btn btn-sm btn-secondary mt-1" data-bind="click: $parent.splitSite, disable: $parent.isSplitDisabled.apply($data)" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Convert multi-geometry to individual geometry. For example, MultiPolygon gets convert to Polygon geometries.">Unpack</button>
                                <button href="#" class="btn btn-sm btn-secondary mt-1" data-bind="click: $parent.zoomIn" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Zoom in to the site geometries.">Zoom in</button>
                                <button href="#" class="btn btn-sm btn-danger mt-1" data-bind="click: $parent.deleteSite, disable: $parent.isSiteDisabled.apply($data)" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Delete this site.">Delete</button>
                            </div>
                        </div>
                        <!-- /ko -->
                    </div>
                </div>
                <div class="row h-25">
                    <div class="col-sm-12">
                        <div class="card h-100">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="select-all" data-bind="checked: selectAll, disable: isSelectAllDisabled">
                                            <label class="form-check-label" for="select-all">Select all</label>
                                        </div>
                                        <div class="accordion accordion-flush mb-3" id="selectedSiteNamesAccordion" data-bind="visible: selectedSites().length > 0">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#selectedSiteNames" aria-expanded="true" aria-controls="selectedSiteNames">
                                                        <!-- ko text: selectedSites().length --><!-- /ko --> of <!-- ko text: selectableSites().length --><!-- /ko --> sites selected
                                                    </button>
                                                </h2>
                                                <div id="selectedSiteNames" class="accordion-collapse collapse" data-bs-parent="#selectedSiteNamesAccordion">
                                                    <div class="accordion-body" data-bind="text: selectedSitesNames().join(', ')"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Create the selected draft sites.">
                                            <button type="button" id="save" class="mr-2 btn btn-sm btn-primary" data-bind="click: createSites, disable: isBulkCreateDisabled">Create <span class="badge text-bg-primary" data-bind="text: selectedSites().length"></span></button>
                                        </span>
                                        <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Combine selected draft sites into one site.">
                                            <button type="button" id="mergeSites" class="mr-2 btn btn-sm btn-secondary" data-bind="click: mergeSites, disable: isBulkMergeDisabled">Merge <span class="badge text-bg-secondary" data-bind="text: selectedSites().length"></span></button>
                                        </span>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-sm-12">
                                        <button type="button" id="cancel" class="mr-2 btn btn-sm btn-danger" data-bind="click: goToProject" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="top" data-bs-delay='{"show": 300, "hide": 0}' data-bs-content="Navigate to the project page">Go to project</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <asset:javascript src="base-bs4.js"/>
    <asset:javascript src="knockout/knockout-latest.js"/>
    <asset:javascript src="knockout-mapping/knockout.mapping.js"/>
    <asset:javascript src="leaflet-manifest.js"/>
    <asset:javascript src="fieldcapture-application.js"/>
%{--    <asset:javascript src="mapWithFeatures.js"/>--}%
    <asset:javascript src="sites.js"/>
    <script type="application/javascript">
        function initMap() {
            var mapId = 'alaMap',
                sitesId = 'sites',
                googleLayer = L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'roadmap'}),
                mapOptions = {
                    drawControl: true,
                    maxZoom: 23,
                    maxAutoZoom: 21,
                    showReset: false,
                    allowSearchLocationByAddress: false,
                    allowSearchRegionByAddress: false,
                    useMyLocation: false,
                    singleDraw: false,
                    singleMarker: false,
                    markerOrShapeNotBoth: false,
                    assignNameEnabled: true,
                    addGeometryFromLocalFile: true,
                    wmsLayerUrl: fcConfig.spatialWmsUrl + '/wms/reflect?',
                    wmsFeatureUrl: fcConfig.featureService + '?featureId=',
                    otherLayers: {
                        Roadmap: googleLayer,
                        Hybrid: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'hybrid'}),
                        Terrain: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'terrain'})
                    },
                    allowKnownShapesControl: false,
                    baseLayer: googleLayer,
                    zoomToObject: true,
                    addAllFeaturesFromFile: false,
                    style: {
                        color: '#0f0',
                        fillOpacity: 0.2,
                        weight: 3
                    },
                    validateImportedShapes: function (geojson) {
                        return $.ajax({
                            method: 'POST',
                            url: fcConfig.validateShapesUrl,
                            data: JSON.stringify(geojson),
                            contentType: 'application/json',
                        });
                    }
                },
                sitesDom = document.getElementById(sitesId),
                alaMap = new ALA.Map(mapId, mapOptions),
                sitesViewModel = new BulkCreateSiteViewModel(alaMap, fcConfig);

            ko.applyBindings(sitesViewModel, sitesDom);
            setTimeout(function () {
                sitesViewModel.enablePopovers(document);
            }, 1000);
        }
        initMap();
    </script>
    </body>
</html>