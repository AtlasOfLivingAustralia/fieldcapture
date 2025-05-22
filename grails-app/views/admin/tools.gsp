<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Tools | Admin | MERIT</title>
    <asset:stylesheet src="base-bs4.css"/>
</head>

<body>
<asset:javascript src="base-bs4.js"/>
<script type="text/javascript">

    $(document).ready(function() {

        $("#btnReloadConfig").click(function(e) {
            e.preventDefault();
            $.ajax("${createLink(controller: 'admin', action:'reloadConfig')}").done(function(result) {
                document.location.reload();
            });
        });

        $("#btnClearMetadataCache").click(function(e) {
            e.preventDefault();
            var clearEcodataCache = $('#clearEcodataCache').is(':checked'),
                url = "${createLink(controller: 'admin', action:'clearMetadataCache')}" +
                    (clearEcodataCache ? "?clearEcodataCache=true" : "");
            $.ajax(url).done(function(result) {
                document.location.reload();
            }).fail(function (result) {
                alert(result);
            });
        });

        $("#btnLoadActivityData").click(function(e) {
            e.preventDefault();


            $('form.loadActivityData').submit();
        });

        $("#activityData").change(function() {
            if ($("#activityData").val()) {
                $("#btnLoadActivityData").removeAttr("disabled");
            }
            else {
                $("#btnLoadActivityData").attr("disabled", "disabled");
            }

        }).trigger('change');

        $("#nlpData").change(function() {
            if ($("#nlpData").val()) {
                $("#btnNlpData").removeAttr("disabled");
            }
            else {
                $("#btnNlpData").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnNlpData').click(function(e) {
            e.preventDefault();
            $('form.nlpData').submit();
        });

        $("#btnLoadPlanData").click(function(e) {
            e.preventDefault();
            $('form.loadPlanData').submit();
        });

        $("#planData").change(function() {
            if ($("#planData").val()) {
                $("#btnLoadPlanData").removeAttr("disabled");
            }
            else {
                $("#btnLoadPlanData").attr("disabled", "disabled");
            }

        }).trigger('change');

        $("#btnReindexAll").click(function(e) {
            e.preventDefault();
            var url = "${createLink(controller: 'admin', action:'reIndexAll')}";
            $.ajax(url).done(function(result) {
                document.location.reload();
            }).fail(function (result) {
                alert(result);
            });
        });

        $("#generateReports").click(function(e) {
            $('#projectActivitiesForm').submit();
        });

        $("#bulkUploadSites").change(function() {
            if ($("#bulkUploadSites").val()) {
                $("#btnBulkUploadSites").removeAttr("disabled");
            }
            else {
                $("#btnBulkUploadSites").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnBulkUploadSites').click(function(e) {
            e.preventDefault();
            $('form.bulkUploadSites').submit();
        });

        $("#bulkUploadESPSites").change(function() {
            if ($("#bulkUploadESPSites").val()) {
                $("#btnBulkUploadESPSites").removeAttr("disabled");
            }
            else {
                $("#btnBulkUploadESPSites").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnBulkUploadESPSites').click(function(e) {
            e.preventDefault();
            $('form.bulkUploadESPSites').submit();
        });

        $("#createOrgs").change(function() {
            if ($("#createOrgs").val()) {
                $("#btnUpdateProjectOrgs").removeAttr("disabled");
            }
            else {
                $("#btnUpdateProjectOrgs").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnUpdateProjectOrgs').click(function(e) {
            e.preventDefault();
            $('form.createOrgs').submit();
        });

        $("#importFromPDF").change(function() {
            if ($("#importFromPDF").val()) {
                $("#btnImportFromPDF").removeAttr("disabled");
            }
            else {
                $("#btnImportFromPDF").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnImportFromPDF').click(function(e) {
            e.preventDefault();
            $('form.importFromPDF').submit();
        });

    });

</script>
<content tag="pageTitle">Tools</content>
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th>Tool</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <button id="btnReloadConfig" class="btn btn-sm btn-info">Reload&nbsp;External&nbsp;Config</button>
        </td>
        <td>
            Reads any defined config files and merges new config with old. Usually used after a change is
            made to external config files. Note that this cannot remove a config item as the result is a
            union of the old and new config.
        </td>
    </tr>
    <tr>
        <td>
            <button id="btnClearMetadataCache" class="btn btn-sm btn-info">Clear&nbsp;Metadata&nbsp;Cache</button>
            <label class="checkbox" style="padding-top:5px;"><input type="checkbox" id="clearEcodataCache" checked="checked">Also clear ecodata cache</label>
        </td>
        <td>
            Removes all cached values for metadata requests and causes the metadata to be requested
            from the source at the next attempt to use the metadata.
        </td>
    </tr>

    <tr>
        <td>
            <a style="color:white" class="btn btn-sm btn-info" href="${createLink(controller:'admin', action:'bulkLoadUserPermissions')}">Bulk Load Permissions</a>
        </td>
        <td>
            Loads user project roles from a csv file
        </td>
    </tr>
    <tr>
        <td><button id="btnReindexAll" class="btn btn-sm btn-info" title="Re-index all data">Re-index all</button>
        </td>
        <td>
            Re-indexes all data in the search index.
        </td>
    </tr>
    <tr>
        <td><button id="generateReports" class="btn btn-sm btn-info" title="Generate project activities">Generate project activities</button>
        </td>
        <td>
            Create project reporting activities for a project based on one activity per period.
            <g:form id="projectActivitiesForm" url="[action:'generateProjectReports']">
                <div class="row mb-2">
                    <label for="projectId" class="col-sm-2">${g.message(code:'label.merit.projectID')}</label>
                    <div class="col-sm-3">
                        <input id="projectId" class="form-control form-control-sm input-small" type="text" name="projectId">
                    </div>

                </div>

                <div class="row mb-2">
                    <label for="activityType" class="col-sm-2">Activity Type</label>
                    <div class="col-sm-3">
                        <input id="activityType" class="form-control form-control-sm input-small" type="text" name="activityType">
                    </div>
                </div>

                <div class="row">
                    <label for="period" class="col-sm-2">Period (months)</label>
                    <div class="col-sm-3">
                        <input id="period" class="form-control form-control-sm input-small" type="text" name="period">
                    </div>
                </div>

            </g:form>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnBulkUploadSites" class="btn btn-sm btn-info" title="Bulk load sites">Bulk load sites</button>
        </td>
        <td>

        <p><g:uploadForm class="bulkUploadSites" action="bulkUploadSites">
            <div>
                <input id="bulkUploadSites"  type="file" name="shapefile"/>
                <input type="checkbox" name="matchProjectsOnly"> Check project ids only
            </div>
            Bulk loads sites from a shapefile.
        </g:uploadForm>

        </p>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnBulkUploadESPSites" class="btn btn-sm btn-info" title="Bulk load ESP sites">Bulk load ESP sites</button>
        </td>
        <td>

        <p><g:uploadForm class="bulkUploadESPSites" action="bulkUploadESPSites">
            <div><input id="bulkUploadESPSites"  type="file" name="shapefile"/></div>
            Bulk loads sites from a shapefile.
        </g:uploadForm>

        </p>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnUpdateProjectOrgs" class="btn btn-sm btn-info" title="Bulk create organisations">Bulk create organisations</button>
        </td>
        <td>
            Bulk creates organisations and updates projects.
            <g:uploadForm class="createOrgs" action="organisationModifications">
                <div><input id="createOrgs" type="file" name="orgData"/></div>
            </g:uploadForm>

        </td>
    </tr>

    </tbody>
</table>
</body>
</html>
