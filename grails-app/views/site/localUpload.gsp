<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title> Upload | Sites | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>

    <script>
        var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
                spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
                spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
                spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
                sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
                sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
                saveSitesUrl: "${createLink(action: 'createSitesFromShapefile')}",
                siteUploadProgressUrl: "${createLink(action: 'siteUploadProgress')}",
                cancelSiteUploadUrl: "${createLink(action:'cancelSiteUpload')}"

            },
            returnTo = "${params.returnTo}";
    </script>
    <asset:stylesheet src="site-bs4.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item">Sites</li>
            <li class="breadcrumb-item active">Upload Sites</li>
        </ol>
    </div>
</div>

<div class="${containerType}">
    <input data-bind="event: {change: fileAttached}" type="file" accept="*/*" class="fileChooser">
    <div class="row">
        <div class="col-md-9">
            <div id="map" style="width:100%"></div>
        </div>
        <div class="col-md-3">
            <!-- ko foreach:shapes -->
            <div class="row">
                <div class="col-md-6">
                    <input type="text" data-bind="value:name">
                </div>
                <div class="col-md-3">
                    <span data-bind="text:size"></span>
                </div>
            </div>
            <!-- /ko -->
        </div>
    </div>


</div>
<asset:javascript src="sites.js"/>
<asset:javascript src="vendor-bundle.js"/>
<asset:javascript src="vendor.css"/>

<asset:javascript src="site-bundle.js"/>

<asset:deferredScripts/>
</body>
</html>