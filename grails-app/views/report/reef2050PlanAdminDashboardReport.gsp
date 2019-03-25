<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <g:set var="containerType" scope="request" value="container"/>
    <meta name="layout" content="${grailsApplication.config.layout.skin}"/>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <script>
        fcConfig = {
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
    </script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="homepage.css"/>

    <title>Reef 2050 Plan Action Reporting</title>

</head>

<body>
<div class="container-fluid">

    <asset:javascript src="common.js"/>
    <asset:javascript src="projectExplorer.js"/>
    <asset:javascript src="reef2050Report.js"/>

    <asset:deferredScripts/>

    <g:render template="reef2050PlanActionSelectionReport"/>
</div>



</body>
</html>