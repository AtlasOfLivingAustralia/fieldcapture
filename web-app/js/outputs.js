/**
 * User: MEW
 * Date: 18/06/13
 * Time: 2:24 PM
 */

//iterates over the outputs specified in the meta-model and builds a temp object for
// each containing the name, and the scores and id of any matching outputs in the data
ko.bindingHandlers.foreachModelOutput = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (valueAccessor() === undefined) {
            var dummyRow = {name: 'No model was found for this activity', scores: [], outputId: '', editLink:''};
            ko.applyBindingsToNode(element, { foreach: [dummyRow] });
            return { controlsDescendantBindings: true };
        }
        var metaOutputs = ko.utils.unwrapObservable(valueAccessor()),// list of String names of outputs
            activity = bindingContext.$data,// activity data
            transformedOutputs = [];//created list of temp objects

        $.each(metaOutputs, function (i, name) { // for each output name
            var scores = [],
                outputId = '',
                editLink = fcConfig.serverUrl + "/output/";

            // search for corresponding outputs in the data
            $.each(activity.outputs(), function (i,output) { // iterate output data in the activity to
                                                             // find any matching the meta-model name
                if (output.name === name) {
                    outputId = output.outputId;
                    $.each(output.scores, function (k, v) {
                        scores.push({key: k, value: v});
                    });
                }
            });

            if (outputId) {
                // build edit link
                editLink += 'edit/' + outputId +
                    "?returnTo=" + returnTo;
            } else {
                // build create link
                editLink += 'create?activityId=' + activity.activityId +
                    '&outputName=' + encodeURIComponent(name) +
                    "&returnTo=" + returnTo;
            }
            // build the array that we will actually iterate over in the inner template
            transformedOutputs.push({name: name, scores: scores, outputId: outputId,
                editLink: editLink});
        });

        // re-cast the binding to iterate over our new array
        ko.applyBindingsToNode(element, { foreach: transformedOutputs });
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.foreachModelOutput = true;

// handle activity accordion
$('#activities').
    on('show', 'div.collapse', function() {
        $(this).parents('tr').prev().find('td:first-child a').empty()
            .html("&#9660;").attr('title','hide').parent('a').tooltip();
    }).
    on('hide', 'div.collapse', function() {
        $(this).parents('tr').prev().find('td:first-child a').empty()
            .html("&#9658;").attr('title','expand');
    }).
    on('shown', 'div.collapse', function() {
        trackState();
    }).
    on('hidden', 'div.collapse', function() {
        trackState();
    });

function trackState () {
    var $leaves = $('#activityList div.collapse'),
        state = [];
    $.each($leaves, function (i, leaf) {
        if ($(leaf).hasClass('in')) {
            state.push($(leaf).attr('id'));
        }
    });
    console.log('state stored = ' + state);
    amplify.store.sessionStorage('output-accordion-state',state);
}

function readState () {
    var $leaves = $('#activityList div.collapse'),
        state = amplify.store.sessionStorage('output-accordion-state'),
        id;
    console.log('state retrieved = ' + state);
    $.each($leaves, function (i, leaf) {
        id = $(leaf).attr('id');
        if (($.inArray(id, state) > -1)) {
            $(leaf).collapse('show');
        }
    });
}

var image = function(props) {

    var imageObj = {
        id:props.id,
        name:props.name,
        size:props.size,
        url: props.url,
        thumbnail_url: props.thumbnail_url,
        viewImage : function() {
            window['showImageInViewer'](this.id, this.url, this.name);
        }
    };
    return imageObj;
};

ko.bindingHandlers.photoPoint = {
    init: function(element, valueAccessor) {

    }
}


ko.bindingHandlers.photoPointUpload = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        var defaultConfig = {
            maxWidth: 300,
            minWidth:150,
            minHeight:150,
            maxHeight: 300,
            previewSelector: '.preview'
        };
        var size = ko.observable();
        var progress = ko.observable();
        var error = ko.observable();
        var complete = ko.observable(true);

        var uploadProperties = {

            size: size,
            progress: progress,
            error:error,
            complete:complete

        };
        var innerContext = bindingContext.createChildContext(bindingContext);
        ko.utils.extend(innerContext, uploadProperties);

        var config = valueAccessor();
        config = $.extend({}, config, defaultConfig);

        var target = config.target; // Expected to be a ko.observableArray
        $(element).fileupload({
            url:config.url,
            autoUpload:true,
            forceIframeTransport: true
        }).on('fileuploadadd', function(e, data) {
            complete(false);
            progress(1);
        }).on('fileuploadprocessalways', function(e, data) {
            if (data.files[0].preview) {
                if (config.previewSelector !== undefined) {
                    var previewElem = $(element).parent().find(config.previewSelector);
                    previewElem.append(data.files[0].preview);
                }
            }
        }).on('fileuploadprogressall', function(e, data) {
            progress(Math.floor(data.loaded / data.total * 100));
            size(data.total);
        }).on('fileuploaddone', function(e, data) {

//            var resultText = $('pre', data.result).text();
//            var result = $.parseJSON(resultText);


            var result = data.result;
            if (!result) {
                result = {};
                error('No response from server');
            }

            if (result.files[0]) {
                target.push(result.files[0]);
                complete(true);
            }
            else {
                error(result.error);
            }

        }).on('fileuploadfail', function(e, data) {
            error(data.errorThrown);
        });

        ko.applyBindingsToDescendants(innerContext, element);

        return { controlsDescendantBindings: true };
    }
};

ko.bindingHandlers.imageUpload = {
    init: function(element, valueAccessor) {

        var config = {autoUpload:true};
        var observable;
        var params = valueAccessor();
        if (ko.isObservable(params)) {
            observable = params;
        }
        else {
            observable = params.target;
            $.extend(config, params.config);
        }

        var addCallbacks = function() {
            // The upload URL is specified using the data-url attribute to allow it to be easily pulled from the
            // application configuration.
            $(element).fileupload('option', 'completed', function(e, data) {
                if (data.result && data.result.files) {
                    $.each(data.result.files, function(index, obj) {
                        if (observable.hasOwnProperty('push')) {
                            observable.push(image(obj));
                        }
                        else {
                            observable(image(obj))
                        }
                    });
                }
            });
            $(element).fileupload('option', 'destroyed', function(e, data) {
                var filename = $(e.currentTarget).attr('data-filename');

                if (observable.hasOwnProperty('remove')) {
                    var images = observable();

                    // We rely on the template rendering the filename into the delete button so we can identify which
                    // object has been deleted.
                    $.each(images, function(index, obj) {
                        if (obj.name === filename) {
                            observable.remove(obj);
                            return false;
                        }
                    });
                }
                else {
                    observable({})
                }
            });

        };

        $(element).fileupload(config);

        var value = ko.utils.unwrapObservable(observable);
        var isArray = value.hasOwnProperty('length');

        if ((isArray && value.length > 0) || (!isArray && value['name'] !== undefined)) {
            // Render the existing model items - we are currently storing all of the metadata needed by the
            // jquery-file-upload plugin in the model but we should probably only store the core data and decorate
            // it in the templating code (e.g. the delete URL and HTTP method).
            $(element).fileupload('option', 'completed', function(e, data) {
                addCallbacks();
            });
            var data = {result:{}};
            if (isArray)  {
                data.result.files = value
            }
            else {
                data.result.files = [value];
            }
            var doneFunction = $(element).fileupload('option', 'done');
            var e = {isDefaultPrevented:function(){return false;}};

            doneFunction.call(element, e, data);
        }
        else {
            addCallbacks();
        }

        // Enable iframe cross-domain access via redirect option:
        $(element).fileupload(
            'option',
            'redirect',
            window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
            )
        );

    }

};

ko.bindingHandlers.editDocument = {
    init:function(element, valueAccessor) {
        if (ko.isObservable(valueAccessor())) {
            var document = ko.utils.unwrapObservable(valueAccessor());
            if (typeof document.status == 'function') {
                document.status.subscribe(function(status) {
                    if (status == 'deleted') {
                        valueAccessor()(null);
                    }
                });
            }
        }
        var options = {
            name:'documentEditTemplate',
            data:valueAccessor()
        };
        return ko.bindingHandlers['template'].init(element, function() {return options;});
    },
    update:function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var options = {
            name:'documentEditTemplate',
            data:valueAccessor()
        };
        ko.bindingHandlers['template'].update(element, function() {return options;}, allBindings, viewModel, bindingContext);
    }
};

expressionEvaluator = function() {
    function bindVariable(variable, context) {
        if (!context) {
            return;
        }
        var result;
        var contextVariable = variable;
        var specialVariables = ['index', 'parent'];
        if (specialVariables.indexOf(variable) >= 0) {
            contextVariable = '$' + variable;
        }
        if (context[contextVariable]) {
            result = ko.utils.unwrapObservable(context[contextVariable]);
        }
        else {
            if (context['$parent']) {
                result = bindVariable(variable, context['$parent']);
            }
        }
        return result;

    }
    function bindVariables(variables, context) {

        var boundVariables = {};
        for (var i = 0; i < variables.length; i++) {
            boundVariables[variables[i]] = bindVariable(variables[i], context);
        }
        return boundVariables;
    }

    var expressionCache = {};

    function evaluateInternal(expression, context) {
        var parsedExpression = expressionCache[expression];
        if (!parsedExpression) {
            parsedExpression = Parser.parse(expression);
            expressionCache[expression] = parsedExpression;
        }

        var variables = parsedExpression.variables();
        var boundVariables = bindVariables(variables, context);

        var result;
        try {
            result = parsedExpression.evaluate(boundVariables);
        }
        catch (e) { // undefined dependencies cause an exception to be thrown.
            result = ''; // Ignore as this is will happen when the computed is first evaluated against the model before load has been called.
        }

        return result;
    }

    function evaluateNumber(expression, context, numberOfDecimalPlaces) {

        var result = evaluateInternal(expression, context);
        if (!isNaN(result)) {
            if (numberOfDecimalPlaces == undefined) {
                numberOfDecimalPlaces = 2;
            }

            result = neat_number(result, numberOfDecimalPlaces);
        }

        return result;
    }

    function evaluateBoolean(expression, context) {
        var result = evaluateInternal(expression, context);
        return result ? true : false;
    }

    function evaluateString(expression, context) {
        var result = evaluateInternal(expression, context);
        return ''.concat(result);
    }

    return {
        evaluate:evaluateNumber,
        evaluateBoolean:evaluateBoolean,
        evaluateString:evaluateString
    }

}();

OutputListSupport = function(parent, listName, ListItemType, userAddedRows, config) {
    var self = this;
    self.listName = listName;
    self.addRow = function () {
        var newItem = new ListItemType(undefined, parent, self.rowCount(), config);
        parent.data[listName].push(newItem);
    };
    self.removeRow = function (item) {
        parent.data[listName].remove(item);
    };
    self.rowCount = function () {
        return parent.data[listName]().length;
    };
    self.appendTableRows = ko.observable(userAddedRows);
    self.tableDataUploadVisible = ko.observable(false);
    self.showTableDataUpload = function() {
        self.tableDataUploadVisible(!self.tableDataUploadVisible());
    };

    self.downloadTemplate = function() {
        // Download a blank template if we are appending, otherwise download a template containing the existing data.
        if (self.appendTableRows()) {
            parent.downloadTemplate(listName);
        }
        else {
            parent.downloadDataTemplate(listName, true, userAddedRows);
        }
    };
    self.downloadTemplateWithData = function() {
        parent.downloadDataTemplate(listName, false, true);
    };
    self.tableDataUploadOptions = parent.buildTableOptions(self);
    self.allowUserAddedRows = userAddedRows;
};

OutputModel = function(output, context, config) {

    var self = this;

    if (!output) {
        output = {};
    }
    var activityId = output.activityId || config.activityId;
    self.name = output.name;
    self.outputId = orBlank(output.outputId);

    self.data = {};
    self.transients = {};
    var notCompleted = output.outputNotCompleted;

    if (notCompleted === undefined) {
        notCompleted = config.collapsedByDefault;
    }

    var toIgnore = {ignore:['transients', '$parent', '$index']};
    self.outputNotCompleted = ko.observable(notCompleted);
    self.transients.optional = config.optional || false;
    self.transients.questionText = config.optionalQuestionText || 'Not applicable';
    self.transients.dummy = ko.observable();

    self.downloadTemplate = function(listName) {
        var url = config.excelOutputTemplateUrl + '?listName='+listName+'&type='+output.name;
        $.fileDownload(url);
    };

    self.downloadDataTemplate = function(listName, editMode, userAddedRows) {
        var data = ko.mapping.toJS(self.data[listName](), toIgnore);
        var params = {
            listName:listName,
            type:self.name,
            editMode: editMode,
            allowExtraRows: userAddedRows,
            data:JSON.stringify(data)
        };
        var url = config.excelOutputTemplateUrl;
        $.fileDownload(url, {
            httpMethod:'POST',
            data:params
        });

    };
    // this will be called when generating a savable model to remove transient properties
    self.removeTransients = function (jsData) {
        delete jsData.activityType;
        delete jsData.transients;
        return jsData;
    };

    // this returns a JS object ready for saving
    self.modelForSaving = function () {
        // get model as a plain javascript object
        var jsData = ko.mapping.toJS(self, toIgnore);
        if (self.outputNotCompleted()) {
            jsData.data = {};
        }

        // get rid of any transient observables
        return self.removeBeforeSave(jsData);
    };

    // this is a version of toJSON that just returns the model as it will be saved
    // it is used for detecting when the model is modified (in a way that should invoke a save)
    // the ko.toJSON conversion is preserved so we can use it to view the active model for debugging
    self.modelAsJSON = function () {
        return JSON.stringify(self.modelForSaving());
    };

    /** Merge properties from obj2 into obj1 recursively, favouring obj1 unless undefined / missing. */
    self.merge = function(obj1, obj2, result) {

        var keys = _.union(_.keys(obj1), _.keys(obj2));
        result = result || {};

        for (var i=0; i<keys.length; i++) {

            var key = keys[i];
            if (obj2[key] === undefined) {
                result[key] = obj1[key];
            }
            else if (obj1[key] === undefined && config.replaceUndefined) {
                result[key] = obj2[key];
            }
            else if (!obj1.hasOwnProperty(key)) {
                result[key] = obj2[key];
            }
            else if (_.isArray(obj1[key]) && _.isArray(obj2[key])) {
                if (obj2[key].length > obj1[key].length) {
                    obj2[key].splice(obj1[key].length, obj2[key].length-obj1[key].length); // Delete extra array elements from obj2.
                }
                result[key] = self.merge(obj1[key], obj2[key], []);
            }
            else if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
                result[key] = self.merge(obj1[key], obj2[key]);
            }
            else {
                result[key] = obj1[key];
            }
        }
        return result;
    };

    self.prepop = function(conf) {
        var prepopData = self.getPrepopData(conf);
        if (prepopData) {
            var mapping = conf.mapping;

            return self.map(mapping, prepopData);
        }

    };

    self.loadOrPrepop = function(data) {

        var result = data || {};

        if (config && !config.disablePrepop && config.model) {
            var conf = config.model['pre-populate'];

            if (conf) {
                _.each(conf, function (item) {
                    var prepopData = self.prepop(item);

                    if (prepopData && (item.merge || !data)) {
                        _.extend(result, self.merge(prepopData, result));
                    }

                });
            }
        }

        return result;
    };


    self.getPrepopData = function(conf) {
        var source = conf.source;
        if (source && source.hasOwnProperty('context-path')) {
            if (source['context-path']) {
                return getNestedValue(context, source['context-path']);
            }
            else {
                return context;
            }
        }
    };


    self.map = function(mappingList, data) {
        var result = {};

        _.each(mappingList, function(mapping) {

            // Presence of a nested mapping element indicates a list.
            if (_.has(mapping, 'mapping')) {
                result[mapping.target] = [];
                var selectedData = getNestedValue(data, mapping['source-path']);
                _.each(selectedData, function(d) {
                    var nestedResult = self.map(mapping.mapping, d);
                    if (nestedResult) {
                        result[mapping.target].push(nestedResult);
                    }

                });
            }
            else {
                result[mapping.target] = getNestedValue(data, mapping['source-path']);
            }
        });

        return result;
    };

    self.attachDocument = function(target) {
        var url = config.documentUpdateUrl || fcConfig.documentUpdateUrl;
        showDocumentAttachInModal(url, new DocumentViewModel({role:'information', stage:config.stage},{activityId:activityId, projectId:config.projectId}), '#attachDocument')
            .done(function(result) {
                target(new DocumentViewModel(result))
            });
    };
    self.editDocumentMetadata = function(document) {
        var url = (config.documentUpdateUrl || fcConfig.documentUpdateUrl) + "/" + document.documentId;
        showDocumentAttachInModal(url, document, '#attachDocument');
    };
    self.deleteDocument = function(document) {
        document.status('deleted');
        var url = (config.documentDeleteUrl || fcConfig.documentDeleteUrl)+'/'+document.documentId;
        $.post(url, {}, function() {});

    };

    self.uploadFailed = function(message) {
        var text = "<span class='label label-important'>Important</span><h4>There was an error uploading your data.</h4>";
        text += "<p>"+message+"</p>";
        bootbox.alert(text)
    };

    self.buildTableOptions = function(list) {

        var listName = list.listName;
        return {
            url: config.excelDataUploadUrl,
            done: function (e, data) {
                if (data.result.error) {
                    self.uploadFailed(data.result.error);
                }
                else {
                    self['load' + listName](data.result.data, list.appendTableRows());
                }
            },
            fail: function (e, data) {
                self.uploadFailed(data);
            },
            uploadTemplateId: listName + "template-upload",
            downloadTemplateId: listName + "template-download",
            formData: {type: output.name, listName: listName}
        };
    }
};

function initialiseOutputViewModel(outputViewModelName, elementId, activity, output, config) {
    var viewModelInstance = outputViewModelName + 'Instance';

    window[viewModelInstance] = new window[outputViewModelName](output, fcConfig.project, config);
    window[viewModelInstance].loadData(output.data, activity.documents);

    // dirtyFlag must be defined after data is loaded
    window[viewModelInstance].dirtyFlag = ko.simpleDirtyFlag(window[viewModelInstance], false);

    ko.applyBindings(window[viewModelInstance], document.getElementById(elementId));

    // this resets the baseline for detecting changes to the model
    // - shouldn't be required if everything behaves itself but acts as a backup for
    //   any binding side-effects
    // - note that it is not foolproof as applying the bindings happens asynchronously and there
    //   is no easy way to detect its completion
    window[viewModelInstance].dirtyFlag.reset();

    // register with the master controller so this model can participate in the save cycle
    master.register(window[viewModelInstance], window[viewModelInstance].modelForSaving,
        window[viewModelInstance].dirtyFlag.isDirty, window[viewModelInstance].dirtyFlag.reset);

    // Check for locally saved data for this output - this will happen in the event of a session timeout
    // for example.
    var savedData = amplify.store('activity-'+activity.activityId);
    var savedOutput = null;
    if (savedData) {
        var outputData = $.parseJSON(savedData);
        if (outputData.outputs) {
            $.each(outputData.outputs, function(i, tmpOutput) {
                if (tmpOutput.name === output.name) {
                    if (tmpOutput.data) {
                        savedOutput = tmpOutput.data;
                    }
                }
            });
        }
    }
    if (savedOutput) {
        window[viewModelInstance].loadData(savedOutput);
    }
};