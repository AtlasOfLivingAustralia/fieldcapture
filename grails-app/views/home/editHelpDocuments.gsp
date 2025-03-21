<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <g:set var="layoutName" value="nrm_bs4"/>
    <meta name="layout" content="${layoutName}"/>
    <title>Edit help documents | MERIT</title>
    <script>
        window.fcConfig = {
            baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            documentUpdateUrl: "${g.createLink(controller: 'document', action: 'documentUpdate')}",
            documentDeleteUrl: "${g.createLink(controller: 'document', action: 'deleteDocument')}",
            imageLocation:"${assetPath(src:'/')}"
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
%{--    <asset:styleSheet src="document.css"/>--}%
</head>
<body>
<div id="wrapper" class="${containerType}">
    <g:render template="/admin/editDocuments" model="${[excludeReport:true, documents:documents, containerId:'help-documents', useExistingModel:false, filterBy:'all']}"/>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="document.js"/>
<asset:javascript src="file-upload-manifest.js"/>

<asset:script>

    var documents = <fc:modelAsJavascript model="${documents}"/>;
    $(function () {


            var owner = {hubId:'${hubId}'};
            var category = '${category}';
            documentRoles = [{id:'helpDocument', name:'Help Document', isPublicRole:true}];
            var options = {
                roles: ['helpDocument'],
                owner: owner,
                documentDefaults: {
                    role: 'helpDocument',
                    public: true,
                    labels:[category]
                },
                modalSelector: '#attachDocument',
                documentUpdateUrl: fcConfig.documentUpdateUrl,
                documentDeleteUrl: fcConfig.documentDeleteUrl,
                imageLocation: fcConfig.imageLocation
            };
            var documentsViewModel = new EditableDocumentsViewModel(options);
            documentsViewModel.loadDocuments(documents);
            ko.applyBindings(documentsViewModel, document.getElementById('edit-documents'));


    });

</asset:script>

<asset:deferredScripts/>
</body>

</html>
