<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Create | Management Unit | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            managementUnitSaveUrl: "${createLink(action:'ajaxUpdate')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            noImageUrl: "${assetPath(src:'nophoto.png')}",
            returnToUrl: "${params.returnTo}",
            managementUnitViewUrl: "${createLink(action:'index')}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="managementUnit.css"/>

</head>
<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item">Management Unit</li>
            <li class="breadcrumb-item active"><g:message code="managementUnit.breadcrumb.create"/></li>
        </ol>

    </nav>

    <g:render template="managementUnitDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-sm btn-primary">Create</button>
        <button type="button" id="cancel" class="btn btn-sm btn-danger" data-bind="click:cancel">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var mu = <fc:modelAsJavascript model="${mu}"/>;

        var managementUnitViewModel = new ManagementUnitViewModel(mu, fcConfig);

        ko.applyBindings(managementUnitViewModel);
        $('.validationEngineContainer').validationEngine();
    });


</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="managementUnit.js"/>
<asset:deferredScripts/>

</body>


</html>
