<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrmPrint"/>
    <title>MERI Plan - ${project.name}</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        imageLocation:"${assetPath(src:'/')}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"
    },
        here = window.location.href;

    </script>
    <style type="text/css">
    .title { font-weight: bold;}
    .activity-title {
        border-top: 4px solid black;
        background-color: #d9edf7;
        border-bottom: 1px solid;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
    .output-block > h3 {
        font-size:large;
    }
    .output-section.stage-title {
        padding:10px;
        border-top: 4px solid black;
    }
    tr {
        page-break-inside: avoid;
    }
    </style>

    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="project.css"/>
</head>
<body>
<div class="container">
    <g:render template="/project/projectDetails" model="[project: project]"/>
    <asset:script>
    $(function() {
        var project = <fc:modelAsJavascript model="${project}"/>;
        var themes = <fc:modelAsJavascript model="${themes}"/>;
        var viewModel = new MERIPlan(project, themes, '');
        ko.applyBindings(viewModel);
    });
    </asset:script>
</div>
<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
</body>
</html>