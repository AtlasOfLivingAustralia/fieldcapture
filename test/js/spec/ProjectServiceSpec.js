describe("ProjectService Spec", function () {

    var savedBlockUI;
    var savedUnblockUI;
    beforeAll(function () {
        window.fcConfig = {};
        savedBlockUI = $.blockUI;
        savedUnblockUI = $.unblockUI;

        $.blockUI = function () {
        };
        $.unblockUI = function () {
        };
    });
    afterAll(function () {
        delete window.fcConfig;
        $.blockUI = savedBlockUI;
        $.unblockUI = savedUnblockUI;
    });

    it("Will return an empty array of budget headers if configured with the option excludeFinancialYearData", function () {
        var project = {plannedStartDate: '2019-12-31T13:00:00Z', plannedEndDate: '2023-12-31T13:00:00Z'};
        var options = {excludeFinancialYearData: true};
        var projectService = new ProjectService(project, options);

        expect(projectService.getBudgetHeaders()).toEqual([]);
    });

    it("Will return a list of financial years based on project dates", function () {
        var project = {plannedStartDate: '2019-12-31T13:00:00Z', plannedEndDate: '2023-12-31T13:00:00Z'};
        var options = {excludeFinancialYearData: false};
        var projectService = new ProjectService(project, options);

        expect(projectService.getBudgetHeaders()).toEqual(
            ['2019/2020', '2020/2021', '2021/2022', '2022/2023', '2023/2024']);
    });


    it("MERI plans cannot be approved for projets with no internal order number", function () {
        var project = {plannedStartDate: '2019-12-31T13:00:00Z', plannedEndDate: '2023-12-31T13:00:00Z'};
        var options = {excludeFinancialYearData: false};
        var projectService = new ProjectService(project, options);

        // Projects without an internal order number can't be approved.
        expect(projectService.canApproveMeriPlan()).toBeFalsy();
        project.internalOrderId = "IO1";
        expect(projectService.canApproveMeriPlan()).toBeTruthy();
    });

    it("The internal order number can be supplied when approving a plan", function (done) {
        var project = {plannedStartDate: '2019-12-31T13:00:00Z', plannedEndDate: '2023-12-31T13:00:00Z'};
        var options = {projectUpdateUrl: '/update/p1', approvalPlanUrl: '/approve/p1'};
        var projectService = new ProjectService(project, options);
        expect(projectService.canApproveMeriPlan()).toBeFalsy();

        var result = $.Deferred();
        var result2 = $.Deferred();
        var savedOptions1;
        var savedOptions2;
        spyOn($, 'ajax').and.callFake(function (options) {
            console.log(options)
            if (!savedOptions1) {
                savedOptions1 = options;
                return result;
            } else {
                savedOptions2 = options;
                return result2;
            }
        });

        spyOn($, 'blockUI');

        projectService.approvePlan({reason: 'test'}, "IO1");

        expect($.ajax).toHaveBeenCalled();
        expect($.blockUI).toHaveBeenCalled();

        expect(savedOptions1.url).toEqual('/update/p1');
        expect(savedOptions1.data).toEqual('{"internalOrderId":"IO1"}');

        result.resolve({});

        expect(savedOptions2.url).toEqual('/approve/p1');
        expect(savedOptions2.data).toEqual("{\"reason\":\"test\"}");

        done();

    });

    it("should check if project status terminated", function () {
        let project = {status: 'terminated'}
        let options = {projectUpdateUrl: '/update/p1', approvalPlanUrl: '/approve/p1'};
        let projectService = new ProjectService(project, options)
        console.log("is Project Terminated: " + projectService.isTerminated())
        expect(projectService.isTerminated()).toBeTrue()
    });

    it("should check if project status completed or Terminated", function () {
        let projectTerminated = {status: 'terminated'}
        let projectCompleted = {status: 'completed'}
        let options = {projectUpdateUrl: '/update/p1', approvalPlanUrl: '/approve/p1'};
        let projectServiceTerminated = new ProjectService(projectTerminated, options)
        let projectServiceCompleted = new ProjectService(projectCompleted, options)
        console.log("is Project Terminated: " + projectServiceTerminated.isCompletedOrTerminated());

        expect(projectServiceTerminated.isCompletedOrTerminated()).toBeTrue()
        expect(projectServiceCompleted.isCompletedOrTerminated()).toBeTrue()
    });

    it("should check if project status completed or Terminated as project status is active", function () {
        let project = {status: 'deleted'}
        let options = {projectUpdateUrl: '/update/p1', approvalPlanUrl: '/approve/p1'};
        let projectService = new ProjectService(project, options)
        console.log("is Project Terminated: " + projectService.isCompletedOrTerminated())
        expect(projectService.isCompletedOrTerminated()).toBeFalse()
    });

    it('should should check if the project is Locked using project status', function () {
        let project = {status: 'terminated'}
        let options = {projectUpdateUrl: '/update/p1', approvalPlanUrl: '/approve/p1'};
        let projectService = new ProjectService(project, options)
        console.log(projectService.isProjectDetailsLocked())
        expect(projectService.isProjectDetailsLocked()).toEqual(true)

    });
});
