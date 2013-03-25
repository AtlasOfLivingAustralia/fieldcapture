<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <r:script disposition="head">
    var fcConfig = {
        baseUrl: "${grailsApplication.config.grails.serverURL}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
  </r:script>
  <r:require modules="gmap3,projectsMap"/>
</head>
<body>
    <div class="row-fluid">
        <div class="span12" id="header">
            <h1 class="pull-left">Field Capture</h1>
            <form action="search" class="form-search pull-right">
                <div class="control-group">
                    <div class="controls">
                        <g:textField class="search-query input-medium" name="search"/>
                        <button type="submit" class="btn">Search</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="span12" id="banner-image">
            <r:img dir="images" file="banner2.jpg" alt="banner" class="img-rounded"/>
        </div>


        <div class="span2 well no-left-margin" id="sidebar">
            <r:img dir="images" file="survey_clipboard2.png"/>
            <h3>New</h3>
            <ul class="unstyled">
                <li>list of</li>
                <li>the latest</li>
                <li>projects</li>
            </ul>
            <h3>Active</h3>
            <ul class="unstyled">
                <li>list of</li>
                <li>the active</li>
                <li>projects</li>
            </ul>
        </div>

        <div class="span10">
            <h2>Projects</h2>
            <div class="span7 no-left-margin" id="map-container">
                <div id="map" class="gmap"></div>
            </div>
            <div class="span3 well well-small" id="project-list">
                <h3>All projects</h3>
                <div class="accordion" id="project-accordion">
                <g:each in="${projects}" var="p">
                    <div class="accordion-group" data-pid="${p.sitePid}" data-latitude="${p.latitude}" data-longitude="${p.longitude}">
                        <div class="accordion-heading">
                            <a class="accordion-heading" data-toggle="collapse" href="#accord-${p.projectId}"
                               data-parent="#project-accordion">${p.name}</a>
                        </div>
                        <div id="accord-${p.projectId}" class="accordion-body collapse">
                            <div class="accordion-inner">
                                <g:link controller="project" id="${p.projectId}" class="pull-right">Go to project</g:link><br>
                                ${p.description ?: 'no description'}
                            </div>
                        </div>
                    </div>

                </g:each>
                </div>
            </div>
        </div>
    </div>
<r:script>
    $(window).load(function () {
        initMap('div.accordion-group', initMapForProjects);
    });
</r:script>
</body>
</html>