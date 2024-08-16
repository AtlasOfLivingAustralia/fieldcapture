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
/**
 * This component renders a list of organisations and their relationship to an entity
 */
ko.components.register('associated-orgs', {

    /**
     * @param params an object with the following keys:
     * externalIds: an observable array of objects, each object will have two observables, idType and externalId.
     * externalIdTypes: an array of label/value pairs that define the selectable options for the idType
     * validationNamespace: a string to store the validation function in the global namespace for use by jquery validation engine
     * validate: a jquery-validation-engine style function that will validate the external ids.  (Note this function
     * should return a string containing the error if the validation fails).
     */
    viewModel: function (params) {
        var self = this;

        var $modal = $('#add-or-edit-organisation');
        $modal.find('form').validationEngine();

        function AssociatedOrg(associatedOrg) {
            var self = this;
            associatedOrg = associatedOrg || {};
            self.name = ko.observable(associatedOrg.name);
            self.organisationName = ko.observable(associatedOrg.organisationName);
            self.description = ko.observable(associatedOrg.description);
            self.organisationId = ko.observable(associatedOrg.organisationId);
            self.fromDate = ko.observable(associatedOrg.fromDate).extend({simpleDate:false});
            self.toDate = ko.observable(associatedOrg.toDate).extend({simpleDate:false});

            self.toJSON = function() {
                return ko.mapping.toJS(self);
            }


        }

        self.associatedOrgs = ko.observableArray(_.map(params.associatedOrgs(), function(org) {
            return new AssociatedOrg(org);
        }));
        // Overwrites the associatedOrgs observable with the mapped values so they are editable and changes in
        // this component are reflected in the parent component.
        params.associatedOrgs(self.associatedOrgs());

        self.validationNamespace = params.validationNamespace;
        self.relationshipTypes = ['Service provider', 'Grantee', 'Sponsor'];
        self.organisationSearchUrl = params.organisationSearchUrl;

        self.removeAssociatedOrg = function (org) {
            self.associatedOrgs.remove(org);
        }

        // Maintains the state of which organisation is being edited or added
        var selectedOrganisation;

        self.addAssociatedOrg = function () {
            self.selectedOrganisation = new AssociatedOrg();
            openEditModal();
        }

        self.editAssociatedOrg = function (organisation) {
            self.selectedOrganisation = organisation;
            openEditModal();
        }

        function openEditModal() {
            copy(self.selectedOrganisation, self.editableOrganisation);
            $modal.modal('show');
        }

        self.okPressed = function () {
            var valid = $modal.find('form').validationEngine('validate');
            if (!valid) {
                return;
            }
            if (!_.contains(self.associatedOrgs(), self.selectedOrganisation)) {
                self.associatedOrgs.push(self.editableOrganisation);
            }
            else {
                copy(self.editableOrganisation, self.selectedOrganisation);
            }
            self.close();
        }

        self.close = function() {
            $modal.modal('hide');
        }

        function copy(source, destination) {
            destination.organisationId(source.organisationId());
            destination.name(source.name());
            destination.organisationName(source.organisationName());
            destination.description(source.description());
            destination.fromDate(source.fromDate());
            destination.toDate(source.toDate());
        }


        /**
         * This method is designed to be used by the jquery validation engine so a passed validation will
         * return undefined / null, and a failed validation will return an error message.
         * @returns {*} A message to display if validation failed.
         */
        self.associatedOrgValidation = function() {
            if (params.validate) {
                return params.validate();
            }
        }

        self.selectOrganisation = function(item) {

            if (item && item.source) {
                self.editableOrganisation.organisationId(item.source.organisationId);
                self.editableOrganisation.organisationName(item.source.name);
                if (!self.editableOrganisation.name()) {
                    self.editableOrganisation.name(item.source.name);
                }
            }
            else {
                self.editableOrganisation.organisationId(null);
            }

        }

        self.clearSelectedOrganisation = function() {
            self.editableOrganisation.organisationId(null);
            self.editableOrganisation.name('');
        }

        self.editableOrganisation = new AssociatedOrg();

    },
    template: componentService.getTemplate('associated-orgs')
});