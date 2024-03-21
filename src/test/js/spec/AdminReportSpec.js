describe("EntityReportSelectorViewModel Spec", function () {
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
        var options = {generateEntityReportInPeriodUrl:'/test/url?entity=organisation'};
        var model = new EntityReportSelectorViewModel(options);

        var ajaxCall = spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });

        spyOn(bootbox, 'alert');

        model.entityReportDownloadSummary()
        var expected = {
            url: options.generateEntityReportInPeriodUrl,
            type: 'GET',
            data: Object({ fromDate:'2018-07-01T02:04:45Z', toDate:'2018-07-01T02:04:45Z', summaryFlag: true, entity: 'organisation' }),
            dataType: 'json',
            contentType: 'application/json'
        };

        expect(ajaxCall).toHaveBeenCalled();
        expect(window.bootbox.alert).toHaveBeenCalled();




    });

});