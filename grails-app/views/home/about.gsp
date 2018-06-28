<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <g:set var="layoutName" value="nrm_bs4"/>
  <meta name="layout" content="${layoutName}"/>
  <title>${settingType.title?:'About'} | Field Capture</title>
  <script>
    window.fcConfig = {
        baseUrl: "${grailsApplication.config.grails.serverURL}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
  </script>
  <asset:stylesheet src="base-bs4.css"/>
</head>
<body>
    <div id="wrapper" class="${containerType}">
        <div class="row">
            <div class="col-md-8" id="">
                <h1>${settingType.title?:'About the website'}
                    <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                        <span style="display: inline-block; margin: 0 10px;">
                            <a href="${g.createLink(controller:"admin",action:"editSettingText", id: settingType.name, params: [layout:layoutName,returnUrl: g.createLink(controller: params.controller, action: params.action, id: params.id, absolute: true)])}"
                               class="btn"><i class="fa fa-edit"></i> Edit</a>
                        </span>
                    </g:if>
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-md-7">
                <div class="" id="aboutDescription" style="margin-top:20px;">
                    <markdown:renderHtml>${content}</markdown:renderHtml>
                </div>
            </div><!-- /.spanN  -->
            <g:if test="${showNews}">
            <g:set var="newsText"><fc:getSettingContent settingType="${SettingPageType.NEWS}"/></g:set>
            <div class="col-md-5">
                <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                    <a href="${g.createLink(controller:"admin",action:"editSettingText", id: SettingPageType.NEWS.name, params: [layout:layoutName,returnUrl: g.createLink(controller: params.controller, action: params.action, absolute: true)])}"
                       class="btn pull-right"><i class="fa fa-edit"></i> Edit</a>
                </g:if>
                ${newsText}
            </div>
            </g:if>

        </div><!-- /.row-fluid  -->
    </div>
    <asset:javascript src="base-bs4.js"/>
</body>

</html>