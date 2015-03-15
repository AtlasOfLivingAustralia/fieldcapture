<div class="row-fluid space-after" data-bind="if: isProjectDetailsLocked()">
    <div>
        <div id="keq" class="well well-small">
            <label>
            <b>Projects Announcements
                <fc:iconHelp title="Projects Announcements">This section provides Grantee’s a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.</fc:iconHelp>
            </b>
            </label>

            <table class="table" style="width: 100%;" >
                <thead>
                <tr>
                    <th></th>
                    <th>Proposed event/announcement
                        <fc:iconHelp title="Proposed event/ announcement">
                            Title of the event, for example: '  xxxx Region / CMA Community Seed Planting Day.'
                        </fc:iconHelp>
                    </th>
                    <th>Proposed Date of event/<br/>announcement (if known)
                    <fc:iconHelp title="Proposed Date of event/announcement (if known) ">
                            Please indicate if this date is confirmed (C) or whether it is to be confirmed (TBC) in the description field.
                        </fc:iconHelp>
                    </th>
                    <th>Description of the event
                    <fc:iconHelp title="Description of the event ">
                            A description of the opportunity, including location, the type of event (e.g a launch, a media release, an event, a workshop, etc) the number of people expected to attend the event, the proposed duration of the event and any attendees of note.    Is the event in the same electorate as the project? If not, please state which electorate this event is in.
                        </fc:iconHelp>
                    </th>

                    <th> <span style="word-wrap: break-word">Will there be, or do you <br/>intend there to be, media <br/> involvement in this event?</span>
                        <fc:iconHelp title="Will there be, or do you intend there to be, media involvement in this event? Y/N">
                            Will traditional forms of media be involved, such as TV, radio and print media? Have you already organised this media to attend? What about social  media opportunities?
                        </fc:iconHelp>
                    </th>

                    <th></th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.events">
                <tr>
                    <td width="2%">  <span data-bind="text:$index()+1"></span></td>
                    <td width="20%"> <textarea style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: name"></textarea></td>
                    <td width="10%"> <div style="text-align: center; "><input data-bind="datepicker:scheduledDate.date" type="text" style="text-align: center; width: 75%;"/></div></td>
                    <td width="54%"> <textarea style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: description"></textarea></td>
                    <td width="10%"> <select class="form-control" data-validation-engine="validate[required]" data-bind="options: $parent.mediaOptions, optionsText:'name', optionsValue:'id', value:media, optionsCaption:'-- Please select --'" ></select> </td>
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