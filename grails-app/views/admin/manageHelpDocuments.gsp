<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Manage help documents | MERIT</title>
    <script>
        window.fcConfig = {
            baseUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            documentUpdateUrl: "${g.createLink(controller: 'document', action: 'documentUpdate')}",
            documentDeleteUrl: "${g.createLink(controller: 'document', action: 'deleteDocument')}",
            imageLocation:"${assetPath(src:'/')}"
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="select2/css/select2.css"/>
    <asset:stylesheet src="select2-theme-bootstrap4/select2-bootstrap.css"/>
    <asset:stylesheet src="documents.css"/>
</head>
<body>
<div id="wrapper" class="${containerType}">
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item"><g:link controller="admin">Admin</g:link></li>
            <li class="breadcrumb-item">Manage help documents</li>
        </ol>
    </section>
    <h3>Manage Help Documents</h3>
    <p>
        Add a new help document by pressing the "New help document" button below.
        Specify the category or categories the document should appear in by selecting
        from the list of categories in the dialog.
        Adding a new category can be achieved by typing it into the Categories input and pressing Enter/Return.
    </p>

    <form class="form form-inline">
        <button class="btn btn-info" id="doAttach" data-bind="click:attachDocument">New help document</button>
    </form>

    <hr/>
    <p>Help documents</p>
    <div id="edit-documents" class="pill-pane tab-pane">
        <table class="table w-100 docs-table" id="help-documents">
            <thead>
            <tr>
                <th class="icon"></th>
                <th class="name">Name</th>
                <th class="info">Categories</th>
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
                    <td class="info"><span data-bind="text:labels().join(', \n')"></span></td>
                    <td class="last-updated"><span data-bind="text:uploadDate.formattedDate()"></span></td>
                    <td><span data-bind="text:uploadDate"></span></td>
                    <td></td>
                    <td class="admin-actions">
                        <button class="btn btn-mini deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
                        <button class="btn btn-mini editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
                        <!-- ko if:!embeddedVideo() -->
                        <a class="btn btn-mini" data-bind="attr:{href:url}" target="_blank">
                            <i class="fa fa-download"></i>
                        </a>
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
<asset:javascript src="select2/js/select2.full.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
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
