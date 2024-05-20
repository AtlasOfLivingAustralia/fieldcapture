<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<div class="priority-place row">
    <div class="col-md-8">
        <label class="required" for="supports-priority-place">${priorityPlaceLabel ?: 'Does this project directly support a priority place?'}
        <g:if test="${priorityPlaceHelpText}"><fc:iconHelp>${priorityPlaceHelpText}</fc:iconHelp></g:if>
        </label>
    </div>
    <div class="col-md-4">
        <select id="supports-priority-place" class="form-control form-control-sm"
                data-bind="disable: isProjectDetailsLocked(), value:details.supportsPriorityPlace, optionsCaption:'Please select...'"
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
    <br/>
    <select id="priority-place"
            multiple="multiple"
            class="form-control form-control-sm"
            data-bind="disable: isProjectDetailsLocked(), options:priorityPlaces, multiSelect2:{tags: false, value:details.supportedPriorityPlaces}"
            data-validation-engine="validate[required]">
    </select>

</div>
<!-- /ko -->