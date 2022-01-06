<form id="searchUser" class="hub-form-search-box">
    <div class="form-group row required">
        <label for="email" class="control-label col-sm-3">Email Address</label>
        <div class="col-sm-3">
            <input id="email" name="email" type="text" class="form-control form-control-sm" value="" data-bind="value:emailAddress"
                   data-validation-engine="validate[required, custom[email]]" data-errormessage-value-missing="Email is required!">
        </div>
        <div class="col-sm-2">
                        <button class="btn btn-primary btn-sm searchUserDetails">Search</button>
%{--            <button class="btn btn-primary btn-sm searchUserDetails" data-bind="click:searchUserDetails">Search</button>--}%
        </div>

    </div>
    <g:if test="${hubId}">
        <input type='hidden' id='hubId' value='${hubId}'>
        <input type='hidden' id='containerId' value='${containerId}'>
    </g:if>
</form>

<asset:script type="text/javascript">
    $(function () {
    ko.applyBindings(new SearchUserHubPermissionViewModel(fcConfig), document.getElementById('searchUser'));
    $('.hub-form-search-box').validationEngine();
});
</asset:script>
<asset:javascript src="userHubPermission.js"/>
<asset:javascript src="permissionTable.js"/>