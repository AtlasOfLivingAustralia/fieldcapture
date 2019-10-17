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
});