<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="method-current">Are there any current control methods for this pest?</th>
        <th class="method-success">Has it been successful?</th>
        <th class="method-type">Type of method</th>
        <th class="method-details">Details</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.controlMethod.rows">
    <tr>
        <td class="index"><span data-bind="text: $index()+1"></span></td>
        <td class="method-current"><span data-bind="text:data1"></span></td>
        <td class="method-success"><span data-bind="text:data2"></span></td>
        <td class="method-type"><span data-bind="text:data3"></span></td>
        <td class="method-details"><span data-bind="text:data4"></span></td>
    </tr>
    </tbody>
</table>