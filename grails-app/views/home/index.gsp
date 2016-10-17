<%@ page import="grails.converters.JSON; au.org.ala.fieldcapture.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:set var="containerType" scope="request" value="container"/>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Home | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <r:script disposition="head">
    var fcConfig = {
        baseUrl: "${grailsApplication.config.grails.serverURL}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
        viewProjectUrl: "${g.createLink(controller: 'project', action:'index')}",
        dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params: params+[showOrganisations:true])}",%{--// Hack for the announcements report to distinguish it from the report on the org page.--}%
        dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: params+[showOrganisations:true])}"
        };
    </r:script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <r:require modules="knockout,mapWithFeatures,jquery_bootstrap_datatable,js_iso8601,amplify,homepage,datepicker,jqueryValidationEngine"/>
</head>
<body>
<div id="wrapper" class="${containerType}">

    <div class="row-fluid">
        <g:if test="${flash.errorMessage}">
            <div class="${containerType}">
                <div class="alert alert-error">
                    ${flash.errorMessage}
                </div>
            </div>
        </g:if>

        <g:if test="${flash.message}">
            <div class="row-fluid">
                <div class="span6 alert alert-info" style="margin-bottom:0;">
                    <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                    ${flash.message}
                </div>
            </div>
        </g:if>
    </div>

    <div class="row-fluid">
        <div class="span12" id="heading">
            <h1 class="pull-left"><fc:homePageTitle/></h1>
        </div>
    </div>

    <g:render template="projectFinder"/>
</div>


</body>
</html>