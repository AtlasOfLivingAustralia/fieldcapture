<table style="width: 100%;">
    <thead>
    <tr>
        <th></th>
        <th>Monitoring indicator</th>
        <th>Monitoring approach</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.objectives.rows">
    <tr>
        <td><span data-bind="text: $index()+1"></span></td>
        <td><span data-bind="text:data1"></span></td>
        <td><label data-bind="text:data2"></label></td>
    </tr>
    </tbody>
</table>