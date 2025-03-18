<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr>
            <th>${projectDescHeading ?: 'Project description'}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span class="description" data-bind="text:details.description"></span></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4>${projectDescHeading ?: 'Project description'}</h4>
    <span class="description" data-bind="text:details.description"></span>
</g:else>

