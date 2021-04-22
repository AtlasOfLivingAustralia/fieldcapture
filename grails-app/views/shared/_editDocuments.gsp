<div class="row-fluid" id="${containerId}">
    <div data-bind="span12">
        <div class="well">

            <div data-bind="foreach: { data: filteredDocuments }">
                <div data-bind="{ if: (role() == '${filterBy}' || 'all' == '${filterBy}') && role() != '${ignore}' && role() != 'variation' }">
                    <div class="clearfix space-after media" data-bind="template:'documentEditTemplate'"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<g:render template="/shared/documentTemplate"></g:render>
