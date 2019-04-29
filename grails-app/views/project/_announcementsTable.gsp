
<g:set var="disableCondition" value="${disableConditionPrefix}\$parent.isProjectDetailsLocked()"/>
<div class="well well-small">
    <label>
        <b>Projects Announcements
        <fc:iconHelp title="Projects Announcements">This section provides Grantee’s a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.</fc:iconHelp>
        </b>
    </label>

    <table class="announcements-table table" style="width: 100%;" >
        <thead>
        <tr>
            <th></th>
            <th class="required"><g:message code="announcements.type"/>
            <fc:iconHelp helpTextCode="announcements.type.help"/>
            </th>
            <th><g:message code="announcements.type"/>
            <fc:iconHelp helpTextCode="announcements.name.help"/>
            </th>
            <th><g:message code="announcements.scheduledDate"/>
                <fc:iconHelp helpTextCode="announcements.scheduledDate.help"/>
            </th>
            <th><g:message code="announcements.when"/>
                <fc:iconHelp helpTextCode="announcements.when.help"/>
            </th>
            <th><g:message code="announcements.funding"/>
                <fc:iconHelp helpTextCode="announcements.funding.help"/>
            </th>
            <th><g:message code="announcements.description"/>
                <fc:iconHelp helpTextCode="announcements.description.help"/>
            </th>

            <th></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.events">
        <tr>
            <td width="2%">  <span data-bind="text:$index()+1"></span></td>
            <td width="12%"> <select data-bind="value:type, disable: ${disableCondition}" style="text-align: center; width: 90%;" data-errormessage="*This field is required. If you do not have any announcement information available yet then please delete this row via the X icon" class="validate[required]" data-validation-engine="validate[required]"><option value="">Please select</option><option>1: funding announcements</option><option>2: non-funding opportunities</option></select></td>
            <td width="18%"> <textarea style="width: 97%;" rows="2"  class="input-xlarge"  data-bind="value: name, disable: ${disableCondition}"></textarea></td>
            <td width="12%"> <div style="text-align: center; "><input data-bind="datepicker:scheduledDate.date, disable: ${disableCondition}" type="text" style="text-align: center; width: 90%;"/></div></td>
            <td width="12%"> <div style="text-align: center; "><input data-bind="value:grantAnnouncementDate, disable: ${disableCondition}" type="text" style="text-align: center; width: 90%;"/></div></td>
            <td width="12%"> <div style="width:90%" class="input-append input-prepend"><span class="add-on">$</span><input type="text" class="form-control" style="width:3em;" data-bind="value:funding, disable: ${disableCondition}" data-validation-engine="validate[custom[number]]"><span class="add-on">.00</span></div></td>
            <td width="28%"> <textarea maxlength="1000" style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: description, disable: ${disableCondition}"></textarea></td>
            <td width="4%"> <span><i class="icon-remove" data-bind="click: $parent.removeEvents"></i></span></td>

        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td colspan="2" style="text-align:left;">
                <button type="button" class="btn btn-small" data-bind="click: addEvents, disable:${disableConditionPrefix}isProjectDetailsLocked()">
                    <i class="icon-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>
    </table>

</div>
