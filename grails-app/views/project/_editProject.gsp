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
        <input type="text" class="input-xlarge" readonly="readonly" data-bind="value:organisationName" id="organisationName"/>
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
        <input type="text" class="input-xlarge" readonly="readonly" data-bind="value:serviceProviderName" id="serviceProviderName"/>
    </div>
</div>
<g:if test="${meriPlanStatus == true && hidePrograms}">
    <div class="row-fluid">
        <div class="control-group span4">
            <label for="programId" class="control-label">Program </label>
            <div class="controls">
                <g:select class="programId select" style="width: 280px" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name" disabled="disabled"/>

            </div>
        </div>
    </div>
</g:if>
<g:elseif test="${meriPlanStatus == false  && hidePrograms}">
    <div class="row-fluid">
        <div class="control-group span4">
            <label for="programId" class="control-label">Program </label>
            <div class="controls">
                <g:select class="programId select" style="width: 280px" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name"/>

            </div>
        </div>
    </div>
</g:elseif>
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
        <label class="control-label" for="internalOrderId">Internal order number</label>
        <div class="controls">
            <!-- Once the MERI plan is approved, the internal order number becomes a mandatory field. -->
            <g:if test="${ProjectService.APPLICATION_STATUS != project.status}">
                <g:textField class="" placeholder="If unavailable, use 'TBA'" name="internalOrderId" data-bind="value:internalOrderId" data-validation-engine="validate[required]"/>
            </g:if>
            <g:else>
                <g:textField class="" placeholder="If not available, use TBA" name="internalOrderId" data-bind="value:internalOrderId"/>
            </g:else>
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

    <div class="control-group span4">
        <label class="control-label" for="tags">Disaster relief categories</label>
        <div class="controls">
            <select multiple="multiple" id="tags" data-bind="options:transients.defaultTags, multiSelect2:{value:tags, placeholder:''}" class="select input-xlarge"></select>
        </div>
    </div>

</div>

<g:if test="${!hidePrograms}">
    <g:if test="${!canChangeProjectDates}">
<div class="alert alert-block">You cannot change the start date or programme for a project with submitted or approved reports or MERI plan.</div>
</g:if>

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
    <g:if test="${!canChangeProjectDates}">
    <div class="alert alert-block">You cannot change the start date for a project with submitted or approved reports or MERI plan.</div>
    </g:if>
</g:else>

<div class="row-fluid">
    <div class="span4">
        <label for="startDate">Planned start date
        <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
        </label>
        <div class="input-append">
            <g:if test="${canChangeProjectDates}">
                <fc:datePicker targetField="plannedStartDate.date" name="startDate" data-bind="disable:!canEditStartDate(), datepicker:plannedStartDate.date" data-validation-engine="validate[required, past[plannedEndDate]]" printable="${printView}" size="input-large"/>
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
            <fc:datePicker targetField="plannedEndDate.date" data-bind="disable:transients.fixedProjectDuration(), datepicker:plannedEndDate.date" name="endDate" data-validation-engine="validate[required, funcCall[validateProjectEndDate]]" printable="${printView}" size="input-large"/>
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
            <g:textField class="" name="duration" data-bind="disable:transients.fixedProjectDuration(), value:transients.plannedDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>
<div class="row-fluid">
    <p>These options control how project date changes will affect reports containing data and / or activities: </p>
    <g:if test="${config?.activityBasedReporting}">
        <p>
            <label>
                <input type="checkbox" data-bind="disable:!canEditStartDate(), checked:changeActivityDates">
                Move activity dates with project start date:<fc:iconHelp>If this is selected, all of the activity dates in this project will be adjusted by the same amount of time that the project start date is adjusted</fc:iconHelp>
            </label>
        </p>
    </g:if>
    <g:else>
        <p>
            <label>
                <input type="checkbox" data-bind="disable:!canEditStartDate() || !includeSubmittedReports(), checked:keepReportEndDates">
                Do not change end dates of submitted reports:<fc:iconHelp>If this is selected, (empty) reports that occur before the submitted report will be deleted as required rather than moving the dates of all reports to match the start date changes</fc:iconHelp>
            </label>
        </p>
    </g:else>

    <p><input type="checkbox" data-bind="checked:includeSubmittedReports"> Allow date changes to submitted or approved reports <fc:iconHelp>This project has submitted and/or approved reports.  Changing the project start date may result in a change to these reporting dates, depending on the reporting configuration and the new start date.</fc:iconHelp></p>
    <p>
        <label>Reason for changing the project start date:<fc:iconHelp>This reason is required when changing approved or submitted reports and will be recorded against the report status changes</fc:iconHelp>
        <textarea class="span12" rows="3" data-bind="enable:includeSubmittedReports, value:dateChangeReason" data-validation-engine="validate[required]"></textarea>
        </label>
    </p>

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
            <g:textField class="" name="contract-duration" data-bind="value:transients.contractDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>

<div class="row-fluid">
    <div class="span4">
        <label>Project status
        	<fc:iconHelp title="Project status">Project status.</fc:iconHelp>
        </label>
        <!-- Application status cannot be changed until the MERI plan is approved. -->
        <!-- Application status is set only when creating the project -->
        <g:if test="${ProjectService.PLAN_UNLOCKED == project.planStatus || ProjectService.APPLICATION_STATUS == project.status}">
            <select class="input-xlarge" id="projectState" data-bind="options:projectStatus, optionsText: 'name', optionsValue: 'id', value:status" disabled="disabled"></select>
        </g:if>
        <g:else>
            <select class="input-xlarge" id="projectState" data-bind="options:projectStatus.filter(x => x.name != '${ProjectService.APPLICATION_STATUS}'), optionsText: 'name', optionsValue: 'id', value:status"></select>
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
    <button type="button" id="saveSettings" data-bind="disable:transients.disableSave, click: saveSettings" class="btn btn-primary">Save changes</button>
    <button type="button" id="cancel" class="btn">Cancel</button>
</div>
