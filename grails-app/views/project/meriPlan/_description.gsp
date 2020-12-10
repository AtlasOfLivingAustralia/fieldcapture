<g:if test="${tableFormatting}">
    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header required">
                    <th class="required">Project description (${maxSize ?: 1500} character limit) <fc:iconHelp>Project description will be visible on project overview page in MERIT.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5" data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                                  data-bind="value:details.description, disable: isProjectDetailsLocked()" placeholder="${placeholder ?: ""}"></textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</g:if>
<g:else>
    <h4>Project description</h4>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="project-description row-fluid">

        <textarea class="span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                  data-bind="value:details.description, disable: isProjectDetailsLocked()"
                  placeholder="${placeholder ?: ""}"></textarea>

    </div>
</g:else>