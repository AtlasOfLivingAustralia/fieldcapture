<div class="meri-budget-view" class="well well-small">
    <h4>Project Budget</h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="budget-category">Investment/Priority Area</th>
            <th class="budget-description">Description</th>
            <!-- ko foreach: details.budget.headers -->
            <th class="budget-amount"><div style="text-align: center;"
                                                             data-bind="text:data"></div>$</th>
            <!-- /ko -->
            <th style="text-align: center;" width="10%">Total</th>

        </tr>
        </thead>
        <tbody data-bind="foreach : details.budget.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="budget-category"><span data-bind="text:shortLabel"></span></td>
            <td class="budget-description"><div style="text-align: left;"><span data-bind="text: description"></span></div>
            </td>

            <!-- ko foreach: costs -->
            <td class="budget-amount"><span data-bind="text: dollar.formattedCurrency"></span></td>
            <!-- /ko -->

            <td class="budget-amount"><span style="width: 90%;"
                                                  data-bind="text: rowTotal.formattedCurrency"></span>
            </td>

        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="2" style="width:0%">
            <td style="text-align: right;"><b>Total</b></td>
            <!-- ko foreach: details.budget.columnTotal -->
            <td style="text-align: center;" width="10%"><span
                    data-bind="text:data.formattedCurrency"></span></td>
            <!-- /ko -->
            <td style="text-align: center;"><b><span
                    data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b></td>
        </tr>
        </tfoot>
    </table>
</div>