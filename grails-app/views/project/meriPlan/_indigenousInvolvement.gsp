<h4>First Nations people (Indigenous) involvement</h4>

<div class="form-group row">
    <div class="col-sm-8">
        <label for="indigenous-involved">Are First Nations people (Indigenous) involved in the management and recovery of threatened species, threatened ecological communities and priority places within the project?</label>
    </div>

    <div class="col-sm-4">
        <select id="indigenous-involved"
                class="form-control form-control-sm"
                data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolved, optionsCaption:'Please select...'"
                data-validation-engine="validate[required]">
            <option value="">Please select...</option>
            <option>Yes</option>
            <option>No</option>
        </select>
    </div>
</div>
<!-- ko if:details.indigenousInvolved() == 'Yes' -->
<div class="form-group">

    <label for="indigenous-involvement">What is the nature of the involvement?</label>


    <select id="indigenous-involvement"
            class="form-control form-control-sm"
            data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementType, optionsCaption:'Please select...'"
            data-validation-engine="validate[required]">
        <option value="">Please select...</option>
        <option>Leading</option>
        <option>Participating</option>
        <option>Partnership</option>
    </select>

</div>
<!-- /ko -->
<div class="form-group" data-bind="if:details.indigenousInvolved() == 'No'">

    <label for="indigenous-involvement-comments">Comments</label>
    <textarea id="indigenous-involvement-comments" rows="3"
              class="form-control form-control-sm"
              data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementComment"
              data-validation-engine="validate[required]"
              maxlength="${maxSize ?: 2000}">
    </textarea>

</div>

