/*
 *  Copyright (C) 2013 Atlas of Living Australia
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
    /*global google, $ */

    var
    // represents the map and its associated properties and events
        map,

    //  Urls are injected from config
        config = {};

    /*** map represents the map and its associated properties and events ************************************************/
    map = {
        // the google map object
        map: null,
        // the DOM container to draw the map in
        containerId: "map-canvas",
        zoomToBounds: true,
        zoomLimit: 12,
        features: [],
        init: function (features) {
            this.features = features;
            this.map = new google.maps.Map(document.getElementById(this.containerId), {
                zoom: 3,
                center: new google.maps.LatLng(-28.5, 133.5),
                panControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoomControlOptions: {
                    style: 'DEFAULT'
                }
            });
            if (features.zoomToBounds) { this.zoomToBounds = features.zoomToBounds}
            if (features.zoomLimit) { this.zoomLimit = features.zoomLimit}
            this.load(features);
        },
        load: function (features) {
            var self = this;
            $.each(features.features, function (i,loc) {
                if (loc.type === 'point') {
                    var ll = new google.maps.LatLng(Number(loc.latitude), Number(loc.longitude));
                    new google.maps.Marker({
                        map: self.map,
                        position: ll,
                        title: loc.name
                    });
                    self.featureBounds.extend(ll);
                    self.locationLoaded();
                } else if (loc.type === 'pid') {
                    $.ajax(loc.polygonUrl, {
                            success: function(data) {
                                var paths, points;
                                if (data.type === 'Polygon') {
                                    paths = geojsonToPaths(data.coordinates);
                                    new google.maps.Polygon({
                                        paths: paths,
                                        map: self.map,
                                        title: loc.name
                                    }).setOptions(self.overlayOptions);
                                    // flatten arrays to array of points
                                    points = [].concat.apply([], paths);
                                    // extend bounds by each point
                                    $.each(points, function (i,obj) {self.featureBounds.extend(obj);});
                                    self.locationLoaded();
                                }
                            },
                            dataType: 'json'}
                    );
                } else {
                    // count the location as loaded even if we didn't
                    self.locationLoaded();
                }
            });
        },
        // default overlay options
        overlayOptions: {strokeColor:'#BC2B03',fillColor:'#DF4A21',fillOpacity: 0.3,strokeWeight: 1,
            zIndex: 1},
        // keep count of locations as we load them so we know when we've finished
        locationsLoaded: 0,
        // keep a running bounds for loaded locations so we can zoom when all are loaded
        featureBounds: new google.maps.LatLngBounds(),
        // increments the count of loaded locations - zooms map when all are loaded
        locationLoaded: function () {
            this.locationsLoaded++;
            if (this.locationsLoaded === this.features.features.length) {
                // all loaded
                this.allLocationsLoaded()
            }
        },
        // zoom map to show features - but not higher than zoom = 12
        allLocationsLoaded: function () {
            var self = this;
            if (this.zoomToBounds) {
                this.map.fitBounds(this.featureBounds);  // this happens asynchronously so need to wait for bounds to change
                // to sanity-check the zoom level
                var boundsListener = google.maps.event.addListener(this.map, 'bounds_changed', function(event) {
                    if (this.getZoom() > self.zoomLimit){
                        this.setZoom(self.zoomLimit);
                    }
                    google.maps.event.removeListener(boundsListener);
                });
            }
        }
    };

    /*
     * Initialises everything including the map.
     *
     * @param options object specifier with the following members:
     * - server: url of the server the app is running on
     * - spatialService:
     * - mapContainer: id of the html element to hold the map
     */
    function init (options, features) {
        config.baseUrl = options.server;
        //config.spatialServiceUrl = options.spatialService;

        /*****************************************\
         | Create map
         \*****************************************/
        if (options.mapContainer) {
            map.containerId = options.mapContainer;
        }
        map.init(features);
    }

    // expose these methods to the global scope
    windows.init_map_with_features = init;

}(this));

function geojsonToPaths(obj) {
    return gjToLatLngs(obj);
}

function gjToLatLngs(arr) {
    var i, len = arr.length;
    for (i = 0; i < len; i++) {
        if (isCoord(arr[i])) {
            arr[i] = new google.maps.LatLng(arr[i][1],arr[i][0]);
        } else if ($.isArray(arr[[i]])){
            arr[i] = gjToLatLngs(arr[i]);
        }
    }
    return arr;
}

function isCoord(arr) {
    return arr.length === 2 && !isNaN(arr[0]) && !isNaN(arr[1]);
}
