describe("Activity reports have specific navigation behaviour", function () {

    var originalUnblockUI;

    beforeEach(function() {
        originalUnblockUI = $.unblockUI;
        $.unblockUI = function() {};
    });
    afterEach(function() {
        $.unblockUI = originalUnblockUI;
    });

    it("delegates most functions to the reportMaster and activityViewModel", function() {
        var saveCalled = false;
        var cancelAutoSaveCalled = false;
        var testDirtyFlag = false;
        var testMarkAsFinished = false;
        var reportMaster = {
            save:function(callback) {
                saveCalled = true;
                if (_.isFunction(callback)) {
                    callback(true);
                }
            },
            dirtyFlag: {
                isDirty: function() {
                    return testDirtyFlag;
                }
            },
            cancelAutosave: function() {
                cancelAutoSaveCalled = true;
            }

        };
        var activityViewModel = {
            progress:ko.observable('started'),
            transients: {
                markedAsFinished: function() {
                    return testMarkAsFinished;
                }
            }
        };
        var reportNavigationViewModel = new ReportNavigationViewModel(reportMaster, activityViewModel, {});
        var returnCalled = false;
        reportNavigationViewModel.return = function() {
            returnCalled = true;
        };

        reportNavigationViewModel.save();
        expect(saveCalled).toBeTruthy();
        expect(returnCalled).toBeFalsy();
        expect(cancelAutoSaveCalled).toBeFalsy();

        saveCalled = false;
        returnCalled = false;
        cancelAutoSaveCalled = false;
        reportNavigationViewModel.saveAndExit();
        expect(saveCalled).toBeTruthy();
        expect(returnCalled).toBeTruthy();
        expect(cancelAutoSaveCalled).toBeFalsy();

        saveCalled = false;
        returnCalled = false;
        cancelAutoSaveCalled = false;
        reportNavigationViewModel.cancel();
        expect(saveCalled).toBeFalsy();
        expect(returnCalled).toBeTruthy();
        expect(cancelAutoSaveCalled).toBeTruthy();

        reportNavigationViewModel.exitReport();
        expect(saveCalled).toBeFalsy();
        expect(returnCalled).toBeTruthy();
        expect(cancelAutoSaveCalled).toBeTruthy();

    });

    it("will scroll to the first invalid field if the activity progress is started", function() {
        var activityViewModel = {
            progress:ko.observable('started'),
            transients: {
                markedAsFinished: function() {
                    return false;
                }
            }
        };
        var reportMaster = {
            save:function(callback) {},
            dirtyFlag: {
                isDirty: function() {
                    return false;
                }
            },
            cancelAutosave: function() {}
        };
        var reportNavigationViewModel = new ReportNavigationViewModel(reportMaster, activityViewModel, {});

        var validateCalled = false;
        var data = {};

        var validationContainer = {
            data:function(name, val) {
                if (val) {
                    data = val;
                }
                else {
                    return data;
                }
            },
            validationEngine: function(val) {
                if (val == 'validate') {
                    validateCalled = true;
                }
            }
        };
        reportNavigationViewModel.initialiseScrollPosition(validationContainer);
        expect(validateCalled).toBeTruthy();

        validateCalled = false;

        activityViewModel.progress = ko.observable(ActivityProgress.planned);
        reportNavigationViewModel.initialiseScrollPosition(validationContainer);
        expect(validateCalled).toBeFalsy();

        activityViewModel.progress = ko.observable(ActivityProgress.finished);
        reportNavigationViewModel.initialiseScrollPosition(validationContainer);
        expect(validateCalled).toBeFalsy();

    });
});