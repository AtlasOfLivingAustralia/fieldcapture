<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Edit | Data Set Summary | MERIT</title>
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
    <asset:stylesheet src="select2-theme-bootstrap4/select2-bootstrap.css"/>
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
            <li class="breadcrumb-item active">Edit data set summary</li>
        </ol>

    </section>
    <h2>Edit data set summary</h2>
    <g:render template="editDataSet" />

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-sm btn-primary">Save</button>
        <button type="button" id="cancel" class="btn btn-sm btn-danger" data-bind="click:cancel">Cancel</button>
        <label class="checkbox inline mark-complete">
            <input data-bind="checked:markedAsFinished" type="checkbox"> This form is complete
        </label>
    </div>
</div>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projectService.js"/>
<asset:javascript src="select2/js/select2.full.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="dataSets.js"/>
<script>
    var project = {};
    var dataSet = <fc:modelAsJavascript model="${dataSet}"/>;
    var projectService = new ProjectService(project, fcConfig);
    var config = _.extend(fcConfig, {endDateSelector:"#endDate"});
    config.projectOutcomes = <fc:modelAsJavascript model="${projectOutcomes}" default="[]"/>;
    config.projectBaselines = <fc:modelAsJavascript model="${projectBaselines}" default="[]"/>;
    config.projectProtocols = <fc:modelAsJavascript model="${projectProtocols}" default="[]"/>;
    config.invalidNames = <fc:modelAsJavascript model="${dataSetNames}" default="[]"/>;
    config.serviceBaselineIndicatorOptions = <fc:modelAsJavascript model="${serviceBaselineIndicatorOptions}" default="{}"/>;
    var viewModel = new DataSetViewModel(dataSet, projectService, config);
    $.fn.select2.defaults.set( "theme", "bootstrap" );
    ko.applyBindings(viewModel);
    viewModel.attachValidation();
</script>
<asset:deferredScripts/>
</body>



</html>
