<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Tools | Admin | Data capture | Atlas of Living Australia</title>
</head>

<body>
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

        $('#btnClearStatistics').click(function(e) {
            e.preventDefault();
            var url = "${createLink(controller:'admin', action:'clearStatistics')}";
            $.post(url).done(function() { document.location.reload(); }).fail(function(result) { alert(result); });
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

        $("#createOrgs").change(function() {
            if ($("#createOrgs").val()) {
                $("#btnCreateOrgs").removeAttr("disabled");
            }
            else {
                $("#btnCreateOrgs").attr("disabled", "disabled");
            }

        }).trigger('change');

        $('#btnCreateOrgs').click(function(e) {
            e.preventDefault();
            $('form.createOrgs').submit();
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
            <button id="btnReloadConfig" class="btn btn-small btn-info">Reload&nbsp;External&nbsp;Config</button>
        </td>
        <td>
            Reads any defined config files and merges new config with old. Usually used after a change is
            made to external config files. Note that this cannot remove a config item as the result is a
            union of the old and new config.
        </td>
    </tr>
    <tr>
        <td>
            <button id="btnClearMetadataCache" class="btn btn-small btn-info">Clear&nbsp;Metadata&nbsp;Cache</button>
            <label class="checkbox" style="padding-top:5px;"><input type="checkbox" id="clearEcodataCache" checked="checked">Also clear ecodata cache</label>
        </td>
        <td>
            Removes all cached values for metadata requests and causes the metadata to be requested
            from the source at the next attempt to use the metadata.
        </td>
    </tr>
    <tr>
        <td>
            <button id="btnClearStatistics" class="btn btn-small btn-info">Clear Statistics</button>
        </td>
        <td>
            Causes a re-read of the home page statistics configuration and clears it's cache.
        </td>
    </tr>

    <tr>
        <td><button disabled id="btnLoadActivityData" class="btn btn-small btn-info" title="Load project aggregrate data">Load Summary Activity Data from CSV</button>
        </td>
        <td>
            Loads (or reloads) activity information from a csv file.
        <p><g:uploadForm class="loadActivityData" controller="admin" action="populateAggregrateProjectData">
            <div><input id="activityData" type="file" accept="text/csv" name="activityData"/></div>
            <div><input type="checkbox" name="preview">Preview errors only, don't actually modify anything</div>
        </g:uploadForm>

        </p>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnNlpData" class="btn btn-small btn-info" title="Load project aggregrate data">Perform NLP migration on selected projects (CSV)</button>
        </td>
        <td>
            End dates C4oC projects and creates new NLP projects for the projects specified on a supplied CSV
        <p><g:uploadForm class="nlpData" controller="admin" action="nlpMigrate">
            <div><input id="nlpData" type="file" accept="text/csv" name="nlpData"/></div>
            <div><input type="checkbox" name="preview" checked="checked">Preview errors only, don't actually modify anything</div>
        </g:uploadForm>

        </p>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnLoadPlanData" class="btn btn-small btn-info" title="Load project data">Load Plans from CSV</button>
        </td>
        <td>
            Loads (or reloads) project plan information from a csv file.
            <p><g:uploadForm class="loadPlanData" controller="admin" action="importPlanData"><input id="planData" type="file" accept="text/csv" name="planData"/><input type="checkbox" name="overwriteActivities">Replace existing activities</g:uploadForm></p>
        </td>
    </tr>
    <tr>
        <td>
            <a style="color:white" class="btn btn-small btn-info" href="${createLink(controller:'admin', action:'bulkLoadUserPermissions')}">Bulk Load Permissions</a>
        </td>
        <td>
            Loads user project roles from a csv file
        </td>
    </tr>
    <tr>
        <td><button id="btnReindexAll" class="btn btn-small btn-info" title="Re-index all data">Re-index all</button>
        </td>
        <td>
            Re-indexes all data in the search index.
        </td>
    </tr>
    <tr>
        <td><button id="generateReports" class="btn btn-small btn-info" title="Generate project activities">Generate project activities</button>
        </td>
        <td>
            Create project reporting activities for a project based on one activity per period.
            <g:form id="projectActivitiesForm" url="[action:'generateProjectReports']">
                Project ID <input type="text" name="projectId"><br/>
                Activity Type <input type="text" name="activityType"><br/>
                Period (months) <input type="text" name="period">
            </g:form>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnBulkUploadSites" class="btn btn-small btn-info" title="Bulk load sites">Bulk load sites</button>
        </td>
        <td>

        <p><g:uploadForm class="bulkUploadSites" action="bulkUploadSites">
            <div><input id="bulkUploadSites" type="file" name="shapefile"/></div>
            Bulk loads sites from a shapefile.
        </g:uploadForm>

        </p>
        </td>
    </tr>
    <tr>
        <td><button disabled id="btnCreateOrgs" class="btn btn-small btn-info" title="Bulk create organisations">Bulk create organisations</button>
        </td>
        <td>
            Bulk creates organisations and updates projects.
        <p><g:uploadForm class="createOrgs" action="createMissingOrganisations">
            <div><input id="createOrgs" type="file" name="orgData"/></div>

        </g:uploadForm>

        </p>
        </td>
    </tr>

    </tbody>
</table>
</body>
</html>