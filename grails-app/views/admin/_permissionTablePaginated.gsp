<form id="searchUser" class="hub-form-search-box1">
    <label for="email" class="col-sm-offset-1">Search for email address</label>
    <div class="form-group row required">
        <div class="col-sm-4 search-box">
        <input id="email" name="email" type="text" class="form-control form-control-sm" value="" data-bind="value:emailAddress"
               data-validation-engine="validate[required, custom[email]]" data-errormessage-value-missing="Email is required!">
        </div>
        <div class="col-sm-4">
            <button type="button" id="emailBtn" class="btn btn-primary btn-sm searchUserDetails">Search</button>
            <button type="button" id="clearBtn" class="btn btn-primary btn-sm">Clear</button>
        </div>
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
        $('.hub-form-search-box1').validationEngine();
    });
    initialise(${raw((roles as grails.converters.JSON).toString())}, "${user?.userId}", "${hubId}", "${containerId}");

</asset:script>
<asset:javascript src="permissionTable.js"/>
