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
                        <th class="monitoring-service required">${monitoringServicesHeading ?: 'Project service / Target measure/s'} <g:if test="${monitoringServiceHelpText}"><fc:iconHelp html="true">${monitoringServiceHelpText}</fc:iconHelp></g:if></th>
                    </g:if>
                    <th class="baseline-method required">${approachHeading} <g:if test="${approachHelpText}"><fc:iconHelp html="true" title="${approachHeading}">${approachHelpText}</fc:iconHelp></g:if></th>
                    <g:if test="${extendedMonitoring}">
                        <th class="monitoring-evidence required">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
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
                        <textarea
                                class="form-control form-control-sm"
                                data-validation-engine="validate[required]"
                                data-bind="value: data1, disable: $root.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea>
                    </td>
                    <g:if test="${extendedMonitoring}">
                        <td class="monitoring-service">
                            <select multiple="multiple"
                                    class="form-control form-control-sm"
                                    data-validation-engine="validate[required]"
                                    data-bind="options:$root.monitoringTargetMeasures, optionsText:'label', optionsValue:'scoreId', multiSelect2:{tags:false, value:relatedTargetMeasures, preserveColumnWidth:20}, disable: $root.isProjectDetailsLocked()"></select>
                        </td>
                        <td class="monitoring-method">
                            <select multiple="multiple"
                                    class="form-control form-control-sm"
                                    data-validation-engine="validate[required]"
                                    data-bind="options:$root.monitoringProtocols, optionsText:'label', optionsValue:'value', multiSelect2:{tags:false, value:protocols, preserveColumnWidth:20}, optionsCaption:'Please select...', disable: $root.isProjectDetailsLocked()">
                            </select>

                            <!-- ko if: _.contains(protocols(), 'Other') -->
                            <textarea
                                    class="form-control form-control-sm"
                                    data-validation-engine="validate[required]"
                                    placeholder="Details of method here..."
                                    data-bind="value: data2, disable: $root.isProjectDetailsLocked()"
                                    rows="4"></textarea>
                            <!-- /ko -->
                        </td>
                    </g:if>
                    <g:else>
                    <td class="baseline-method">
                        <textarea
                                class="form-control form-control-sm"
                                data-validation-engine="validate[required]"
                                data-bind="value: data2, disable: $root.isProjectDetailsLocked()"
                                rows="5"
                                placeholder="${approachPlaceHolder}"></textarea>
                    </td>
                    </g:else>
                    <g:if test="${extendedMonitoring}">
                        <td class="monitoring-evidence">
                            <textarea class="form-control form-control-sm"
                                      data-validation-engine="validate[required]"
                                      data-bind="value:evidence, disable: $root.isProjectDetailsLocked()"
                                      rows="3"
                                      data-validation-engine="validate[required,maxSize[4000]]"></textarea>
                        </td>
                    </g:if>
                </g:if>
                <g:else>
                    <td class="baseline"> <textarea class="form-control form-control-sm" data-bind="value: data1, disable: $root.isProjectDetailsLocked()" rows="3" placeholder="${indicatorPlaceHolder}"> </textarea></td>
                    <td class="baseline-method"> <textarea class="form-control form-control-sm" data-bind="value: data2, disable: $root.isProjectDetailsLocked()" rows="5" placeholder="${approachPlaceHolder}"></textarea> </td>
                </g:else>
                <td class="remove">
                    <span data-bind="if: $index() >= ${numberOfMandatoryRows != null ? numberOfMandatoryRows : 1} && !$root.isProjectDetailsLocked()"><i class="fa fa-remove" data-bind="click: ${removeIndictorExpression?:'$root.removeObjectives'}"></i></span>
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
