<h4>Program Outcome</h4>
<table class="table primary-outcome">
    <thead>
    <tr>
        <th class="outcome-priority">Primary outcome</th>
        <th class="primary-outcome priority required">${pestsAndWeedsHeading?: 'Primary Investment'} <span data-bind="if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priority</span><span data-bind="if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priorities</span>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority" id="primaryOutcome">
%{--                        <span data-bind="text:details.outcomes.primaryOutcome.description"></span>--}%
        <span style="display:none" class="original" data-bind="text:details.outcomes.primaryOutcome.description"></span>
        <span style="display:none" class="changed" data-bind="text:detailsChanged.outcomes.primaryOutcome.description"></span>
        <span wrap class="diff"></span>

        </td>
        <td>
            <span id="assetsx">
            <g:set var="max" value="${Math.max(project.custom.details.outcomes?.primaryOutcome?.assets?.size(), changed.custom.details.outcomes?.primaryOutcome?.assets?.size()?:0)}"/>
            <g:each in="${(0..<max)}" var="i">
                <span><fc:renderComparisonNewVersion changed="${changed.custom.details.outcomes?.primaryOutcome.assets ?: []}" i="${i}" original="${project.custom.details.outcomes?.primaryOutcome.assets ?: []}"/> </span>
            </g:each>
            </span>

            <!-- ko if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->
%{--            <span data-bind="text:details.outcomes.primaryOutcome.asset"></span>--}%
%{--            <span style="display:none" class="original" data-bind="text:details.outcomes.primaryOutcome.asset"></span>--}%
%{--            <span style="display:none" class="changed" data-bind="text:detailsChanged.outcomes.primaryOutcome.asset"></span>--}%
%{--            <span wrap class="diff1"></span>--}%
            <!-- /ko -->
            <!-- ko if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->
%{--            <ul data-bind="foreach:details.outcomes.primaryOutcome.assets">--}%
%{--                <li data-bind="text:$data"></li>--}%
%{--            </ul>--}%
            <!-- /ko -->

        </td>
    </tr>

    </tbody>
</table>