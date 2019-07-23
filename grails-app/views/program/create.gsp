<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Edit | Program | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            programSaveUrl: "${createLink(action:'ajaxUpdate')}",
            programViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            noImageUrl: "${assetPath(src:'nophoto.png')}",
            returnToUrl: "${params.returnTo}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item"><g:link controller="program" action="list">Programmes</g:link></li>
            <li class="breadcrumb-item active"> ${program.name}</li>
            <li class="breadcrumb-item active"><g:message code="program.breadcrumb.create"/></li>
        </ol>

    </nav>

    <g:render template="programDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Create</button>
        <button type="button" id="cancel" class="btn" data-bind="click:cancel">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var program = <fc:modelAsJavascript model="${program}"/>;

        var programViewModel = new ProgramViewModel(program, fcConfig);

        ko.applyBindings(programViewModel);
        $('.validationEngineContainer').validationEngine();

    });


</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="program.js"/>
<asset:deferredScripts/>

</body>


</html>