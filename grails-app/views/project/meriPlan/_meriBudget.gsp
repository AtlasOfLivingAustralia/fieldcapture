<div class="meri-budget">
    <div class="well well-small">
        <label><b>Project Budget</b><fc:iconHelp title="Project Budget">Include the planned budget expenditure against each programme objective. This information will be used to report on the use of public money.</fc:iconHelp></label>
        <table style="width: 100%;">
            <thead>
            <tr>
                <th width="2%"></th>
                <th width="10%">Investment/Priority Area <fc:iconHelp title="Investment/Priority Area">Select the appropriate investment area and indicate the funding distribution across the project to this. Add rows as required for different investment priority areas.</fc:iconHelp></th>
                <th width="30%">Description <fc:iconHelp title="Description">Describe how funding distribution will address this investment priority</fc:iconHelp></th>
                <!-- ko foreach: details.budget.headers -->
                <th style="text-align: center;" width="10%" ><div style="text-align: center;" data-bind="text:data"></div>$</th>
                <!-- /ko -->
                <th  style="text-align: center;" width="10%">Total</th>
                <th width="4%"></th>
            </tr>
            </thead>
            <tbody data-bind="foreach : details.budget.rows">
            <tr>
                <td><span data-bind="text:$index()+1"></span></td>
                <td><select style="width: 97%;" data-bind="options: $parent.projectThemes, optionsCaption: 'Please select', value:shortLabel, disable: $parent.isProjectDetailsLocked()"> </select></td>
                <td><textarea style="width: 95%;" data-bind="value: description, disable: $parent.isProjectDetailsLocked()" rows="3"></textarea></td>

                <!-- ko foreach: costs -->
                <td><div style="text-align: center;">
                    <input style="text-align: center; width: 98%;" class="input-xlarge" data-bind="value: dollar, numeric: $root.number, disable: $root.isProjectDetailsLocked()" data-validation-engine="validate[custom[number]]"/>
                </div>
                </td>
                <!-- /ko -->

                <td style="text-align: center;" ><span style="text-align: center;" data-bind="text: rowTotal.formattedCurrency, disable: $parent.isProjectDetailsLocked()"></span></td>
                <td>
                    <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="icon-remove" data-bind="click: $parent.removeBudget"></i></span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                <td colspan="0" style="text-align:left;">
                    <button type="button" class="btn btn-small" data-bind="disable: isProjectDetailsLocked(), click: addBudget">
                        <i class="icon-plus"></i> Add a row</button></td>
                <td style="text-align: right;" ><b>Total </b></td>
                <!-- ko foreach: details.budget.columnTotal -->
                <td style="text-align: center;" width="10%"><span data-bind="text:data.formattedCurrency"></span></td>
                <!-- /ko -->
                <td style="text-align: center;"><b><span data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b></td>
            </tr>
            </tfoot>
        </table>
    </div>
</div>