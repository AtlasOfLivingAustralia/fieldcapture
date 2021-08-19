<!-- ko stopBinding: true -->
<div id="attachDocument" class="modal fade hide" tabindex="-1" role="dialog" style="display:none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="title">Attach Document</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal validationContainer" id="documentForm">

                    <div class="control-group form-group row">
                        <label class="control-label col-form-label col-sm-3" for="documentName">Title</label>

                        <div class="col-sm-8">
                            <input id="documentName" class="form-control form-control-sm" type="text" data-bind="value:name"/>
                        </div>
                    </div>

                    <div class="control-group form-group row" data-bind="visible:roles.length > 1">
                        <label class="control-label col-form-label col-sm-3" for="documentRole">Document type</label>

                        <div class="col-sm-8">
                            <select id="documentRole" class="form-control form-control-sm" data-bind="options:roles, optionsText: 'name', optionsValue: 'id', value:role, event: {change: onRoleChange}"></select>
                        </div>
                    </div>

                    %{--<!-- ko if:stages && stages.length -->--}%
                    %{--<div class="control-group form-group row">--}%
                    %{--<label class="control-label col-form-label col-sm-3" for="documentStage">Associate to ${activityPeriodDescriptor ?: 'Stage'}</label>--}%
                    %{--<div class="col-sm-8">--}%
                    %{--<select id="documentStage" class="form-control form-control-sm" data-bind="options:stages, optionsCaption: 'Please select', value:stage" data-validation-engine="validate[funcCall[validateReportAssociation],required]"></select>--}%
                    %{--</div>--}%
                    %{--</div>--}%
                    %{--<!-- /ko -->--}%

                    <!-- ko if:settings.reports && settings.reports.length -->
                    <div class="control-group form-group row">
                        <label class="control-label col-form-label col-sm-3" for="associatedReport">Associate to report</label>
                        <div class="col-sm-8">
                            <select id="associatedReport" class="form-control form-control-sm" data-bind="options:settings.reports, optionsText:'name', optionsValue:'reportId', optionsCaption: 'Please select', value:reportId" data-validation-engine="validate[funcCall[validateReportAssociation],required]"></select>
                        </div>
                    </div>
                    <!-- /ko -->

                    <div class="control-group form-group row">
                        <label class="control-label col-form-label col-sm-3" for="documentAttribution">Attribution</label>

                        <div class="col-sm-8">
                            <input id="documentAttribution" class="form-control form-control-sm" type="text" data-bind="enable: hasPublicRole, value:attribution"/>

                        </div>
                    </div>

                    <div class="control-group form-group row">
                        <label class="control-label col-form-label col-sm-3" for="documentLicense">License</label>

                        <div class="col-sm-8">
                            <input id="documentLicense" class="form-control form-control-sm" type="text" data-bind="enable: hasPublicRole, value:license"/>
                        </div>
                    </div>

                    <div class="control-group form-group row" data-bind="visible: embeddedVideoVisible()">
                        <label class="control-label col-form-label col-sm-3" for="embeddedVideo">
                            Embed video
                        </label>
                        <div class="col-sm-8">
                            <textarea placeholder="Example: <iframe width='560' height='315' src='https://www.youtube.com/embed/j1bR-0XBfcs' frameborder='0' allowfullscreen></iframe> (Allowed host: Youtube, Vimeo, Ted, Wistia.)"
                                      class="form-control form-control-sm" data-bind="value: embeddedVideo,  valueUpdate: 'keyup'" rows="3" id="embeddedVideo" type="text">
                            </textarea>
                        </div>
                    </div>

                    <div class="control-group form-group row" data-bind="visible:settings.showSettings">
                        <label class="control-label col-form-label col-sm-3" for="public">Settings</label>
                        <div class="col-sm-8">
                            <label class="checkbox form-check-label" for="public">
                                <input id="public" type="checkbox" data-bind="checked:public, enable: hasPublicRole"/>
                                make this document public on the project documents tab
                            </label>
                        </div>

                    </div>

                    <div class="control-group form-group row" data-bind="visible:thirdPartyConsentDeclarationRequired">
                        <label for="thirdPartyConsentDeclarationMade" class="control-label col-form-label col-sm-3">Privacy declaration</label>
                        <div id="thirdPartyConsentDeclarationMade" class="col-sm-8">
                            <label id="thirdPartyDeclarationText" class="checkbox form-check-label" for="thirdPartyConsentDeclarationMade">
                                <input id="thirdPartyConsentCheckbox" type="checkbox" name="thirdPartyConsentDeclarationMade" data-validation-engine="validate[required]" data-bind="checked:thirdPartyConsentDeclarationMade">
                                <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.THIRD_PARTY_PHOTO_CONSENT_DECLARATION}"/>
                            </label>
                        </div>
                    </div>


                    <div data-bind="visible: !embeddedVideoVisible()">
                        <div class="control-group form-group row"  data-bind="visible:false">
                            <label class="control-label col-form-label col-sm-3" for="documentFile">Image settings</label>
                            <div class="col-sm-8">
                                <label class="checkbox form-check-label" for="mainImage">
                                    <input id="mainImage" type="checkbox" data-bind="enable:type() == 'image' && public() && role() =='information', checked: isPrimaryProjectImage"/>
                                    use as the main project image
                                </label>
                            </div>
                        </div>


                        <div class="control-group form-group row">
                            <label class="control-label col-form-label col-sm-3" for="documentFile">File</label>

                            <div class="col-sm-8">

                                <span class="btn fileinput-button">
                                    <i class="fa fa-plus"></i>
                                    <input id="documentFile" type="file" name="files"/>
                                    <span data-bind="text:fileButtonText">Attach file</span>
                                </span>
                            </div>
                        </div>

                        <div class="control-group form-group row">
                            <label class="control-label col-form-label col-sm-3" for="fileLabel"></label>

                            <div class="col-sm-8">

                                <span data-bind="visible:filename()" class="input-group">
                                    <input id="fileLabel" class="form-control form-control-sm" type="text" readonly="readonly" data-bind="value:fileLabel"/>
                                    <button class="btn" data-bind="click:removeFile">
                                        <span class="fa fa-remove"></span>
                                    </button>
                                </span>
                            </div>
                        </div>

                        <div class="control-group form-group row" data-bind="visible:hasPreview">
                            <label class="control-label col-form-label col-sm-3">Preview</label>

                            <div id="preview" class="controls col-sm-8"></div>
                        </div>

                        <div class="control-group form-group row" data-bind="visible:progress() > 0">
                            <label class="control-label col-form-label col-sm-3">Progress</label>

                            <div class="col-sm-8">
                                <div id="progress" class="controls progress progress-info active input-small"
                                     data-bind="visible:!error() && progress() <= 100, css:{'progress-info':progress()<100, 'progress-success':complete()}">
                                    <div class="bar progress-bar" data-bind="style:{width:progress()+'%'}, css:{'bg-info':progress()<100, 'bg-success':complete(), 'bg-error':error()}"></div>
                                </div>
                            </div>
                            <div class="col-sm-3" data-bind="visible:complete()"></div>
                            <div class="col-sm-8">
                                <div id="successmessage" class="controls" data-bind="visible:complete()">
                                    <span class="alert alert-success">File successfully uploaded</span>
                                </div>
                            </div>
                            <div class="col-sm-3" data-bind="visible:error()"></div>
                            <div class="col-sm-8">
                                <div id="message" class="controls" data-bind="visible:error()">
                                    <span class="alert alert-danger" data-bind="text:error"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer control-group">
                <div class="controls">
                    <button type="button" class="btn btn-sm btn-success" name="uploadingDocument"
                            data-bind="enable:saveEnabled, click:save, visible:!complete(), attr:{'title':saveHelp}">Save</button>
                    <button class="btn btn-sm btn-danger" data-bind="click:cancel, visible:!complete()">Cancel</button>
                    <button class="btn btn-sm btn-danger" data-bind="click:close, visible:complete()">Close</button>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- /ko -->
