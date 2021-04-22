<%@ page import="au.org.ala.merit.ProjectService" %>
<form class="row">
    <div class="form-group col-sm-12">
            <label for="name" class="form-check-label">Project name</label>
            <input type="text" class="form-control form-control-sm input-large" id="name" data-bind="value: name"
                   data-validation-engine="validate[required]"/>
    </div>
</form>
<form class="row">
    <div class="form-group col-sm-5">
        <label class="form-check-label">Search for an organisation</label>
        <input type="text" class="form-control form-control-sm input-medium" id="organisation" placeholder="Search organisations..."
                data-bind="elasticSearchAutocomplete:{url:fcConfig.organisationSearchUrl, value:'name', label:'name', result:transients.selectOrganisation}"/>
    </div>
    <div class="form-group col-sm-5">
        <label class="form-check-label">Organisation name</label>
        <input type="text" class="form-control form-control-sm input-medium" readonly="readonly" data-bind="value:organisationName" id="organisationName"/>
    </div>
</form>
<form class="row">
    <div class="form-group col-sm-5">
        <label class="form-check-label">Search for a service provider organisation</label>
        <input type="text" class="form-control form-control-sm input-medium" id="serviceProviderOrganisation" placeholder="Search organisations..."
                data-bind="elasticSearchAutocomplete:{url:fcConfig.organisationSearchUrl, value:'name', label:'name', result:transients.selectServiceProviderOrganisation}"></input>
    </div>
    <div class="form-group col-sm-6">
        <label class="form-check-label">Service provider organisation name</label>
        <input type="text" class="form-control form-control-sm input-medium" readonly="readonly" data-bind="value:serviceProviderName" id="serviceProviderName"/>
    </div>
</form>
<g:if test="${meriPlanStatus == true && hidePrograms}">
    <form class="row">
        <div class="form-group col-sm-5">
            <label for="programId" class="form-check-label">Program </label>
                <g:select class="programId select form-control form-control-sm input-medium" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name" disabled="disabled"/>

        </div>
    </form>
</g:if>
<g:elseif test="${meriPlanStatus == false  && hidePrograms}">
    <form class="row">
        <div class="form-group col-sm-5">
            <label for="programId" class="form-check-label">Program </label>
                <g:select class="programId select form-control form-control-sm input-medium" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name"/>
        </div>
    </form>
</g:elseif>
<form class="row">
    <div class="form-group col-sm-12">
        <label for="description" class="form-check-label">Project description</label>
        <textarea data-bind="value:description" class="form-control form-control-sm input-large" id="description" rows="3" cols="50"></textarea>
    </div>
</form>
<form class="row">
    <div class="form-group col-sm-4">
        <label class="form-check-label" for="externalId">External id</label>
            <input type="text" class="form-control form-control-sm input-medium" name="externalId" id="externalId" data-bind="value:externalId"/>

    </div>
    <div class="form-group col-sm-4">
        <label class="form-check-label" for="grantId">Grant id</label>
            <input type="text" id="grantId" class="form-control form-control-sm input-medium" name="grantId" data-bind="value:grantId"/>
    </div>
    <div class="form-group col-sm-4">
        <label class="form-check-label" for="internalOrderId">Internal order number</label>
            <!-- Once the MERI plan is approved, the internal order number becomes a mandatory field. -->
            <g:if test="${ProjectService.APPLICATION_STATUS != project.status}">
                <input type="text" id="internalOrderId" class="form-control form-control-sm input-medium" placeholder="If unavailable, use 'TBA'" name="internalOrderId" data-bind="value:internalOrderId" data-validation-engine="validate[required]"/>
            </g:if>
            <g:else>
                <input type="text" id="internalOrderId" class="form-control form-control-sm input-medium" placeholder="If not available, use TBA" name="internalOrderId" data-bind="value:internalOrderId"/>
            </g:else>
    </div>

</form>

<form class="row">
    <div class="form-group col-sm-4">
        <label class="form-check-label" for="manager">Project manager</label>
            <input type="text" id="manager" class="form-control form-control-sm input-medium" name="manager" data-bind="value:manager"/>
    </div>
    <div class="form-group col-sm-4">
        <label class="control-label" for="funding">Project funding</label>
            <input type="text" class="form-control form-control-sm input-medium" id="funding" name="funding" data-bind="value:funding" data-validation-engine="validate[custom[number]]"/>
    </div>
    <div class="form-group col-sm-4">
        <label class="form-check-label" for="tags">Disaster relief categories</label>
            <select multiple="multiple" id="tags" data-bind="options:transients.defaultTags, multiSelect2:{value:tags, placeholder:''}" class="select form-control form-control-sm input-medium"></select>
    </div>

</form>

<g:if test="${!hidePrograms}">
    <g:if test="${!canChangeProjectDates}">
<div class="alert alert-block ">You cannot change the start date or programme for a project with submitted or approved reports or MERI plan.</div>
</g:if>

<form class="row">
    <div class="form-group col-sm-4">
        <label class="form-check-label">Programme name</label>
        <select data-bind="value:associatedProgram,options:transients.programs,optionsCaption: 'Choose...',enable:${canChangeProjectDates?:'false'}"
                data-validation-engine="validate[required]" class="form-control form-control-sm input-medium"></select>
    </div>
    <div class="form-group col-sm-4">
        <label class="form-check-label">Sub-programme name</label>
        <select class="form-control form-control-sm input-medium" data-bind="value:associatedSubProgram,options:transients.subprogramsToDisplay,optionsCaption: 'Choose...',,enable:${canChangeProjectDates?:'false'}"></select>
    </div>
</form>
</g:if>
<g:else>
    <g:if test="${!canChangeProjectDates}">
    <div class="alert alert-block">You cannot change the start date for a project with submitted or approved reports or MERI plan.</div>
    </g:if>
</g:else>

<form class="row">
    <div class="form-group col-sm-4">
        <label for="startDate">Planned start date
        <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
        </label>
        <div class="input-group">
            <g:if test="${canChangeProjectDates}">
                <fc:datePicker targetField="plannedStartDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="startDate" data-bind="disable:!canEditStartDate(), datepicker:plannedStartDate.date" data-validation-engine="validate[required, past[plannedEndDate]]" printable="${printView}" size="input-large"/>
            </g:if>
            <g:else>
                <input type="text" data-bind="value:plannedStartDate.formattedDate" disabled="disabled" class="form-control form-control-sm input-medium" size="input-large">
            </g:else>
        </div>
    </div>
    <div class="form-group col-sm-4">
        <label for="endDate">Planned end date
        <fc:iconHelp title="End date">Date the project is intended to finish.</fc:iconHelp>
        </label>
        <div class="input-group">
            <fc:datePicker targetField="plannedEndDate.date" bs4="bs4" class="form-control form-control-sm dateControl" data-bind="disable:transients.fixedProjectDuration(), datepicker:plannedEndDate.date" name="endDate" data-validation-engine="validate[required, funcCall[validateProjectEndDate]]" printable="${printView}" size="input-large"/>
        </div>

    </div>
    <div class="col-sm-1">
        OR
    </div>
    <div class="col-sm-3">
        <label for="duration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="input-append">
            <input type="text" id="duration" class="form-control form-control-sm" name="duration" data-bind="disable:transients.fixedProjectDuration(), value:transients.plannedDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</form>
<form class="row">
    <p class="col-sm-12">These options control how project date changes will affect reports containing data and / or activities: </p>
    <div class=" form-group col-sm-12">
        <g:if test="${config?.activityBasedReporting}">
            <div class="form-check">
                <input type="checkbox" id="changeActivityDates" data-bind="disable:!canEditStartDate(), checked:changeActivityDates">
                <label for="changeActivityDates">Move activity dates with project start date:<fc:iconHelp>If this is selected, all of the activity dates in this project will be adjusted by the same amount of time that the project start date is adjusted</fc:iconHelp></label>
            </div>
        </g:if>
        <g:else>
            <div class="form-check">
                <input type="checkbox" id="keepReportEndDates" data-bind="disable:!canEditStartDate() || !includeSubmittedReports(), checked:keepReportEndDates">
                <label for="keepReportEndDates">Do not change end dates of submitted reports:<fc:iconHelp>If this is selected, (empty) reports that occur before the submitted report will be deleted as required rather than moving the dates of all reports to match the start date changes</fc:iconHelp></label>
            </div>
            <p>

            </p>
        </g:else>
        <div class="form-check">
            <input type="checkbox" id="includeSubmittedReports" data-bind="checked:includeSubmittedReports">
            <label for="includeSubmittedReports">Allow date changes to submitted or approved reports <fc:iconHelp>This project has submitted and/or approved reports.  Changing the project start date may result in a change to these reporting dates, depending on the reporting configuration and the new start date.</fc:iconHelp></label>
        </div>
        <div>
            <label for="dateChangeReason">Reason for changing the project start date:<fc:iconHelp>This reason is required when changing approved or submitted reports and will be recorded against the report status changes</fc:iconHelp></label>
            <textarea class="col-sm-12" rows="3" id="dateChangeReason" data-bind="enable:includeSubmittedReports, value:dateChangeReason" data-validation-engine="validate[required]"></textarea>

        </div>

    </div>

</form>

<form class="row">
    <div class="form-group col-sm-4">
        <label for="contractStartDate">Contract start date
        <fc:iconHelp title="Contract Start date">Contracted start date.</fc:iconHelp>
        </label>
        <div class="input-group">
            <fc:datePicker targetField="contractStartDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="contractStartDate" printable="${printView}" size="input-large"/>
        </div>
    </div>
    <div class="form-group col-sm-4">
        <label for="endDate">Contract end date
        <fc:iconHelp title="Contract End date">Date the project is contracted to finish.</fc:iconHelp>
        </label>
        <div class="input-group">
            <fc:datePicker targetField="contractEndDate.date" class="form-control form-control-sm dateControl" bs4="bs4" name="contractEndDate" data-validation-engine="validate[future[contractStartDate]]" printable="${printView}" size="input-large"/>
        </div>
    </div>
    <div class="col-sm-1">
        OR
    </div>
    <div class="col-sm-3">
        <label for="contractDuration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="input-append">
            <input type="text" id="contractDuration" class="form-control form-control-sm" name="contract-duration" data-bind="value:transients.contractDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</form>
<form class="row">
    <div class="form-group col-sm-4">
        <label>Project status
        	<fc:iconHelp title="Project status">Project status.</fc:iconHelp>
        </label>
        <!-- Application status cannot be changed until the MERI plan is approved. -->
        <!-- Application status is set only when creating the project -->
        <g:if test="${ProjectService.PLAN_UNLOCKED == project.planStatus || ProjectService.APPLICATION_STATUS == project.status}">
            <select class="form-control form-control-sm input-medium" id="projectState" data-bind="options:projectStatus, optionsText: 'name', optionsValue: 'id', value:status" disabled="disabled"></select>
        </g:if>
        <g:else>
            <select class="form-control form-control-sm input-medium" id="projectState" data-bind="options:projectStatus.filter(x => x.name != '${ProjectService.APPLICATION_STATUS}'), optionsText: 'name', optionsValue: 'id', value:status"></select>
        </g:else>
    </div>
    <div class="col-sm-4" data-bind="visible:status() ==='terminated'">
        <label class="required" for="terminationReason">Termination Reason </label>
            <textarea class="col-sm-12" id="terminationReason" rows="3" data-bind=" value:terminationReason" data-validation-engine="validate[required]"></textarea>

    </div>
</form>

<div class="row">
    <div class="form-group col-sm-12">
        <button type="button" data-bind="click:regenerateStageReports" class="btn btn-warning btn-sm">Re-create project stage reports</button>
    </div>
</div>

<div class="form-group col-sm-12 form-actions">
    <button type="button" id="saveSettings" data-bind="disable:transients.disableSave, click: saveSettings" class="btn btn-sm btn-primary">Save changes</button>
    <button type="button" id="cancel" class="btn btn-sm">Cancel</button>
</div>

