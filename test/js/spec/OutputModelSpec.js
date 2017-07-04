describe("OutputModel Spec", function () {

    var config = {
        model:{
            'pre-populate':[{

                "source": {
                    "context-path": ""
                },
                "mapping": [{
                    "target": "notes",
                    "source-path": "some.notes"
                }]
            }]
        }
    };

    beforeAll(function() {
        window.fcConfig = {};
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("should allow the output model to be populated from supplied data", function () {
        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, {}, {});

        model.loadData({
            notes:'test'
        });

        expect(model.data.notes()).toEqual("test");


    });


    it("should allow the output model to be populated by the pre-populate configuration if no output data is supplied", function() {

        var context = {
            some: {
                notes:'test'
            }
        };
        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        model.loadData();

        expect(model.data.notes()).toEqual("test");

    });

    it("should use supplied output data in preference to pre-populate data", function() {

        var context = {
            some: {
                notes:'test'
            }
        };

        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        model.loadData({notes:'test 2'});

        expect(model.data.notes()).toEqual("test 2");

    });

    it ("should be able to merge prepop data", function() {
        var context = {
            some: {
                notes:'test',
                soilSampleCollected:true
            }
        };

        var data = {
            some: {
                notes:'test 2'
            }
        };

        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        var result = model.merge(data, context);

        console.log(result);

        expect(result.some.notes).toEqual('test 2');
        expect(result.some.soilSampleCollected).toEqual(true);
    });

    it ("should be able to merge arrays", function() {
        var context = {
            notes:'test',
            surveyResultsFlora:[{
                health:'good',
                plotId:'1'
            },
            {
                health:"fair",
                plotId:'2'
            }]
        };

        var data = {
            some: {
                notes:'test 2'
            }
        };

        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        var result = model.merge(data, context);

        expect(result.some.notes).toEqual('test 2');
        expect(result.surveyResultsFlora).toEqual(context.surveyResultsFlora);
    });

    it ("should be able to merge arrays", function() {
        var context = {
            notes:'test',
            surveyResultsFlora:[{
                    health:'good',
                    plotId:'1'
                }, {
                    health:"fair",
                    plotId:'2'
                }]
        };

        var data = {
            notes:'test 2',
            surveyResultsFlora:[{
                health:'good',
                plotId:'2'
            }, {}]
        };

        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        var result = model.merge(data, context);

        expect(result.notes).toEqual('test 2');
        expect(result.surveyResultsFlora).toEqual([data.surveyResultsFlora[0], context.surveyResultsFlora[1]]);
    });

    it ("this is a kind of weird behaviour required for a specific form.", function() {
        var context = {
            notes:'test',
            surveyResultsFlora:[{
                health:'good',
                plotId:'1'
            }, {
                health:"fair",
                plotId:'2'
            }]
        };

        var data = {
            notes:'test 2',
            surveyResultsFlora:[{
                health:'fair'
            }]
        };

        var model = new Flora_Survey_Details_ViewModel({name:"Flora Survey Details"}, context, config);

        var result = model.merge(data, context);

        expect(result.notes).toEqual('test 2');
        expect(result.surveyResultsFlora).toEqual([{health:'fair', plotId:'1'}]);
    });
});