<div class="meri-plan" data-bind="let:{details:meriPlan()}">
<div class="row-fluid space-after">
    <div>
        <div class="well well-small">
            <label><b>Project Outcomes</b></label>
            <table class="table">
                <thead>
                <tr>
                    <th class="index"></th>
                    <th>Outcomes <fc:iconHelp title="Outcomes">Enter the outcomes sought by the project. This should be expressed as a 'SMART' statement (Specific Measurable Attainable Realistic and Time-bound) and deliver against the programme.  The outcome should be no more than 2 sentences.</fc:iconHelp></th>
                    <th>
                        Asset(s) addressed <fc:iconHelp title="Asset(s) addressed">Select the most appropriate natural/cultural asset or assets being addressed by this project from the drop down list. Note that multiple selections can be made. </fc:iconHelp>
                    </br> (Hold down the Ctrl key and click to select multiple values.)
                    </th>
                    <th class="remove"/>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.objectives.rows1">
                <tr>
                    <td class="index"> <span data-bind="text:$index()+1"></span></td>
                    <td class="original-outcomes"><textarea data-bind="value: description, disable: $parent.isProjectDetailsLocked()" rows="5" ></textarea></td>
                    <td class="original-assets"><select class="input-xlarge"
                                            data-bind="options: $parent.protectedNaturalAssests, selectedOptions: assets, disable: $parent.isProjectDetailsLocked()" size="5" multiple="true"></select></td>
                    <td class="remove">
                        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove" data-bind="click: $parent.removeObjectivesOutcome"></i></span>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="4">
                        <button type="button" class="btn btn-small" data-bind="disable:isProjectDetailsLocked(), click: addOutcome">
                            <i class="fa fa-plus"></i> Add a row</button>
                    </td>

                </tr>
                </tfoot>
            </table>
            <br/>
            <g:render template="/project/meriPlan/monitoringIndicators"
                      model="${[indicatorHeading:"Monitoring indicator",
                                indicatorHelpText:"List the indicators of project success that will be monitored. Add a new row for each indicator, e.g. ground cover condition, increased abundance of a particular species, increased engagement of community in delivery of on-ground works.",
                                approachHeading:"Monitoring approach",
                                approachHelpText:"How will this indicator be monitored? Briefly describe the method to be used to monitor the indicator."
                      ]}"/>
        </div>
    </div>
</div>


<div class="row-fluid space-after">
    <g:render template="/project/meriPlan/nationalAndRegionalPlans"/>
</div>


<div class="row-fluid space-after">
    <g:render template="/project/meriPlan/projectImplementation"/>
</div>

<div class="row-fluid space-after">
    <g:render template="/project/meriPlan/projectPartnerships"/>
</div>

<div class="row-fluid space-after">
    <g:render template="/project/meriPlan/keq"/>
</div>


<div class="row-fluid space-after">
    <div id="announcements">

        <g:render template="/project/announcementsTable" model="${[disableConditionPrefix:'']}"/>

    </div>
</div>

<!-- Budget table -->
<div class="row-fluid space-after">
   <g:render template="/project/meriPlan/meriBudget"/>
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