
var SiteViewModel = function (site, feature, options) {
    var self = $.extend(this, new Documents());

    self.siteId = site.siteId;
    self.name = ko.observable(site.name);
    self.externalId = ko.observable(site.externalId);
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
    self.projects = site.projects || [];
    self.extentSource = ko.pureComputed({
        read: function() {
            if (self.extent()) {
                return self.extent().source();
            }
            return 'none'
        },
        write: function(value) {
            self.updateExtent(value);
        }
    });

    self.setAddress = function (address) {
        if (address.indexOf(', Australia') === address.length - 11) {
            address = address.substr(0, address.length - 11);
        }
        self.address(address);
    };
    self.poi = ko.observableArray();

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
        delete js.extentSource;
        delete js.extentGeometryWatcher;
        delete js.isValid;
        return js;
    };

    self.modelAsJSON = function() {
        var js = self.toJS();
        return JSON.stringify(js);
    }
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
                case 'point':   self.extent(new PointLocation(extent.geometry)); break;
                case 'pid':     self.extent(new PidLocation(extent.geometry, options)); break;
                case 'upload':
                case 'drawn':   self.extent(new DrawnLocation(extent.geometry)); break;
            }
        } else {
            self.extent(new EmptyLocation());
        }
    };


    self.updateExtent = function(source){
        switch (source) {
            case 'point':
                if(site && site.extent) {
                    self.extent(new PointLocation(site.extent.geometry));
                } else {
                    self.extent(new PointLocation({}));
                }
                break;
            case 'pid':
                if(site && site.extent) {
                    self.extent(new PidLocation(site.extent.geometry, options));
                } else {
                    self.extent(new PidLocation({}, options));
                }
                break;
            case 'upload':
            case 'drawn':
                //breaks the edits....
                self.extent(new DrawnLocation({}));
                break;
            default: self.extent(new EmptyLocation());
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
            method:"POST",
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
};

var POI = function (l, hasDocuments) {
    var self = this;
    self.poiId = ko.observable(exists(l, 'poiId'));
    self.name = ko.observable(exists(l,'name'));
    self.type = ko.observable(exists(l,'type'));
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
        type: "Point",
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
        var js = ko.toJS(self);
        delete js.hasPhotoPointDocuments;
        if(js.geometry.decimalLatitude !== undefined
            && js.geometry.decimalLatitude !== ''
            && js.geometry.decimalLongitude !== undefined
            && js.geometry.decimalLongitude !== ''){
            js.geometry.coordinates = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
        }
        return js;
    }
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
var PointLocation = function (l) {
    var self = this;
    self.source = ko.observable('point');
    self.geometry = ko.observable({
        type: "Point",
        decimalLatitude: ko.observable(exists(l,'decimalLatitude')),
        decimalLongitude: ko.observable(exists(l,'decimalLongitude')),
        uncertainty: ko.observable(exists(l,'uncertainty')),
        precision: ko.observable(exists(l,'precision')),
        datum: ko.observable('WGS84'), // only supporting WGS84 at the moment.
        nrm: ko.observable(exists(l,'nrm')),
        state: ko.observable(exists(l,'state')),
        lga: ko.observable(exists(l,'lga')),
        locality: ko.observable(exists(l,'locality')),
        mvg: ko.observable(exists(l,'mvg')),
        mvs: ko.observable(exists(l,'mvs'))
    });
    self.hasCoordinate = function () {
        var hasCoordinate = self.geometry().decimalLatitude() !== undefined
            && self.geometry().decimalLatitude() !== ''
            && self.geometry().decimalLongitude() !== undefined
            && self.geometry().decimalLongitude() !== '';
        return hasCoordinate;
    };
    self.geometry.coordinates = ko.pureComputed(function() {
        if (self.hasCoordinate()) {
            return [self.geometry().decimalLongitude(), self.geometry().decimalLatitude()];
        }
        return undefined;
    });

    /**
     * This is called only from a map drag event so we clear uncertaintly, precision and intercept data.
     * The intercept data will be updated once the drag event ends
     */
    self.updateGeometry = function(latlng) {
        var geom = self.geometry();
        geom.decimalLatitude(latlng.lat());
        geom.decimalLongitude(latlng.lng());
        geom.uncertainty('');
        geom.precision('');
        self.clearGazInfo();
    };
    self.clearGazInfo = function() {
        var geom = self.geometry();
        geom.nrm('');
        geom.state('');
        geom.lga('');
        geom.locality('');
        geom.mvg('');
        geom.mvs('');
    };

    self.isValid = function() {
        return self.hasCoordinate();
    };

    self.toJS = function(){
        var js = ko.toJS(self);
        if(js.geometry.decimalLatitude !== undefined
            && js.geometry.decimalLatitude !== ''
            && js.geometry.decimalLongitude !== undefined
            && js.geometry.decimalLongitude !== ''){
            js.geometry.centre = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
            js.geometry.coordinates = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
        }
        return js;
    };
};

var DrawnLocation = function (l) {
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
        coordinates: ko.observable(exists(l,'coordinates'))
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
    };
    self.toJS= function() {
        var js = ko.toJS(self);
        return js;
    };
    self.isValid = function() {
        return self.geometry().coordinates();
    };
};

var PidLocation = function (l, options) {

    // These layers are treated specially.
    var USER_UPLOAD_FID = 'c11083';


    var self = this,
        OLD_LAYER_FIDS_NAME = getOldLayers(options.knownShapeConfig);
    self.source = ko.observable('pid');
    self.geometry = ko.observable({
        type : "pid",
        pid : ko.observable(exists(l,'pid')),
        name : ko.observable(exists(l,'name')),
        fid : ko.observable(exists(l,'fid')),
        layerName : ko.observable(exists(l,'layerName')),
        area : ko.observable(exists(l,'area')),
        nrm: ko.observable(exists(l,'nrm')),
        state: ko.observable(exists(l,'state')),
        lga: ko.observable(exists(l,'lga')),
        locality: ko.observable(exists(l,'locality')),
        centre:[]
    });
    self.refreshObjectList = function(){
        self.layerObjects([]);
        self.layerObject(undefined);
        if(self.chosenLayer() !== undefined){
            if (self.chosenLayer() != USER_UPLOAD_FID) {
                $.ajax({
                    url: fcConfig.featuresService + '?layerId=' +self.chosenLayer(),
                    dataType:'json'
                }).done(function(data) {
                    data = _.sortBy(data, function(item) {
                        return item && item.name;
                    });
                    self.layerObjects(data);
                    // During initialisation of the object list, any existing value for the chosen layer will have
                    // been set to undefined because it can't match a value in the list.
                    if (l.pid) {
                        self.layerObject(l.pid);
                    }
                });
            }
            else {
                self.layerObjects([{name:'User Uploaded', pid:self.geometry().pid()}]);
                if (l.pid) {
                    self.layerObject(l.pid);
                }
            }
        }
    };
    self.layers = ko.observableArray(options.knownShapeConfig);

    // These layers aren't selectable unless the site is already using them.  This is to support user uploaded
    // shapes and the previous version of the NRM layer.
    if (l.fid == USER_UPLOAD_FID) {
        self.layers().push({id:USER_UPLOAD_FID, name:'User Uploaded'});
    }
    else if (OLD_LAYER_FIDS_NAME[l.fid]) {
        self.layers().push({id: l.fid, name: OLD_LAYER_FIDS_NAME[l.fid]});
    }

    self.chosenLayer = ko.observable(exists(l,'fid'));
    self.layerObjects = ko.observable([]);
    self.layerObject = ko.observable(exists(l,'pid'));

    self.updateSelectedPid = function(elements){
        if(self.layerObject() !== undefined){
            self.geometry().pid(self.layerObject());
            self.geometry().fid(self.chosenLayer());

            //additional metadata required from service layer
            $.ajax({
                url: fcConfig.featureService + '?featureId=' + self.layerObject(),
                dataType:'json'
            }).done(function(data) {
                self.geometry().name(data.name)
                self.geometry().layerName(data.fieldname)
                if(data.area_km !== undefined){
                    self.geometry().area(data.area_km)
                }

            });
        }
    };

    self.toJS = function(){
        var js = ko.toJS(self);
        delete js.layers;
        delete js.layerObjects;
        delete js.layerObject;
        delete js.chosenLayer;
        delete js.type;
        return js;
    };

    self.isValid = function() {
        return self.geometry().fid() && self.geometry().pid() && self.chosenLayer() && self.layerObject();
    };
    self.chosenLayer.subscribe(function() {
        self.refreshObjectList();
    });
    self.layerObject.subscribe(function() {
        self.updateSelectedPid();
    });
    if (exists(l,'fid')) {
        self.refreshObjectList();
    }
    else {
        // Uploaded shapes are created without a field id - assign it the correct FID.
        if (exists(l, 'pid')) {
            self.layers().push({id:USER_UPLOAD_FID, name:'User Uploaded'});
            self.chosenLayer(USER_UPLOAD_FID);

        }
    }

    function getOldLayers (knownShapeConfig) {
        var result  = {};
        (knownShapeConfig || []).forEach(function(layer) {
            layer.previousLayers && _.extend(result, layer.previousLayers);
        });

        return result;
    }
};

function SiteViewModelWithMapIntegration (siteData, projectId, options) {
    var self = this;
    SiteViewModel.apply(self, [siteData, null, options]);

    self.renderPOIs = function(){
        removeMarkers();
        for(var i=0; i<self.poi().length; i++){
            addMarker(self.poi()[i].geometry().decimalLatitude(), self.poi()[i].geometry().decimalLongitude(), self.poi()[i].name(), self.poi()[i].dragEvent)
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
        var currentDrawnShape = ko.toJS(self.extent().geometry);
        //retrieve the current shape if exists
        if(currentDrawnShape !== undefined){
            if(currentDrawnShape.type == 'Polygon') {
                showOnMap('polygon', geoJsonToPath(currentDrawnShape));
                zoomToShapeBounds();
            } else if (currentDrawnShape.type == 'MultiPolygon') {
                if (currentDrawnShape.coordinates && currentDrawnShape.coordinates.length) {
                    for (var i = 0; i < currentDrawnShape.coordinates.length; i++) {
                        if (currentDrawnShape.coordinates[i] && currentDrawnShape.coordinates[i].length) {
                            showOnMap('polygon', coordArrayToPath(currentDrawnShape.coordinates[i][0]));
                            zoomToShapeBounds();
                        }
                    }
                }
            } else if(currentDrawnShape.type == 'Circle'){
                showOnMap('circle', currentDrawnShape.coordinates[1],currentDrawnShape.coordinates[0],currentDrawnShape.radius);
                zoomToShapeBounds();
            } else if(currentDrawnShape.type == 'Rectangle'){
                var shapeBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(currentDrawnShape.minLat,currentDrawnShape.minLon),
                    new google.maps.LatLng(currentDrawnShape.maxLat,currentDrawnShape.maxLon)
                );
                //render on the map
                showOnMap('rectangle', shapeBounds);
                zoomToShapeBounds();
            } else if(currentDrawnShape.type == 'pid'){
                showObjectOnMap(currentDrawnShape.pid);
                //self.extent().setCurrentPID();
            } else if(currentDrawnShape.type == 'Point'){
                showOnMap('point', currentDrawnShape.decimalLatitude, currentDrawnShape.decimalLongitude,'site name');
                zoomToShapeBounds();
                showSatellite();
            }
        }
    };

    self.updateExtent = function(source){
        switch (source) {
            case 'point':
                if(siteData && siteData.extent && siteData.extent.source == source) {
                    self.extent(new PointLocation(siteData.extent.geometry));
                } else {
                    var centre = getMapCentre();
                    self.extent(new PointLocation({decimalLatitude:centre[1], decimalLongitude:centre[0]}));
                }
                break;
            case 'pid':
                if(siteData && siteData.extent && siteData.extent.source == source) {
                    self.extent(new PidLocation(siteData.extent.geometry, options));
                } else {
                    self.extent(new PidLocation({}, options));
                }
                break;
            case 'upload': self.extent(new UploadLocation({})); break;
            case 'drawn':
                if (siteData && siteData.extent && siteData.extent.source == source) {

                }
                else {
                    self.extent(new DrawnLocation({}));
                }
                break;
            default: self.extent(new EmptyLocation());
        }
    };

    self.shapeDrawn = function(source, type, shape) {
        var drawnShape;
        if (source === 'clear') {
            drawnShape = null;

        } else {

            switch (type) {
                case google.maps.drawing.OverlayType.CIRCLE:
                    /*// don't show or set circle props if source is a locality
                     if (source === "user-drawn") {*/
                    var center = shape.getCenter();
                    // set coord display

                    var calcAreaKm = ((3.14 * shape.getRadius() * shape.getRadius())/1000)/1000;

                    //calculate the area
                    drawnShape = {
                        type:'Circle',
                        userDrawn: 'Circle',
                        coordinates:[center.lng(), center.lat()],
                        centre: [center.lng(), center.lat()],
                        radius: shape.getRadius(),
                        areaKmSq:calcAreaKm
                    };
                    break;
                case google.maps.drawing.OverlayType.RECTANGLE:
                    var bounds = shape.getBounds(),
                        sw = bounds.getSouthWest(),
                        ne = bounds.getNorthEast();

                    //calculate the area
                    var mvcArray = new google.maps.MVCArray();
                    mvcArray.push(new google.maps.LatLng(sw.lat(), sw.lng()));
                    mvcArray.push(new google.maps.LatLng(ne.lat(), sw.lng()));
                    mvcArray.push(new google.maps.LatLng(ne.lat(), ne.lng()));
                    mvcArray.push(new google.maps.LatLng(sw.lat(), ne.lng()));
                    mvcArray.push(new google.maps.LatLng(sw.lat(), sw.lng()));

                    var calculatedArea = google.maps.geometry.spherical.computeArea(mvcArray);
                    var calcAreaKm = ((calculatedArea)/1000)/1000;

                    var centreY = (sw.lat() + ne.lat())/2;
                    var centreX =  (sw.lng() + ne.lng())/2;

                    drawnShape = {
                        type: 'Polygon',
                        userDrawn: 'Rectangle',
                        coordinates:[[
                            [sw.lng(),sw.lat()],
                            [sw.lng(),ne.lat()],
                            [ne.lng(),ne.lat()],
                            [ne.lng(),sw.lat()],
                            [sw.lng(),sw.lat()]
                        ]],
                        bbox:[sw.lat(),sw.lng(),ne.lat(),ne.lng()],
                        areaKmSq:calcAreaKm,
                        centre: [centreX,centreY]
                    }
                    break;
                case google.maps.drawing.OverlayType.POLYGON:
                    /*
                     * Note that the path received from the drawing manager does not end by repeating the starting
                     * point (number coords = number vertices). However the path derived from a WKT does repeat
                     * (num coords = num vertices + 1). So we need to check whether the last coord is the same as the
                     * first and if so ignore it.
                     */
                    var path;

                    if(shape.getPath()){
                        path = shape.getPath();
                    } else {
                        path = shape;
                    }

                    //calculate the area
                    var calculatedAreaInSqM = google.maps.geometry.spherical.computeArea(path);
                    var calcAreaKm = ((calculatedAreaInSqM)/1000)/1000;


                    //get the centre point of a polygon ??
                    var minLat=90,
                        minLng=180,
                        maxLat=-90,
                        maxLng=-180;

                    // There appears to have been an API change here - this is required locally but it
                    // still works without this change in test and prod.
                    var pathArray = path;
                    if (typeof(path.getArray) === 'function') {
                        pathArray = path.getArray();
                    }
                    $.each(pathArray, function(i){
                        var coord = path.getAt(i);
                        if(coord.lat()>maxLat) maxLat = coord.lat();
                        if(coord.lat()<minLat) minLat = coord.lat();
                        if(coord.lng()>maxLng) maxLng = coord.lng();
                        if(coord.lng()<minLng) minLng = coord.lng();
                    });
                    var centreX = minLng + ((maxLng - minLng) / 2);
                    var centreY = minLat + ((maxLat - minLat) / 2);

                    drawnShape = {
                        type:'Polygon',
                        userDrawn: 'Polygon',
                        coordinates: polygonToGeoJson(path),
                        areaKmSq: calcAreaKm,
                        centre: [centreX,centreY]
                    };
                    break;
                case google.maps.drawing.OverlayType.MARKER:

                    // Updating the point coordinates refreshes the map so don't do so until the drag is finished.
                    if (!shape.dragging) {
                        self.extent().updateGeometry(shape.getPosition());
                        self.refreshGazInfo();
                    }

                    break;
            }

        }
        //set the drawn shape
        if(drawnShape != null && type !== google.maps.drawing.OverlayType.MARKER){
            self.extent().updateGeom(drawnShape);
            self.refreshGazInfo();
        }
    };
    self.mapInitialised = function(map) {
        var updating = false;
        self.renderPOIs();
        self.renderOnMap();
        var clearAndRedraw = function() {
            if (!updating) {
                updating = true;
                setTimeout(function () {
                    clearObjectsAndShapes();
                    self.renderOnMap();
                    updating = false;
                }, 500);
            }
        };
        setCurrentShapeCallback(self.shapeDrawn);
        self.extent.subscribe(function(newExtent) {
            clearAndRedraw();
        });
        self.extentGeometryWatcher.subscribe(function() {
            clearAndRedraw();
        });
    };

    /**
     * Allows the jquery-validation-engine to respond to changes to the validity of a site extent.
     * This function returns a function that can be attached to an element via the funcCall[] validation method.
     */
    self.attachExtentValidation = function(fieldSelector, message) {
        // Expose the siteViewModel validate function in global scope so the validation engine can use it.
        var validateSiteExtent = function() {
            var result = self.isValid();
            if (!result) {
                return message || 'Please define the site extent';
            }
        };
        self.isValid.subscribe(function() {
            $(fieldSelector).validationEngine('validate');
        });
        return validateSiteExtent;
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
        self.featureIndex = {};
        _.each(features, function(feature) {
            self.addFeature(feature);
        });
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
                if (layer.bringToFront()) {
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

    self.removeMarkers = function() {
        map.clearMarkers();
    };


};

var createMap = function(options) {
    var map;
    var mapContainerId = options.mapContainerId || "map";
    if (options.useAlaMap) {
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
        options.useMyLocation? options.useMyLocation:true;

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
    }
    else {
        map = init_map_with_features({
                mapContainer: mapContainerId,
                scrollwheel: false,
                featureService: options.featureServiceUrl,
                wmsServer: options.wmsServerUrl
            },
            options
        );
    }
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
        map.removeMarkers();

        $.each(self.displayedSites(), function(i, site) {
            if (site.poi) {
                // If we are displaying POIs, we don't need the centroid marker as well, even if the site is small.
                if (site.feature && site.feature.marker) {
                    site.feature.marker.setMap(null);
                    site.feature.marker = null;
                }
                $.each(site.poi, function(j, poi) {
                    if (poi.geometry) {
                        map.addMarker(poi.geometry.decimalLatitude, poi.geometry.decimalLongitude, poi.name);
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
    this.addExistingSite = function () {
        document.location.href = fcConfig.siteSelectUrl;
    };
    this.uploadSites = function () {
        document.location.href = fcConfig.siteUploadUrl;
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

function geoJsonToPath(geojson){
    var coords = geojson.coordinates[0];
    return coordArrayToPath(geojson.coordinates[0]);
}

function coordArrayToPath(coords){
    var path = [];
    for(var i = 0; i<coords.length; i++){
        path.push(new google.maps.LatLng(coords[i][1],coords[i][0]));
    }
    return path;
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