<h4>Relevant national and regional plans</h4>
<p>Explain how the project aligns with all applicable national and regional priorities, plans and strategies.</p>
<table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="document-name required">Document name <fc:iconHelp
                title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
        <th class="section required">Relevant section <fc:iconHelp
                title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
        <th class="alignment required">Explanation of strategic alignment <fc:iconHelp
                title="Explanation of strategic alignment">Explain how the project design and delivery align with the relevant section of the document</fc:iconHelp></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.priorities.rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="document-name"><textarea class="input-xlarge" data-validation-engine="validate[required]"
                                            data-bind="value: data1, disable: $parent.isProjectDetailsLocked()"
                                            rows="3"></textarea></td>
        <td class="section"><textarea class="input-xlarge" data-validation-engine="validate[required]"
                                      data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                      rows="5"></textarea></td>
        <td class="alignment"><textarea class="input-xlarge" data-validation-engine="validate[required]"
                                        data-bind="value: data3, disable: $parent.isProjectDetailsLocked()"
                                        rows="5"></textarea></td>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                   data-bind="click: $parent.removeNationalAndRegionalPriorities"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>

        <td colspan="5">
            <button type="button" class="btn btn-small"
                    data-bind="disable: isProjectDetailsLocked(), click: addNationalAndRegionalPriorities">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>