<div class="" id="${containerId}">
    <div data-bind="foreach: { data: filteredDocuments }">
        <div data-bind="{ if: (role() == '${filterBy}' || 'all' == '${filterBy}') && role() != '${ignore}' && !_.contains(['variation', 'approval', 'stageReport'], role()) }">
            <div class="clearfix space-after media row" data-bind="template:'documentEditTemplate'"></div>
        </div>
    </div>
</div>
<g:render template="/shared/documentTemplate"></g:render>
