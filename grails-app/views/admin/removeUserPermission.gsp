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

<asset:stylesheet src="base.css"/>
<asset:stylesheet src="common.css"/>

</head>
<body>
<h2>Remove User From MERIT</h2>

<form id="removeUser" class=" validationEngineContainer">
    <div class="control-group required">
        <label for="email" class="control-label span2">Enter User's Email Address</label>
        <input id="email" name="email" type="text" class="form-control" value="" data-bind="value:emailAddress"
               data-validation-engine="validate[required, custom[email]]" data-errormessage-value-missing="Email is required!">
        <button class="btn btn-primary searchUserDetails" data-bind="click:searchUserDetails">Search</button>
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
            <td class="emailAddress" data-bind="text:emailAddress"></td>
            <td class="firstName" data-bind="text:firstName"></td>
            <td class="lastName" data-bind="text:lastName"></td>
            <td><button class="btn btn-danger removeUserDetails" data-bind="click:$root.removeUserDetails, disable: !(userId())">Remove</button></td>
        </tr>
    </tbody>

</table>

<asset:script>
    $(function () {

       var userDetails
        var removeUserPermission = new RemoveUserPermissionViewModel(userDetails, fcConfig);

        ko.applyBindings(removeUserPermission);
        $('.validationEngineContainer').validationEngine();
    });

</asset:script>
<asset:javascript src="base.js"/>
<asset:javascript src="common.js"/>
<asset:javascript src="admin.js"/>
<asset:deferredScripts/>

</body>


</html>
