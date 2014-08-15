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
