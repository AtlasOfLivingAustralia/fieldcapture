describe("ProgramPageViewModel Spec", function () {

    beforeAll(function() {
        window.fcConfig = {
            healthCheckUrl:'/health',
            imageLocation:'/'
        };
        if (!window.bootbox) {
            window.bootbox = {alert:function(){}}
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

    it("initialises the model from the supplied program data", function() {
        var options = {};
        var program = { name: 'Test program', programId:"p1" };
        var model = new ProgramPageViewModel(program, options);

        expect(model.name()).toEqual(program.name);
        expect(model.programId).toEqual(program.programId);

        model.initialise();

    });


    it("Program outcomes can be saved", function() {
        var options = {programSaveUrl:'/test/url'};
        var program = { name: 'Test program', programId:"p1" };
        var model = new ProgramPageViewModel(program, options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });


        spyOn(bootbox, 'alert');

        var outcomesFromJSONEditor = JSON.stringify([{outcome:'1'}]);
        model.outcomes(outcomesFromJSONEditor);
        model.saveProgramOutcomes();
        var expected = {
            url: options.programSaveUrl,
            type: 'POST',
            data: '{"outcomes":[{"outcome":"1"}]}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);
        expect(bootbox.alert).toHaveBeenCalledWith("Program outcomes saved!");

    });

    it("Program priorities can be saved", function() {
        var options = {programSaveUrl:'/test/url'};
        var program = { name: 'Test program', programId:"p1" };
        var model = new ProgramPageViewModel(program, options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });


        spyOn(bootbox, 'alert');

        var prioritiesFromJSONEditor = JSON.stringify([{category:'Test', priority: 'Test priority'}]);
        model.priorities(prioritiesFromJSONEditor);
        model.saveProgramPriorities();
        var expected = {
            url: options.programSaveUrl,
            type: 'POST',
            data: '{"priorities":[{"category":"Test","priority":"Test priority"}]}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);
        expect(bootbox.alert).toHaveBeenCalledWith("Program priorities saved!");

    });
});