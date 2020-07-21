<div class="meri-budget-view" class="well well-small">
    <h4>Project Budget</h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <g:if test="${!showActivityColumn}">
            <th class="budget-category">Investment/Priority Area</th>
            </g:if>
            <th class="budget-description">Description</th>
            <g:if test="${showActivityColumn}">
                <th class="budget-activities">Project activities relevant to budget item</th>
            </g:if>
            <!-- ko foreach: details.budget.headers -->
            <th class="budget-amount">
                <div style="text-align: center;" data-bind="text:data"></div>$</th>
            <!-- /ko -->
            <!-- ko if: details.budget.headers().length -->
            <th style="text-align: center;" width="10%">Total</th>
            <!-- /ko -->
            <!-- ko if: !details.budget.headers().length -->
            <th class="budget-amount" width="10%">Amount ($)</th>
            <!-- /ko -->
        </tr>
        </thead>
        <tbody data-bind="foreach : details.budget.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <g:if test="${!showActivityColumn}">
            <td class="budget-category"><span data-bind="text:shortLabel"></span></td>
            </g:if>
            <td class="budget-description"><div style="text-align: left;"><span data-bind="text: description"></span></div>
            </td>
            <g:if test="${showActivityColumn}">
                <td class="budget-activities"><span data-bind="text:activities"></span></td>
            </g:if>

            <!-- ko foreach: costs -->
            <td class="budget-amount"><span data-bind="text: dollar.formattedCurrency"></span></td>
            <!-- /ko -->

            <!-- ko if: details.budget.headers().length -->
            <td class="budget-amount">
                <span style="width: 90%;" data-bind="text: rowTotal.formattedCurrency"></span>
            </td>
            <!-- /ko -->
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td class="footer-index"></td>
            <td class="budget-footer"></td>
            <td style="text-align: right;" class="budget-footer"><b>Total</b></td>
            <!-- ko foreach: details.budget.columnTotal -->
            <td style="text-align: center;" class="budget-amount">
                <span data-bind="text:data.formattedCurrency"></span>
            </td>
            <!-- /ko -->
            <td style="text-align: center;" class="budget-amount">
                <b><span data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b>
            </td>
        </tr>
        </tfoot>
    </table>
</div>