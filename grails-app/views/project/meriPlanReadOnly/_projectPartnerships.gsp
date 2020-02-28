<div id="project-partnership" class="well well-small">
    <label><b>Project partnership:</b></label>
    <table style="width: 100%;">
        <thead>
        <tr>
            <th></th>
            <th>Partner name</th>
            <th>Nature of partnership</th>
            <th>Type of organisation</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.partnership.rows">
        <tr>
            <td><span data-bind="text: $index()+1"></span></td>
            <td><span data-bind="text:data1"></span></td>
            <td><label data-bind="text:data2"></label></td>
            <td><label data-bind="text:data3"></label></td>
        </tr>
        </tbody>
    </table>
</div>