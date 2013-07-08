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
  <r:require modules="knockout, jqueryValidationEngine, amplify, mapWithFeatures"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <g:if test="${project}">
            <li class="active">Create new site for ${project?.name}</li>
        </g:if>
        <g:elseif test="${create}">
            <li class="active">Create</li>
        </g:elseif>
        <g:else>
            <li><g:link controller="site" action="index" id="${site?.siteId}">
                <span data-bind="text: name">${site?.name}</span>
            </g:link><span class="divider">/</span></li>
            <li class="active">Edit</li>
        </g:else>
    </ul>
    <div class="container-fluid validationEngineContainer" id="validation-container">
        <bs:form action="update" inline="true">

            <div class="row-fluid">
                <g:hiddenField name="id" value="${site?.siteId}"/>
                <div>
                    <label for="name">Site name</label>
                    <h1>
                        <input data-bind="value: name" data-validation-engine="validate[required]"
                               class="span8" id="name" type="text" value="${site?.name}"
                               placeholder="Enter a name for the new site"/>
                    </h1>
                </div>
            </div>
                <g:if test="${project}">
                <div class="row-fluid" style="padding-bottom:15px;">
                    <span>Project name:</span>
                    <g:link controller="project" action="index" id="${project?.projectId}">${project?.name}</g:link>
                </div>
                </g:if>


            <div class="row-fluid">
                <div class="span4">
                    <label for="externalId">External Id
                        <fc:iconHelp title="External id">Identifier code for the site - used in external documents.</fc:iconHelp>
                    </label>
                    <input data-bind="value:externalId" id="externalId" type="text" class="span12"/>
                </div>
                <div class="span4">
                    <label for="type">Type</label>
                    %{--<input data-bind="value: type" id="type" type="text" class="span12"/>--}%
                    <g:select id="type"
                              data-bind="value: type"
                              class="span12"
                              name='type'
                              from="['choose site type','Pastoral','Industrial','Urban','Coastal', 'Reserve', 'Private land']"
                              keys="['none','Pastoral','Industrial','Urban','Coastal','Reserve', 'Private land']"/>
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
                <div class="span2">
                    <g:select class="input-medium" data-bind="value: extent().source"
                              name='extentSource'
                              from="['choose type','point','known shape','upload a shape','draw a shape']"
                              keys="['none','point','pid','upload','drawn']"/>
                </div>
                <div class="span4">
                    <div data-bind="template: { name: updateExtent(), data: extent(), afterRender: extent().renderMap}"></div>
                </div>
                <div class="span6">
                    <div id="mapForExtent" class="smallMap span6" style="width:100%;height:250px;"></div>
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
<script type="text/html" id="none">
    %{--<span>Choose a type</span>--}%
</script>

<script type="text/html" id="point">
<div class="drawLocationDiv row-fluid">
    <div class="span12">
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:geometry().decimalLatitude" outerClass="span6" label="Latitude"/>
            <fc:textField data-bind="value:geometry().decimalLongitude" outerClass="span6" label="Longitude"/>
        </div>
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:geometry().uncertainty, enable: hasCoordinate()" outerClass="span4" label="Uncertainty"/>
            <fc:textField data-bind="value:geometry().precision, enable: hasCoordinate()" outerClass="span4" label="Precision"/>
            <fc:textField data-bind="value:geometry().datum, enable: hasCoordinate()" outerClass="span4" label="Datum" placeholder="e.g. WGS84"/>
        </div>
    </div>
</div>
</script>

<script type="text/html" id="pid">
<div id="pidLocationDiv" class="drawLocationDiv row-fluid">
    <div class="span5">
        <select data-bind="options: layers,
            optionsCaption:'Choose a layer...',
            optionsText:'name', value: chosenLayer, event: { change: refreshObjectList }"></select>
        <select data-bind="options: layerObjects,
            optionsCaption:'Choose shape ...',
            optionsText:'name', value: layerObject, event: { change: updateSelectedPid }"></select>
        <div class="row-fluid controls-row">
            <span class="label label-success">PID</span> <span data-bind="text:geometry().pid"></span>
            <span class="label label-success">Name</span> <span data-bind="text:geometry().name"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">LayerID</span> <span data-bind="text:geometry().fid"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Layer</span> <span data-bind="text:geometry().layerName"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Area (km&sup2;)</span> <span data-bind="text:geometry().area"></span>
        </div>
    </div>
    %{--<div class="smallMap span8" style="width:500px;height:300px;"></div>--}%
</div>
</script>

<script type="text/html" id="upload">
    <h3> Not implemented - waiting on web services...</h3>
    %{--<g:uploadForm action="upload">--}%
        %{--<input type="file" name="myFile" value="Choose Shape file"/>--}%
        %{--<input type="submit" class="btn" />--}%
    %{--</g:uploadForm>--}%
</script>

<script type="text/html" id="drawn">
<div id="drawnLocationDiv" class="drawLocationDiv row-fluid">
    <div class="span12">

        <button class="btn" style="margin-bottom:20px;" data-bind="click: drawSiteClick">Draw the location <i class="icon-circle-arrow-right"></i></button>
        <div data-bind="visible: geometry().type !==undefined">
        <div class="row-fluid controls-row">
            <span class="label label-success">Type</span> <span data-bind="text:geometry().type"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Area (km&sup2;)</span> <span data-bind="text:geometry().areaKmSq"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label label-success">State/territory</span> <span data-bind="text:geometry().state"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label label-success">Local Gov. Area</span> <span data-bind="text:geometry().lga"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label label-success">Locality</span> <span data-bind="text:geometry().locality"></span>
        </div>

        <div style="display:none;" class="row-fluid controls-row">
            <span class="label label-success">Center</span> <span data-bind="text:geometry().centre"></span>
        </div>
        <div class="row-fluid controls-row circleProperties propertyGroup">
            <span class="label label-success">Radius (m)</span> <span data-bind="text:geometry().radius"></span>
        </div>

        <div style="display:none;" class="row-fluid controls-row  propertyGroup">
            <span class="label">GeoJSON</span> <span data-bind="text:ko.toJSON(geometry())"></span>
        </div>
        <div class="row-fluid controls-row rectangleProperties propertyGroup">
            <span class="label label-success">Latitude (SW)</span> <span data-bind="text:geometry().minLat"></span>
            <span class="label label-success">Longitude (SW)</span> <span data-bind="text:geometry().minLon"></span>
        </div>
        <div class="row-fluid controls-row rectangleProperties propertyGroup">
            <span class="label label-success">Latitude (NE)</span> <span data-bind="text:geometry().maxLat"></span>
            <span class="label label-success">Longitude (NE)</span> <span data-bind="text:geometry().maxLon"></span>
        </div>
        </div>
    </div>
    %{--<div class="smallMap span8" style="width:500px;height:300px;"></div>--}%
</div>
</script>

<r:script>

    // server side generated paths & properties
    var SERVER_CONF = {
        <g:if test="${project}">
        pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'createForProject', params:[projectId:project.projectId,checkForState:true])}",
        projectUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'project', action:'index', id:project.projectId)}",
        </g:if>
        <g:elseif test="${site}">
        pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'edit', id: site?.siteId, params:[checkForState:true])}",
        </g:elseif>
        <g:else>
        pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'create', params:[checkForState:true])}",
        </g:else>
        sitePageUrl : "${createLink(action: 'index', id: site?.siteId)}",
        homePageUrl : "${createLink(controller: 'home', action: 'index')}",
        drawSiteUrl : "${createLink(controller: 'site', action: 'draw')}",
        <g:if test="${project}">
        projectList : ['${project.projectId}'],
        </g:if>
        <g:else>
        projectList : ${projectList?:'[]'},
        </g:else>
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
        <g:if test="${project}">
        projects : ['${project.projectId}'],
        </g:if>
        <g:else>
        projects : ${site?.projects?:'[]'}
        </g:else>
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

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            if(viewModel.saved()){
                document.location.href = SERVER_CONF.sitePageUrl;
            } else {
                document.location.href = SERVER_CONF.homePageUrl;
            }
        });

        var DrawnLocation = function (l) {
            var self = this;
            self.source = ko.observable('drawn');
            console.log("Setting geometry - " + JSON.stringify(l));
            self.geometry = ko.observable(l);
            console.log("Set geometry - " + JSON.stringify(self.geometry()));
            //function for starting draw tool
            self.drawSiteClick = function(){
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
                if(self.geometry !== undefined && self.geometry() !== undefined){
                    amplify.store("drawnShape", self.geometry());
                } else {
                    amplify.store("drawnShape", null);
                }
                document.location.href = SERVER_CONF.drawSiteUrl + '?returnTo=' + encodeURIComponent(SERVER_CONF.pageUrl);
            }
            self.renderMap = function(elements){
                console.log("######## Rendering map for DrawnLocation ......" + $(elements[1]).attr('id'));
                var $drawLocationDiv = $(elements[1]);
                if(self.geometry() != null && self.geometry().centre !== undefined){
                    console.log("The shape type = " + self.geometry().type);
                    $drawLocationDiv.find('.propertyGroup').css('display','none');
                    //clone the object to avoid side affects with mapping
                    var geometryToRender = jQuery.extend(true, {}, self.geometry());
                    var mapOptions = {
                        zoomToBounds:true,
                        zoomLimit:16,
                        highlightOnHover:true,
                        features:[geometryToRender]
                    };
                    switch (self.geometry().type) {
                        case 'Polygon': $drawLocationDiv.find('.polygonProperties').css('display','block'); break;
                        case 'Circle': $drawLocationDiv.find('.circleProperties').css('display','block'); break;
                        case 'Rectangle': $drawLocationDiv.find('.rectangleProperties').css('display','block'); break;
                    }

                    console.log("######## Before init_map_with_features -  geometry - " + JSON.stringify(self.geometry()));
                    init_map_with_features({mapContainer: 'mapForExtent'}, mapOptions);
                    console.log("######## After init_map_with_features -  geometry - " + JSON.stringify(self.geometry()));
                }
            }
        };

        var PidLocation = function (l) {
            var self = this;
            this.source = ko.observable('pid');
            self.geometry = ko.observable({
                type :"pid",
                pid : ko.observable(exists(l,'pid')),
                name : ko.observable(exists(l,'name')),
                fid : ko.observable(exists(l,'fid')),
                layerName : ko.observable(exists(l,'layerName')),
                area : ko.observable(exists(l,'area')),
                centre:[]
            });
            this.chosenLayer = ko.observable();
            this.layerObject = ko.observable();
            this.layerObjects = ko.observable([]);
            this.layers = [{id:'cl22',name:'Australian states'},{id:'cl23', name:'LGA'},{id:'cl21', name:'IBRA'}];
            self.renderMap = function(){
                console.log("Render map on PidLocation called..." + self.geometry().pid())
                if(self.geometry().pid() != null && self.geometry().pid() != '' ){
                    console.log("Rendering PID: " + self.geometry().pid());
                    var mapOptions = {
                        zoomToBounds:true,
                        zoomLimit:16,
                        highlightOnHover:true,
                        features:[{
                            type:'pid',
                            polygonUrl:'${createLink(controller:'proxy',action:'geojsonFromPid')}?pid=' + self.geometry().pid()
                        }]
                    };
                    init_map_with_features({mapContainer: 'mapForExtent'}, mapOptions);
                }
            }
            self.updateSelectedPid = function(elements){
                if(self.layerObject() !== undefined){
                    self.geometry().pid(self.layerObject().pid)
                    self.geometry().fid(self.layerObject().fid)
                    self.geometry().name(self.layerObject().name)
                    self.geometry().layerName(self.layerObject().fieldname)
                    if(self.layerObject().area_km !== undefined){
                        console.log("Selected shape area: " + self.layerObject().area_km);
                        self.geometry().area(self.layerObject().area_km)
                    }
                    self.renderMap();
                }
            }
            self.refreshObjectList = function(){
                self.layerObjects([]);
                if(self.chosenLayer() !== undefined){
                    $.ajax({
                        url: '${grailsApplication.config.spatialLayerServices.baseUrl}/objects/' + this.chosenLayer().id,
                        dataType:'jsonp'
                    }).done(function(data) {
                        self.layerObjects(data);
                    });
                }
            }
            self.toJSON = function(){
                //console.log('toJSON on PidLocation')
                var js = ko.toJS(self);
                delete js.layers;
                delete js.layerObjects;
                delete js.layerObject;
                delete js.chosenLayer;
                delete js.type;
                return js;
            }
        };

        var EmptyLocation = function () {
            this.source = ko.observable('none');
            this.geometry = ko.observable();
        };

        var UploadLocation = function (l) {
            this.source = ko.observable('upload');
            this.geometry = ko.observable();
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
               datum: ko.observable(exists(l,'datum'))
            });
            self.hasCoordinate = function () {
                return self.geometry().decimalLatitude() !== undefined
                    && self.geometry().decimalLatitude() !== ''
                    && self.geometry().decimalLongitude() !== undefined
                    && self.geometry().decimalLongitude() !== '';
            }
            self.toJSON = function(){
                var js = ko.toJS(self);
                if(js.geometry.decimalLatitude !== undefined
                    && js.geometry.decimalLatitude !== ''
                    && js.geometry.decimalLongitude !== undefined
                    && js.geometry.decimalLongitude !== ''){
                    js.geometry.centre = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
                    js.geometry.coordinates = [js.geometry.decimalLongitude, js.geometry.decimalLatitude]
                }
                return js;
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
            self.extent = ko.observable(new EmptyLocation());
            self.location = ko.observableArray([]);
            self.saved = function(){
                return self.id() != '';
            };
            self.toJSON = function(){
                var js = ko.toJS(self);
                delete js.drawnShape;
                return js;
            }
            self.loadExtent = function(){
                console.log('Loading the extent.....');
                var geometry;
                if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                    var extent = SERVER_CONF.siteData.extent;
                    console.log('Loading the extent type.....' + extent.type);
                    switch (extent.source) {
                        case 'point':   self.extent(new PointLocation(extent.geometry)); break;
                        case 'pid':     self.extent(new PidLocation(extent)); break;
                        case 'upload':  self.extent(new UploadLocation()); break;
                        case 'drawn':   self.extent(new DrawnLocation(extent.geometry)); break;
                    }
                    console.log('Setting the extent .....' + extent);
                } else {
                    console.log('Initialising dummy extent....');
                    self.extent(new EmptyLocation());
                }
            };
            self.updateExtent = function(event){
                console.log('Updating the extent: ' + self.extent().source());
                switch (self.extent().source()) {
                    case 'point':
                        if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                           self.extent(new PointLocation(SERVER_CONF.siteData.extent.geometry));
                        } else {
                            self.extent(new PointLocation({}));
                        }
                        break;
                    case 'pid':    self.extent(new PidLocation({})); break;
                    case 'upload': self.extent(new UploadLocation({})); break;
                    case 'drawn':
                        if(!SERVER_CONF.checkForState){
                            if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                               self.extent(new DrawnLocation(SERVER_CONF.siteData.extent.geometry));
                            } else {
                                self.extent(new DrawnLocation({}));
                            }
                        } else {
                            self.extent(new DrawnLocation(amplify.store("drawnShape")))
                        }
                        break;
                    default: self.extent(new EmptyLocation());
                }
                return self.extent().source();
            };
            %{--self.loadLocations = function () {--}%
                %{--var geometry;--}%
                %{--if(SERVER_CONF.siteData != null && SERVER_CONF.siteData.location != NaN){--}%
                    %{--$.each(SERVER_CONF.siteData.location, function (i, loc) {--}%
                        %{--switch (loc.type) {--}%
                            %{--case 'locationTypePoint': geometry = new PointLocation(loc.geometry); break;--}%
                            %{--case 'locationTypePid': geometry = new PidLocation(loc.geometry); break;--}%
                            %{--case 'locationTypeDrawn': geometry = new DrawnLocation(loc.geometry); break;--}%
                            %{--default: data = {id: 1};--}%
                        %{--}--}%
                        %{--var temp = new Location(loc.id, loc.name, loc.type, geometry);--}%
                        %{--self.location.push(temp);--}%
                    %{--});--}%
                %{--}--}%
            %{--};--}%
            %{--self.addDrawnLocation = function(drawnShape, gazInfo){--}%
                %{--self.extent(new Location('1', 'Drawn shape', 'locationTypeDrawn', new DrawnLocation(drawnShape, gazInfo)));--}%
            %{--};--}%
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
            %{--self.addEmptyLocation = function () {--}%
                %{--self.location.push(new Location('', '', 'locationTypeNone', null));--}%
            %{--};--}%
            %{--self.removeLocation = function (location) {--}%
                %{--self.location.remove(location);--}%
            %{--};--}%
            %{--self.removeAllLocations = function (location) {--}%
                %{--self.location.removeAll();--}%
            %{--};--}%
            self.save = function () {
                if ($('#validation-container').validationEngine('validate')) {
                    var json = ko.toJSON(self);
                    $.ajax({
                        url: SERVER_CONF.ajaxUpdateUrl,
                        type: 'POST',
                        data: json,
                        contentType: 'application/json',
                        success: function (data) {
                            if(data.status == 'created'){
                                <g:if test="${project}">
                                document.location.href = SERVER_CONF.projectUrl;
                                </g:if>
                                <g:else>
                                document.location.href = SERVER_CONF.sitePageUrl + '/' + data.id;
                                </g:else>
                            } else {
                                document.location.href = SERVER_CONF.sitePageUrl;
                            }
                        },
                        error: function (data) {
                            alert('There was a problem saving this site');
                        }
                    });
                }
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
            var drawnShape = amplify.store("drawnShape");
            console.log("[INIT - check state] Retrieving drawnShape in GEOJSON")
            viewModel.extent(new DrawnLocation(drawnShape));
        }
    });
</r:script>
</body>
</html>