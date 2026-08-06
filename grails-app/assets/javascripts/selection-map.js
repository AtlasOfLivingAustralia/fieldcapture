/*
 *  Copyright (C) 2011 Atlas of Living Australia
 *  All Rights Reserved.
 *
 *  The contents of this file are subject to the Mozilla Public
 *  License Version 1.1 (the "License"); you may not use this file
 *  except in compliance with the License. You may obtain a copy of
 *  the License at http://www.mozilla.org/MPL/
 *
 *  Software distributed under the License is distributed on an "AS
 *  IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 *  implied. See the License for the specific language governing
 *  rights and limitations under the License.
 */
(function (windows) {
    "use strict";
/*jslint browser: true, vars: false, white: false, maxerr: 50, indent: 4 */
if (typeof console == "undefined") {
    this.console = {log: function() {}};
}

var
    // represents the map and its associated properties and events
    map,
    
    //  Urls are injected from config
    config = {};

/*** map represents the map and its associated properties and events ************************************************/
map = {
    // the ALA map object
    alaMap: null,
    // the DOM container to draw the map in
    containerId: "map-canvas",
    // drawing manager handles user drawn shapes
    drawingManager: null,
    // drawing mode of the map
    mode: 'pointer',
    // list of user-drawn shapes
    shapes: [],
    //the bounds of the current shape
    currentShapeBounds: null,
    // default overlay options
    overlayOptions: {clickable: false, zIndex: 1, editable: true},
    // the default bounds for the map
    initialBounds: L.latLngBounds(
            L.latLng(-41.5, 114),
            L.latLng(-13.5, 154)),
    // this helps handle double click events
    init: function () {
        var googleLayer = L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'roadmap'});
        // map options
        var options = {
            drawOptions: {
                polyline: true,
                polygon: true,
                rectangle: true,
                circle: true,
                edit: true
            },
            drawControl: true,
            singleDraw: false,
            showReset: false,
            draggableMarkers: true,
            singleMarker: false,
            showFitBoundsToggle: true,
            useMyLocation: false,
            allowSearchLocationByAddress: false,
            allowSearchRegionByAddress: false,
            wmsLayerUrl: config.spatialWmsUrl + '/wms/reflect?',
            wmsFeatureUrl: config.featureService + '?featureId=',
            otherLayers: {
                Roadmap: googleLayer,
                Hybrid: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'hybrid'}),
                Terrain: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'terrain'})
            },
            allowKnownShapesControl: true,
            knownShapesOptions: {
                featuresServiceUrl: fcConfig.featuresService,
                regionListUrl: fcConfig.regionListUrl
            },
            baseLayer: googleLayer,
            addGeometryFromLocalFile: true,
            simplifyImportedShapes: true,
            simplifyOptions: {
                tolerance: 0.0001
            },
            flattenMultiGeometries: true,
            markerOrShapeNotBoth: false,
            zoomToObject: false,
            addAllFeaturesFromFile: false,
            validateImportedShapes: function (geojson) {
                return $.ajax({
                    method: 'POST',
                    url: config.validateShapesUrl,
                    data: JSON.stringify(geojson),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success)
                            // do not remove the shape, it is valid
                            return {remove: false, message: data.message};
                        else
                            return {remove: true, message: data.message};
                    }
                })
            }
        },
        that = this;

        // create map
        this.alaMap = new ALA.Map(this.containerId, options);
        window.alaMap = this.alaMap;
        this.alaMap.fitBounds();
        return this.alaMap;
    },
    zoomToShapeBounds : function(){
      this.alaMap.fitBounds();
    }
};

// controls represents the map controls
var controls = {
    pointer: null,
    tools: null,
    history: {},
    serverUrl: null,
    init: function (serverUrl) {
        var that = this;
        this.pointer = $('#pointer');
        this.tools = $('#map-controls li');
        this.serverUrl = serverUrl;
    }
};

// utilities
function round(number, places) {
    var p = places || 4;
    return places === 0 ? number.toFixed() : number.toFixed(p);
}

function showWktForObject(pid) {
    $.get(config.baseUrl + "/search/getWkt", {pid: pid}, function (data) {
        showOnMap('wkt', data);
    });
}

/**
 * Initialises everything including the map.
 *
 * @param options object specifier with the following members:
 * - server: url of the server the app is running on
 * - spatialService:
 * - spatialWms:
 * - spatialCache:
 * - mapContainer: id of the html element to hold the map
 */
function init (options) {
    var initialRegionTypeStr;

    config.baseUrl = options.server;
    config.spatialServiceUrl = options.spatialService;
    config.spatialWmsUrl = options.spatialWms;
    config.featureService = options.featureService;
    config.validateShapesUrl = options.validateShapesUrl;

    /*****************************************\
    | Create map
    \*****************************************/
    if (options.mapContainer) {
        map.containerId = options.mapContainer;
    }

    return map.init();
}

function getMapCentre(){
    var centre = map.alaMap.getCentre();
    return [centre.lng, centre.lat];
}

var markersArray = [];

function addMarker(lat, lng, name, dragEvent){
    var config = {
        draggable: true
    };

    if (fcConfig.poiIconUrl) {
        config.icon = L.icon({
            iconUrl: fcConfig.poiIconUrl,
            iconSize: [32, 26],
            iconAnchor: [16, 26],
            popupAnchor: [0, -26]
        });
    }

    var marker = map.alaMap.addMarker(lat, lng, name, config);

    marker.feature = marker.feature || {type: 'Feature'};
    marker.feature.properties = marker.feature.properties || {};
    marker.feature.properties.type = 'poi';

    marker.on('moveend', function() {
        var latlng = marker.getLatLng();
        dragEvent(latlng.lat,latlng.lng);
    });

    markersArray.push(marker);
    return marker;
}

function removeMarkers(){
    if (markersArray && map.alaMap) {
        for (var i in markersArray) {
            map.alaMap.removeLayer(markersArray[i]);
        }
    }
    markersArray = [];
}

function zoomToShapeBounds(){
    map.zoomToShapeBounds();
}

// expose these methods to the global scope
windows.init_map = init;
windows.getMapCentre = getMapCentre;
windows.addMarker = addMarker;
windows.removeMarkers = removeMarkers;
windows.zoomToShapeBounds = zoomToShapeBounds;

}(this));

