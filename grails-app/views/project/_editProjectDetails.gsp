<div class="row-fluid">
    <div class="control-group">
        <label for="name" class="control-label"></label>
        <div class="controls">
           <b>From: <span data-bind="text: plannedStartDate.formattedDate"></span> To: <span data-bind="text: plannedEndDate.formattedDate"></span></b>
        </div>
		<div align="right" data-bind="visible: planStatus() == 'approved'">
        	<span class="badge badge-success" style="font-size: 13px;">This plan has been approved</span>
        </div>
        <div align="right" data-bind="visible: planStatus() != 'approved' ">
        	<span class="badge badge-warning" style="font-size: 13px;">This plan is not yet approved</span>
        </div>
        
    </div>
</div>
<!-- todo: move this to css file -->
<style type="text/css">
        table.tableProjectDetails {display: inline;}
        table.tableProjectDetails th {white-space:normal;}
        table.tableProjectDetails td:nth-child(1) {width:30%;}
        table.tableProjectDetails td:nth-child(2) {width:68%;}
        table.tableProjectDetails td:last-child {width:2%;text-align:center;}
        table.tableProjectDetails textarea {width:100%; box-sizing:border-box; }
		table.tableProjectDetails input {width:100%; box-sizing:border-box; }
		table.tableProjectDetails label.required {content: "*";
										    font-weight:bold;
										    font-size:1.0em;
										    color: red;
										    position:absolute;
										    white-space: nowrap;
										    display: inline;}
        table.tableProjectDetailsCol4 {display: inline;}
        table.tableProjectDetailsCol4 th {white-space:normal;}
        table.tableProjectDetailsCol4 td:nth-child(1) {width:20%;}
        table.tableProjectDetailsCol4 td:nth-child(2) {width:50%;}
		table.tableProjectDetailsCol4 td:nth-child(3) {width:25%;}        
        table.tableProjectDetailsCol4 td:last-child {width:5%;text-align:center;}
        table.tableProjectDetailsCol4 textarea {width:100%; box-sizing:border-box; }
		table.tableProjectDetailsCol4 datePicker {width:100%; box-sizing:border-box; }
		table.tableProjectDetailsCol4 label.required {content: "*";
										    font-weight:bold;
										    font-size:1.0em;
										    color: red;
										    position:absolute;
										    white-space: nowrap;
										    display: inline;}
 		table.tableProjectDetailsCol8 {display: inline;}
        table.tableProjectDetailsCol8 th {white-space:normal;}
        table.tableProjectDetailsCol8 td:nth-child(1) {width:15%;}
        table.tableProjectDetailsCol8 td:nth-child(2) {width:20%;}
		table.tableProjectDetailsCol8 td:nth-child(3) {width:15%;}
		table.tableProjectDetailsCol8 td:nth-child(4) {width:15%;}
		table.tableProjectDetailsCol8 td:nth-child(5) {width:5%;}
		table.tableProjectDetailsCol8 td:nth-child(6) {width:18%;}			        
		table.tableProjectDetailsCol8 td:nth-child(7) {width:10%;}		
        table.tableProjectDetailsCol8 td:last-child {width:2%;text-align:center;}
        table.tableProjectDetailsCol8 textarea {width:100%; box-sizing:border-box; }
		table.tableProjectDetailsCol8 input {width:100%; box-sizing:border-box; }
		table.tableProjectDetailsCol8 select{width:100%; box-sizing:border-box;}		
		
		table.tableProjectDetailsCol8 label.required {content: "*";
										    font-weight:bold;
										    font-size:1.0em;
										    color: red;
										    position:absolute;
										    white-space: nowrap;
										    display: inline;}										    
</style>

<div class="row-fluid space-after">
	    <div class="required">
	        <div id="project-objectives" class="well well-small">
	 			<label><b>Project objectives / goals / assets</b></label> 	 
		        <p>Please enter the details of the goals and assets of the project:</p>	        
			    <table class="tableProjectDetails">
			        <thead>
			            <tr>
			                <th>Short label<label class="required"></label></th>
			                <th>Description</th>
			                <th></th>
			            </tr>
			        </thead>
			        <tbody data-bind="foreach : details['objectives']['rows']">
			                <tr>
			                    <td> <input type="text"  class="input-xlarge"  data-bind="value: shortLabel" data-validation-engine="validate[required]"> </td>
			                    <td> <textarea class="input-xlarge" data-bind="value: description" rows="3" cols="50"></textarea> </td>
			                    <td>
                        			<span data-bind="if: $index()" id="remove-objectives" ><i class="icon-remove" data-bind="click: $parent.removeObjectives"></i></span>
			                    </td>
			                </tr>
			        </tbody>
	                <tfoot>
          				<tr>
          					<td colspan="0" style="text-align:left;">
                  			<button type="button" class="btn btn-small" id="add-objectives" data-bind="click: addObjectives">
                  			<i class="icon-plus"></i> Add a row</button>
                  			</td>
                  		</tr>
  					</tfoot>
			    </table>
	        </div>
	    </div>
</div>

<div class="row-fluid space-after">
	    <div class="required">
	        <div id="project-milestones" class="well well-small">
	 			<label><b>Milestones</b></label> 	 
		        <p>Please enter the details of progress of the project against scheduled milestones during this reporting period:</p>	        
			    <table class="tableProjectDetailsCol4">
			        <thead>
			            <tr>
			                <th>Short label<label class="required"></label></th>
			                <th>Description</th>
							<th>Due date <label class="required"></label></th>	
							<th></th>			                
			            </tr>
			        </thead>
			        <tbody data-bind="foreach : details['milestones']['rows']">
			                <tr>
			                    <td><input type="text" class="input-xlarge" id="short-label-milestones" data-bind="value: shortLabel" data-validation-engine="validate[required]"></td>
			                    <td><textarea class="input-xlarge" data-bind="value: description"  id="partnership" rows="3" cols="50"></textarea></td>
			                    <td>
			                    	<div class="input-append">
			                    		<fc:datePicker targetField="dueDate.date" name="dueDate" data-validation-engine="validate[required]" printable="${printView}" size="input-large"/>
			                    	</div>
			                    </td>	
			                    <td>
                        			<span data-bind="if: $index()" id="remove-milestones" ><i class="icon-remove" data-bind="click: $parent.removeMilestones"></i></span>
			                    </td>		                    
			                </tr>
					</tbody>
 					<tfoot>
             				<tr>
             					<td colspan="0" style="text-align:left;">
                     			<button type="button" class="btn btn-small" id="add-milestones" data-bind="click: addMilestones">
                     			<i class="icon-plus"></i> Add a row</button></td>
                     		</tr>
					</tfoot>
								        
			    </table>
	        </div>
	    </div>
</div>


<div class="row-fluid space-after">
	<div class="required">
	        <div id="national-priorities" class="well well-small">
	 			<label><b>National and regional priorities</b></label> 	 
		        <p>Explain how the project aligns with all applicable national and regional priorities, plans and strategies.</p>	        
			    <table class="tableProjectDetailsCol4">
			        <thead>
			            <tr>
			                <th>Short label<label class="required"></label></th>
			                <th>Description</th>
							<th>Due date <label class="required"></label></th>	
							<th></th>			                
			            </tr>
			        </thead>
			        <tbody data-bind="foreach : details['nationalAndRegionalPriorities']['rows']">
			                <tr>
			                    <td><input type="text" class="input-xlarge" id="short-label-national" data-bind="value: shortLabel" data-validation-engine="validate[required]"></td>
			                    <td><textarea class="input-xlarge" data-bind="value: description"  id="national" rows="3" cols="50"></textarea></td>
			                    <td>
			                    	<div class="input-append">
			                    		<fc:datePicker targetField="dueDate.date" name="nationalDueDate" data-validation-engine="validate[required]" printable="${printView}" size="input-large"/>
			                    	</div>
			                    </td>	
			                    <td>
                        			<span data-bind="if: $index()" id="remove-national" ><i class="icon-remove" data-bind="click: $parent.removeNationalAndRegionalPriorities"></i></span>
			                    </td>		                    
			                </tr>
					 </tbody>
			       
 					<tfoot>
             				<tr>
             					<td colspan="0" style="text-align:left;">
                     			<button type="button" class="btn btn-small" id="add-national" data-bind="click: addNationalAndRegionalPriorities">
                     			<i class="icon-plus"></i> Add a row</button></td>
                     		</tr>
					</tfoot>
					 			        
			    </table>
	        </div>
	    </div>
</div>

<div class="row-fluid space-after">
	    <div class="span6 required">
	        <div id="monitor-approach" class="well well-small">
	 			<label><b>Monitoring approach</b></label> 	 
		        <p>Explain the approach that will be used to monitor the implementation progress and outcomes of the project, including methods, resources, timing, etc</p>	        
				<textarea style="width: auto;" data-bind="value: details['monitoringApproach'].description" class="input-xlarge" id="monitoring-approach" rows="3" cols="50" 
					data-validation-engine="validate[required]"></textarea>
	        </div>
	    </div>
		
	    <div class="span6">
	        <div id="data-sharing" class="well well-small">
	 			<label><b>Data sharing protocols</b></label>
	 			<p>Explain how the project will ensure that data being collected complies with state and commonwealth data standards / requirements / protocols and how it will shared.</p>	        
				<textarea style="width: auto;" data-bind="value:details['dataSharingProtocols'].description" class="input-xlarge" id="data-sharing-protocols" rows="3" cols="50" ></textarea>
	        </div>
	    </div>
</div>

<div class="row-fluid space-after">
		    <div class="span6 required">
		        <div id="project-implementation" class="well well-small">
		 			<label><b>Project implementation / delivery mechanism</b></label> 
		 			<p>Explain how the project will be implemented, including methods, approaches, collaborations, etc.</p>	        
					<textarea style="width: auto;" data-bind="value:details['projectImplementation'].description" class="input-xlarge" id="implementation" rows="3" cols="50" data-validation-engine="validate[required]"></textarea>
		        </div>
		    </div>
		    
		    <div class="span6">
	        <div id="project-partnership" class="well well-small">
	 			<label><b>Project partnership</b></label> 
	 			<p>Provide details on all project partners and the nature and scope of their participation in the project.</p>	        
				<textarea style="width: auto;" data-bind="value:details['projectPartnership'].description" class="input-xlarge" id="partnership" rows="3" cols="50"></textarea>
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
			  <table class="tableProjectDetailsCol8" >
			      <thead>
			          <tr>
			            <th>Type of threat / risk<label class="required"></label></th>
			            <th>Description<label class="required"></label></th>
						<th>Likelihood<label class="required"></label></th>			                
						<th>Consequence<label class="required"></label></th>							
						<th>Risk rating</th>
						<th>Current control / Contingency strategy<label class="required"></label></th>														
						<th>Residual risk<label class="required"></label></th>	
						<th></th>												
			          </tr>
			      </thead>
			      <tbody data-bind="foreach : details['risks']['rows']" >
			              <tr>
			                  <td>
			                  	<select data-validation-engine="validate[required]" data-bind="options: $parent.threatOptions, value: threat, optionsCaption: 'Please select'" id="type-of-threat"></select>
			                  </td>
			                  <td>
			                  	<textarea data-validation-engine="validate[required]" class="input-xlarge" data-bind="value: description"  id="risks-threats-description" rows="5" cols="50"></textarea>
			                  	
			                  </td>
			                  <td>
			                  	<select data-validation-engine="validate[required]" data-bind="options: $parent.likelihoodOptions, value: likelihood, event:{ change: $parent.likelihoodChanged}, optionsCaption: 'Please select'" id="likelihood"></select>
			                  </td>
			                  <td>
								<select data-validation-engine="validate[required]" data-bind="options: $parent.consequenceOptions, value: consequence, event:{ change: $parent.consequenceChanged},  optionsCaption: 'Please select'" id="consequence"></select>
			                  </td>
			                  <td>
								<!-- <select data-validation-engine="validate[required]" data-bind="options: riskRatingOptions, value: riskRating, optionsCaption: 'Please select'" id="riskRating"></select> -->
								<!-- <b> <span data-bind="text:riskRating, style: {color: riskRating == 'High' ? '#b94a48' : riskRating == 'Low' ? '#468847' : riskRating == 'Medium' ? '#3a87ad' : '#c67605'} "></span></b> -->
								<!-- <b> <span data-bind="text:$parent.computeRiskRating"></span></b>  -->
								<b> <span data-bind="text:riskRating"></span></b>  
			                  </td>
			                  <td>
			                   	<textarea data-validation-engine="validate[required]"  data-bind="value : currentControl" id="risks-threats-current-control" rows="5" cols="50"></textarea>
			                   </td>
			                  <td>
			                   <!-- Residual risk -->
			                   <select data-validation-engine="validate[required]" data-bind="options: $parent.ratingOptions, value: residualRisk, optionsCaption: 'Please select'" ></select>
			                   </td>
			                 <td>
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

<div id="save-details-result-placeholder"></div>
<div class="row-fluid">
	<div class="form-actions">
            <button type="button" data-bind="click: saveProjectDetails" id="project-details-save" class="btn btn-primary">Save changes</button>
            <button type="button" id="details-cancel" class="btn">Cancel</button>
	</div>	
</div>
