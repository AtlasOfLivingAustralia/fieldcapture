<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Import Projects | Admin | Field Capture</title>
    <script>
            var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                importUrl: "${createLink(action: 'importProjectData')}",
                projectUrl:"${createLink(controller:'project', action:'index')}",
                importProgressUrl: "${createLink(action: 'importStatus')}"
            },
            returnTo = "${params.returnTo}";
    </script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="fileupload-9.0.0/jquery.fileupload-ui.css"/>
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
        <input id="fileUpload" type="file" accept="text/csv" data-bind="fileUploadNoImage:uploadOptions, enabled:!finished() && !finishedPreview()">Select file</button>
    </div>
</div>


<div class="results" data-bind="visible:progressSummary()">


    <h3> Results </h3>
    <div class="row-fluid">
    <span data-bind="text:progressSummary"></span>
    <button class="btn" data-bind="click:doImport, visible:finishedPreview() && !finished(), enabled:!importing()">Import Projects</button>
        <br/>
    <table class="table">
        <thead>
        <tr>
            <td>Grant ID</td><td>External ID</td><td>Success?</td><td>Messages</td>
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

        </tr>
        <!-- /ko -->
        </tbody>

    </table>
    </div>

</div>
<script id="template-upload" type="text/x-tmpl">{% %}</script>
<script id="template-download" type="text/x-tmpl">{% %}</script>

<asset:javascript src="common.js"/>
<asset:javascript src="attach-document.js"/>

<script>

    var SiteUploadViewModel = function () {
        var self = this;

        self.filename = ko.observable();
        self.progressSummary = ko.observable();
        self.progressDetail = ko.observableArray([]);
        self.finishedPreview = ko.observable(false);
        self.finished = ko.observable(false);
        self.preview = ko.observable(true);
        self.importing = ko.observable(false);


        self.uploadOptions = {
            url: fcConfig.importUrl,
            done: function (e, data) {
                console.log(data.result);
                if (data.result) {
                    self.progressDetail(data.result.projects);
                    self.progressSummary('Processed ' + data.result.projects.length + ' projects');
                    if (self.preview()) {
                        self.preview(false);
                        self.finishedPreview(true);
                        self.finished(false);

                    }
                    else {
                        self.finished(true);
                    }

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

        self.showProgress = function () {
            var stop = false;
            $.get(fcConfig.importProgressUrl, function (progress) {

                self.progressDetail(progress.projects);
                if (!progress.finished) {
                    self.progressSummary(progress.projects.length + ' projects processed...');
                }
                else {
                    stop = true;
                    self.progressSummary('All '+progress.projects.length+'projects processed.');
                }
            }).always(function() {
                if (!stop) {
                    setTimeout(self.showProgress, 2000);
                }
            });

        };

        self.doImport = function () {
            self.importing(true);
            self.progressSummary('Importing....');
            self.progressDetail([]);

            $.ajax(fcConfig.importUrl + '?newFormat=true', {

                dataType: 'json',
                success: function (result) {

                    if (result.error) {
                        alert(result.error);
                        self.progressSummary(result.error);
                        self.progressDetail(result.projects?result.projects:[])
                    }
                    else {
                        self.progressDetail(result.projects);

                        self.progressSummary('Import complete.');
                    }
                    self.finished(true);
                    self.finishedPreview(false);

                },
                error: function () {
                    var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                    alert(message);
                }
            });
            setTimeout(self.showProgress, 2000);
        }
    };
    ko.applyBindings(new SiteUploadViewModel());
</script>
</body>
</html>