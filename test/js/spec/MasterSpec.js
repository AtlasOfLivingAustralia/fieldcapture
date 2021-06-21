describe("The Master is responsible for saving activity and output data for activity forms" , function () {

    var originalUnblockUI;
    var originalBlockUI;

    beforeAll(function() {
        window.fcConfig = {
            healthCheckUrl:'/health',
            context: {}
        };
        window.bootbox = {
            alert: function (message) {
                return message;
            }
        };

        ko.dirtyFlag = function() {
            return {
                isDirty: function() { return true },
                reset: function() {}
            };
        };
        originalUnblockUI = $.fn.unblockUI;
        originalBlockUI = $.fn.blockUI;
        $.unblockUI = function() {};
        $.blockUI = function() {};
    });

    afterAll(function() {
        delete window.fcConfig;
        delete window.bootbox;

        $.unblockUI = originalUnblockUI;
        $.blockUI = originalBlockUI;
    });


    it("Will always save activity progress, even if the activity data is not dirty", function() {
        var activityId = 'a1';
        var config = {};
        var master = new Master(activityId, config);
        var activity = {
            activityId:activityId
        };
        var activityDirty = false;
        var outputData = {data:{value:'test'}};

        var saveParams;
        spyOn($, 'ajax').and.callFake(function(params) {
            saveParams = params;
            return $.Deferred().resolve({'text':'this a a fake response'}).promise();
        });

        var viewModel = new ActivityHeaderViewModel(activity, {}, fcConfig.context, {}, []);

        master.register('activityModel', viewModel.modelForSaving, function() {return activityDirty}, viewModel.dirtyFlag.reset, viewModel.updateIdsAfterSave);
        master.register({transients: {optional: false}, checkWarnings:function() {} },
            function() { return outputData; },
            function() { return true; },
            function() {},
            function() {} );
        master.save();

        var activityData = JSON.parse(saveParams.data);
        expect(activityData.progress).toEqual('started');
        expect(activityData.activityId).toEqual(activityId);

        expect(activityData.outputs).toEqual([outputData]);
    });

    it("will display errors if a save fails", function() {
        var activityId = 'a1';
        var config = {};
        var master = new Master(activityId, config);
        var activity = {
            activityId:activityId
        };
        var activityDirty = false;
        var outputData = {data:{value:'test'}};

        var saveParams;
        spyOn($, 'ajax').and.callFake(function(params) {
            saveParams = params;
            return $.Deferred().resolve({resp: {errors:[{error:'the activity is locked by another user'}]}}).promise();
        });
        spyOn(window.bootbox, 'alert');

        var viewModel = new ActivityHeaderViewModel(activity, {}, fcConfig.context, {}, []);

        master.register('activityModel', viewModel.modelForSaving, function() {return activityDirty}, viewModel.dirtyFlag.reset, viewModel.updateIdsAfterSave);
        master.register({transients: {optional: false}, checkWarnings:function() {} },
            function() { return outputData; },
            function() { return true; },
            function() {},
            function() {} );
        master.save();

        expect(window.bootbox.alert).toHaveBeenCalled();
    });

    it("can process errors in different response formats", function() {
        var master = new Master('a1', {});

        var errors = master.getErrors({resp:{errors:[{error:'test'}]}});
        expect(errors).toEqual([{error:'test'}]);

        errors = master.getErrors({errors:[{error:'test'}]});
        expect(errors).toEqual([{error:'test'}]);

        errors = master.getErrors({error:'test'});
        expect(errors).toEqual([{error:'test'}]);

        errors = master.getErrors({resp:{error:'test'}});
        expect(errors).toEqual([{error:'test'}]);
    });
});