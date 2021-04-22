<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Edit | Data Set Summary | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            dataSetUpdateUrl: "${createLink(action:'save', id:projectId)}",
            returnToUrl: "${g.createLink(controller:'project', action:'index', id:projectId)}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="project.css"/>

</head>
<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item"><g:link controller="project" id="${project.projectId}">Project </g:link></li>
            <li class="breadcrumb-item active">Edit data set summary</li>
        </ol>

    </nav>
    <h2>Edit data set summary</h2>
    <g:render template="editDataSet" />

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Save</button>
        <button type="button" id="cancel" class="btn" data-bind="click:cancel">Cancel</button>
        <label class="checkbox inline mark-complete">
            <input data-bind="checked:markedAsFinished" type="checkbox"> This form is complete
        </label>
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