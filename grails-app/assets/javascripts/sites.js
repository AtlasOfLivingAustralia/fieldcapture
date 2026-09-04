
var SiteViewModel = function (site, feature, options) {
    var self = $.extend(this, new Documents());

    self.siteId = site.siteId;
    self.name = ko.observable(site.name);
    self.externalId = ko.observable(site.externalId);
    site.externalIds = site.externalIds || [];
    self.context = ko.observable(site.context);
    self.type = ko.observable(site.type);
    self.area = ko.observable(site.area);
    self.description = ko.observable(site.description);
    self.notes = ko.observable(site.notes);
    self.extent = ko.observable(new EmptyLocation());
    self.state = ko.observable('');
    self.nrm = ko.observable('');
    self.address = ko.observable("");
    self.feature = feature;
    self.features = ko.observableArray(site.features || []);
    self.projects = site.projects || [];

    self.setAddress = function (address) {
        if (address.indexOf(', Australia') === address.length - 11) {
            address = address.substr(0, address.length - 11);
        }
        self.address(address);
    };
    self.poi = ko.observableArray().extend({deferred: true});

    self.addPOI = function(poi) {
        self.poi.push(poi);

    };
    self.removePOI = function(poi){
        if (poi.hasPhotoPointDocuments) {
            return;
        }
        self.poi.remove(poi);
    };
    self.toJS = function(){
        var js = ko.mapping.toJS(self, {ignore:self.ignore});
        js.extent = self.extent().toJS();
        delete js.extentGeometryWatcher;
        delete js.isValid;
        return js;
    };

    self.modelAsJSON = function() {
        var js = self.toJS();
        return JSON.stringify(js);
    };
    /** Check if the supplied POI has any photos attached to it */
    self.hasPhotoPointDocuments = function(poi) {
        if (!site.documents) {
            return;
        }
        var hasDoc = false;
        $.each(site.documents, function(i, doc) {
            if (doc.poiId === poi.poiId) {
                hasDoc = true;
                return false;
            }
        });
        return hasDoc;
    };
    self.saved = function(){
        return self.siteId;
    };
    self.loadPOI = function (pois) {
        if (!pois) {
            return;
        }
        $.each(pois, function (i, poi) {
            self.poi.push(new POI(poi, self.hasPhotoPointDocuments(poi)));
        });
    };
    self.loadExtent = function(){
        if(site && site.extent) {
            var extent = site.extent;
            switch (extent.source) {
                // deprecating point, pid and upload source types in favour of just drawn, but still need to support loading of old sites with those source types.
                case 'drawn':
                default:
                    self.extent(new GenericLocation(extent.geometry)); break;
            }
        } else {
            self.extent(new EmptyLocation());
        }
    };

    self.refreshGazInfo = function() {

        var geom = self.extent().geometry();
        var lat, lng;
        if (geom.type === 'Point') {
            lat = self.extent().geometry().decimalLatitude();
            lng = self.extent().geometry().decimalLongitude();
        }
        else if (geom.centre !== undefined) {
            lat = self.extent().geometry().centre()[1];
            lng = self.extent().geometry().centre()[0];
        }
        else {
            // No coordinates we can use for the lookup.
            return;
        }

        $.ajax({
            url: fcConfig.siteMetaDataUrl,
            method:'POST',
            contentType: 'application/json',
            data:self.modelAsJSON()
        })
            .done(function (data) {
                var geom = self.extent().geometry();
                for (var name in data) {
                    if (data.hasOwnProperty(name) && geom.hasOwnProperty(name)) {
                        geom[name](data[name]);
                    }
                }
            });

        //do the google geocode lookup
        $.ajax({
            url: fcConfig.geocodeUrl + lat + "," + lng
        }).done(function (data) {
            if (data.results.length > 0) {
                self.extent().geometry().locality(data.results[0].formatted_address);
            }
        });
    };
    self.isValid = ko.pureComputed(function() {
        return self.extent() && self.extent().isValid();
    });
    self.loadPOI(site.poi);
    self.loadExtent(site.extent);


    // Watch for changes to the extent content and notify subscribers when they do.
    self.extentGeometryWatcher = ko.pureComputed(function() {
        // We care about changes to either the geometry coordinates or the PID in the case of known shape.
        var result = {};
        if (self.extent()) {
            var geom = self.extent().geometry();
            if (geom) {
                if (geom.decimalLatitude) result.decimalLatitude = ko.utils.unwrapObservable(geom.decimalLatitude);
                if (geom.decimalLongitude) result.decimalLongitude = ko.utils.unwrapObservable(geom.decimalLongitude);
                if (geom.coordinates) result.coordinates = ko.utils.unwrapObservable(geom.coordinates);
                if (geom.pid) result.pid = ko.utils.unwrapObservable(geom.pid);
                if (geom.fid) result.fid = ko.utils.unwrapObservable(geom.fid);
            }

        }
        return result;

    });

    self.transients = self.transients || {};
    self.transients.radiiOfCircles = ko.pureComputed(function() {
        var radii = [];
        var features = self.features();
        var circles = features.filter( feature => feature.properties && feature.properties.point_type === ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE )
        circles && circles.forEach(function(circle) {
            radii.push({name: circle.properties.name, radius: circle.properties.radius, featureId: circle.properties.featureId});
        });

        return radii;
    });
    self.transients.siteCreated = ko.observable(false);
    self.transients.loading = ko.observable(false);
    self.transients.tempSiteId = ko.observable();
    if (typeof UUID !== 'undefined') {
        self.transients.tempSiteId(UUID.generate());
    }
};

var POI = function (l, hasDocuments) {
    var self = this;
    self.poiId = ko.observable(exists(l, 'poiId'));
    self.name = ko.observable(exists(l,'name'));
    self.type = ko.observable(exists(l,'type'));
    var transient = {
        marker: null,
        popupContent: ko.pureComputed(function() {
            var content = '<table><tbody>';
            content += '<tr><td>Name</td><td>' + _.escape(self.name()) + '</td></tr>';
            content += '<tr><td>Type</td><td>' + _.escape(self.type()) + '</td></tr>';
            content += '</tbody></table>';
            return content;
        }),
        updatePopupContent: function () {
            if (transient.marker) {
                transient.marker.setPopupContent(transient.popupContent());
            }
        }
    };

    transient.popupContent.subscribe(transient.updatePopupContent);
    self.hasPhotoPointDocuments = hasDocuments;
    var storedGeom;
    if(l !== undefined){
        storedGeom = l.geometry;
    }
    self.dragEvent = function(lat,lng){
        self.geometry().decimalLatitude(lat);
        self.geometry().decimalLongitude(lng);
    };
    self.description = ko.observable(exists(l,'description'));
    self.geometry = ko.observable({
        type: 'Point',
        decimalLatitude: ko.observable(exists(storedGeom,'decimalLatitude')),
        decimalLongitude: ko.observable(exists(storedGeom,'decimalLongitude')),
        uncertainty: ko.observable(exists(storedGeom,'uncertainty')),
        precision: ko.observable(exists(storedGeom,'precision')),
        datum: ko.observable(exists(storedGeom,'datum')),
        bearing: ko.observable(exists(storedGeom,'bearing'))
    });
    self.hasCoordinate = function () {
        var hasCoordinate = self.geometry().decimalLatitude() !== undefined
            && self.geometry().decimalLatitude() !== ''
            && self.geometry().decimalLongitude() !== undefined
            && self.geometry().decimalLongitude() !== '';

        return hasCoordinate;
    };
    self.toJSON = function(){
        var js = ko.mapping.toJS(self);
        delete js.hasPhotoPointDocuments;
        if(js.geometry.decimalLatitude !== undefined
            && js.geometry.decimalLatitude !== ''
            && js.geometry.decimalLongitude !== undefined
            && js.geometry.decimalLongitude !== ''){
            js.geometry.coordinates = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
        }
        return js;
    };

    self.toJS = function() {
        return self.toJSON();
    };

    self.getTransient = function() {
        return transient;
    };
};

var EmptyLocation = function () {
    this.source = ko.observable('none');
    this.geometry = ko.observable({type:'empty'});
    this.isValid = function() {
        return false;
    };
    this.toJS = function() {
        return {};
    };
};

var GenericLocation = function (l) {
    var self = this;
    self.source = ko.observable('drawn');
    self.geometry = ko.observable({
        type: ko.observable(exists(l,'type')),
        centre: ko.observable(exists(l,'centre')),
        radius: ko.observable(exists(l,'radius')),
        lga: ko.observable(exists(l,'lga')),
        state: ko.observable(exists(l,'state')),
        locality: ko.observable(exists(l,'locality')),
        nrm: ko.observable(exists(l,'nrm')),
        mvg: ko.observable(exists(l,'mvg')),
        mvs: ko.observable(exists(l,'mvs')),
        areaKmSq: ko.observable(exists(l,'areaKmSq')),
        coordinates: ko.observable(exists(l,'coordinates')),
        pid : ko.observable(exists(l,'pid')),
        name : ko.observable(exists(l,'name')),
        fid : ko.observable(exists(l,'fid')),
        layerName : ko.observable(exists(l,'layerName')),
        area : ko.observable(exists(l,'area')),
        decimalLatitude: ko.observable(exists(l,'decimalLatitude')),
        decimalLongitude: ko.observable(exists(l,'decimalLongitude')),
        uncertainty: ko.observable(exists(l,'uncertainty')),
        precision: ko.observable(exists(l,'precision')),
        datum: ko.observable('WGS84'), // only supporting WGS84 at the moment.
    });
    self.updateGeom = function(l){
        self.geometry().type(exists(l,'type'));
        self.geometry().centre(exists(l,'centre'));
        self.geometry().lga(exists(l,'lga'));
        self.geometry().nrm(exists(l,'nrm'));
        self.geometry().radius(exists(l,'radius'));
        self.geometry().state(exists(l,'state'));
        self.geometry().locality(exists(l,'locality'));
        self.geometry().mvg(exists(l,'mvg'));
        self.geometry().mvs(exists(l,'mvs'));
        self.geometry().areaKmSq(exists(l,'areaKmSq'));
        self.geometry().coordinates(exists(l,'coordinates'));
        self.geometry().pid(exists(l,'pid'));
        self.geometry().name(exists(l,'name'));
        self.geometry().fid(exists(l,'fid'));
        self.geometry().layerName(exists(l,'layerName'));
        self.geometry().area(exists(l,'area'));
        self.geometry().decimalLatitude(exists(l,'decimalLatitude'));
        self.geometry().decimalLongitude(exists(l,'decimalLongitude'));
        self.geometry().uncertainty(exists(l,'uncertainty'));
        self.geometry().precision(exists(l,'precision'));
        self.geometry().datum('WGS84'); // only supporting WGS84 at the moment.
    };
    self.toJS= function() {
        var js = ko.toJS(self);
        return js;
    };
    self.isValid = function() {
        return self.geometry().coordinates();
    };
};

function SiteViewModelWithMapIntegration (siteData, projectId, options) {
    var self = this,
        alaMap,
        deferredUpdate = ko.observable(false).extend({rateLimit: {timeout: 1000, method: 'notifyWhenChangesStop'}}),
        options = {
            styleProperty: 'type',
            styles: {
                compound: {
                    color: '#f00',
                    fillOpacity: 0.2,
                    weight: 3
                },
                worksArea: {
                    color: '#0f0',
                    fillOpacity: 0.2,
                    weight: 3
                }
            }
        },
        type = siteData.type === 'compound'? 'compound' : 'worksArea',
        currentStyle = options.styles[type],
        layerOptions = { style: currentStyle },
        geomanOptions = {
            pathOptions: currentStyle,
            hintlineStyle: currentStyle,
            templineStyle: currentStyle
        };

    SiteViewModel.apply(self, [siteData, null, options]);

    self.renderPOIs = function(){
        removeMarkers();
        for(var i=0; i<self.poi().length; i++){
            var poi =self.poi()[i],
                transient = poi.getTransient();

            transient.marker = addMarker(poi.geometry().decimalLatitude(), poi.geometry().decimalLongitude(), poi.name(), poi.dragEvent);
        }
    };
    self.newPOI = function(){
        //get the center of the map
        var lngLat = getMapCentre();
        var randomBit = (self.poi().length + 1) /1000;
        var poi = new POI({name:'Point of interest #' + (self.poi().length + 1) , geometry:{decimalLongitude:lngLat[0] - (0.001+randomBit),decimalLatitude:lngLat[1] - (0.001+randomBit)}}, false);
        self.addPOI(poi);
        self.watchPOIGeometryChanges(poi);

    };
    self.notImplemented = function () {
        alert("Not implemented yet.")
    };

    self.watchPOIGeometryChanges = function(poi) {
        poi.geometry().decimalLatitude.subscribe(self.renderPOIs);
        poi.geometry().decimalLongitude.subscribe(self.renderPOIs);
    };
    self.poi.subscribe(self.renderPOIs);
    $.each(self.poi(), function(i, poi) {
        self.watchPOIGeometryChanges(poi);
    });

    self.renderOnMap = function(){
        if (!alaMap) {
            return;
        }

        var site = self.toJS();
        //retrieve the current shape if exists
        if (self.features().length > 0) {
            var featureCollection = convertSiteToFeatureCollection(site);
            if (featureCollection.features.every ( feature => turf.booleanValid(feature) )) {
                try {
                    featureCollection = turf.simplify(featureCollection, {tolerance: 0.0001, highQuality: false});
                }
                catch (e) {
                    console.error("Error simplifying geometry for display on map", e);
                    console.log("Falling back to unsimplified geometry");
                }

                alaMap.setGeoJSON(featureCollection, layerOptions);
            }
            else
                console.error("Invalid feature collection", featureCollection);
        } else {
            var feature = convertSiteGeometryToFeature(site.extent.geometry);
            if (turf.booleanValid(feature)) {
                try {
                    feature = turf.simplify(feature, {tolerance: 0.0001, highQuality: false});
                }
                catch (e) {
                    console.error("Error simplifying geometry for display on map", e);
                    console.log("Falling back to unsimplified geometry");
                }

                alaMap.setGeoJSON(feature, layerOptions);
            }
        }

        alaMap.fitBounds();
    };

    self.mapInitialised = function(map) {
        alaMap = map;
        var leafletMap = alaMap.getMapImpl();
        // set geoman style to match the site type style
        if (leafletMap.pm && leafletMap.pm.setGlobalOptions) {
            leafletMap.pm.setGlobalOptions(geomanOptions);
        }
        alaMap.setStyle(currentStyle);

        self.renderPOIs();
        self.renderOnMap();
        deferredUpdate.subscribe(self.updateGeometry);
        alaMap.registerListener('pm:globaleditmodetoggled', modeListener);
        alaMap.registerListener('pm:globaldragmodetoggled', modeListener);
        alaMap.registerListener('pm:globalremovalmodetoggled', modeListener);
        alaMap.registerListener('pm:globalcutmodetoggled', modeListener);
        alaMap.registerListener('pm:globalrotatemodetoggled', modeListener);
        listenLayerEvents();
    };

    self.newActivity = function() {
        var context = '',
            siteId = self.siteId,
            returnTo = '?returnTo=' + encodeURIComponent(document.location.href);
        if (projectId) {
            context += '&projectId=' + projectId;
        }
        if (siteId) {
            context += '&siteId=' + siteId;
        }
        document.location.href = fcConfig.activityCreateUrl + returnTo + context;
    };

    self.updateGeometryAndRefreshGazInfo = function() {
        var updated = self.updateGeometry();
        updated && self.refreshGazInfo();
    };

    self.updateGeometry = function () {
        var featureCollection = alaMap.getGeoJSON(), bounds = alaMap.getBounds(), boundsGeoJSON, updated = false;
        if (featureCollection && featureCollection.features && featureCollection.features.length > 0) {
            featureCollection.features = filterOutPOIsFromFeatures(featureCollection.features);
            if (featureCollection.features !== self.features()) {
                self.features(featureCollection.features);
                var area = ALA.MapUtils.calculateAreaKmSq(featureCollection);
                boundsGeoJSON = convertLatLngBoundsToGeoJson(bounds);
                if (boundsGeoJSON) {
                    self.extent().geometry().coordinates(boundsGeoJSON.coordinates);
                    self.extent().source('drawn');
                    self.extent().geometry().type(boundsGeoJSON.type);
                }

                if (area) {
                    self.extent().geometry().areaKmSq(area);
                }

                // get centre of the shapes
                var centre = bounds.getCenter();
                if (centre) {
                    self.extent().geometry().centre([centre.lng, centre.lat]);
                }

                updated = true;
            }
        }

        return updated;
    };

    self.highlightFeature = function(model) {
        alaMap.highlightFeaturesByProperty('featureId', model.featureId);
    }

    self.unHighlightFeature = function(model) {
        alaMap.unHighlightFeaturesByProperty('featureId', model.featureId);
    }

    function getFeatureProperties() {
        return  {
            id: self.siteId || '',
            name: self.name() || '',
            externalId: self.externalId() || '',
            type: self.type() || '',
            context: self.context() || ''
        };
    }

    function filterOutPOIsFromFeatures(features) {
        features = features || [];
        return features.filter(function(feature) {
            return feature.properties && feature.properties.type !== 'poi';
        });
    }

    function convertLatLngBoundsToGeoJson (bounds) {
        if (!bounds) {
            return;
        }

        return {
            type: 'Polygon',
            coordinates: [[
                [bounds.getWest(), bounds.getSouth()],
                [bounds.getWest(), bounds.getNorth()],
                [bounds.getEast(), bounds.getNorth()],
                [bounds.getEast(), bounds.getSouth()],
                [bounds.getWest(), bounds.getSouth()]
            ]]
        };
    }

    function ignoreLayerEvents() {
        alaMap.removeListener('layeradd', updateFlagToggle);
        alaMap.removeListener('layerremove', updateFlagToggle);
    }

    function listenLayerEvents() {
        alaMap.registerListener('layeradd', updateFlagToggle);
        alaMap.registerListener('layerremove', updateFlagToggle);
    }

    function modeListener(e) {
        if (!e.enabled) {
            self.updateGeometryAndRefreshGazInfo();
        }
    }

    function updateFlagToggle() {
        deferredUpdate(!deferredUpdate());
    }
};

/**
 * Implements the API that the mapWithFeatures script provides and delegates to the map library provided
 * by the ALA map plugin.
 */
var AlaMapAdapter = function(map, options) {
    var self = this;

    var defaults = {
        styleProperty: 'type',
        styles: {
            compound: {
                color: '#f00',
                fillOpacity: 0.2,
                weight: 3
            },
            worksArea: {
                color: '#0f0',
                fillOpacity: 0.2,
                weight: 3
            }
        }
    };
    var options = _.defaults(options, defaults);

    self.featureIndex = {};
    self.featureLayer = null;

    // The Map API doesn't expose the main layer directly so we have to find it.
    map.getMapImpl().eachLayer(function (layer) {
        if (layer instanceof L.FeatureGroup) {
            self.featureLayer = layer;
        }
    });

    function getId(feature) {
        return feature.siteId || feature.id || feature.properties.id || feature.properties.siteId;
    };


    self.addFeature = function(feature) {
        self.featureLayer.on('layeradd', function(e) {
            var layer = e.layer;
            var id = getId(feature);
            if (options.styleProperty && feature.properties && feature.properties[options.styleProperty]) {
                var prop = feature.properties[options.styleProperty];
                if (options.styles[prop] && _.isFunction(layer.setStyle)) {
                    layer.setStyle(options.styles[prop]);
                }
            }
            if (!self.featureIndex[id]) {
                self.featureIndex[id] = [];
            }
            self.featureIndex[id].push(layer);
        });

        map.setGeoJSON(feature);
        self.featureLayer.off("layeradd");
    };

    self.clearFeatures = function() {
        map.clearMarkers();
        map.clearLayers();
    };

    self.replaceAllFeatures = function(features) {
        self.clearFeatures();
        self.featureIndex = {};
        _.each(features, function(feature) {
            self.addFeature(feature);
        });

        map.fitBounds();
    };

    self.unHighlightFeatureById = function (id) {
        var layers = self.featureIndex[id];
        _.each(layers, function(layer) {
            unhighlightLayer(layer);
        })

    };

    self.highlightFeatureById = function (id) {
        var layers = self.featureIndex[id];

        _.each(layers, function(layer) {
            highlightLayer(layer);
        })
    };


    function highlightLayer(layer) {
        if (_.isFunction(layer.eachLayer)) { // Layers created from MultiPolygons & MultiPolyLines have nested layers
            layer.eachLayer(highlightLayer);
        }
        else {
            var options = layer.options;
            if (!options) {
                console.log("WARNING: No options for layer: " + layer);
                return;
            }
            if (layer.setStyle) {
                var style = {
                    weight: options.weight * 3,
                    fillOpacity: 1,
                    color: options.color
                };
                layer.setStyle(style);
                if (layer.bringToFront) {
                    layer.bringToFront();
                }
            }
            else if (options.icon) {
                layer.setIcon(createHighlightIcon(layer));
            }
        }
    }

    function unhighlightLayer(layer) {

        if (_.isFunction(layer.eachLayer)) { // Layers created from MultiPolygons & MultiPolyLines have nested layers
            layer.eachLayer(unhighlightLayer);
        }
        else {

            if (layer.setStyle) {
                var options = layer.options;
                if (options && layer.setStyle) {
                    var style = {
                        weight: options.weight / 3,
                        fillOpacity: 0.2,
                        color: options.color
                    };
                    layer.setStyle(style);
                }
            }
            else if (layer.options && layer.options.icon) {
                layer.setIcon(createNormalIcon(layer));
            }
        }
    }

    self.addMarker = function(lat, lng, name) {
        // Marker zooming results in the most recent marker added getting a full zoom.
        // Turn it off while we add POIs
        options.zoomToObject = false;
        map.addMarker(lat, lng, name);
        options.zoomToObject = true;
    };

    self.addPOI = function(lat, lng, name, config) {
        config = config || {};
        if (config.poiIconUrl) {
            config.icon = L.icon({
                iconUrl: config.poiIconUrl,
                iconSize: [32, 26],
                iconAnchor: [16, 26],
                popupAnchor: [0, -26]
            });

            delete config.poiIconUrl;
        }

        options.zoomToObject = false;
        map.addMarker(lat, lng, name, config);
        options.zoomToObject = true;
    };

    self.removeMarkers = function() {
        map.clearMarkers();
    };


};

var createMap = function(options) {
    var map;
    var mapContainerId = options.mapContainerId || "map";
    options.drawOptions = {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        edit: false
    };
    options.drawControl = false;
    options.singleDraw = false;
    options.showReset = false;
    options.draggableMarkers = false;
    options.singleMarker = false;
    options.singleDraw = false;
    options.showFitBoundsToggle? options.showFitBoundsToggle : true;
    options.useMyLocation =  options.useMyLocation != undefined ? options.useMyLocation : false;
    options.allowSearchLocationByAddress = false;
    options.allowSearchRegionByAddress = false;
    options.markerOrShapeNotBoth = false;
    options.zoomToObject = options.zoomToObject || false;

    if (options.leafletIconPath) {
        L.Icon.Default.imagePath = options.leafletIconPath;
    }
    if (options.useGoogleBaseMap) {
        var googleLayer = L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'roadmap'});
        var otherLayers = {
            Roadmap: googleLayer,
            Hybrid: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'hybrid'}),
            Terrain: L.gridLayer.googleMutant({maxZoom: 21, nativeMaxZoom: 21, type:'terrain'})
        };

        options.baseLayer = googleLayer;
        options.otherLayers = otherLayers;
    }

    map = new AlaMapAdapter(new ALA.Map(mapContainerId, options), options);
    return map;
};
var SitesViewModel =  function(sites, map, mapFeatures, isUserEditor, projectId) {

    var self = this;
    // sites
    self.features = [];
    if (mapFeatures.features) {
        self.features = mapFeatures.features;
    }

    var findFeatureForSite = function(site) {
        return _.find(self.features, function(feature) {
            var id = feature.siteId || feature.id || feature.properties.id || feature.properties.siteId;
            if (id == site.siteId) {
                return true;
            }
        });
    };

    self.setFeatures = function(features) {
        self.features = features;
        _.each(self.sites, function(site) {
            site.feature = findFeatureForSite(site);
        });
        self.displaySites();
    };

    self.sites = $.map(sites, function (site, i) {
        site.feature = findFeatureForSite(site);// || (site.extent ? site.extent.geometry : null);
        site.selected = ko.observable(false);

        if (!site.type) {
            site.type = 'worksArea';
        }
        site.filterType = 'P';
        site.filterTypeLabel = 'Planning site';

        if (site.externalIds && site.externalIds[0] && site.externalIds[0].idType && site.externalIds[0].idType.indexOf('MONITOR') >= 0) {
            site.filterType = 'E';
            site.filterTypeLabel = 'Site created via EMSA protocol using the Monitor App';
        }
        else if (site.type === 'compound') {
            site.filterType = 'R';
            site.filterTypeLabel = 'Reporting site';
        }

        site.readOnly = site.type == 'compound' || PublicationStatus.isReadOnly(site.publicationStatus);
        return site;
    });
    self.selectedSiteIds = ko.computed(function() {
        var siteIds = [];
        $.each(self.sites, function(i, site) {
            if (site.selected()) {
                siteIds.push(site.siteId);
            }
        });
        return siteIds;
    });

    self.getSiteById = function(siteId) {
        return _.find(self.sites, function(site ) { return siteId == site.siteId });
    };
    self.sitesFilter = ko.observable("");
    self.throttledFilter = ko.computed(self.sitesFilter).extend({throttle: 400});
    self.filteredSites = ko.observableArray(self.sites);
    self.displayedSites = ko.observableArray();
    self.offset = ko.observable(0);
    self.pageSize = 10;
    self.isUserEditor = ko.observable(isUserEditor);
    self.getSiteName = function (siteId) {
        var site;
        if (siteId !== undefined && siteId !== '') {
            site = $.grep(self.sites, function (obj, i) {
                return (obj.siteId === siteId);
            });
            if (site.length > 0) {
                return site[0].name();
            }
        }
        return '';
    };
    self.typeOptions = ['All', 'P', 'R', 'E'];
    self.typeFilter = ko.observable(self.typeOptions[0]);

    // Animation callbacks for the lists
    self.showElement = function (elem) {
        if (elem.nodeType === 1) $(elem).hide().slideDown()
    };
    self.hideElement = function (elem) {
        if (elem.nodeType === 1) $(elem).slideUp(function () {
            $(elem).remove();
        })
    };

    var previousIndicies = [];
    function compareIndicies(indicies1, indicies2) {

        if (indicies1 == indicies2) {
            return true;
        }

        if (indicies1.length != indicies2.length) {
            return false;
        }
        for (var i=0; i<indicies1.length; i++) {
            if (indicies1[i] != indicies2[i]) {
                return false;
            }
        }
        return true;
    }
    /** Callback from datatables event listener so we can keep the map in sync with the table filter / pagination */
    self.sitesFiltered = function(indicies) {
        if (compareIndicies(indicies || [], previousIndicies)) {
            return;
        }
        self.displayedSites([]);
        if (indicies) {
            for (var i=0; i<indicies.length; i++) {
                self.displayedSites.push(self.sites[indicies[i]]);
            }
        }
        self.displaySites();
        previousIndicies.splice(0, previousIndicies.length);
        Array.prototype.push.apply(previousIndicies, indicies);

    };

    self.displayAllSites = function() {
        var indicies = [];
        for (var i=0; i<sites.length; i++) {
            indicies.push(i);
        }
        self.sitesFiltered(indicies);
    };

    self.highlightSite = function(index) {
        map.highlightFeatureById(self.sites[index].siteId);
    };

    self.unHighlightSite = function(index) {
        map.unHighlightFeatureById(self.sites[index].siteId);
    };

    self.displaySites = function () {
        map.clearFeatures();

        var features = $.map(self.displayedSites(), function (obj, i) {
            var f = obj.feature;
            if (f) {
                f.popup = obj.name;
                f.id = obj.siteId;
            }
            return f;
        });
        map.replaceAllFeatures(features);

        $.each(self.displayedSites(), function(i, site) {
            if (site.poi) {
                // If we are displaying POIs, we don't need the centroid marker as well, even if the site is small.
                if (site.feature && site.feature.marker) {
                    site.feature.marker.setMap(null);
                    site.feature.marker = null;
                }
                $.each(site.poi, function(j, poi) {
                    if (poi.geometry) {
                        map.addMarker(poi.geometry.decimalLatitude, poi.geometry.decimalLongitude, poi.name, {poiIconUrl: fcConfig.poiIconUrl});
                    }

                });
            }
        });


    };


    this.removeSelectedSites = function () {
        bootbox.confirm("Are you sure you want to remove these sites?", function (result) {
            if (result) {
                var siteIds = self.selectedSiteIds();

                $.ajax({
                    url: fcConfig.sitesDeleteUrl,
                    type: 'POST',
                    data: JSON.stringify({siteIds:siteIds}),
                    contentType: 'application/json'
                }).done(function(data) {
                    if (data.warnings && data.warnings.length) {
                        bootbox.alert("Not all sites were able to be deleted.  Sites associated with an activity were not deleted.", function() {
                            document.location.href = here;
                        });
                    }
                    else {
                        document.location.href = here;
                    }
                }).fail(function(data) {
                    if (data.status == 401) {
                        alert('You do not have permission to delete this record.');
                    }
                    else {
                        bootbox.alert("An error occurred while deleting the sites.  Please contact support if the problem persists.", function() {
                            document.location.href = here;
                        })
                    }
                });
            }
        });
    };
    this.editSite = function (site) {
        if (site.type != 'compound') {
            var url = fcConfig.siteEditUrl + '/' + site.siteId;
            if (fcConfig.returnTo) {
                url += "?returnTo=" + encodeURIComponent(fcConfig.returnTo);
            }
            document.location.href = url;
        }
        else {
            bootbox.alert("This site can be edited via reporting forms only");
        }

    };
    this.deleteSite = function (site) {
        bootbox.confirm("Are you sure you want to remove this site from this project?", function (result) {
            if (result) {

                $.get(fcConfig.siteDeleteUrl + '?siteId=' + site.siteId, function (data) {
                    if (data.warnings && data.warnings.length) {
                        bootbox.alert("The site could not be deleted as it is used by a project activity.");
                    }
                    else {
                        document.location.href = here;
                    }
                });

            }
        });
    };
    this.viewSite = function (site) {
        var url = fcConfig.siteViewUrl + '/' + site.siteId;
        if (projectId) {
            url += '?projectId='+projectId;
        }
        document.location.href = url;
    };
    this.addSite = function () {
        document.location.href = fcConfig.siteCreateUrl;
    };
    this.bulkCreateSites = function () {
        document.location.href = fcConfig.bulkCreateSitesUrl;
    }
    this.addExistingSite = function () {
        document.location.href = fcConfig.siteSelectUrl;
    };
    this.downloadShapefile = function() {
        window.open(fcConfig.shapefileDownloadUrl, '_blank');
    };
    self.triggerGeocoding = function () {
        ko.utils.arrayForEach(self.sites, function (site) {
            map.getAddressById(site.name(), site.setAddress);
        });
    };


    self.displaySites();
};

function BulkCreateSiteViewModel (alaMap, config) {
    const DEFAULT_MAX_ZOOM = 21;
    var self = this,
        projects = [config.projectId],
        defaultSiteValues = {
            type: 'worksArea',
            projects: projects
        }, ignoreSiteSelectionChange = false;
    self.sites = ko.observableArray([]);
    self.selectedSites = ko.observableArray([]);
    self.selectAll = ko.observable(false);

    self.addSite = function() {
        self.sites.push(new SiteViewModel(defaultSiteValues, {}));
    };

    self.removeSite = function() {
        self.sites.remove(this);
    };

    self.selectAllSites = function() {
        var siteIds = self.sites().map(site => {
            if (self.isSiteSelectable(site)) {
                return site.transients.tempSiteId();
            }
        }).filter(id => id !== undefined);
        self.selectedSites(siteIds);
    };

    self.mergeSites = function() {
        var siteIds = self.selectedSites(),
            sites = self.sites().filter(site => siteIds.indexOf(site.transients.tempSiteId()) >= 0);
        if ( sites.length > 0 ) {
            var mergedName = "Merged site of " + sites.map(site => site.name()).join(', '),
                mergedSiteVM = sites.pop();

            mergedSiteVM.name(mergedName);
            self.selectedSites([]);
            sites.forEach(site => {
                var features = site.features();
                for (var i =0; i < features.length; i++) {
                    var feature = features[i];
                    feature.properties.tempSiteId = mergedSiteVM.transients.tempSiteId();
                    mergedSiteVM.features.push(feature);
                }
            });

            self.sites.removeAll(sites);
        }
    };

    self.splitSite = function() {
        var site = this,
            splitNamePrefix = "Split of " + site.name(),
            placeToInsert = self.sites().indexOf(site);

        self.selectedSites([]);
        self.sites.remove(site);
        site.features().forEach((feature, index) => {
            var siteName = splitNamePrefix, siteProps, newSite;
            if (feature.properties.name) {
                siteName += " (" + feature.properties.name + ")";
            }

            siteProps = Object.assign({}, defaultSiteValues, feature.properties)
            siteProps.name = siteName;
            siteProps.features = [feature];
            newSite = new SiteViewModel(siteProps);
            feature.properties.tempSiteId = newSite.transients.tempSiteId();
            self.sites.splice(placeToInsert, 0, newSite);
            placeToInsert += 1;
        });
    };

    self.zoomIn = function() {
        var site = this,
            layers = alaMap.findLayersByProperty('tempSiteId', site.transients.tempSiteId()),
            featureGroup = L.featureGroup(layers);

        if (layers.length > 0) {
            alaMap.getMapImpl().fitBounds(featureGroup.getBounds(), { animate: true, maxZoom: DEFAULT_MAX_ZOOM });
        }
    };

    self.deleteSite = function() {
        var site = this,
            layers = alaMap.findLayersByProperty('tempSiteId', site.transients.tempSiteId()),
            zoomToObject = alaMap.getZoomToObject();

        alaMap.setZoomToObject(false);
        layers && layers.forEach(layer => alaMap.removeLayer(layer));
        alaMap.setZoomToObject(zoomToObject);
        self.sites.remove(site);
    };

    self.createSites = async function() {
        var sites = self.selectedSites().map(id => self.findSiteByTempSiteId(id));
        for (var i = 0; i < sites.length; i++) {
            await self.createSite.apply(sites[i]);
        }
    };

    self.createSite = function() {
        var site = this,
            layers = alaMap.findLayersByProperty('tempSiteId', site.transients.tempSiteId()),
            featureCollection = L.featureGroup(layers).toGeoJSON(),
            data;

        if (!featureCollection || !featureCollection.features || featureCollection.features.length === 0) {
            alert("No features found for site " + site.name() + ". Please draw a shape on the map before creating the site.");
            return;
        }

        site.features(featureCollection.features);
        if (!featureCollection.features.every(feature => turf.booleanValid(feature))) {
            alert("One or more geometries for site " + site.name() + " are invalid and cannot be saved. Please edit and try again.");
            return;
        }

        data = site.modelAsJSON();
        alaMap.startLoading();
        site.transients.loading(true);
        return $.ajax({
            url: config.createSiteUrl,
            method: 'POST',
            data: data,
            contentType: 'application/json',
            success: function(data) {
                switch (data.status) {
                    case 'created':
                        site.siteId = data.id;
                        site.transients.siteCreated(true);
                        break;
                    case 'updated':
                        // do nothing
                        break;
                    case 'error':
                    break;
                }

                alaMap.finishLoading();
                site.transients.loading(false);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alaMap.finishLoading();
                site.transients.loading(false);
            }
        });
    }

    self.highlightSite = function() {
        var site = this;
        alaMap.highlightFeaturesByProperty('tempSiteId', site.transients.tempSiteId());
    }

    self.unhighlightSite = function() {
        var site = this;
        alaMap.unHighlightFeaturesByProperty('tempSiteId', site.transients.tempSiteId());
    }

    self.highlightFeature = function() {
        var feature = this;
        alaMap.highlightFeaturesByProperty('featureId', feature.properties.featureId);
        return false;
    }

    self.unhighlightFeature = function() {
        var feature = this;
        alaMap.unHighlightFeaturesByProperty('featureId', feature.properties.featureId);
        return false;
    }

    self.findSiteByFeatureId = function(featureId) {
        var sites = self.sites();
        var site = sites.filter(site => site.feature && site.feature.properties && site.feature.properties.featureId === featureId);
        return site.length > 0 ? site[0] : null;
    }

    self.findSiteByTempSiteId = function(tempSiteId) {
        var sites = self.sites();
        var site = sites.filter(site => site.transients && site.transients.tempSiteId && site.transients.tempSiteId() === tempSiteId);
        return site.length > 0 ? site[0] : null;
    }

    self.updateSites = function() {
        var geoJSON = alaMap.getGeoJSON(),
            sitesToRemove = self.sites().slice();

        geoJSON.features.forEach(function(feature, index) {
            var site;
            if (!feature.properties || !feature.properties.tempSiteId) {
                Object.assign(feature.properties, defaultSiteValues);
                site = self.createSiteViewModel(feature);
                feature.properties.tempSiteId = site.transients.tempSiteId();
                self.sites.push(site);
            }
            else {
                // remove site from sitesToRemove
                site = self.findSiteByTempSiteId(feature.properties.tempSiteId);
                sitesToRemove = sitesToRemove.filter(s => s.transients.tempSiteId() !== site.transients.tempSiteId());
            }
        });

        if (sitesToRemove.length > 0) {
            self.sites.removeAll(sitesToRemove);
        }

        self.updateSiteFeatures();
    }

    self.createSiteViewModel = function(feature) {
        var vm = new SiteViewModel(feature.properties);
        vm.extent(new GenericLocation());
        return vm;
    }

    self.updateSiteFeatures = function() {
        var sites = self.sites(),
            features = alaMap.getGeoJSON().features;
        sites.forEach(function(site) {
            let siteFeatures = features.filter(f => f.properties.tempSiteId === site.transients.tempSiteId());
            site.features(siteFeatures);
            let featureBoundsCentreAndGeoJSON = self.getBoundsCentreAndGeoJSON(siteFeatures);
            let centre = featureBoundsCentreAndGeoJSON.centre;
            let geoJSON = featureBoundsCentreAndGeoJSON.geoJSON;
            site.extent().geometry().centre(centre);
            site.extent().geometry().type(geoJSON.type);
            site.extent().geometry().coordinates(geoJSON.coordinates);
        });
    }

    self.getBoundsCentreAndGeoJSON = function(features) {
        var fc = {
                type: 'FeatureCollection',
                properties: {},
                features: features
            },
            bounds = L.geoJSON(fc).getBounds(),
            rectangle = L.rectangle(bounds),
            geoJSON = rectangle.toGeoJSON(),
            geometry = geoJSON.geometry,
            centre = bounds.getCenter(),
            cPoint = [centre.lng, centre.lat];

        return {geoJSON: geometry, centre: cPoint};
    }

    self.selectedSitesNames = ko.computed(function() {
        return self.selectedSites().map(function(siteId) {
            var site = self.findSiteByTempSiteId(siteId);
            return site && site.name();
        }).filter(name => name !== undefined);
    });

    self.goToProject = function() {
        if (self.selectableSites().length > 0) {
            var notSavedSites = self.selectableSites().length;
            var yes = confirm(`${notSavedSites} site(s) have not been created yet. If you leave this page, they will be lost. Are you sure you want to continue?`);
            if (!yes) {
                return;
            }
        }

        alaMap.startLoading();
        document.location.href = config.returnTo;
    }

    self.isSiteSelectable = function(site) {
        return !self.isSitePublished.apply(site);
    }

    self.isSelectAll = function() {
        var sites = self.sites(),
            sitesSelectable = sites.filter(site => self.isSiteSelectable(site));

        return  sitesSelectable.length > 0 && self.selectedSites().length === sitesSelectable.length;
    }

    self.deleteFeature = function(site) {
        var feature = this,
            layers = alaMap.findLayersByProperty('featureId', feature.properties.featureId);
        if (layers && layers.length > 0) {
            alaMap.removeLayer(layers[0]);
        }

        site.features.remove(feature);
    }

    self.unpackFeature = function(site) {
        ALA.MapUtils.checkTurfAvailability();
        var feature = this,
            index = site.features.indexOf(feature),
            namePrefix = feature.properties.name + " - Unpack ";
        if (index >= 0) {
            var fc = turf.flatten(feature),
                expandedFeatures = fc.features,
                layer = alaMap.findLayersByProperty('featureId', feature.properties.featureId)[0];

            expandedFeatures.forEach((f, index) => {
                delete feature.properties.featureId;
                f.properties = Object.assign({}, feature.properties, f.properties);
                f.properties.name = namePrefix + (index + 1);
            });

            // for better animation, remove after add fade in occurred
            site.features.splice(index + 1, 0, ...expandedFeatures);
            setTimeout(() => {
                site.features.remove(feature);
            }, 5000);
            alaMap.setGeoJSON(fc);
            alaMap.removeLayer(layer);
        }
    }

    self.zoomToFeature = function(feature) {
        var layers = alaMap.findLayersByProperty('featureId', feature.properties.featureId),
            featureGroup = L.featureGroup(layers);

        if (layers.length > 0) {
            alaMap.getMapImpl().fitBounds(featureGroup.getBounds(), { animate: true, maxZoom: DEFAULT_MAX_ZOOM });
        }
    }

    // computed observables
    self.selectableSites = ko.pureComputed(function() {
        return self.sites().filter(site => self.isSiteSelectable(site));
    });

    self.isBulkCreateDisabled = ko.computed(function() {
        return self.selectedSites().length === 0
    });

    self.isBulkMergeDisabled = ko.computed(function() {
        return self.selectedSites().length <= 1
    });

    self.isSelectAllDisabled = ko.computed(function() {
        return self.selectableSites().length === 0;
    });

    /**
     * Used when rendering feature table
     * @returns {*|string}
     */
    self.getFeatureType = function(feature) {
        switch (feature.geometry.type) {
            case ALA.MapConstants.DRAW_TYPE.POINT_TYPE:
                if (feature.properties && feature.properties.type === ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE) {
                    return ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE;
                }
                // no need to break here
            default:
                return feature.geometry.type;
        }
    }

    self.isFeatureSplittable = function() {
        var feature = this,
            match = feature.geometry && feature.geometry.type && feature.geometry.type.match(/^Multi|GeometryCollection/);
        return !!(match && match.length > 0);
    }

    // element controls
    self.isSiteDisabled = function() {
        var site = this;
        return site.transients.siteCreated() || site.transients.loading();
    }

    self.isSitePublished = function() {
        var site = this;
        return site.transients.siteCreated();
    }

    self.isSplitDisabled = function () {
        if (self.isSiteDisabled.apply(this)) {
            return true;
        }

        var site = this,
            layers = alaMap.findLayersByProperty('tempSiteId', site.transients.tempSiteId());
        return layers.length <= 1;
    }

    self.isFeatureUnpackDisabled = function() {
        var feature = this,
            site = self.findSiteByTempSiteId(feature.properties.tempSiteId);

        return self.isSiteDisabled.apply(site) || !self.isFeatureSplittable.apply(feature);
    }

    self.isFeatureDeleteDisabled = function() {
        var site = this;
        return self.isSiteDisabled.apply(site) || site.features().length <= 1;
    }

    self.fadeIn = function(element) {
        $(element).hide().fadeIn();
    }

    self.fadeOut = function(element) {
        $(element).fadeOut(function () {
            $(element).remove();
        });
    }

    self.enablePopovers = function(nodes) {
        var popovers = $(nodes).find('[data-bs-toggle="popover"]');
        [...popovers].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }

    // observable subscriptions
    self.updateSelectAll = function() {
        ignoreSiteSelectionChange = true;
        self.selectAll(self.isSelectAll());
        ignoreSiteSelectionChange = false;
    }

    self.handleSelectAll = function(newValue) {
        if (ignoreSiteSelectionChange)
            return;

        if (newValue) {
            var sites = self.selectableSites(),
                siteIds = sites.map(site => site.transients.tempSiteId());

            self.selectedSites(siteIds);
        } else {
            self.selectedSites([]);
        }
    }
    self.selectedSites.subscribe(self.updateSelectAll);
    self.selectAll.subscribe(self.handleSelectAll);
    self.sites.subscribe(self.updateSelectAll);

    alaMap.subscribe(self.updateSites);
}

/**
 * Returns a GeoJson coordinate array for the polygon
 */
function polygonToGeoJson(path){
    var firstPoint = path.getAt(0),
        points = [];
    path.forEach(function (obj, i) {
        points.push([obj.lng(),obj.lat()]);
    });
    // a polygon array from the drawingManager will not have a closing point
    // but one that has been drawn from a wkt will have - so only add closing
    // point if the first and last don't match
    if (!firstPoint.equals(path.getAt(path.length -1))) {
        // add first points at end
        points.push([firstPoint.lng(),firstPoint.lat()]);
    }
    var coordinates =  [points];
    return coordinates;
}

function round(number, places) {
    var p = places || 4;
    return places === 0 ? number.toFixed() : number.toFixed(p);
}

function representsRectangle(path) {
    // must have 5 points
    if (path.getLength() !== 5) {
        return false;
    }
    var arr = path.getArray();
    if ($.isArray(arr[0])) {
        return false;
    }  // must be multipolygon (array of arrays)
    if (arr[0].lng() != arr[1].lng()) {
        return false;
    }
    if (arr[2].lng() != arr[3].lng()) {
        return false;
    }
    if (arr[0].lat() != arr[3].lat()) {
        return false;
    }
    if (arr[1].lat() != arr[2].lat()) {
        return false;
    }
    return true
}

/**
 *
 * Fetches the site photo point display template and configures the dynamic behaviour after it loads.
 * @param targetElementSelector the selector of the element to attach the downloaded html.
 */
function loadAndConfigureSitePhotoPoints(targetElementSelector) {

    $(targetElementSelector + ' img').on('load', function () {

        var parent = $(this).parents('.thumb');
        var $caption = $(parent).find('.caption');
        $caption.outerWidth($(this).width());

    });
    $(targetElementSelector + ' .photo-slider').mThumbnailScroller({theme: 'hover-classic'});
    $(targetElementSelector + ' .photo-slider .fancybox').fancybox({
        helpers: {
            title: {
                type: 'inside'
            }
        },
        beforeLoad: function () {
            var el, id = $(this.element).data('caption');

            if (id) {
                el = $('#' + id);

                if (el.length) {
                    this.title = el.html();
                }
            }
        },
        nextEffect: 'fade',
        previousEffect: 'fade'
    });
}

function createHighlightIcon(layer) {
    var options = layer.options;
    var icon = options.icon;
    icon.options.iconSize = [38, 95];
    icon.options.iconAnchor = [22, 94];
    return options.icon
}
function createNormalIcon(layer) {
    var options = layer.options;
    var icon = options.icon;
    icon.options.iconSize = [19, 46];
    icon.options.iconAnchor = [11, 47];
    return options.icon
}