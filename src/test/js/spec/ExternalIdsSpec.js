/*
 * Copyright (C) 2022 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 */
describe("External-ids component unit tests", function () {

    var mockElement = null;
    var viewModel = null;


    beforeAll(function() {
        jasmine.clock().install();

        viewModel = {
            externalIds: ko.observableArray(),
            validationFunction: function() {
                return null;
            },
            externalIdTypes:['TYPE_1', 'TYPE_2', 'TYPE_3'],
        };

        mockElement = document.createElement('div');
        mockElement.id = 'externalIdContainer';
        document.body.appendChild(mockElement);

        var externalIds = document.createElement('external-ids');
        externalIds.setAttribute('params',"externalIds : externalIds, externalIdTypes: externalIdTypes,  validationNamespace:'testValidation', validation:validationFunction" );
        mockElement.appendChild(externalIds);
        ko.applyBindings(viewModel);
    });


    afterAll(function() {
        jasmine.clock().uninstall();
        document.body.removeChild(mockElement);
    })


    it("should render the component template correctly", function () {
        var addExternalIdButton = $(mockElement).find('#addExternalIdButton');
        expect(addExternalIdButton.length).toEqual(1);

        addExternalIdButton.click();

        var externalIds = $(mockElement).find(".idList li");
        expect(externalIds.length).toEqual(1);
        expect(viewModel.externalIds().length).toEqual(1);

        var idField = $(mockElement).find("input[name=externalId]");
        $(idField).val("id-1");
        $(idField).trigger('change')
        jasmine.clock().tick(100);

        expect(viewModel.externalIds()[0].externalId()).toEqual("id-1");
        expect(viewModel.externalIds()[0].idType()).toEqual(viewModel.externalIdTypes[0]);
        var remove = $(mockElement).find('.fa-remove');
        remove.click();

        jasmine.clock().tick(100);
        var externalIds = $(mockElement).find(".idList li");
        expect(externalIds.length).toEqual(0);
        expect(viewModel.externalIds().length).toEqual(0);

    });

    it("Should allow any existing id types to be usable, even if they aren't in the supplied list of types", function (done) {
        var vmParams = {
            externalIds:ko.observableArray([
                {idType:ko.observable("TYPE_1"), externalId:ko.observable("External id 1")},
                {idType:ko.observable("TYPE_2"), externalId: ko.observable("External id 2")}]),
            externalIdTypes:['TYPE_2', "TYPE_3"]
        };
        ko.components.get('external-ids', function(component, config) {

            var viewModel = component.createViewModel(vmParams);
            expect(ko.mapping.toJS(viewModel.externalIdTypes)).toEqual([{ label: 'TYPE_1', value: 'TYPE_1' }, { label: 'TYPE_2', value: 'TYPE_2' }, { label: 'TYPE_3', value: 'TYPE_3' }]);

            done();
        })
    });
});
