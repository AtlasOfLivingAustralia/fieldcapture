<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>My profile | Field Capture</title>
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
            <div class="span12" id="header">
                <h1 class="pull-left">My profile</h1>
                <form action="search" class="form-search pull-right">
                    <div class="control-group">
                        <div class="controls">
                            <g:textField class="search-query input-medium" name="search"/>
                            <button type="submit" class="btn">Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="well" id="aboutDescription" style="margin-top:20px;">
           <p>
              Not yet implemented....
           </p>
           <p>
               Report issues to <a href="mailto:support@ala.org.au">support@ala.org.au</a>
           </p>
        </div>
    </div>
</body>
</html>