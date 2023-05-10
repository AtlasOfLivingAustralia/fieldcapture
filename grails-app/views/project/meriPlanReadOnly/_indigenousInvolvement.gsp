<h4>First Nations people (Indigenous) involvement</h4>

<div class="row">
    <div class="col-md-8">
        <label for="indigenous-involved">Are First Nations people (Indigenous) involved in the management and recovery of threatened species, threatened ecological communities and priority places within the project?</label>
    </div>

    <div class="col-md-4">
        <select id="indigenous-involved" class="form-control form-control-sm" data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolved, optionsCaption:'Please select...'">
            <option></option>
            <option>Yes</option>
            <option>No</option>
        </select>
    </div>
</div>
<div class="row" data-bind="if:details.indigenousInvolved() == 'Yes'">
    <div class="col-md-8">
        <label for="indigenous-involvement">What is the nature of the involvement?</label>
    </div>

    <div class="col-md-4">
        <select id="indigenous-involvement" class="form-control form-control-sm" data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementType, optionsCaption:'Please select...'">
            <option></option>
            <option>Leading</option>
            <option>Participating</option>
            <option>Partnership</option>
        </select>
    </div>
</div>
<div class="row" data-bind="if:details.indigenousInvolved() == 'No'">
    <div class="col-md-8">
        <label for="indigenous-involvement-comments">Comments</label>
    </div>

    <div class="col-md-4">
        <textarea id="indigenous-involvement-comments" rows="3" class="form-control form-control-sm" data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementComment" maxlength="${maxSize ?: 2000}">
        </textarea>
    </div>
</div>
