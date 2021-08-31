<h4>${headingTitle ?: "Relevant national and regional plans"}</h4>

<p>${explanation ?:"Explain how the project aligns with all applicable national and regional priorities, plans and strategies."}</p>
<table class="table plans-view">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="document-name required">${documentName ?: "Document name"} <fc:iconHelp
                title="Document name">${documentNameHelpText ?: "List the name of the National or Regional plan the project is addressing."}</fc:iconHelp></th>
        <th class="section required">${relevantSectionName ?: "Relevant section"} <fc:iconHelp
                title="Relevant section">${relevantSectionHelpText ?: "What section (target/outcomes/objective etc) of the plan is being addressed?"}</fc:iconHelp></th>
        <th class="alignment required">${alignmentName ?: "Explanation of strategic alignment"} <fc:iconHelp
                title="Explanation of strategic alignment">${alignmentHelpText ?: "Explain how the project design and delivery align with the relevant section of the document"}</fc:iconHelp></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.priorities.rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="document-name"><span data-bind="text: data1"></span></td>
        <td class="section"><span data-bind="text: data2"></span></td>
        <td class="alignment"><span data-bind="text: data3"></span></td>
    </tr>
    </tbody>

</table>
