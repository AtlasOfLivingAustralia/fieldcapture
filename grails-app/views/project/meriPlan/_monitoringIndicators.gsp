<div class="meri-monitoring-indicators">
    <g:if test="${title}">
        <h4>${title}</h4>
    </g:if>

        <table class="table">
            <thead>
            <tr>
                <th class="index"></th>
                <g:if test="${monitoringValidation}">
                    <th class="baseline required">${indicatorHeading} <g:if test="${indicatorHelpText}"><fc:iconHelp title="${indicatorHeading}">${indicatorHelpText}</fc:iconHelp></g:if></th>
                    <g:if test="${extendedMonitoring}">
                        <th class="monitoring-service">Service / Target Measure</th>
                    </g:if>
                    <th class="baseline-method required">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
                    <g:if test="${extendedMonitoring}">
                        <th class="monitoring-evidence">Evidence</th>
                    </g:if>
                </g:if>
                <g:else>
                    <th class="baseline">${indicatorHeading} <g:if test="${indicatorHelpText}"><fc:iconHelp title="${indicatorHeading}">${indicatorHelpText}</fc:iconHelp></g:if></th>
                    <th class="baseline-method">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
                </g:else>
                <th class="remove"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : ${indictorSelectorExpression?:'details.objectives.rows'}">
            <tr>
                <td class="index"> <span data-bind="text:$index()+1"></span></td>
                <g:if test="${monitoringValidation}">
                    <td class="baseline">
                        <textarea class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="value: data1, disable: $root.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea>
                    </td>
                    <g:if test="${extendedMonitoring}">
                        <td class="monitoring-service">
                            <select multiple="true" class="form-control form-control-sm" data-bind="options:$root.allServices, optionsText:'label', optionsValue:'scoreId', multiSelect2:{value:relatedServices}"></select>
                        </td>

                    </g:if>
                    <td class="baseline-method"> <textarea class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="value: data2, disable: $root.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
                    <g:if test="${extendedMonitoring}">
                        <td class="monitoring-evidence">
                            <textarea data-bind="value:evidence" rows="3"></textarea>
                        </td>
                    </g:if>
                </g:if>
                <g:else>
                    <td class="baseline"> <textarea class="form-control form-control-sm" data-bind="value: data1, disable: $root.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea></td>
                    <td class="baseline-method"> <textarea class="form-control form-control-sm" data-bind="value: data2, disable: $root.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
                </g:else>
                <td class="remove">
                    <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="fa fa-remove" data-bind="click: ${removeIndictorExpression?:'$root.removeObjectives'}"></i></span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="${extendedMonitoring ? '6' : '5'}">
                    <button type="button" class="btn btn-sm" data-bind="disable:$root.isProjectDetailsLocked(), click: ${addIndictorExpression?:'addObjectives'}">
                        <i class="fa fa-plus"></i> ${newIndicatorText ?: 'Add a row'}</button>
                </td>
            </tr>
            </tfoot>
        </table>
</div>
