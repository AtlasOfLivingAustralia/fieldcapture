<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${(grailsApplication.config.layout.skin?:'main')+'Print'}"/>
    <title>MERI Plan - ${project.name}</title>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        imageLocation:"${resource(dir:'/images')}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"
    },
        here = window.location.href;

    </r:script>
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

    <r:require modules="knockout, activity, jqueryValidationEngine, merit_projects, pretty_text_diff"/>
</head>
<body>
<div class="container">
    <g:render template="/project/projectDetails" model="[project: project]"/>
    <r:script>
    $(function() {
        var project = <fc:modelAsJavascript model="${project}"/>;
        var themes = <fc:modelAsJavascript model="${themes}"/>;
        var viewModel = new MERIPlan(project, themes, '');
        ko.applyBindings(viewModel);
    });
    </r:script>
</div>
</body>
</html>