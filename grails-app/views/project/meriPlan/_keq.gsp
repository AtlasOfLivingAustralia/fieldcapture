<div id="keq" class="well well-small">
    <label><b>Key evaluation question</b>  <fc:iconHelp title="Key evaluation question">Please list the Key Evaluation Questions for your project. Evaluation questions should cover the effectiveness of the project and whether it delivered what was intended; the impact of the project; the efficiency of the delivery mechanism/s; and the appropriateness of the methodology. These need to be answerable within the resources and time available to the project.</fc:iconHelp></label>
    <table style="width: 100%;">
        <thead>
        <tr>
            <th></th>
            <th>Project Key evaluation question (KEQ)
                <fc:iconHelp title="Project Key evaluation question (KEQ)">List the projects KEQ’s. Add rows as necessary.</fc:iconHelp></th>
            <th>How will KEQ be monitored
                <fc:iconHelp title="How will KEQ be monitored">Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.</fc:iconHelp></th>
            <th></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td width="2%"> <span data-bind="text:$index()+1"></span></td>
            <td width="32%">
                <textarea style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td width="52%"><textarea style="width: 97%;" class="input-xlarge" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
            <td width="4%">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="icon-remove" data-bind="click: $parent.removeKEQ"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td colspan="0" style="text-align:left;">
                <button type="button" class="btn btn-small" data-bind="disable: isProjectDetailsLocked(), click: addKEQ">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
</div>