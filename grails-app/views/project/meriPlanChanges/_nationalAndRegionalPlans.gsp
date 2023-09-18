<h4>${headingTitle ?: "Relevant national and regional plans"}</h4>

<p>${explanation ?:"Explain how the project aligns with all applicable national and regional priorities, plans and strategies."}</p>

<table id="national-regional-plans" class="table plans-view ${includeUrl ? 'with-url': ''}">
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
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.priorities.rows.size(), changed.custom.details.priorities?.rows?.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">
        <tr>
            <td class="index"><span data-bind="text:${i}+1"></span></td>
            <td class="document-name"><fc:renderComparison changed="${changed.custom.details.priorities.rows ?: []}" i="${i}" original="${project.custom.details.priorities.rows ?: []}" property="data1"/> </td>
            <td class="section"><fc:renderComparison changed="${changed.custom.details.priorities.rows ?: []}" i="${i}" original="${project.custom.details.priorities.rows ?: []}" property="data2"/> </td>
            <td class="alignment"><fc:renderComparison changed="${changed.custom.details.priorities.rows ?: []}" i="${i}" original="${project.custom.details.priorities.rows ?: []}" property="data3"/> </td>
            <td class="document-url"><fc:renderComparison changed="${changed.custom.details.priorities.rows ?: []}" i="${i}" original="${project.custom.details.priorities.rows ?: []}" property="documentUrl"/> </td>
        </tr>
    </g:each>

    </tbody>

</table>
