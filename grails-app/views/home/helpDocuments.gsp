<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <g:set var="layoutName" value="nrm_bs4"/>
    <meta name="layout" content="${layoutName}"/>
    <title>Help documents | MERIT</title>
    <script>
        window.fcConfig = {
            baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            pdfgenUrl: "${createLink(controller: 'resource', action: 'pdfUrl')}",
            pdfViewer: "${createLink(controller: 'resource', action: 'viewer')}",
            imgViewer: "${createLink(controller: 'resource', action: 'imageviewer')}",
            audioViewer: "${createLink(controller: 'resource', action: 'audioviewer')}",
            videoViewer: "${createLink(controller: 'resource', action: 'videoviewer')}",
            errorViewer: "${createLink(controller: 'resource', action: 'error')}",
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
%{--    <asset:styleSheet src="document.css"/>--}%
</head>
<body>

<div id="wrapper" class="${containerType}">
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item">Help - ${category}</li>
        </ol>
    </section>
    <h3>Help Documents</h3>

    <g:render template="/shared/listDocuments" model="${[excludeReportColumn:true, documents:documents, containerId:'help-documents', useExistingModel:false, filterBy:'all', imageUrl:assetPath(src:'/')]}"/>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="document.js"/>
<asset:deferredScripts/>
</body>

</html>
