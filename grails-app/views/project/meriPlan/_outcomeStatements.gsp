<g:if test="${title}">
    <h4>${title}</h4>
    <g:if test="${explanation}">
        <p>
            ${explanation}
        </p>
    </g:if>
</g:if>
<table class="table">
    <thead>
    <tr class="header">
        <th class="index"></th>
        <th class="outcome required">${subtitle ?: ""} <g:if test="${helpText}"><fc:iconHelp html="true" container="body">${helpText}</fc:iconHelp></g:if> </th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <td class="outcome">
            <textarea data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()" placeholder="${placeholder}"></textarea>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                   data-bind="click: $parent.removeShortTermOutcome"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="3">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: isProjectDetailsLocked(), click: addShortTermOutcome">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
