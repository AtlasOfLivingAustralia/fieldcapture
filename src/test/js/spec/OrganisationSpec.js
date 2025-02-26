describe("OrganisationViewModel Spec", function () {
    var hasSimpleDirtyFlag = true;
    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
        if (!window.bootbox) {
            window.bootbox = {alert:function(orgDetails){
                    console.log("OrgDetails Test: " + orgDetails);
                }}
        }
        if (!$.unblockUI) {
            $.unblockUI = function() {};
        }
        if (!ko.simpleDirtyFlag) {
            hasSimpleDirtyFlag = false;
            ko.simpleDirtyFlag  = function() {
                this.isDirty = ko.observable(false);
                return this;
            };
        }

    });
    afterAll(function() {
        delete window.fcConfig;
        if (!hasSimpleDirtyFlag) {
            delete ko.simpleDirtyFlag;
        }
    });

    it("should serialize into JSON which does not contain any fields that are only useful to the view", function() {

        var coreServicesOptions = [
            {label:'Quarterly (First period ends 30 September 2023)', firstReportingPeriodEnd:'2023-09-30T14:00:00Z', reportingPeriodInMonths:3, reportConfigLabel:'Quarterly'}
        ];

        var organisation = {
            organisationId:'1',
            description:'Org 1 description',
            collectoryInstitutionId:'dr123',
            newsAndEvents:'this is the latest news',
            orgType:'Individual/Sole Trader',
            entityType:'IND',
            postcode:1234,
            externalIds:[],
            associatedOrgs:[],
            documents:[], links:[],
            businessNames:[],
            contractNames:[],
            indigenousOrganisationRegistration: []
        };

        var model = new EditOrganisationViewModel(organisation, {healthCheckUrl:'/'});

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

        let abnDetails = {abn: "11111111111", entityName: "test org", businessNames:['test org 1']}
        let organisation = {organisationId: "1234", name: "OrgName"}

        spyOn($, 'get').and.returnValue(
            ajax_response(abnDetails)
        );

        var model = new OrganisationViewModel(organisation,options);
        model.abn = "11111111111";
        model.prepopulateFromABN();

        expect(model.name()).toEqual(organisation.name); //Org name is not overwritten unless empty
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


    it("Organisation config can be saved", function() {
        var options = {organisationSaveUrl:'/test/url', healthCheckUrl:'/test/health'};
        var mu = { name: 'Test Org', organisationId:"org1" };
        var model = new OrganisationPageViewModel(mu, options);

        spyOn($, 'ajax').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });


        spyOn(window, 'blockUIWithMessage').and.callFake(function () {});
        spyOn($, 'unblockUI').and.callFake(function () {});

        var configFromJSONEditor = JSON.stringify([{excludes:[], config: 'Test config'}]);
        model.config(configFromJSONEditor);
        model.saveOrganisationConfiguration();
        var expected = {
            url: options.organisationSaveUrl,
            type: 'POST',
            data: '{"config":[{"excludes":[],"config":"Test config"}]}',
            dataType: 'json',
            contentType: 'application/json'
        };
        expect($.ajax).toHaveBeenCalledWith(expected);

    });

    it("Can tidy the case of the org entity name", function() {
        var options = {organisationSaveUrl:'/test/url', healthCheckUrl:'/test/health'};
        var org = { name: '', organisationId:"org1" };
        var model = new OrganisationPageViewModel(org, options);

        var inputOutput = [
            ["TEST ALL CAPS", "Test All Caps"],
            ["THE TEST FOR FIRST JOINING WORD", "The Test for First Joining Word"],
            ["Another test", "Another Test"],
            ["Already Correct", "Already Correct"]
        ];

        let result = {
            entityName:''
        };

        spyOn($, 'get').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve(result);
            return d.promise();
        });

        for (var i=0; i<inputOutput.length; i++) {
            model.name(''); // The name won't be overwritten if already set.
            result.entityName = inputOutput[i][0];
            model.prepopulateFromABN();


            expect(model.name()).toEqual(inputOutput[i][1]);
        }
    });

});
