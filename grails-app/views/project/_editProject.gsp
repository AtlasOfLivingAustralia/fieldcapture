<%@ page import="au.org.ala.merit.ProjectService" %>
<div class="row mb-2">
    <div class="col-sm-12">
        <label for="name" class="control-label">Project name</label>
        <div class="controls">
            <input type="text" class="form-control form-control-sm input-large" id="name" data-bind="value: name"
                   data-validation-engine="validate[required]"/>
        </div>
    </div>
</div>
<g:if test="${grailsApplication.config.getProperty("app.enableALAHarvestSetting", Boolean)}">
<div class="row mb-2">
    <div class="col-sm-12">
        <label for="name" class="control-label">Harvest records to ALA</label>
        <div class="controls">
            <div>
                <select class="form-control form-control-sm input-large" data-bind="options: transients.yesNoOptions, value: transients.alaHarvest, optionsCaption: 'Please select'"></select>
            </div>
        </div>
    </div>
</div>
</g:if>


<associated-orgs params="associatedOrgs:associatedOrgs, validationNamespace:'projectSettingsAssociatedOrgs', organisationSearchUrl:organisationSearchUrl, organisationViewUrl:organisationViewUrl, displayName:true, relationshipTypes: ['Recipient', 'Service provider', 'Grantee']"></associated-orgs>

<div class="row mb-2">
    <div class="col-sm-12">
        <label for="comment">Comment (including organisation changes)</label>
        <textarea id="comment" rows="3" cols="50" class="form-control form-control-sm input-large" data-bind="value:comment"></textarea>
    </div>
</div>

<g:if test="${meriPlanStatus == true && project.programId}">
    <div class="row mb-2">
        <div class="col-sm-6">
            <label for="programId" class="control-label">Program </label>
            <div class="controls">
                <g:select class="programId form-control form-control-sm input-medium" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name" disabled="disabled"/>

            </div>
        </div>
    </div>
</g:if>
<g:elseif test="${meriPlanStatus == false  && project.programId}">
    <div class="row mb-2">
        <div class="col-sm-6">
            <label for="programId" class="control-label">Program </label>
            <div class="controls">
                <g:select class="programId form-control form-control-sm input-medium" from="${programList}" data-bind="value:programId" optionKey="programId" name="name" id="programId" optionValue="name"/>

            </div>
        </div>
    </div>
</g:elseif>
<div class="row mb-2">
    <div class="col-sm-12">
        <div class="control-group">
            <label for="description" class="control-label">Project description
                <fc:iconHelp helpTextCode="project.description.help"></fc:iconHelp>
            </label>
            <div class="controls">
                <textarea data-bind="value:description" class="form-control form-control-sm input-large" id="description" rows="3" cols="50"></textarea>
            </div>
        </div>
    </div>
</div>
<div class="row mb-2">
    <div class="col-sm-4">
        <label class="control-label" for="externalId">External id</label>
        <div class="controls">
            <g:textField class="form-control form-control-sm input-small" name="externalId" data-bind="value:externalId"/>
        </div>
    </div>
    <div class="col-sm-4">
        <label class="control-label" for="grantId">Grant id</label>
        <div class="controls">
            <g:textField class="form-control form-control-sm input-small" name="grantId" data-bind="value:grantId"/>
        </div>
    </div>
</div>

<external-ids params="externalIds:externalIds, externalIdTypes:externalIdTypes, validationNamespace:'projectSettingsExternalId', validate:validateExternalIds"></external-ids>


<div class="row mb-2">
    <div class="col-sm-4">
        <label for="funding">Project Funding (GST Exclusive)</label>
        <div>
            <g:textField class="form-control form-control-sm input-small" id="funding" name="funding" data-bind="value:funding" data-validation-engine="validate[custom[number]]"/>
        </div>
    </div>

    <div class="col-sm-4">
        <label for="funding-verification-date">Funding Verification Date</label><fc:iconHelp>If the funding amount is already correct, press the "Verify funding is correct" button to record the verification date.  If you update the funding amount the verification date will automatically be updated.</fc:iconHelp>
        <div class="input-group input-append">
            <fc:datePicker targetField="fundingVerificationDate.date" id="funding-verification-date" bs4="true" name="fundingVerificationDate" size="form-control form-control-sm dateControl" readonly="readonly" autocomplete="off"/>
            <button class="ml-2 btn btn-warning btn-sm" data-bind="click:verifyFunding">Verify funding is correct</button>
        </div>
    </div>
</div>

<div class="row mb-2">
    <div class="col-sm-4">
        <label class="control-label" for="manager">Project manager</label>
        <div class="controls">
            <g:textField class="form-control form-control-sm input-small" name="manager" data-bind="value:manager"/>
        </div>
    </div>
</div>
<g:if test="${!canChangeProjectDates}">
    <div class="alert alert-block">You cannot change the start date for a project with submitted or approved reports or MERI plan.</div>
</g:if>
<div class="row mb-2">
    <div class="col-sm-4">
        <label for="startDate">Planned start date
        <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
        </label>
        <div class="input-group input-append">
            <g:if test="${ProjectService.APPLICATION_STATUS == project.status || canRegenerateReports}">
                <g:if test="${canChangeProjectDates}">
                    <fc:datePicker targetField="plannedStartDate.date" id="startDate" bs4="true" name="startDate" data-bind="disable:!canEditStartDate(), datepicker:plannedStartDate.date" data-validation-engine="validate[required, past[plannedEndDate]]" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>

                </g:if>
                <g:else>
                    <input type="text" id="startDate" data-bind="value:plannedStartDate.formattedDate" disabled="disabled" size="form-control form-control-sm input-small"/>
                </g:else>
            </g:if>
            <g:else>
                <fc:datePicker targetField="plannedStartDate.date" id="startDate" bs4="true" name="startDate" data-bind="disable:true, datepicker:plannedStartDate.date" data-validation-engine="validate[required, past[plannedEndDate]]" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>
            </g:else>
        </div>
    </div>
    <div class="col-sm-4">
        <label for="endDate">Planned end date
        <fc:iconHelp title="End date">Date the project is intended to finish.
            <g:if test="${hasSubmittedOrApprovedFinalReportInCategory}">
                The end date for a project cannot be changed Project status is not Active/Application, or if the last report in any category has been submitted, cancelled or approved
            </g:if>
        </fc:iconHelp>
        </label>
        <div class="input-group input-append">
            <g:if test="${ProjectService.APPLICATION_STATUS == project.status || canRegenerateReports}">
                            <fc:datePicker targetField="plannedEndDate.date" bs4="true" data-bind="disable:transients.fixedProjectDuration(), datepicker:plannedEndDate.date" name="endDate" data-validation-engine="validate[required, funcCall[validateProjectEndDate]]" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>
            </g:if>
            <g:else>
                <fc:datePicker targetField="plannedEndDate.date" bs4="true" data-bind="disable:true, datepicker:plannedEndDate.date" name="endDate" data-validation-engine="validate[required, funcCall[validateProjectEndDate]]" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>
            </g:else>

        </div>

    </div>
    <div class="col-sm-1">
        OR
    </div>
    <div class="col-sm-3">
        <label for="duration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="controls">
            <input class="form-control form-control-sm input-small" id="duration" name="duration" data-bind="disable:transients.fixedProjectDuration(), value:transients.plannedDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>
<div class="row mb-2">
    <div class="col-sm-12">
        <p>These options control how project date changes will affect reports containing data and / or activities: </p>
    </div>

    <div class="col-sm-12">
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
    </div>
    <div class="col-sm-12">
        <p><input type="checkbox" data-bind="checked:includeSubmittedReports"> Allow date changes to submitted or approved reports <fc:iconHelp>This project has submitted and/or approved reports.  Changing the project start date may result in a change to these reporting dates, depending on the reporting configuration and the new start date.</fc:iconHelp></p>
        <p>
            <label for="dateChangeReason">Reason for changing the project start date:<fc:iconHelp>This reason is required when changing approved or submitted reports and will be recorded against the report status changes</fc:iconHelp>
                <textarea id="dateChangeReason" class="col-sm-12 form-control form-control-sm input-large" rows="3" data-bind="enable:includeSubmittedReports, value:dateChangeReason" data-validation-engine="validate[required]"></textarea>
            </label>
        </p>
    </div>



</div>

<div class="row mb-2">
    <div class="col-sm-4">
        <label for="contractStartDate">Contract start date
        <fc:iconHelp title="Contract Start date">Contracted start date.</fc:iconHelp>
        </label>
        <div class="input-group input-append">
            <fc:datePicker targetField="contractStartDate.date" bs4="true" name="contractStartDate" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>
        </div>
    </div>
    <div class="col-sm-4">
        <label for="endDate">Contract end date
        <fc:iconHelp title="Contract End date">Date the project is contracted to finish.</fc:iconHelp>
        </label>
        <div class="input-group input-append">
            <fc:datePicker targetField="contractEndDate.date" bs4="true" name="contractEndDate" data-validation-engine="validate[future[contractStartDate]]" printable="${printView}" size="form-control form-control-sm dateControl" autocomplete="off"/>
        </div>

    </div>
    <div class="col-sm-1">
        OR
    </div>
    <div class="col-sm-3">
        <label for="duration" for="contract-duration">Duration (weeks)
        <fc:iconHelp title="Duration">The number of weeks the project will run for.</fc:iconHelp>
        </label>
        <div class="controls">
            <input id="contract-duration" class="form-control form-control-sm input-small" name="contract-duration" data-bind="value:transients.contractDuration" data-validation-engine="validate[custom[number]]"/>
        </div>

    </div>
</div>

<div class="row mb-2">
    <div class="col-sm-4">
        <label for="projectState">Project status
        	<fc:iconHelp title="Project status">Project status.</fc:iconHelp>
        </label>
        <!-- Application status cannot be changed until the MERI plan is approved. -->
        <!-- Application status is set only when creating the project -->
        <div class="control">
        <g:if test="${ProjectService.PLAN_UNLOCKED == project.planStatus || ProjectService.APPLICATION_STATUS == project.status}">
            <select class="form-control form-control-sm input-small" id="projectState" data-bind="options:projectStatus, optionsText: 'name', optionsValue: 'id', value:status" disabled="disabled"></select>
        </g:if>
        <g:else>
            <select class="form-control form-control-sm input-small" id="projectState" data-bind="options:projectStatus.filter(x => x.name != '${ProjectService.APPLICATION_STATUS}'), optionsText: 'name', optionsValue: 'id', value:status"></select>
        </g:else>
    </div>
    </div>
    <div class="col-sm-4" data-bind="visible:status() ==='terminated'">
        <label class="required" for="terminationReason">Termination Reason </label>
            <textarea class="form-control form-control-sm col-sm-12" id="terminationReason" rows="3" data-bind=" value:terminationReason" data-validation-engine="validate[required]"></textarea>

    </div>
</div>

<div class="row mb-2">
    <div class="col-sm-12">
        <label>Override Sites
        <fc:iconHelp title="Project geographic information">Override sites based geographic location calculation of a project to find geographic extent</fc:iconHelp>
        </label>
        <div class="alert alert-info">
            The following information only needs to be filled out if:
            <ul>
                <li>Downloaded information contradicts the actual electorate/state names that should be displayed.</li>
                <li>There is no information available in the Sites tab.</li>
            </ul>
        </div>
        <div class="control">
            <table class="table">
                <tbody>
                <tr>
                    <td>
                        Settings
                    </td>
                    <td>
                        The sites for this project should be:
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="national" data-bind="checked: geographicInfo.nationwide">
                            <label class="form-check-label" for="national">National</label>
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="statewide" data-bind="checked: geographicInfo.statewide">
                            <label class="form-check-label" for="statewide">Statewide</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="primaryElectorate">Primary electorate</label>
                    </td>
                    <td>
                        <select id="primaryElectorate" data-bind="options:transients.electorates, value:geographicInfo.primaryElectorate, optionsCaption: 'Select an electorate', disable: geographicInfo.nationwide() || geographicInfo.statewide() || !geographicInfo.overridePrimaryElectorate()" class="select form-control" data-validation-engine="validate[required]"></select>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="geographicInfoElectorateBehaviour" name="geographicInfoElectorateBehaviour" data-bind="checked: geographicInfo.overridePrimaryElectorate">
                            <label class="form-check-label" for="geographicInfoElectorateBehaviour">Override primary electorate with above selection.</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="otherElectorates">Other electorates</label>
                    </td>
                    <td>
                        <div class="form-group">
                            <label for="otherElectorates">Include</label>
                            <select id="otherElectorates" multiple="multiple" data-bind="options:transients.electorates.electoratesToInclude, multiSelect2:{value:geographicInfo.otherElectorates, placeholder:'', tags: false}, disable: geographicInfo.nationwide() || geographicInfo.statewide()" class="select form-control"></select>
                        </div>
                        <div class="form-group">
                            <label for="otherExcludedElectorates">Exclude</label>
                            <select id="otherExcludedElectorates" multiple="multiple" data-bind="options:transients.electorates.electoratesToExclude, multiSelect2:{value:geographicInfo.otherExcludedElectorates, placeholder:'', tags: false}, disable: geographicInfo.nationwide() || geographicInfo.statewide()" class="select form-control"></select>
                        </div>
                    </td>
                </tr>
                    <tr>
                        <td>
                            <label for="primaryState">Primary state</label>
                        </td>
                        <td>
                            <select id="primaryState" data-bind="options:transients.states, value:geographicInfo.primaryState, optionsCaption: 'Select a state', disable: geographicInfo.nationwide() || !geographicInfo.overridePrimaryState()" class="select form-control"  data-validation-engine="validate[required]"></select>
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="geographicInfoStateBehaviour" name="geographicInfoStateBehaviour" data-bind="checked: geographicInfo.overridePrimaryState, disable: geographicInfo.overridePrimaryElectorate()">
                                <label class="form-check-label" for="geographicInfoStateBehaviour">Override primary state with above selection.</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="otherStates">Other states</label>
                        </td>
                        <td>
                            <div class="form-group">
                                <label for="otherStates">Include</label>
                                <select id="otherStates" multiple="multiple" data-bind="options:transients.states.statesToInclude, multiSelect2:{value:geographicInfo.otherStates, placeholder:'', tags: false}, disable: geographicInfo.nationwide()" class="select form-control"></select>
                            </div>
                            <div class="form-group">
                                <label for="otherExcludedStates">Exclude</label>
                                <select id="otherExcludedStates" multiple="multiple" data-bind="options:transients.states.statesToExclude, multiSelect2:{value:geographicInfo.otherExcludedStates, placeholder:'', tags: false}, disable: geographicInfo.nationwide()" class="select form-control"></select>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row mb-2">
    <div class="col-sm-12">
        <button data-bind="click:regenerateStageReports" class="btn btn-sm btn-warning" <g:if test="${!canRegenerateReports}">disabled="disabled"</g:if>>Re-create project reports</button>
        <fc:iconHelp title="Re-create project">Re-create project reports will be disabled when the Project status is not Active, or if the last report in any category has been submitted, cancelled or approved</fc:iconHelp>
    </div>
</div>

<div class="form-actions">
    <button type="button" id="saveSettings" data-bind="disable:transients.disableSave, click: saveSettings" class="btn btn-sm btn-primary">Save changes</button>
    <button type="button" id="cancel" class="btn btn-sm btn-danger">Cancel</button>
</div>
