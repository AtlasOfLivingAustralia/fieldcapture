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
        map, prevMarker,

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
        //default center
        defaultCenter: L.latLng(-28.5, 133.5),
        //default center
        defaultZoom: 3,
        // default overlay options
        overlayOptions: {strokeColor:'#BC2B03',fillColor:'#DF4A21',fillOpacity:0.3,strokeWeight:1,zIndex:1,editable:false},
        // keep count of locations as we load them so we know when we've finished
        locationsLoaded: 0,
        // URL to small dot icon
        smallDotIcon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png", // blue: measle_blue.png

        allMarkers : [],
        // URL to red google marker icon
        redMarkerIcon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
        //spatial portal URL
        featureService: "http://fieldcapture.ala.org.au/proxy/feature",
        //WMS server for PID
        wmsServer: "http://spatial-dev.ala.org.au/geoserver",
        // Default size (in km2) below which a marker will be added to a polygon to increase it's visibility
        polygonMarkerAreaKm2 : 0.01,
        // init map and load features
        init: function (options, features) {
            var self = this,
                googleLayer = L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'roadmap'}),
                config = {
                    drawOptions: false,
                    drawControl: false,
                    maxZoom: 23,
                    maxAutoZoom: 21,
                    showReset: !!options.showReset,
                    allowSearchLocationByAddress: false,
                    allowSearchRegionByAddress: false,
                    useMyLocation: false,
                    singleDraw: false,
                    singleMarker: false,
                    markerOrShapeNotBoth: false,
                    wmsLayerUrl: options.spatialWmsUrl + '/wms/reflect?',
                    wmsFeatureUrl: options.featureService + '?featureId=',
                    otherLayers: {
                        Roadmap: googleLayer,
                        Hybrid: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'hybrid'}),
                        Terrain: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'terrain'})
                    },
                    allowKnownShapesControl: false,
                    baseLayer: googleLayer,
                    zoomToObject: true,
                    addAllFeaturesFromFile: false
                };
            this.features = features;
            // handle options
            if (options.mapContainer) {
                this.containerId = options.mapContainer;
            }
            if(options.featureService){
                this.featureService = options.featureService;
            }
            if(options.wmsServer){
                this.wmsServer = options.wmsServer;
            }
            if (features.highlightOnHover) {
                this.highlightOnHover = features.highlightOnHover;
            }
            if (options.polygonMarkerAreaKm2 !== undefined) {
                this.polygonMarkerAreaKm2 = options.polygonMarkerAreaKm2;
            }

            if(!this.map)
                this.map = new ALA.Map(this.containerId, config);

            if(features.features !== undefined){
                self.load(features.features);
            }
            return this;
        },

        toggleMarkerVisibility:function(type, visible){
            var mapImpl = this.map.getMapImpl();
            $.each(this.allMarkers, function(idx, marker){
                var legendName = marker.feature && marker.feature.properties && marker.feature.properties.legendName;
                if(type === legendName){
                    if (visible) {
                        if (!mapImpl.hasLayer(marker)) {
                            mapImpl.addLayer(marker);
                        }
                    }
                    else if (mapImpl.hasLayer(marker)) {
                        mapImpl.removeLayer(marker);
                    }
                }
            });
        },
        reset:function(){
            var self = this;
            self.map.zoom(self.defaultZoom, self.defaultCenter);
            self.featureIndex = {};
            self.allMarkers = [];
        },
        replaceAllFeatures: function(features) {
            this.features.features = features;
            this.locationsLoaded = 0;
            this.map.clearMarkers();
            this.map.clearLayers();
            this.load(features);
        },
        mapSite: function(site){
            var self = this;
            self.loadFeature(site.extent.geometry);
        },
        loadFeature: function(loc){
            var self = this;
            if(loc != null && loc.type != null){
                var geoJSON = self.convertSiteToGeoJSON(loc),
                    style = geoJSON.properties && geoJSON.properties.style || {
                        color: self.overlayOptions.strokeColor,
                        fillOpacity: self.overlayOptions.fillOpacity,
                        weight: self.overlayOptions.strokeWeight
                    };

                if (geoJSON.properties && geoJSON.properties.style) {
                    delete geoJSON.properties.style;
                }

                var layerGroup = self.map.setGeoJSON(geoJSON);
                layerGroup.eachLayer(function(layer) {
                    self.addFeature(layer, loc);
                    self.allMarkers.push(layer);
                    layer.on("wmslayer:metadataupdated", function (data) {
                        if (!loc.areaKmSq) {
                            loc.areaKmSq = data.area_km ? data.area_km : 0;
                        }
                    });
                });

                if (layerGroup && layerGroup.setStyle) {
                    layerGroup.setStyle(style);
                }
            }
        },
        // loads the features
        load: function(features) {
            if(features === undefined || features.length == 0){
                return;
            }

            var self = this;
            $.each(features, function (i,loc) {
                if(loc != null){
                    self.loadFeature(loc);
                }
            });

            self.map.fitBounds();
        },
        addFeature: function (layer, loc) {
            var self = this;
            if (this.highlightOnHover) {
                layer.on('mouseover', function () {
                    self.map.highlightLayer(layer);
                });
                layer.on('mouseout', function () {
                    self.map.unHighlightLayer(layer);
                });
            }
            if (loc.popup && layer.bindPopup) {
                layer.bindTooltip(loc.popup);
            }

            // Add a marker at the centroid of the polygon for small polygons so they are visible despite the zoom level.
            if (loc.type.toLowerCase() !== 'point' && loc.type.toLowerCase() !== 'dot' && loc.areaKmSq < self.polygonMarkerAreaKm2) {
                if (loc.centre) {
                    var latLng = L.latLng(loc.centre[1], loc.centre[0]);
                    var marker = L.marker(latLng, {title: ''}).addTo(self.map.getMapImpl());
                    loc.marker = marker;
                }

            }
            this.indexFeature(layer, loc);
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
            if (loc.marker) {
                this.featureIndex[id].push(loc.marker);
            }
        },
        highlightFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(features, function (i,f) {
                    self.map.highlightLayer(f);
                });
            }
        },
        //
        unHighlightFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.map.unHighlightLayer(f);
                });
            }
        },
        animateFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            var returnVal = false;
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.animateFeature(f);
                });
                returnVal = true;
            }
            return returnVal;
        },
        unAnimateFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.unAnimateFeature(f);
                });
            }
        },
        animateFeature: function (f) {
            if (!f) { return; }
            if (f.setIcon) {
                f.setIcon(L.icon({
                    iconUrl: map.redMarkerIcon,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                }));
            }
        },
        unAnimateFeature: function (f) {
            if (!f) { return; }
            if (f.setIcon) {
                f.setIcon(L.icon({
                    iconUrl: map.smallDotIcon,
                    iconSize: [7, 7],
                    iconAnchor: [3, 3]
                }));
            }
        },
        getExtentByFeatureId: function(id) {
            var features = this.featureIndex[id];
            //console.log("features", id, features);
            if (features) {
                var bounds = L.latLngBounds();
                $.each(features, function (i,f) {
                    if (f.getLatLng) {
                        bounds.extend(f.getLatLng());
                    } else if (f.getBounds) {
                        bounds.extend(f.getBounds());
                    }
                });
                return bounds;
            }
        },
        hideFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.map.hideLayer(f);
                });
            }
        },
        showFeatureById: function (id) {
            var self = this,
                features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    self.map.showLayer(f);
                });
            }
        },
        showAllfeatures: function () {
            var mapImpl = this.map.getMapImpl();
            $.each(this.featureIndex, function (i, obj) {
                $.each(obj, function (j, f) {
                    self.map.showLayer(f);
                });
            });
        },
        getAddressById: function (id, callback) {
            var features = this.featureIndex[id];
            if (features) {
                $.each(this.featureIndex[id], function (i,f) {
                    if (f.getLatLng) {
                        var latLng = f.getLatLng();
                        callback(round(latLng.lat, 6) + ', ' + round(latLng.lng, 6));
                    }
                });
            }
        },
        clearFeatures: function(){
            var self = this;
            var mapImpl = self.map.getMapImpl();
            //clear map of features
            $.each(self.featureIndex, function (i, obj) {

                $.each(obj, function (j, f) {
                    if (mapImpl.hasLayer && mapImpl.hasLayer(f)) {
                        mapImpl.removeLayer(f);
                    }
                });
            });

            self.reset();

        },
        convertSiteToGeoJSON: function (site) {
            var geometry = {
                type: site.type,
                coordinates: site.coordinates
            }, properties = {
                ...site
            }, feature = {
                type: 'Feature',
                properties: properties,
                geometry: geometry
            };

            if (properties.popup) {
                properties.tooltipContent = properties.popup;
                delete properties.popup;
            }

            if (properties.pid && turf.booleanValid(feature))
                delete properties.pid;

            if (site.type === 'point')
                geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
            else if (site.type === 'pid') {
                geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                properties.pid = site.pid;
                properties.point_type = properties.type = 'pid';
            }

            delete properties.type;
            delete properties.coordinates;

            return feature;
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

    function mapSite(site){
        return map.mapSite(site)
    }

    function clearMap(){
        map.clearFeatures();
    }


    var markersArray = [];

    function addMarker(lat, lng, name, config) {
        var marker;
        config = config || {};
        config.draggable = false;
        config.title = name;
        if (config.poiIconUrl) {
            config.icon = L.icon({
                iconUrl: config.poiIconUrl,
                iconSize: [32, 26],
                iconAnchor: [16, 26],
                popupAnchor: [0, -26]
            });

            delete config.poiIconUrl;
        }

        var currentZoomToObject = map.map.getZoomToObject();
        map.map.setZoomToObject(false);
        marker = map.map.addMarker(lat, lng, name, config);
        map.map.setZoomToObject(currentZoomToObject);
        markersArray.push(marker);
    }

    function removeMarkers(){
        if (markersArray) {
            map.map.clearMarkers();
        }
        markersArray = [];
    }

    // expose these methods to the global scope
    windows.init_map_with_features = init;
    windows.mapSite = mapSite;
    windows.clearMap = clearMap;
    windows.addMarker = addMarker;
    windows.removeMarkers = removeMarkers;
    map.addMarker = addMarker;
    map.removeMarkers = removeMarkers;
    windows.alaMap = map;



}(this));