package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.test.mixin.TestFor
/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestFor(ModelTagLib)
class ModelTagLibTests {

    /**
     * A lame regression test before I start making changes - tests a fairly simple row layout behaves as expected.
     * (The items in the row divide neatly into the bootstrap 12 column layout)
     */
    void testRowLayout() {
        def model = buildSimpleModel()
        def viewModelStr = """
            [{
                "type":"row",
                "items": [
                    {"type":"text", "source":"item1", "preLabel":"item1Label"},
                    {"type":"text", "source":"item2", "preLabel":"item2Label"},
                    {"type":"text", "source":"item3", "preLabel":"item3Label"}
                ]
             }]
        """
        model.viewModel = JSON.parse(viewModelStr)

        def expectedResult = /<div class="row-fluid space-after">\s*<span class="span4">\s*<span class="label preLabel">item1Label<\/span>\s*<input class="input-small" data-bind='value:data.item1' type='text' class='input-small'\/>\s*<\/span><span class="span4">\s*<span class="label preLabel">item2Label<\/span><input class="input-small" data-bind='value:data.item2' type='text' class='input-small'\/><\/span><span class="span4">\s*<span class="label preLabel">item3Label<\/span><input class="input-small" data-bind='value:data.item3' type='text' class='input-small'\/><\/span><\/div>\s*/

        def result = applyTemplate('<md:modelView model="${model}" edit="true"/>', [model: model ])
        assert result =~ expectedResult

    }

    /**
     * Tests that a viewModel containing rows with nested columns is rendered correctly.
     */
    void testRowWithNestedColumns() {
        def model = buildSimpleModel()
        def viewModelStr = """
            [{
                "type":"row",
                "items": [
                    {"type":"col",
                     "items":[
                        {"type":"text", "source":"item1", "preLabel":"item1Label"}
                    ]},
                    {"type":"col",
                    "items":[
                        {"type":"text", "source":"item2", "preLabel":"item2Label"}
                    ]}
                ]
            },
            {
                "type":"row",
                "items":[{"type":"text", "source":"item3", "preLabel":"item3Label"}]
            }]}
        """
        model.viewModel = JSON.parse(viewModelStr)

        def expectedResult = /<div class="row-fluid space-after">\s*<div class="span6">\s*<div class="row-fluid">\s*<span class="span12">.*<\/span><\/div>\s*<\/div>\s*<div class="span6">\s*<div class="row-fluid">\s*<span class="span12">.*<\/span><\/div>\s*<\/div>\s*<\/div>\s*<div class="row-fluid space-after">.*<\/div>/
        def result = applyTemplate('<md:modelView model="${model}" edit="true"/>', [model: model])

        assert result.replaceAll("\n", " ") =~ expectedResult
    }

    def buildSimpleModel() {
        def model = """
                    {
                    "modelName":"Test",
                    "dataModel":[
                        {"name":"item1","dataType":"text"},
                        {"name":"item2","dataType":"text"},
                        {"name":"item3","dataType":"text"}
                    ],
                    "viewModel":[]
                    }
                    """
        return JSON.parse(model)
    }

}