<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="main"/>
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
            <div class="span12" id="header">
                <h1 class="pull-left">About the website</h1>
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
               This prototype was developed by the Atlas of Living Australia in 2013 in conjunction with
               the Department of Sustainability, Environment, Water, Population and Communities.
           </p>
           <p>
               Report issues to <a href="mailto:support@ala.org.au">support@ala.org.au</a>
           </p>
        </div>
    </div>
</body>
</html>