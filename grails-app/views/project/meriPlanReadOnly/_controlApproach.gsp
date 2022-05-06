<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table">
    <thead>
    <tr>
        <th class="approach-current">Could this control approach pose a threat to Native Animals/Plants or Biodiversity?</th>
        <th class="approach-details">Details</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.threatToNativeSpecies.rows">
    <tr>
        <td class="approach-current"><span data-bind="text:couldBethreatToSpecies"></span></td>
        <td class="approach-details"><span data-bind="text:details"></span></td>
    </tr>
    </tbody>
</table>