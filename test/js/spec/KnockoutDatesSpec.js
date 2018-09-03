describe("knockout dates spec", function () {

    it("can format a date to the financial year in which it falls", function() {

        expect(isoDateToFinancialYear("2017-12-31T13:00:00Z")).toBe("2017/2018");
        expect(isoDateToFinancialYear("2017-05-30T14:00:00Z")).toBe("2016/2017");
        expect(isoDateToFinancialYear("2017-07-01T14:00:00Z")).toBe("2017/2018");

    });

    it("will treat a date at midnight of July 1 as the previous financial year", function() {
        expect(isoDateToFinancialYear("2017-06-30T14:00:00Z")).toBe("2016/2017");
    });

});