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

                $("#btnLoadProjectData").click(function(e) {
                    e.preventDefault();

                    // HTML 5 only...
                    %{--var data = new FormData();--}%
                    %{--data.append('projectData', $('#fileSelector')[0].files[0]);--}%

                    %{--$.ajax({--}%
                    %{--url: "${createLink(controller: 'project', action:'loadProjectData')}",--}%
                    %{--done: function(result) {--}%
                    %{--document.location.reload();--}%
                    %{--},--}%
                    %{--error: function (result) {--}%
                    %{--var error = JSON.parse(result.responseText)--}%
                    %{--alert(error.error);--}%
                    %{--},--}%
                    %{--type:"POST",--}%
                    %{--processData: false,--}%
                    %{--contentType: false,--}%
                    %{--cache: false,--}%
                    %{--data: data--}%
                    %{--});--}%
                    $('form.loadProjectData').submit();
                });

                $("#projectData").change(function() {
                    if ($("#projectData").val()) {
                        $("#btnLoadProjectData").removeAttr("disabled");
                    }
                    else {
                        $("#btnLoadProjectData").attr("disabled", "disabled");
                    }

                }).trigger('change');

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
                    <td><button disabled id="btnLoadProjectData" class="btn btn-small btn-info" title="Load project data">Load Projects from CSV</button>
                    </td>
                    <td>
                        Loads (or reloads) project information from a csv file.
                        <p><g:uploadForm class="loadProjectData" controller="admin" action="importProjectData"><input id="projectData" type="file" accept="text/csv" name="projectData"/><input type="checkbox" name="importWithErrors">Force import (even with validation errors)</g:uploadForm></p>
                    </td>
                </tr>

            </tbody>
        </table>
    </body>
</html>