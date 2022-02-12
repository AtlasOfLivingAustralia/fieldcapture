describe("Tests for the GrantManagerReportsViewModel", function () {
    beforeAll(function() {
        window.fcConfig = {
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

    it("populates the project start date", function () {
        var config = {reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var project = {plannedStartDate: '2019-12-31T13:00:00Z', plannedEndDate: '2023-12-31T13:00:00Z'};
        var viewModel = new GrantManagerReportsViewModel(config);
        var projectService = new ProjectService(project, config);
        expect(viewModel.plannedStartDate()).toBe('2021-06-29T14:00:00Z');
    });

    it("displays the grant manager actions", function () {
        var config = {project: {status:'Active'}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.anyReportData()).toBe(true);
    });

});