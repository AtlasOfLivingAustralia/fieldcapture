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

});
