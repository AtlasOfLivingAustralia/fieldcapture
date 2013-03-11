<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <r:script disposition="head">
    var fcConfig = {
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
                    <div class="accordion-group" data-region="${p.region_name}">
                        <div class="accordion-heading">
                            <a class="accordion-heading" data-toggle="collapse" href="#accord-${p.project_id}"
                               data-parent="#project-accordion">${p.project_name}</a>
                        </div>
                        <div id="accord-${p.project_id}" class="accordion-body collapse">
                            <div class="accordion-inner">
                                <g:link controller="project" id="${p.project_id}" class="pull-right">Go to project</g:link><br>
                                ${p.project_description}
                            </div>
                        </div>
                    </div>

                </g:each>
                </div>
            </div>
        </div>

        %{--<r:img dir="images" file="Ivory-Brown-Snake.png"/>--}%
        %{--<div id="banner">
            <r:img dir="images" file="banner-250.png"/>
            Some text here about the role of <strong>FieldCapture</strong>.
        </div>
        <div class="span5">
            Map here.
        </div>
        <div class="span5">
            <h2>Projects</h2>
            <g:each in="${projects}" var="p">
                <ul class="unstyled">
                    <li><g:link controller="project" id="${p.project_id}">${p.project_name}</g:link> (${p.project_id}) - ${p.project_description}</li>
                </ul>
            </g:each>
            New and active projects here.
        </div>--}%
    </div>
</body>
</html>