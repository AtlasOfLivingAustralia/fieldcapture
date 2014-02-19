<div class="row-fluid">
    <div class="control-group">
        <label for="name" class="control-label">Project name</label>
        <div class="controls">
            <input type="text" class="input-xxlarge" id="name" data-bind="value: name"
                   data-validation-engine="validate[required]"/>
        </div>
    </div>
</div>
<div class="row-fluid">
    <div class="control-group span5">
        <label class="control-label">Choose an organisation</label>
        <select class="input-xlarge" id="organisation"
                data-bind="options:transients.organisations, optionsText:'name', optionsValue:'uid', value:organisation, optionsCaption: 'Choose...'"></select>
    </div>
    <span class="control-group span1" style="margin-top: 28px;"><b> OR</b></span>
    <div class="control-group span6">
        <label class="control-label">Enter the name of an organisation or person</label>
        <input class="input-xlarge" data-bind="value:organisationName" id="organisationName"
            data-validation-engine="validate[funcCall[exclusive[organisation,You  can only specify one organisation. One field must be cleared.]]]"/>
    </div>
</div>
<div class="row-fluid">
    <div class="control-group">
        <label for="description" class="control-label">Project description</label>
        <div class="controls">
            <textarea data-bind="value:description" class="input-xxlarge" id="description" rows="3" cols="50"></textarea>
        </div>
    </div>
</div>
<div class="row-fluid">
    <div class="control-group span4">
        <label class="control-label" for="externalId">External id</label>
        <div class="controls">
            <g:textField class="" name="externalId" data-bind="value:externalId"/>
        </div>
    </div>
    <div class="control-group span4">
        <label class="control-label" for="grantId">Grant id</label>
        <div class="controls">
            <g:textField class="" name="grantId" data-bind="value:grantId"/>
        </div>
    </div>
</div>

<div class="row-fluid">
    <div class="control-group span4">
        <label class="control-label" for="manager">Project manager</label>
        <div class="controls">
            <g:textField class="" name="manager" data-bind="value:manager"/>
        </div>
    </div>

    <div class="control-group span4">
        <label class="control-label" for="manager">Project funding</label>
        <div class="controls">
            <g:textField class="" name="funding" data-bind="value:funding" data-validation-engine="validate[custom[number]]"/>
        </div>
    </div>

</div>

<div class="row-fluid">
    <div class="span4">
        <label class="control-label">Program name</label>
        <select data-bind="value:associatedProgram,options:transients.programs,optionsCaption: 'Choose...'"
                data-validation-engine="validate[required]"></select>
    </div>
    <div class="span4">
        <label class="control-label">Sub-program name</label>
        <select data-bind="value:associatedSubProgram,options:transients.subprogramsToDisplay,optionsCaption: 'Choose...'"></select>
    </div>
</div>

<div class="row-fluid">
    <div class="span4">
        <label for="startDate">Planned start date
        <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
        </label>
        <div class="input-append">
            <fc:datePicker targetField="plannedStartDate.date" name="startDate" data-validation-engine="validate[required]" printable="${printView}" size="input-large"/>
        </div>
    </div>
    <div class="span4">
        <label for="endDate">Planned end date
        <fc:iconHelp title="End date">Date the project is intended to finish.</fc:iconHelp>
        </label>
        <div class="input-append">
            <fc:datePicker targetField="plannedEndDate.date" name="endDate" data-validation-engine="validate[future[startDate]]" printable="${printView}" size="input-large"/>
        </div>
    </div>
</div>

<div class="row-fluid" data-bind="visible:projectDatesChanged">
    <span class="span6">
        <label for="regenerateProjectTimeline">Re-calculate the project stage dates? (This page must be reloaded before the change will be visible)</label>
        <fc:iconHelp title="Timeline">Selecting the checkbox will result in the project stage start and end dates being adjusted to match the new project dates.</fc:iconHelp>
        <input id="regenerateProjectTimeline" type="checkbox" data-bind="checked:regenerateProjectTimeline">
    </span>
</div>

<div class="form-actions">
    <button type="button" data-bind="click: saveSettings" class="btn btn-primary">Save changes</button>
    <button type="button" id="cancel" class="btn">Cancel</button>
</div>
