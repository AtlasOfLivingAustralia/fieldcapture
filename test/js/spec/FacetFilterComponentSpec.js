/*
 * Copyright (C) 2019 Atlas of Living Australia
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
 * 
 * Created by Temi on 19/11/19.
 */
describe("Facet filter component unit tests", function () {

    var vm = null;
    var mockElement = null;
    var facetFilterVM = null;
    beforeAll(function() {
        vm = {
            facetsList : ["status", "organisationFacet"],
            results: {"facets":{"status":{"terms":[{"term":"Completed","count":2}]},"organisationFacet":{"terms":[{"term":"Rangelands","count":2},{"term":"Rangelands NRM Co-ordinating Group (Inc.) ","count":2}]}}},
            fqLink: "/fieldcapture/home/projectExplorer?fq=ibraFacet%3AAvon+Wheatbelt",
            baseUrl: "?fq=ibraFacet%3AAvon+Wheatbelt",
            projectExplorerUrl: "/fieldcapture/home/projectExplorer",
            max: 1
        };

        mockElement = document.createElement('div');
        mockElement.id = 'facetContent';
        var facetFilter = document.createElement('facet-filter');
        facetFilter.setAttribute('params',"facetsList : facetsList, results:  results, fqLink: fqLink, baseUrl: baseUrl, projectExplorerUrl: projectExplorerUrl, max: max" );
        mockElement.appendChild(facetFilter);
        ko.applyBindings(vm, mockElement);
    });


    it("should map data correctly to component view model", function() {
        facetFilterVM = ko.dataFor($(mockElement).find('facet-filter div')[0]);
        expect(facetFilterVM.getFQForTerm('organisationFacet', 'Rangelands NRM Co-ordinating Group (Inc.) ')).toEqual("fq=organisationFacet:Rangelands%20NRM%20Co-ordinating%20Group%20(Inc.)%20");
        expect(facetFilterVM.generateFQLink('organisationFacet', 'Rangelands NRM Co-ordinating Group (Inc.) ')).toEqual("/fieldcapture/home/projectExplorer?fq=ibraFacet%3AAvon+Wheatbelt&fq=organisationFacet:Rangelands%20NRM%20Co-ordinating%20Group%20(Inc.)%20");
        expect(facetFilterVM.getFacetTermsLength('organisationFacet')).toEqual(2);
        expect(facetFilterVM.getSelectedTerms().length).toEqual(0);
        facetFilterVM.getFacetTerms('organisationFacet')[0].selected(1);
        expect(facetFilterVM.getSelectedTerms().length).toEqual(1);
    });

    it("should render component template correctly", function () {
        expect($(mockElement).find('.fa.fa-plus').length).toEqual(2);
        expect($(mockElement).find('.moreFacets').length).toEqual(1);
        expect($(mockElement).find('input').length).toEqual(4);
    })
});