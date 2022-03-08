
var ExternalIdTypes = [
    'INTERNAL_ORDER_NUMBER', 'SERVICE_ONE', 'WORK_ORDER', 'GRANT_OPPORTUNITY'
];

ko.components.register('external-ids', {

    viewModel: function (params) {
        var self = this;
        _.extend(this, ko.observableArray);

        self.externalIds = params.externalIds;
        self.externalIdTypes = params.externalIdTypes;
        self.validationNamespace = params.validationNamespace;

        self.idsForType = function (idType) {
            return _.find(externalIds, function (externalId) {
                return externalId.idType == idType;
            });
        }

        self.internalOrderNumbers = function () {
            return self.idsForType('INTERNAL_ORDER_NUMBER');
        }
        self.serviceOneIds = function () {
            return self.idsForType('SERVICE_ONE');
        }
        self.workOrderIds = function () {
            return self.idsForType('WORK_ORDER');
        }
        self.grantOpportunityIds = function () {
            return self.idsForType('GRANT_OPPORTUNITY');
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