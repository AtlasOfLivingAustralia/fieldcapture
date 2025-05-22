<h4>${title ?: 'First Nations people involvement'}</h4>

<div class="row">
    <div class="col-md-8">
        <label>Are First Nations people (Indigenous) involved in the management and recovery of threatened species, threatened ecological communities and priority places within the project?</label>
    </div>

    <div class="col-md-4">
        <span data-bind="text:details.indigenousInvolved"></span>
    </div>
</div>
<div class="row" data-bind="if:details.indigenousInvolved() == 'Yes'">
    <div class="col-md-8">
        <label>What is the nature of the involvement?</label>
    </div>

    <div class="col-md-4">
        <span id="indigenous-involvement-view" data-bind="text:details.indigenousInvolvementType"></span>
    </div>
</div>
<div class="row" data-bind="if:details.indigenousInvolved() == 'No'">
    <div class="col-md-8">
        <label>Comments</label>
    </div>

    <div class="col-md-4">
        <span class="textarea-view" data-bind="text:details.indigenousInvolvementComment"></span>
    </div>
</div>
