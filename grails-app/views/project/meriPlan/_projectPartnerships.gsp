<div id="project-partnership" class="well well-small">
    <label><b>Project partnerships</b></label>
    <p>Provide details on all project partners and the nature and scope of their participation in the project.</p>
    <table style="width: 100%;">
        <thead>
        <tr>
            <th></th>
            <th>Partner name
                <fc:iconHelp title="Partner name">Name of project partner, to be a project partner they need to be actively involved in the planning or delivery of the project.</fc:iconHelp></th>
            <th>Nature of partnership<fc:iconHelp title="Nature of partnership">Very briefly indicate how the partner is contributing to the project.</fc:iconHelp></th>
            <th>Type of organisation<fc:iconHelp title="Type of organisation">Select the most appropriate partner type from the list provided.</fc:iconHelp></th>
            <th></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.partnership.rows">
        <tr>
            <td width="2%"> <span data-bind="text:$index()+1"></span></td>
            <td width="20%"> <textarea style="width: 97%;" class="input-xlarge"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3"></textarea> </td>
            <td width="54%"><textarea style="width: 97%;" class="input-xlarge" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
            <td width="20%"><select style="width: 97%;" class="input-xlarge" data-bind="options: $parent.organisations, value:data3,optionsCaption: 'Please select',disable: $parent.isProjectDetailsLocked()"></select></td>
            <td width="4%">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="icon-remove" data-bind="click: $parent.removePartnership"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td colspan="0" style="text-align:left;">
                <button type="button" class="btn btn-small"  data-bind="disable: isProjectDetailsLocked(), click: addPartnership">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
</div>