<!-- ko with:details.services -->

<div id="serviceTargetsContainer">

    <b class="header-with-help">Targets</b>


    <table id="outputTargets" class="table">
        <thead>
        <tr>
            <th class="service">Service</th>
            <th class="score">Target Measure(s)</th>
            <th class="target">Target</th></tr>
        </thead>
        <!-- ko foreach:services -->

        <tbody data-bind="foreach:targets">

        <tr>
            <!-- ko if:!$index() -->
            <td class="service" data-bind="attr:{rowspan:$parent.targets().length}">
                <span data-bind="text:serviceName"></span>
            </td>
            <!-- /ko -->

            <td class="score"><span data-bind="text:score.label"></span></td>
            <td class="target">
                <input type="number" data-bind="enable:!$root.isProjectDetailsLocked(),value:target"
                       data-validation-engine="validate[required,custom[number]]"/>
                <span data-bind="text:score.units"></span>
            </td>

        </tr>


        </tbody>
        <!-- /ko -->
    </table>

</div>

<!-- /ko -->

