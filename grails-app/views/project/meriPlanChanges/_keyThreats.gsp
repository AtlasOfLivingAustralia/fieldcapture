<!-- ko with:details.threats -->
<table class="table threats-view">
    <thead>
    <th class="index"></th>
    <th class="threat required">Key threat(s) and/or key threatening processes</th>
    <th class="intervention required">Interventions to address threats</th>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="threat">
            <span data-bind="text: threat">
            </span>
        </td>
        <td class="intervention">
            <span data-bind="text: intervention"></span>
        </td>
    </tr>
    </tbody>

</table>
<!-- /ko -->

<!-- ko with:detailsChanged.threats -->
<table class="table threats-view">
    <thead>
    <th class="index"></th>
    <th class="threat required">Key threat(s) and/or key threatening processes</th>
    <th class="intervention required">Interventions to address threats</th>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="threat">
            <span data-bind="text: threat">
            </span>
        </td>
        <td class="intervention">
            <span data-bind="text: intervention"></span>
        </td>
    </tr>
    </tbody>

</table>
<!-- /ko -->
%{--<table class="table">--}%
%{--    <thead>--}%
%{--    <tr>--}%
%{--        <th class="index"></th>--}%
%{--        <th class="threat required">Key threat(s) and/or key threatening processes</th>--}%
%{--        <th class="intervention required">Interventions to address threats</th>--}%
%{--    </tr>--}%
%{--    </thead>--}%
%{--    <tbody data-bind="foreach:details.threats.rows">--}%
%{--    <tr>--}%
%{--        <td class="index"><span data-bind="text:$index()+1"></span></td>--}%
%{--        <td class="threat">--}%
%{--            <span data-bind="text: threat">--}%
%{--            </span>--}%
%{--        </td>--}%
%{--        <td class="intervention">--}%
%{--            <span data-bind="text: intervention"></span>--}%
%{--        </td>--}%
%{--    </tr>--}%
%{--    </tbody>--}%
%{--</table>--}%

<table class="table table-striped key-threats">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="threat required">Key threat(s) and/or key threatening processes</th>
        <th class="intervention required">Interventions to address threats</th>
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.threats.rows.size(), changed.custom.details.threats?.rows?.size()?:0)}"/>
%{--    <g:set var="max" value="${5}"/>--}%
    <g:each in="${(0..<max)}" var="i">
        <tr>
            <td class="index"><span data-bind="text:${i}+1"></span></td>
            <td><fc:renderComparisonNewVersion changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="threat"/> </td>
            <td><fc:renderComparisonNewVersion changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="intervention"/> </td>
        </tr>
    </g:each>

    </tbody>
</table>

