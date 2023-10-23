<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<div class="priority-place row">
    <div class="col-sm-8">
        ${priorityPlaceLabel ?: 'Does this project directly support a priority place?'}
        <g:if test="${priorityPlaceHelpText}"><fc:iconHelp>${priorityPlaceHelpText}</fc:iconHelp></g:if>
    </div>
    <div class="col-sm-4">
        <span style="display: none" class="original" data-bind="text:details.supportsPriorityPlace"></span>
        <span style="display: none" class="changed" data-bind="text:detailsChanged.supportsPriorityPlace"></span>
        <span wrap class="diff1"></span>

    </div>
</div>


    <!-- ko if:detailsChanged.supportsPriorityPlace() == 'Yes' -->
<div class="row">
    <div class="col-sm-8">Please select the supported priority places</div>
    <div class="col-sm-4">
        <span style="display: none" class="original" data-bind="text:details.supportedPriorityPlaces"></span>
        <span style="display: none" class="changed" data-bind="text:detailsChanged.supportedPriorityPlaces"></span>
        <span wrap class="diff1"></span>
    </div>
</div>
    <!-- /ko -->
