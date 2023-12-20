<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table meri-monitoring-indicators">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="baseline">${indicatorHeading}</th>
        <g:if test="${extendedMonitoring}">
            <th class="monitoring-service">${monitoringServicesHeading ?: 'Project service / Target measure/s'}</th>
        </g:if>
        <th class="baseline-method">${approachHeading}</th>
        <g:if test="${extendedMonitoring}">
            <th class="monitoring-evidence">Evidence to be retained</th>
        </g:if>
    </tr>
    </thead>
    <tbody data-bind="foreach : ${indictorSelectorExpression?:'details.objectives.rows'}">
    <tr>
        <td class="index"><span data-bind="text: $index()+1"></span></td>
        <td class="baseline"><span data-bind="text:data1"></span></td>
        <g:if test="${extendedMonitoring}">
            <td class="monitoring-service">
                <g:render template="/project/meriPlanReadOnly/arrayAsList" model="${[source:'$root.targetMeasureLabels(relatedTargetMeasures)']}"/>
            </td>
        </g:if>
        <td class="monitoring-method">
        <g:if test="${extendedMonitoring}">
            <g:render template="/project/meriPlanReadOnly/arrayAsList" model="${[source:'protocols']}"/>
            <br/>
            <span data-bind="visible:_.contains(protocols(), 'Other'), text: data2"></span>

        </g:if>
        <g:else>
            <span data-bind="text:data2"></span>
        </g:else>
        </td>
        <g:if test="${extendedMonitoring}">
            <td class="monitoring-evidence">
                <span class="textarea-view" data-bind="text:evidence"></span>
            </td>
        </g:if>
    </tr>
    </tbody>
</table>