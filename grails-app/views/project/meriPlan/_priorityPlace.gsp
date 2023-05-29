<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<div class="priority-place row">
    <div class="col-md-8">
        <label class="required" for="supports-priority-place">Does this project directly support a priority place?</label>
    </div>
    <div class="col-md-4">
        <select id="supports-priority-place" class="form-control form-control-sm"
                data-bind="value:details.supportsPriorityPlace, optionsCaption:'Please select...'"
                data-validation-engine="validate[required]">
            <option value="">Please select...</option>
            <option>Yes</option>
            <option>No</option>
        </select>
    </div>
</div>
<!-- ko if:details.supportsPriorityPlace() == 'Yes' -->
<div class="form-group">

    <label class="required" for="priority-place">Please select the supported priority places</label>
    <select id="priority-place"
            multiple="multiple"
            class="form-control form-control-sm"
            data-bind="disable: isProjectDetailsLocked(), options:priorityPlaces, multiSelect2:{value:details.supportedPriorityPlaces}"
            data-validation-engine="validate[required]">
        <option>Leading</option>
        <option>Participating</option>
        <option>Partnership</option>
    </select>

</div>
<!-- /ko -->