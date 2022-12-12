<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrmPrint"/>
    <title>MERI Plan - ${project.name}</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        imageLocation:"${assetPath(src:'/')}",
        healthCheckUrl:"${createLink(controller:'ajax', action:'keepSessionAlive')}",
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

    <asset:stylesheet src="common-bs4.css"/>
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
        var themes = <fc:modelAsJavascript model="${config.themes?:[]}"/>;
        config.themes = themes;
        var services = <fc:modelAsJavascript model="${config.services?:[]}"/>;
        config.services = services;
        var outcomes = <fc:modelAsJavascript model="${config.outcomes?:[]}"/>;
        project.outcomes = outcomes;
        config.useRlpTemplate = ${config.getProjectTemplate() == au.org.ala.merit.config.ProgramConfig.ProjectTemplate.RLP};
        var programName = '${(config.program?.acronym?:project.associatedSubProgram) ?: project.associatedProgram}';
        config.programName = programName;
        config.programObjectives = <fc:modelAsJavascript model="${config.program?.config?.objectives ?: []}"/>;
        config.programActivities = <fc:modelAsJavascript model="${config.program?.config?.activities?.collect{it.name} ?: []}"/>;
        config.excludeFinancialYearData = ${config.program?.config?.excludeFinancialYearData ?: false};
        var viewModel = new ReadOnlyMeriPlan(project, new ProjectService(project, config), config);
        viewModel.name = project.name;
        viewModel.description = project.description;
        ko.applyBindings(viewModel);
    });
    </asset:script>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
</body>
</html>
