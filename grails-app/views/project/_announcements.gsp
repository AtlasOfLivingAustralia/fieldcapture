<div class="row-fluid space-after" data-bind="if: isProjectDetailsLocked()">
    <div>
        <div id="risks-announcements" class="validationEngineContainer well well-small">
            <label>
            <b>Projects Announcements
                <fc:iconHelp title="Projects Announcements">This section provides Grantee’s a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.</fc:iconHelp>
            </b>
            </label>

            <table class="table" style="width: 100%;" >
                <thead>
                <tr>
                    <th></th>
                    <th class="required">Type of event
                    <fc:iconHelp title="Type of event ">
                        For category 1, funding announcements -  include all funding announcements including: opening of grant rounds, EOI rounds, tenders, and announcements of successful applicants.
                        For category 2, non-funding opportunities -  include all non-funding opportunities such as: field days, community planting day, workshops and other community engagement or sustainable and profitable agriculture activities
                    </fc:iconHelp>
                    </th>
                    <th>Name of funding announcement or non-funding opportunity
                    <fc:iconHelp title="Name of funding announcement or non-funding opportunity">
                        Enter the name of your funding announcement or non-funding opportunity, for example ‘The Dandenong Ranges bushfire recovery community grants’ or ‘Improving wetlands and woodlands programme  EOI’ or for a non-funding opportunity– ‘the Corangamite community farm planning day’
                    </fc:iconHelp>
                    </th>
                    <th>Scheduled date for:<br/>
                    1 - Announcing the opening of the grant round;<br/>
                    2 - Non-funding opportunities
                    <fc:iconHelp title="Scheduled date ">
                        Enter the scheduled date for the funding announcement or other non-funding opportunity. If the date is TBC, please enter an indicative date and provide further explanation in the ‘Information about this funding announcement or non-funding opportunity’ column
                    </fc:iconHelp>
                    </th>
                    <th>When will successful applicants be announced
                    <fc:iconHelp title="When will successful applicants be announced">
                        If this is a funding announcement, please provide a two week window of when you anticipate the announcement of the successful funding recipients will occur, for example “12/07/2015 – 26/07/2015”
                    </fc:iconHelp>
                    </th>
                    <th>Total value of funding announcement
                    <fc:iconHelp title="Total value of funding announcement">
                        Provide a total dollar figure of the specific funding announcement eg $10,000 (GST exclusive).
                    </fc:iconHelp>
                    </th>
                    <th>Information about this funding announcement or non-funding opportunity
                    <fc:iconHelp title="Information about this funding announcement or non-funding opportunity">
                        (150 word limit)
                        Provide a description of the funding announcement or the non-funding opportunity, i.e. ‘grants from $x - $y are available under the x local programme to undertake A to achieve B’, or ‘targeted EOIs are being invited under the x local programme to undertake A to achieve B. Please note - Information about the successful applicants will be collected separately.
                        For non-funding opportunities, please provide information that sets the context for the event, ie ‘a work shop will be held at location x to showcase how sustainable agricultural processes can benefit riparian health and improved water quality, farm sustainability and profit’ or ‘a field day will be held at x to provide community with access to information on revegetation, soil health and/or sustainable agriculture activities’.
                    </fc:iconHelp>
                    </th>

                    <th></th>
                </tr>
                </thead>
                <tbody data-bind="foreach : details.events">
                <tr>
                    <td width="2%">  <span data-bind="text:$index()+1"></span></td>
                    <td width="12%"> <select data-bind="value:type, disable: !$parent.isProjectDetailsLocked()" style="text-align: center; width: 90%;" data-errormessage="*This field is required. If you do not have any announcement information available yet then please delete this row via the X icon" class="validate[required]" data-validation-engine="validate[required]"><option value="">Please select</option><option>1: funding announcements</option><option>2: non-funding opportunities</option></select></td>
                    <td width="18%"> <textarea style="width: 97%;" rows="2"  class="input-xlarge"  data-bind="value: name, disable: !$parent.isProjectDetailsLocked()"></textarea></td>
                    <td width="12%"> <div style="text-align: center; "><input data-bind="datepicker:scheduledDate.date, disable: !$parent.isProjectDetailsLocked()" type="text" style="text-align: center; width: 90%;"/></div></td>
                    <td width="12%"> <div style="text-align: center; "><input data-bind="value:grantAnnouncementDate, disable: !$parent.isProjectDetailsLocked()" type="text" style="text-align: center; width: 90%;"/></div></td>
                    <td width="12%"> <div style="width:90%" class="input-append input-prepend"><span class="add-on">$</span><input type="text" class="form-control" style="width:3em;" data-bind="value:funding, disable: !$parent.isProjectDetailsLocked()" data-validation-engine="validate[custom[number]]"><span class="add-on">.00</span></div></td>
                    <td width="28%"> <textarea maxlength="1000" style="width: 97%;" rows="3"  class="input-xlarge"  data-bind="value: description, disable: !$parent.isProjectDetailsLocked()"></textarea></td>
                    <td width="4%"> <span><i class="icon-remove" data-bind="click: $parent.removeEvents"></i></span></td>

                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td colspan="2" style="text-align:left;">
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