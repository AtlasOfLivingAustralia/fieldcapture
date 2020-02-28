<div class="well well-small">
    <label><b>Key evaluation question</b></label>
    <table style="width: 100%;">
        <thead>
        <tr>
            <th></th>
            <th>Project Key evaluation question (KEQ)</th>
            <th>How will KEQ be monitored</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td><span data-bind="text: $index()+1"></span></td>
            <td><span data-bind="text:data1"></span></td>
            <td><label data-bind="text:data2"></label></td>
        </tr>
        </tbody>
    </table>
</div>