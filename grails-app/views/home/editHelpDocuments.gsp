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
    <asset:stylesheet src="documents.css"/>
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
        <table class="table w-100 docs-table" id="help-documents">
            <thead>
            <tr>
                <th class="icon"></th>
                <th class="name">Name</th>
                <th class="info">Category</th>
                <th class="last-updated">Last updated</th>
                <th></th>
                <th></th>
                <th class="admin-actions"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach: filteredDocuments">
                <tr>
                    <td class="icon">
                        <!-- ko if:embeddedVideo() -->
                        <i class="fa fa-file-video-o fa-2x"></i>
                        <!-- /ko -->
                        <!-- ko if:!embeddedVideo() -->
                        <img class="media-object" data-bind="attr:{src:iconImgUrl(), alt:contentType, title:name}" alt="document icon">
                        <!-- /ko -->

                    </td>
                    <td class="name"><span data-bind="text:name() || filename()"></span></td>
                    <td class="info"><span data-bind="text:labels"></span></td>
                    <td class="last-updated"><span data-bind="text:uploadDate.formattedDate()"></span></td>
                    <td><span data-bind="text:uploadDate"></span></td>
                    <td></td>
                    <td class="admin-actions">
                        <button class="btn btn-mini deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
                        <button class="btn btn-mini editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
                        <!-- ko if:!embeddedVideo() -->
                        <button class="btn btn-mini" data-bind="attr:{href:url}" target="_blank">
                            <i class="fa fa-download"></i>
                        </button>
                        <!-- /ko -->
                        <!-- ko if:embeddedVideo() -->

                        <i class="fa fa-question-circle" data-bind="popover:{content:'Embedded videos are not downloadable.'}"></i>

                        <!-- /ko -->
                    </td>
                </tr>
            </tbody>
        </table>

        <g:render template="/shared/documentTemplate"/>

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

        initialiseDocumentTable('#wrapper');
    });

</asset:script>

<asset:deferredScripts/>
</body>

</html>
