<div class="meri-plan">
    <h4>Project Outcomes</h4>

    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header">
                    <th>Primary Outcome</th>
                    <th>Primary Investment Priority</th>
                </tr>
                <tr>
                    <td><select data-bind="options: projectThemes, optionsCaption: 'Please select', disable: isProjectDetailsLocked()"> </select></td>
                    <td><select></select></td>
                </tr>
                <tr class="header">
                    <th>Secondary Project Outcome</th>
                    <th>Secondary Investment Priority(ies)</th>
                </tr>
                <tr>
                    <td><select data-bind="options: projectThemes, optionsCaption: 'Please select', disable: isProjectDetailsLocked()"></select></td>
                    <td><select></select></td>
                </tr>
                <tr class="header">
                    <th colspan="2">Mid-term Project Outcome(s)</th>
                </tr>
                <tr>
                    <td colspan="2"><textarea></textarea></td>
                </tr>
                <tr class="header">
                    <th colspan="2">Short-term Project Outcome(s)</th>
                </tr>
                <tr>
                    <td colspan="2"><textarea></textarea></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header">
                    <th>Project rationale</th>
                </tr>
                <tr>
                    <td><textarea></textarea></td>
                </tr>
                <tr class="header">
                    <th>Project methodology</th>
                </tr>
                <tr>
                    <td><textarea></textarea></td>
                </tr>
                <tr class="header">
                    <th>Monitoring methodology</th>
                </tr>
                <tr>
                    <td><textarea></textarea></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <h4>Key evaluation question <fc:iconHelp
                    title="Key evaluation question">Please list the Key Evaluation Questions for your project. Evaluation questions should cover the effectiveness of the project and whether it delivered what was intended; the impact of the project; the efficiency of the delivery mechanism/s; and the appropriateness of the methodology. These need to be answerable within the resources and time available to the project.</fc:iconHelp></h4>
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th>Project Key evaluation question (KEQ)
                        <fc:iconHelp
                                title="Project Key evaluation question (KEQ)">List the projects KEQ’s. Add rows as necessary.</fc:iconHelp></th>
                    <th>How will KEQ be monitored
                        <fc:iconHelp
                                title="How will KEQ be monitored">Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.</fc:iconHelp></th>
                    <th></th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.keq.rows">
                <tr>
                    <td width="2%"><span data-bind="text:$index()+1"></span></td>
                    <td width="32%">
                        <textarea style="width: 97%;" rows="3" class="input-xlarge"
                                  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                        </textarea>
                    </td>
                    <td width="52%"><textarea style="width: 97%;" class="input-xlarge"
                                              data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                              rows="5"></textarea></td>
                    <td width="4%">
                        <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                               data-bind="click: $parent.removeKEQ"></i>
                        </span>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td colspan="0" style="text-align:left;">
                        <button type="button" class="btn btn-small"
                                data-bind="disable: isProjectDetailsLocked(), click: addKEQ">
                            <i class="icon-plus"></i> Add a row</button></td>
                </tr>
                </tfoot>
            </table>
        </div>

    </div>

</div>


<div class="row-fluid">
    <div class="span12">
        <h4>National and regional priorities</h4>

        <table class="table">
            <thead>
            <tr>
                <th>Document name <fc:iconHelp
                        title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
                <th>Relevant section <fc:iconHelp
                        title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
                <th>Explanation of strategic alignment <fc:iconHelp
                        title="Explanation of strategic alignment">In what way will the project deliver against this section? Keep the response brief, 1 to 2 sentences should be adequate.</fc:iconHelp></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.priorities.rows">
            <tr>
                <td width="2%"><span data-bind="text:$index()+1"></span></td>
                <td width="30%"><textarea style="width: 97%;" class="input-xlarge"
                                          data-bind="value: data1, disable: $parent.isProjectDetailsLocked()"
                                          rows="3"></textarea></td>
                <td width="32%"><textarea style="width: 97%;" class="input-xlarge"
                                          data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                          rows="5"></textarea></td>
                <td width="32%"><textarea style="width: 97%;" class="input-xlarge"
                                          data-bind="value: data3, disable: $parent.isProjectDetailsLocked()"
                                          rows="5"></textarea></td>
                <td width="4%">
                    <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                           data-bind="click: $parent.removeNationalAndRegionalPriorities"></i>
                    </span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                <td colspan="0" style="text-align:left;">
                    <button type="button" class="btn btn-small"
                            data-bind="disable: isProjectDetailsLocked(), click: addNationalAndRegionalPriorities">
                        <i class="icon-plus"></i> Add a row</button></td>
            </tr>
            </tfoot>
        </table>
    </div>
</div>


<div class="row-fluid">
    <div class="span12">
        <g:render template="budgetTable"/>
    </div>
</div>

<div class="validationEngineContainer" id="risk-validation">
    <g:render template="riskTable" model="[project:project]"/>
</div>
