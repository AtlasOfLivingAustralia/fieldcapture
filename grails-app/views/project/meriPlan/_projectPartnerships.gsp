<div id="project-partnership" class="well well-small">
    <label><b>Project partnerships</b></label>
    <p>Provide details on all project partners and the nature and scope of their participation in the project.</p>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="partner-name">Partner name
                <fc:iconHelp title="Partner name">Name of project partner, to be a project partner they need to be actively involved in the planning or delivery of the project.</fc:iconHelp></th>
            <th class="partnership-nature">Nature of partnership<fc:iconHelp title="Nature of partnership">Very briefly indicate how the partner is contributing to the project.</fc:iconHelp></th>
            <th class="partner-organisation-type">Type of organisation<fc:iconHelp title="Type of organisation">Select the most appropriate partner type from the list provided.</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.partnership.rows">
        <tr>
            <td class="index"> <span data-bind="text:$index()+1"></span></td>
            <td class="partner-name"> <textarea class="input-xlarge"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3"></textarea> </td>
            <td class="partnership-nature"><textarea class="input-xlarge" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
            <td class="partner-organisation-type"><select class="input-xlarge" data-bind="options: $parent.organisations, value:data3,optionsCaption: 'Please select',disable: $parent.isProjectDetailsLocked()"></select></td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="fa fa-remove" data-bind="click: $parent.removePartnership"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>

            <td colspan="5">
                <button type="button" class="btn btn-small"  data-bind="disable: isProjectDetailsLocked(), click: addPartnership">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
</div>