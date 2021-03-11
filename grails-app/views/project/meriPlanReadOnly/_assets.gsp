<h4>Project assets</h4>
<g:if test="${viewExplanation}">
    ${viewExplanation ?: "Species, ecological community or environmental asset(s) the project is targeting"}
</g:if>
<g:set var="assetClass" value="${useCategorySelection || autoSelectCategory ? 'asset-detail': 'asset'} "/>
<table class="table assets-view">
    <thead>
    <tr>
        <th class="index"></th>
        <g:if test="${fromPriorities && useCategorySelection}">
            <th class="asset-category">Asset Type</th>
        </g:if>
            <th class="${assetClass}">${assetHeading ?: "Species, ecological community or environmental asset(s) the project is targeting"}</th>
        <g:if test="${fromPriorities && autoSelectCategory}">
            <th class="asset-category">Asset Type</th>
        </g:if>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.assets">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <g:if test="${fromPriorities && useCategorySelection}">
            <td class="asset-category">
                <span data-bind="text:category"></span>
            </td>
        </g:if>
        <td class="${assetClass}">
            <span data-bind="text:description"></span>
        </td>
        <g:if test="${fromPriorities && autoSelectCategory}">
            <td class="asset-category">
                <span class="Test" data-bind="text:category"></span>
            </td>
        </g:if>
    </tr>
    </tbody>
</table>
