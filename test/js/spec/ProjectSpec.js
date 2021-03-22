describe("ProjectViewModel Spec", function () {
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
        if (!window.bootbox) {
            window.bootbox = {alert:function(term){
                    console.log("Test: " + term);
                }}
        }
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("should be able to be initialised from an object literal", function () {

        var projectData = {
            name:'Name',
            description:'Description'
        };
        var organisations = [];
        var isEditor = true;
        var project = new ProjectViewModel(projectData, isEditor, organisations);

        expect(project.name()).toEqual(projectData.name);
        expect(project.description()).toEqual(projectData.description);
        expect(project.projectStatus).toEqual([{id: 'application', name:'Application'}, {id: 'active', name:'Active'},{id:'completed',name:'Completed'},{id:'deleted', name:'Deleted'}, {id:'terminated', name: 'Terminated'}])
    });



    it("should identify mobile app and social media links", function() {
        var urlAndroid = 'http://play.google.com/store/apps/myApp'
        var urlFacebook = 'http://www.facebook.com/myFace'
        var projectData = {
            links: [
                {
                    role:'android',
                    url:urlAndroid
                },
                {
                    role:'facebook',
                    url:urlFacebook
                }
            ]
        };

        var project = new ProjectViewModel(projectData);
        expect(project.transients.mobileApps()).toEqual({
            asymmetricMatch: function(actual) {
                expect(actual.length).toBe(1);
                expect(actual[0].name).toBe('Android');
                expect(actual[0].link.url).toBe(urlAndroid);
                return true;
            }
        });
        expect(project.transients.socialMedia()).toEqual({
            asymmetricMatch: function(actual) {
                expect(actual.length).toBe(1);
                expect(actual[0].name).toBe('Facebook');
                expect(actual[0].link.url).toBe(urlFacebook);
                return true;
            }
        });

    });

    it("should project should display project status and termination reason", function (){
        let projectData = {
            status: 'terminated',
            terminationReason: "Termination Reason"
        }
        var org = [];
        var isEditor = true
        let project = new ProjectViewModel(projectData, isEditor, org)
        expect(project.status()).toEqual(projectData.status)
        expect(project.terminationReason()).toEqual(projectData.terminationReason)
    });
});
