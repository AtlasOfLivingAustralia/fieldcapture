describe("Tests for the ReportViewModel", function () {
    it("Will calculate the end date differently if the end date aligns with the owner/project end date", function() {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}, isLast:true};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            statusChangeHistory:{comment:"test"}
        };
        var viewModel = new ReportViewModel(report, config);

        // Because the end date matches the project end date (and is the last report in the category), it will display the date directly (ignoring time).
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

        config.reportOwner.endDate = '2021-06-29T14:00:00Z';
        report.toDate = '2020-06-30T14:00:00Z';
        var viewModel = new ReportViewModel(report, config);

        // Even though the report toDate is actuall 12am 1 July 2020 AEST, it should be displayed as June 30.
        expect(viewModel.toDateLabel()).toBe('30-06-2020');

    });

    it("it will display the cancel button for Outcomes Report 1", function () {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            category:'Outcomes Report 1'
        };
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.outcomeCategory()).toBe(true);
    });

    it("it will display the cancel comment/reason in the Outcomes Report 1 status column", function () {
        var config = {reportOwner: {endDate:'2020-06-29T14:00:00Z'}};  // This is 12am on 30 June 2020 AEST
        var report = {
            reportId:"123",
            fromDate:'2019-12-31T13:00:00Z', // 12am Jan 1 2020
            toDate:'2020-06-29T14:00:00Z', // 12am June 30 2020
            category:'Outcomes Report 1',
            statusChangeHistory:[{comment:"test comment"}]
        };
        var viewModel = new ReportViewModel(report, config);
        expect(viewModel.cancelledComment).toBe("test comment");
    });
});