<g:set var="outcomeType" value="${outcomeType ?: 'short'}"/>
<g:if test="${title}">
    <h4>${title}</h4>
    <g:if test="${explanation}">
        <p>
            ${explanation}
        </p>
    </g:if>
</g:if>
<table class="table ${extendedOutcomes ? 'extended' :''}">
    <thead>
    <tr class="header">
        <g:if test="${!extendedOutcomes}">
            <th class="index"></th>
        </g:if>
        <g:else>
            <th class="code"></th>
        </g:else>
        <th class="outcome required">${subtitle ?: ""} <g:if test="${helpText}"><fc:iconHelp html="true" container="body">${helpText}</fc:iconHelp></g:if> </th>
        <g:if test="${extendedOutcomes}">
            <th class="investment-priority required">${investmentPriorityHeading ?: 'Investment priority'}</th>
            <th class="program-outcome required">${programOutcomeHeading ?: 'Related program outcome'}</th>
        </g:if>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.${outcomeType}TermOutcomes">
    <tr>
        <g:if test="${!extendedOutcomes}">
            <td class="index" data-bind="text:$index()+1"></td>
        </g:if>
        <g:else>
            <td class="code"><span data-bind="text:code"></span></td>
        </g:else>
        <td class="outcome">
            <textarea class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()" placeholder="${placeholder}"></textarea>
        </td>
        <g:if test="${extendedOutcomes}">
            <g:if test="${multiplePriorities}">
                <td class="investment-priority">
                    <select multiple="multiple" class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectedPrimaryAndSecondaryPriorities, multiSelect2:{preserveColumnWidth:25, value:assets, tags:false}, disable: $parent.isProjectDetailsLocked()"></select>
                </td>
            </g:if>
            <g:else>
            <td class="investment-priority">
                <select class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectedPrimaryAndSecondaryPriorities,value:asset, optionsCaption:'Please select...', disable: $parent.isProjectDetailsLocked()"></select>
            </td>
            </g:else>
            <td class="program-outcome">
                <select class="form-control form-control-sm dropdown-right" data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectable${outcomeType.capitalize()}TermOutcomes, optionsCaption:'Please select...', value:relatedOutcome, select2:{preserveColumnWidth:25}, disable: $parent.isProjectDetailsLocked()"></select>
            </td>
        </g:if>
        <td class="remove">
            <span data-bind="if: $index() >= ${(minimumNumberOfOutcomes != null) ? minimumNumberOfOutcomes : 1} && !$parent.isProjectDetailsLocked()">
                <i class="fa fa-remove" data-bind="click: $parent.remove${outcomeType.capitalize()}TermOutcome"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="${extendedOutcomes ? '5' : '3'}">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: isProjectDetailsLocked(), click: add${outcomeType.capitalize()}TermOutcome">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
