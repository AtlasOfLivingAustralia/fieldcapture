describe("ManagementUnitReportSelectorViewModel Spec", function () {
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

    it("Should able to download the report", function() {
        var options = {generateMUReportInPeriodUrl:'/test/url'};
        var model = new ManagementUnitReportSelectorViewModel(options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });

        spyOn(bootbox, 'alert');

        model.muReportDownload()
        var expected = {
            // url: options.generateMUReportInPeriodUrl,
            url: undefined,
            type: 'get',
            data: '{"summaryFlag":false}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);

        // expect($.ajax).toHaveBeenCalledWith({ url: undefined, type: 'get', dataType: undefined, data: Object({ fromDate: undefined, toDate: undefined, summaryFlag: false }), success: undefined })

    });

});