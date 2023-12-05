<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table meri-monitoring-indicators">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="baseline">Monitoring methodology</th>
        <g:if test="${extendedMonitoring}">
            <th class="monitoring-service">Project service / Target measure/s</th>
        </g:if>
        <th class="baseline-method">Monitoring method</th>
        <g:if test="${extendedMonitoring}">
            <th class="monitoring-evidence">Evidence to be retained</th>
        </g:if>
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.monitoring?.rows.size(), changed.custom.details.monitoring?.rows?.size()?:0)}"/>
    <g:each in="${(0..<1)}" var="i">
    <tr>
        <td class="index"><span data-bind="text: ${i}+1"></span></td>
        <td class="baseline"><fc:renderComparisonMonitoring changed="${changed.custom.details.monitoring.rows ?: []}" i="${i}" code="${code}" original="${project.custom.details.monitoring.rows ?: []}" property="data1"/></td>
        <td class="monitoring-service"><fc:renderComparisonMonitoring changed="${changed.custom.details.monitoring.rows ?: []}" i="${i}" code="${code}" original="${project.custom.details.monitoring.rows ?: []}" property="relatedTargetMeasures"/></td>
        <td class="monitoring-method"><fc:renderComparisonMonitoring changed="${changed.custom.details.monitoring.rows ?: []}" i="${i}" code="${code}" original="${project.custom.details.monitoring.rows ?: []}" property="protocols"/></td>
        <td class="monitoring-evidence"><fc:renderComparisonMonitoring changed="${changed.custom.details.monitoring.rows ?: []}" i="${i}" code="${code}" original="${project.custom.details.monitoring.rows ?: []}" property="evidence"/></td>
    </tr>
    </g:each>
    </tbody>
</table>