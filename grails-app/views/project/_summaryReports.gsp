<font size="4"><b>Summary report for </b></font> &nbsp; <select data-bind="options:timeline,  value: stage, event:{ change: stageSelectionHandler}" ></select>
&nbsp;Status of the report : 
<span data-bind="text: activityStatus, css: activityStatusTheme"></span> 
<span data-bind="visible: currentStage" class="badge badge-info" style="font-size: 13px;">Current</span>
<br/>
<b>From: </b><span data-bind="text:stageStart.formattedDate"></span> <b> To:</b> <span data-bind="text:stageEnd.formattedDate"></span>
<br/><br/>

<div data-bind="if:showStageMilestones">
	<p>
		Please complete the following sections for progress related to this stage. Update overall project information on the “Project details” page
	</p>
	<div class="row-fluid space-after">
	   <div class="span6">
	       	<div class="well well-small" >
				<label><b>Project objectives / goals / assets:</b></label>
				<p>Please enter the details of progress of the project against scheduled milestones during this reporting period:</p>
				<span data-bind="foreach: details['objectives']['rows']">
					<span data-bind="if: shortLabel">
						<b><span data-bind="text:shortLabel" ></span><span style="color: red;">*</span></b><br/> 
						<textarea style="width: auto;" data-bind="disable: $parent.disableSave, value: $data[$parent.stage()]" 
							data-validation-engine="validate[required]"   rows="5" cols="50"></textarea>
						<br/>	
					</span>
		   </span>
	       	</div>
	   </div>
	   <div class="span6">
	       <div class="well well-small" >
				<label><b>Progress against milestones:</b></label>
				<span data-bind="foreach: details['milestones']['rows']">
				<span data-bind="if: shortLabel">
					<b><span data-bind="text:shortLabel" ></span><span style="color: red;">*</span></b>&nbsp; <span data-bind="text:dueDate.formattedDate" ></span><br/> 
					<textarea style="width: auto;" data-bind="disable: $parent.disableSave, value: $data[$parent.stage()]"  
					data-validation-engine="validate[required]" rows="5" cols="50"></textarea>
					<br/>
				</span>	
		   </span>
	       </div>
	   </div>
	</div>
	
	<div id="summary-result-placeholder"></div>
	
	<div class="form-actions">
			<button type="button" id="project-details-save" data-bind="disable: disableSave, click: saveSummaryDetails" class="btn btn-primary">Save Changes</button>
			<button type="button" id="summary-cancel" class="btn">Cancel</button><br/><br/>
			<button type="button" id="project-stage-preview" data-bind= "click: openStageReport" class="btn btn-info">Preview report</button>
			<button type="button" id="project-details-submit" data-bind="attr:{title:'Submit this stage for implementation approval. Report cannot be submitted while activities are still open.'}, enable: readyToSubmit,  click: submitStageReport" class="btn btn-success">Submit report</button>
	
	</div>
	
	<div id="stageDeclaration" class="modal hide fade">
	    <g:set var="legalDeclaration"><fc:getSettingContent settingType="${au.org.ala.fieldcapture.SettingPageType.DECLARATION}"/></g:set>
	    <div class="modal-header hide">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h3>Declaration</h3>
	    </div>
	    <div class="modal-body">
	        ${legalDeclaration}
	    </div>
	    <div class="modal-footer">
	        <label for="acceptTerms" class="pull-left">
	            <g:checkBox name="acceptTerms" data-bind="checked:termsAccepted" style="margin:0;"/>&nbsp;
	            I agree with the above declaration.
	        </label>
	        <button class="btn btn-success" data-bind="click:submitReport, enable:termsAccepted" data-dismiss="modal" aria-hidden="true">Submit</button>
	        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
	    </div>
	</div>
</div>	
<div data-bind="ifnot: showStageMilestones">
	<h4>Update overall project information on the “Project details” page.</h4>
</div>