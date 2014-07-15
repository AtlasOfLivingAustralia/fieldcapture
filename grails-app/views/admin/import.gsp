<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Import Projects | Admin | Field Capture</title>
    <r:script disposition="head">
            var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                importUrl: "${createLink(action: 'importProjectData')}",
                importProgressUrl: "${createLink(action: 'importStatus')}"
            },
            returnTo = "${params.returnTo}";
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,jQueryFileUploadUI"/>
</head>

<body>
<content tag="pageTitle">Import Projects from GMS</content>

<h2>GMS Project Import</h2>
<p>

</p>
<div class="row-fluid">
    <div class="span4">
        Select the (cp1252 encoded) CSV file containing the GMS data.  The file will be uploaded automatically.
    </div>
     <div class="span2 btn fileinput-button" style="margin-left:5px">
        <input type="file" accept="text/csv" data-bind="fileUploadNoImage:uploadOptions">Select file</button>
    </div>
</div>


<div class="results" data-bind="visible:progressSummary()">


    <h3> Results </h3>
    <div class="row-fluid">
    <span data-bind="text:progressSummary"></span>

    <table class="table">
        <thead>
        <tr>
            <td>Grant ID</td><td>External ID</td><td>Success?</td><td>Messages</td>
        </tr>
        </thead>
        <tbody>
        <!-- ko foreach: { data: progressDetail, as: 'project'} -->
        <tr>
            <td data-bind="text:grantId"></td>
            <td data-bind="text:externalId"></td>
            <td data-bind="text:success?'Yes':'No'"></td>
            <td>
                <ul>
                    <!-- ko foreach: { data: errors, as: 'error'} -->
                    <li data-bind="text:error"></li>
                    <!-- /ko -->
                </ul>
            </td>

        </tr>
        <!-- /ko -->
        </tbody>

    </table>
    </div>

</div>
<script id="template-upload" type="text/x-tmpl">{% %}</script>
<script id="template-download" type="text/x-tmpl">{% %}</script>

<r:script>

    var SiteUploadViewModel = function () {
        var self = this;

        self.filename = ko.observable();
        self.progressSummary = ko.observable();
        self.progressDetail = ko.observableArray([]);
        self.finished = ko.observable(false);

        self.uploadOptions = {
            url: fcConfig.importUrl,
            done: function (e, data) {
                console.log(data.result);
                if (data.result) {
                    self.progressDetail(data.result.projects);
                    self.progressSummary('Processed '+data.result.projects.length+' projects');
                }
                else {
                    var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                    alert(message);
                }

            },
            fail: function (e, data) {
                var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                alert(message);

            },

            uploadTemplateId: "template-upload",
            downloadTemplateId: "template-download",
            formData: {preview: 'true', newFormat: 'true'},
            paramName: 'projectData'

        }
        self.importProjects = function () {
            var payload = {};

            $.ajax({
                url: fcConfig.importUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (data) {
                    setTimeout(self.showProgress, 2000);

                },
                error: function () {
                    alert('There was a problem uploading the project CSV.');
                }
            });
        };
        self.showProgress = function () {
            $.get(fcConfig.importProgressUrl, function (progress) {
                self.finished(progress.finished);
                self.progressDetail(progress.projects);
                if (!progress.finished) {
                    self.progressSummary(progress.projects.length + ' projects processed...');

                    setTimeout(self.showProgress, 2000);
                }
                else {
                    self.progressSummary('All projects processed.');
                }
            });

        };
    };
    ko.applyBindings(new SiteUploadViewModel());
</r:script>
</body>
</html>