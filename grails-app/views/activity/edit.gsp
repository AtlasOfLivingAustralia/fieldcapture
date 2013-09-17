<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>Print | ${activity.type} | Field Capture</title>
    </g:if>
    <g:else>
        <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
        <title>Edit | ${activity.type} | Field Capture</title>
    </g:else>

    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,jQueryImageUpload,mapWithFeatures"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
  <div id="koActivityMainBlock">
      <g:if test="${!printView}">
          <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a data-bind="click:goToProject" class="clickable">Project</a> <span class="divider">/</span></li>
                <li class="active">
                    <span data-bind="text:type"></span>
                    <span data-bind="text:startDate.formattedDate"></span><span data-bind="visible:endDate">/</span><span data-bind="text:endDate.formattedDate"></span>
                </li>
          </ul>
      </g:if>

        <div class="row-fluid title-block well well-small input-block-level">
            <div class="span12 title-attribute">
                <h1><span data-bind="click:goToProject" class="clickable">${project?.name ?: 'no project defined!!'}</span></h1>
                <g:if test="${site}">
                    <h2><span data-bind="click:goToSite" class="clickable">Site: ${site.name}</span></h2>
                </g:if>
                <g:else>
                    <select data-bind="options:transients.project.sites,optionsText:'name',optionsValue:'siteId',value:siteId,optionsCaption:'Choose a site...'"></select>
                    Leave blank if this activity is not associated with a specific site.
                </g:else>
                <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">Activity: <span data-bind="text:type"></span><i class="icon-asterisk modified-icon" data-bind="visible:dirtyFlag.isDirty" title="Has been modified"></i></h3>
            </div>
        </div>


        <div class="row-fluid">
            <div class="${mapFeatures.toString() != '{}' ? 'span9' : 'span12'}">
                <!-- Common activity fields -->
                <div class="row-fluid">
                    <div class="span6">
                        <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" />
                    </div>
                    <div class="span6">
                        <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" />
                    </div>
                </div>

                <div class="row-fluid">
                    <div class="span4 control-group">
                        <label for="startDate">Activity start date
                        <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <fc:datePicker targetField="startDate.date" name="startDate" data-validation-engine="validate[required]" size="input-medium" printable="${printView}"/>
                        </div>
                    </div>
                    <div class="span4">
                        <label for="endDate">Activity end date
                        <fc:iconHelp title="End date">Date the activity finished.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <fc:datePicker targetField="endDate.date" name="endDate" data-validation-engine="validate[future[startDate]]" size="input-medium" printable="${printView}" />
                        </div>
                    </div>
                    <div class="span4">
                        <label for="purpose">Purpose of event</label>
                        <input data-bind="value: eventPurpose" id="purpose" type="text" class="span12"/>
                    </div>
                </div>

                <div class="row-fluid">
                    <div class="span4 control-group">
                        <label for="startDate">Associated program
                        <fc:iconHelp title="Associated program">Some help with examples.</fc:iconHelp>
                        </label>
                        <input data-bind="value: associatedProgram" type="text" class="span12" data-validation-engine="validate[required]"/>
                    </div>
                    <div class="span4">
                        <label for="endDate">Sub-program
                        <fc:iconHelp title="Sub-program">Some help with examples.</fc:iconHelp>
                        </label>
                        <input data-bind="value: associatedSubProgram" type="text" class="span12" data-validation-engine="validate[required]"/>
                    </div>
                    <div class="span4">
                        <label>Stage of project</label>
                        <input data-bind="value: projectStage" type="text" class="span12" data-validation-engine="validate[required]"/>
                    </div>
                </div>
            </div>
            <g:if test="${mapFeatures.toString() != '{}'}">
                <div class="span3">
                    <div id="smallMap" style="width:100%"></div>
                </div>
            </g:if>
        </div>

        <g:if env="development" test="${!printView}">
          <div class="expandable-debug">
              <hr />
              <h3>Debug</h3>
              <div>
                  <h4>KO model</h4>
                  <pre data-bind="text:ko.toJSON($root.modelForSaving(),null,2)"></pre>
                  <h4>Activity</h4>
                  <pre>${activity}</pre>
                  <h4>Site</h4>
                  <pre>${site}</pre>
                  <h4>Sites</h4>
                  <pre>${(sites as JSON).toString()}</pre>
                  <h4>Project</h4>
                  <pre>${project}</pre>
                  <h4>Activity model</h4>
                  <pre>${metaModel}</pre>
                  <h4>Output models</h4>
                  <pre>${outputModels}</pre>
                  <h4>Map features</h4>
                  <pre>${mapFeatures.toString()}</pre>
              </div>
          </div>
        </g:if>
    </div>

    <g:each in="${metaModel?.outputs}" var="outputName">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName}}"/>
        <g:if test="${!output}">
            <g:set var="output" value="[name: outputName]"/>
        </g:if>
        <div class="output-block" id="ko${blockId}">
            <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">${outputName}<i class="icon-asterisk modified-icon" data-bind="visible:dirtyFlag.isDirty" title="Has been modified" style="display: none;"></i></h3>
            <!-- add the dynamic components -->
            <md:modelView model="${model}" site="${site}" edit="true"/>
    <r:script>
        $(function(){

            var viewModelName = "${blockId}ViewModel",
                viewModelInstance = viewModelName + "Instance";

            // load dynamic models - usually objects in a list
            <md:jsModelObjects model="${model}" site="${site}" speciesLists="${speciesLists}" edit="true" viewModelInstance="${blockId}ViewModelInstance"/>

            this[viewModelName] = function () {
                var self = this;
                self.name = "${output.name}";
                self.outputId = "${output.outputId}";
                self.data = {};
                self.transients = {};
                self.transients.dummy = ko.observable();

                // add declarations for dynamic data
                <md:jsViewModel model="${model}" edit="true" viewModelInstance="${blockId}ViewModelInstance"/>

                // this will be called when generating a savable model to remove transient properties
                self.removeBeforeSave = function (jsData) {
                    // add code to remove any transients added by the dynamic tags
                    <md:jsRemoveBeforeSave model="${model}"/>
                    delete jsData.activityType;
                    delete jsData.transients;
                    return jsData;
                };

                // this returns a JS object ready for saving
                self.modelForSaving = function () {
                    // get model as a plain javascript object
                    var jsData = ko.toJS(self);
                    // get rid of any transient observables
                    return self.removeBeforeSave(jsData);
                };

                // this is a version of toJSON that just returns the model as it will be saved
                // it is used for detecting when the model is modified (in a way that should invoke a save)
                // the ko.toJSON conversion is preserved so we can use it to view the active model for debugging
                self.modelAsJSON = function () {
                    return JSON.stringify(self.modelForSaving());
                };

                self.loadData = function (data) {
                    // load dynamic data
                    <md:jsLoadModel model="${model}"/>

                    // if there is no data in tables then add an empty row for the user to add data
                    if (typeof self.addRow === 'function' && self.rowCount() === 0) {
                        self.addRow();
                    }
                    self.transients.dummy.notifySubscribers();
                };
            };

            window[viewModelInstance] = new this[viewModelName]();
            window[viewModelInstance].loadData(${output.data ?: '{}'});

            // dirtyFlag must be defined after data is loaded
            window[viewModelInstance].dirtyFlag = ko.dirtyFlag(window[viewModelInstance], false);

            ko.applyBindings(window[viewModelInstance], document.getElementById("ko${blockId}"));

            // this resets the baseline for detecting changes to the model
            // - shouldn't be required if everything behaves itself but acts as a backup for
            //   any binding side-effects
            // - note that it is not foolproof as applying the bindings happens asynchronously and there
            //   is no easy way to detect its completion
            window[viewModelInstance].dirtyFlag.reset();

            // register with the master controller so this model can participate in the save cycle
            master.register(viewModelInstance, window[viewModelInstance].modelForSaving,
             window[viewModelInstance].dirtyFlag.isDirty, window[viewModelInstance].dirtyFlag.reset);

        });

            </r:script>
        </div>
    </g:each>

    <div class="form-actions">
        <button type="button" id="save" class="btn btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>

</div>

<!-- templates -->

<r:script>

    var returnTo = "${returnTo}";

    /* Master controller for page. This handles saving each model as required. */
    var Master = function () {
        var self = this;
        this.subscribers = [];
        // client models register their name and methods to participate in saving
        self.register = function (modelInstanceName, getMethod, isDirtyMethod, resetMethod) {
            this.subscribers.push({
                model: modelInstanceName,
                get: getMethod,
                isDirty: isDirtyMethod,
                reset: resetMethod
            });
        };
        // master isDirty flag for the whole page - can control button enabling
        this.isDirty  = function () {
            var dirty = false;
            $.each(this.subscribers, function(i, obj) {
                dirty = dirty || obj.isDirty();
            });
            return dirty;
        };
        /**
         * Makes an ajax call to save any sections that have been modified. This includes the activity
         * itself and each output.
         *
         * Modified outputs are injected as a list into the activity object. If there is nothing to save
         * in the activity itself, then the root is an object that is empty except for the outputs list.
         *
         * NOTE that the model for each section must register itself to be included in this save.
         *
         * Validates the entire page before saving.
         */
        this.save = function () {
            var activityData, outputs = [];
            if ($('#validation-container').validationEngine('validate')) {
                $.each(this.subscribers, function(i, obj) {
                    if (obj.isDirty()) {
                        if (obj.model === 'activityModel') {
                            activityData = obj.get();
                        } else {
                            outputs.push(obj.get());
                        }
                    }
                });
                if (outputs.length === 0 && activityData === undefined) {
                    alert("Nothing to save.");
                    return;
                }
                if (activityData === undefined) { activityData = {}}
                activityData.outputs = outputs;
                $.ajax({
                    url: "${createLink(action: 'ajaxUpdate', id: activity.activityId)}",
                    type: 'POST',
                    data: JSON.stringify(activityData),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        } else {
                            self.reset();
                            self.saved();
                        }
                    },
                    error: function (data) {
                        var status = data.status;
                        alert('An unhandled error occurred: ' + data.status);
                    }
                });
            }

        };
        this.saved = function () {
            document.location.href = returnTo;
        };
        this.reset = function () {
            $.each(this.subscribers, function(i, obj) {
                if (obj.isDirty()) {
                    obj.reset();
                }
            });
        };
    };

    var master = new Master();

    $(function(){

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#save').click(function () {
            master.save();
        });

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        $('#reset').click(function () {
            master.reset();
        });

        $('.edit-btn').click(function () {
            var data = ${activity.outputs},
                outputName = $(this).parent().previous().html(),
                outputId;
            // search for corresponding outputs in the activity data
            $.each(data, function (i,output) { // iterate output data in the activity to
                                               // find any matching the meta-model name
                if (output.name === outputName) {
                    outputId = output.outputId;
                }
            });
            if (outputId) {
                // build edit link
                document.location.href = fcConfig.serverUrl + "/output/edit/" + outputId +
                    "?returnTo=" + here;
            } else {
                // build create link
                document.location.href = fcConfig.serverUrl + "/output/create?activityId=${activity.activityId}" +
                    '&outputName=' + encodeURIComponent(outputName) +
                    "&returnTo=" + here;
            }

        });

        ko.bindingHandlers.editOutput = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var outputName = ko.utils.unwrapObservable(valueAccessor()),
                    activity = bindingContext.$root,
                    outputId;

                // search for corresponding outputs in the activity data
                $.each(activity.outputs, function (i,output) { // iterate output data in the activity to
                                                                  // find any matching the meta-model name
                    if (output.name === outputName) {
                        outputId = output.outputId;
                    }
                });
                if (outputId) {
                    // build edit link
                    $(element).html('Edit data');
                    $(element).attr('href', fcConfig.serverUrl + "/output/edit/" + outputId +
                        "?returnTo=" + here);
                } else {
                    // build create link
                    $(element).attr('href', fcConfig.serverUrl + '/output/create?activityId=' + activity.activityId +
                        '&outputName=' + encodeURIComponent(outputName) +
                        "&returnTo=" + here);
                }
            }
        };

        function ViewModel (act, site, project, metaModel) {
            var self = this;
            self.activityId = act.activityId;
            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate).extend({simpleDate: false});
            self.eventPurpose = ko.observable(act.eventPurpose);
            self.fieldNotes = ko.observable(act.fieldNotes);
            self.associatedProgram = ko.observable(act.associatedProgram);
            self.associatedSubProgram = ko.observable(act.associatedSubProgram);
            self.projectStage = ko.observable(act.projectStage);
            self.type = ko.observable(act.type);
            self.siteId = ko.observable(act.siteId);
            self.projectId = act.projectId;
            self.transients = {};
            self.transients.site = site;
            self.transients.project = project;
            self.transients.metaModel = metaModel || {};
            self.goToProject = function () {
                if (self.projectId) {
                    document.location.href = fcConfig.projectViewUrl + self.projectId;
                }
            };
            self.goToSite = function () {
                if (self.siteId()) {
                    document.location.href = fcConfig.siteViewUrl + self.siteId();
                }
            };
            self.modelForSaving = function () {
                // get model as a plain javascript object
                var jsData = ko.toJS(self);
                delete jsData.transients;
                return jsData;
            };
            self.modelAsJSON = function () {
                return JSON.stringify(self.modelForSaving());
            };

            self.save = function (callback, key) {
            };
            self.removeActivity = function () {
                bootbox.confirm("Delete this entire activity? Are you sure?", function(result) {
                    if (result) {
                        document.location.href = "${createLink(action:'delete',id:activity.activityId,
                            params:[returnTo:grailsApplication.config.grails.serverURL + '/' + returnTo])}";
                    }
                });
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
            self.dirtyFlag = ko.dirtyFlag(self, false);
        }


        var viewModel = new ViewModel(
            ${(activity as JSON).toString()},
            ${site ?: 'null'},
            ${project ?: 'null'},
            ${metaModel ?: 'null'});

        ko.applyBindings(viewModel,document.getElementById('koActivityMainBlock'));

        master.register('activityModel', viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset);

        var mapFeatures = $.parseJSON('${mapFeatures}');
        if(mapFeatures !=null && mapFeatures.features !== undefined && mapFeatures.features.length >0){
            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16
                },
                mapFeatures
            );
        }

    });

</r:script>
</body>
</html>