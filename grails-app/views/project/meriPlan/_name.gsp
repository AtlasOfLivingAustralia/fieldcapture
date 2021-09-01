<g:if test="${tableFormatting}">
    <div class="row">
        <div class="col-sm-12">
            <table class="table">
                <tbody>

                <tr class="header required">
                    <th class="required">Project name (${maxSize ?: 150} characters) <fc:iconHelp>The project name will be visible on project overview page in MERIT</fc:iconHelp></th>
                </tr>
                <tr>
                    <td>
                        <input class="form-control form-control-sm" type="text" data-validation-engine="validate[required,maxSize[${maxSize ?: 150}]]]"
                               data-bind="value:details.name, disable: isProjectDetailsLocked()" placeholder="${placeholder ?: ""}">
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</g:if>
<g:else>
    <h4 class="header-with-help">Project name</h4><fc:iconHelp>The project name will be visible on project overview page in MERIT</fc:iconHelp>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="project-name row">
        <div class="col-sm-12">
            <input class="form-control form-control-sm" type="text" data-validation-engine="validate[required,maxSize[${maxSize ?: 150}]]"
                   data-bind="value:details.name, disable: isProjectDetailsLocked()"
                   placeholder="${placeholder ?: ""}">
        </div>
    </div>
</g:else>

