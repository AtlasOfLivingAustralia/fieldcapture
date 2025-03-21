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
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item"><g:link controller="admin">Admin</g:link></li>
            <li class="breadcrumb-item">Edit help documents</li>
        </ol>
    </section>
    <h3>Edit Help Documents</h3>
    <p>Create a new category of help documents by entering the category name and pressing Add new category below</p>
    <form class="form form-inline">
        <input type="text" data-bind="value: newCategoryName" class="form-control col-8" placeholder="Name of new category"/>
        <button class="btn btn-success" data-bind="enable: newCategoryName, click:newCategory">Add new category</button>
    </form>

    <br/>
    <p>Add a new help document in the selected category by selecting the category then pressing New help document in category below</p>
    <form class="form form-inline">

        <select class="form-control col-8" id="document-category" name="documentCategory" data-bind="options: documentCategories, value: selectedCategory, optionsCaption: 'Select a category'"></select>
        <button class="btn btn-info" id="doAttach" data-bind="enable:selectedCategory, click:attachDocument">New help document in category</button>
    </form>


    <hr/>
    <p>Help documents</p>
    <div id="edit-documents" class="pill-pane tab-pane">
        <div class="row">
            <div class="col-sm-12 ml-3 ">
                <g:render template="/shared/editDocuments"
                          model="[useExistingModel: true,editable:true, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>
            </div>
        </div>
        %{--The modal view containing the contents for a modal dialog used to attach a document--}%
        <g:render template="/shared/attachDocument"/>

    </div>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="document.js"/>
<asset:javascript src="file-upload-manifest.js"/>
<asset:javascript src="admin.js"/>

<asset:script>

    const documents = <fc:modelAsJavascript model="${documents}"/>;
    const categories = <fc:modelAsJavascript model="${categories}"/>;
    const hubId = '${hubId}';
    $(function () {
        let viewModel = new EditHelpDocumentsViewModel(hubId, categories, documents);
        ko.applyBindings(viewModel, document.getElementById('wrapper'));
    });

</asset:script>

<asset:deferredScripts/>
</body>

</html>
