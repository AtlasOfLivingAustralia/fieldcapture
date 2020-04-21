<h4>Project assets</h4>
<table class="table assets">
<thead>
<tr class="header">
    <th class="index"></th>
    <th class="asset required">Please name the species, ecological community or environmental asset(s) the project is targeting</th>
    <th class="remove"></th>
</tr>
</thead>
<tbody data-bind="foreach:details.assets">
<tr>
    <td class="index" data-bind="text:$index()+1"></td>
    <td class="asset">
        <textarea data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
    </td>
    <td class="remove">
        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                               data-bind="click: $parent.removeAsset"></i>
        </span>
    </td>
</tr>
</tbody>
<tfoot>
<tr>
    <td colspan="3">
        <button type="button" class="btn btn-small"
                data-bind="disable: isProjectDetailsLocked(), click: addAsset">
            <i class="fa fa-plus"></i> Add a row</button></td>
</tr>
</tfoot>
</table>