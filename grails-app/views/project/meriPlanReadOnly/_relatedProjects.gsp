<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr class="header required">
            <th class="required">${title ?: "Related Projects"}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span data-bind="text:details.relatedProjects"></span></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4 class="header-with-help">${title ?: "Related Projects"}</h4>
    <div class="relatedProjects row-fluid">
        <span class="span12" data-bind="text:details.relatedProjects"></span>
    </div>
</g:else>
