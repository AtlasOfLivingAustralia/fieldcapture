<div class="well well-small">
    <h4>Key evaluation question</h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline">Project Key evaluation question (KEQ)</th>
            <th class="baseline-method">How will KEQ be monitored</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text: $index()+1"></span></td>
            <td class="baseline"><span data-bind="text:data1"></span></td>
            <td class="baseline-method"><label data-bind="text:data2"></label></td>
        </tr>
        </tbody>
    </table>
</div>