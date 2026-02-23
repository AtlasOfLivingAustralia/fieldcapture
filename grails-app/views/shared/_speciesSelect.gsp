<div data-bind="with:${bindingProperty}" class="input-group species-select">
    <select class="form-select form-select-sm" data-bind="speciesSelect2:$data"></select>
    <div class="input-group-append">
        <span class="input-group-text" data-bind="visible:name(), event: { 'shown.bs.popover': fetchSpeciesImage}"><i class="fa fa-info-circle"></i></span>
    </div>
</div>