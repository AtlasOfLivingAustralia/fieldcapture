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
 * This component renders a list of id type / id value / remove options and stores them in an observable array.
 */
ko.components.register('external-ids', {

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

        self.externalIds = params.externalIds;

        // Combine the list of supplied external id types and any existing id types to make the selection list.
        // This is to support Green Army projects which have a work order id, but we don't want to allow
        // users to be able to supply work order ids for new projects.
        var existingExternalIdTypes = _.map(params.externalIds(), function(externalId) {
            return externalId.idType;
        });
        var allExternalIdTypes = _.union(existingExternalIdTypes, params.externalIdTypes);

        self.externalIdTypes = _.map(allExternalIdTypes, function(idType) {
            var label = _.isFunction($i18n) ? $i18n('label.externalId.'+idType, idType) : idType;
            return {label:label, value:idType};
        });

        self.validationNamespace = params.validationNamespace;

        self.idsForType = function (idType) {
            return _.find(self.externalIds(), function (externalId) {
                return externalId.idType() == idType;
            });
        }

        self.removeExternalId = function (externalId) {
            self.externalIds.remove(externalId);
        }

        self.addExternalId = function () {
            self.externalIds.push({
                idType: ko.observable(),
                externalId: ko.observable()
            });
        }

        /**
         * This method is designed to be used by the jquery validation engine so a passed validation will
         * return undefined / null, and a failed validation will return an error message.
         * @returns {*} A message to display if validation failed.
         */
        self.externalIdValidation = function() {
            if (params.validate) {
                return params.validate();
            }
        }
    },
    template: componentService.getTemplate('external-ids')
});