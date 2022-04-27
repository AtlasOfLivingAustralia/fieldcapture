<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="approach-current">Could this control approach pose a threat to Native Animals/Plants or Biodiversity?</th>
        <th class="approach-details">Details</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.controlApproach.rows">
    <tr>
        <td class="index"><span data-bind="text: $index()+1"></span></td>
        <td class="approach-current"><span data-bind="text:data1"></span></td>
        <td class="approach-details"><span data-bind="text:data2"></span></td>
    </tr>
    </tbody>
</table>