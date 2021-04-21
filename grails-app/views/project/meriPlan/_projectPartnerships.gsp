<div id="project-partnership" class="well well-small">
    <label><b>Project partnerships</b><g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if></label>
    <p>${explanation?: "Provide details on all project partners and the nature and scope of their participation in the project."}</p>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="partner-name">Partner name
                <fc:iconHelp title="Partner name">${helpTextPartnerName ?:'Name of project partner, to be a project partner they need to be actively involved in the planning or delivery of the project.'}</fc:iconHelp></th>
            <th class="partnership-nature">Nature of partnership<fc:iconHelp title="Nature of partnership">${helpTextPartnerNature ?: 'Very briefly indicate how the partner is contributing to the project.'}</fc:iconHelp></th>
            <th class="partner-organisation-type">Type of organisation<fc:iconHelp title="Type of organisation">${helpTextPartnerOrg ?: 'Select the most appropriate partner type from the list provided.'}</fc:iconHelp></th>
            <th class="remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.partnership.rows">
        <tr>
            <td class="index"> <span data-bind="text:$index()+1"></span></td>
            <td class="partner-name"> <textarea placeholder="${namePlaceHolder}" class="form-control"  data-bind="value: data1, disable: $parent.isProjectDetailsLocked()" rows="3"></textarea> </td>
            <td class="partnership-nature"><textarea placeholder="${partnershipPlaceHolder}" class="form-control" data-bind="value: data2, disable: $parent.isProjectDetailsLocked()"  rows="5"></textarea></td>
            <td class="partner-organisation-type">
                <select class="form-control" data-bind="addValueToOptionsIfMissing:true, options: $parent.organisations, value:data3,optionsCaption: 'Please select', disable: $parent.isProjectDetailsLocked()"></select>
                <%-- Use an if for the parent details test rather than an enable binding to avoid interaction with the enableAndClear binding --%>
                <div data-bind="if:$parent.isProjectDetailsLocked()">
                    <input class="form-control" disabled="disabled" type="text" data-bind="value:otherOrganisationType">
                </div>
                <div data-bind="if:!$parent.isProjectDetailsLocked()">
                    <input class="form-control" placeholder="Organisation type, if 'Other'" type="text" data-bind="enableAndClear: data3() == 'Other', value:otherOrganisationType">
                </div>
            </td>
            <td class="remove">
                <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()" ><i class="fa fa-remove" data-bind="click: $parent.removePartnership"></i></span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>

            <td colspan="5">
                <button type="button" class="btn btn-sm"  data-bind="disable: isProjectDetailsLocked(), click: addPartnership">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>
</div>
