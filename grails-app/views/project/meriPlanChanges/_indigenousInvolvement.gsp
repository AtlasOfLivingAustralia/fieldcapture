<h4>${title ?: 'First Nations people involvement'}</h4>

<div class="row">
    <div class="col-md-8">
        <label>Are First Nations people (Indigenous) involved in the management and recovery of threatened species, threatened ecological communities and priority places within the project?</label>
    </div>

    <div class="col-md-4">
        <span style="display: none" class="original" data-bind="text:details.indigenousInvolved"></span>
        <span style="display: none" class="changed" data-bind="text:detailsChanged.indigenousInvolved"></span>
        <span wrap class="diff1"></span>
    </div>
</div>
<div class="row" data-bind="if:detailsChanged.indigenousInvolved() == 'Yes'">
    <div class="col-md-8">
        <label>What is the nature of the involvement?</label>
    </div>

    <div class="col-md-4">
        <span style="display: none" class="original" data-bind="text:details.indigenousInvolvementType"></span>
        <span style="display: none" class="changed" data-bind="text:detailsChanged.indigenousInvolvementType"></span>
        <span wrap class="diff1"></span>
    </div>
</div>
<div class="row" data-bind="if:detailsChanged.indigenousInvolved() == 'No'">
    <div class="col-md-8">
        <label>Comments</label>
    </div>

    <div class="col-md-4">
        <span style="display: none" class="original" data-bind="text:details.indigenousInvolvementComment"></span>
        <span style="display: none" class="changed" data-bind="text:detailsChanged.indigenousInvolvementComment"></span>
        <span wrap class="diff1"></span>
    </div>
</div>
