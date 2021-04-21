<div class="meri-monitoring-indicators">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table">
            <thead>
            <tr>
                <th class="index"></th>
                <g:if test="${monitoringValidation == true}">
                    <th class="baseline required">${indicatorHeading} <g:if test="${indicatorHelpText}"><fc:iconHelp title="${indicatorHeading}">${indicatorHelpText}</fc:iconHelp></g:if></th>
                    <th class="baseline-method required">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
                </g:if>
                <g:else>
                    <th class="baseline">${indicatorHeading} <g:if test="${indicatorHelpText}"><fc:iconHelp title="${indicatorHeading}">${indicatorHelpText}</fc:iconHelp></g:if></th>
                    <th class="baseline-method">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
                </g:else>
                <th class="remove"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.objectives.rows">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <g:if test="${monitoringValidation == true}">
                    <td class="baseline"> <textarea class="form-control" data-validation-engine="validate[required]" data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea></td>
                    <td class="baseline-method"> <textarea class="form-control" data-validation-engine="validate[required]" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
                </g:if>
                <g:else>
                    <td class="baseline"> <textarea class="form-control" data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea></td>
                    <td class="baseline-method"> <textarea class="form-control" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
                </g:else>
                <td class="remove">
                    <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove" data-bind="click: $parent.removeObjectives"></i></span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="5">
                    <button type="button" class="btn btn-sm" data-bind="disable:isProjectDetailsLocked(), click: addObjectives">
                        <i class="fa fa-plus"></i> Add a row</button>
                </td>
            </tr>
            </tfoot>
        </table>
</div>
