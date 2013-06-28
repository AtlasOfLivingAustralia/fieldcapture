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
        // the DOM container to draw the map in - can be overridden in init options
        containerId: "map-canvas",
        // geocoder instance for address lookups
        geocoder: null,
        // whether to zoom to bounds when all features are loaded
        zoomToBounds: true,
        // maximum zoom
        zoomLimit: 12,
        // whether to highlight features on hover
        highlightOnHover: false,
        // the generalised features as passed in
        features: {},
        // the created map features (points, polys, etc) indexed by an id
        featureIndex: {},
        // a n incremented counter used as id if no id exists in the feature description
        currentId: 0,
        // init map and load features
        init: function (options, features) {
            var self = this;
            this.features = features;
            // handle options
            if (options.mapContainer) {
                this.containerId = options.mapContainer;
            }
            if (features.highlightOnHover) {
                this.highlightOnHover = features.highlightOnHover;
            }
            this.map = new google.maps.Map(document.getElementById(this.containerId), {
                zoom: 3,
                center: new google.maps.LatLng(-28.5, 133.5),
                panControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                scrollwheel: options.scrollwheel,
                zoomControlOptions: {
                    style: 'DEFAULT'
                }
            });
            console.log('[init] ZoomToBounds: ' + features.zoomToBounds);
            console.log('[init] ZoomLimit: ' + features.zoomLimit);
            if (features.zoomToBounds) { this.zoomToBounds = features.zoomToBounds; }
            if (features.zoomLimit) { this.zoomLimit = features.zoomLimit; }
            this.load(features.features);
            return this;
        },
        // loads the features
        load: function (features) {
            var self = this, f;
            $.each(features, function (i,loc) {
                console.log('Loading feature with type:' + loc.type);
                if (loc.type === 'point') {
                    var ll = new google.maps.LatLng(Number(loc.latitude), Number(loc.longitude));
                    f = new google.maps.Marker({
                        map: self.map,
                        position: ll,
                        title: loc.name
                    });
                    self.featureBounds.extend(ll);
                    self.addFeature(f, loc);
                } else if (loc.type === 'circle') {
                   f = new google.maps.Circle({
                      center: new google.maps.LatLng(loc.decimalLatitude, loc.decimalLongitude),
                      radius: loc.radius,
                      map: self.map,
                      editable: false
                   });
                    //set the extend of the map
                   self.featureBounds.extend(f.getBounds().getNorthEast());
                   self.featureBounds.extend(f.getBounds().getSouthWest());
                   self.addFeature(f, loc);
                } else if (loc.type === 'rectangle') {
                   f = new google.maps.Rectangle({
                      bounds: new google.maps.LatLngBounds(
                          new google.maps.LatLng(loc.minLat, loc.minLon),
                          new google.maps.LatLng(loc.maxLat, loc.maxLon)),
                      map: self.map,
                      editable: false
                   });
                   //set the extend of the map
                   self.featureBounds.extend(f.getBounds().getNorthEast());
                   self.featureBounds.extend(f.getBounds().getSouthWest());
                   self.addFeature(f, loc);
                } else if (loc.type === 'polygon') {
                    var paths, points;
                    var paths = geojsonToPaths($.parseJSON(loc.geojson));
                    f = new google.maps.Polygon({
                        paths: paths,
                        map: self.map,
                        title: 'polygon name',
                        editable: false
                    });
                    f.setOptions(self.overlayOptions);
                    // flatten arrays to array of points
                    points = [].concat.apply([], paths);
                    // extend bounds by each point
                    $.each(points, function (i,obj) {self.featureBounds.extend(obj);});
                    self.addFeature(f, loc);
                } else if (loc.type === 'pid') {
                    $.ajax(loc.polygonUrl, {
                        success: function(data) {
                            console.log(data);
                            var paths, points, gj = data.geojson;
                            if (gj.type === 'Polygon') {
                                paths = geojsonToPaths(gj.coordinates);
                                f = new google.maps.Polygon({
                                    paths: paths,
                                    map: self.map,
                                    title: loc.name
                                });
                                f.setOptions(self.overlayOptions);
                                // flatten arrays to array of points
                                points = [].concat.apply([], paths);
                                // extend bounds by each point
                                $.each(points, function (i,obj) {self.featureBounds.extend(obj);});
                                self.addFeature(f, loc);
                            }
                        },
                        dataType: 'json'}
                    );
                } else {
                    // count the location as loaded even if we didn't
                    self.locationLoaded();
                }
            });
            self.allLocationsLoaded();
        },
        addFeature: function (f, loc) {
            var self = this;
            if (this.highlightOnHover) {
                google.maps.event.addListener(f, 'mouseover', function () {
                    self.highlightFeature(this);
                });
                google.maps.event.addListener(f, 'mouseout', function () {
                    self.unHighlightFeature(this);
                });
            }
            this.indexFeature(f, loc);
            this.locationLoaded();
        },
        indexFeature: function (f, loc) {
            var id;
            if (loc.id === undefined) {
                id = this.currentId++;
            } else {
                id = loc.id;
            }
            if (this.featureIndex[id] === undefined) { this.featureIndex[id] = []; }
            this.featureIndex[id].push(f);
        },
        // default overlay options
        overlayOptions: {strokeColor:'#BC2B03',fillColor:'#DF4A21',fillOpacity: 0.3,strokeWeight: 1,
            zIndex: 1, editable:false},
        // keep count of locations as we load them so we know when we've finished
        locationsLoaded: 0,
        // keep a running bounds for loaded locations so we can zoom when all are loaded
        featureBounds: new google.maps.LatLngBounds(),
        // increments the count of loaded locations - zooms map when all are loaded
        locationLoaded: function () {
            this.locationsLoaded++;
            if (this.locationsLoaded === this.features.features.length) {
                // all loaded
                this.allLocationsLoaded();
            }
        },
        // zoom map to show features - but not higher than zoom = 12
        allLocationsLoaded: function () {
            var self = this;
            console.log('All locations loaded - this.zoomToBounds - ' + this.zoomToBounds + " - zoom limit - " + self.zoomLimit);
            if (this.zoomToBounds) {
                console.log(this.featureBounds);
                this.map.fitBounds(this.featureBounds);  // this happens asynchronously so need to wait for bounds to change
                // to sanity-check the zoom level
                var boundsListener = google.maps.event.addListener(this.map, 'bounds_changed', function(event) {
                    if (this.getZoom() >= self.zoomLimit){
                        this.setZoom(self.zoomLimit);
                    }
                    google.maps.event.removeListener(boundsListener);
                });
            }
        },
        //
        highlightFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.highlightFeature(f);
                });
            }
        },
        //
        unHighlightFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.unHighlightFeature(f);
                });
            }
        },
        //
        highlightFeature: function (f) {
            if (!f) { return; }
            if (f instanceof google.maps.Marker) {
                f.setOptions({icon: 'http://collections.ala.org.au/images/map/orange-dot.png'});
            } else if (f instanceof google.maps.Polygon) {
                f.setOptions({
                    strokeColor:'#BC2B03',
                    fillColor:'#DF4A21'
                });
            }
        },
        //
        unHighlightFeature: function (f) {
            if (!f) { return; }
            if (f instanceof google.maps.Marker) {
                f.setOptions({icon: null});
            } else if (f instanceof google.maps.Polygon) {
                f.setOptions({
                    strokeColor:'#202020',
                    fillColor:'#eeeeee'
                });
            }
        },
        hideFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    f.setVisible(false);
                });
            }
        },
        showFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    f.setVisible(true);
                });
            }
        },
        showAllfeatures: function () {
            $.each(this.featureIndex, function (i, obj) {
                $.each(obj, function (j, f) {
                    f.setVisible(true);
                });
            });
        },
        getAddressById: function (id, callback) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    if (f instanceof google.maps.Marker) {
                        if (!self.geocoder) { self.geocoder = new google.maps.Geocoder() }
                        self.geocoder.geocode({location: f.getPosition()},
                            function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    callback(results[0].formatted_address);
                                }
                            });
                    }
                });
            }
        }
    };

    /*
     * Initialises everything including the map.
     *
     * @param options object specifier with the following members:
     * - mapContainer: id of the html element to hold the map
     * @param features: js representation of the generalised description of features
     */
    function init (options, features) {
        return map.init(options, features);
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

function initialiseState(state) {
    switch (state) {
        case 'Queensland': return 'QLD'; break;
        case 'Victoria': return 'VIC'; break;
        case 'Tasmania': return 'TAS'; break;
        default:
            var words = state.split(' '), initials = '';
            for(var i=0; i < words.length; i++) {
                initials += words[i][0]
            }
            return initials;
    }
}
