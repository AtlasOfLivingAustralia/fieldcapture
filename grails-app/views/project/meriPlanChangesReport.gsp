<%@ page import="au.org.ala.merit.ReportService" %>
%{--<%@ page import="HtmlDiff from 'htmldiff-js" %>--}%
%{--import HtmlDiff from 'htmldiff-js';--}%
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrmPrint"/>
    <title>MERI Plan - ${project.name}</title>
%{--    <title>MERI Plan - ${projectComparison.project.name}</title>--}%
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
%{--    <script type="text/javascript" src="js/htmldiff.js"></script>--}%
%{--    <script type="text/javascript" src="js/main.js"></script>--}%

    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        imageLocation:"${assetPath(src:'/')}",
        healthCheckUrl:"${createLink(controller:'ajax', action:'keepSessionAlive')}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"
            %{--returnTo: "${createLink(controller: 'project', action: 'index', id: projectComparison.project.projectId)}"--}%
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
    <g:render template="${headerTemplate}" model="${[project: project]}"/>
    <g:render template="${meriPlanChangesTemplate}" model="${[project: project, mode: au.org.ala.merit.ReportService.ReportMode.PRINT.name(), original:original, changed:changed]}"/>
    <asset:script>

    $(function() {

        var project = <fc:modelAsJavascript model="${project}"/>;
        var original = <fc:modelAsJavascript model="${original}"/>;
        var changed = <fc:modelAsJavascript model="${changed}"/>;

        var config = [];
        var themes = <fc:modelAsJavascript model="${config.themes?:[]}"/>;
        config.themes = themes;
        var services = <fc:modelAsJavascript model="${config.services?:[]}"/>;
        config.services = services;
        var outcomes = <fc:modelAsJavascript model="${config.outcomes?:[]}"/>;
        project.outcomes = outcomes;
        config.useRlpTemplate = ${config.getProjectTemplate() == au.org.ala.merit.config.ProgramConfig.ProjectTemplate.RLP};
        var programName = '${(config.program?.acronym?: project.associatedSubProgram) ?: project.associatedProgram}';
%{--        var programName = '${(config.program?.acronym?:projectComparison.project.associatedSubProgram) ?: projectComparison.project.associatedProgram}';--}%
        config.programName = "programName";
        config.programObjectives = <fc:modelAsJavascript model="${config.program?.config?.objectives ?: []}"/>;
        config.programActivities = <fc:modelAsJavascript model="${config.program?.config?.activities?.collect{it.name} ?: []}"/>;
        config.excludeFinancialYearData = ${config.program?.config?.excludeFinancialYearData ?: false};
        config.useServiceOutcomesModel = ${config.program?.config?.meriPlanContents?.find{it.template == 'serviceOutcomeTargets'} != null};

        var viewModel = new ReadOnlyMeriPlan(project, new ProjectService(project, config), config, original, changed);
        viewModel.name = project.name;
        viewModel.description = project.description;
        ko.applyBindings(viewModel, document.getElementById('meriplan-changes'))

%{--        var viewModel2 = new ReadOnlyMeriPlanOriginal(changed, new ProjectService(changed, config), config);--}%
%{--        viewModel2.name = changed.name;--}%
%{--        viewModel2.description = changed.description;--}%
%{--        ko.applyBindings(viewModel2, document.getElementById('meriplan-changes'))--}%


%{--        below snippet is causing error - "You cannot apply bindings multiple times to the same element"--}%
%{--        var viewModelOriginal = new ReadOnlyMeriPlanOriginal(original, new ProjectService(original, config), config);--}%
%{--        viewModelOriginal.name = original.name;--}%
%{--        viewModelOriginal.description = original.description;--}%
%{--        ko.applyBindings(viewModelOriginal);--}%

        $("#meriplan-changes div").prettyTextDiff({
                cleanup: true,
                diffContainer: ".diff1"
            });

        $(".key-threats td").prettyTextDiff({cleanup: true});
        $(".extended-threats td").prettyTextDiff({cleanup: true});
        $("#nationalAndRegionalPlans td").prettyTextDiff({cleanup: true});
        $("#primaryOutcome").prettyTextDiff({cleanup: true});
        $("#assetsx span").prettyTextDiff({cleanup: true});
        $("#secondaryOutcomes span").prettyTextDiff({cleanup: true});
        $("#secondaryAssets").prettyTextDiff({cleanup: true});


        });

    </asset:script>
</div>
<g:render template="/shared/pdfInstructions"/>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
<asset:javascript src="print-instructions.js"/>

</body>
</html>
