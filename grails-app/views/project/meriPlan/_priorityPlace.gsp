<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<div class="priority-place row">
    <div class="col-md-8">
        Does this project directly support a priority place?
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm"
                data-bind="value:details.priorityPlace, optionsCaption:'Please select...'"
                data-validation-engine="validate[required]">
            <option value="">Please select...</option>
            <option>Yes</option>
            <option>No</option>
        </select>
    </div>
</div>