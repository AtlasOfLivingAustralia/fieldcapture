<r:require modules="bootstrap_combo"/>
<h4>Add Permissions</h4>
<form class="form-horizontal" id="userAccessForm">
    <div class="control-group">
        <label class="control-label" for="emailAddress">User's email address</label>
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
    <g:if test="${projectId}">
        <input type='hidden' id='projectId' value='${projectId}'/>
    </g:if>
    <g:elseif test="${projects}">
        <div class="control-group">
            <label class="control-label" for="projectId">Project</label>
            <div class="controls">
                <g:select name="project" id="projectId" class="input-xlarge combobox validate[required]" from="${projects}" optionValue="name" optionKey="projectId" noSelection="['':'start typing a project name']" />
            </div>
        </div>
    </g:elseif>
    <g:else><div class="alert alert-error">Missing model - either <code>projectId</code> or <code>projects</code> must be provided</div></g:else>
    <div class="control-group">
        <div class="controls">
            <button id="addUserRoleBtn" class="btn btn-primary">Submit</button>
            <g:img dir="images" file="spinner.gif" id="spinner1" class="hide spinner"/>
        </div>
    </div>
</form>
<div id="status" class="offset2 span7 hide alert alert-success">
    <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
    <span></span>
</div>
<div class="clearfix">&nbsp;</div>
<div class="clearfix hide bbAlert1">
    The email address did not match a registered user. This may because:
    <ul>
        <li>the email address is incorrect</li>
        <li>the user is not registered - see the <a href='http://auth.ala.org.au/emmet/selfRegister.html'
                target='_blank' style='text-decoration: underline;'>sign-up page</a>.
        </li>
    </ul>
</div>
<r:script>
    $(document).ready(function() {
        // combobox plugin enhanced select
        $(".combobox").combobox();

        // Click event on "add" button to add new user to project
        $('#addUserRoleBtn').click(function(e) {
            e.preventDefault();
            var email = $('#emailAddress').val();
            var role = $('#addUserRole').val();
            var projectId = $('#projectId').val();

            if ($('#userAccessForm').validationEngine('validate')) {
                $("#spinner1").show();

                if (email) {
                    // first check email address is a valid user
                    $.get("${g.createLink(controller:'user',action:'checkEmailExists')}?email=" + email, function(data) {
                        if (data && /^\d+$/.test(data)) {
                            addUserWithRole(data, role, projectId);
                        } else {
                            var $clone = $('.bbAlert1').clone();
                            bootbox.alert($clone.show());
                        }
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                    .always(function() { $(".spinner").hide(); });
                }
            }
        });
    }); // end document ready

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
            .always(function(result) { resetAddForm(); });
        } else {
            alert("Required fields are: userId and role.");
            $('.spinner').hide();
        }
    }

    function updateStatusMessage(msg) {
        $('#status span').text(''); // clear previous message
        $('#status span').text(msg).parent().fadeIn();
    }

    function resetAddForm() {
        $(".spinner").hide();
        $("#userAccessForm")[0].reset();
        if ($("#projectId").data('combobox')) {
            $("#projectId").data('combobox').toggle(); // reset combobox
        }
        // project page - trigger user table refresh
        if (typeof(loadProjectMembers) != "undefined") {
            loadProjectMembers();
        }

    }
</r:script>