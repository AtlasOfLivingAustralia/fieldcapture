describe("Tests for the ReportViewModel", function () {
    it("Will calculate the end date differently if the end date aligns with the owner/project end date", function() {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
        };
        var viewModel = new ReportViewModel(report, config);

        // Because the end date matches the project end date, it will display the date directly (ignoring time).
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

        config.reportOwner.endDate = '2021-06-29T14:00:00Z';
        report.toDate = '2020-06-30T14:00:00Z';
        var viewModel = new ReportViewModel(report, config);

        // Even though the report toDate is actuall 12am 1 July 2020 AEST, it should be displayed as June 30.
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

    });
});