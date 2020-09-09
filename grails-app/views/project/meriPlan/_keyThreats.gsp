<!-- ko with:details.threats -->
<table class="table threats">
    <thead>
    <th class="index"></th>
    <th class="threat required">Key threat(s) and/or key threatening processes <fc:iconHelp>Describe the key threats (or key threatening processes) to the primary investment priority</fc:iconHelp></th>
    <th class="intervention required">Interventions to address threats <fc:iconHelp>Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome.</fc:iconHelp></th>
    <th class="remove"></th>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="threat">
            <textarea rows="4" data-validation-engine="validate[required]"
                      data-bind="value: threat, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="intervention"><textarea data-validation-engine="validate[required]"
                                           data-bind="value: intervention, disable: $root.isProjectDetailsLocked()"
                                           rows="4"></textarea></td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                 data-bind="click: $parent.removeRow"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="4">
            <button type="button" class="btn btn-small"
                    data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
<!-- /ko -->