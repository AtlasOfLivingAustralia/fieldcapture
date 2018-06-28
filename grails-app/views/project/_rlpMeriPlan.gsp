<div class="meri-plan">
    <h4>Program Outcome</h4>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="outcome-priority required">Primary Regional Land Partnerships outcome</th>
            <th class="primary-outcome priority required">Primary Investment Priority <fc:iconHelp html="true" container="body">Enter the primary investment priority/ies for the primary outcome. (drop down list in MERIT) <br/>For outcomes 1-4, only one primary investment priority can be selected.<br/>For outcomes 5-6, up to 5 primary investment priorities can be selected</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="outcome-priority">
                <select data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectableOutcomes, value:details.outcomes.primaryOutcome.description, optionsCaption: 'Please select', disable: isProjectDetailsLocked()" >
                </select>

            </td>
            <td colspan="2" class="priority">
                <!-- ko if:!$root.isAgricultureProject() -->

                <select style="width:100%" class="asset" data-validation-engine="validate[required]" data-bind="options:details.outcomes.outcomePriorities(details.outcomes.primaryOutcome.description()), optionsCaption: 'Please select', value:details.outcomes.primaryOutcome.asset, disable: isProjectDetailsLocked()" >
                </select>
                <!-- /ko -->
                <!-- ko if:$root.isAgricultureProject() -->
                <select size="5" multiple="multiple" style="width:100%" class="asset" data-validation-engine="validate[required]" data-bind="options:details.outcomes.outcomePriorities(details.outcomes.primaryOutcome.description()), selectedOptions:details.outcomes.primaryOutcome.assets, disable: isProjectDetailsLocked()" >
                </select>
                <!-- /ko -->
            </td>
        </tr>

        </tbody>
    </table>

    <h4>Additional benefits</h4>
    <table class="table secondary-outcome">

        <thead>

        <tr class="header">
            <th class="outcome-priority">Secondary Regional Land Partnerships outcome(s)</th>
            <th class="priority">Secondary Investment Priorities <fc:iconHelp container="body">Other investment priorities that will benefit from the project.</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
        <tr>
            <td class="outcome-priority"><select data-validation-engine="validate[required]"
                                                 data-bind="value:description, options: $parent.details.outcomes.selectableOutcomes, optionsCaption: 'Please select', disable: $root.isProjectDetailsLocked()"></select>
            </td>
            <td class="priority">
                <select data-bind="value:asset, options:$root.details.outcomes.outcomePriorities(description()), optionsCaption: 'Please select', disable: $root.isProjectDetailsLocked()" class="input-large asset"></select>
            </td>
            <td class="remove">
                <span data-bind="if:$index() && !$parent.isProjectDetailsLocked()">
                    <i class="fa fa-remove" data-bind="click: $parent.removeSecondaryOutcome"></i>
                </span>
            </td>
        </tr>

        </tbody>
        <tfoot>
        <tr>
            <td colspan="3">
                <button type="button" class="btn btn-small"
                        data-bind="disable: details.outcomes.secondaryOutcomes().length >= 5 || isProjectDetailsLocked(), click: addSecondaryOutcome">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <h4>Project outcomes</h4>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome required">Short-term outcome statement/s <fc:iconHelp html="true" container="body">Short-term outcomes should:
                <ul>
                    <li>Contribute to the 5-year Outcome (e.g. what degree of impact you are expecting from this Project’s interventions).</li>
                    <li>Outline the degree of impact having undertaken the Services for up to 3 years, for example "area of relevant vegetation type has increased".</li>
                    <li>Be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li>
                </ul>
                <b>Please note: </b>for Projects three years or less in duration, a short-term Project outcome achievable at the Project’s completion must be set.
            </fc:iconHelp> </th>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome">Medium-term outcome statement/s <fc:iconHelp html="true" container="body">Medium-term Project outcomes should:
            <ul>
                <li>Contribute to the 5-year Outcome and relate to the short-term outcome. </li>
                <li>Outline the degree of impact having undertaken the Services for up to 5 years, such as "Reduce woody weed cover to less than 5% in 400 hectares of remnant native vegetation within the Ramsar site by 2023" Or "Increase average annual groundcover by 20% on 400 hectares of grazing land by 2023"</li>
                <li>Be expressed as a SMART Statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li>
            </ul>
                <b>Please note</b>: Projects more than 3 years in duration must set medium-term Project outcomes achievable at the Project's completion.
            </fc:iconHelp></th>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>



    <h4>Project details</h4>
    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>

                <tr class="header required">
                    <th class="required">Project description (1000 character limit [approx. 150 words]) <fc:iconHelp>Project description will be visible on project overview page in MERIT.</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5"  data-validation-engine="validate[required,maxSize[1000]]" data-bind="value:details.description, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>

                <!-- ko if:isAgricultureProject() -->
                <tr class="header">
                    <th class="required">Project rationale (3000 character limit [approx 500 words]) <fc:iconHelp>Provide a rationale for addressing the targeted investment priorities including how the actions will contribute to achieving the 5 year outcomes</fc:iconHelp></th>
                </tr>
                <tr>
                    <td><textarea rows="5" data-validation-engine="validate[required,maxSize[3000]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()"></textarea></td>
                </tr>
                <!-- /ko -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ko if:!isAgricultureProject() -->
    <!-- ko with:details.threats -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="threat required">Key threat(s) and/or key threatening processes <fc:iconHelp>Describe the key threats (or key threatening processes) to the primary investment priority</fc:iconHelp></th>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <!-- /ko -->
    <!-- /ko -->

    <table class="table">
        <thead>
        <tr class="header required">
            <th class="required">Project methodology (3000 character limit [approx 500 words]) <fc:iconHelp>Describe the methodology that will be used to achieve the project outcomes</fc:iconHelp></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><textarea rows="5" data-validation-engine="validate[required,maxSize[3000]]" data-bind="value:details.implementation.description, disable: isProjectDetailsLocked()"></textarea></td>
        </tr>
        </tbody>
    </table>

    <h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, mid-term and 5 year program outcome), and the monitoring design.</fc:iconHelp>
    <!-- ko with:details.baseline -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="baseline required">Project baseline</th>
        <th class="baseline required">Describe the method used to obtain the baseline, or how the baseline will be established <fc:iconHelp>Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design.</fc:iconHelp></th>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
    <!-- /ko -->

    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline required">Project monitoring indicators</th>
            <th class="baseline required">Describe the project monitoring indicator approach</th>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
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
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

    <div class="row-fluid">
        <div class="span12">
            <g:render template="serviceTargets"/>
        </div>
    </div>

    <h4 class="header-with-help">Project risks & threats <span style="color: red;"><b>*</b></span> </h4><fc:iconHelp>Please enter the details of risks and threats to the project and the mitigation strategies being used to address them.</fc:iconHelp>
    <g:render template="risksAndThreats"/>

    <g:render template="/shared/declaration" model="[divId:'meriSubmissionDeclaration', declarationType:au.org.ala.merit.SettingPageType.RLP_MERI_DECLARATION]"/>
</div>