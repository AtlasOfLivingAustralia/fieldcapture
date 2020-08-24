describe("The help links view model is used for the page that allows MERIT help links to be updated", function () {

    var bootboxMessage;

    beforeAll(function () {
        window.bootbox = {
            alert: function (message) {
                bootboxMessage = message;
            }
        };
        ko.simpleDirtyFlag = function(){ return {isDirty:ko.observable(false), reset:function() {}}};
        $.blockUI = function() {};
        $.unblockUI = function() {};
        window.fcConfig = {
            imageLocation:'/images'
        }
    });
    afterAll(function () {
        delete window.bootbox;
        delete window.fcConfig;
    });

    it("", function () {
        var options = {
            clearCacheUrl: '/clearCache',
            documentBulkUpdateUrl: '/bulkUpdate',
            validationElementSelector: '#help-resources',
            healthCheckUrl: '/ping'
        };
        var links = [
            {externalUrl:"test 1"}
        ];
        var viewModel = new HelpLinksViewModel(links, options);

        expect(viewModel.helpLinks().length).toEqual(1);
        expect(viewModel.helpLinks()[0].role()).toEqual('helpResource');

        // Stub responses for the ajax calls
        var respStubs = [{status:'ok'}, {}, {}];
        var count = 0;
        var results = [];
        spyOn($, 'ajax').and.callFake(function (req, data) {

            results.push({request:req, data:data});
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve(respStubs[count++]);
            return d.promise();
        });


        viewModel.save();
        expect(results[0].request).toEqual(options.healthCheckUrl);
        expect(results[1].request.url).toEqual(options.documentBulkUpdateUrl);
        expect(results[1].request.type).toEqual('POST');

        var resultsData = JSON.parse(results[1].request.data);
        expect(resultsData[0].externalUrl).toEqual(links[0].externalUrl);
        expect(resultsData[0].role).toEqual('helpResource');

        expect(results[2].request.url).toEqual(options.clearCacheUrl);
        expect(results[2].request.data).toEqual({cache:'homePageDocuments'});

    });
});