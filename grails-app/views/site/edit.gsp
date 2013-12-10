<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title> ${create ? 'New' : ('Edit | ' + site?.name?.encodeAsHTML())} | Sites | Field Capture</title>
  <style type="text/css">
    legend {
        border: none;
        margin-bottom: 5px;
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
  <r:require modules="knockout, jqueryValidationEngine, amplify"/>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&libraries=drawing,geometry"></script>
  <r:require modules="drawmap"/>
</head>
<body>
    <div class="container-fluid validationEngineContainer" id="validation-container">
        <ul class="breadcrumb">
            <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
            <li>Sites<span class="divider">/</span></li>
            <g:if test="${project}">
                <li class="active">Create new site for ${project?.name?.encodeAsHTML()}</li>
            </g:if>
            <g:elseif test="${create}">
                <li class="active">Create</li>
            </g:elseif>
            <g:else>
                <li><g:link controller="site" action="index" id="${site?.siteId}">
                    <span data-bind="text: name">${site?.name?.encodeAsHTML()}</span>
                </g:link><span class="divider">/</span></li>
                <li class="active">Edit</li>
            </g:else>
        </ul>

        <bs:form action="update" inline="true">

            <div class="row-fluid">
                <g:hiddenField name="id" value="${site?.siteId}"/>
                <div>
                    <label for="name">Site name</label>
                    <h1>
                        <input data-bind="value: name" data-validation-engine="validate[required]"
                               class="span8" id="name" type="text" value="${site?.name?.encodeAsHTML()}"
                               placeholder="Enter a name for the new site"/>
                    </h1>
                </div>
            </div>
            <g:if test="${project}">
            <div class="row-fluid" style="padding-bottom:15px;">
                <span>Project name:</span>
                <g:link controller="project" action="index" id="${project?.projectId}">${project?.name?.encodeAsHTML()}</g:link>
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

            <h2>Extent of site</h2>
            <fc:iconHelp title="Extent of the site">The extent of the site can be represented by
                a polygon, radius or point. KML, WKT and shape files are supported for uploading polygons.
                As are PID's of existing features in the Atlas Spatial Portal.</fc:iconHelp>

            <div class="row-fluid">

                <div class="span6">
                    <div id="mapForExtent" class="smallMap span6" style="width:100%;height:600px;"></div>
                </div>

                <div class="span6">

                    <div class="well well-small">

                        <div>
                            <h4>Define extent using:
                            <g:select class="input-medium" data-bind="value: extent().source"
                                      name='extentSource'
                                      from="['choose type','point','known shape','upload a shape','draw a shape']"
                                      keys="['none','point','pid','upload','drawn']"/>
                            </h4>
                        </div>

                        <div id="map-controls" data-bind="visible: extent().source() == 'drawn' ">
                            <ul id="control-buttons">
                                <li class="active" id="pointer" title="Drag to move. Double click or use the zoom control to zoom.">
                                    <a href="javascript:void(0);" class="btn active draw-tool-btn">
                                    %{--<img src="${resource(dir:'bootstrap/img',file:'pointer.png')}" alt="pointer"/>--}%
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_347_hand_up.png')}" alt="center and radius"/>
                                    <span class="drawButtonLabel">Move & zoom</span>
                                    </a>
                                </li>
                                <li id="circle" title="Click at centre and drag the desired radius. Values can be adjusted in the boxes.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    %{--<img src="${resource(dir:'images/map',file:'circle.png')}" alt="center and radius"/>--}%
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_095_vector_path_circle.png')}" alt="center and radius"/>
                                    <span class="drawButtonLabel">Draw circle</span>
                                    </a>
                                </li>
                                <li id="rectangle" title="Click and drag a rectangle.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    %{--<img src="${resource(dir:'images/map',file:'rectangle.png')}" alt="rectangle"/>--}%
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_094_vector_path_square.png')}" alt="rectangle"/>
                                    <span class="drawButtonLabel">Draw rect</span>
                                    </a>
                                </li>
                                <li id="polygon" title="Click any number of times to draw a polygon. Double click to close the polygon.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    %{--<img src="${resource(dir:'images/map',file:'polygon.png')}" alt="polygon"/>--}%
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_096_vector_path_polygon.png')}" alt="polygon"/>
                                    <span class="drawButtonLabel">Draw polygon</span>
                                    </a>
                                </li>
                                <li id="clear" title="Clear the region from the map.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    %{--<img src="${resource(dir:'images/map',file:'clear.png')}" alt="clear"/>--}%
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_016_bin.png')}" alt="clear"/>
                                    <span class="drawButtonLabel">Clear</span>
                                    </a>
                                </li>
                                <li id="reset" title="Zoom and centre on Australia.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${resource(dir:'bootstrap/img',file:'reset.png')}" alt="reset map"/>
                                    <span class="drawButtonLabel">Reset</span>
                                    </a>
                                </li>
                                <li id="zoomToExtent" title="Zoom to extent of drawn shape.">
                                    <a href="javascript:zoomToShapeBounds();" class="btn draw-tool-btn">
                                    <img src="${resource(dir:'bootstrap/img',file:'glyphicons_186_move.png')}" alt="zoom to extent of drawn shape"/>
                                    <span class="drawButtonLabel">Zoom</span>
                                    </a>
                                </li>
                            </ul>
                         </div>

                         <div style="padding-top:10px;" data-bind="template: { name: updateExtent(), data: extent(), afterRender: extent().renderMap}"></div>
                        </div>

                    <div class="well well-small">
                        <h4>Points of interest
                            <fc:iconHelp title="Points of interest">You can specify any number of points
                            of interest with a site. Points of interest may include photo points
                            or the locations of previous survey work.</fc:iconHelp>
                        </h4>
                        <div class="row-fluid" id="pointsOfInterest" >
                            <div class="span12" data-bind="foreach: poi">
                                <div>
                                    <div data-bind="template: { name: 'poi'}" ></div>
                                    <button type="button" class="btn btn-danger" style="margin-bottom:20px;" data-bind="click: $parent.removePOI">Remove</button>
                                </div>
                                <hr/>
                            </div>
                        </div>
                        <div class="row-fluid">
                            <button type="button" data-bind="click: addPOI, visible: poi.length == 0" class="btn">Add a POI</button>
                            <button type="button" data-bind="click: addPOI, visible: poi.length > 0" class="btn">Add another POI</button>
                        </div>
                    </div>
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
    <g:if env="development">
    <div class="container-fluid">
        <div class="expandable-debug">
            <hr />
            <h3>Debug</h3>
            <div>
                <h4>KO model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                <h4>Activities</h4>
                <pre>${site?.activities?.encodeAsHTML()}</pre>
                <h4>Site</h4>
                <pre>${site?.encodeAsHTML()}</pre>
                <h4>Projects</h4>
                <pre>${projects?.encodeAsHTML()}</pre>
                <h4>Features</h4>
                <pre>${mapFeatures}</pre>
            </div>
        </div>
    </div>
    </g:if>

<!-- templates -->
<script type="text/html" id="none">
    %{--<span>Choose a type</span>--}%
</script>

<script type="text/html" id="point">
<div class="drawLocationDiv row-fluid">
    <div class="span12">
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:geometry().decimalLatitude, event: { change: renderMap }" outerClass="span6" label="Latitude"/>
            <fc:textField data-bind="value:geometry().decimalLongitude, event: { change: renderMap }" outerClass="span6" label="Longitude"/>
        </div>
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:geometry().uncertainty, enable: hasCoordinate()" outerClass="span4" label="Uncertainty"/>
            <fc:textField data-bind="value:geometry().precision, enable: hasCoordinate()" outerClass="span4" label="Precision"/>
            <fc:textField data-bind="value:geometry().datum, enable: hasCoordinate()" outerClass="span4" label="Datum" placeholder="e.g. WGS84"/>
        </div>
    </div>
    <div class="row-fluid controls-row gazProperties">
        <span class="label label-success">State/territory</span> <span data-bind="text:geometry().state"></span>
    </div>
    <div class="row-fluid controls-row gazProperties">
        <span class="label label-success">Local Gov. Area</span> <span data-bind="text:geometry().lga"></span>
    </div>
    <div class="row-fluid controls-row gazProperties">
        <span class="label label-success">NRM</span> <span data-bind="text:geometry().nrm"></span>
    </div>
    <div class="row-fluid controls-row gazProperties">
        <span class="label label-success">Locality</span> <span data-bind="text:geometry().locality"></span>
    </div>
</div>
</script>

<script type="text/html" id="poi">
<div class="drawLocationDiv row-fluid">
    <div class="span12">
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:name" outerClass="span6" label="Name"/>
        </div>
        <div class="row-fluid controls-row">
            <fc:textArea rows="2" data-bind="value:description" outerClass="span12" class="span12" label="Description"/>
        </div>
        <div class="row-fluid controls-row">
            <label for="type">Point type</label>
            <g:select data-bind="value: type"
                      name='type'
                      from="['choose type','photopoint', 'location of previous surveys', 'other']"
                      keys="['none','point','photopoint', 'survey', 'other']"/>
        </div>
        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:geometry().decimalLatitude" outerClass="span4" label="Latitude"/>
            <fc:textField data-bind="value:geometry().decimalLongitude" outerClass="span4" label="Longitude"/>
            <fc:textField data-bind="value:geometry().bearing" outerClass="span4" label="Bearing (degrees)"/>
        </div>
        <div class="row-fluid controls-row" style="display:none;">
            <fc:textField data-bind="value:geometry().uncertainty, enable: hasCoordinate()" outerClass="span4" label="Uncertainty"/>
            <fc:textField data-bind="value:geometry().precision, enable: hasCoordinate()" outerClass="span4" label="Precision"/>
            <fc:textField data-bind="value:geometry().datum, enable: hasCoordinate()" outerClass="span4" label="Datum" placeholder="e.g. WGS84"/>
        </div>
    </div>
</div>
</script>

<script type="text/html" id="pid">
<div id="pidLocationDiv" class="drawLocationDiv row-fluid">
    <div class="span12">
        <select data-bind="
            options: layers(),
            optionsCaption:'Choose a layer...',
            optionsValue: 'id',
            optionsText:'name',
            value: chosenLayer,
            event: { change: refreshObjectList }"></select>
        <select data-bind="options: layerObjects, disable: layerObjects().length == 0,
            optionsCaption:'Choose shape ...',
            optionsValue: 'pid',
            optionsText:'name', value: layerObject, event: { change: updateSelectedPid }"></select>
        <div class="row-fluid controls-row" style="display:none;">
            <span class="label label-success">PID</span> <span data-bind="text:geometry().pid"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Name</span> <span data-bind="text:geometry().name"></span>
        </div>
        <div class="row-fluid controls-row" style="display:none;">
            <span class="label label-success">LayerID</span> <span data-bind="text:geometry().fid"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Layer</span> <span data-bind="text:geometry().layerName"></span>
        </div>
        <div class="row-fluid controls-row">
            <span class="label label-success">Area (km&sup2;)</span> <span data-bind="text:geometry().area"></span>
        </div>
    </div>
</div>
</script>

<script type="text/html" id="upload">
    <h3> Not implemented - waiting on web services...</h3>
</script>

<script type="text/html" id="drawn">
<div id="drawnLocationDiv" class="drawLocationDiv row-fluid">
    <div class="span12">

        <div class="row-fluid controls-row" style="display:none;">
            <span class="label label-success">Type</span> <span data-bind="text:geometry().type"></span>
        </div>
        <div class="row-fluid controls-row" data-bind="visible: geometry!=null && geometry().areaKmSq!=null && geometry().areaKmSq != '' ">
            <span class="label label-success">Area (km&sup2;)</span> <span data-bind="text:geometry().areaKmSq"></span>
        </div>

        <div class="row-fluid controls-row gazProperties" data-bind="visible: geometry!=null && geometry().state!=null && geometry().state!=''">
            <span class="label label-success">State/territory</span> <span data-bind="text:geometry().state"></span>
        </div>

        <div class="row-fluid controls-row gazProperties" data-bind="visible: geometry!=null && geometry().lga!=null && geometry().lga!=''">
            <span class="label label-success">Local Gov. Area</span> <span data-bind="text:geometry().lga"></span>
        </div>

        <div class="row-fluid controls-row gazProperties">
            <span class="label label-success">NRM</span> <span data-bind="text:geometry().nrm"></span>
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
    %{--<div class="smallMap span8" style="width:500px;height:300px;"></div>--}%
</div>
</script>

<r:script>
    var viewModel = null;
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
        <g:if test="${project}">
        projectList : ['${project.projectId}'],
        </g:if>
        <g:else>
        projectList : ${projectList?:'[]'},
        </g:else>
        sitePageUrl : "${createLink(action: 'index', id: site?.siteId)}",
        homePageUrl : "${createLink(controller: 'home', action: 'index')}",
        drawSiteUrl : "${createLink(controller: 'site', action: 'draw')}",
        ajaxUpdateUrl: "${createLink(action: 'ajaxUpdate', id: site?.siteId)}",
        siteData: $.parseJSON('${json}'),
        checkForState: ${params.checkForState?:'false'},
        spatialService: '${grailsApplication.config.spatial.layersUrl}',
        spatialWms: '${grailsApplication.config.spatial.geoserverUrl}'
    };

    var savedSiteData = {
        id: "${site?.id}",
        name : "${site?.name}",
        externalId : "${site?.externalId}",
        type : "${site?.type}",
        extent: ${site?.extent?:'null'},
        poi: ${site?.poi?:'[]'},
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

    function refreshGazInfo(){

        if(viewModel.extent().geometry().centre == undefined){
            return;
        }

        var lat = viewModel.extent().geometry().centre()[1];
        var lng = viewModel.extent().geometry().centre()[0];

        //state
        $.ajax({
            url: SERVER_CONF.spatialService + "/intersect/cl22/"+lat+"/"+lng,
            dataType: "jsonp",
            async: false
        })
        .done(function(data) {
          if(data.length > 0){
              console.log('Setting state - ' + data[0].value);
              viewModel.extent().geometry().state(data[0].value);
          } else {
            console.log('Unable to retrieve the state - ' + data);
          }
        });

        //do the google geocode lookup
        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + lng + "&sensor=true",
            async: false
        })
        .done(function(data) {
            if(data.results.length > 0){
              console.log('Setting locality - ' + data.results[0].formatted_address);
              viewModel.extent().geometry().locality(data.results[0].formatted_address);
            }
        });

        //
        $.ajax({
            url: SERVER_CONF.spatialService + "/intersect/cl959/"+lat+"/"+lng,
            dataType:"jsonp",
            async:false
        })
        .done(function(data) {
          if(data.length > 0){
              console.log('Setting lga - ' + data[0].value);
              viewModel.extent().geometry().lga(data[0].value);
          }
        });

        $.ajax({
            url: SERVER_CONF.spatialService + "/intersect/cl916/"+lat+"/"+lng,
            dataType:"jsonp",
            async:false
        })
        .done(function(data) {
          if(data.length > 0){
              console.log('Setting nrm - ' + data[0].value);
              viewModel.extent().geometry().nrm(data[0].value);
          }
        });
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
            self.geometry = ko.observable({
                type: ko.observable(exists(l,'type')),
                centre: ko.observable(exists(l,'centre')),
                radius: ko.observable(exists(l,'radius')),
                lga: ko.observable(exists(l,'lga')),
                state: ko.observable(exists(l,'state')),
                locality: ko.observable(exists(l,'locality')),
                nrm: ko.observable(exists(l,'nrm')),
                areaKmSq: ko.observable(exists(l,'areaKmSq')),
                coordinates: ko.observable(exists(l,'coordinates'))
            });
            self.updateGeom = function(l){
                self.geometry().type(exists(l,'type')),
                self.geometry().centre(exists(l,'centre')),
                self.geometry().lga(exists(l,'lga')),
                self.geometry().nrm(exists(l,'nrm')),
                self.geometry().radius(exists(l,'radius')),
                self.geometry().state(exists(l,'state')),
                self.geometry().locality(exists(l,'locality')),
                self.geometry().areaKmSq(exists(l,'areaKmSq')),
                self.geometry().coordinates(exists(l,'coordinates'))
            };
            self.renderMap = function(elements){
                console.log('Rendering map called...');
                clearObjects();
                var $drawLocationDiv = $(elements[1]);
                if(self.geometry() != null && self.geometry().centre !== undefined){
                    $drawLocationDiv.find('.propertyGroup').css('display','none');
                    //clone the object to avoid side affects with mapping
                    switch (self.geometry().type) {
                        case 'Polygon': $drawLocationDiv.find('.polygonProperties').css('display','block'); break;
                        case 'Circle': $drawLocationDiv.find('.circleProperties').css('display','block'); break;
                        case 'Rectangle': $drawLocationDiv.find('.rectangleProperties').css('display','block'); break;
                    }
                }
            }
        };

        var PidLocation = function (l) {
            var self = this;
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
                console.log('Refreshing the layer object list for ' + self.chosenLayer());
                self.layerObjects([]);
                if(self.chosenLayer() !== undefined){
                    $.ajax({
                        url: SERVER_CONF.spatialService + '/objects/' + this.chosenLayer(),
                        dataType:'jsonp'
                    }).done(function(data) {
                        self.layerObjects(data);
                        console.log('Refresh complete. Objects:' + data.length);
                    });
                } else {
                    console.log('Refreshing the layer object list - no layer currently selected...');
                }
            }
            //TODO load this from config
            self.layers = ko.observable([
                {id:'cl916', name:'NRM'},
                {id:'cl1048', name:'IBRA 7 Regions'},
                {id:'cl1049', name:'IBRA 7 Subregions'},
                {id:'cl22',name:'Australian states'},
                {id:'cl959', name:'Local Gov. Areas'}
            ]);
            self.chosenLayer = ko.observable(exists(l,'fid'));
            self.layerObjects = ko.observable([]);
            self.layerObject = ko.observable(exists(l,'pid'));
            self.updateGeom = function(l){
                //to be added
            };
            self.renderMap = function(){
                console.log("Render map on PidLocation called...with PID id:" + self.geometry().pid())
                if(self.geometry().pid() != null && self.geometry().pid() != '' ){
                    console.log("Rendering PID: " + self.geometry().pid());
                    clearObjectsAndShapes();
                    showObjectOnMap(self.geometry().pid());
                }
            }
            self.setCurrentPID = function(){
                self.refreshObjectList();
                console.log('Refreshing the layer object list for ' + self.chosenLayer());
                self.layerObjects([]);
                if(self.chosenLayer() !== undefined){
                    $.ajax({
                        url: SERVER_CONF.spatialService + '/objects/' + this.chosenLayer(),
                        dataType:'jsonp'
                    }).done(function(data) {
                        self.layerObjects(data);
                        console.log('Refresh complete. Objects:' + data.length);
                        self.layerObject(self.geometry().pid())
                    });
                } else {
                    console.log('Refreshing the layer object list - no layer currently selected...');
                }
            }
            self.updateSelectedPid = function(elements){
                if(self.layerObject() !== undefined){
                    self.geometry().pid(self.layerObject())
                    self.geometry().fid(self.chosenLayer())

                    //additional metadata required from service layer
                    $.ajax({
                        url: SERVER_CONF.spatialService + '/object/' + self.layerObject(),
                        dataType:'jsonp'
                    }).done(function(data) {
                        console.log('Retrieving details of ' + self.layerObject());
                        self.layerObject(self.geometry().pid())
                        self.geometry().name(data.name)
                        self.geometry().layerName(data.fieldname)
                        if(data.area_km !== undefined){
                            console.log("Selected shape area: " + data.area_km);
                            self.geometry().area(data.area_km)
                        }
                        self.renderMap();
                    });
                }
            }
            self.toJSON = function(){
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
            self.renderMap = function(){}
        };

        var UploadLocation = function (l) {
            this.source = ko.observable('upload');
            this.geometry = ko.observable();
            self.renderMap = function(){}
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
               datum: ko.observable(exists(l,'datum')),
               nrm: ko.observable(exists(l,'nrm')),
               state: ko.observable(exists(l,'state')),
               lga: ko.observable(exists(l,'lga')),
               locality: ko.observable(exists(l,'locality'))
            });
            self.hasCoordinate = function () {
                var hasCoordinate = self.geometry().decimalLatitude() !== undefined
                    && self.geometry().decimalLatitude() !== ''
                    && self.geometry().decimalLongitude() !== undefined
                    && self.geometry().decimalLongitude() !== '';
                return hasCoordinate;
            }
            self.renderMap = function(){
                if(self.hasCoordinate()){
                    console.log('Rendering the point');
                    //addMarker(self.geometry().decimalLatitude(), self.geometry().decimalLongitude(), 'Extent of site');
                    showOnMap('point', self.geometry().decimalLatitude(), self.geometry().decimalLongitude(),'Extent of site');
                    zoomToShapeBounds();
                    showSatellite();
                }
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

        var POI = function (l) {
            var self = this;
            self.name = ko.observable(exists(l,'name'));
            self.type = ko.observable(exists(l,'type'));

            var storedGeom;
            if(l !== undefined){
                storedGeom = l.geometry;
            }
            self.dragEvent = function(lat,lng){
                console.log("New lat lng " + lat + ", " + lng);
                self.geometry().decimalLatitude(lat);
                self.geometry().decimalLongitude(lng);
            }
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
                if(hasCoordinate){
                    //removeMarkers();
                   viewModel.renderPOIs();
                }
                return hasCoordinate;
            }
            self.toJSON = function(){
                var js = ko.toJS(self);
                if(js.geometry.decimalLatitude !== undefined
                    && js.geometry.decimalLatitude !== ''
                    && js.geometry.decimalLongitude !== undefined
                    && js.geometry.decimalLongitude !== ''){
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
            self.poi = ko.observableArray([]);
            self.renderPOIs = function(){
               // console.log('Rendering the POIs now');
                removeMarkers();
                for(var i=0; i<self.poi().length; i++){
                    //console.log('Rendering the POI: ' + self.poi()[i].geometry().decimalLatitude() +':'+ self.poi()[i].geometry().decimalLongitude());
                    addMarker(self.poi()[i].geometry().decimalLatitude(), self.poi()[i].geometry().decimalLongitude(), self.poi()[i].name(), self.poi()[i].dragEvent)
                }
            }
            self.addPOI = function(){
                //get the center of the map
                var lngLat = getMapCentre();
                var randomBit = (self.poi().length + 1) /1000;
                self.poi.push(new POI({name:'Point of interest #' + (self.poi().length + 1) , geometry:{decimalLongitude:lngLat[0] - (0.001+randomBit),decimalLatitude:lngLat[1] - (0.001+randomBit)}}));
                self.renderPOIs();
            }
            self.removePOI = function(){
                self.poi.remove(this);
                self.renderPOIs();
            }
            self.saved = function(){
                return self.id() != '';
            };
            self.toJSON = function(){
                var js = ko.toJS(self);
                delete js.drawnShape;
                delete js.projectList;
                return js;
            }
            self.loadExtent = function(){
                console.log('Loading the extent.....');
                var geometry;
                if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                    var extent = SERVER_CONF.siteData.extent;
                    console.log('Loading the extent source.....' + extent.source);
                    console.log(extent.geometry);
                    switch (extent.source) {
                        case 'point':   self.extent(new PointLocation(extent.geometry)); break;
                        case 'pid':     self.extent(new PidLocation(extent.geometry)); break;
                        case 'upload':  self.extent(new UploadLocation()); break;
                        case 'drawn':   self.extent(new DrawnLocation(extent.geometry)); break;
                    }
                    console.log('Setting the extent .....' + extent);
                } else {
                    console.log('Initialising dummy extent....');
                    self.extent(new EmptyLocation());
                }
            };
            self.setDrawnExtent = function(geometry){
                self.extent(new DrawnLocation(geometry));
            }
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
                    case 'pid':
                        if(SERVER_CONF.siteData !=null && SERVER_CONF.siteData.extent != null) {
                           self.extent(new PidLocation(SERVER_CONF.siteData.extent.geometry));
                        } else {
                           self.extent(new PidLocation({}));
                        }
                        break;
                    case 'upload': self.extent(new UploadLocation({})); break;
                    case 'drawn':
                        //breaks the edits....
                        self.extent(new DrawnLocation({}));
                        break;
                    default: self.extent(new EmptyLocation());
                }
                return self.extent().source();
            };
            self.loadPOI = function () {
                if(SERVER_CONF.siteData != null && SERVER_CONF.siteData.poi != NaN && SERVER_CONF.siteData.poi !== undefined){
                    $.each(SERVER_CONF.siteData.poi, function (i, poi) {
                        self.poi.push(new POI(poi));
                    });
                }
            };
            self.addDrawnLocation = function(drawnShape, gazInfo){
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
        viewModel = new SiteViewModel(savedSiteData);

        ko.applyBindings(viewModel);

        init_map({
            spatialService: SERVER_CONF.spatialService,
            spatialWms: SERVER_CONF.spatialWms,
            mapContainer: 'mapForExtent'
        });

        viewModel.loadExtent();
        viewModel.loadPOI();

        //render POIs
        viewModel.renderPOIs();

        // this sets the function to call when the user draws a shape
        setCurrentShapeCallback(shapeDrawn);

        //render the shape that is store if it exists
        if(SERVER_CONF.siteData != null && SERVER_CONF.siteData.extent != undefined && SERVER_CONF.siteData.extent.geometry != null){
            renderSavedShape(SERVER_CONF.siteData.extent.geometry);
        }
    });

    var DRAW_TOOL = {
        drawnShape : null
    }

    function renderSavedShape(currentDrawnShape){
        //retrieve the current shape if exists
        %{--var currentDrawnShape = viewModel.extent().geometry();--}%
        %{--console.log('Retrieved shape: ' + currentDrawnShape);--}%
        console.log(currentDrawnShape);

        if(currentDrawnShape !== undefined){
            if(currentDrawnShape.type == 'Polygon'){
                console.log('Redrawing polygon');
                showOnMap('polygon', geoJsonToPath(currentDrawnShape));
                zoomToShapeBounds();
            } else if(currentDrawnShape.type == 'Circle'){
                console.log('Redrawing circle');
                showOnMap('circle', currentDrawnShape.coordinates[1],currentDrawnShape.coordinates[0],currentDrawnShape.radius);
                zoomToShapeBounds();
            } else if(currentDrawnShape.type == 'Rectangle'){
                console.log('Redrawing rectangle');
                var shapeBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(currentDrawnShape.minLat,currentDrawnShape.minLon),
                    new google.maps.LatLng(currentDrawnShape.maxLat,currentDrawnShape.maxLon)
                );
                //render on the map
                showOnMap('rectangle', shapeBounds);
                zoomToShapeBounds();
            } else if(currentDrawnShape.type == 'pid'){
                console.log('Loading the PID...' + currentDrawnShape.pid);
                showObjectOnMap(currentDrawnShape.pid);
                viewModel.extent().setCurrentPID();
            } else if(currentDrawnShape.type == 'Point'){
                console.log('Loading the point...' + currentDrawnShape.pid);
                showOnMap('point', currentDrawnShape.decimalLatitude, currentDrawnShape.decimalLongitude,'site name');
                zoomToShapeBounds();
                showSatellite();
                //addMarker(currentDrawnShape.decimalLatitude,currentDrawnShape.decimalLongitude);
            }
        }
    }

    function setPageValues(){}

    function clearSessionData(){}

    function clearData() {
        $('#drawnArea > div').css('display','none');
        $('#drawnArea input').val("");
        $('#wkt').val("");
        $('#circleLat').val("");
        $('#circleLon').val("");
        $('#circleRadius').val("");
    }

    function shapeDrawn(source, type, shape) {
        console.log("[shapeDrawn] shapeDrawn called: " + type);
        if (source === 'clear') {
            DRAW_TOOL.drawnShape = null;
            clearData();
            clearSessionData('drawnShapes');
            $('#useLocation').addClass("disabled");
        } else {
            $('#useLocation').removeClass("disabled");
            switch (type) {
                case google.maps.drawing.OverlayType.CIRCLE:
                    /*// don't show or set circle props if source is a locality
                     if (source === "user-drawn") {*/
                    var center = shape.getCenter();
                    // set coord display
                    $('#circLat').val(round(center.lat()));
                    $('#circLon').val(round(center.lng()));
                    $('#circRadius').val(round(shape.getRadius()/1000,2) + "km");
                    $('#circleArea').css('display','block');
                    // set hidden inputs
                    $('#circleLat').val(center.lat());
                    $('#circleLon').val(center.lng());
                    $('#circleRadius').val(shape.getRadius());
                    console.log("circle lat: " + center.lat());
                    console.log("circle lng: " + center.lng());
                    console.log("circle radius: " + shape.getRadius());

                    var calcAreaKm = ((3.14 * shape.getRadius() * shape.getRadius())/1000)/1000;
                    $('#calculatedArea').html(calcAreaKm);
                    //calculate the area
                    DRAW_TOOL.drawnShape = {
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
                    // set coord display
                    $('#swLat').val(round(sw.lat()));
                    $('#swLon').val(round(sw.lng()));
                    $('#neLat').val(round(ne.lat()));
                    $('#neLon').val(round(ne.lng()));
                    $('#rectangleArea').css('display','block');

                    //calculate the area
                    var mvcArray = new google.maps.MVCArray();
                    mvcArray.push(new google.maps.LatLng(sw.lat(), sw.lng()));
                    mvcArray.push(new google.maps.LatLng(ne.lat(), sw.lng()));
                    mvcArray.push(new google.maps.LatLng(ne.lat(), ne.lng()));
                    mvcArray.push(new google.maps.LatLng(sw.lat(), ne.lng()));
                    mvcArray.push(new google.maps.LatLng(sw.lat(), sw.lng()));

                    var calculatedArea = google.maps.geometry.spherical.computeArea(mvcArray);
                    var calcAreaKm = ((calculatedArea)/1000)/1000;
                    $('#calculatedArea').html(calcAreaKm);

                    var centreY = (sw.lat() + ne.lat())/2;
                    var centreX =  (sw.lng() + ne.lng())/2;

                    DRAW_TOOL.drawnShape = {
                        type: 'Polygon',
                        userDrawn: 'Rectangle',
                        coordinates:[[
                            [sw.lng(),sw.lat()],
                            [sw.lng(),ne.lat()],
                            [ne.lng(),ne.lat()],
                            [ne.lng(),sw.lat()],
                            [ne.lng(),sw.lat()]
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
                    var path,
                            $lat = null,
                            $ul = $('#polygonArea ul'),
                            realLength = 0,
                            isRect;

                    if(shape.getPath()){
                        path = shape.getPath();
                    } else {
                        path = shape;
                    }

                    isRect = representsRectangle(path);

                    // set coord display
                    if (isRect) {
                        $('#swLat').val(round(path.getAt(0).lat()));
                        $('#swLon').val(round(path.getAt(0).lng()));
                        $('#neLat').val(round(path.getAt(2).lat()));
                        $('#neLon').val(round(path.getAt(2).lng()));
                        $('#rectangleArea').css('display','block');
                    } else {
                        $ul.find('li').remove();
                        realLength = path.getLength();
                        if (path.getAt(0).equals(path.getAt(path.length - 1))) {
                            realLength = realLength - 1;
                        }
                        for (i = 0; i < realLength; i++) {
                            // check whether widget exists
                            $lat = $('#lat' + i);
                            if ($lat.length === 0) {
                                // doesn't so create it
                                $lat = $('<li><input type="text" id="lat' + i +
                                        '"/><input type="text" id="lon' + i + '"/></li>')
                                        .appendTo($ul);
                            }
                            $('#lat' + i).val(round(path.getAt(i).lat()));
                            $('#lon' + i).val(round(path.getAt(i).lng()));
                        }
                        $('#polygonArea').css('display','block');
                    }

                    //calculate the area
                    var calculatedAreaInSqM = google.maps.geometry.spherical.computeArea(path);
                    var calcAreaKm = ((calculatedAreaInSqM)/1000)/1000;

                    $('#calculatedArea').html(calcAreaKm);

                    //get the centre point of a polygon ??
                    var minLat=90,
                            minLng=180,
                            maxLat=-90,
                            maxLng=-180;

                    $.each(path, function(i){
                      //console.log(path.getAt(i));
                      var coord = path.getAt(i);
                      if(coord.lat()>maxLat) maxLat = coord.lat();
                      if(coord.lat()<minLat) minLat = coord.lat();
                      if(coord.lng()>maxLng) maxLng = coord.lng();
                      if(coord.lng()<minLng) minLng = coord.lng();
                    });
                    var centreX = minLng + ((maxLng - minLng) / 2);
                    var centreY = minLat + ((maxLat - minLat) / 2);

                    DRAW_TOOL.drawnShape = {
                        type:'Polygon',
                        userDrawn: 'Polygon',
                        coordinates: polygonToGeoJson(path),
                        areaKmSq: calcAreaKm,
                        centre: [centreX,centreY]
                    };
                    break;
            }
        }
        //set the drawn shape
        if(DRAW_TOOL.drawnShape != null){
            // alert('setting drawn shape...');
            amplify.store("drawnShape", DRAW_TOOL.drawnShape);
            viewModel.extent().updateGeom(DRAW_TOOL.drawnShape);
            refreshGazInfo();
        }
    }

    function geoJsonToPath(geojson){
        var coords = geojson.coordinates[0];
        return coordArrayToPath(geojson.coordinates[0]);
    }

    function coordArrayToPath(coords){
        var path = [];
        for(var i = 0; i<coords.length; i++){
            console.log(coords[i][1]+" : "+ coords[i][0]);
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
        console.log(coordinates);
        return coordinates;
    }

    function round(number, places) {
        var p = places || 4;
        return places === 0 ? number.toFixed() : number.toFixed(p);
    }

    function representsRectangle(path) {
        // must have 5 points
        if (path.getLength() !== 5) { return false; }
        var arr = path.getArray();
        if ($.isArray(arr[0])) { return false; }  // must be multipolygon (array of arrays)
        if (arr[0].lng() != arr[1].lng()) { return false; }
        if (arr[2].lng() != arr[3].lng()) { return false; }
        if (arr[0].lat() != arr[3].lat()) { return false; }
        if (arr[1].lat() != arr[2].lat()) { return false; }
        return true
    }
</r:script>

</body>
</html>