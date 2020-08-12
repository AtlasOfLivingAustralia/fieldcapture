describe("ProjectService Spec", function () {

    beforeAll(function() {
        window.fcConfig = {};
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("Will return an empty array of budget headers if configured with the option excludeFinancialYearData", function () {
        var project = {plannedStartDate:'2019-12-31T13:00:00Z', plannedEndDate:'2023-12-31T13:00:00Z'};
        var options = {excludeFinancialYearData: true};
        var projectService = new ProjectService(project, options);

        expect(projectService.getBudgetHeaders()).toEqual([]);
    });

    it("Will return a list of financial years based on project dates", function () {
        var project = {plannedStartDate:'2019-12-31T13:00:00Z', plannedEndDate:'2023-12-31T13:00:00Z'};
        var options = {excludeFinancialYearData: false};
        var projectService = new ProjectService(project, options);

        expect(projectService.getBudgetHeaders()).toEqual(
            ['2019/2020', '2020/2021', '2021/2022', '2022/2023', '2023/2024']);
    });
});