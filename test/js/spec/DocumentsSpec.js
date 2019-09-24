describe("The documents contains view models for working with documents", function() {

    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
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


});