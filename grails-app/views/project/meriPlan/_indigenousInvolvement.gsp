<h4>First Nations people involvement</h4>

<div class="form-group row">
    <div class="col-sm-8">
        <label class="required" for="indigenous-involved">Are First Nations people (Indigenous) involved in the management and recovery of threatened species, threatened ecological communities and priority places within the project?</label>
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

<div class="form-group" data-bind="visible:details.indigenousInvolved() == 'Yes'">

    <label class="required" for="indigenous-involvement">What is the nature of the involvement? <fc:iconHelp html="true"><b>Leading</b> – First Nations peoples leadership, knowledge and involvement as a substantial component across all stages of the project from co-design, delivery, monitoring, evaluation and reporting. <br/>
        <b>Participating</b> - Involvement of First Nations people in at least one aspect of project co-design, delivery, monitoring, evaluation or reporting.</fc:iconHelp></label>


    <select id="indigenous-involvement"
            class="form-control form-control-sm"
            data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementType, optionsCaption:'Please select...'"
            data-validation-engine="validate[required]">
        <option value="">Please select...</option>
        <option>Leading</option>
        <option>Participating</option>
    </select>

</div>

<div class="form-group" data-bind="if:details.indigenousInvolved() == 'No'">

    <label for="indigenous-involvement-comments">Comments</label>
    <textarea id="indigenous-involvement-comments" rows="3"
              class="form-control form-control-sm"
              data-bind="disable: isProjectDetailsLocked(), value:details.indigenousInvolvementComment"
              data-validation-engine="validate[required]"
              maxlength="${maxSize ?: 2000}">
    </textarea>

</div>

