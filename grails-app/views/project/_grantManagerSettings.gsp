<div class="modal hide fade" id="variation">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title"><strong>Grant Manager Actions:</strong></div>
            </div>
            <div class="modal-body">
                <label><h5>Project Variation:</h5></label>
				<p>Please enter the following information to change the project end date</p>
				<div class="row-fluid space-after">
				    <div class="required">
				        <label for="endDate ">Planned end date
				        <fc:iconHelp title="End date">Date the project is intended to finish.</fc:iconHelp>
				        </label>
				        <div class="input-append">
				            <fc:datePicker targetField="plannedEndDate.date" name="endDate" data-validation-engine="validate[future[now],required]" printable="${printView}" size="input-large"/>
				        </div>
				    </div>
				    
					<div class="required">
				        <label for="reason">Reason for variation
				        <fc:iconHelp title="reason">Reason for variation</fc:iconHelp>
				        </label>
				        <div class="input-append">
				            <textarea data-validation-engine="validate[required]" data-bind="value:transients.variation" class="input-xlarge" id="variation" rows="3" ></textarea>
				        </div>
				    </div>
				    <div>
					    <div id="save-settings-result-placeholder"></div>
			   			<button type="button" data-bind="click: saveGrantManagerSettings" class="btn btn-primary">Save changes</button>
			   			<button class="btn" data-dismiss="modal">Cancel</button>
					</div>
				</div>
            </div>
        </div>
    </div>
</div>
