<table class="table related-projects">
    <thead>
    <tr class="header required">
        <th class="required">${title ?: "Related Projects"}<fc:iconHelp>${helpText ?: "Please identify how this project relates to previous or existing bushfire recovery efforts. For closely related projects, please also indicate why this project complements and does not duplicate existing work"}</fc:iconHelp></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><textarea class="form-control col-sm-12" rows="5"
                      data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                      data-bind="value:details.relatedProjects, disable: isProjectDetailsLocked()"
                      placeholder="${placeholder ?: ""}"></textarea></td>
    </tr>
    </tbody>
</table>
