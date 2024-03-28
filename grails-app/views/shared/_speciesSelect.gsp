<div data-bind="with:${bindingProperty}" class="input-group species-select">
    <select class="form-control form-control-sm" data-bind="speciesSelect2:$data"></select>
    <div class="input-group-append">
        <span class="input-group-text" data-bind="visible:name(), popover: {title: transients.speciesTitle, content: transients.speciesInformation}"><i class="fa fa-info-circle"></i></span>
    </div>
</div>