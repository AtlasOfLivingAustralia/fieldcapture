<g:if test="${!printView}">
<div data-bind="visible:!site">
    No site has been selected.  <g:if test="${!readOnly}">To add photos to this activity, select a site.</g:if>
</div>

<div data-bind="visible:site">
    <div data-bind="visible:photoPoints().length == 0">
       <p>There are no photo points defined for the selected site.  <g:if test="${!readOnly}">To create a photo point, use the "New Photo Point" button below.</g:if></p>
    </div>

    <g:if test="${!readOnly}">
    All points of interest associated with the site will display here. Please only attach photos that have been taken from your site photo-point(s).
        <br/><b>Please note</b> that the photograph must be taken from the exact same location, direction and when possible at the same month and time of year
    </g:if>
    <table id="photoPointTable" class="table table-bordered photoPoints imageList">
        <thead>
            <tr>
                <th style="width:20%">Photo point location:</th>
                <th style="width:70%">Photo(s)</th>
            </tr>

            <tbody data-bind="foreach:photoPoints">
                <tr>
                    <td data-bind="template:{name:template}">

                    </td>
                    <td>
                        <table class="table">
                            <tbody data-bind="foreach:photos">
                                <tr data-bind="visible:status() !== 'deleted'">
                                    <td style="width:40%;">
                                        <a data-bind="attr:{href:url, alt:name, title:'[click to expand] ' + (name() || filename()), 'data-fancybox-title':name()||filename()}" target="_photo" rel="gallery"><img data-bind="attr:{src:thumbnailUrl}"></a>
                                    </td>
                                    <td style="width:45%;" data-bind="template:{name:'${readOnly?'photoViewTemplate':'photoEditTemplate'}'}">

                                    </td>
                                    <td style="text-align: right; width:15%">
                                        <g:if test="${!readOnly}">
                                            <a class="btn" data-bind="click:$parent.removePhoto"><i class="fa fa-remove"></i> Remove</a>
                                        </g:if>
                                    </td>
                                </tr>

                            </tbody>
                            <g:if test="${!readOnly}">
                            <tfoot data-bind="photoPointUpload:uploadConfig">
                                <tr data-bind="visible:!complete()">
                                    <td style="border-bottom: 0px;">
                                        <span class="preview"></span>

                                    </td>
                                        <td >

                                            <label for="progress" class="control-label">Uploading Photo...</label>

                                            <div id="progress" class="controls progress progress-info active input-large"
                                                 data-bind="visible:!error() && progress() <= 100, css:{'progress-info':progress()<100, 'progress-success':complete()}">
                                                <div class="bar" data-bind="style:{width:progress()+'%'}"></div>
                                            </div>

                                            <div id="successmessage" class="controls" data-bind="visible:complete()">
                                                <span class="alert alert-success">File successfully uploaded</span>
                                            </div>

                                            <div id="message" class="controls" data-bind="visible:error()">
                                                <span class="alert alert-error" data-bind="text:error"></span>
                                            </div>
                                        </td>

                                </tr>

                                <tr>
                                    <td colspan="3" >
                                        <span class="btn btn-sm fileinput-button"><i class="fa fa-plus"></i> <input type="file" name="files"><span>Attach Photo</span></span>

                                    </td>
                                </tr>

                            </tfoot>
                            </g:if>
                        </table>
                    </td>

                </tr>
            </tbody>
            <g:if test="${!readOnly}">
            <tfoot>
                <tr>
                    <td>
                        <button type="button" class="btn btn-sm" data-bind="click:addPhotoPoint"><i class="fa fa-plus"></i> New Photo Point</button>
                    </td>
                    <td>
                        <div data-bind="photoPointUpload:newPhotoPointFromPhotoUploadConfig"> <span class="btn fileinput-button"><i class="fa fa-plus"></i> <input type="file" name="files" accept="image/jpeg,.jpg,.jpeg"><span>New Photo Point Using GPS Information from a Photo</span></span></div>
                    </td>
                </tr>
            </tfoot>
            </g:if>
        </thead>


    </table>
</div>


<!-- ko stopBinding:true -->
    <div id="edit-photopoint" class="modal fade validationEngineContainer" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="model-title"><h3 data-bind="text:title"></h3></div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</button>

                </div>
                <div class="modal-body">
                    <p>
                        This photo point will be <span data-bind="text:newOrEditText"></span> when you press submit and
                        <span data-bind="text:newOrEditText2">the updates</span> will remain even if you press "Cancel" on the activity form.
                    </p>
                    <div class="row">

                        <div class="col-sm-6">
                            <div id="photoPointMapHolder" class="smallMap w-100 h-100"></div>
                        </div>

                        <div class="col-sm-6">
                            <div class="clearfix">
                                <p><strong>Enter the details of the new photo point below.</strong></p>
                                %{--<p>If you attach a photo, the latitude and longitude will be populated from the information in the photo, if available.</p>--}%
                            </div>

                            <div>
                                <div class="row form-group required">
                                    <label for="photoPointName" class="col-form-label col-sm-4">Name: </label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control form-control-sm" id="photoPointName" data-bind="value:photoPoint.name" data-validation-engine="validate[required]">
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <label for="photoPointDescription" class="col-form-label col-sm-4">Description: </label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control form-control-sm" id="photoPointDescription" data-bind="value:photoPoint.description">
                                    </div>
                                </div>
                                <div class="row form-group required">
                                    <label class="col-form-label col-sm-4" for="photoPointLatitude">Latitude: </label>
                                    <div class="col-sm-8">
                                        <input type="text" data-bind="value:photoPoint.geometry.decimalLatitude" class="form-control form-control-sm" id="photoPointLatitude" data-validation-engine="validate[required,custom[number],min[-90],max[0]]">
                                    </div>
                                </div>

                                <div class="row form-group required">
                                    <label for="photoPointLongitude" class="col-form-label col-sm-4">Longitude: </label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control form-control-sm" id="photoPointLongitude" data-bind="value:photoPoint.geometry.decimalLongitude" data-validation-engine="validate[required,custom[number],min[-180],max[180]]">
                                    </div>
                                </div>

                                <div class="row form-group required">
                                    <label for="photoPointBearing" class="col-form-label col-sm-4">Bearing: </label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control form-control-sm" id="photoPointBearing" data-bind="value:photoPoint.geometry.bearing" data-validation-engine="validate[required]">
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-sm btn-success" data-bind="click:save" aria-hidden="true">Submit</button>
                    <button class="btn btn-sm btn-danger" data-bind="click:cancel" aria-hidden="true">Cancel</button>
                </div>
            </div>

        </div>

    </div>
<!-- /ko -->

<script type="text/html" id="readOnlyPhotoPoint">

    <div><b><span data-bind="text:photoPoint.name"></span></b></div>
    <div><span data-bind="text:photoPoint.description"></span></div>

    <div>Latitude : <b><span data-bind="text:photoPoint.geometry.decimalLatitude"></span></b></div>
    <div>Longitude: <b><span data-bind="text:photoPoint.geometry.decimalLongitude"></span></b></div>
    <div>Bearing  : <b><span data-bind="text:photoPoint.geometry.bearing"></span></b></div>
</script>

<script type="text/html" id="editablePhotoPoint">
    <div class="floatright">
        <a class="btn" data-bind="click:$parent.editPhotoPoint"><i class="fa fa-edit"></i> Edit</a>
        <a class="btn" data-bind="click:$parent.removePhotoPoint"><i class="fa fa-remove"></i> Remove</a>
    </div>
    <div><b><span data-bind="text:photoPoint.name"></span></b></div>
    <div><span data-bind="text:photoPoint.description"></span></div>

    <div>Latitude : <b><span data-bind="text:photoPoint.geometry.decimalLatitude"></span></b></div>
    <div>Longitude: <b><span data-bind="text:photoPoint.geometry.decimalLongitude"></span></b></div>
    <div>Bearing  : <b><span data-bind="text:photoPoint.geometry.bearing"></span></b></div>

</script>
<script id="photoEditTemplate" type="text/html">
<div class="form-horizontal">
    <div class="row control-group required">
        <label for="name" class="col-sm-2 control-label">Title: </label>
        <input type="text" class="col-sm-5 form-control form-control-sm" id="name" data-bind="value:name" data-validation-engine="validate[required]">
    </div>
    <div class="row control-group required">
        <label for="dateTaken" class="control-label col-sm-2">Date Taken: <i class="fa fa-question-circle" data-bind="popover:{container:'body', content:'Please ensure that this information is accurate and the date that the photograph was taken, not the date it was uploaded (unless they are the same date).', placement:'top'}">&nbsp;</i></label>
        <div class="input-group col-sm-5 dateInput"><fc:datePicker size="input-small" bs4="true" class="form-control form-control-sm" targetField="dateTaken.date" id="dateTaken" name="dateTaken" data-validation-engine="validate[required]"/></div>
    </div>
    <div class="row control-group">
        <label for="attribution" class="control-label col-sm-2">Attribution: <i class="fa fa-question-circle" data-bind="popover:{content:'The name of the photographer', placement:'top'}">&nbsp;</i></label>
        <input type="text" class="form-control form-control-sm col-sm-5" id="attribution" data-bind="value:attribution">
    </div>
    <div class="row control-group">
        <label for="notes" class="control-label col-sm-2">Notes: <i class="fa fa-question-circle" data-bind="popover:{content:'Additional notes you would like to supply regarding the photo point or photograph.', placement:'top'}">&nbsp;</i></label>
        <input type="text" class="form-control form-control-sm col-sm-5" id="notes" data-bind="value:notes">
    </div>

    <div class="row control-group readonly">
        <label class="control-label col-sm-2">File Name: </label>
        <label style="padding-top:5px;" class="col-sm-5" data-bind="text:filename"></label>
    </div>
    <div class="row control-group readonly">
        <label class="control-label col-sm-2">File Size: </label>
        <label style="padding-top:5px;" class="col-sm-5" data-bind="text:formattedSize"></label>
    </div>
</div>
</script>

<script id="photoViewTemplate" type="text/html">
<div class="control-group">
    <label class="control-label">Title: <span data-bind="text:name"></span></label>
</div>
<div class="control-group">
    <label class="control-label">Date Taken: <span data-bind="text:dateTaken"></span></label>
</div>
<div class="control-group">
    <label class="control-label">Attribution : <span data-bind="text:attribution"></span></label>
</div>
<div class="control-group">
    <label class="control-label">Notes: <span data-bind="text:notes"></span></label>
</div>

<div class="control-group readonly">
    <label class="control-label">File Name: <span data-bind="text:filename"></span></label>
</div>
<div class="control-group readonly">
    <label class="control-label">File Size: <span data-bind="text:formattedSize"></span></label>
</div>
</script>
</g:if>
