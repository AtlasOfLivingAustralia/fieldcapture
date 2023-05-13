<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<g:if test="${explanation}">
    <p>${explanation}</p>
</g:if>
<!-- ko with:details.threats -->
<table class="table threats extended-threats">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="threat-code">Key threat(s) and/or key threatening processes</th>
        <th class="threat required">Description <fc:iconHelp>${threatHelpText ?: "Describe the key threats (or key threatening processes) to the primary investment priority"}</fc:iconHelp></th>
        <th class="services">Project service measure/s to address threats</th>
        <th class="intervention required">Methodology <fc:iconHelp>${interventionHelpText ?: "Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome."}</fc:iconHelp></th>
        <th class="evidence">Evidence</th>
        <th class="related-outcomes">ST/MT Outcome Statement</th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="threat-code"><select data-bind="options:$root.keyThreatCodes, value:threatCode"></select> </td>
        <td class="threat">
            <textarea rows="4" class="form-control form-control-sm" data-validation-engine="validate[required]"
                      data-bind="value: threat, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="services"><select multiple="true" class="form-control form-control-sm" data-bind="options:$root.allServices, optionsText:'label', optionsValue:'scoreId', multiSelect2:{preserveColumnWidth:true, value:relatedServices}"></select> </td>
        <td class="intervention"><textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                                           data-bind="value: intervention, disable: $root.isProjectDetailsLocked()"
                                           rows="4"></textarea></td>
        <td class="evidence">
            <textarea rows="4" class="form-control form-control-sm" data-validation-engine="validate[required]"
                      data-bind="value: evidence, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="related-outcomes">
            <select multiple="true" data-bind="options:$root.selectedOutcomes, optionsText:'code', optionsValue:'code', multiSelect2:{value:relatedOutcomes}"></select>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                 data-bind="click: $parent.removeRow"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="8">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
<!-- /ko -->
