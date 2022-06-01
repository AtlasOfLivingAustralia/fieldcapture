describe("Tests for the GrantManagerReportsViewModel", function () {
    var blockUIWithMessage;
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

    it("does not populate the project start and end dates", function () {
        var config = {project: {status:'Active'}, reportOwner: {startDate:'2021-06-29T14:00:00Z', endDate:'2022-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);

        var project = {
            plannedStartDate:'2021-07-01T00:00:00Z',
            plannedEndDate:'2022-06-30T00:00:00Z',
            status:'Active'
        };
        var projectService = new ProjectService(project, {});
        expect(viewModel.plannedStartDate()).toBe('');
        expect(viewModel.plannedEndDate()).toBe('');
    });

    it("it will display the grant manager actions", function () {
        var config = {project: {status:'Active', reports: []}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.anyReportData()).toBe(true);
    });

    it("it will not display the grant manager actions as there is an existing report data", function () {
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            progress:'finished'
        };
        var config = {project: {status:'Active', reports:[report]}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.anyReportData()).toBe(false);
    });

    it("checks if the meri plan is approved", function () {
        var config = {project: {status:'Active', planStatus: 'approved', reports:[]}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.isMeriPlanApproved()).toBe(false)
    });

    it("checks if the meri plan is not approved", function () {
        var config = {project: {status:'Active', planStatus: 'submitted', report:[]}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.isMeriPlanApproved()).toBe(false)
    });

});