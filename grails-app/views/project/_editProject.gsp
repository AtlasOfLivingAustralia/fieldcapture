<%@ page import="au.org.ala.merit.ProjectService" %>
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
        <label class="control-label">Search for an organisation</label>
        <input type="text" class="input-xlarge" id="organisation" placeholder="Search organisations..."
                data-bind="elasticSearchAutocomplete:{url:fcConfig.organisationSearchUrl, value:'name', label:'name', result:transients.selectOrganisation}"/>
    </div>
    <div class="control-group span6">
        <label class="control-label">Organisation name</label>
        <input class="input-xlarge" readonly="readonly" data-bind="value:organisationName" id="organisationName"/>
    </div>
</div>
<div class="row-fluid">
    <div class="control-group span5">
        <label class="control-label">Search for a service provider organisation</label>
        <input type="text" class="input-xlarge" id="serviceProviderOrganisation" placeholder="Search organisations..."
                data-bind="elasticSearchAutocomplete:{url:fcConfig.organisationSearchUrl, value:'name', label:'name', result:transients.selectServiceProviderOrganisation}"></input>
    </div>
    <div class="control-group span6">
        <label class="control-label">Service provider organisation name</label>
        <input class="input-xlarge" readonly="readonly" data-bind="value:serviceProviderName" id="serviceProviderName"/>
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
    <div class="control-group span4">
        <label class="control-label" for="workOrderId">Work order id</label>
        <div class="controls">
            <g:textField class="" name="workOrderId" data-bind="value:workOrderId"/>
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

<g:if test="${!hidePrograms}">
<div class="alert alert-block">You cannot change the start date or programme for a project with submitted or approved reports or MERI plan.</div>

<div class="row-fluid">
    <div class="span4">
        <label class="control-label">Programme name</label>
        <select data-bind="value:associatedProgram,options:transients.programs,optionsCaption: 'Choose...',enable:${canChangeProjectDates?:'false'}"
                data-validation-engine="validate[required]"></select>
    </div>
    <div class="span4">
        <label class="control-label">Sub-programme name</label>
        <select data-bind="value:associatedSubProgram,options:transients.subprogramsToDisplay,optionsCaption: 'Choose...',,enable:${canChangeProjectDates?:'false'}"></select>
    </div>
</div>
</g:if>
<g:else>
    <div class="alert alert-block">You cannot change the start date for a project with submitted or approved reports or MERI plan.</div>
</g:else>

<div class="row-fluid">
    <div class="span4">
        <label for="startDate">Planned start date
        <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
        </label>
        <div class="input-append">
            <g:if test="${canChangeProjectDates}">
                <fc:datePicker targetField="plannedStartDate.date" name="startDate" data-validation-engine="validate[required, validate[funcCall[validateProjectStartDate]]]" printable="${printView}" size="input-large"/>
            </g:if>
            <g:else>
                <input type="text" data-bind="value:plannedStartDate.formattedDate" disabled="disabled" size="input-large">
            </g:else>
        </div>
    </div>
    <div class="span4">
        <label for="endDate">Planned end date
        <fc:iconHelp title="End date">Date the project is intended to finish.</fc:iconHelp>
        </label>
        <div class="input-append">
            <fc:datePicker targetField="plannedEndDate.date" name="endDate" data-validation-engine="validate[required, funcCall[validateProjectEndDate]]" printable="${printView}" size="input-large"/>
        </div>

    </div>
    <div class="span1">
        OR
    </div>
    <div class="span3">
        <label for="duration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="input-append">
            <g:textField class="" name="duration" data-bind="value:transients.plannedDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>
<div class="row-fluid" data-bind="if:!contractDatesFixed()" >
    <div class="span12">
        <label class="checkbox" for="modifyActivityDates">Update activity dates to match project date changes?<input type="checkbox" id="modifyActivityDates" checked="checked" data-bind="checked:changeActivityDates">
        <fc:iconHelp>Checking this box will cause activity dates to be adjusted to match the changes to the project dates.  This is not advised except for single stage projects like the green army.</fc:iconHelp></label>
    </div>
</div>

<div class="row-fluid">
    <div class="span4">
        <label for="contractStartDate">Contract start date
        <fc:iconHelp title="Contract Start date">Contracted start date.</fc:iconHelp>
        </label>
        <div class="input-append">
            <fc:datePicker targetField="contractStartDate.date" name="contractStartDate" printable="${printView}" size="input-large"/>
        </div>
    </div>
    <div class="span4">
        <label for="endDate">Contract end date
        <fc:iconHelp title="Contract End date">Date the project is contracted to finish.</fc:iconHelp>
        </label>
        <div class="input-append">
            <fc:datePicker targetField="contractEndDate.date" name="contractEndDate" data-validation-engine="validate[future[contractStartDate]]" printable="${printView}" size="input-large"/>
        </div>

    </div>
    <div class="span1">
        OR
    </div>
    <div class="span3">
        <label for="duration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="input-append">
            <g:textField class="" name="duration" data-bind="value:transients.contractDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>

<div class="row-fluid">
    <div class="span4">
        <label>Project status
        	<fc:iconHelp title="Project status">Project status.</fc:iconHelp>
        </label>
        <g:if test="${ProjectService.PLAN_UNLOCKED == project.planStatus}">
            <select class="input-xlarge" id="projectState" data-bind="options:projectStatus, optionsText: 'name', optionsValue: 'id', value:status" disabled="disabled"></select>
        </g:if>
        <g:else>
            <select class="input-xlarge" id="projectState" data-bind="options:projectStatus, optionsText: 'name', optionsValue: 'id', value:status"></select>
        </g:else>
    </div>
    <div class="span4">

    </div>
</div>

<div class="row-fluid">
    <div class="span12">
        <button data-bind="click:regenerateStageReports" class="btn btn-warning">Re-create project stage reports</button>
    </div>
</div>

<div class="form-actions">
    <button type="button" data-bind="click: saveSettings" class="btn btn-primary">Save changes</button>
    <button type="button" id="cancel" class="btn">Cancel</button>
</div>
