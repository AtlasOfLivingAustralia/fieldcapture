describe("ProjectViewModel Spec", function () {
    beforeAll(function () {
        window.fcConfig = {
            imageLocation: '/'
        };
        if (!window.bootbox) {
            window.bootbox = {
                alert: function (term) {
                    console.log("Test: " + term);
                }
            }
        }
    });
    afterAll(function () {
        delete window.fcConfig;
    });

    // This is to stub the data returned from the MERIT call /project/targetsAndScoresForActivity
    var scoresAndTargetsData = {
        resp: {
            projectScores:[{
                scoreId: 'score-1',
                label: 'Score 1',
                result: {
                    result: 4
                },
                target: 2,
                overDelivered: true
            },
            {
                scoreId: 'score-2',
                label: 'Score 2',
                result: {
                    result: 1
                },
                target: 2,
                overDelivered: false
            },
            {
                scoreId: 'score-3',
                label: 'Score 3',
                result: {
                    result: 100
                },
                target: 41,
                overDelivered: true
            }],
            activityScores:[{
                scoreId: 'score-1',
                label: 'Score 1',
                result: {
                    result: 1
                },
                target: 2,
                overDelivered: false
            },
            {
                scoreId: 'score-2',
                label: 'Score 2',
                result: {
                    result: 1
                },
                target: 2,
                overDelivered: false
            },
            {
                scoreId: 'score-3',
                label: 'Score 3',
                result: {
                    result: 0
                },
                target: 41,
                overDelivered: true
            }]
        }
    };

    it("Will filter scores and targets so that only over-delivered scores with a contribution from the current activity are returned", function () {

        var passedUrl;
        spyOn($, 'get').and.callFake(function(url) {
            passedUrl = url;
            var fakeResult = $.Deferred();
            fakeResult.resolve(scoresAndTargetsData);
            return fakeResult;
        });

        var options = {projectTargetsAndScoresUrl:'/project/projectTargetsAndScores'};

        var reportService = new ReportService(options);
        reportService.findOverDeliveredTargets('a1').done(function(overDeliveredTargets) {
            expect(passedUrl).toEqual('/project/projectTargetsAndScores?activityId=a1');
            expect(overDeliveredTargets.length).toEqual(1);
            expect(overDeliveredTargets[0].overall.scoreId).toEqual("score-1");
        });
    });

    it("findOverDeliveredTargets will fail when the service returns in invalid response", function () {

        var passedUrl;
        spyOn($, 'get').and.callFake(function(url) {
            passedUrl = url;
            var fakeResult = $.Deferred();
            fakeResult.resolve(null);
            return fakeResult;
        });

        var options = {projectTargetsAndScoresUrl:'/project/projectTargetsAndScores'};

        var reportService = new ReportService(options);
        reportService.findOverDeliveredTargets('a1').fail(function() {
            expect(passedUrl).toEqual('/project/projectTargetsAndScores?activityId=a1');
        }).done(function() {
            fail();
        });
    });

    it("Can format over-delivered targets in a consistent way for display to the user", function () {
        var reportService = new ReportService({});
        var message = reportService.formatOverDeliveredTarget({
            scoreId: 'score-1',
            label: 'Score 1',
            result: {
                result: 4
            },
            target: 2,
            overDelivered: true
        });

        expect(message).toEqual('Score 1: 4 of 2 (200%)');

        message = reportService.formatOverDeliveryMessage([
            {
                overall: {
                    scoreId: 'score-1',
                    label: 'Score 1',
                    result: {
                        result: 4
                    },
                    target: 2,
                    overDelivered: true
                },
                report: {
                    scoreId: 'score-1',
                    label: 'Score 1',
                    result: {
                        result: 1
                    },
                    target: 2,
                    overDelivered: false
                }
            }
    ]);
        expect(message).toEqual('<p><strong>Targets for this project have been over-delivered.</strong></p>Please check the reported data for the following targets: <ul><li>Score 1: 4 of 2 (200%)</li></ul>');
    });
});