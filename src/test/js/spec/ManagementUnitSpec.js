describe("ManagmentUnitViewModel Spec", function () {
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

    it("should be able to be initialised from an object literal", function () {

        var muData = {
            name:'Name',
            description:'Description',
            projects : []
        };
        var config = {"healthCheckUrl":"/"}
        var mu = new ManagementUnitViewModel(muData,  config);

        expect(mu.name()).toEqual(muData.name);
        expect(mu.description()).toEqual(muData.description);
    });

    it("Management unit priorities can be saved", function() {
        var options = {managementUnitSaveUrl:'/test/url', healthCheckUrl:'/test/health'};
        var mu = { name: 'Test MU', managementUnitId:"m1" };
        var model = new ManagementUnitPageViewModel(mu, options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });


        spyOn(bootbox, 'alert');

        var prioritiesFromJSONEditor = JSON.stringify([{category:'Test', priority: 'Test priority'}]);
        model.priorities(prioritiesFromJSONEditor);
        model.saveManagementUnitPriorities();
        var expected = {
            url: options.managementUnitSaveUrl,
            type: 'POST',
            data: '{"priorities":[{"category":"Test","priority":"Test priority"}]}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);
        expect(bootbox.alert).toHaveBeenCalledWith("Management Unit priorities saved!");

    });

    it("can allow users to modify the reporting period of RLP and core services reports", function () {
        var $window = {
            fcConfig: window.fcConfig,
            location: {
                reload: function() {}
            }
        }
        var options = {
            managementUnitSaveUrl: '/test/url',
            regenerateManagementUnitReportsUrl: '/test/regenUrl',
            healthCheckUrl: '/test/health',
            $window: $window
        };
        var config = {
            managementUnitReports: [{
                "reportType": "Administrative",
                "reportDescriptionFormat": "Core services report %d for %4$s",
                "reportNameFormat": "Core services report %d",
                "category": "Core Services Reporting",
                "activityType": "RLP Core Services report"
            }],
            projectReports: [{
                "reportType": "Activity",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 6,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report",
                "canSubmitDuringReportingPeriod": true
            }]
        };
        $.blockUI = jasmine.createSpy('blockUI', function () {
        }); // Stub out the block UI

        var mu = {name: 'Test MU', managementUnitId: "m1", config: config};
        var model = new ManagementUnitPageViewModel(mu, options);


        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success: true});
            return d.promise();
        });


        model.activityReportingPeriod(model.activityReportingOptions[0].label);
        model.coreServicesPeriod(model.coreServicesOptions[0].label);

        model.saveReportingConfiguration();

        var expected = {
            url: options.managementUnitSaveUrl,
            type: 'POST',
            data: '{"config":{"managementUnitReports":[{"reportType":"Administrative","reportDescriptionFormat":"Core services report %d for %4$s","reportNameFormat":"Core services report %d","category":"Core Services Reporting","activityType":"RLP Core Services report","firstReportingPeriodEnd":"2018-07-31T14:00:00Z","reportingPeriodInMonths":1,"label":"Monthly"}],"projectReports":[{"reportType":"Activity","reportDescriptionFormat":"Year %5$s - %6$s %7$d Outputs Report","reportNameFormat":"Year %5$s - %6$s %7$d Outputs Report","reportingPeriodInMonths":3,"description":"","category":"Outputs Reporting","activityType":"RLP Output Report","canSubmitDuringReportingPeriod":true,"firstReportingPeriodEnd":"2018-09-30T14:00:00Z","label":"Quarter"}]},"startDate":"","endDate":""}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);

        expected = {
            url: options.regenerateManagementUnitReportsUrl,
            type:'POST',
            data:'{"managementUnitReportCategories":["Core Services Reporting"],"projectReportCategories":["Outputs Reporting"]}',
            dataType:'json',
            contentType:'application/json'
        }
        expect($.ajax).toHaveBeenCalledWith(expected);
    });


});
