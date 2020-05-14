describe("", function () {

    var bootboxMessage;

    beforeAll(function () {
        window.bootbox = {
            alert: function (message) {
                bootboxMessage = message;
            }
        }
    });
    afterAll(function () {
        delete window.bootbox;
    });

    it("will set the defaults based on the current date constrained to the project start and end dates", function() {
        var project = {
            plannedStartDate: '2018-01-01T13:00:00Z',
            plannedEndDate: '2020-01-01T13:00:00Z'
        };
        var options = {
            riskChangesReportHtmlUrl: '/html',
            riskChangesReportPdfUrl: '/pdf'
        };
        jasmine.clock().withMock(function() {


            jasmine.clock().mockDate(new Date('2019-01-01T13:00:00Z'));
            // The jasmine clock().install() interferes with our augmentation of Date
            Date.fromISO= function(s){ return new Date(s); };
            var viewModel = new RisksReportViewModel(project, options);

            expect(viewModel.fromDate()).toEqual("2018-10-01T14:00:00Z");
            expect(viewModel.toDate()).toEqual("2019-01-01T13:00:00Z");

            jasmine.clock().mockDate(new Date('2020-02-01T13:00:00Z'));
            Date.fromISO= function(s){ return new Date(s); };

            var viewModel = new RisksReportViewModel(project, options);

            expect(viewModel.fromDate()).toEqual("2019-11-01T13:00:00Z");
            expect(viewModel.toDate()).toEqual("2020-01-01T13:00:00Z");

            jasmine.clock().mockDate(new Date('2017-11-01T13:00:00Z'));
            Date.fromISO= function(s){ return new Date(s); };

            var viewModel = new RisksReportViewModel(project, options);

            expect(viewModel.fromDate()).toEqual("2018-01-01T13:00:00Z");
            expect(viewModel.toDate()).toEqual("2018-01-01T13:00:00Z");

        });



    });


    it("will generate a URL based on the supplied properties", function() {
        var project = {
            plannedStartDate: '2018-01-01T13:00:00Z',
            plannedEndDate: '2020-01-01T13:00:00Z'
        };
        var options = {
            riskChangesReportHtmlUrl: '/html',
            riskChangesReportPdfUrl: '/pdf'
        };
        jasmine.clock().withMock(function() {
            jasmine.clock().mockDate(new Date('2019-01-01T13:00:00Z'));
            // The jasmine clock().install() interferes with our augmentation of Date
            Date.fromISO= function(s){ return new Date(s); };
            var viewModel = new RisksReportViewModel(project, options);

            var previous = window.open;
            try {
                var suppliedUrl;
                var suppliedName;
                window.open = function(url, name) {
                    suppliedUrl = url;
                    suppliedName = name;
                };
                viewModel.generateRisksReportHTML();
                expect(suppliedUrl).toEqual("/html?fromDate2018-10-01T14:00:00Z&toStage=2019-01-01T13:00:00Z&sections=Project+risks+changes&orientation=portrait");
                viewModel.generateRisksReportPDF();
                expect(suppliedUrl).toEqual("/pdf?fromDate2018-10-01T14:00:00Z&toStage=2019-01-01T13:00:00Z&sections=Project+risks+changes&orientation=portrait");
            }
            finally {
                window.open = previous;
            }
        });
    });
});