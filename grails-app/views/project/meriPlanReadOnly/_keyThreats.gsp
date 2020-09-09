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