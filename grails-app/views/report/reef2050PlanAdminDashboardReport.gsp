<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}&libraries=visualization"></script>
    <script>
        fcConfig = {
            baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
            spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
            spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
            sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
            sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
            viewProjectUrl: "${g.createLink(controller: 'project', action:'index')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params: params+[showOrganisations:true])}",%{--// Hack for the announcements report to distinguish it from the report on the org page.--}%
            dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: params+[showOrganisations:true])}"
        };
    </script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="homepage.css"/>

    <title>Reef 2050 Plan Action Reporting</title>

</head>

<body>
<div class="container-fluid">

    <asset:javascript src="common-bs4.js"/>
    <asset:javascript src="projectExplorer.js"/>
    <asset:javascript src="reef2050Report.js"/>

    <asset:deferredScripts/>

    <g:render template="reef2050PlanActionSelectionReport"/>
</div>



</body>
</html>
