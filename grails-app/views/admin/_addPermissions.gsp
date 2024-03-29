<form class="form-horizontal" id="userAccessForm">
    <div class="control-group form-group row">
        <label class="control-label col-form-label col-sm-2" for="emailAddress">User's email address</label>
        <div class="controls col-sm-2">
            <input class="form-control form-control-sm input-medium validate[required,custom[email]]" id="emailAddress" placeholder="enter a user's email address" type="text"/>
        </div>
    </div>
    <div class="control-group form-group row">
        <label class="control-label col-form-label col-sm-2" for="addUserRole">Permission level</label>
        <div class="controls col-sm-2" id="rolesSelect">
            <g:render id="addUserRole" template="/admin/userRolesSelect" model="[roles:roles, includeEmptyOption: true, selectClass:'input-medium']"/>
        </div>
    </div>
    <g:if test="${hubFlg}">
        <div class="control-group form-group row">
            <label class="control-label col-form-label col-sm-2" for="expiryDate">Permission expiry date</label>
            <div>
                <div class="input-group input-small" style="margin-left: 15px;">
                    <input class="form-control dateControl" style="height: 30px;" type="text" id="expiryDate">
                </div>
            </div>
        </div>
    </g:if>
    <g:if test="${entityId}">
        <input type='hidden' id='entityId' value='${entityId}'>
        <input type='hidden' id='containerId' value='${containerId}'>
    </g:if>
    <g:elseif test="${projects}">
        <div class="control-group">
            <label class="control-label" for="projectId">Project</label>
            <div class="controls">
                <g:select name="project" id="projectId" class="input-xlarge combobox validate[required]" from="${projects}" optionValue="name" optionKey="projectId" noSelection="['':'start typing a project name']" />
            </div>
        </div>
    </g:elseif>
    <g:else><div class="alert alert-danger">Missing model - either <code>projectId</code> or <code>projects</code> must be provided</div></g:else>
    <div class="row">
        <div class="col-sm-5">
            <div class="form-group text-center" >
                <div class="group">
                    <button id="addUserRoleBtn" class="btn btn-sm btn-primary text-center">Submit</button>
                    <asset:image src="spinner.gif" id="spinner1" class="hide d-none spinner" alt="spinner icon"/>
                </div>
            </div>
        </div>

    </div>

</form>
<div id="status" class="offset2 col-sm-7 hide d-none alert alert-success">
    <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
    <span></span>
</div>
<div class="clearfix">&nbsp;</div>
<div class="clearfix hide d-none bbAlert1">
    The email address did not match a registered user. This may because:
    <ul>
        <li>the email address is incorrect</li>
        <li>the user is not registered - see the <a href="${grailsApplication.config.getProperty('user.registration.url')}"
                                                    target='_blank' style='text-decoration: underline;'>sign-up page</a>.
        </li>
    </ul>
</div>
<asset:script>
    $(document).ready(function() {
        // combobox plugin enhanced select
        $(".combobox").combobox();
        $("#expiryDate").datepicker({format: "dd-mm-yyyy",autoclose: true});
        // Click event on "add" button to add new user to project
        $('#addUserRoleBtn').click(function(e) {
            e.preventDefault();
            var email = $('#emailAddress').val();
            var role = $('#addUserRole').val();
            var entityId = $('#entityId').val();
            var expiryDate = $('#expiryDate').val();
            if ($('#userAccessForm').validationEngine('validate')) {
                $("#spinner1").show();

                if (email) {
                    // first check email address is a valid user
                    $.get("${g.createLink(controller:'user',action:'checkEmailExists')}?email=" + email).done(function(data) {
                        if (data) {
                            addUserWithRole( data, role, entityId, expiryDate);
                        } else {
                            var $clone = $('.bbAlert1').clone();
                            bootbox.alert($clone.html());
                        }
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                    .always(function() { $(".spinner").hide(); });
                }
            }
        });

        $('#addUserRole').change(function (){
            if ($('#addUserRole').val() == "siteReadOnly") {
                var defaultExpiryDate = new Date();
                defaultExpiryDate.setMonth(defaultExpiryDate.getMonth()+6);
                $('#expiryDate').datepicker('setDate', defaultExpiryDate);
                $("#expiryDate").prop('disabled', true);
            } else {
                $('#expiryDate').datepicker('setDate', '');
                $("#expiryDate").prop('disabled', false);
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
    function addUserWithRole(userId, role, id, expiryDate) {
        if (userId && role) {
            $.ajax({
                url: '${addUserUrl}',
                data: { userId: userId, role: role, entityId: id, expiryDate: expiryDate}
            })
            .done(function(result) {
            updateStatusMessage("user was added with role " + decodeCamelCase(role));

            if ($('#containerId').val()) {
                displayAlertMessage("User was added with role " + decodeCamelCase(role));
            }

            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                bootbox.alert(jqXHR.responseText);
            })
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
        if (typeof(populatePermissionsTable) != "undefined") {
            populatePermissionsTable();
        } else {
        // Hub User's table refresh
%{--            reloadPage();--}%
        var tableSelector = "#"+$('#containerId').val()
        reloadMembers(tableSelector);
    }

}
</asset:script>
