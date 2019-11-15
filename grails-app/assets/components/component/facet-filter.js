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
 * Created by Temi on 8/11/19.
 */

ko.components.register('facet-filter', {
    viewModel: function (params) {

        var self = this;
        self.facetsList = params.facetsList;
        self.results = params.results;
        self.max = params.max || 5;
        self.fqLink = params.fqLink;
        self.baseUrl = params.baseUrl;
        self.projectExplorerUrl = params.projectExplorerUrl;
        self.containerId = params.containerId || "#facetsContent";

        self.getFacetTerms = function (facet) {
            return self.results && self.results.facets[facet].terms;
        };

        self.getFacetTermsLength = function (facet) {
            var terms = self.getFacetTerms(facet) || [];
            return terms.length;
        };

        self.generateFQLink = function (facetName, facetTerm) {
            return self.fqLink + '&' + self.getFQForTerm(facetName, facetTerm);
        };

        self.getFQForTerm = function (facetName, facetTerm){
            return  "fq=" + encodeURIComponent(facetName) + ":" + encodeURIComponent(facetTerm);
        };

        self.facetSearch = function () {
            var data = self.getSelectedTerms();
            var url = self.baseUrl || "?";
            window.location.href = self.projectExplorerUrl + url + "&" + data.join('&');
        };

        self.getSelectedTerms = function () {
            var result = [];
            for (var facet in self.results.facets) {
                var terms = self.results.facets[facet].terms;
                for (var i= 0; i < terms.length; i++) {
                    if (terms[i].selected())
                        result.push(self.getFQForTerm(facet, terms[i].term));
                }
            }

            return result;
        };

        self.capitalise = function (text) {
            text = text || "";
            return text.charAt(0).toUpperCase() + text.slice(1);
        };

        self.intHandlersAfterRender = function () {
            var expandedToggles = amplify.store('facetToggleState') || [];
            if ($(self.containerId).is(':visible')) {
                if (expandedToggles) {
                    for (var i=0; i<expandedToggles.length; i++) {
                        $('[data-name="'+expandedToggles[i]+'"]').collapse('show');
                    }
                }
            }

            // Remember facet toggle state.
            $(self.containerId).on('shown', function (e) {
                var facetName = $(e.target).data('name');
                var index = expandedToggles.indexOf(facetName);
                if (index < 0) {
                    expandedToggles.push(facetName);
                    amplify.store('facetToggleState', expandedToggles);
                }

                $('[data-target="#'+e.target.id+'"] i').removeClass('fa-plus').addClass('fa-minus');
            });

            $(self.containerId).on('hidden', function (e) {
                var facetName = $(e.target).data('name');
                var index = expandedToggles.indexOf(facetName);
                if (index >= 0) {
                    expandedToggles.splice(index, 1);
                    amplify.store('facetToggleState', expandedToggles);
                }

                $('[data-target="#'+e.target.id+'"] i').removeClass('fa-minus').addClass('fa-plus');

            });

            // sort facets in popups by count
            $(".sortCount").clicktoggle(function(el) {
                var $list = $(this).closest(".modal").find(".facetValues");
                sortList($list, "sortcount", "<");
                $(this).find("i").removeClass("icon-flipped180");
            }, function(el) {
                var $list = $(this).closest(".modal").find(".facetValues");
                sortList($list, "sortcount", ">");
                $(this).find("i").addClass("icon-flipped180");
            });

            // sort facets in popups by term
            $(".sortAlpha").clicktoggle(function(el) {
                var $list = $(this).closest(".modal").find(".facetValues");
                sortList($list, "sortalpha", ">");
                $(this).find("i").removeClass("icon-flipped180");
            }, function(el) {
                var $list = $(this).closest(".modal").find(".facetValues");
                sortList($list, "sortalpha", "<");
                $(this).find("i").addClass("icon-flipped180");
            });

            // refine button click handler
            $(".facetSearch").click(self.facetSearch);
        };

        function TermViewModel(params) {
            var self = this;
            self.term = params.term;
            self.count = params.count;
            self.selected = ko.observable(params.selected || false);
            self.displayname = ko.observable(self.term);
            $i18nAsync('label.' + self.term, self.term || '[empty]', self.displayname);
        }

        function FacetViewModel(facet) {
            this.facet = facet;
            this.displayname = ko.observable(facet);
            $i18nAsync('label.' + this.facet, self.capitalise(this.facet), this.displayname);
        }

        function init() {
            for (var i = 0; i < self.facetsList.length; i++) {
                self.facetsList[i] = new FacetViewModel(self.facetsList[i]);
            }

            for (var facet in self.results.facets) {
                var terms = self.results.facets[facet].terms;
                for (var i= 0; i < terms.length; i++) {
                    terms[i] = new TermViewModel(terms[i]);
                }
            }
        }


        init()
    },
    template: componentService.getTemplate('facet-filter')
});