describe("", function () {

    var bootboxMessage;

    beforeAll(function() {
        window.bootbox = {
            alert:function (message) {
                bootboxMessage = message;
            }
        }
    });
    afterAll(function() {
        delete window.bootbox;
    });

    it("Will display a success message if the download request returns json", function() {
        var config = {
            downloadButtonSelector: '#downloadXlsxButton',
            downloadTabsSelector: '#downloadTabSelection',
            downloadXlsxUrl: "/downloadXlsx"
        };

        var usedParams = null;
        var xhrStub = {
            getResponseHeader: function() {return 'application/json';}
        };
        spyOn($, 'ajax').and.callFake(function(params) {
            usedParams = params;
            return $.Deferred().resolve({'resp':'this a a fake response'}, 'success', xhrStub).promise();
        });
        var viewModel = new DownloadViewModel(config);

        viewModel.downloadXlsx();

        expect(usedParams.url).toEqual(config.downloadXlsxUrl);
        expect(bootboxMessage.indexOf("The download may take several minutes to complete")).toEqual(0);

    });

    it("Will display a failure message if the download request returns html due to a CAS redirect", function() {
        var config = {
            downloadButtonSelector: '#downloadXlsxButton',
            downloadTabsSelector: '#downloadTabSelection',
            downloadXlsxUrl: "/downloadXlsx"
        };

        var usedParams = null;
        var xhrStub = {
            getResponseHeader: function() {return 'text/html';}
        };
        spyOn($, 'ajax').and.callFake(function(params) {
            usedParams = params;
            return $.Deferred().resolve({'resp':'this a a fake response'}, 'success', xhrStub).promise();
        });
        var viewModel = new DownloadViewModel(config);

        viewModel.downloadXlsx();

        expect(usedParams.url).toEqual(config.downloadXlsxUrl);
        expect(bootboxMessage.indexOf("There was an error submitting your download request")).toEqual(0);

    });
});