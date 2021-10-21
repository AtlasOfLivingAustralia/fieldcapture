<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" expressionCodec="none"%>
<!DOCTYPE HTML>
<html>
<head>
  <g:set var="layoutName" value="nrm_bs4"/>
  <meta name="layout" content="${layoutName}"/>
  <title>${settingType.title?:'About'} | MERIT</title>
  <script>
    window.fcConfig = {
        baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
        spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
        spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
        sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
        sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}"
    }
  </script>
  <asset:stylesheet src="base-bs4.css"/>
</head>
<body>
    <div id="wrapper" class="${containerType}">
        <div class="row">
            <div class="col-md-8" id="">
                <h1>${settingType.title?:'About the website'}
                    <g:if test="${fc.userInRole(role: grailsApplication.config.getProperty('security.cas.alaAdminRole')) || fc.userInRole(role: grailsApplication.config.getProperty('security.cas.adminRole'))}">
                        <span style="display: inline-block; margin: 0 10px;">
                            <a href="${g.createLink(controller:"admin",action:"editSettingText", id: settingType.name, params: [returnTo: params.action])}"
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
                <g:if test="${fc.userInRole(role: grailsApplication.config.getProperty('security.cas.alaAdminRole')) || fc.userInRole(role: grailsApplication.config.getProperty('security.cas.adminRole'))}">
                    <a href="${g.createLink(controller:"admin",action:"editSettingText", id: SettingPageType.NEWS.name, params: [returnTo: params.action])}"
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