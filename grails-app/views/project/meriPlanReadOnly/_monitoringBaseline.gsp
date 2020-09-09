<h4>Monitoring methodology</h4>
<!-- ko with:details.baseline -->
<table class="table baseline-view">
    <thead>
    <th class="index"></th>
    <th class="baseline required">Project baseline</th>
    <th class="baseline-method required">The method used to obtain the baseline, or how the baseline will be established</th>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="baseline">
            <span data-bind="text: baseline"></span>
        </td>
        <td class="baseline-method">
            <span data-bind="text: method"></span>
        </td>

    </tr>
    </tbody>

</table>
<!-- /ko -->