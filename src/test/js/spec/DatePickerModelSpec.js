describe("The documents contains view models for working with documents", function() {

    it("Can decide whether document roles are public based on metadata", function() {
        var fromDate = '2022-01-01';
        var toDate = '2022-06-30';
        var isFilterByCompletedProjects = true;
        var urlWithoutDates = '?query=Test'
        var $location = {};
        var model = new DatePickerModel(fromDate, toDate, isFilterByCompletedProjects, urlWithoutDates, $location);

        // Ensure the page doesn't automatically reload on initialisation (this is a regression test for a bug)
        expect($location.href).toBeUndefined();

        model.fromDate('2022-02-01');
        expect($location.href).toEqual('?query=Test&fromDate=2022-02-01&toDate=2022-06-30&isFilterByCompletedProjects=true');
    });
});