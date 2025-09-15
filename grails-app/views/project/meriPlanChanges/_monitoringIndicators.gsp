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
    <tbody>
    <g:set var="max" value="${Math.max(originalMonitoring.size(), changedMonitoring.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">
    <tr>
        <td class="index"><span data-bind="text: ${i}+1"></span></td>
        <td class="baseline"><fc:renderComparisonList config="${config}" changed="${changedMonitoring ?: []}" i="${i}" code="${code}" original="${originalMonitoring ?: []}" property="data1"/></td>
        <td class="monitoring-service"><fc:renderComparisonList config="${config}" changed="${changedMonitoring ?: []}" i="${i}" code="${code}" original="${originalMonitoring ?: []}" property="relatedTargetMeasures"/></td>
        <td class="monitoring-method"><fc:renderComparisonList config="${config}" changed="${changedMonitoring ?: []}" i="${i}" code="${code}" original="${originalMonitoring ?: []}" property="protocols"/></td>
        <td class="monitoring-evidence"><fc:renderComparisonList config="${config}" changed="${changedMonitoring ?: []}" i="${i}" code="${code}" original="${originalMonitoring ?: []}" property="evidence"/></td>
    </tr>
    </g:each>
    </tbody>
</table>