<div class="meri-budget">

    <label><b>Project Budget</b><fc:iconHelp title="Project Budget">Include the planned budget expenditure against each programme objective. This information will be used to report on the use of public money.</fc:iconHelp></label>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <g:if test="${!showActivityColumn}">
            <th class="budget-category">Investment/Priority Area <fc:iconHelp title="Investment/Priority Area">Select the appropriate investment area and indicate the funding distribution across the project to this. Add rows as required for different investment priority areas.</fc:iconHelp></th>
            </g:if>
            <th class="budget-description">${itemName ?: "Description"} <fc:iconHelp title="${itemName ?: "Description"}">${itemHelp ?:"Describe how funding distribution will address this investment priority"}</fc:iconHelp></th>
            <g:if test="${showActivityColumn}">
            <th class="budget-activities">Project activities relevant to budget item</th>
            </g:if>
            <!-- ko foreach: details.budget.headers -->
            <th class="budget-amount"><div data-bind="text:data"></div>$</th>
            <!-- /ko -->
            <!-- ko if: details.budget.headers().length -->
            <th class="budget-amount" width="10%">Total</th>
            <!-- /ko -->
            <!-- ko if: !details.budget.headers().length -->
            <th class="budget-amount" width="10%">Amount ($)</th>
            <!-- /ko -->

            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.budget.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <g:if test="${!showActivityColumn}">
            <td class="budget-category"><select data-bind="options: $parent.projectThemes, optionsCaption: 'Please select', value:shortLabel, disable: $parent.isProjectDetailsLocked()"> </select></td>
            </g:if>
            <td class="budget-description"><textarea data-bind="value: description, disable: $parent.isProjectDetailsLocked()" rows="3"></textarea></td>
            <g:if test="${showActivityColumn}">
                <td class="budget-activities"><select multiple="multiple" data-bind="options:details.services.selectedServices, multiSelect2:{value:activities}, disable: $parent.isProjectDetailsLocked()"></select></td>
            </g:if>
            <!-- ko foreach: costs -->
            <td class="budget-amount">
                <input type="number" class="input-small" data-bind="value: dollar, numeric: $root.number, disable: $root.isProjectDetailsLocked()" data-validation-engine="validate[custom[number]]"/>
            </td>
            <!-- /ko -->
            <!-- ko if: details.budget.headers().length -->
            <td class="budget-amount"><span data-bind="text: rowTotal.formattedCurrency, disable: $parent.isProjectDetailsLocked()"></span></td>
            <!-- /ko -->
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="fa fa-remove" data-bind="click: $parent.removeBudget"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td class="footer-index"></td>
            <td class="budget-footer"></td>

            <td style="text-align: right;"  class="budget-footer"><b>Total </b></td>
            <!-- ko foreach: details.budget.columnTotal -->
            <td style="text-align: center;" class="budget-amount"><span data-bind="text:data.formattedCurrency"></span></td>
            <!-- /ko -->
            <td style="text-align: center;" class="budget-amount"><b><span data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b></td>
            <td class="remove"></td>
        </tr>
        <tr>
            <td data-bind="attr:{colspan:details.budget.columnTotal.length+8}">
                <button type="button" class="btn btn-small" data-bind="disable: isProjectDetailsLocked(), click: addBudget">
                    <i class="fa fa-plus"></i> Add a row</button>
            </td>
        </tr>
        </tfoot>
    </table>

</div>