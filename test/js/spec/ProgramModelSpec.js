describe("ProgramModel Spec", function () {

    beforeAll(function() {
        window.fcConfig = {
            healthCheckUrl:'/health',
            imageLocation:'/'
        };
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
        var model = new ProgramViewModel(program, options);

        expect(model.name()).toEqual(program.name);
        expect(model.programId).toEqual(program.programId);

    });
});