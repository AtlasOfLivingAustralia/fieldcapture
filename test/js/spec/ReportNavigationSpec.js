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
        var deleteSavedDataCalled = false;
        var reportMaster = {
            save:function(callback) {
                saveCalled = true;
                if (_.isFunction(callback)) {
                    callback(true);
                }
            },
            deleteSavedData:function () {
                deleteSavedDataCalled = true;
            }
        };
        var activityViewModel = {
            progress:ko.observable('started')
        };
        var reportNavigationViewModel = new ReportNavigationViewModel(reportMaster, activityViewModel, {});
        var returnCalled = false;
        reportNavigationViewModel.return = function() {
            returnCalled = true;
        };

        reportNavigationViewModel.save();
        expect(saveCalled).toBeTruthy();
        expect(returnCalled).toBeFalsy();
        expect(deleteSavedDataCalled).toBeFalsy();

        saveCalled = false;
        returnCalled = false;
        deleteSavedDataCalled = false;
        reportNavigationViewModel.saveAndExit();
        expect(saveCalled).toBeTruthy();
        expect(returnCalled).toBeTruthy();
        expect(deleteSavedDataCalled).toBeFalsy();

        saveCalled = false;
        returnCalled = false;
        deleteSavedDataCalled = false;
        reportNavigationViewModel.cancel();

        expect(saveCalled).toBeFalsy();
        expect(returnCalled).toBeTruthy();
        expect(deleteSavedDataCalled).toBeTruthy();

    });
});