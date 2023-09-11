<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>View | Data Set Summary | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            dataSetUpdateUrl: "${createLink(action:'save', id:projectId)}",
            viewSiteUrl: "${createLink(controller: 'site', action:'index')}",
            returnToUrl: "${g.createLink(controller:'project', action:'index', id:projectId)}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="dataSets.css"/>

</head>
<body>
<div class="${containerType}">
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item"><g:link controller="project" id="${project.projectId}">Project </g:link></li>
            <li class="breadcrumb-item active">View data set summary</li>
        </ol>

    </section>
    <h2>View data set summary</h2>
    <g:render template="viewDataSet" />

    <div class="form-actions">
        <button type="button" id="cancel" class="btn btn-sm" data-bind="click:cancel">Return</button>
    </div>
</div>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projectService.js"/>
<asset:javascript src="dataSets.js"/>
<script>
    var project = {};
    var dataSet = <fc:modelAsJavascript model="${dataSet}"/>;
    var projectService = new ProjectService(project, fcConfig);
    var config = _.extend(fcConfig, {endDateSelector:"#endDate"});
    var viewModel = new DataSetViewModel(dataSet, projectService, fcConfig);
    ko.applyBindings(viewModel);
</script>
<asset:deferredScripts/>
</body>



</html>
