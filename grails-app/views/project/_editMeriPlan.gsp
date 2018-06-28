
<script id="submittedPlanTmpl" type="text/html">
<div class="span6 required">
	<div class="form-actions" >
		<b>Grant manager actions:</b>
		<span class="btn-group">
			<button type="button" data-bind="click:approvePlan" class="btn btn-success"><i class="fa fa-check icon-white"></i> Approve</button>
			<button type="button" data-bind="click:rejectPlan" class="btn btn-danger"><i class="fa fa-remove icon-white"></i> Reject</button>
		</span>
	</div>
</div>
</script>
<script id="approvedPlanTmpl" type="text/html">
<div class="span6 required">
	<div class="form-actions">
		<b>Grant manager actions:</b>
		<button type="button" data-bind="click: modifyPlan"  id="modify-plan" class="btn btn-info">Modify MERI Plan</button>
		<br/><br/>
		<ul>
			<li>"Modify MERI Plan" will allow project admin's to edit MERI plan information. </li>
			<li>Modifying the MERI plan will change the state of the project to "Not approved".</li>
		</ul>
	</div>
</div>
</script>
<script id="editablePlanTmpl">

</script>
<script id="completedProjectTmpl" type="text/html">
<div class="span6 required">
	%{--<div class="form-actions" >--}%
		%{--<b>Grant manager actions:</b>--}%
		%{--<span class="btn-group">--}%
			%{--<button type="button" data-bind="click:unlockPlanForCorrection" class="btn btn-danger"><i class="fa fa-unlock"></i> Unlock plan for correction</button>--}%
		%{--</span>--}%
	%{--</div>--}%
</div>
</script>
<script id="unlockedProjectTmpl" type="text/html">
<div class="span6 required">
	<div class="form-actions" >
		<b>Grant manager actions:</b>
		<span class="btn-group">
			<button type="button" data-bind="click:finishCorrections" class="btn btn-success"><i class="fa fa-lock icon-white"></i> Finished corrections</button>
		</span>
	</div>
</div>
</script>

<g:render template="/shared/declaration" model="[divId:'unlockPlan', declarationType:au.org.ala.merit.SettingPageType.UNLOCK_PLAN_DECLARATION]"/>

<div class="row-fluid">
	<div class="control-group">
		<div>
			<span class="badge" style="font-size: 13px;" data-bind="text:meriPlanStatus().text, css:meriPlanStatus().badgeClass"></span>
			<span data-bind="if:detailsLastUpdated"> <br/>Last update date : <span data-bind="text:detailsLastUpdated.formattedDate"></span></span>
		</div>
	</div>
</div>

<!--  Case manager actions -->
<div class="row-fluid space-after" data-bind="visible: userIsCaseManager()">
	<div data-bind="template:meriGrantManagerActionsTemplate"></div>
</div>

<g:if test="${projectContent.details.visible}">
	<div class="save-details-result-placeholder"></div>
	<div class="row-fluid space-after">
		<div class="span6">
			<div class="form-actions">
				<div>
					<label><input class="pull-left" type="checkbox"  data-bind="checked: details.caseStudy, disable: isProjectDetailsLocked()" />
					<span>&nbsp;Are you willing for your project to be used as a case study by the Department?</span></label>
				</div>
				<br/>

				<button type="button" data-bind="click: saveProjectDetails, disable: isProjectDetailsLocked()" class="btn btn-primary">Save changes</button>
				<button type="button" class="btn" data-bind="click: cancelProjectDetailsEdits">Cancel</button>
				<button type="button" class="btn btn-info" data-bind="click: meriPlanPDF">Generate PDF</button>

				<!--  Admin - submit to approval. -->
				<div data-bind="if: userIsAdmin()">
					<div data-bind="if: planStatus() == 'not approved' || planStatus() == ''">
						<hr/>
						<b>Admin actions:</b>
						<g:if test="${showMERIActivityWarning}">
						<ul>
							<li>You will not be able to report activity data until your MERI plan has been approved by your case manager.</li>
						</ul>
						</g:if>
						<button type="button" data-bind="click: saveAndSubmitChanges" class="btn btn-info">Submit for approval</button>
					</div>
					<div data-bind="if: planStatus() == 'submitted' || planStatus() == 'approved'">
                        <g:if test="${showMERIActivityWarning}">
						<hr/>

						<b>Admin:</b>
						<ul>
							<li>You will not be able to report activity data until your MERI plan has been approved by your case manager.</li>
						</ul>
						</g:if>
					</div>
				</div>
			</div>

		</div>
	</div>

	<div class="controls">
		<b>From: </b><span data-bind="text: plannedStartDate.formattedDate"></span>  <b>To: </b> <span data-bind="text: plannedEndDate.formattedDate"></span>
	</div>

	<g:render template="${meriPlanTemplate}"/>
</g:if>

<div class="save-details-result-placeholder"></div>

<div class="row-fluid space-after">
	<div class="span6">
		<div class="form-actions">
			<div>
				<label><input class="pull-left" type="checkbox"  data-bind="checked: details.caseStudy, disable: isProjectDetailsLocked()" />
				<span>&nbsp;Are you willing for your project to be used as a case study by the Department?</span></label>
			</div>
			<br/>

			<button type="button" data-bind="click: saveProjectDetails, disable: isProjectDetailsLocked()" class="btn btn-primary">Save changes</button>
			<button type="button" class="btn" data-bind="click: cancelProjectDetailsEdits">Cancel</button>
			<g:if test="${projectContent.details.visible}"><button type="button" class="btn btn-info" data-bind="click: meriPlanPDF">Generate PDF</button></g:if>

			<!--  Admin - submit to approval. -->
			<div data-bind="if: userIsAdmin()">
				<div data-bind="if: planStatus() == 'not approved' || planStatus() == ''">
					<hr/>
					<b>Admin actions:</b>
					<g:if test="${showActivityWarning}">
					<ul>
						<li>You will not be able to report activity data until your MERI plan has been approved by your grant manager.</li>
					</ul>
					</g:if>
					<button type="button" data-bind="click: saveAndSubmitChanges" class="btn btn-info">Submit for approval</button>
				</div>
				<div data-bind="if: planStatus() == 'submitted' || planStatus() == 'approved'">
                    <g:if test="${showMERIActivityWarning}">
                    <hr/>
					<b>Admin:</b>
					<ul>
						<li>You will not be able to report activity data until your MERI plan has been approved by your grant manager.</li>
					</ul>
					</g:if>
				</div>
			</div>
		</div>

	</div>
</div>

<div id="floating-save" style="display:none;">
	<div class="transparent-background"></div>
	<div><button class="right btn btn-info" data-bind="click: saveProjectDetails">Save changes</button></div>
</div>
