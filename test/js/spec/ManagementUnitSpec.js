describe("ManagmentUnitViewModel Spec", function () {
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        }
        // These are defined in the ecodata-client-plugin which doesn't package javascript as a node module so
        // getting them for testing purposes is a bit messy, so they are just being stubbed.
        ko.simpleDirtyFlag  = function() {
            this.isDirty = ko.observable(false);
            return this;
        };
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("should be able to be initialised from an object literal", function () {

        var muData = {
            name:'Name',
            description:'Description',
            projects : []
        };
        var config = {"healthCheckUrl":"/"}
        var mu = new ManagementUnitViewModel(muData,  config);

        expect(mu.name()).toEqual(muData.name);
        expect(mu.description()).toEqual(muData.description);
    });

    it("Management unit priorities can be saved", function() {
        var options = {managementUnitSaveUrl:'/test/url', healthCheckUrl:'/test/health'};
        var mu = { name: 'Test MU', managementUnitId:"m1" };
        var model = new ManagementUnitPageViewModel(mu, options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });


        spyOn(bootbox, 'alert');

        var prioritiesFromJSONEditor = JSON.stringify([{category:'Test', priority: 'Test priority'}]);
        model.priorities(prioritiesFromJSONEditor);
        model.saveManagementUnitPriorities();
        var expected = {
            url: options.managementUnitSaveUrl,
            type: 'POST',
            data: '{"priorities":[{"category":"Test","priority":"Test priority"}]}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);
        expect(bootbox.alert).toHaveBeenCalledWith("Management Unit priorities saved!");

    });

});
