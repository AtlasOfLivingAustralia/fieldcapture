<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
    <head>
        <meta name="layout" content="adminLayout"/>
        <title>Users | Admin | Data capture | Atlas of Living Australia</title>
    </head>

    <body>
    <r:require module="bootstrap_combo"/>
    <script type="text/javascript">

        $(document).ready(function() {

            $("#addPermissionsButton").click(function(e) {
                e.preventDefault();
                if ($('#userId').val() && $('#role').val() && $('#projectId').val()) {
                    $("#spinner").show();
                    $.ajax( {
                        url: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
                        data: {userId: $("#userId").val(), role: $("#role").val(), projectId: $("#projectId").val() }
                    }).done(function(result) { alert("success"); })
                    .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                    .always(function(result) { $("#spinner").hide(); });
                } else {
                    alert("All fields are required - please check and try again.");
                }

            });

            $("#viewUerPermissionsButton").click(function(e) {
                e.preventDefault();
                if ($('#userId2').val()) {
                    $("#spinner2").show();
                    $.ajax( {
                        url: "${createLink(controller: 'user', action: 'viewPermissionsForUserId')}",
                        data: {userId: $("#userId2").val() }
                    }).done(function(result) {
                        //console.log("result",result);
                        $("#userPermissionsOutput").html(formatPermissionData(result)); // "<pre>" + JSON.stringify(result, null, 4) + "</pre>"
                    }).fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                    .always(function(result) { $("#spinner2").hide(); });
                } else {
                    alert("No user selected - please check and try again.");
                    $("#userPermissionsOutput").html("");
                }
            });

            var namesArray = [];
            <g:each var="it" in="${userNamesList}" status="s">namesArray[${s}] = "${it.userId} -- ${it.displayName?.toLowerCase()} -- ${it.userName?.toLowerCase()}";</g:each>

            $(".combobox").combobox({
                //template: '<div class="combobox-container"><input type="hidden" /><input type="text" autocomplete="off" /><span class="add-on btn" data-dropdown="dropdown"><span class="caret"/><span class="combobox-clear"><i class="icon-remove"/></span></span></div>'
            });
            $('.tooltips').tooltip();
        }); // end document.ready

        /**
         * Produce HTML output for the display of the permissions JSON data
         *
         * @param data
         */
        function formatPermissionData(data) {
            var html = "<table class='table table-bordered table-striped table-condensed'>";
            html += "<thead><tr><th>Project</th><th>Role</th></tr></thead><tbody>";
            $.each(data, function(i, el) {
                html += "<tr><td><a href='${createLink(controller: "project")}/" + el.project.projectId + "'>" + el.project.name + "</a></td><td>" + el.accessLevel.name + "</td></tr>";
            });
            html += "</tbody></table>";
            return html;
        }
    </script>
    <content tag="pageTitle">Users</content>
    <div class="well">Logged in user is <b class="tooltips" title="${user}">${user.userDisplayName}</b></div>
    <div>
        <h4>Add Permissions</h4>
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="userId">User</label>
                <div class="controls">
                    <g:select name="user" id="userId" class="input-xlarge combobox" from="${userNamesList}" optionValue="${{it.displayName + " <" + it.userName +">"}}" optionKey="userId" noSelection="['':'start typing a user name']"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="role">Permission level</label>
                <div class="controls">
                    <g:select name="role" id="role" from="${grailsApplication.config.app.accessLevel.roles}" noSelection="['':'-- select a permission level --']"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="projectId">Project</label>
                <div class="controls">
                    <g:select name="project" id="projectId" class="input-xlarge combobox" from="${projects}" optionValue="name" optionKey="projectId" noSelection="['':'start typing a project name']" />
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <button id="addPermissionsButton" class="btn btn-primary">Submit</button>
                    <g:img dir="images" file="spinner.gif" id="spinner" class="hide"/>
                </div>
            </div>
        </form>
    </div>
    <div>
        <h4>View Permissions for user</h4>
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="userId">User</label>
                <div class="controls">
                    <g:select name="user" id="userId2" class="input-xlarge combobox" from="${userNamesList}" optionValue="${{it.displayName + " <" + it.userName +">"}}" optionKey="userId" noSelection="['':'start typing a user name']"/>
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <button id="viewUerPermissionsButton" class="btn btn-primary">View</button>
                    <g:img dir="images" file="spinner.gif" id="spinner2" class="hide"/>
                </div>
            </div>
        </form>
        <div class="span8" id="userPermissionsOutput">

        </div>
    </div>
    </body>
</html>