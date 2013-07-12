/**
 * User: MEW
 * Date: 18/06/13
 * Time: 2:24 PM
 */

//iterates over the outputs specified in the meta-model and builds a temp object for
// each containing the name, and the score and id of any matching outputs in the data
ko.bindingHandlers.foreachModelOutput = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (valueAccessor() === undefined) {
            var dummyRow = {name: 'No model was found for this activity', score: '', outputId: '', editLink:''};
            ko.applyBindingsToNode(element, { foreach: [dummyRow] });
            return { controlsDescendantBindings: true };
        }
        var metaOutputs = ko.utils.unwrapObservable(valueAccessor()),
            activity = bindingContext.$data,
            transformedOutputs = [];

        $.each(metaOutputs, function (i, name) {
            var score = "Not assessed yet.",
                outputId = '',
                editLink = fcConfig.serverUrl + "/output/";

            // search for corresponding outputs in the data
            $.each(activity.outputs(), function (i,output) {
                if (output.name === name) {
                    outputId = output.outputId;
                    // the data structure allows for multiple scores per output
                    // not clear yet if this is required but for now just assume one
                    for (var key in output.scores) {
                        if (output.scores.hasOwnProperty(key)) {
                            score = output.scores[key];
                        }
                    }
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
            transformedOutputs.push({name: name, score: score, outputId: outputId,
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
        state.push($(leaf).hasClass('in'));
    });
    amplify.store.sessionStorage('output-accordion-state',state);
}

function readState () {
    var hidden = $('#activityList div.collapse'),
        state = amplify.store.sessionStorage('output-accordion-state');
    $.each(hidden, function (i, leaf) {
        if (state !== undefined && i < state.length && state[i]) {
            $(leaf).collapse('show');
        }
    });
}
