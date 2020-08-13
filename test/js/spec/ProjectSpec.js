describe("ProjectViewModel Spec", function () {
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
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

    // this is to check if fundings to convert to javascript object. so JSON.Stringify can able to convert it
    it('should fundings functional array objects convert to ko.toJS ', function () {
        var projectData = {fundings:[{fundingSource:"Public - commonwealth", fundingType:"RLP", fundingSourceAmount:100}, {fundingSource:"Public - state", fundingType:"NON-RLP", fundingSourceAmount:100} ]}
        var projects = new ProjectViewModel(projectData);
        expect(projectData.fundings[0].fundingSource).toEqual(projects.fundingData[0].fundingSource);
        expect(projectData.fundings[0].fundingType).toEqual(projects.fundingData[0].fundingType);
        expect(projectData.fundings[0].fundingSourceAmount).toEqual(projects.fundingData[0].fundingSourceAmount);
    });

});
