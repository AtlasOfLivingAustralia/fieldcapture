<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>${title?:'About'} | Field Capture</title>
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
                <h1 class="">${title?:'About the website'}
                    <g:if test="${fc.userIsSiteAdmin()}">
                        &nbsp;&nbsp;<a href="${createLink(controller:'admin', action:'editSettingText', id: name)}" class="btn btn-small">Edit content</a>
                    </g:if>
                </h1>
            </div>
        </div>
        <div class="well" id="aboutDescription" style="margin-top:20px;">
            <markdown:renderHtml>${content}</markdown:renderHtml>
        </div>
    </div>
</body>
</html>