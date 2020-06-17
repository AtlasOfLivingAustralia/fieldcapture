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
            programSaveUrl: "${createLink(action:'ajaxUpdate', id:program.programId)}",
            programViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            noImageUrl: "${assetPath(src:'nophoto.png')}",
            returnToUrl: "${params.returnTo ?: createLink(controller: 'program',action:'index', id:program.programId)}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="program.css"/>
    <asset:stylesheet src="select2/4.0.3/css/select2.css"/>
    <asset:stylesheet src="select2-bootstrap4/select2-bootstrap4.css"/>


</head>
<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item active"><g:link controller="program" action="index" id="${program.programId}">${program.name}</g:link> </li>
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

        var program = <fc:modelAsJavascript model="${program}"/>;
        program.parentProgramId = "${program.parent.programId}"

        var programViewModel = new ProgramViewModel(program, fcConfig);

        ko.applyBindings(programViewModel);
        $('.validationEngineContainer').validationEngine();

         $('.parentProgramId').select2({theme: "bootstrap4"});
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="program.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="select2/4.0.3/js/select2.full"/>
<asset:deferredScripts/>

</body>


</html>
