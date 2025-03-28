<%@ page import="au.org.ala.merit.ReportService" %>
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
        bieUrl: "${grailsApplication.config.getProperty('bie.baseURL')}",
        searchBieUrl:"${createLink(controller:'species', action:'searchBie')}",
        speciesListUrl:"${createLink(controller:'speciesList', action:'speciesListItems')}",
        speciesImageUrl:"${createLink(controller:'species', action:'speciesImage')}",
        speciesProfileUrl:"${createLink(controller:'species', action:'speciesProfile')}",
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
    <g:render template="${headerTemplate}" model="${[project: project]}"/>
    <g:render template="${meriPlanChangesTemplate}" model="${[project: project, mode: au.org.ala.merit.ReportService.ReportMode.PRINT.name(), changed:changed]}"/>
    <asset:script>

    $(function() {

        var project = <fc:modelAsJavascript model="${project}"/>;
        var changed = <fc:modelAsJavascript model="${changed}"/>;

        var config = {
            bieUrl: fcConfig.bieUrl,
            searchBieUrl: fcConfig.searchBieUrl,
            speciesListUrl: fcConfig.speciesListUrl,
            speciesImageUrl: fcConfig.speciesImageUrl,
            speciesProfileUrl: fcConfig.speciesProfileUrl
        };
        var themes = <fc:modelAsJavascript model="${config.themes?:[]}"/>;
        config.themes = themes;
        var services = <fc:modelAsJavascript model="${config.services?:[]}"/>;
        config.services = services;
        var outcomes = <fc:modelAsJavascript model="${config.outcomes?:[]}"/>;
        project.outcomes = outcomes;
        config.useRlpTemplate = ${config.getProjectTemplate() == au.org.ala.merit.config.ProgramConfig.ProjectTemplate.RLP};
        var programName = '${(config.program?.acronym?: project.associatedSubProgram) ?: project.associatedProgram}';

        config.programName = "programName";
        config.programObjectives = <fc:modelAsJavascript model="${config.program?.config?.objectives ?: []}"/>;
        config.programActivities = <fc:modelAsJavascript model="${config.program?.config?.activities?.collect{it.name} ?: []}"/>;
        config.excludeFinancialYearData = ${config.program?.config?.excludeFinancialYearData ?: false};
        config.useServiceOutcomesModel = ${config.program?.config?.meriPlanContents?.find{it.template == 'serviceOutcomeTargets'} != null};

        var viewModel = new ReadOnlyMeriPlan(project, new ProjectService(project, config), config, changed);
        viewModel.name = project.name;
        viewModel.description = project.description;
        ko.applyBindings(viewModel, document.getElementById('meriplan-changes'))

        $("#meriplan-changes div").prettyTextDiff({
                cleanup: true,
                diffContainer: ".diff1"
            });

        $(".key-threats td").prettyTextDiff({cleanup: true});
        $(".extended td").prettyTextDiff({cleanup: true});
        $(".extended-threats td").prettyTextDiff({cleanup: true});
        $(".service-outcome-changed td").prettyTextDiff({cleanup: true});
        $("#national-regional-plans td").prettyTextDiff({cleanup: true});
        $("#primaryOutcome").prettyTextDiff({cleanup: true});
        $("#program-outcome-assets").prettyTextDiff({cleanup: true});
        $("#additional-benefits span").prettyTextDiff({cleanup: true});
        $("#secondary-assets").prettyTextDiff({cleanup: true});
        $("#outcome-statements td").prettyTextDiff({cleanup: true});
        $("#project-partnerships td").prettyTextDiff({cleanup: true});

        });

    </asset:script>
</div>
<g:render template="/shared/pdfInstructions"/>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:javascript src="speciesModel.js"/>
<asset:deferredScripts/>
<asset:javascript src="print-instructions.js"/>

</body>
</html>
