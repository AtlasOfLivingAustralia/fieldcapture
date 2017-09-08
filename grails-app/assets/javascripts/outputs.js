/**
 * User: MEW
 * Date: 18/06/13
 * Time: 2:24 PM
 */

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