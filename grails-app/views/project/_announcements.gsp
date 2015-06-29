<div class="row-fluid space-after" data-bind="if: isProjectDetailsLocked()">
    <div>
        <div id="announcements" class="well well-small">
            <label>
            <b>Projects Announcements
                <fc:iconHelp title="Projects Announcements">This section provides Grantee’s a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.</fc:iconHelp>
            </b>
            </label>

            <table class="table" style="width: 100%;" >
                <thead>
                <tr>
                    <th></th>
                    <th>Name of grant round or other event/announcement
                        <fc:iconHelp title="Name of grant round or other event/announcement ">
                            TBA
                        </fc:iconHelp>
                    </th>
                    <th>Proposed Date of event/<br/>announcement (if known)
                    <fc:iconHelp title="Proposed Date of event/announcement (if known) ">
                            Please indicate if this date is confirmed (C) or whether it is to be confirmed (TBC) in the description field.
                        </fc:iconHelp>
                    </th>
                    <th>Type of event/<br/>announcement
                    <fc:iconHelp title="Type of event ">
                        TBA
                    </fc:iconHelp>
                    </th>
                    <th>Description of the event
                    <fc:iconHelp title="Description of the event ">
                            A description of the opportunity, including location, the type of event (e.g a launch, a media release, an event, a workshop, etc) the number of people expected to attend the event, the proposed duration of the event and any attendees of note.    Is the event in the same electorate as the project? If not, please state which electorate this event is in.
                        </fc:iconHelp>
                    </th>

                    <th>Value of funding round
                    <fc:iconHelp title="Value of funding round ">
                        TBA
                    </fc:iconHelp>
                    </th>

                    <th></th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.events">
                <tr>
                    <td width="2%">  <span data-bind="text:$index()+1"></span></td>
                    <td width="20%"> <textarea style="width: 97%;" rows="2"  class="input-xlarge"  data-bind="value: name, disable: $parent.isProjectDetailsLocked()"></textarea></td>
                    <td width="10%"> <div style="text-align: center; "><input data-bind="datepicker:scheduledDate.date, disable: $parent.isProjectDetailsLocked()" type="text" style="text-align: center; width: 90%;"/></div></td>
                    <td width="14%"> <select data-bind="value:type" style="text-align: center; width: 90%;" data-validation-engine="validate[required]"><option value="">Please select</option><option>Grant opening</option><option>Announce successful applicants</option><option>Other event/announcement</option></select></td>
                    <td width="40%"> <textarea style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: description"></textarea></td>
                    <td width="10%"> <input type="text" class="form-control" style="width:90%" data-bind="value:funding" data-validation-engine="validate[custom[number]]"></td>
                    <td width="4%"> <span data-bind="if: $index()" ><i class="icon-remove" data-bind="click: $parent.removeEvents"></i></span></td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td colspan="0" style="text-align:left;">
                        <button type="button" class="btn btn-small" data-bind="click: addEvents">
                            <i class="icon-plus"></i> Add a row</button></td>
                </tr>
                </tfoot>
            </table>
            <br>
            <button type="button" data-bind="click: saveAnnouncements" id="project-announcements-save" class="btn btn-primary">Save changes</button>
        </div>
    </div>
</div>