<!-- ko stopBinding:true -->
<div id="edit-project-services">
    <h2>Services being delivered by this project</h2>

    <p>Check each service that is being delivered by this project.  Un-ticked services will not appear in project reporting forms.</p>

    <div id="services-save-result-placeholder"></div>
    <g:each in="${projectServices}" var="service">

        <label class="checkbox"><input type="checkbox" data-bind="checked:services"
                                       value="${service.name}">  ${service.name}</label>

    </g:each>

    <div class="form-actions">
        <button class="btn btn-success" data-bind="click:saveProjectServices, enable:projectServicesEdited">Save</button>
        <button class="btn" data-bind="click:undoChanges, enable:projectServicesEdited">Cancel</button>

    </div>
</div>
<!-- /ko -->

<asset:script>
    $(function() {
        var viewModel = new ProjectServicesViewModel(fcConfig.project, fcConfig);
        ko.applyBindings(viewModel, document.getElementById('edit-project-services'));
    });
</asset:script>
