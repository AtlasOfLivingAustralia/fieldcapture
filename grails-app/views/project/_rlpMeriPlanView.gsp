<div class="meri-plan">
    <h4>Project Outcomes</h4>

    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome-priority">Primary Outcome</th>
            <th class="primary-outcome priority">Primary Investment Priority</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="index">1</td>
            <td class="outcome-priority"><span
                    data-bind="text:details.outcomes.primaryOutcome.description"></span>
            </td>
            <td class="priority">
                <span data-bind="text:details.outcomes.primaryOutcome.asset">

                </span>
            </td>
        </tr>

        </tbody>
    </table>

    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome">Mid-term Project Outcome(s)</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.midTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome"><span data-bind="text:description"></span></td>
        </tr>
        </tbody>
    </table>
    <table class="table">
        <thead>
        <tr class="header">
            <th class="index"></th>
            <th class="outcome">Short-term Project Outcome(s)</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome">
                <span data-bind="text:description"></span>
            </td>
        </tr>
        </tbody>
    </table>

    <h4>Additional project benefits</h4>
    <table class="table secondary-outcome">

        <thead>

        <tr class="header">
            <th class="index"></th>
            <th class="outcome-priority">Secondary Project Outcome</th>
            <th class="priority">Secondary Investment Priority(ies)</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome-priority"><span
                    data-bind="text:description"></span>
            </td>
            <td class="priority">
                <span data-bind="text:asset">
                </span>
            </td>
        </tr>

        </tbody>
    </table>

    <h4>Project details</h4>
    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header">
                    <th>Project description</th>
                </tr>
                <tr>
                    <td><span data-bind="text:description"></span></td>
                </tr>
                <tr class="header">
                    <th>Project methodology</th>
                </tr>
                <tr>
                    <td><span data-bind="text:details.implementation.description"></span></td>
                </tr>
                %{--<tr class="header">--}%
                    %{--<th>Project rationale</th>--}%
                %{--</tr>--}%
                %{--<tr>--}%
                    %{--<td><span data-bind="text:details.rationale"></span></td>--}%
                %{--</tr>--}%
                </tbody>
            </table>
        </div>
    </div>

    <!-- ko with:details.threats -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="threat required">Key threat(s) or key threatening processes</th>
        <th class="intervention required">Interventions to address threats</th>
        </thead>
        <tbody data-bind="foreach: rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="threat">
                <span adata-bind="text: threat">
                </span>
            </td>
            <td class="intervention">
                <span data-bind="value: intervention"></span>
            </td>
        </tr>
        </tbody>

    </table>
    <!-- /ko -->

    <h4>Monitoring methodology</h4>
    <!-- ko with:details.baseline -->
    <table class="table">
        <thead>
        <th class="index"></th>
        <th class="baseline required">Project baseline</th>
        <th class="baseline required">Describe the method used to obtain the baseline</th>
        </thead>
        <tbody data-bind="foreach: rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <span data-bind="text: baseline"></span>
            </td>
            <td class="baseline">
                <span data-bind="text: method"></span>
            </td>

        </tr>
        </tbody>

    </table>
    <!-- /ko -->

    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline required">Project monitoring indicators</th>
            <th class="baseline required">Project monitoring indicator approach</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <span data-bind="text: data1">
                </span>
            </td>
            <td class="baseline">
                <span data-bind="value: data2"></span>
            </td>
        </tr>
        </tbody>
    </table>

    <h4>Relevant national and regional plans</h4>

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
        </tr>
        </thead>
        <tbody data-bind="foreach : details.priorities.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="document-name"><span data-bind="text: data1"></span></td>
            <td class="section"><span data-bind="text: data2"></span></td>
            <td class="alignment"><span data-bind="text: data3"></span></td>
        </tr>
        </tbody>

    </table>

    <!-- ko with:details.services -->
    <h4>Project Services</h4>

    <table class="table budget-table">
        <thead>
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th data-bind="attr:{colspan:periods.length+1}">Minimum targets</th>
        </tr>
        <tr>
            <th class="index"></th>
            <th class="service">Service</th>
            <th class="score">Target measure</th>
            <th class="budget-cell">Total</th>
            <!-- ko foreach: periods -->
            <th class="budget-cell"><div data-bind="text:$data"></div></th>
            <!-- /ko -->
        </tr>
        </thead>
        <tbody data-bind="foreach : services">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="service">
                <span data-bind="text:service() ? service().name : ''"></span>
            </td>
            <td class="score">
                <span data-bind="text:score() ? score().label : ''"></span>
            </td>
            <td class="budget-cell">
                <span data-bind="text: target"></span>
            </td>

            <!-- ko foreach: periodTargets -->
            <td class="budget-cell">
                <span data-bind="text: target"/>
            </td>
            <!-- /ko -->

        </tr>
        </tbody>
    </table>

    <!-- /ko -->

    <g:if test="${risksAndThreatsVisible}">
        <g:render template="risksAndThreatsReadOnly"/>
    </g:if>

</div>