<h4>Project assets<g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if></h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<g:set var="assetClass" value="${useCategorySelection || autoSelectCategory ? 'asset-detail': 'asset'} "/>
<table class="table assets">
<thead>
    <tr>
        <th class="index"></th>
    <g:if test="${fromPriorities && useCategorySelection}">
        <th class="asset-category required">Asset Type <g:if test="${assetCategoryHelpText}"> <fc:iconHelp html="true" container="body">${assetCategoryHelpText}</fc:iconHelp></g:if></th>
    </g:if>
        <th class="${assetClass} required">${assetHeading ?:
                "Please name the species, ecological community or environmental asset(s) the project is targeting"}
            <g:if test="${assetHelpText}"> <fc:iconHelp html="true" container="body">${assetHelpText}</fc:iconHelp></g:if></th>
        <g:if test="${fromPriorities && autoSelectCategory}">
            <th class="asset-category required">Asset Type <g:if test="${assetCategoryHelpText}"> <fc:iconHelp html="true" container="body">${assetCategoryHelpText}</fc:iconHelp></g:if></th>
        </g:if>
        <th class="remove"></th>
    </tr>
</thead>
<tbody data-bind="foreach:details.assets">
<tr>
    <td class="index" data-bind="text:$index()+1"></td>
    <g:if test="${fromPriorities && useCategorySelection}">
        <td class="asset-category required">
            <select data-validation-engine="validate[required]" class="form-control form-control-sm"
                    data-bind="select2:{}, value:category, optionsCaption:'${placeHolder  ?: "Please select..."}', options: $root.assetCategories(<fc:modelAsJavascript model="${priorityCategories}"/>), disable: $parent.isProjectDetailsLocked()">
            </select>
        </td>
    </g:if>
    <td class="${assetClass}">
        <g:if test="${fromPriorities}">
            <g:if test="${useCategorySelection}">
                <select data-validation-engine="validate[required]" class="form-control form-control-sm"
                        data-bind="select2:{}, value:description, optionsCaption:'${placeHolder  ?: "Please select..."}', options: $root.priorityAssets(category()), disable: !category() || $parent.isProjectDetailsLocked()">
                </select>
            </g:if>
            <g:else>
                <select data-validation-engine="validate[required]" class="form-control form-control-sm"
                        data-bind="select2:{}, value:description, optionsCaption:'${placeHolder  ?: "Please select..."}', options: $root.priorityAssets(<fc:modelAsJavascript model="${priorityCategories}" default=""/>), disable: $parent.isProjectDetailsLocked()">
                </select>
            </g:else>

        </g:if>
        <g:else>
            <textarea class="form-control" placeholder="${placeHolder}" data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
        </g:else>

    </td>
    <g:if test="${fromPriorities && autoSelectCategory}">
        <td class="asset-category required">
                <select class="form-control form-control-sm" type="text" readonly="readonly" placeholder="${categoryPlaceholder ?:"Select an asset..."}"
                        data-bind="value:category, options:[$root.assetCategory(description())], disable: $parent.isProjectDetailsLocked()"></select>

        </td>
    </g:if>
    <td class="remove">
        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                               data-bind="click: $parent.removeAsset"></i>
        </span>
    </td>
</tr>
</tbody>
<tfoot>
<tr>
    <td colspan="${useCategorySelection || autoSelectCategory ? 4: 3}">
        <button type="button" class="btn btn-sm"
                data-bind="disable: isProjectDetailsLocked(), click: addAsset">
            <i class="fa fa-plus"></i> Add a row</button></td>
</tr>
</tfoot>
</table>
