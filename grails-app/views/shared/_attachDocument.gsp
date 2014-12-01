<r:require module="attachDocuments"/>
<!-- ko stopBinding: true -->
<div id="attachDocument" class="modal fade" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="title">Attach Document</h4>
            </div>

            <div class="modal-body">
                <form class="form-horizontal" id="documentForm">

                    <div class="control-group">
                        <label class="control-label" for="documentName">Title</label>

                        <div class="controls">
                            <input id="documentName" type="text" data-bind="value:name"/>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="documentAttribution">Attribution</label>

                        <div class="controls">
                            <input id="documentAttribution" type="text" data-bind="value:attribution"/>

                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label class="control-label" for="documentRole">Document type</label>

                        <div class="controls">
                            <select style="width: 97%;" data-bind="options:roles, optionsText: 'name', optionsValue: 'id', value:role, event: {change: onRoleChange}"></select>
                        </div>
                    </div>
                    
                    <div class="control-group" >
                        <label class="control-label" for="documentStage">Associate to Stage</label>
                        <div class="controls">
                            <select style="width: 35%;" data-bind="options:stages, optionsCaption: 'Please select', value:stage"></select>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="documentLicense">License</label>

                        <div class="controls">
                            <input id="documentLicense" type="text" data-bind="value:license"/>

                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="public">Settings</label>
                        <div class="controls">
                            <label class="checkbox" for="public">
                                <input id="public" type="checkbox" data-bind="checked:public, enable: role() =='information'"/>
                                make this document viewable by everyone
                            </label>
                        </div>

                    </div>

                    <div class="control-group">
                        <label class="control-label" for="documentFile">File</label>

                        <div class="controls">

                            <span class="btn fileinput-button">
                                <i class="icon-plus"></i>
                                <input id="documentFile" type="file" name="files"/>
                                <span data-bind="text:fileButtonText">Attach file</span>
                            </span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="documentFile">Image settings</label>
                        <div class="controls">
                            <label class="checkbox" for="documentRole">
                                <input id="documentRole" type="checkbox" data-bind="enable:type() == 'image' && public() && role() =='information', checked: isPrimaryProjectImage"/>
                                use as the main project image
                            </label>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="fileLabel"></label>

                        <div class="controls">

                            <span data-bind="visible:filename()">
                                <input id="fileLabel" type="text" readonly="readonly" data-bind="value:fileLabel"/>
                                <button class="btn" data-bind="click:removeFile">
                                    <span class="icon-remove"></span>
                                </button>
                            </span>
                        </div>
                    </div>

                    <div class="control-group" data-bind="visible:hasPreview">
                        <label class="control-label">Preview</label>

                        <div id="preview" class="controls"></div>
                    </div>

                    <div class="control-group" data-bind="visible:progress() > 0">
                        <label for="progress" class="control-label">Progress</label>

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
                    </div>

                    <g:if test="${grailsApplication.config.debugUI}">
                        <div class="expandable-debug">
                            <h3>Debug</h3>
                            <div>
                                <h4>Document model</h4>
                                <pre class="row-fluid" data-bind="text:toJSONString()"></pre>
                            </div>
                        </div>
                    </g:if>

                </form>
            </div>
            <div class="modal-footer control-group">
                <div class="controls">
                    <button type="button" class="btn btn-success"
                            data-bind="enable:filename() && progress() === 0 && !error(), click:save, visible:!complete()">Save</button>
                    <button class="btn" data-bind="click:cancel, visible:!complete()">Cancel</button>
                    <button class="btn" data-bind="click:close, visible:complete()">Close</button>

                </div>
            </div>

        </div>
    </div>
</div>
<!-- /ko -->

