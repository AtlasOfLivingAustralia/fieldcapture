<label><h4>Project risks & threats <span style="color: red;"><b>*</b></span></h4></label>
<g:render template="/shared/restoredData"
          model="[id: 'restoredRiskData', saveButton: 'Save risks & threats', cancelButton: 'Cancel edits to risks & threats']"/>
<p>Please enter the details of risks and threats to the project and the mitigation strategies being used to address them. These should be updated at each reporting period:</p>

<div class="row-fluid space-after">
    <div class="required">
        <g:render template="/project/meriPlan/risksAndThreats"/>
    </div>
    <br/>
    <button type="button" data-bind="click: saveRisks" class="btn btn-primary">Save risks & threats</button>
    <button type="button" id="risks-cancel" class="btn">Cancel edits to risks & threats</button>
</div>
