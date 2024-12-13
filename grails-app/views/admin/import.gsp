<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Import Projects | Admin | MERIT</title>
    <script>
            var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
                importUrl: "${createLink(action: 'loadMeritProjects')}",
                projectUrl:"${createLink(controller:'project', action:'index')}",
                importProgressUrl: "${createLink(action: 'importStatus')}"
            },
            returnTo = "${params.returnTo}";
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="blueimp/fileupload-9.28.0/jquery.fileupload.css"/>
</head>

<body>
<content tag="pageTitle">Load new projects into MERIT</content>

<h2>CSV Project Import</h2>

    <p data-bind="visible:!finished() && !finishedPreview()">
    <p class="alert alert-dark">
    Click <strong><a href="${createLink(action:'meritImportCSVTemplate')}">HERE</a></strong> to download a template to use for MERIT project imports
    </p>


    <form>
        <p>
            Select the (cp1252 encoded) CSV file containing the project data.  The file will be uploaded automatically.
        </p>
        <div data-bind="if:update">
        <p class="alert alert-warning" >
            Please note this function will replace all project information for each project. <br/>
            It is designed for use with grants hub data and to fix newly loaded projects.  Please test changes
            to existing MERIT projects in the staging system before running the update in production.
        </p>
        </div>
        <div class="form-check">
            <input id="update" class="form-check-input" type="checkbox" name="update" data-bind="enable:!finished() && !finishedPreview(), checked:update"><label class="form-check-label" for="update">Check here if this upload will replace existing projects</label>
        </div>
        <div class="form-group">
            <button class="btn btn-sm btn-primary fileinput-button" data-bind="enable:!finished() && (!finishedPreview() || finishedPreview() && !success())">
                <input id="fileUpload" class="form-control form-control-sm" type="file" accept="text/csv" data-bind="fileUploadNoImage:uploadOptions">
                Select file
            </button>
        </div>
    </form>


<div class="results" data-bind="visible:progressSummary()">


    <h3> Results </h3>
    <!-- ko if:finishedPreview && !success() -->
    <div class="alert alert-danger">
        <p>One or more errors were encountered processing the file.  Please resolve the errors and try again.</p>
    </div>
    <!-- /ko -->
    <div class="row">

    <span data-bind="text:progressSummary"></span>
    <button class="ml-1 btn btn-sm mb-3" data-bind="click:doImport, visible:finishedPreview() && !finished(), enable:!importing() && success()">Import Projects</button>

    <table class="table">
        <thead>
        <tr>
            <th>Grant ID</th><th>External ID</th><th>Success?</th><th>Errors</th><th>Messages</th>
        </tr>
        </thead>
        <tbody>
        <!-- ko foreach: { data: progressDetail, as: 'project'} -->
        <tr>
            <td>
                <span data-bind="text:grantId"></span>
                <a data-bind="attr:{href:fcConfig.projectUrl+$data.projectId}, visible:$data.projectUrl">(View Project)</a>
            </td>
            <td data-bind="text:externalId"></td>
            <td data-bind="text:success?'Yes':'No'"></td>
            <td>
                <ul>
                    <!-- ko foreach: { data: errors, as: 'error'} -->
                    <li data-bind="text:error"></li>
                    <!-- /ko -->
                </ul>
            </td>
            <td>
                <ul>
                    <!-- ko foreach: { data: messages, as: 'message'} -->
                    <li data-bind="text:message"></li>
                    <!-- /ko -->
                </ul>
            </td>

        </tr>
        <!-- /ko -->
        </tbody>

    </table>
    </div>
</div>
</div>
<script id="template-upload" type="text/x-tmpl">{% %}</script>
<script id="template-download" type="text/x-tmpl">{% %}</script>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="admin.js"/>

<script>
    ko.applyBindings(new ProjectImportViewModel(fcConfig));
</script>
</body>
</html>
