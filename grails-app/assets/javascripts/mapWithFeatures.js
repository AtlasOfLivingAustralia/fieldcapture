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
    const DEFAULT_POLYGON = {
        "type": "Polygon",
        "coordinates": [
            [
                [112.0, -44.5],
                [154.5, -44.5],
                [154.5, -9.0],
                [112.0, -9.0],
                [112.0, -44.5]
            ]
        ]
    };
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
                    assignNameEnabled: !!options.assignNameEnabled,
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
                    addAllFeaturesFromFile: true
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
            self.loadFeature(site);
        },
        loadFeature: function(site){
            var self = this, loc = site.extent.geometry;
            if(loc != null && loc.type != null){
                var geoJSON = self.convertOldSiteToFeatureCollection(site),
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

            var self = this, convertedFeatures = {type: 'FeatureCollection', features: []};
            $.each(features, function (i,loc) {
                if(loc != null) {
                    var geoJSON = loc;
                    if (map.isOldSite(loc)) {
                        geoJSON = self.convertOldSiteToFeatureCollection(loc).features[0];
                    }
                    else if (map.isSiteGeometry(loc)) {
                        geoJSON = self.convertOldSiteToFeatureCollection({
                            extent : {
                                source: 'drawn',
                                geometry: loc
                            }
                        }).features[0];
                    }

                    geoJSON.properties = geoJSON.properties || {};
                    geoJSON.properties.loc = loc;
                    convertedFeatures.features.push(geoJSON);
                }
            });

            var layerGroup = self.map.setGeoJSON(convertedFeatures);
            layerGroup.eachLayer(function(layer) {
                var geoJSON = layer.toGeoJSON(),
                    style = geoJSON.properties && geoJSON.properties.style || {
                        color: self.overlayOptions.strokeColor,
                        fillOpacity: self.overlayOptions.fillOpacity,
                        weight: self.overlayOptions.strokeWeight
                    };

                self.addFeature(layer, geoJSON.properties.loc);
                self.allMarkers.push(layer);
                layer.on("wmslayer:metadataupdated", function (data) {
                    if (!loc.areaKmSq) {
                        loc.areaKmSq = data.area_km ? data.area_km : 0;
                    }
                });

                 if (layer.setStyle)
                     layer.setStyle(style);
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
        convertSiteToFeatureCollection: function (site) {
            var feature;
            if (site.features && site.features.length > 0) {
                var featureCollection = {
                    type: 'FeatureCollection',
                    features: site.features
                };

                var fc = map.createFeatureCollectionScaffold(site);
                featureCollection.properties = fc.properties;
                return featureCollection;
            }
            else {
                feature = map.convertOldSiteToFeatureCollection(site);
                return ALA.MapUtils.toFeatureCollection(feature);
            }
        },
        convertOldSiteToFeatureCollection: function (site) {
            var fc = map.createFeatureCollectionScaffold(site), feature;
            switch (site.extent.source) {
                case 'drawn':
                    feature = map.convertSourceDrawnToFeature(site);
                    break;
                case 'upload':
                    feature = map.convertSourceUploadToFeature(site);
                    break;
                case 'none':
                    break;
                case 'pid':
                    feature = map.convertSourcePidToFeature(site);
                    break;
                case 'point':
                case 'Point':
                    feature = map.convertSourcePointToFeature(site);
                    break;
                default:
                    console.warn("Unknown site extent source: " + site.extent.source);
                    break;
            }

            if (feature) {
                fc.features.push(feature);
                fc.properties = Object.assign({}, feature.properties, fc.properties);
            }

            return fc;
        },
        createFeatureCollectionScaffold: function (site) {
           return {
                type: 'FeatureCollection',
                features: [],
                properties: {
                    siteId: site.siteId,
                    projects: site.projects,
                    name: site.name,
                    description: site.description,
                    externalIds: site.externalIds,
                    notes: site.notes,
                    publicationStatus: site.publicationStatus
                }
            };
        },
        convertSourceDrawnToFeature: function (site) {
            if (site.extent.source !== 'drawn' || !site.extent.geometry) {
                return null;
            }

            var deletePidAndFid = false,
                siteGeometry = site.extent.geometry,
                geometry = {},
                properties = {
                    ...siteGeometry
                }, feature = {
                    type: 'Feature',
                    properties: properties,
                    geometry: geometry
                };

            siteGeometry.coordinates = map.fixCoordinatesType(siteGeometry.coordinates);
            siteGeometry.centre = map.fixCoordinatesType(siteGeometry.centre);
            if (properties.popup) {
                properties.tooltipContent = properties.popup;
                delete properties.popup;
            }

            switch (siteGeometry.type) {
                case 'Point':
                case 'point':
                    geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                    geometry.coordinates = siteGeometry.coordinates;
                    deletePidAndFid = true;
                    break;
                case 'Circle':
                case 'circle':
                    properties.point_type = properties.type = ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE;
                    geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                    geometry.coordinates = siteGeometry.coordinates || siteGeometry.centre;
                    deletePidAndFid = true;
                    break;
                case 'pid': // this happens on site edit page where source pid is overridden to drawn
                case 'Polygon':
                case 'LineString':
                case 'MultiPoint':
                case 'MultiPolygon':
                case 'MultiLineString':
                    if (siteGeometry.coordinates && siteGeometry.coordinates.length > 0 && !map.isStandardBoundingBoxPolygon(siteGeometry.coordinates)) {
                        geometry.type = siteGeometry.type;
                        geometry.coordinates = siteGeometry.coordinates;
                        deletePidAndFid = true;
                    }
                    else if (siteGeometry.pid) {
                        site.extent.source = 'pid';
                        feature = map.convertSourcePidToFeature(site);
                    }
                    else if (siteGeometry.coordinates && siteGeometry.coordinates.length > 0) {
                        geometry.type = ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE;
                        geometry.coordinates = map.fixCoordinatesType(siteGeometry.coordinates);
                        deletePidAndFid = true;
                    }
                    else {
                        return null;
                    }
                    break;
                default:
                    console.warn("Unknown site geometry type for drawn source: " + siteGeometry.type + ". Defaulting to point.");
                    geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                    geometry.coordinates = siteGeometry.centre;
                    deletePidAndFid = true;
                    if (!ALA.MapUtils.validateGeoJSON(feature))
                        return null;
            }

            if (deletePidAndFid) {
                delete feature.properties.pid;
                delete feature.properties.fid;
            }

            return feature;
        },
        convertSourcePidToFeature: function (site) {
            if (site.extent.source.toLowerCase() !== 'pid' || !site.extent.geometry) {
                return null;
            }

            var siteGeometry = site.extent.geometry,
                geometry = {
                    type: siteGeometry.type
                }, properties = {
                    ...siteGeometry
                }, feature = {
                    type: 'Feature',
                    properties: properties,
                    geometry: geometry
                };

            if (properties.popup) {
                properties.tooltipContent = properties.popup;
                delete properties.popup;
            }

            siteGeometry.coordinates = map.fixCoordinatesType(siteGeometry.coordinates);
            siteGeometry.centre = map.fixCoordinatesType(siteGeometry.centre);
            switch (siteGeometry.type) {
                case 'pid':
                case 'LineString':
                case 'Polygon':
                case 'MultiPolygon':
                case 'MultiLineString':
                case 'MultiPoint':
                    var createSiteFromCoordinates = siteGeometry.coordinates && siteGeometry.coordinates.length > 0 && !map.isStandardBoundingBoxPolygon(siteGeometry.coordinates);
                    geometry.type = createSiteFromCoordinates ? siteGeometry.type : ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE;
                    geometry.coordinates = createSiteFromCoordinates ? siteGeometry.coordinates : DEFAULT_POLYGON.coordinates;
                    if (!createSiteFromCoordinates) {
                        properties.pid = siteGeometry.pid;
                        properties.fid = siteGeometry.fid;
                    }
                    delete properties.point_type;
                    delete properties.type;
                    delete properties.coordinates;
                    delete properties.centre;
                    break;
                case 'point':
                case 'Point':
                    geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                    geometry.coordinates = siteGeometry.coordinates || siteGeometry.centre;
                    delete properties.pid;
                    delete properties.fid;
                    delete properties.point_type;
                    delete properties.type;
                    delete properties.coordinates;
                    delete properties.centre;
                    break;
                default:
                    console.warn("Unknown site geometry type for PID source: " + siteGeometry.type);
                    return null;
            }

            return feature;
        },
        convertSourcePointToFeature: function (site) {
            if (site.extent.source.toLowerCase() !== 'point' || !site.extent.geometry) {
                return;
            }

            var feature = {
                type: "Feature",
                geometry: {
                    type: ALA.MapConstants.DRAW_TYPE.POINT_TYPE,
                    coordinates: map.fixCoordinatesType(site.extent.geometry.coordinates)
                },
                properties: {
                    ...site.extent.geometry,
                    ...site.extent.geometry.properties
                }
            };

            delete feature.properties.coordinates;
            delete feature.properties.type;
            delete feature.properties.properties;
            return feature;
        },
        convertSourceUploadToFeature: function (site) {
            if (site.extent.source !== 'upload' || !site.extent.geometry
                || !site.extent.geometry.coordinates || site.extent.geometry.coordinates.length === 0
                || !site.extent.geometry.type
            ) {
                return;
            }

            var feature = {
                type: "Feature",
                geometry: {
                    type: site.extent.geometry.type,
                    coordinates: map.fixCoordinatesType(site.extent.geometry.coordinates)
                },
                properties: {
                    ...site.extent.geometry,
                    ...site.extent.geometry.properties
                }
            };

            delete feature.properties.coordinates;
            delete feature.properties.type;
            delete feature.properties.properties;
            return feature;
        },
        // Polygon form: coordinates = [ [ [lng,lat], ... ] ]
        isStandardBoundingBoxPolygon: function (coordinates) {
            coordinates = map.fixCoordinatesType(coordinates);
            if (!Array.isArray(coordinates) || coordinates.length !== 1) return false; // no holes
            const ring = coordinates[0];
            if (!Array.isArray(ring) || ring.length !== 5) return false; // 4 corners + closing point

            // Must be closed
            const [firstLng, firstLat] = ring[0];
            const [lastLng, lastLat] = ring[ring.length - 1];
            if (firstLng !== lastLng || firstLat !== lastLat) return false;

            // First 4 must be unique corners
            const corners = ring.slice(0, 4);
            const key = p => `${p[0]},${p[1]}`;
            if (new Set(corners.map(key)).size !== 4) return false;

            // Rectangle bbox corners must have exactly 2 unique lng and 2 unique lat values
            const lngs = [...new Set(corners.map(p => p[0]))];
            const lats = [...new Set(corners.map(p => p[1]))];
            if (lngs.length !== 2 || lats.length !== 2) return false;

            // Each edge must be horizontal or vertical
            for (let i = 0; i < ring.length - 1; i++) {
                const [x1, y1] = ring[i];
                const [x2, y2] = ring[i + 1];
                const horizontal = y1 === y2 && x1 !== x2;
                const vertical = x1 === x2 && y1 !== y2;
                if (!horizontal && !vertical) return false;
            }

            return true;
        },

        fixCoordinatesType: function (coordinates) {
            if (Array.isArray(coordinates)) {
                return coordinates.map(map.fixCoordinatesType);
            }
            else if (typeof coordinates === 'string') {
                return parseFloat(coordinates);
            }

            return coordinates;
        },
        isOldSite: function (site) {
            return site && site.extent && site.extent.source;
        },
        isSiteGeometry: function (geometry) {
            return geometry && (geometry.centre && geometry.centre.length === 2);
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
    windows.convertOldSiteToFeatureCollection = map.convertOldSiteToFeatureCollection;
    windows.convertSourceDrawnToFeature = map.convertSourceDrawnToFeature;
    windows.convertSourceUploadToFeature = map.convertSourceUploadToFeature;
    windows.convertSourcePointToFeature = map.convertSourcePointToFeature;
    windows.convertSourcePidToFeature = map.convertSourcePidToFeature;
    windows.convertSiteToFeatureCollection = map.convertSiteToFeatureCollection;
    windows.isOldSite = map.isOldSite;
    windows.isSiteGeometry = map.isSiteGeometry;
    map.addMarker = addMarker;
    map.removeMarkers = removeMarkers;
    windows.alaMap = map;



}(this));