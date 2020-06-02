<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table meri-monitoring-indicators">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="baseline">Monitoring indicator</th>
        <th class="baseline-method">Monitoring approach</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.objectives.rows">
    <tr>
        <td class="index"><span data-bind="text: $index()+1"></span></td>
        <td class="baseline"><span data-bind="text:data1"></span></td>
        <td class="baseline-method"><span data-bind="text:data2"></span></td>
    </tr>
    </tbody>
</table>