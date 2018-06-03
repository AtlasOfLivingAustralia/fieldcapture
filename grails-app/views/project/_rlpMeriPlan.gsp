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
            <td class="outcome-priority">
                <select data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectableOutcomes, value:details.outcomes.primaryOutcome.description, optionsCaption: 'Please select', disable: isProjectDetailsLocked()" >
                </select>
            </td>
            <td colspan="2" class="priority">
                <select style="width:100%" class="asset" data-validation-engine="validate[required]" data-bind="options:details.outcomes.outcomePriorities(details.outcomes.primaryOutcome.description()), optionsCaption: 'Please select', value:details.outcomes.primaryOutcome.asset, disable: isProjectDetailsLocked()" >
                </select>
            </td>
        </tr>

        </tbody>
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

    <h4>Additional project benefits</h4>
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
            <td class="outcome-priority"><select data-validation-engine="validate[required]"
                    data-bind="value:description, options: $parent.details.outcomes.selectableOutcomes, optionsCaption: 'Please select', disable: $root.isProjectDetailsLocked()"></select>
            </td>
            <td class="priority">
                <select data-bind="value:asset, options:$root.details.outcomes.outcomePriorities(description()), optionsCaption: 'Please select', disable: $root.isProjectDetailsLocked()" class="input-large asset"></select>
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
                        data-bind="disable: details.outcomes.secondaryOutcomes().length >= 3 || isProjectDetailsLocked(), click: addSecondaryOutcome">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <h4>Project details</h4>
    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>

                <tr class="header required">
                    <th class="required">Project description</th>
                </tr>
                <tr>
                    <td><textarea rows="5"  data-validation-engine="validate[required,maxSize[450]]" data-bind="value:details.description, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <tr class="header required">
                    <th class="required">Project methodology <fc:iconHelp>Describe the project methodology and how this aligns with the services being delivered through this project.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5" data-validation-engine="validate[required,maxSize[4000]]" data-bind="value:details.implementation.description, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <!-- ko if:false -->
                <tr class="header">
                    <th class="required">Project rationale <fc:iconHelp>TBA</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5" data-validation-engine="validate[required,maxSize[4000]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <!-- /ko -->
                </tbody>
            </table>
        </div>
    </div>
    <!-- ko with:details.threats -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="threat required">Key threat(s) or key threatening processes <fc:iconHelp>Describe the key threats (or key threatening processes) to the primary investment priority</fc:iconHelp></th>
        <th class="intervention required">Interventions to address threats <fc:iconHelp>Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome.</fc:iconHelp></th>
        <th class="remove"></th>
        </thead>
        <tbody data-bind="foreach: rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="threat">
                <textarea rows="4" data-validation-engine="validate[required]"
                          data-bind="value: threat, disable: $root.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="intervention"><textarea data-validation-engine="validate[required]"
                                                 data-bind="value: intervention, disable: $root.isProjectDetailsLocked()"
                                                 rows="4"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                     data-bind="click: $parent.removeRow"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button type="button" class="btn btn-small"
                        data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <!-- /ko -->

    <h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, mid-term and 5 year program outcome), and the monitoring design.</fc:iconHelp>
    <!-- ko with:details.baseline -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="baseline required">Project baseline</th>
        <th class="baseline required">Describe the method used to obtain the baseline</th>
        <th class="remove"></th>
        </thead>
        <tbody data-bind="foreach: rows">
            <tr>
                <td class="index"><span data-bind="text:$index()+1"></span></td>
                <td class="baseline">
                    <textarea rows="4" data-validation-engine="validate[required]"
                              data-bind="value: baseline, disable: $root.isProjectDetailsLocked()">
                    </textarea>
                </td>
                <td class="baseline"><textarea data-validation-engine="validate[required]"
                        data-bind="value: method, disable: $root.isProjectDetailsLocked()"
                        rows="4"></textarea></td>
                <td class="remove">
                    <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                           data-bind="click: $parent.removeRow"></i>
                    </span>
                </td>
            </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button type="button" class="btn btn-small"
                        data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <!-- /ko -->

    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline required">Project monitoring indicators</th>
            <th class="baseline required">Project monitoring indicator approach</th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <textarea rows="4" data-validation-engine="validate[required]"
                          data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="baseline"><textarea data-validation-engine="validate[required]"
                    data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                    rows="4"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() > 1 && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
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

    <h4>Relevant national and regional plans</h4>

    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="document-name required">Document name <fc:iconHelp
                    title="Document name">List the name of the National or Regional plan the project is addressing.</fc:iconHelp></th>
            <th class="section required">Relevant section <fc:iconHelp
                    title="Relevant section">What section (target/outcomes/objective etc) of the plan is being addressed?</fc:iconHelp></th>
            <th class="alignment required">Explanation of strategic alignment <fc:iconHelp
                    title="Explanation of strategic alignment">Explain how the project design and delivery align with the relevant section of the document</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.priorities.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="document-name"><textarea style="width: 97%;" class="input-xlarge" data-validation-engine="validate[required]"
                                                data-bind="value: data1, disable: $parent.isProjectDetailsLocked()"
                                                rows="3"></textarea></td>
            <td class="section"><textarea style="width: 97%;" class="input-xlarge" data-validation-engine="validate[required]"
                                          data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"
                                          rows="5"></textarea></td>
            <td class="alignment"><textarea style="width: 97%;" class="input-xlarge" data-validation-engine="validate[required]"
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
            <g:render template="serviceTargets"/>
        </div>
    </div>

    <h4>Project risks & threats <span style="color: red;"><b>*</b></span></h4>
    <g:render template="risksAndThreats"/>
</div>