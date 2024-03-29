<h4>${headingTitle ?: "Relevant national and regional plans"}</h4>

<p>${explanation ?:"Explain how the project aligns with all applicable national and regional priorities, plans and strategies."}</p>
<table class="table plans ${includeUrl ? 'with-url': ''}">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="document-name required">${documentName ?: "Document name"} <fc:iconHelp
                title="Document name">${documentNameHelpText ?: "List the name of the National or Regional plan the project is addressing."}</fc:iconHelp></th>
        <th class="section required">${relevantSectionName ?: "Relevant section"} <fc:iconHelp
                title="Relevant section">${relevantSectionHelpText ?: "What section (target/outcomes/objective etc) of the plan is being addressed?"}</fc:iconHelp></th>
        <th class="alignment required">${alignmentName ?: "Explanation of strategic alignment"} <fc:iconHelp
                title="Explanation of strategic alignment">${alignmentHelpText ?: "Explain how the project design and delivery align with the relevant section of the document"}</fc:iconHelp></th>
        <g:if test="${includeUrl}">
            <th class="document-url">${documentUrlTitle ?: "Link to document (where applicable)"}</th>
        </g:if>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.priorities.rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="document-name"><textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                                            data-bind="value: data1, disable: $parent.isProjectDetailsLocked()"
                                            rows="3"></textarea></td>
        <td class="section"><textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                                      data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                      rows="5"></textarea></td>
        <td class="alignment"><textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                                        data-bind="value: data3, disable: $parent.isProjectDetailsLocked()"
                                        rows="5"></textarea></td>
<g:if test="${includeUrl}">
        <td class="document-url">
            <input type="text"
                   class="form-control form-control-sm"
                   data-bind="value:documentUrl, disable: $parent.isProjectDetailsLocked()"
                   data-validation-engine="validate[url]">
        </td>
</g:if>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                   data-bind="click: $parent.removeNationalAndRegionalPriorities"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>

        <td colspan="${includeUrl ? '6' :'5' }">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: isProjectDetailsLocked(), click: addNationalAndRegionalPriorities">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
