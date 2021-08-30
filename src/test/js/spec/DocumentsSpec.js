describe("The documents contains view models for working with documents", function() {

    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };

        // $.fn.fileupload = function () {
        //         console.log("Retuning on")
        // }

    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("Can decide whether document roles are public based on metadata", function() {

        var documentViewModel = new DocumentViewModel({}, {projectId:'p1'});

        expect(documentViewModel.hasPublicRole()).toBeFalsy();

        _.each(documentRoles, function(role) {

            documentViewModel.public(true);
            documentViewModel.role(role.id);

            // The view fires this event on change.
            documentViewModel.onRoleChange(role.id);

            expect(documentViewModel.hasPublicRole()).toEqual(role.isPublicRole);
            if (!role.isPublicRole) {
                expect(documentViewModel.public()).toBeFalsy();
            }
        });

    });

    // function ajax_response() {
    //     var deferred = $.Deferred().resolve();
    //     return deferred.promise();
    // }
    // it("should able to close the document modal without any error", function () {
    //     var options = {
    //         documentUpdateUrl: "document/documentUpdate",
    //         modalSelector: "#attachDocument",
    //         report: {}
    //     }
    //
    //     var editableDocumentsViewModel = new EditableDocumentsViewModel(options);
    //
    //     var showModal = new showDocumentAttachInModal(options.documentUpdateUrl, {reportId: "234"}, options.modalSelector, options.modalSelector, "#preview")
    //     editableDocumentsViewModel.attachDocument()
    //     spyOn($(options.modalSelector), 'fileupload').and.returnValue(
    //         ajax_response()
    //     )
    // failing in the fileupload.
    //     expect("showDocumentAttachInModal"["attachViewModelToFileUpload"]).toHaveBeenCalled();
    //
    // //    expect(editableDocumentsViewModel.size() === 0)
    // })
});
