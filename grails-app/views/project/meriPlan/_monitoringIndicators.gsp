<div class="meri-monitoring-indicators">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>
    <table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="baseline">${indicatorHeading} <g:if test="${indicatorHelpText}"><fc:iconHelp title="${indicatorHeading}">${indicatorHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline-method">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.objectives.rows">
    <tr>
        <td class="index"> <span data-bind="text:$index()+1"></span></td>
        <td class="baseline"> <textarea data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea></td>
        <td class="baseline-method"> <textarea data-bind="value: data2, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove" data-bind="click: $parent.removeObjectives"></i></span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="5">
            <button type="button" class="btn btn-small" data-bind="disable:isProjectDetailsLocked(), click: addObjectives">
                <i class="icon-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>
</div>