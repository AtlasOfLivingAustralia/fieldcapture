<form id="searchUser" class="hub-form-search-box1">
    <div class="form-group row required">
        <label for="email" class="control-label col-sm-2" style="left: -14px">Enter User's Email Address</label>
        <input style="width: 250px" id="email" name="email" type="text" class="form-control form-control-sm" value="" data-bind="value:emailAddress"
               data-validation-engine="validate[required, custom[email]]" data-errormessage-value-missing="Email is required!">
    </div>
<div class="row">
<div class="col-sm-offset-10" id="hub-member-list">
        <table class="table-width" id="${containerId}">
            <thead>
                <th>User Id</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Expiry Date</th>
                <th></th>
            </thead>
        </table>
    </div>
</div>
</form>
<asset:script type="text/javascript">
    $(function () {
        ko.applyBindings(new SearchUserHubPermissionViewModel(fcConfig), document.getElementById('searchUser'));
        $('.hub-form-search-box1').validationEngine();
    });
    initialise(${raw((roles as grails.converters.JSON).toString())}, ${user?.userId}, "${hubId}", "${containerId}");

</asset:script>
<asset:javascript src="permissionTable.js"/>
<asset:javascript src="userHubPermission.js"/>