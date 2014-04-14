<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>

    <meta name="layout" content="mobile"/>

    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        bieUrl: "${grailsApplication.config.bie.baseURL}",
        speciesProfileUrl: "${createLink(controller: 'proxy', action: 'speciesProfile')}"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,jQueryFileUploadUI,mapWithFeatures,attachDocuments,species,amplify"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
<div id="koActivityMainBlock">

    <div class="row-fluid">
        <div class="${mapFeatures.toString() != '{}' ? 'span9' : 'span12'}">
            <!-- Common activity fields -->

            <div class="row-fluid space-after">
                <div class="span6">
                    <label for="theme">Major theme</label>
                    <select id="theme" data-bind="value:mainTheme, options:transients.themes, optionsCaption:'Choose..'" class="input-xlarge">
                    </select>
                </div>
                <div class="span6">
                    <label class="for-readonly">Description</label>
                    <span class="readonly-text" data-bind="text:description"></span>
                </div>
            </div>

            <div class="row-fluid space-after">

                <div class="span6">
                    <label class="for-readonly inline">Activity progress</label>
                    <button type="button" class="btn btn-small"
                            data-bind="css: {'btn-warning':progress()=='planned','btn-success':progress()=='started','btn-info':progress()=='finished','btn-danger':progress()=='deferred','btn-inverse':progress()=='cancelled'}"
                            style="line-height:16px;cursor:default;color:white">
                        <span data-bind="text: progress"></span>
                    </button>
                </div>
            </div>

            <div class="row-fluid space-after">
                <div class="span6">
                    <label class="for-readonly inline">Planned start date</label>
                    <span class="readonly-text" data-bind="text:plannedStartDate.formattedDate"></span>
                </div>
                <div class="span6">
                    <label class="for-readonly inline">Planned end date</label>
                    <span class="readonly-text" data-bind="text:plannedEndDate.formattedDate"></span>
                </div>
            </div>

            <div class="row-fluid">
                <div class="span6 required">
                    <label for="startDate"><b>Actual start date</b>
                        <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
                    </label>


                    <div class="input-append">
                        <fc:datePicker targetField="startDate.date" name="startDate" data-validation-engine="validate[required]"/>
                    </div>

                </div>
                <div class="span6 required">
                    <label for="endDate"><b>Actual end date</b>
                        <fc:iconHelp title="End date">Date the activity finished.</fc:iconHelp>
                    </label>

                    <div class="input-append">
                        <fc:datePicker targetField="endDate.date" name="endDate" data-validation-engine="validate[future[startDate]]" />
                    </div>

                </div>
            </div>


        </div>
        <g:if test="${mapFeatures.toString() != '{}'}">
            <div class="span3">
                <div id="smallMap" style="width:100%"></div>
            </div>
        </g:if>
    </div>

</div>

<!-- ko stopBinding: true -->
<g:each in="${metaModel?.outputs}" var="outputName">
    <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
    <g:set var="model" value="${outputModels[outputName]}"/>
    <md:modelStyles model="${model}" edit="true"/>
    <div class="output-block" id="ko${blockId}">
        <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">${outputName}<i class="icon-asterisk modified-icon" data-bind="visible:dirtyFlag.isDirty" title="Has been modified" style="display: none;"></i></h3>
        <!-- add the dynamic components -->
        <md:modelView model="${model}" site="${site}" edit="true" output="${outputName}" />
        <r:script>
        $(function(){
console.log("something!");

            var viewModelName = "${blockId}ViewModel",
                viewModelInstance = viewModelName + "Instance";

            // load dynamic models - usually objects in a list
            <md:jsModelObjects model="${model}" site="${site}" speciesLists="${speciesLists}" edit="true" viewModelInstance="${blockId}ViewModelInstance"/>

            this[viewModelName] = function (output) {
                var self = this;
                self.name = "${outputName}";
                self.outputId = "";
                self.data = {};
                self.transients = {};
                self.transients.dummy = ko.observable();

                // add declarations for dynamic data
            <md:jsViewModel model="${model}"  output="${outputName}"  edit="true" viewModelInstance="${blockId}ViewModelInstance"/>

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
            var jsData = ko.mapping.toJS(self, {'ignore':['transients']});
            // get rid of any transient observables
            return self.removeBeforeSave(jsData);
        };

        // this is a version of toJSON that just returns the model as it will be saved
        // it is used for detecting when the model is modified (in a way that should invoke a save)
        // the ko.toJSON conversion is preserved so we can use it to view the active model for debugging
        self.modelAsJSON = function () {
            return JSON.stringify(self.modelForSaving());
        };

        self.loadData = function (outputId, data) {
            self.outputId = outputId;
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

            // Check for locally saved data for this output - this will happen in the event of a session timeout
            // for example.
            var savedData = activity;
            if (!savedData.outputs) {
                savedData.outputs = [];
            }
            console.log(savedData);
            var savedOutput = null;
            var savedOutputId = null;
            if (savedData) {

                $.each(savedData.outputs, function(i, tmpOutput) {
                    if (tmpOutput.name === '${outputName}') {
                        if (tmpOutput.data) {
                            savedOutput = tmpOutput.data;

                        }
                    }
                });
            }
            if (savedOutput) {
                window[viewModelInstance].loadData(savedOutputId, savedOutput);
            }
        });

        </r:script>
    </div>
</g:each>
<!-- /ko -->

</div>

<r:script>


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

                var toSave = JSON.stringify(activityData);
                console.log("saving"+toSave);
                mobileBindings.saveActivity(toSave);

            }

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
    var activity = JSON.parse(mobileBindings.loadActivity());
    var site = {};


    $(function(){

        console.log("Blah!");

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#reset').click(function () {
            master.reset();
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

        function ViewModel (act, site) {
            var self = this;
            self.activityId = act.activityId;
            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate || act.plannedEndDate).extend({simpleDate: false});
            self.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate: false});
            self.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate: false});
            self.eventPurpose = ko.observable(act.eventPurpose);
            self.fieldNotes = ko.observable(act.fieldNotes);
            self.associatedProgram = ko.observable(act.associatedProgram);
            self.associatedSubProgram = ko.observable(act.associatedSubProgram);
            self.progress = ko.observable(act.progress);
            self.mainTheme = ko.observable(act.mainTheme);
            self.type = ko.observable(act.type);
            self.siteId = ko.observable(act.siteId);
            self.projectId = act.projectId;
            self.transients = {};
            self.transients.site = site;
            self.transients.activityProgressValues = ['planned','started','finished'];
            self.transients.themes = $.map(${themes}, function (obj, i) { return obj.name });
            self.transients.markedAsFinished = ko.observable(act.progress === 'finished');
            self.transients.markedAsFinished.subscribe(function (finished) {
                self.progress(finished ? 'finished' : 'started');
            });

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

            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
            self.dirtyFlag = ko.dirtyFlag(self, false);

            // make sure progress moves to started if we save any data (unless already finished)
            // (do this here so the model becomes dirty)
            self.progress(self.transients.markedAsFinished() ? 'finished' : 'started');
        }


        var viewModel = new ViewModel(activity, site);

        ko.applyBindings(viewModel);

        master.register('activityModel', viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset);

        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        if(mapFeatures !=null && mapFeatures.features !== undefined && mapFeatures.features.length >0){
            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16,
                    featureService: "${createLink(controller: 'proxy', action:'feature')}",
                    wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
                },
                mapFeatures
            );
        }
    });
</r:script>
</body>
</html>