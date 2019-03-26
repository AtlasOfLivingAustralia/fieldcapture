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
    <g:render template="${headerTemplate}" model="${[project:project]}"/>
    <g:render template="${meriPlanTemplate}" model="${[project: project]}"/>
    <asset:script>
    $(function() {
        var project = <fc:modelAsJavascript model="${project}"/>;

        var config = [];
        var themes = ${config.themes?:[]};
        config.themes = themes;
        var services = ${config.services?:[]};
        config.services = services;
        var outcomes = ${config.outcomes?:[]};
        project.outcomes = outcomes;
        config.useRlpTemplate = services.length > 0;
        var viewModel = new MERIPlan(project, config);
        viewModel.description = project.description;
        ko.applyBindings(viewModel);
    });
    </asset:script>
</div>
<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
</body>
</html>