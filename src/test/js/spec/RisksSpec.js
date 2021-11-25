describe("Risks Spec", function () {

    it("includes a dateUpdated field when the risks and threats are saved", function() {
        var risks = {};
        var risksModel = new Risks(risks, rlpRiskModel(), false, 'risk');

        var savedCalled = false;
        risksModel.risks.saveWithErrorDetection = function() {
            savedCalled  = true;
        };

        var validateResult = true;
        spyOn($.fn, 'validationEngine').and.callFake(function() {
            return validateResult;
        });
        var now = new Date().toISOStringNoMillis();
        risksModel.saveRisks();
        expect(risksModel.risks.dateUpdated).toBeGreaterThanOrEqual(now);
        expect(savedCalled).toBeTrue();

        validateResult = false;
        savedCalled = false;

        risksModel.saveRisks();
        expect(savedCalled).toBeFalse();

    });

});