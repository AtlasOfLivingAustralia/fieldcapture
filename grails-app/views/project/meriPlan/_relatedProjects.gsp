<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr class="header required">
            <th class="required">${title ?: "Related Projects"}<fc:iconHelp> ${helpText?: "Please identify how this project relates to previous, or existing, bushfire recovery efforts. For closely related projects, please also indicate why this project complements and does not duplicate existing work"}</fc:iconHelp></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.relatedProjects, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4 class="header-with-help">${title ?: "Related Projects"}</h4><fc:iconHelp>${helpText?: "Please identify how this project relates to previous, or existing, bushfire recovery efforts. For closely related projects, please also indicate why this project complements and does not duplicate existing work"}</fc:iconHelp>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="relatedProjects row-fluid">
        <textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.relatedProjects, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
    </div>
</g:else>
