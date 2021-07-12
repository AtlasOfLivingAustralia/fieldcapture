<%@ page import="grails.converters.JSON; au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:set var="containerType" scope="request" value="container"/>
    <meta name="layout" content="nrm_bs4"/>
    <title>Explore | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}&libraries=visualization"></script>
    <script>
    var fcConfig = {
        baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
        spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
        spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
        sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
        sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
        viewProjectUrl: "${g.createLink(controller: 'project', action:'index')}",
        dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params: params+[showOrganisations:true])}",%{--// Hack for the announcements report to distinguish it from the report on the org page.--}%
        dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: params+[showOrganisations:true])}",
        i18nURL: "${g.createLink(controller: 'home', action: 'i18n')}"
        };
    </script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <asset:stylesheet src="homepage.css"/>
    <asset:stylesheet src="common-bs4.css"/>
</head>
<body>
<div id="wrapper" class="${containerType}">
    <div class="row">
        <g:if test="${flash.errorMessage}">
            <div class="${containerType}">
                <div class="alert alert-error">
                    ${flash.errorMessage}
                </div>
            </div>
        </g:if>

        <g:if test="${flash.message}">
            <div class="row">
                <div class="col-sm-12 alert alert-info" style="margin-bottom:0;">
                    <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                    ${flash.message}
                </div>
            </div>
        </g:if>
    </div>

    <div class="row">
        <div class="col-sm-12" id="heading">
            <h1 class="float-left"><fc:homePageTitle/></h1>
        </div>
    </div>

    <g:render template="projectFinder"/>
</div>

%{--<asset:javascript src="common.js"/>--}%
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projectExplorer.js"/>

<asset:deferredScripts/>
</body>
</html>
