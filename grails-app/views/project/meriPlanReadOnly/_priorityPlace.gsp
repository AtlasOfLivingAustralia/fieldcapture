<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<div class="priority-place row">
    <div class="col-sm-8">
        Does this project directly support a priority place?
    </div>
    <div class="col-sm-4">
        <span data-bind="text:details.supportsPriorityPlace"></span>
    </div>
</div>
<!-- ko if:details.supportsPriorityPlace() == 'Yes' -->
<div class="form-group">

    <label>Please select the supported priority places</label>
    <span data-bind="text:details.supportedPriorityPlaces">
    </span>

</div>
<!-- /ko -->