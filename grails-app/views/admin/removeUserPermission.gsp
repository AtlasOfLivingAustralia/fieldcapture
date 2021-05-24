<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Remove User Permission From Project | MERIT</title>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            returnToUrl: "${params.returnTo ?: createLink(controller: 'admin',action:'removeUserPermission')}",
            searchUserDetailsUrl: "${createLink(controller: "admin", action: "searchUserDetails")}",
            removeUserDetailsUrl:"${createLink(controller: "admin", action: "removeUserDetails")}"
        };
    </script>
<asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<h2>Remove User From MERIT</h2>
<content tag="pageTitle">Remove User from MERIT</content>

<form id="removeUser" class="validationEngineContainer">
    <div class="form-group row required">
        <label for="email" class="control-label col-sm-2">Enter User's Email Address</label>
        <div class="col-sm-3">
            <input id="email" name="email" type="text" class="form-control form-control-sm" value="" data-bind="value:emailAddress"
                   data-validation-engine="validate[required, custom[email]]" data-errormessage-value-missing="Email is required!">
        </div>
        <div class="col-sm-2">
            <button class="btn btn-primary btn-sm searchUserDetails" data-bind="click:searchUserDetails">Search</button>
        </div>

    </div>

</form>



<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>User Id</th>
            <th>Email Address</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Remove User</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td class="userId" data-bind="text:userId"></td>
            <td class="emailAddress" data-bind="text:email"></td>
            <td class="firstName" data-bind="text:firstName"></td>
            <td class="lastName" data-bind="text:lastName"></td>
            <td><button class="btn btn-sm btn-danger removeUserDetails" data-bind="click:$root.removeUserDetails, disable: !(userId())">Remove</button></td>
        </tr>
    </tbody>

</table>

<asset:script>
    $(function () {

        var removeUserPermission = new RemoveUserPermissionViewModel(fcConfig);

        ko.applyBindings(removeUserPermission);
        $('.validationEngineContainer').validationEngine();
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="admin.js"/>
<asset:deferredScripts/>

</body>
</html>
