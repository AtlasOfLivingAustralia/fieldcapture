<h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>${titleHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used."}</fc:iconHelp>
<!-- ko with:details.baseline -->
<table class="table monitoring-baseline">
    <thead>
    <th class="index"></th>
    <th class="baseline required">Project baseline <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineHelpText}</fc:iconHelp></g:if></th>
    <th class="baseline-method required">Describe the method used to obtain the baseline, or how the baseline will be established <fc:iconHelp>${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
    <th class="remove"></th>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="baseline">
            <textarea rows="4" data-validation-engine="validate[required]" class="form-control"
                      data-bind="value: baseline, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="baseline-method"><textarea data-validation-engine="validate[required]" class="form-control"
                                              data-bind="value: method, disable: $root.isProjectDetailsLocked()"
                                              rows="4"></textarea></td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                 data-bind="click: $parent.removeRow"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="4">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
<!-- /ko -->
