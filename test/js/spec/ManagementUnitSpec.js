describe("ManagmentUnitViewModel Spec", function () {
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        }
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
        var isEditor = true;
        var mu = new ManagementUnitViewModel(muData, isEditor);

        expect(mu.name()).toEqual(muData.name);
        expect(mu.description()).toEqual(muData.description);
    });

});
