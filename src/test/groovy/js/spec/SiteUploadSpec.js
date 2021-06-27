describe("The SiteUploadViewModel is responsible for the site upload page", function() {

    var attributes = ["name", "area", "id"];
    var projectId = "p1";
    var shapefileId = "s1";
    var shapes = [];
    for (var i=0; i<5; i++) {
        shapes.push( {
            id:"id-"+i,
            values:{
                name:"name "+i,
                area:2,
                id:"id"+i
            }
        });
    }
    var config = {
        saveSitesUrl: '/site/upload',
        siteUploadProgressUrl: '/site/uploadProgress'
    };
    var model;

    var modal;
    beforeAll(function() {
        modal = $.fn.modal;
        $.fn.modal = function() {};
        jasmine.clock().install();
    });

    afterAll(function() {
        $.fn.modal = modal;
        jasmine.clock().uninstall();
    });

    beforeEach(function() {
        model = new SiteUploadViewModel(attributes, shapes, projectId, shapefileId, config);
    });

    it("The site upload view model can upload sites and track progress", function(done) {
        expect(model.selectedCount()).toEqual(5);
        var deferred = $.Deferred();
        spyOn($, 'ajax').and.returnValue(deferred);

        model.save();
        var expectedSiteData = '{"shapeFileId":"s1","projectId":"p1","sites":[{"id":"id-0","name":"name 0"},{"id":"id-1","name":"name 1"},{"id":"id-2","name":"name 2"},{"id":"id-3","name":"name 3"},{"id":"id-4","name":"name 4"}]}';
        expect($.ajax).toHaveBeenCalledWith({url:config.saveSitesUrl, type:'POST', contentType:'application/json', data: expectedSiteData})

        deferred.resolve({data:{progress:{uploaded: 0, total: 5}}});

        expect(model.progress()).toEqual('0%');
        expect(model.progressText()).toEqual("Uploaded 0 of 5 sites");

        var url;
        var doneCallback;
        spyOn($, 'get').and.callFake(function(aUrl, aDoneCallback) {url = aUrl; doneCallback = aDoneCallback;});
        jasmine.clock().tick(2001);

        expect($.get).toHaveBeenCalled();
        expect(url).toEqual(config.siteUploadProgressUrl);

        var progress = {
            uploaded: 4,
            total: 5
        };
        doneCallback(progress);
        expect(model.progress()).toEqual('80%');
        expect(model.progressText()).toEqual("Uploaded 4 of 5 sites 80%");

        jasmine.clock().tick(2001);
        progress = {
            uploaded: 5,
            total: 5,
            finished:true
        };
        doneCallback(progress);
        expect(model.progress()).toEqual('100%');
        expect(model.progressText()).toEqual("Uploaded 5 of 5 sites 100%");
        expect(model.finished()).toBeTrue();
        done();
    });
});