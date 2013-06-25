<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
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
    #map-canvas img {
        max-width: none;
    }

    #drawnArea ul {
        list-style: none;
    }

  </style>
  <r:require modules="knockout,jquery_ui,amplify"/>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&libraries=drawing"></script>
  <r:require modules="drawmap"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <g:if test="${create}">
            <li class="active">Create</li>
        </g:if>
        <g:else>
            <li>
                <g:link controller="site" action="index" id="${site?.siteId}">
                    <span data-bind="text: name">${site?.name?:'New site'}</span>
                </g:link>
                <span class="divider">/</span>
            </li>
            <li class="active">Draw location</li>
        </g:else>
    </ul>
    <div class="container-fluid">
      <div class="row-fluid clearfix">
          <div class="span8">
            <div id="map-canvas" style="width:100%;height:500px;"></div>
          </div>
          <div id="sidebarContent" class="span4 well well-small">
            <h2>Draw location</h2>
            <div id="map-controls">
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
                </ul>
                <div id="drawnArea">
                    <div id="circleArea">
                        <span class="drawnAreaName">Circle</span><br/>
                        <ul>
                            <li><label for="circLat">Lat:</label><input type="text" id="circLat"/></li>
                            <li><label for="circLon">Lon:</label><input type="text" id="circLon"/></li>
                            <li><label for="circRadius">Radius:</label><input type="text" id="circRadius"/></li>
                        </ul>
                    </div>
                    <div id="rectangleArea">
                        <span class="drawnAreaName">Rectangle</span><br/>
                        <ul>
                            <li><label for="swLat">SW Lat:</label><input type="text" id="swLat"/></li>
                            <li><label for="swLon">SW Lon:</label><input type="text" id="swLon"/></li>
                            <li><label for="neLat">NE Lat:</label><input type="text" id="neLat"/></li>
                            <li><label for="neLon">NE Lon:</label><input type="text" id="neLon"/></li>
                        </ul>
                    </div>
                    <div id="polygonArea">
                        <span class="drawnAreaName">Polygon (lat | lon)</span><br/>
                        <ul>
                            <li><input type="text" id="lat0"/><input type="text" id="lon0"/></li>
                            <li><input type="text" id="lat1"/><input type="text" id="lon1"/></li>
                            <li><input type="text" id="lat2"/><input type="text" id="lon2"/></li>
                        </ul>
                    </div>
                </div>
                <a id="useLocation" href="javascript:void(0);" class="btn btn-primary disabled">Use location</a>
                <a href="${params.returnTo?:createLink([controller:'home',action:'index'])}" class="btn">Cancel</a>
            </div>
          </div>
      </div>
<script>

    var drawnShape = null;

    function Circle (lat,lon,radius) {
        var self = this;
        self.type = 'circle';
        self.radius = radius;
        self.decimalLatitude = lat;
        self.decimalLongitude = lon;
    }

    function Polygon (wkt) {
        var self = this;
        self.type = 'polygon';
        self.wkt = wkt;
    }

    $(function () {
        // create map and controls
        init_map({
            spatialService: 'http://spatial.ala.org.au/layers-service',
            spatialWms: 'http://spatial.ala.org.au/geoserver/ALA/wms?',
            spatialCache: 'http://spatial.ala.org.au/geoserver/gwc/service/wms?',
            mapContainer: 'map-canvas'
        });

        // this sets the function to call when the user draws a shape
        setCurrentShapeCallback(shapeDrawn);

        // set search criteria and results from any stored data
        if (window.sessionStorage) {
            setPageValues();
        }

        $('#useLocation').click(function(){
           console.log('Storing drawn shape....');
            console.log(drawnShape);
           amplify.store("drawnShape",drawnShape);
           document.location.href = "${params.returnTo}";
        });

        // wire search button
        $('#searchButton').click( function () {
            search();
        });

        // wire clear button
        $('#clearButton').click( function () {
            clearSessionData();
            document.location.href = "/";
        });

        // wire show query toggle
        $('#drawnArea > div').css('display','none');

        // wire simple/advanced toggle and set initial state
        var advanced = window.sessionStorage ? window.sessionStorage.getItem('advancedSearch') : false;
    });

    function setPageValues(){

//        // user-drawn polygon or rectangle
//        if (queryParams.wkt) {
//            showOnMap('wkt', queryParams.wkt);
//        }
//
//        // user-drawn circle
//        if (queryParams.lat && queryParams.lon && queryParams.radius) {
//            showOnMap('circle', queryParams.lat, queryParams.lon, queryParams.radius);
//        }
//
//        var radius = window.sessionStorage.getItem('radius');
//        if (radius) {
//            locationWidgets.setRadius(radius);
//        }
    }

    function clearSessionData(){
    }

    function clearData() {
        $('#drawnArea > div').css('display','none');
        $('#drawnArea input').val("");
        $('#wkt').val("");
        $('#circleLat').val("");
        $('#circleLon').val("");
        $('#circleRadius').val("");
    }

    function shapeDrawn(source, type, shape) {
        console.log("shape drawn: " + type);
        if (source === 'clear') {
            shapeDrawn = null;
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
                    drawnShape = new Circle(center.lat(), center.lng(),shape.getRadius());
                    /*}*/
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
                    // set hidden inputs
                    $('#wkt').val(rectToWkt(sw, ne));
                    drawnShape = new Polygon(rectToWkt(sw, ne));
                    break;
                case google.maps.drawing.OverlayType.POLYGON:
                    /*
                     * Note that the path received from the drawing manager does not end by repeating the starting
                     * point (number coords = number vertices). However the path derived from a WKT does repeat
                     * (num coords = num vertices + 1). So we need to check whether the last coord is the same as the
                     * first and if so ignore it.
                     */
                    var path = shape.getPath(),
                            $lat = null,
                            $ul = $('#polygonArea ul'),
                            realLength = 0,
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
                    // set hidden inputs
                    $('#wkt').val(polygonToWkt(path));
                    drawnShape = new Polygon(polygonToWkt(path));
                    break;
            }
        }
    }

    function rectToWkt(sw, ne) {
        var swLat = sw.lat(),
                swLng = sw.lng(),
                neLat = ne.lat(),
                neLng = ne.lng(),
                wkt = "POLYGON((";
        wkt += swLng + " " + swLat + ',' +
                swLng + " " + neLat + ',' +
                neLng + " " + neLat + ',' +
                neLng + " " + swLat + ',' +
                swLng + " " + swLat;

        return wkt + "))";
    }

    function polygonToWkt(path) {
        var wkt = "POLYGON((",
                firstPoint = path.getAt(0),
                points = [];
        path.forEach(function (obj, i) {
            points.push(obj.lng() + " " + obj.lat());
        });
        // a polygon array from the drawingManager will not have a closing point
        // but one that has been drawn from a wkt will have - so only add closing
        // point if the first and last don't match
        if (!firstPoint.equals(path.getAt(path.length -1))) {
            // add first points at end
            points.push(firstPoint.lng() + " " + firstPoint.lat());
        }
        wkt += points.join(',') + "))";
        //console.log(wkt);
        return wkt;
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
</script>

</body>

</html>