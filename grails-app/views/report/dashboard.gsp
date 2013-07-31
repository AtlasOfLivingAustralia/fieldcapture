<%--
  Created by IntelliJ IDEA.
  User: god08d
  Date: 31/07/13
  Time: 11:34 AM
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Field Capture | Dashboard</title>

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="http://dev.openlayers.org/releases/OpenLayers-2.12/OpenLayers.js" type="text/javascript"></script>
    <link href="http://dev.openlayers.org/releases/OpenLayers-2.12/theme/default/style.css" type="text/css" rel="stylesheet"
          media="screen, projection"/>

    <r:require modules="knockout"/>
    <script src="http://maps.google.com/maps/api/js?key=AIzaSyDAqE0sOMHNienA0zFIUMlY53ztEDiv0d8&sensor=false"
            type="text/javascript"></script>
    <g:javascript src="dashboard.js"></g:javascript>

    <style type="text/css">
    .chart {
        min-width: 220px;
        min-height: 220px;
        border: 3px solid #ccc;
        -moz-border-radius: 20px;
        -webkit-border-radius: 20px;
        border-radius: 20px;
        -icab-border-radius: 20px;
        -khtml-border-radius: 20px;
        padding: 10px 5px 2px 10px;
        background-color: white;
        margin: 10px;
    }

    .chart footer {
        font-size: 0.9em;
    }

    #plantingDataMap {
        height: 450px;
    }
    </style>


</head>
<body>


<div class="container-fluid">
    <h1 class="textcenter">MERI Data Dashboard</h1>


<div class="row-fluid" style="display:none;">
<div class="chart">


    <div id="plantingDataMap" class="span6">
        <h3>Location of plants planted</h3>
        <div ></div>
        <footer>*Marker colours on the map indicate survival rate as defined on the adjacent chart</footer>
    </div>
    <div class="span6">

        <h3>Number of plants planted by survival rate</h3>
        <div id="plantingData" class="span12"></div>
    </div>
</div>
</div>


<div class="row-fluid">
<div class="chart">

    <h3>Number of projects by theme (a single project may target multiple themes)</h3>
    <div id="themeData"></div>
</div>
</div>
<div class="chart">
    <h3>Stakeholder engagement by state</h3>
    <div id="engagementData"></div>
</div>
<div class="chart">
    <h3>Kilometres of fence built by state</h3>
    <div id="fencingData"></div>
</div>
<div class="chart">
    <h3>Target weeds by category</h3>
    <div id="weedsByCategory"></div>
</div>
<div class="chart">
    <h3>Target pest animals by category</h3>
    <div id="pestsByCategory"></div>
</div>
</div>
</body>
</html>