<div id="keq">
    <label><b>Key evaluation question</b>  <fc:iconHelp title="Key evaluation question">Please list the Key Evaluation Questions for your project. Evaluation questions should cover the effectiveness of the project and whether it delivered what was intended; the impact of the project; the efficiency of the delivery mechanism/s; and the appropriateness of the methodology. These need to be answerable within the resources and time available to the project.</fc:iconHelp></label>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline">Project Key evaluation question (KEQ)
                <fc:iconHelp title="Project Key evaluation question (KEQ)">List the projects KEQ’s. Add rows as necessary.</fc:iconHelp></th>
            <th class="baseline-method">How will KEQ be monitored
                <fc:iconHelp title="How will KEQ be monitored">Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"> <span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <textarea style="width: 97%;" rows="3" class="input-xlarge"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()">
                </textarea>
            </td>
            <td class="baseline-method"><textarea class="input-xlarge" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="fa fa-remove" data-bind="click: $parent.removeKEQ"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>

            <td colspan="5">
                <button type="button" class="btn btn-small" data-bind="disable: isProjectDetailsLocked(), click: addKEQ">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
</div>