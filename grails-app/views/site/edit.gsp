<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <meta name="layout" content="main"/>
  <title> ${create ? 'New' : ('Edit | ' + site?.name)} | Sites | Field Capture</title>
  <style type="text/css">
    legend {
        border: none;
        margin-bottom: 5px;
    }
    .popover {
        border-width: 2px;
    }
    .popover-content {
        font-size: 14px;
        line-height: 20px;
    }
    h1 input[type="text"] {
        color: #333a3f;
        font-size: 28px;
        /*line-height: 40px;*/
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        height: 42px;
    }
    .no-border { border-top: none !important; }
  </style>
  <r:require modules="knockout, amplify, mapWithFeatures"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <g:if test="${create}">
            <li class="active">Create</li>
        </g:if>
        <g:else>
            <li><g:link controller="site" action="index" id="${site?.siteId}">
                <span data-bind="text: name">${site?.name}</span>
            </g:link><span class="divider">/</span></li>
            <li class="active">Edit</li>
        </g:else>
    </ul>
    <div class="container-fluid">
        <bs:form action="update" inline="true">

            <div class="row-fluid">
                <g:hiddenField name="id" value="${site?.siteId}"/>
                <div>
                    <label for="name">Site name</label>
                    <h1>
                        <input data-bind="value: name" class="span12" id="name" type="text" value="${site?.name}"
                               placeholder="Enter a name for the new site"/>
                    </h1>
                </div>
            </div>

            <div class="row-fluid">
                <div class="span4">
                    <label for="externalId">External Id
                        <fc:iconHelp title="External id">Identifier code for the site - used in external documents.</fc:iconHelp>
                    </label>
                    <input data-bind="value:externalId" id="externalId" type="text" class="span12"/>
                </div>
                <div class="span4">
                    <label for="type">Type</label>
                    <input data-bind="value: type" id="type" type="text" class="span12"/>
                </div>
                <div class="span4">
                    <label for="area">Area (decimal hectares)
                        <fc:iconHelp title="Area of site">The area in decimal hectares (4dp) enclosed within the boundary of the shape file.</fc:iconHelp></label>
                    <input data-bind="value: area" id="area" type="text" class="span12"/>
                </div>
            </div>

            <div class="row-fluid">
                <div class="span6">
                    <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" cols="50"/>
                </div>
                <div class="span6">
                    <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" cols="50"/>
                </div>
            </div>


            <h2>Extent of site
                <fc:iconHelp title="Extent of the site">The extent of the site can be represented by
                a polygon, radius or point. KML, WKT and shape files are supported for uploading polygons.
                As are PID's of existing features in the Atlas Spatial Portal.</fc:iconHelp>
            </h2>
            <div class="row-fluid">
                <div class="span3">
                    <g:select data-bind="value: extent().type"
                              from="['choose a location type','point','known shape','upload a shape','draw a shape']"
                              name='extentType'
                              keys="['locationTypeNone','locationTypePoint','locationTypePid','locationTypeUpload','locationTypeDrawn']"/>
                </div>
                <div class="span9">
                    <div data-bind="template: { name: updateExtent(), data: extent().geometry, afterRender: extent().myPostProcessingLogic}"></div>
                </div>
            </div>


            <div class="row-fluid">
                <div class="form-actions span12">
                    <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
                    <button type="button" id="cancel" class="btn">Cancel</button>
                </div>
            </div>
        </bs:form>
    </div>
    <div class="container-fluid">
        <div class="expandable-debug">
            <hr />
            <h3>Debug</h3>
            <div>
                <h4>KO model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                <h4>Activities</h4>
                <pre>${site?.activities}</pre>
                <h4>Site</h4>
                <pre>${site}</pre>
                <h4>Projects</h4>
                <pre>${projects}</pre>
                <h4>Features</h4>
                <pre>${mapFeatures}</pre>
            </div>
        </div>
    </div>

<!-- templates -->
<script type="text/html" id="locationTypeNone">
    %{--<span>Choose a type</span>--}%
</script>

<script type="text/html" id="locationTypePoint">
    <div class="row-fluid controls-row">
        <fc:textField data-bind="value:decimalLatitude" outerClass="span3" label="Latitude"/>
        <fc:textField data-bind="value:decimalLongitude" outerClass="span3" label="Longitude"/>
    </div>
    <div class="row-fluid controls-row">
        <fc:textField data-bind="value:uncertainty, enable: hasCoordinate()" outerClass="span2" label="Uncertainty"/>
        <fc:textField data-bind="value:precision, enable: hasCoordinate()" outerClass="span2" label="Precision"/>
        <fc:textField data-bind="value:datum, enable: hasCoordinate()" outerClass="span2" label="Datum" placeholder="e.g. WGS84"/>
    </div>
</script>

<script type="text/html" id="locationTypePid">

    <g:select from="['Australian states', 'Local Gov. Area', 'IMCRA', 'IBRA']"
              name='layerName'
              keys="['cl22','cl23','cl23', 'cl23']"/>

    <fc:textField data-bind="value:pid" class="input-small" label="Pid:"/>
</script>

<script type="text/html" id="locationTypeUpload">
    <fc:textField  class="input-small" label="File:"/>
    <span>Not implemented yet</span>
</script>

<script type="text/html" id="locationTypeDrawn">
<div class="drawLocationDiv row-fluid">
    <div class="span4">

        <button class="btn" style="margin-bottom:20px;" data-bind="click: drawSiteClick">Draw the location</button>

        <div class="row-fluid controls-row">
            <span class="label">ShapeType</span> <span data-bind="text:shapeType"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label">Area (km&sup2;)</span> <span data-bind="text:area"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label">State/territory</span> <span data-bind="text:state"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label">Local Gov. Area</span> <span data-bind="text:lga"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label">Locality</span> <span data-bind="text:locality"></span>
        </div>

        <div class="row-fluid controls-row circleProperties propertyGroup">
            <span class="label">Latitude</span> <span data-bind="text:decimalLatitude"></span>
            <span class="label">Longitude</span> <span data-bind="text:decimalLongitude"></span>
        </div>
        <div class="row-fluid controls-row circleProperties propertyGroup">
            <span class="label">Radius (m)</span> <span data-bind="text:radius"></span>
        </div>

        <div class="row-fluid controls-row polygonProperties propertyGroup">
            <span class="label">Well Known Text (WKT)</span>
            <span data-bind="text:wkt"></span>

            <span style="display:none;">
                <span class="label">GeoJSON</span> <span data-bind="text:geojson"></span>
            </span>
        </div>
        <div class="row-fluid controls-row rectangleProperties propertyGroup">
            <span class="label">Latitude (SW)</span> <span data-bind="text:minLat"></span>
            <span class="label">Longitude (SW)</span> <span data-bind="text:minLon"></span>
        </div>
        <div class="row-fluid controls-row rectangleProperties propertyGroup">
            <span class="label">Latitude (NE)</span> <span data-bind="text:maxLat"></span>
            <span class="label">Longitude (NE)</span> <span data-bind="text:maxLon"></span>
        </div>

    </div>
    <div class="smallMap span8" style="width:400px;height:200px;"></div>
</div>
</script>

<r:script>

    // server side generated paths & properties
    var SERVER_CONF = {
        <g:if test="${site}">
        pageUrl : "${grailsApplication.config.grails.serverURL}${createLink(controller:'site', action:'edit', id: site?.siteId, params:[checkForState:true])}",
        </g:if>
        <g:else>
        pageUrl : "${grailsApplication.config.grails.serverURL}${createLink(controller:'site', action:'create', params:[checkForState:true])}",
        </g:else>
        sitePageUrl : "${createLink(action: 'index', id: site?.siteId)}",
        homePageUrl : "${createLink(controller: 'home', action: 'index')}",
        drawSiteUrl : "${createLink(controller: 'site', action: 'draw')}",
        projectList : ${projectList?:'[]'},
        ajaxUpdateUrl: "${createLink(action: 'ajaxUpdate', id: site?.siteId)}",
        siteData: $.parseJSON('${json}'),
        checkForState: ${params.checkForState?:'false'}
    };

    var savedSiteData = {
        id: "${site?.id}",
        name : "${site?.name}",
        externalId : "${site?.externalId}",
        type : "${site?.type}",
        extent: ${site?.extent?:'null'},
        area : "${site?.area}",
        description : "${site?.description}",
        notes : "${site?.notes}",
        projects : ${site?.projects?:'[]'}
    };

    var viewModel = null;

    // returns blank string if the property is undefined, else the value
    function orBlank(v) {
        return v === undefined ? '' : v;
    }

    // returns blank string if the object or the specified property is undefined, else the value
    function exists(parent, prop) {
        if(parent === undefined)
            return '';
        if(parent == null)
            return '';
        if(parent[prop] === undefined)
            return '';
        if(parent[prop] == null)
            return '';
        if(ko.isObservable(parent[prop])){
            return parent[prop]();
        }
        return parent[prop];
    }

    function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i=0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    $(function(){

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            if(viewModel.saved()){
                document.location.href = SERVER_CONF.sitePageUrl;
            } else {
                document.location.href = SERVER_CONF.homePageUrl;
            }
        });

        var DrawnLocation = function (l) {
            this.type = 'locationTypeDrawn';

            console.log("Adding drawn location.....");
            console.log(l);
            console.log('WKT =  ' + exists(l,'wkt'));

            if(exists(l,'wkt') != ''){
               //we have a polygon
               this.shapeType = ko.observable('polygon');
            } else if(exists(l,'minLat') != ''){
               //we have a rectangle
               this.shapeType = ko.observable('rectangle');
            } else if(exists(l,'radius') != ''){
               //we have a circle
               this.shapeType = ko.observable('circle');
            } else {
               this.shapeType = ko.observable('');
            }

            this.area = ko.observable(exists(l,'area'));
            this.lga = ko.observable(exists(l,'lga'));
            this.state = ko.observable(exists(l,'state'));
            this.locality = ko.observable(exists(l,'locality'));

            //rectangle
            this.minLat = ko.observable(exists(l,'minLat'));
            this.minLon = ko.observable(exists(l,'minLon'));
            this.maxLat = ko.observable(exists(l,'maxLat'));
            this.maxLon = ko.observable(exists(l,'maxLon'));

            //radius
            this.radius = ko.observable(exists(l,'radius'));
            this.decimalLatitude = ko.observable(exists(l,'decimalLatitude'));
            this.decimalLongitude = ko.observable(exists(l,'decimalLongitude'));

            //polygon
            this.wkt = ko.observable(exists(l,'wkt'));
            this.geojson = ko.observable(exists(l,'geojson'));

            //function for starting draw tool
            this.drawSiteClick = function(){
                console.log('Draw site click....');
                //which element has been selected?
                amplify.store("savedViewData", {
                    id: viewModel.id(),
                    name: viewModel.name(),
                    externalId : viewModel.externalId(),
                    type : viewModel.type(),
                    area : viewModel.area(),
                    description : viewModel.description(),
                    notes : viewModel.notes(),
                    projects : viewModel.projects()
                });

                //create a pass through object to initialise state
                amplify.store("currentDrawnShape",{
                   shapeType: this.shapeType(),
                   area: this.area(),
                   lga: this.lga(),
                   state: this.state(),
                   minLat: this.minLat(),
                   minLon: this.minLon(),
                   maxLat: this.maxLat(),
                   maxLon: this.maxLon(),
                   radius: this.radius(),
                   decimalLatitude: this.decimalLatitude(),
                   decimalLongitude: this.decimalLongitude(),
                   wkt: this.wkt(),
                   geojson: this.geojson()
                });

                console.log('The stored currentDrawnShape...');
                console.log(amplify.store("currentDrawnShape"));
                console.log('Draw site click....' + this.shapeType());
                document.location.href = SERVER_CONF.drawSiteUrl + '?returnTo=' + SERVER_CONF.pageUrl;
            }
        };

        var PidLocation = function (l) {
            this.pid = ko.observable(exists(l,'pid'));
            this.type = 'locationTypePid';
            this.shapeType = ko.observable('pid');
        };

        var UploadLocation = function (l) {
            this.type = 'locationTypeUpload';
            this.shapeType = ko.observable('upload');
        };

        var PointLocation = function (l) {
            var self = this;
            this.type = 'locationTypePoint';
            this.shapeType = ko.observable('point');
            this.decimalLatitude = ko.observable(exists(l,'decimalLatitude'));
            this.decimalLongitude = ko.observable(exists(l,'decimalLongitude'));
            this.uncertainty = ko.observable(exists(l,'uncertainty'));
            this.precision = ko.observable(exists(l,'precision'));
            this.datum = ko.observable(exists(l,'datum'));
            this.hasCoordinate = function () {
                return self.decimalLatitude() !== '' && self.decimalLongitude() !== '';
            }
        };

        var Location = function (id, name, type, geometry) {
            var self = this;
            this.id = id;
            this.geometry = geometry;
            this.name = ko.observable(name);
            this.type = ko.observable(type);
            this.toJSON = function(){
                var js = ko.toJS(this);
                //clean up the geometry
                for(var propt in js.geometry){
                   if(js.geometry[propt] == undefined || js.geometry[propt] == NaN || js.geometry[propt] == ""){
                        delete js.geometry[propt];
                   }
                }
                return js;
            }
            this.updateModel = function (event) {
                console.log("############### Update model called.....");
                var trev = event;
                var lType = self.geometry();
                var modelType = self.geometry ? self.geometry.type : 'locationTypeNone';
                if (modelType !== self.type()) {
                    switch (self.type()) {
                        case 'locationTypePoint': self.geometry = new PointLocation(); break;
                        case 'locationTypePid': self.geometry = new PidLocation(); break;
                        case 'locationTypeUpload': self.geometry = new UploadLocation(); break;
                        case 'locationTypeDrawn': self.geometry = new DrawnLocation(); break;
                        default: self.geometry = {type: 'locationTypeNone'}
                    }
                }
                return self.type();
            };
            this.myPostProcessingLogic = function(elements) {
                console.log(elements);
                var $drawLocationDiv = $(elements[1]);
                var $smallMapDiv = $drawLocationDiv.find('.smallMap');
                console.log($smallMapDiv);
                //initialise a map
                var mapId = makeid();
                $smallMapDiv.attr('id',mapId);
                if(self.geometry != null && self.geometry.shapeType() != ''){
                    console.log("The shape type = " + self.geometry.shapeType());
                    $drawLocationDiv.find('.propertyGroup').css('display','none');

                    if(self.geometry.shapeType() == 'polygon'){
                        var mapOptions = {
                            zoomToBounds:true,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:self.geometry.shapeType(),
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                geojson:self.geometry.geojson()
                            }]
                        };
                        $drawLocationDiv.find('.polygonProperties').css('display','block');
                        init_map_with_features({mapContainer: mapId}, mapOptions);
                    } else if(self.geometry.shapeType() == 'circle'){

                        //console.log("Using radius: " + self.data.radius() + ", lat: " + self.data.decimalLatitude() + ", lon: " + self.data.decimalLatitude());
                        var mapOptions = {
                            zoomToBounds:true,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:self.geometry.shapeType(),
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                radius: self.geometry.radius(),
                                decimalLatitude: self.geometry.decimalLatitude(),
                                decimalLongitude: self.geometry.decimalLongitude()
                            }]
                        };
                        $drawLocationDiv.find('.circleProperties').css('display','block');
                        init_map_with_features({mapContainer: mapId}, mapOptions);
                    } else if(self.geometry.shapeType() == 'rectangle'){
                        var mapOptions = {
                            zoomToBounds:true,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:self.geometry.shapeType(),
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                minLat: self.geometry.minLat(),
                                minLon: self.geometry.minLon(),
                                maxLat: self.geometry.maxLat(),
                                maxLon: self.geometry.maxLon()
                            }]
                        };
                        $drawLocationDiv.find('.rectangleProperties').css('display','block');
                        init_map_with_features({mapContainer: mapId}, mapOptions);
                    }
                }
            }
        };

        function SiteViewModel (siteData) {
            var self = this;
            self.projectList = SERVER_CONF.projectList;
            self.id = ko.observable(siteData.id);
            self.name = ko.observable(siteData.name);
            self.externalId = ko.observable(siteData.externalId);
            self.type = ko.observable(siteData.type);
            self.area = ko.observable(siteData.area);
            self.description = ko.observable(siteData.description);
            self.notes = ko.observable(siteData.notes);
            self.projects = ko.observableArray(siteData.projects);
            self.extent = ko.observable();
            self.location = ko.observableArray([]);
            self.saved = function(){
                return self.id() != '';
            };
            self.toJSON = function(){
                console.log('toJSON on SiteViewModel')
                var js = ko.toJS(self);
                delete js.gazInfo;
                delete js.drawnShape;
                return js;
            }
            self.loadExtent = function(){
                console.log('Loading the extent.....');
                var geometry;
                if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                    var extent = SERVER_CONF.siteData.extent;
                    console.log('Loading the extent type.....' + extent.type);
                    switch (extent.type) {
                        case 'locationTypePoint': geometry = new PointLocation(extent.geometry); break;
                        case 'locationTypePid': geometry = new PidLocation(extent.geometry); break;
                        case 'locationTypeDrawn': geometry = new DrawnLocation(extent.geometry); break;
                        default: geometry = {id: 1};
                    }
                    console.log('Setting the extent .....' + extent);
                    self.extent(new Location(extent.id, extent.name, extent.type, geometry));
                } else {
                    console.log('Initialising dummy extent....');
                    self.extent(new Location('extent', '', 'locationTypeNone', null));
                }
            };
            self.updateExtent = function(event){
                console.log('Updating the extent: ' + self.extent().type());
                switch (self.extent().type()) {
                    case 'locationTypePoint':  self.extent().geometry = new PointLocation(self.extent().geometry); break;
                    case 'locationTypePid':    self.extent().geometry = new PidLocation(self.extent().geometry); break;
                    case 'locationTypeUpload': self.extent().geometry = new UploadLocation(); break;
                    case 'locationTypeDrawn':  self.extent().geometry = new DrawnLocation(self.extent().geometry); break;
                    default: self.extent(new Location('extent', '', 'locationTypeNone', null));
                }
                return self.extent().type();
            };
            self.loadLocations = function () {
                var geometry;
                if(SERVER_CONF.siteData != null && SERVER_CONF.siteData.location != NaN){
                    $.each(SERVER_CONF.siteData.location, function (i, loc) {
                        switch (loc.type) {
                            case 'locationTypePoint': geometry = new PointLocation(loc.geometry); break;
                            case 'locationTypePid': geometry = new PidLocation(loc.geometry); break;
                            case 'locationTypeDrawn': geometry = new DrawnLocation(loc.geometry); break;
                            default: data = {id: 1};
                        }
                        var temp = new Location(loc.id, loc.name, loc.type, geometry);
                        self.location.push(temp);
                    });
                }
            };
            self.addDrawnLocation = function(drawnShape, gazInfo){
                self.extent(new Location('1', 'Drawn shape', 'locationTypeDrawn', new DrawnLocation(drawnShape, gazInfo)));
            };
            self.setExtent = function(drawnShape, gazInfo){
                console.log('Setting the extent...');
                self.extent(new Location('1', 'Drawn shape', 'locationTypeDrawn', new DrawnLocation(drawnShape, gazInfo)));
            };
            self.addLocation = function (id, name, type, loc) {
                var geometry;
                switch (type) {
                    case 'locationTypePoint': geometry = new PointLocation(loc); break;
                    case 'locationTypePid': geometry = new PidLocation(loc); break;
                    case 'locationTypeDrawn': geometry = new DrawnLocation(loc); break;
                    default: geometry = {id: 1};
                }
                var temp = new Location(id, name, type, geometry);
                self.location.push(temp);
                var temp2 = ko.mapping.toJS(self.location);
            };
            self.addEmptyLocation = function () {
                self.location.push(new Location('', '', 'locationTypeNone', null));
            };
            self.removeLocation = function (location) {
                self.location.remove(location);
            };
            self.removeAllLocations = function (location) {
                self.location.removeAll();
            };
            self.save = function () {
                var json = ko.toJSON(self);
                $.ajax({
                    url: SERVER_CONF.ajaxUpdateUrl,
                    type: 'POST',
                    data: json,
                    contentType: 'application/json',
                    success: function (data) {
                        if(data.status == 'created'){
                            document.location.href = SERVER_CONF.sitePageUrl + '/' + data.id;
                        } else {
                            document.location.href = SERVER_CONF.sitePageUrl;
                        }
                    },
                    error: function (data) {
                        alert('There was a problem saving this site');
                    }
                });
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
        }

        ko.bindingHandlers.switchModel = {
            update: function (element, valueAccessor) {
                ko.bindingHandlers.value.update(element, valueAccessor);
            }
        };

        //retrieve serialised model
        var savedViewData = amplify.store("savedViewData");
        if(SERVER_CONF.checkForState && savedViewData !== undefined){
            viewModel = new SiteViewModel(savedViewData);
        } else {
            viewModel = new SiteViewModel(savedSiteData);
        }

        viewModel.loadExtent();

        ko.applyBindings(viewModel);

        //any passed back from drawing tool
        if(SERVER_CONF.checkForState){
            viewModel.removeAllLocations(); //remove all for now, until we support multiple
            var drawnShape = amplify.store("drawnShape");
            var gazInfo  = amplify.store("gazInfo");
            console.log("Retrieving drawnShape & gazinfo")
            console.log(drawnShape);
            console.log(gazInfo);
            var newExtent = new Location('1', 'Extent', 'locationTypeDrawn', new DrawnLocation(drawnShape));
            viewModel.extent(newExtent);
        }
    });
</r:script>
</body>
</html>