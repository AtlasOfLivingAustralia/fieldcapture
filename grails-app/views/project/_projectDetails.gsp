<!-- Rely on monitoringApproach  -->
<div data-bind="ifnot: showStageMilestones">
<h4>Project details not available.</h4>
</div>
<div data-bind="if:showStageMilestones">
	<div data-bind="visible: details['monitoringApproach'].description">
		<h3>General Project Information</h3>
		<div class="row-fluid space-after">
			    <div class="span6">
			        <div id="project-objectives" class="well well-small">
			 			<label><b>Project objectives / goals / assets:</b></label> 	 
					        <span data-bind="foreach : details['objectives']['rows']">
			                    <b><span data-bind="text: shortLabel"> </span></b>
			                    <label style="margin-left: 15px" data-bind="text: description"></label>
					        </span>
			        </div>
			    </div>
			    
			     <div class="span6">
			        <div id="national-priorities" class="well well-small">
			 			<label><b>National and regional priorities:</b></label>
					        <span data-bind="foreach : details['nationalAndRegionalPriorities']['rows']">
			                    <b><span data-bind="text: shortLabel"> </span></b>
			                   <label style="margin-left: 15px" data-bind="text: description"></label>
							</span>			                    
			        </div>
			    </div>
		</div>
		
		<div class="row-fluid space-after">
				    <div class="span6">
				        <div id="project-implementation" class="well well-small">
				 			<label><b>Project implementation / delivery mechanism</b></label> 
							<label style="margin-left: 15px" data-bind="text:details['projectImplementation'].description" ></label>
				        </div>
				    </div>
				    
				<div class="span6" data-bind="visible:details['projectPartnership'].description">
			        <div id="project-partnership" class="well well-small">
			 			<label><b>Project partnership:</b></label> 
						<label style="margin-left: 15px" data-bind="text:details['projectPartnership'].description" ></label>
			        </div>
		        </div>
		</div>
		
		<div class="row-fluid space-after">
			    <div class="span6">
			        <div id="monitor-approach" class="well well-small">
			 			<label><b>Monitoring approach</b></label>
			 			<label style="margin-left: 15px" data-bind="text:details['monitoringApproach'].description" ></label> 	 
			        </div>
			    </div>
				
			    <div class="span6" data-bind="visible:details['dataSharingProtocols'].description">
			        <div id="data-sharing" class="well well-small">
			 			<label><b>Data sharing protocols</b></label>
						<label style="margin-left: 15px" data-bind="text:details['dataSharingProtocols'].description" ></label>	 			
			        </div>
			    </div>
		</div>
		
		<div class="row-fluid space-after">
			<div class="required">
			        <div id="project-risks-threats" class="well well-small">
					<label><b>Project risks & threats</b></label> 
					<div align="right">
				  		<b> Overall project risk profile : <span data-bind="text: details['risks']['overallRisk'], css: overAllRiskHighlight" ></span></b>
					</div>
					<table>
				    <thead>
			          <tr>
			            <th>Type of threat / risk</th>
			            <th>Description</th>
						<th>Likelihood</th>			                
						<th>Consequence</th>							
						<th>Risk rating</th>
						<th>Current control / Contingency strategy</th>														
						<th>Residual risk</th>	
			          </tr>
				    </thead>
					<tbody data-bind="foreach : details['risks']['rows']" >
					             <tr>
					                 <td>
					                 	<label data-bind="text: threat" ></label>
					                 </td>
					                 <td>
					                 	<label data-bind="text: description" ></label>
					                 </td>
					                 <td>
					                 	<label data-bind="text: likelihood" ></label>
					                 </td>
					                 <td>
					                 	<label data-bind="text: consequence" ></label>
					                 </td>
					                 <td>
					                 <label data-bind="text: riskRating" ></label> 
					                 </td>
					                 <td>
					                 	<label data-bind="text: currentControl" ></label>
					                  </td>
					                 <td>
					                 	<label data-bind="text: residualRisk" ></label>
					                  </td>
					              </tr>
					      </tbody>
					  </table>
		        </div>
			    </div>
		</div>
	</div>
	<div class="output-block"></div>
	<h3>Progress update for :</h3>
	 <div data-bind="foreach : customStages" >
		<div data-bind="visible: objectives">	    
			<h4><span data-bind="text: name"> </span></h4>
			<div class="row-fluid space-after">
			    <div class="span6">
			        <div class="well well-small" data-bind="visible: objectives" >
			 			<label><b>Project objectives / goals / assets:</b></label>
			 			<span data-bind="foreach: objectives">
			 				<b><span data-bind="text:shortLabel" >:</span></b>
			 				<label style="margin-left: 15px" data-bind="text:$data[$parent.name]" ></label>	
					   </span>
			        </div>
			    </div>
			    <div class="span6">
			        <div class="well well-small" data-bind="visible: milestones">
			 			<label><b>Progress against milestones:</b></label>
			 			<span data-bind="foreach: milestones">
			 				<b><span data-bind="text:shortLabel" ></span> </b> - <span data-bind="text: dueDate ? dueDate.substring(0,10) : dueDate" ></span>
			 				<label style="margin-left: 15px" data-bind="text:$data[$parent.name]" ></label>
					   </span>
			        </div>
			    </div>
			    
			</div>	
		</div>
	</div>
</div>