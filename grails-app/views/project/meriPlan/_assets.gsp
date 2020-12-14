<h4>Project assets</h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>

<table class="table assets">
<thead>
<tr class="header">
    <th class="index"></th>
    <th class="asset required">${explanation ?: "Please name the species, ecological community or environmental asset(s) the project is targeting"}</th>

    <th class="remove"></th>
</tr>
</thead>
<tbody data-bind="foreach:details.assets">
<tr>
    <td class="index" data-bind="text:$index()+1"></td>
    <td class="asset">
        <g:if test="${fromPriorities}">
            <select data-validation-engine="validate[required]"
                data-bind="value:description, optionsCaption:'${placeHolder  ?: "Please select..."}', options: $root.priorityAssets(<fc:modelAsJavascript model="${priorityCategories}" default=""/>), disable: $parent.isProjectDetailsLocked()">
            </select>
        </g:if>
        <g:else>
            <textarea placeholder="${placeHolder}" data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
        </g:else>

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