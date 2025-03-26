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
        <th class="related-outcomes required">${outcomeStatementHeading ?: 'Outcome statement/s'}</th>
        <th class="threat-code required">${threatsHeading ?:'Threats / Threatening processes'}</th>
        <th class="threat required">${descriptionHeading ?: 'Description'} <fc:iconHelp>${threatHelpText ?: "Describe the key threats (or key threatening processes) to the primary investment priority"}</fc:iconHelp></th>
        <th class="services required">${servicesHeading ?: 'Project service / Target measure/s to address threats'}<fc:iconHelp>${servicesHelpText ?: "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables"}</fc:iconHelp></th>
        <th class="intervention required">${methodologyHeading ?: 'Methodology'} <fc:iconHelp>${interventionHelpText ?: "Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome."}</fc:iconHelp></th>
        <th class="evidence required">${evidenceHeading ?: 'Evidence to be retained'} <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="related-outcomes">
            <select
                    class="form-control form-control-sm dropdown-right"
                    data-validation-engine="validate[required]"
                    multiple="true"
                    data-bind="options:$root.selectedOutcomes, optionsText:'code', optionsValue:'code', multiSelect2:{value:relatedOutcomes, templateResult:$root.renderOutcome, tags:false}, disable: $root.isProjectDetailsLocked()"></select>
        </td>
        <td class="threat-code">
            <select class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.keyThreatCodes, value:threatCode, optionsCaption:'Please select...', disable: $root.isProjectDetailsLocked()">
            </select>
        </td>
        <td class="threat">
            <textarea rows="4"
                      class="form-control form-control-sm"
                      data-validation-engine="validate[required]"
                      data-bind="value: threat, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="services">
            <select multiple="true"
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.keyThreatsTargetMeasures(), optionsText:'label', optionsValue:'scoreId', multiSelect2:{tags:false, preserveColumnWidth:20, value:relatedTargetMeasures}, disable: $root.isProjectDetailsLocked()"></select>
        </td>
        <td class="intervention">
            <textarea
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="value: intervention, disable: $root.isProjectDetailsLocked()"
                    rows="4"></textarea>
        </td>
        <td class="evidence">
            <textarea
                    rows="4"
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="value: evidence, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()">
                <i class="fa fa-remove" data-bind="click: $parent.removeRow"></i>
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
