<table class="table">
    <thead>
    <tr>
        <th class="outcome-actions"><fc:iconHelp>Use icons in this column to delete an outcome</fc:iconHelp></th>
        <th class="outcome-description">Outcome description <fc:iconHelp>A free text description of the outcome</fc:iconHelp></th>
        <th class="outcome-type">Type <fc:iconHelp>Whether this can be selected as a project primary, secondary, medium term or short term outcome</fc:iconHelp></th>
        <th class="outcome-short-description">Short description <fc:iconHelp>This description represents this outcome on the program and management unit page overview tab</fc:iconHelp></th>
        <th class="outcome-category">Category <fc:iconHelp>Used to group outcomes into categories that can be used for data aggregation and reporting</fc:iconHelp></th>
        <th class="outcome-priorities">Investment priorities <fc:iconHelp>The categories of investment priorities that are related to this outcome.  Projects using the outcome will only be able to select investment priorities from these categories.</fc:iconHelp></th>
    </tr>
    </thead>
    <tbody>
        <!-- ko foreach: outcomes -->
        <tr>
            <td class="outcome-actions"><i class="fa fa-remove" data-bind="visible:!isReadOnly, click:$parent.removeOutcome"></i></td>
            <td class="outcome-description">
                <textarea rows="4" title="Outcome description" class="form-control form-control-sm" name="outcome" data-bind="enable:!isReadOnly, value:outcome"></textarea>
            </td>
            <td class="outcome-type">
                <select title="Outcome type" class="form-control form-control-sm" name="type" data-bind="enable:!isReadOnly, value:type">
                    <option value="">Primary and/or secondary</option>
                    <option value="primary">Primary only</option>
                    <option value="secondary">Secondary only</option>
                    <option value="medium">Medium term</option>
                    <option value="short">Short term</option>
                </select>
            </td>
            <td class="outcome-short-description">
                <input title="Short description" class="form-control form-control-sm" name="shortDescription" data-bind="value:shortDescription">
            </td>
            <td class="outcome-category">
                <input title="Outcome category" class="form-control form-control-sm" name="category" data-bind="value:category">
            </td>
            <td class="outcome-priorities">
                <select title="Investment priority categories associated with this outcome" multiple="multiple" class="form-control form-control-sm" style="width:100%" name="priorities" data-bind="enable:!isReadOnly, multiSelect2:{value: priorities}"></select>
            </td>
        </tr>
        <!-- /ko -->
    </tbody>
    <tfoot>
        <tr>
            <td colspan="6">
                <button type="button" class="btn btn-sm btn-success" data-bind="click:addNewOutcome">
                    <i class="fa fa-plus"></i> Add new outcome</button>
            </td>
        </tr>
    </tfoot>
</table>
