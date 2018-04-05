<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Create | Program | MERIT</title>
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
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="fileupload-9.0.0/jquery.fileupload-ui.css"/>

</head>
<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <li class="active"><g:link controller="program" action="list">Programmes</g:link> <span class="divider">/</span></li>
        <li class="active"><g:message code="program.breadcrumb.create"/></li>
    </ul>

    <g:render template="programDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Create</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var program = <fc:modelAsJavascript model="${program}"/>;

        var programViewModel = new ProgramViewModel(program, fcConfig);

        ko.applyBindings(programViewModel);
        $('.validationEngineContainer').validationEngine();

        $("#cancel").on("click", function() {
            document.location.href = "${createLink(action:'list')}";
        });

    });


</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="program.js"/>
<asset:deferredScripts/>

</body>


</html>