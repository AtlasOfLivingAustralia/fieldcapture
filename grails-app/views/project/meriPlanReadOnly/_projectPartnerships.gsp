<div id="project-partnership-view" class="well well-small">
    <h4>Project partnerships</h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="partner-name">Partner name</th>
            <th class="partnership-nature">Nature of partnership</th>
            <th class="partner-organisation-type">Type of organisation</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.partnership.rows">
        <tr>
            <td class="index"><span data-bind="text: $index()+1"></span></td>
            <td class="partner-name"><span data-bind="text:data1"></span></td>
            <td class="partnership-nature"><label data-bind="text:data2"></label></td>
            <td class="partner-organisation-type">
                <div data-bind="if:data3() != 'Other'">
                    <label data-bind="text:data3"></label>
                </div>
                <div data-bind="if:data3() == 'Other'">
                    <label data-bind="text:otherOrganisationType"></label>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>