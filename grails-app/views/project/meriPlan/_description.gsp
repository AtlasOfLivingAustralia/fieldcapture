<g:if test="${tableFormatting}">
    <div class="row">
        <div class="col-sm-12">
            <table class="table">
                <tbody>
                <tr class="header required">
                    <th class="required">${projectDescHeading ?: 'Project description'} (${maxSize ?: 1500} character limit) <fc:iconHelp>${helpTextHeading ?:'Project description will be visible on project overview page in MERIT.'}</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                                  data-bind="value:details.description, disable: isProjectDetailsLocked()" placeholder="${placeholder ?: ""}"></textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</g:if>
<g:else>
    <h4>${projectDescHeading ?: 'Project description'}<g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if></h4>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="project-description row">
        <div class="col-sm-12">
            <textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                      data-bind="value:details.description, disable: isProjectDetailsLocked()"
                      placeholder="${placeholder ?: ""}"></textarea>
        </div>
    </div>
</g:else>
