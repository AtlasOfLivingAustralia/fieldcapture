<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
    <head>
        <meta name="layout" content="adminLayout"/>
        <title>Users | Admin | Data capture | Atlas of Living Australia</title>
    </head>

    <body>
    <r:require modules="bootstrap_combo,jqueryValidationEngine"/>
    <script type="text/javascript">

        $(document).ready(function() {

            // Click event on "add" button to add new user to project
            $('#addUserRoleBtn').click(function(e) {
                e.preventDefault();
                var email = $('#emailAddress').val();
                var role = $('#addUserRole').val();
                var projectId = $('#projectId').val();

                if ($('#userAccessForm').validationEngine('validate')) {
                    $("#spinner1").show();
                    var userId;
                    if (email) {
                        $.get("${g.createLink(controller:'user',action:'checkEmailExists')}?email=" + email, function(data) {
                            if (data && /^\d+$/.test(data)) {
                                userId = data;
                                addUserWithRole(userId, role, projectId);
                            } else {
                                var registerUrl = "http://auth.ala.org.au/emmet/selfRegister.html";
                                bootbox.alert("The email address did not match a registered user. This may because: " +
                                        "<ul><li>the email address is incorrect</li>" +
                                        "<li>the user is not registered - see the <a href='" + registerUrl + "' target='_blank'>sign-up page</a>. </li></ul>"
                                );
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                        .always(function() { $(".spinner").hide(); });
                    }

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

            $(".combobox").combobox();
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

        /**
         * Add a user with given role to the current project
         *
         * @param userId
         * @param role
         * @param projectId
         */
        function addUserWithRole(userId, role, projectId) {
            //console.log("addUserWithRole",userId, role, projectId);
            if (userId && role) {
                $.ajax({
                    url: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
                    data: { userId: userId, role: role, projectId: projectId }
                })
                .done(function(result) { updateStatusMessage("user was added with role " + role); })
                .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                .always(function(result) { $(".spinner").hide(); $("#userAccessForm")[0].reset(); });
            } else {
                alert("Required fields are: userId and role.");
                $('.spinner').hide();
            }
        }

        function updateStatusMessage(msg) {
            $('#formStatus span').text(''); // clear previous message
            $('#formStatus span').text(msg).parent().fadeIn();
        }
    </script>
    <content tag="pageTitle">Users</content>
    <div class="well">Logged in user is <b class="tooltips" title="${user}">${user.userDisplayName}</b></div>
    <div id="formStatus" class="hide alert alert-success">
        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
        <span></span>
    </div>
    <div>
        <h4>Add Permissions</h4>
        <form class="form-horizontal" id="userAccessForm">
            <div class="control-group">
                <label class="control-label" for="emailAddress">User</label>
                <div class="controls">
                    <input class="input-xlarge validate[required,custom[email]]" id="emailAddress" placeholder="enter a user's email address" type="text"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="role">Permission level</label>
                <div class="controls">
                    <g:select name="role" id="addUserRole" from="${roles}" noSelection="['':'-- select a permission level --']" class="validate[required]" data-errormessage-value-missing="Role is required!"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="projectId">Project</label>
                <div class="controls">
                    <g:select name="project" id="projectId" class="input-xlarge combobox validate[required]" from="${projects}" optionValue="name" optionKey="projectId" noSelection="['':'start typing a project name']" />
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <button id="addUserRoleBtn" class="btn btn-primary">Submit</button>
                    <g:img dir="images" file="spinner.gif" id="spinner1" class="hide spinner"/>
                </div>
            </div>
        </form>
            %{--<form class="form-inline" id="userAccessForm">--}%
                %{--Add user (email address)&nbsp;--}%
                %{--<g:select name="userId" data-bind="value: userId" class="input-xlarge combobox" from="${user?.userNamesList}" optionValue="${{it.displayName + " <" + it.userName +">"}}" optionKey="userId" noSelection="['':'start typing a user name']"/>--}%
                %{--<input class="input-xlarge validate[required,custom[email]]" id="emailAddress" placeholder="enter a user's email address" type="text"/>--}%
                %{--with role <g:select name="role" id="addUserRole" class="validate[required]" data-errormessage-value-missing="Role is required!"--}%
                                    %{--from="${roles}" noSelection="['':'-- select a role --']"/>--}%
                %{--<g:select name="project" id="projectId" class="input-xlarge combobox" from="${projects}" optionValue="name" optionKey="projectId" noSelection="['':'start typing a project name']" />--}%
                %{--<button id="addUserRoleBtn" class="btn btn-primary">Add</button>--}%
                %{--<g:img dir="images" file="spinner.gif" id="spinner1" class="hide spinner"/>--}%
            %{--</form>--}%
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
                    <g:img dir="images" file="spinner.gif" id="spinner2" class="hide spinner"/>
                </div>
            </div>
        </form>
        <div class="span8" id="userPermissionsOutput">

        </div>
    </div>
    </body>
</html>