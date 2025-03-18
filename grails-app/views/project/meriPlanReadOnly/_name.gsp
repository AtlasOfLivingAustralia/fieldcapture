<g:if test="${tableFormatting}">
<table class="table">
    <thead>
    <tr>
        <th>${projectNameHeading?:"Project name"}</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><span data-bind="text:details.name"></span></td>
    </tr>
    </tbody>
</table>
</g:if>
<g:else>
<h4>${projectNameHeading?:"Project name"}</h4>
<span data-bind="text:details.name"></span>
</g:else>
