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
/*
 Javascript to support user selection of areas on a Google map.

 */
(function (windows) {
    "use strict";
/*jslint browser: true, vars: false, white: false, maxerr: 50, indent: 4 */
/*global google, $, WMSTileLayer */

var
    // represents the map and its associated properties and events
    map,
    
    //  Urls are injected from config
    config = {};

/*** map represents the map and its associated properties and events ************************************************/
map = {
    // the google map object
    gmap: null,
    // the DOM container to draw the map in
    containerId: "map-canvas",
    // drawing manager handles user drawn shapes
    drawingManager: null,
    // drawing mode of the map
    mode: 'pointer',
    // list of user-drawn shapes
    shapes: [],
    // externally set callback for when shapes are drawn
    currentShapeCallback: function () {},
    // default overlay options
    overlayOptions: {strokeColor:'#BC2B03',fillColor:'#DF4A21',fillOpacity: 0.5,strokeWeight: 2,
        clickable: false,zIndex: 1,editable: false},
    // the default bounds for the map
    initialBounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(-41.5, 114),
            new google.maps.LatLng(-13.5, 154)),
    // this helps handle double click events
    init: function () {
        // map options
        var options = {
            scrollwheel: false,
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            scaleControl: true,
            scaleControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            panControl: false,
            disableDoubleClickZoom: false,
            draggableCursor: 'pointer',
            mapTypeId: google.maps.MapTypeId.TERRAIN
        },
        that = this;

        // create map
        this.gmap = new google.maps.Map(document.getElementById(this.containerId), options);
        this.gmap.fitBounds(this.initialBounds);
        this.gmap.enableKeyDragZoom();

        // create manager for user drawing
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.RECTANGLE,
                    google.maps.drawing.OverlayType.CIRCLE,
                    google.maps.drawing.OverlayType.POLYGON]
            },
            circleOptions: this.overlayOptions,
            rectangleOptions: this.overlayOptions,
            polygonOptions: this.overlayOptions,
            drawingControl: false
        });
        this.drawingManager.setMap(this.gmap);

        google.maps.event.addListener(this.gmap, 'mouseover', function (e) {
            //console.log('mouseover - ' + this.scrollwheel + " - " + this.draggableCursor);
            if (that.mode === 'pointer') {
                that.gmap.setOptions({draggableCursor:'pointer'});
            } else {
                that.gmap.setOptions({draggableCursor:'crosshair'});
            }
            that.gmap.setOptions({scrollwheel: false});
        });

        // when the user has drawn something
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (e) {
            that.clearShapes();
            that.shapes[0] = e.overlay;
            that.currentShapeCallback('user-drawn', e.type, e.overlay);
            that.gmap.setOptions({scrollwheel: false});
        });
    },
    clearShapes: function () {
        // remove objs
        $.each(this.shapes, function (i, obj) {
            obj.setVisible(false);
        });
        this.currentShapeCallback('clear', 'none');
    },
    /* Reset the map to the default bounds */
    resetViewport: function () {
        this.gmap.fitBounds(this.initialBounds);
    },
    /* Zoom to the bbox of the specified region */
    zoomToRegion: function (regionName) {
        // lookup the bbox from the regions cache
        var bbox;
        if (bbox !== undefined) {
             this.gmap.fitBounds(new google.maps.LatLngBounds(
                    new google.maps.LatLng(bbox.minLat, bbox.minLng),
                    new google.maps.LatLng(bbox.maxLat, bbox.maxLng)));
        }
    },
    // draw an externally supplied area on the map
    showArea: function (type, arg1, arg2, arg3) {
        this.clearShapes();
        switch (type) {
            case 'locality':
            case 'circle':
                var lat = Number(arg1),
                    lng = Number(arg2),
                    radius, center, circle;
                if (lat !== undefined) {
                    center = new google.maps.LatLng(lat, lng);
                    radius = Number(arg3);
                    circle = new google.maps.Circle({
                        center: center,
                        radius: radius,
                        map: this.gmap
                    });
                    circle.setOptions(this.overlayOptions);
                    this.shapes[0] = circle;
                    // simulate drawingManager drawn event
                    this.currentShapeCallback(type, google.maps.drawing.OverlayType.CIRCLE, circle);
                }
                break;
            case 'wkt':
                var paths = wktToArray(arg1);
                this.showArea('polygon', paths);
                break;
            case 'rectangle':
                var rect = new google.maps.Rectangle({
                    bounds: arg1,
                    map: this.gmap
                });
                this.shapes[0] = rect;
                rect.setOptions(this.overlayOptions);
                // simulate drawingManager drawn event
                this.currentShapeCallback(type, google.maps.drawing.OverlayType.RECTANGLE, rect);
                break;
            case 'polygon':
                var poly = new google.maps.Polygon({
                    paths: arg1,
                    map: this.gmap
                });
                poly.setOptions(this.overlayOptions);
                this.shapes[0] = poly;
                // simulate drawingManager drawn event
                this.currentShapeCallback(type, google.maps.drawing.OverlayType.POLYGON, poly);
                break;
            case 'imcra':
                var params = [
                    "FORMAT=image/png8",
                    "LAYERS=ALA:Objects",
                    "viewparams=s:" + arg1,
                    "STYLES=polygon"
                ],
                ov = new WMSTileLayer('imcraLayer', config.spatialWmsUrl, params, null, 0.5);
                this.gmap.overlayMapTypes.setAt(0, ov);
                break;
        }
    },
    changeArea: function (type, arg1, arg2, arg3) {
        switch (type) {
            case 'radius':
                if (this.shapes[0].hasOwnProperty('radius')) {
                    this.shapes[0].setRadius(arg1);
                }
                break;
        }
    },
    setCurrentShapeCallback: function (callback) {
        this.currentShapeCallback = callback;
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

        // clear button handler
        $('#clear').click(function () {
            // remove objs
            map.clearShapes();
            // reset controls
            that.reset();
            // hide data
            $('#drawnArea > div').css('display','none');
            $('#drawnArea input').val("");
        });

        // reset button action
        $('#reset').click(function () {
            map.resetViewport();
        });

        // drawing button action
        $('#control-buttons li[id!="clear"]').click(function () {
            if (this.id === 'reset') { return; }
            // set mode
            map.mode = this.id;
            map.drawingManager.setDrawingMode(that.drawingModeFromId(this.id));

            // highlight current
            that.tools.removeClass('active');
            $(this).addClass('active');

            // show data area
            if (map.mode !== 'pointer') {  // don't clear points if going into pointer mode
                $('#drawnArea > div').css('display','none'); // hide all
                $('#' + this.id + 'Area').css('display','block'); // show this
                // clear data values
                $('#' + this.id + 'Area ')
            }
        });

        // bind listeners for coord input boxes
        $('#circRadius, #circLat, #circLon').on('change', function () {
            // TODO if center changes -> clear locality, if radius changes -> update slider
            var rad = $('#circRadius').val(),
                lat = $('#circLat').val(),
                lng = $('#circLon').val(),
                radius = rad.match(/\d+/),  // trim any trailing 'km'
                meters = Number(radius)*1000;
            that.history['circRadius'] = '20';
            $('#circRadiusUndo').css('display','inline');
            if (lat && lng) {
                map.showArea('circle', lat, lng, meters);
            }
        });
        $('#swLat, #swLon, #neLat, #neLon').on('change', function () {
            var swlat = $('#swLat').val(),
                swlon = $('#swLon').val(),
                nelat = $('#neLat').val(),
                nelon = $('#neLon').val();
            if (swlat && swlon && nelat && nelon) {
                map.showArea('rectangle', new google.maps.LatLngBounds(
                        new google.maps.LatLng(swlat,swlon),
                        new google.maps.LatLng(nelat,nelon)));
            }
        });
        $('#polygonArea').on('change', 'input', function () {
            var path = new Array(),
                lastLat = 0;
            // create a path from the list of inputs (2 inputs per point)
            $('#polygonArea input').each(function (index) {
                if (index % 2 === 0) {
                    lastLat = $(this).val();
                } else {
                    path.push(new google.maps.LatLng(lastLat, $(this).val()));
                }
            });
            map.showArea('polygon', path);
        });
        // bind listeners for undo
        /*$('#circRadiusUndo').click( function () {
            $('#circRadius').val('20');
        });*/
    },
    drawingModeFromId: function (id) {
        $('a.draw-tool-btn').removeClass("active")
        $('#' +id+ ' > a.btn').addClass("active")
        switch (id) {
            case 'circle': return google.maps.drawing.OverlayType.CIRCLE;
            case 'rectangle': return google.maps.drawing.OverlayType.RECTANGLE;
            case 'polygon': return google.maps.drawing.OverlayType.POLYGON;
            case 'pointer': return null;
        }
    },
    reset: function () {
        map.mode = 'pointer';
        $('a.draw-tool-btn').removeClass("active")
        $('#pointer > a.btn').addClass("active")
        map.drawingManager.setDrawingMode(null);
        this.tools.removeClass('active');
        this.pointer.addClass('active');
        this.tools.find('span').remove();
    }
};

// utilities
function round(number, places) {
    var p = places || 4;
    return places === 0 ? number.toFixed() : number.toFixed(p);
}

// works for POLYGON and MULTIPOLYGON
function wktToArray(wkt) {
    var matcher = wkt.match(/[0-9.,\- ]+/g),    ///(\([0-9.,\- ]+\))/g),
        points, coords, inner,
        arr = [];

    // array of arrays
    $.each(matcher, function (i,pointsStr) {
        inner = new Array();
        points = pointsStr.split(',');
        $.each(points, function (i,coordsStr) {
            coords = coordsStr.split(' ');
            inner.push(new google.maps.LatLng(coords[1],coords[0]));
        });
        arr.push(inner);
    });
    return arr;
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
    config.spatialCacheUrl = options.spatialCache;

    /*****************************************\
    | Create map
    \*****************************************/
    if (options.mapContainer) {
        map.containerId = options.mapContainer;
    }
    map.init();

    // init controls
    controls.init(config.baseUrl);
}
function showOnMap(arg1, arg2, arg3, arg4) {
    if (arg1 === 'wktFromPid') {
        showWktForObject(arg2);
    } else {
        map.showArea(arg1, arg2, arg3, arg4);
    }
}
function updateMap(arg1, arg2, arg3, arg4) {
    map.changeArea(arg1, arg2, arg3, arg4);
}
function clearShapes() {
    map.clearShapes();
}
function setCurrentShapeCallback(callback) {
    map.setCurrentShapeCallback(callback);
}

    // expose these methods to the global scope
    windows.init_map = init;
    windows.showOnMap = showOnMap;
    windows.updateMap = updateMap;
    windows.clearMap = clearShapes;
    windows.setCurrentShapeCallback = setCurrentShapeCallback;

}(this));

