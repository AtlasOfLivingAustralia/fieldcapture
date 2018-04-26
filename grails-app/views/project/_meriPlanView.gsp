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
            <td colspan="2" class="priority">
                <ul data-bind="foreach:details.outcomes.primaryOutcome.assets">
                    <li data-bind="text:$data"></li>
                </ul>
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
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome-priority"><span
                    data-bind="text:description"></span>
            </td>
            <td class="priority">
                <ul data-bind="foreach:assets">
                    <li data-bind="text:$data"></li>
                </ul>
            </td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()">
                    <i class="fa fa-remove" data-bind="click: $parent.removeSecondaryOutcome"></i>
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


    <div class="row-fluid">
        <div class="span12">
            <table class="table">
                <tbody>
                <tr class="header">
                    <th>Project rationale</th>
                </tr>
                <tr>
                    <td><span data-bind="text:details.rationale"></span></td>
                </tr>
                <tr class="header">
                    <th>Project methodology</th>
                </tr>
                <tr>
                    <td><span data-bind="text:details.projectMethodology"></span></td>
                </tr>
                <tr class="header">
                    <th>Monitoring methodology</th>
                </tr>
                <tr>
                    <td><span data-bind="text:details.monitoringMethodology"></span></td>
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

        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="keq">
                <span data-bind="text: data1"></span>
            </td>
            <td class="keq-monitoring"><span data-bind="text: data2"></span></td>
        </tr>
        </tbody>
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

    <!-- Budget table -->

    <label><b>Project Budget</b></label>
    <table class="table budget-table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="service">Service</th>
            <!-- ko foreach: details.budget.headers -->
            <th class="budget-cell"><div data-bind="text:data"></div>$</th>
            <!-- /ko -->
            <th class="budget-cell">Total</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.budget.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="service">
                <span data-bind="text:shortLabel"></span>
            </td>

            <!-- ko foreach: costs -->
            <td class="budget-cell">
                <span data-bind="text: dollar"/>
            </td>
            <!-- /ko -->

            <td class="budget-cell">
                <span data-bind="text: rowTotal.formattedCurrency, disable: $parent.isProjectDetailsLocked()"></span>
            </td>

        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td class="index"></td>
            <td><b>Total</b></td>

            <!-- ko foreach: details.budget.columnTotal -->
            <td class="budget-cell"><span data-bind="text:data.formattedCurrency"></span>
            </td>
            <!-- /ko -->
            <td class="budget-cell"><b><span
                    data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b></td>
        </tr>

        </tfoot>
    </table>

    <g:if test="${risksAndThreatsVisible}">
        <g:render template="risksAndThreatsReadOnly"/>
    </g:if>

</div>