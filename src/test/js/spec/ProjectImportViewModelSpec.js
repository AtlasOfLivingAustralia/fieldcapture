describe("ProjectImportViewModel Spec", function (){

    var viewModel = null;
    beforeAll(function (){
        var config = {
            importUrl:'/import',
            importProgressUrl:'/import_progress'
        };
        viewModel = new ProjectImportViewModel(config);
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it('should provide options to the jquery file upload component', function () {
        viewModel.update(false);
        expect(viewModel.uploadOptions.formData()).toEqual([{name:'preview', value:true}, {name:'update', value:false}]);
        viewModel.update(true);
        expect(viewModel.uploadOptions.formData()).toEqual([{name:'preview', value:true}, {name:'update', value:true}]);

        viewModel.uploadOptions.done({}, {result:{projects:[]}});
        expect(viewModel.progressDetail()).toEqual([]);
        expect(viewModel.progressSummary()).toBeTruthy();
        expect(viewModel.preview()).toBeFalse();
        expect(viewModel.finished()).toBeFalse();
    });

    it('should update the user on the import process', function () {
        var d = $.Deferred();
        spyOn($, 'get').and.returnValue(d.promise());
        viewModel.finished(true);
        viewModel.showProgress();
        d.resolve({finished:true, progress:{projects:[]}});

        expect(viewModel.progressDetail()).toEqual([]);
    });

    it('It should adjust the progress indicators as the import progresses and completes', function() {
        spyOn($, 'ajax').and.callFake(function(url, config) {
            config.success({projects:[]});
            expect(viewModel.finished()).toBeTrue();
            expect(viewModel.progressDetail()).toEqual([]);
        });
        spyOn($, 'get').and.returnValue($.Deferred());
        viewModel.doImport();
        expect(viewModel.importing()).toBeTrue();
        expect(viewModel.progressSummary()).toBeTruthy();
        expect(viewModel.progressDetail()).toEqual([]);

    });

});
