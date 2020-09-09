<h4>Relevant national and regional plans</h4>

<table class="table plans-view">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="document-name">Document name <fc:iconHelp
                title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
        <th class="section">Relevant section <fc:iconHelp
                title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
        <th class="alignment">Explanation of strategic alignment <fc:iconHelp
                title="Explanation of strategic alignment">In what way will the project deliver against this section? Keep the response brief, 1 to 2 sentences should be adequate.</fc:iconHelp></th>
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