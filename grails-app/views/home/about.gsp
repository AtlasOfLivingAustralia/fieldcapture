<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>About | Field Capture</title>
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
</head>
<body>
    <div id="wrapper" class="container-fluid">
        <div class="row-fluid">
            <div class="span12" id="">
                <h1 class="pull-left">About the website</h1>
            </div>
        </div>
        <div class="well" id="aboutDescription" style="margin-top:20px;">
            <markdown:renderHtml>${content}</markdown:renderHtml>
        </div>
    </div>
</body>
</html>