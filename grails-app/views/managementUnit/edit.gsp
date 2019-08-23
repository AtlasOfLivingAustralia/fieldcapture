<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Edit | Management Unit | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            managementUnitSaveUrl: "${createLink(action:'ajaxUpdate', id:mu.managementUnitId)}",
            programViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            noImageUrl: "${assetPath(src:'nophoto.png')}",
            returnToUrl: "${params.returnTo ?: createLink(action:'index', id:mu.managementUnitId)}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="program.css"/>


</head>
<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item"> Management Unit </li>
            <li class="breadcrumb-item active"><g:link controller="ManagementUnit" action="index" id="${mu.managementUnitId}">${mu.name}</g:link> </li>
            <li class="breadcrumb-item active"><g:message code="program.breadcrumb.edit"/></li>
        </ol>

    </nav>


    <g:render template="programDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Save</button>
        <button type="button" id="cancel" class="btn" data-bind="click:cancel">Cancel</button>
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