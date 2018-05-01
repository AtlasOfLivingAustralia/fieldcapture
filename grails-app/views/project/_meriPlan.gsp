<div class="meri-plan">
    <h4>Project Outcomes</h4>

    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome-priority required">Primary Outcome</th>
            <th class="primary-outcome priority required">Primary Investment Priority</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="index">1</td>
            <td class="outcome-priority"><select
                    data-validation-engine="validate[required]" data-bind="value:details.outcomes.primaryOutcome.description, options: projectThemes, optionsCaption: 'Please select', disable: isProjectDetailsLocked()" ></select>
            </td>
            <td colspan="2" class="priority">
                <input type="text" data-validation-engine="validate[required]" data-bind="value:details.outcomes.primaryOutcome.asset, disable: $root.isProjectDetailsLocked()" class="input-large asset">
            </td>
        </tr>

        </tbody>
    </table>
    <table class="table secondary-outcome">

        <thead>

        <tr class="header">
            <th class="index"></th>
            <th class="outcome-priority">Secondary Project Outcome</th>
            <th class="priority">Secondary Investment Priority(ies)</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome-priority"><select
                    data-bind="value:description, options: $root.projectThemes, optionsCaption: 'Please select', disable: $root.isProjectDetailsLocked()"></select>
            </td>
            <td class="priority">
                <multi-input params="values:assets">
                    <input type="text" data-bind="value:val, disable: $root.isProjectDetailsLocked()" class="input-large asset">
                </multi-input>
            </td>
            <td class="remove">
                <span data-bind="if:!$parent.isProjectDetailsLocked()">
                    <i class="fa fa-remove" data-bind="click: $parent.removeSecondaryOutcome"></i>
                </span>
            </td>
        </tr>

        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button type="button" class="btn btn-small"
                        data-bind="disable: isProjectDetailsLocked(), click: addSecondaryOutcome">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome">Mid-term Project Outcome(s)</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.midTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome"><textarea data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea></td>
            <td class="remove">
                <span data-bind="if: !$parent.isProjectDetailsLocked()">
                    <i class="fa fa-remove" data-bind="click: $parent.removeMidTermOutcome"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3">
                <button type="button" class="btn btn-small"
                        data-bind="disable: isProjectDetailsLocked(), click: addMidTermOutcome">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome required">Short-term Project Outcome(s)</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome">
                <textarea data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
            </td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                       data-bind="click: $parent.removeShortTermOutcome"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3">
                <button type="button" class="btn btn-small"
                        data-bind="disable: isProjectDetailsLocked(), click: addShortTermOutcome">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>


    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header required">
                    <th>Project rationale</th>
                </tr>
                <tr>
                    <td><textarea data-validation-engine="validate[required]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <tr class="header required">
                    <th>Project methodology</th>
                </tr>
                <tr>
                    <td><textarea  data-validation-engine="validate[required]" data-bind="value:details.projectMethodology, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <tr class="header required">
                    <th>Monitoring methodology</th>
                </tr>
                <tr>
                    <td><textarea data-validation-engine="validate[required]" data-bind="value:details.monitoringMethodology, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>


    <h4>Key evaluation question <fc:iconHelp
            title="Key evaluation question">Please list the Key Evaluation Questions for your project. Evaluation questions should cover the effectiveness of the project and whether it delivered what was intended; the impact of the project; the efficiency of the delivery mechanism/s; and the appropriateness of the methodology. These need to be answerable within the resources and time available to the project.</fc:iconHelp></h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="keq">Project Key evaluation question (KEQ)
                <fc:iconHelp
                        title="Project Key evaluation question (KEQ)">List the projects KEQ’s. Add rows as necessary.</fc:iconHelp></th>
            <th class="keq-monitoring">How will KEQ be monitored
                <fc:iconHelp
                        title="How will KEQ be monitored">Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="keq">
                <textarea rows="3"
                          data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="keq-monitoring"><textarea
                    data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                    rows="5"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                       data-bind="click: $parent.removeKEQ"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button type="button" class="btn btn-small"
                        data-bind="disable: isProjectDetailsLocked(), click: addKEQ">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>




    <h4>National and regional priorities</h4>

    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="document-name">Document name <fc:iconHelp
                    title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
            <th class="section">Relevant section <fc:iconHelp
                    title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
            <th class="alignment">Explanation of strategic alignment <fc:iconHelp
                    title="Explanation of strategic alignment">In what way will the project deliver against this section? Keep the response brief, 1 to 2 sentences should be adequate.</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.priorities.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="document-name"><textarea style="width: 97%;" class="input-xlarge"
                                                data-bind="value: data1, disable: $parent.isProjectDetailsLocked()"
                                                rows="3"></textarea></td>
            <td class="section"><textarea style="width: 97%;" class="input-xlarge"
                                          data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                          rows="5"></textarea></td>
            <td class="alignment"><textarea style="width: 97%;" class="input-xlarge"
                                            data-bind="value: data3, disable: $parent.isProjectDetailsLocked()"
                                            rows="5"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                       data-bind="click: $parent.removeNationalAndRegionalPriorities"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>

            <td colspan="5">
                <button type="button" class="btn btn-small"
                        data-bind="disable: isProjectDetailsLocked(), click: addNationalAndRegionalPriorities">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <div class="row-fluid">
        <div class="span12">
            <g:render template="serviceBudgetTable"/>
        </div>
    </div>

    <h4>Project risks & threats <span style="color: red;"><b>*</b></span></h4>
    <g:render template="risksAndThreats"/>
</div>