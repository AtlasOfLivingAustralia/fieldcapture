<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>${project.name} | Species | Field Capture</title>
    <r:require modules="jquery_ui, jquery_bootstrap_datatable"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">

    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><g:link controller="project" action="index" id="${project.projectId}">${project.name}</g:link> <span class="divider">/</span></li>
    </ul>
    <div class="row-fluid">
        <div class="page-header">
            <h1 data-bind="text: name">Species</h1>
        </div>
    </div>

    <div id="availableSpeciesLists" class="row-fluid">
        <div class="span12 well list-box">
            <h3 class="pull-left">Available Lists</h3>
            <span id="project-filter-warning" class="label filter-label label-warning hide pull-left">Filtered</span>
            <div class="control-group pull-right dataTables_filter">
                <div class="input-append">
                    <g:textField class="filterinput input-medium" data-target="project"
                                 title="Type a few characters to restrict the list." name="projects"
                                 placeholder="filter"/>
                    <button type="button" class="btn clearFilterBtn"
                            title="clear"><i class="icon-remove"></i></button>
                </div>
            </div>

            <div class="scroll-list clearfix" id="projectList">
                <table class="accordion" id="speciesLists">
                    <thead class="hide"><tr><th>Name</th><th></th><th></th></tr></thead>
                    <tbody>

                    </tbody>
                </table>
            </div>

        </div>
    </div>
</div>
</body>
</html>