<div data-bind="let:{details:meriPlan()}">
<div class="row-fluid space-after">
    <div>
        <div class="well well-small">
            <label><b>Project Outcomes</b></label>
            <table style="width: 100%;">
                <thead>
                <tr>
                    <th></th>
                    <th>Outcomes <fc:iconHelp title="Outcomes">Enter the outcomes sought by the project. This should be expressed as a 'SMART' statement (Specific Measurable Attainable Realistic and Time-bound) and deliver against the programme.  The outcome should be no more than 2 sentences.</fc:iconHelp></th>
                    <th>
                        Asset(s) addressed <fc:iconHelp title="Asset(s) addressed">Select the most appropriate natural/cultural asset or assets being addressed by this project from the drop down list. Note that multiple selections can be made. </fc:iconHelp>
                    </br> (Hold down the Ctrl key and click to select multiple values.)
                    </th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.objectives.rows1">
                <tr>
                    <td width="2%"> <span data-bind="text:$index()+1"></span></td>
                    <td width="54%"><textarea style="width: 99%;" data-bind="value: description, disable: $parent.isProjectDetailsLocked()" rows="5" ></textarea></td>
                    <td width="40%"><select style="width: 99%;float:right;" class="input-xlarge"
                                            data-bind="options: $parent.protectedNaturalAssests, selectedOptions: assets, disable: $parent.isProjectDetailsLocked()" size="5" multiple="true"></select></td>
                    <td width="4%">
                        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove" data-bind="click: $parent.removeObjectivesOutcome"></i></span>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td colspan="0" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="disable:isProjectDetailsLocked(), click: addOutcome">
                            <i class="icon-plus"></i> Add a row</button>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <br/>
            <g:render template="meriPlan/monitoringIndicators"/>
        </div>
    </div>
</div>


<div class="row-fluid space-after">
    <div>
        <div id="national-priorities" class="well well-small">
            <label><b>National and regional priorities</b></label>
            <p>Explain how the project aligns with all applicable national and regional priorities, plans and strategies.</p>
            <table style="width: 100%;">
                <thead>
                <tr>
                    <th></th>
                    <th>Document name <fc:iconHelp title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
                    <th>Relevant section <fc:iconHelp title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
                    <th>Explanation of strategic alignment <fc:iconHelp title="Explanation of strategic alignment">In what way will the project deliver against this section? Keep the response brief, 1 to 2 sentences should be adequate.</fc:iconHelp></th>
                    <th></th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.priorities.rows">
                <tr>
                    <td width="2%"> <span data-bind="text:$index()+1"></span></td>
                    <td width="30%"> <textarea style="width: 97%;" class="input-xlarge"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3"> </textarea></td>
                    <td width="32%"> <textarea style="width: 97%;" class="input-xlarge" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
                    <td width="32%"> <textarea style="width: 97%;" class="input-xlarge" data-bind="value: data3, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
                    <td width="4%">
                        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove" data-bind="click: $parent.removeNationalAndRegionalPriorities"></i></span>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td colspan="0" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="disable: isProjectDetailsLocked(), click: addNationalAndRegionalPriorities">
                            <i class="icon-plus"></i> Add a row</button></td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>


<div class="row-fluid space-after">
    <g:render template="meriPlan/projectImplementation"/>
</div>

<div class="row-fluid space-after">
    <g:render template="meriPlan/projectPartnerships"/>
</div>

<div class="row-fluid space-after">
    <g:render template="meriPlan/keq"/>
</div>


<div class="row-fluid space-after">
    <div id="announcements">

        <g:render template="announcementsTable" model="${[disableConditionPrefix:'']}"/>

    </div>
</div>

<!-- Budget table -->
<div class="row-fluid space-after">
   <g:render template="meriPlan/meriBudget"/>
</div>

<div class="row-fluid space-after">
    <div class="well well-small">
        <label><b>Workplace Health and Safety</b></label>
        <div>1. Are you aware of, and compliant with, your workplace health and safety legislation and obligations.
            <select style="width: 10%;" data-bind="options: obligationOptions, optionsCaption: 'Please select', value:details.obligations, disable: isProjectDetailsLocked()"> </select>
        </div>
        <div>
            2. Do you have appropriate policies and procedures in place that are commensurate with your project activities?
            <select style="width: 10%;" data-bind="options: obligationOptions, optionsCaption: 'Please select', value:details.policies, disable: isProjectDetailsLocked()"> </select>
        </div>
    </div>
</div>
</div>