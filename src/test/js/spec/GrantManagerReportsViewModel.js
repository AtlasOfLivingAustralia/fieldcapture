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
        var config = {project: {status:ProjectStatus.ACTIVE, reports: []}, reportOwner: {startDate:'2021-06-29T14:00:00Z', endDate:'2022-06-29T14:00:00Z'}};
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
        var config = {project: {status:ProjectStatus.ACTIVE, reports: []}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.anyReportData()).toBe(true);
    });

    it("it will not display the grant manager actions as there is an existing report data", function () {
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z',
            toDate:'2020-06-29T14:00:00Z',
            progress:'finished'
        };
        var config = {project: {status:ProjectStatus.ACTIVE, reports:[report]}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.anyReportData()).toBe(false);
    });

    it("banner should not be displayed as the project is active and reports are generated", function () {
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z',
            toDate:'2020-06-29T14:00:00Z',
            progress:'finished'
        };
        var config = {project: {status:ProjectStatus.ACTIVE, planStatus: PlanStatus.APPROVED, reports:[report]}, reportOwner: {startDate:'2021-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.reportsAreGenerated()).toBeTruthy()
    });

    it("banner should be displayed as the project is not active and the reports are not generated", function () {
        var config = {project: {status:ProjectStatus.APPLICATION, planStatus: PlanStatus.NOT_APPROVED, reports:[]}, reportOwner: {startDate:'2021-06-29T14:00:00Z', endDate:'2021-09-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.reportsAreGenerated()).toBe(false)
    });

    it("banner should be displayed as the legacy project is active, meri plan is not approved and the reports are generated", function () {
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z',
            toDate:'2020-06-29T14:00:00Z',
            progress:'finished'
        };
        var config = {project: {status:ProjectStatus.ACTIVE, planStatus: PlanStatus.NOT_APPROVED, reports:[report]}, reportOwner: {startDate:'2021-06-29T14:00:00Z', endDate:'2021-09-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        expect(viewModel.reportsAreGenerated()).toBeTruthy()
    });

    it("does populate the project start and end dates as report(s) been generated", function () {
        var report = {
            reportId:"123",
            fromDate:'2021-07-01T00:00:00Z',
            toDate:'2022-06-30T00:00:00Z',
            progress:'planned'
        };
        var project = {
            plannedStartDate:'2021-07-01T00:00:00Z',
            plannedEndDate:'2022-06-30T00:00:00Z',
            status:'Active'
        };
        var config = {project: {status:ProjectStatus.ACTIVE, reports: [report]}, reportOwner: {startDate:'2021-06-29T14:00:00Z', endDate:'2022-06-29T14:00:00Z'}};
        var viewModel = new GrantManagerReportsViewModel(config);
        var projectService = new ProjectService(project, {});
        expect(viewModel.plannedStartDate()).toBe('2021-06-29T14:00:00Z');
        expect(viewModel.plannedEndDate()).toBe('2022-06-29T14:00:00Z');
    });

});