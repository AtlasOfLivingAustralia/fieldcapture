<!-- ko stopBinding:true -->
<form id="serviceTargetsContainer">

    <h4 class="header-with-help">Project Targets</h4>
    <fc:iconHelp title="Total Project Outputs">Statement of Outputs to be delivered by end of the project should be SMART and link to a relevant Project Outcome. For example: By 30 June 2018, 10ha of riparian revegetation works will be completed along priority waterways towards Outcome 1.</fc:iconHelp>

    <table id="outputTargets" class="table table-condensed tight-inputs">
        <thead>
        <tr>
            <th>Service</th>
            <th>Output Target Measure(s)</th>
            <th>Target</th></tr>
        </thead>
        <!-- ko foreach:outputTargets -->
        <tbody data-bind="foreach:scores">
        <tr data-bind="visible:!$root.initialising()">
            <!-- ko with:isFirst -->
            <td data-bind="attr:{rowspan:$parents[1].scores.length}">
                <b><span data-bind="text:$parents[1].name"></span></b>
            </td>

            <!-- /ko -->
            <td><span data-bind="text:scoreLabel"></span></td>
            <td>
                <input type="text" class="input-mini" data-bind="visible:$root.canEditOutputTargets(),value:target" data-validation-engine="validate[required,custom[number]]"/>
                <span data-bind="visible:!$root.canEditOutputTargets(),text:target"></span>
                <span data-bind="text:units"></span>
                <span class="save-indicator" data-bind="visible:isSaving"><asset:image src="ajax-saver.gif" alt="saving icon"/> saving</span>
            </td>

        </tr>

        </tbody>
        <!-- /ko -->
        <tfoot data-bind="visible:$root.initialising()">
        <tr>
            <td colspan="4">
                Loading targets.... <asset:image src="spinner.gif"/>
            </td>
        </tr>
    </tfoot>
    </table>

</form>

<!-- /ko -->
