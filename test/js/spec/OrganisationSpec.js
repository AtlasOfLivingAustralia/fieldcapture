describe("OrganisationViewModel Spec", function () {
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
        if (!window.bootbox) {
            window.bootbox = {alert:function(orgDetails){
                    console.log("OrgDetails Test: " + orgDetails);
                }}
        }
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("should serialize into JSON which does not contain any fields that are only useful to the view", function() {
        var organisation = { organisationId:'1', name:"Org 1", description:'Org 1 description', collectoryInstitutionId:'dr123', newsAndEvents:'this is the latest news', documents:[], links:[]};

        var model = new OrganisationViewModel(organisation);

        var json = model.modelAsJSON(true);

        var expectedJS = jQuery.extend({}, organisation);
        delete expectedJS.collectoryInstitutionId;  // This field shouldn't be updated.

        expect(JSON.parse(json)).toEqual(expectedJS);

    });

    function ajax_response(response) {
        var deferred = $.Deferred().resolve(response);
        return deferred.promise();
    }

    // first unit test
    it('should get name based on the abn provided', function () {
        let options = {prepopulateAbnUrl: "test/url"};

        let abnDetails = {abn: "11111111111", name: "test org"}
        let organisation = {organisationId: "1234", name: "OrgName"}

        spyOn($, 'get').and.returnValue(
            ajax_response(abnDetails)
        );

        var model = new OrganisationViewModel(organisation,options);
        model.abn = "11111111111";
        model.prepopulateFromABN();

        expect(model.name()).toEqual(abnDetails.name);
    });  // end it


    it('should return alert when abn number is invalid - provided', function () {
        let options = {prepopulateAbnUrl: "test/url"};
        let abnDetails = {abn: "", name: "", error: "invalid"}
        let organisation = {organisationId: "1234", name: "OrgName"}

        spyOn($, 'get').and.returnValue(
            ajax_response(abnDetails)
        );

        spyOn(bootbox, 'alert');

        var model = new OrganisationViewModel(organisation, options);
        model.abn = "11111111111";
        model.prepopulateFromABN();

        expect(bootbox.alert).toHaveBeenCalledWith('Abn Number is invalid');
    });


    it('should return alert when we service is failed', function () {

        let options = {prepopulateAbnUrl: "test/url"};
        let organisation = {organisationId: "12345", name: "OrgName"}

        spyOn($, 'get').and.callFake(function () {
            return $.Deferred().reject().promise();
        });

        spyOn(bootbox, 'alert');

        var model = new OrganisationViewModel(organisation, options);
        model.abn = "12345678901";
        model.prepopulateFromABN();

        expect(bootbox.alert).toHaveBeenCalledWith('Abn Web Service is failed to lookup abn name. Please press ok to continue to create organisation');
        expect(model.name()).toEqual(" ");
    });



});
