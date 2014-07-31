<font size="4"><b>Summary report for </b></font> &nbsp; <select data-bind="options:timeline, value: stage, event:{ change: stageSelectionHandler}" ></select>
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
	<div class="row-fluid" >
	   <div class="span6">
	       	<div class="well well-small" >
				<label><b>Project objectives / goals / assets:</b></label>
				<p>Please enter the details of progress of the project against scheduled milestones during this reporting period:</p>
				<span data-bind="foreach: details['objectives']['rows']">
					<span data-bind="if: shortLabel">
						<b><span data-bind="text:shortLabel" ></span><span style="color: red;">*</span></b><br/> 
						<textarea style="width: 98%;" data-bind="disable: $parent.disableSave, value: $data[$parent.stage()]" 
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
					<b><span data-bind="text:shortLabel" ></span><span style="color: red;">*</span></b>
					<span style="float:right;">Due date: <span data-bind="text: dueDate.formattedDate" ></span></span>
					<textarea style="width: 98%;" data-bind="disable: $parent.disableSave, value: $data[$parent.stage()]"  
					data-validation-engine="validate[required]" rows="5" cols="50"></textarea>
					<br/>
				</span>	
		   </span>
	       </div>
	   </div>
	</div>
	
	<div class="row-fluid space-after">
		<div class="required">
		        <div id="project-risks-threats" class="well well-small">
				<label><b>Project risks & threats</b></label> 	 
				  <p>Please enter the details of risks and threats to the project and the mitigation strategies being used to address them. These should be updated at each reporting period:</p>
				  <div align="right"> Overall project risk profile : <span style="color: red;">*</span> 
						<span class="ratingStyling">
							<select data-validation-engine="validate[required]" data-bind="options: ratingOptions, value:details['risks'].overallRisk, optionsCaption: 'Please select', css: overAllRiskHighlight" id="overall-risk"></select>
						 </span>
				  </div>
				  <table style="width:100%;">
				      <thead>
				          <tr>
				            <th>Type of threat / risk <span style="color: red;"><b>*</b></span></th>
				            <th>Description <span style="color: red;"><b>*</b></span></th>
							<th>Likelihood <span style="color: red;"><b>*</b></span></th>			                
							<th>Consequence <span style="color: red;"><b>*</b></span></th>							
							<th>Risk rating</th>
							<th>Current control / <br/>Contingency strategy <span style="color: red;"><b>*</b></span></th>														
							<th>Residual risk <span style="color: red;"><b>*</b></span></th>	
							<th></th>												
				          </tr>
				      </thead>
				      <tbody data-bind="foreach : details['risks']['rows']" >
				              <tr>
				                  <td width="18%">
				                  	<select style="width:98%;" data-validation-engine="validate[required]" data-bind="options: $parent.threatOptions, value: threat, optionsCaption: 'Please select'" id="type-of-threat"></select>
				                  </td>
				                  <td width="20%">
				                  	<textarea style="width:97%;" data-validation-engine="validate[required]" class="input-xlarge" data-bind="value: description"  id="risks-threats-description" rows="5"></textarea>
				                  	
				                  </td>
				                  <td width="10%">
				                  	<select style="width:98%;" data-validation-engine="validate[required]" data-bind="options: $parent.likelihoodOptions, value: likelihood, event:{ change: $parent.likelihoodChanged}, optionsCaption: 'Please select'" id="likelihood"></select>
				                  </td>
				                  <td width="10%">
									<select style="width:98%;"  data-validation-engine="validate[required]" data-bind="options: $parent.consequenceOptions, value: consequence, event:{ change: $parent.consequenceChanged},  optionsCaption: 'Please select'" id="consequence"></select>
				                  </td>
				                  <td width="8%">
									<b> <span style="width:98%;" data-bind="text:riskRating"></span></b>  
				                  </td>
				                  <td width="20%">
				                   	<textarea style="width:98%;" data-validation-engine="validate[required]"  data-bind="value : currentControl" id="risks-threats-current-control" rows="5"></textarea>
				                   </td>
				                  <td width="10%">
				                   <!-- Residual risk -->
				                   <select style="width:98%;" data-validation-engine="validate[required]" data-bind="options: $parent.ratingOptions, value: residualRisk, optionsCaption: 'Please select'" ></select>
				                   </td>
				                 <td width="4%">
				                 	<span data-bind="if: $index()" id="remove-risk" ><i class="icon-remove" data-bind="click: $parent.removeRisk"></i></span>
				                 </td>  
				               </tr>
				       </tbody>
								<tfoot>
	             				<tr>
	             					<td colspan="0" style="text-align:left;">
	                     			<button type="button" class="btn btn-small" id="add-risks" data-bind="click: addRisks">
	                     			<i class="icon-plus"></i> Add a row</button></td>
	                     		</tr>
						</tfoot>			       
				       
				   </table>
	        </div>
		    </div>
	</div>
	
	
	<div id="summary-result-placeholder"></div>
	
	<div class="row-fluid" >
	   <div class="span6">
	       	<div class="well well-small" >
				<button type="button" id="project-details-save" data-bind="disable: disableSave, click: saveSummaryDetails" class="btn btn-primary">Save Changes</button>
				<button type="button" id="project-stage-preview" data-bind= "click: openStageReport" class="btn btn-info">Preview report</button>
				<button type="button" id="summary-cancel" class="btn">Cancel</button>
		   </div>
	   </div>
	    <div class="span6">
	       	<div class="well well-small" >
				<button style="float:left;" type="button" id="project-details-submit" data-bind="attr:{title:'Submit this stage for implementation approval. Report cannot be submitted while activities are still open.'}, enable: readyToSubmit,  click: submitStageReport" class="btn btn-success">Submit report</button>
				<br/><br/>		
				<b>In order to submit this report, please ensure that:</b>
				<ul>
					<li>All mandatory fields on this page are completed (indicated by a red *); and </li>
					<li>All forms for activities in this stage have been filled in and have a status of ‘Finished’, ‘Deferred’ or ‘Cancelled’ as appropriate.</li>
				</ul>
				Your report must also include one completed ‘Progress, Outcomes and Learning - stage report’ activity; and
				Project details should be checked and updated as required.
	       </div>
	   </div>
	   
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