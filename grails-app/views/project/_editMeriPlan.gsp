<!-- ko stopBinding: true -->
<h3>MERI Plan</h3>
<div id="edit-meri-plan">
<script id="submittedPlanTmpl" type="text/html">
<div class="required">
	<div class="form-actions" >
		<b>Grant manager actions:</b>
		<div data-bind="if:!canApprove()">
			<div class="alert alert-info">
				At least one Tech One Project Code or SAP Internal Order must be provided before the MERI plan can be approved
			</div>
			<div class="form-group row">
				<label class="col-form-label col-sm-2">Financial system identifier/s:</label>
				<div class="col-sm-10">
					<external-ids params="externalIds:externalIds, externalIdTypes:externalIdTypes, validationNamespace:'meriPlanExternalId', validate:validateExternalIds"></external-ids>
				</div>
			</div>
		</div>
		<span class="grantManagerActionSpan">
			<button type="button" data-bind="enable: canApproveMeriPlan, click:approvePlan, style:{'pointer-events': canApproveMeriPlan() ? 'all': 'none'}" class="btn btn-sm btn-success"><i class="fa fa-check"></i> Approve MERI Plan</button>
			<button type="button" data-bind="click:rejectPlan" class="btn btn-sm btn-danger"><i class="fa fa-remove"></i> Reject MERI Plan</button>
		</span>
	</div>
</div>
</script>
<script id="approvedPlanTmpl" type="text/html">
<div class="required">
	<div class="form-actions">
		<b>Grant manager actions:</b>
		<button type="button" data-bind="enable:canModifyPlan, click: modifyPlan"  id="modify-plan" class="btn btn-sm btn-info">Modify MERI Plan</button>
		<!-- ko if:!canModifyPlan -->
			<fc:iconHelp>This program requires a MERIT administrator to modify the MERI plan</fc:iconHelp>
		<!-- /ko -->
		<br/><br/>
		<ul>
			<!-- ko if:canModifyPlan -->
			<li>Pressing "Modify MERI Plan" will allow project administrators to edit MERI plan information. </li>
			<!-- /ko -->
			<!-- ko if: !canModifyPlan -->
			<li>This program requires a MERIT administrator to modify the MERI plan</li>
			<!-- /ko -->
		</ul>
	</div>
</div>
</script>
<script id="editablePlanTmpl" type="text/html">

</script>
<script id="completedProjectTmpl" type="text/html">
<div class="required">
	%{--<div class="form-actions" >--}%
		%{--<b>Grant manager actions:</b>--}%
		%{--<span class="btn-group">--}%
			%{--<button type="button" data-bind="click:unlockPlanForCorrection" class="btn btn-danger"><i class="fa fa-unlock"></i> Unlock plan for correction</button>--}%
		%{--</span>--}%
	%{--</div>--}%
</div>
</script>
<script id="unlockedProjectTmpl" type="text/html">
<div class="required">
	<div class="form-actions" >
		<b>Grant manager actions:</b>
		<span class="unlockGroup">
			<button type="button" data-bind="click:finishCorrections" class="btn btn-sm btn-success"><i class="fa fa-lock icon-white"></i> Finished corrections</button>
		</span>
	</div>
</div>
</script>

<g:render template="/shared/declaration" model="[divId:'unlockPlan',  declarationType:au.org.ala.merit.SettingPageType.UNLOCK_PLAN_DECLARATION]"/>
<g:render template="meriPlanApprovalModal"/>
<div class="row mb-4">
	<div class="col-sm-3">
		<div class="control-group">
			<span class="badge text-white" style="font-size: 13px;" data-bind="text:meriPlanStatus().text, css:meriPlanStatus().badgeClass"></span>
			<span data-bind="if:detailsLastUpdated"> <br/>Last update date : <span data-bind="text:detailsLastUpdated.formattedDate"></span></span>
		</div>
	</div>
	<div class="meri-buttons col-sm-9 ml-auto">
		<g:if test="${projectContent.details.visible}">
		<button type="button" class="btn btn-sm btn-info" data-bind="click: meriPlanPDF">Display Printable MERI Plan</button>
		</g:if>


	<g:if test="${showMeriPlanComparison}">

		<button type="button" class="btn btn-sm btn-info" data-bind="enable:canCompareWithLatestApprovedPlan(), click: meriPlanChanges">Compare with the latest approved MERI Plan</button>

	</g:if>
<g:if test="${showMeriPlanHistory}">

		<a class="btn btn-info btn-sm meri-history-toggle" data-bind="click:toggleMeriPlanHistory, text:meriPlanHistoryVisible() ? 'Hide approval history' : 'Show approval history'">Show MERI plan approvals</a>
</g:if>

	</div>
</div>

<g:if test="${showMeriPlanHistory}">
<div data-bind="visible:meriPlanHistoryVisible">
	<h4>History of approved MERI plans</h4>
	<div data-bind="visible:!meriPlanHistoryInitialised()">
		<asset:image src="spinner.gif"/>
	</div>
	<div data-bind="visible:meriPlanHistoryInitialised()">

	<div data-bind="visible:approvedPlans().length > 0">

	<table class="table table-striped meri-approval-history">
		<thead>
		<tr>
			<th class="approval-date">Date / Time Approved</th>
			<th class="ref">Change Order Numbers</th>
			<th class="comments">Comments</th>
			<th class="approver">Approved by</th>
			<th class="report-actions">Actions</th>
		</tr>
		</thead>
		<tbody data-bind="foreach:approvedPlans">
		<tr>
			<td class="approval-date" data-bind="text:dateApproved"></td>
			<td class="ref" data-bind="text:referenceDocument"></td>
			<td class="comments" data-bind="text:reason"></td>
			<td class="approver"><span data-bind="text:userDisplayName"></span></td>
			<td class="report-actions">
				<a class="btn btn-container btn-sm" target="_meriPlan" data-bind="attr:{href:openMeriPlanUrl}">
					<i class="fa fa-external-link" title="Open">
					</i></a>
				<g:if test="${showMeriPlanComparison}">
					<a class="btn btn-container btn-sm" target="_meriPlan" data-bind="attr:{href:openMeriPlanChangesUrl}">
						<i class="fa fa-code-fork" title="View Changes"></i>
					</a>
				</g:if>
				<g:else>
					<a class="btn btn-container btn-sm" class="btn btn-container btn-sm disabled-icon">
						<i class="fa fa-code-fork" title="View Changes"></i>
					</a>
				</g:else>

				<g:if test="${fc.userIsAlaOrFcAdmin()}">
					<a class="btn btn-container btn-sm pull-right" href="javascript:void(0)" title="Delete"
					   data-bind="click:$parent.deleteApproval"><i class="fa fa-remove" style="color:red;"></i>
					</a>
				</g:if>
			</td>
		</tr>
		</tbody>
	</table>
	</div>
	<div data-bind="visible:approvedPlans().length == 0">
		No MERI plan approvals found.
	</div>
	</div>
</div>
</g:if>


<!--  Case manager actions -->
<g:if test="${user?.isCaseManager}">
	<div class="row space-after">
		<div data-bind="template:meriGrantManagerActionsTemplate" class="col-sm-12"></div>
	</div>
</g:if>
<g:elseif test="${fc.userIsSiteAdmin() && !user?.isCaseManager}">
	<div class="alert alert-info">
		To approve the MERI plan add yourself as a grant manager to this project using the Project Access section
	</div>
</g:elseif>

<g:if test="${projectContent.details.visible}">
	<div class="save-details-result-placeholder"></div>

	<!-- ko if:isPlanEditable() -->
	<g:if test="${project.lock && (project.lock.userId !=  user.userId)}">
		<div class="row mb-2">
			<div class="col-sm-12 pl-3 pr-3">
				<div class="alert alert-danger meri-locked">
					<p class="text-dark">This form has been locked for editing by <fc:userDisplayName userId="${project.lock.userId}" defaultValue="an unknown user"/> since ${au.org.ala.merit.DateUtils.displayFormatWithTime(project.lock.dateCreated)}</p>
					<p class="text-dark">To edit anyway, click the button below.  Note: <b>Any unsaved edits made by the user currently holding the lock will be lost and unable to be recovered</b>.</p>
					<a href="${createLink(action:'overrideMeriPlanLockAndEdit', id:project.projectId)}"><button type="button" class="btn btn-sm btn-danger"><i class="fa fa-edit"></i> Edit Anyway</button></a>

				</div>
			</div>
		</div>
	</g:if>
	<g:if test="${!project.lock}">
		<div data-bind="if:isPlanEditable()" class="row mb-2">
			<div class="col-sm-12 pl-3 pr-3">
				<div class="alert alert-danger report-locked">
					<p class="text-dark">You must unlock the plan to edit it, and when finished you must save your work by pressing the "Save changes and finish editing" or the "Submit for approval" button below otherwise your work will not be saved. Do not close or press back on your browser to exit or your work will be lost.</p>
					<a id="lockMeriPlan" href="${createLink(action:'lockMeriPlan', id:project.projectId)}"><button type="button" class="btn btn-sm btn-danger"><i class="fa fa-edit"></i> Unlock for Editing</button></a>
				</div>
			</div>
		</div>
		<div class="form-actions">Admin actions: <g:render template="submitMeriPlanButton" model="${[clickCallback:'submitChanges']}"/></div>

	</g:if>
	<!-- /ko -->
        <!-- ko if:isPlanEditable() -->
	<g:render template="meriPlanEditActions"/>
	<!-- /ko -->

	<div class="controls">
		<b>From: </b><span data-bind="text: plannedStartDate.formattedDate"></span>  <b>To: </b> <span data-bind="text: plannedEndDate.formattedDate"></span>
	</div>

	<g:render template="${meriPlanTemplate}" model="${[config:config, mode : au.org.ala.merit.ReportService.ReportMode.EDIT.name()]}"/>

</g:if>
<g:else> <%-- For projects that don't use a MERI plan, the MERI lifecycle is still used for the Activities tab to move between planning and reporting mode --%>
	<!-- ko if:isPlanEditable() -->
	<div class="form-actions">Admin actions:
		<button type="button" data-bind="click: submitChanges" class="btn btn-sm btn-info saveAndSubmitChanges">Submit for approval</button><fc:iconHelp html="true">Once the Project Manager has approved the MERI plan reporting via the Activities tab will be enabled</fc:iconHelp>
	</div>
	<!-- /ko -->
</g:else>

<div class="save-details-result-placeholder"></div>


	<g:render template="meriPlanEditActions"/>


<div id="floating-save" style="display:none;">
	<div class="transparent-background"></div>
	<div><button class="right btn btn-sm btn-info" data-bind="click: saveProjectDetails">Save changes</button></div>
</div>
</div>
<!-- /ko -->
