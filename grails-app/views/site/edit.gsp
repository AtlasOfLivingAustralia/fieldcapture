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

            <div class="row-fluid">
                <h2>Locations <fc:iconHelp title="Location of the site">The location of the site can be represented one or more points or polygons.
                     KML, WKT and shape files are supported for uploading polygons. As are PID's of existing features in the Atlas Spatial Portal.</fc:iconHelp>
                </h2>
                <table class="table">
                    <caption>You can have any number of points and areas to describe the locations of this site.</caption>
                    <thead>
                        <th class="span1">name</th><th class="span1">type</th><th class="span10">values</th>
                    </thead>
                    <tbody data-bind="foreach: location">
                        <tr>
                            <td>
                                <input type="text" data-bind="value:name" class="input-small"/>
                            </td>
                            <td>
                                <g:select data-bind="value: type"  from="['choose a location type','point','known shape','upload a shape','draw a shape']" name='shit'
                                          keys="['locationTypeNone','locationTypePoint','locationTypePid','locationTypeUpload','locationTypeDrawn']"/>
                            </td>
                            <td>
                                <div data-bind="template: {name: updateModel(), data: data,  afterRender: myPostProcessingLogic}"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="no-border">
                                <button data-bind="click: $root.removeLocation" type="button" class="btn btn-link">Remove</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" class="btn" data-bind="click:addEmptyLocation">Add another location</button>
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
        <div class="debug">
            <h3 id="debug"><a href="javascript:void(0);">Debug</a></h3>
            <div style="display: none">
                Model: <pre data-bind="text: ko.toJSON($root)"></pre>
                Site : <pre>Site : ${site}</pre>
            </div>
        </div>
    </div>

<!-- templates -->
<script type="text/html" id="locationTypeNone">
    <span>Choose a type</span>
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
    <fc:textField data-bind="value:pid" class="input-small" label="Pid:"/>
</script>

<script type="text/html" id="locationTypeUpload">
    <fc:textField  class="input-small" label="File:"/>
    <span>Not implemented yet</span>
</script>

<script type="text/html" id="locationTypeDrawn">
<div class="drawLocationDiv row-fluid">
    <div class="span6">
        %{--<a href="javascript:drawSite();">Draw the location</a><br/>--}%

        <button class="btn" data-bind="click: drawSiteClick">Draw the location</button>

        <div class="row-fluid controls-row">
            <fc:textField data-bind="value:shapeType" outerClass="span2" label="ShapeType:"/>
        </div>

        <div class="row-fluid controls-row propertyGroup">
            <fc:textField data-bind="value:area" outerClass="span2" label="Area:"/>
            <fc:textField data-bind="value:state" outerClass="span2" label="State:"/>
            <fc:textField data-bind="value:lga" outerClass="span2" label="LGA:"/>
        </div>

        <div class="row-fluid controls-row circleProperties propertyGroup">
            <fc:textField data-bind="value:decimalLatitude" outerClass="span2" label="Latitude:"/>
            <fc:textField data-bind="value:decimalLongitude" outerClass="span2" label="Longitude:"/>
            <fc:textField data-bind="value:radius" outerClass="span2" label="Radius:"/>
        </div>
        <div class="row-fluid controls-row polygonProperties propertyGroup">
            <fc:textArea cols="80" rows="4" data-bind="value:wkt" class="input-large " label="Well Known Text (WKT):"/>
            <span style="display:none;">
                <fc:textArea cols="80" rows="4" data-bind="value:geojson" class="input-large" label="GeoJson :"/>
            </span>
        </div>
        <div class="row-fluid controls-row rectangleProperties propertyGroup">
            <fc:textField data-bind="value:minLat" outerClass="span2" label="minLat:"/>
            <fc:textField data-bind="value:minLon" outerClass="span2" label="minLon:"/>
            <fc:textField data-bind="value:maxLat" outerClass="span2" label="maxLat:"/>
            <fc:textField data-bind="value:maxLon" outerClass="span2" label="maxLon:"/>
        </div>
    </div>
    <div class="smallMap span6" style="width:400px;height:200px;"></div>
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
        area : "${site?.area}",
        description : "${site?.description}",
        notes : "${site?.notes}",
        projects : ${site?.projects?:'[]'}
    };

    var viewModel = null;

    function drawSite(){


    }

    // returns blank string if the property is undefined, else the value
    function orBlank(v) {
        return v === undefined ? '' : v;
    }

    // returns blank string if the object or the specified property is undefined, else the value
    function exists(parent, prop) {
        return parent === undefined ? '' : (parent[prop] === undefined ? '' : parent[prop]);
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

            this.area = ko.observable('');
            this.lga = ko.observable('');
            this.state = ko.observable('');

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

                console.log('Draw site click....' + this.shapeType());
                document.location.href = SERVER_CONF.drawSiteUrl + '?returnTo=' + SERVER_CONF.pageUrl;
            }
        };

        var PidLocation = function (l) {
            this.pid = ko.observable(exists(l,'pid'));
            this.type = 'locationTypePid';
            this.shapeType = 'pid';
        };

        var UploadLocation = function (l) {
            this.type = 'locationTypeUpload';
        };

        var PointLocation = function (l) {
            var self = this;
            this.type = 'locationTypePoint';
            this.shapeType = 'point';
            this.decimalLatitude = ko.observable(exists(l,'decimalLatitude'));
            this.decimalLongitude = ko.observable(exists(l,'decimalLongitude'));
            this.uncertainty = ko.observable(exists(l,'uncertainty'));
            this.precision = ko.observable(exists(l,'precision'));
            this.datum = ko.observable(exists(l,'datum'));
            this.hasCoordinate = function () {
                return self.decimalLatitude() !== '' && self.decimalLongitude() !== '';
            }
        };

        var Location = function (id, name, type, data) {
            var self = this;
            this.id = id;
            this.data = data;
            this.name = ko.observable(name);
            this.type = ko.observable(type);
            this.updateModel = function (event) {
                var trev = event;
                var lType = self.type();
                var modelType = self.data ? self.data.type : 'locationTypeNone';
                if (modelType !== self.type()) {
                    switch (self.type()) {
                        case 'locationTypePoint': self.data = new PointLocation(); break;
                        case 'locationTypePid': self.data = new PidLocation(); break;
                        case 'locationTypeUpload': self.data = new UploadLocation(); break;
                        case 'locationTypeDrawn': self.data = new DrawnLocation(); break;
                        default: self.data = {type: 'locationTypeNone'}
                    }
                }
                return self.type();
            }
            this.myPostProcessingLogic = function(elements) {
                console.log(elements);
                var $drawLocationDiv = $(elements[1]);
                var $smallMapDiv = $drawLocationDiv.find('.smallMap');
                console.log($smallMapDiv);
                //initialise a map
                var mapId = makeid();
                $smallMapDiv.attr('id',mapId);
                var mapOptions;
                if(self.data != null && self.data.shapeType() != ''){
                    console.log("The shape type = " + self.data.shapeType());
                    $drawLocationDiv.find('.propertyGroup').css('display','none');

                    if(self.data.shapeType() == 'polygon'){

                        console.log("GEOJSON returned: " + self.data.geojson());
                        mapOptions = {
                            zoomToBounds:false,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:"polygon",
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                geojson:self.data.geojson()
                            }]
                        };
                        $drawLocationDiv.find('.polygonProperties').css('display','block');
                        init_map_with_features({mapContainer: mapId}, mapOptions);
                    } else if(self.data.shapeType() == 'circle'){

                        console.log("Using radius: " + self.data.radius() + ", lat: " + self.data.decimalLatitude() + ", lon: " + self.data.decimalLatitude());
                        mapOptions = {
                            zoomToBounds:false,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:"circle",
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                radius: self.data.radius(),
                                decimalLatitude: self.data.decimalLatitude(),
                                decimalLongitude: self.data.decimalLongitude()
                            }]
                        };
                        $drawLocationDiv.find('.circleProperties').css('display','block');
                        init_map_with_features({mapContainer: mapId}, mapOptions);
                    } else if(self.data.shapeType() == 'rectangle'){
                        mapOptions = {
                            zoomToBounds:false,
                            zoomLimit:16,
                            highlightOnHover:true,
                            features:[{
                                type:"rectangle",
                                name:"ASH-MACC-A - 1 - centre",
                                id:"ASH-MACC-A - 1",
                                minLat: self.data.minLat(),
                                minLon: self.data.minLon(),
                                maxLat: self.data.maxLat(),
                                maxLon: self.data.maxLon()
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
            self.id = ko.observable(siteData.id);
            self.name = ko.observable(siteData.name);
            self.externalId = ko.observable(siteData.externalId);
            self.type = ko.observable(siteData.type);
            self.area = ko.observable(siteData.area);
            self.description = ko.observable(siteData.description);
            self.notes = ko.observable(siteData.notes);
            self.projects = ko.observableArray(siteData.projects);
            self.projectList = SERVER_CONF.projectList;
            self.location = ko.observableArray([]);
            self.saved = function(){
                return self.id() != '';
            };
            self.loadLocations = function () {
                var data;
                if(SERVER_CONF.siteData != null && SERVER_CONF.siteData.location != NaN){
                    $.each(SERVER_CONF.siteData.location, function (i, loc) {
                        switch (loc.type) {
                            case 'locationTypePoint': data = new PointLocation(loc.data); break;
                            case 'locationTypePid': data = new PidLocation(loc.data); break;
                            case 'locationTypeDrawn': data = new DrawnLocation(loc.data); break;
                            default: data = {id: 1};
                        }
                        var temp = new Location(loc.id, loc.name, loc.type, data);
                        self.location.push(temp);
                    });
                }
            };
            self.addDrawnLocation = function(drawnShape){
                self.location.push(new Location('1', 'Drawn shape', 'locationTypeDrawn', new DrawnLocation(drawnShape)));
            };
            self.addLocation = function (id, name, type, loc) {
                var data;
                switch (type) {
                    case 'locationTypePoint': data = new PointLocation(loc); break;
                    case 'locationTypePid': data = new PidLocation(loc); break;
                    case 'locationTypeDrawn': data = new DrawnLocation(loc); break;
                    default: data = {id: 1};
                }
                var temp = new Location(id, name, type, data);
                self.location.push(temp);
                var temp2 = ko.mapping.toJS(self.location);
            };
            self.addEmptyLocation = function () {
                this.location.push(new Location('', '', 'locationTypeNone', null));
            };
            self.removeLocation = function (location) {
                self.location.remove(location);
            };
            self.save = function () {
                var jsData = ko.toJS(self);
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
                        alert(data);
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

        ko.applyBindings(viewModel);

        viewModel.loadLocations();

        //any passed back from drawing tool
        if(SERVER_CONF.checkForState){
            var drawnShape = amplify.store("drawnShape");
            console.log('Loading the amplify stored shape....');
            console.log(drawnShape);
            console.log("GeoJson returned from amplify:  " + drawnShape);
            viewModel.addDrawnLocation(drawnShape);
        }
    });
</r:script>
</body>
</html>