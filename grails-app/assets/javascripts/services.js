function OrganisationDetailsViewModel(o, organisation, budgetHeaders, allServices, config) {
    var self = this;
    var period = budgetHeaders,
        serviceIds = o.services && o.services.serviceIds || [],
        targets = o.services && o.services.targets || [];
    self.areTargetsAndFundingEditable = config.areTargetsAndFundingEditable;
    self.services = new OrganisationServicesViewModel(serviceIds, config.services, targets, budgetHeaders, {areTargetsEditable:config.areTargetsAndFundingEditable});

    if (!o.funding) {
        o.funding = {
            rows: [
                {
                    type:BudgetConstants.PERIODICALLY_REVISED_TOTAL,
                    shortLabel: 'rcsContractedFunding',
                    description: 'RCS Contracted Funding'
                }
            ]
        }
    }
    self.funding = new BudgetViewModel(o.funding, budgetHeaders);
    self.funding.isEditable = config.areTargetsAndFundingEditable;

    function clearHiddenFields(jsData) {

    };

    self.modelAsJSON = function () {
        var tmp = {};
        tmp.details = ko.mapping.toJS(self);
        var jsData = {"custom": tmp};
        clearHiddenFields(jsData);

        var json = JSON.stringify(jsData, function (key, value) {
            return value === undefined ? "" : value;
        });
        return json;
    };

    if (config.locked) {
        autoSaveConfig.lockedEntity = organisation.organisationId;
    }
};

/**
 * The view model responsible for managing the selection of project services and their output targets.
 *
 * @param serviceIds Array of the ids of the current services being used by the organisation
 * @param allServices Array containing the full list of available services
 * @param outputTargets The current organisation targets
 * @param periods An array of periods, each of which require a target to be set
 */
function OrganisationServicesViewModel(serviceIds, allServices, outputTargets, periods, options) {
    var self = this,
        OPERATION_SUM = "SUM",
        OPERATION_AVG = "AVG",
        operation = OPERATION_AVG;

    self.areTargetsEditable = options.areTargetsEditable;

    allServices = _.sortBy(allServices || [], function (service) {
        return service.name
    });

    outputTargets = outputTargets || [];

    /**
     * This function is invoked when a selected service is changed or
     * a service added or deleted.
     * It keeps the list of selected service names up to date for use
     * by the budget table.
     */
    function updateSelectedServices() {
        var array =  _.map(self.services(), function(serviceTarget) {
            var service = serviceTarget.service();
            if (service) {
                return service.name;
            }
        });
        array = _.filter(array, function(val) { return val; });
        array = _.unique(array);
        self.selectedServices(array);
    }
    var ServiceTarget = function (service, score) {
        var target = this,
            subscribed = false;

        target.serviceId = ko.observable(service ? service.id : null);
        target.scoreId = ko.observable(score ? score.scoreId : null);

        var decimalPlaces = _.isNumber(score && score.decimalPlaces) ? score.decimalPlaces : 2;
        target.target = ko.observable().extend({numericString: decimalPlaces});
        target.targetDate = ko.observable().extend({simpleDate:false});

        target.periodTargets = _.map(periods, function (period) {
             return {period: period.value, target: ko.observable(0)};
        });

        function evaluateAndAssignAverage() {
            if (periods.length === 0)
                return;


            // TODO make the behaviour of the total configurable so we can make this more reusable
            var avg = averageOfPeriodTargets();

            target.target(avg);
        }

        function averageOfPeriodTargets() {
            // For RCS reporting, targets are evaluated each year so we don't want to include undefined
            // targets in the average.
            var sum = 0;
            var count = 0;
            _.each(target.periodTargets, function (periodTarget) {
                var target = parseFloat(periodTarget.target());
                if (!_.isNaN(target)) {
                    sum += target
                    count++;
                }
            });

            return sum/count;
        }

        function sumOfPeriodTargets() {
            var sum = 0;
            _.each(target.periodTargets, function (periodTarget) {
                if (Number(periodTarget.target())) {
                    sum += Number(periodTarget.target());
                }
            });

            return sum;
        }

        target.minimumTargetsValid = ko.pureComputed(function () {
            var sum = sumOfPeriodTargets();
            return sum <= (target.target() || 0);
        });

        target.updateTargets = function () {

            // Don't auto-update the target if one has already been specified.
            if (target.target()) {
                return;
            }
            var currentTarget = _.find(outputTargets, function (outputTarget) {
                return target.scoreId() == outputTarget.scoreId;
            });
            _.each(periods, function (period, i) {
                var periodTarget = null;
                if (currentTarget) {
                    var currentPeriodTarget = _.find(currentTarget.periodTargets || [], function (periodTarget) {
                        return periodTarget.period == period.value;
                    }) || {};
                    periodTarget = currentPeriodTarget.target;
                }
                target.periodTargets[i].target(periodTarget);
                // subscribe after setting the initial value
                !subscribed && target.periodTargets[i].target.subscribe(evaluateAndAssignAverage);
            });
            target.target(currentTarget ? currentTarget.target || 0 : 0);
            target.targetDate(currentTarget ? currentTarget.targetDate : '');
            // prevent multiple subscriptions to period targets observable
            subscribed = true;
        };

        target.toJSON = function () {
            return {
                target: target.target(),
                targetDate: target.targetDate(),
                scoreId: target.scoreId(),
                periodTargets: ko.toJS(target.periodTargets)
            };
        };

        target.service = function () {
            return _.find(allServices, function (service) {
                return service.id == target.serviceId();
            })
        };

        target.score = function () {
            var score = null;
            var service = target.service();
            if (service) {
                score = _.find(service.scores, function (score) {
                    return score.scoreId == target.scoreId();
                });
            }
            return score;
        };

        target.selectableScores = ko.pureComputed(function () {
            if (!target.serviceId()) {
                return [];
            }
            var availableScores = self.availableScoresForService(target.service());
            if (target.scoreId()) {
                availableScores.push(target.score());
            }

            return _.sortBy(availableScores, function (score) {
                return score.label
            });
        });
        target.selectableServices = ko.pureComputed(function () {
            var services = self.availableServices();
            if (target.serviceId()) {
                var found = _.find(services, function (service) {
                    return service.id == target.serviceId();
                });
                if (!found) {
                    services.push(target.service());
                }

            }
            return services;

        });

        target.serviceId.subscribe(function () {
            target.scoreId(null);
            updateSelectedServices();
        });

        target.scoreId.subscribe(function () {
            var score = target.scoreId() ? target.score() : null;
            if (score) {
                var decimalPlaces = _.isNumber(score && score.decimalPlaces) ? score.decimalPlaces : 2;
                target.target = ko.observable().extend({numericString: decimalPlaces});
            }
            target.updateTargets();
        });

        target.updateTargets();
    };

    self.periods = periods;
    self.periodLabel = function (period) {

        return period;
    };

    self.services = ko.observableArray();
    self.addService = function () {
        self.services.push(new ServiceTarget());
    };

    /**
     * Method to programatically add a pre-populated service target - used for the MERI plan load.
     * @param serviceTarget example:
     *  {
     serviceId:1,
     scoreId:1,
     target:100,
     periodTargets:[
     {period:'2018/2019', target:1},
     {period:'2019/2020', target:2},
     {period:'2020/2021', target:2}
     ]
     }
     * @returns {ServiceTarget}
     */
    self.addServiceTarget = function(serviceTarget) {
        var serviceTargetRow = new ServiceTarget();
        serviceTargetRow.serviceId(serviceTarget.serviceId);
        serviceTargetRow.scoreId(serviceTarget.scoreId);
        serviceTargetRow.target(serviceTarget.target);
        _.each(periods || [], function(period) {

            var periodTarget = _.find(serviceTargetRow.periodTargets || [], function(pt) {
                return pt.period == period;
            });
            var periodTargetValue = _.find(serviceTarget.periodTargets || [], function(pt) {
                return pt.period == period;
            });
            if (periodTarget && periodTargetValue) {
                periodTarget.target(periodTargetValue.target);
            }

        });

        self.services.push(serviceTargetRow);
        return serviceTargetRow;
    };

    self.removeService = function (service) {
        self.services.remove(service);
    };


    self.selectedServices = ko.observableArray();
    self.services.subscribe(updateSelectedServices);

    /**
     * Once all of the scores for a service have been assigned targets, don't allow new rows to select that score.
     */
    self.availableServices = function () {
        return _.reject(allServices, function (service) {
            return self.availableScoresForService(service).length == 0;
        });
    };

    self.availableScoresForService = function (service) {
        if (!service || !service.scores) {
            return [];
        }
        return _.reject(service.scores, function (score) {
            return _.find(self.services(), function (target) {
                return target.score() ? target.score().scoreId == score.scoreId : false;
            })
        });
    };

    // Populate the model from existing data.
    for (var i = 0; i < outputTargets.length; i++) {

        var score = null;
        var service = _.find(allServices, function (service) {
            return _.find(service.scores, function (serviceScore) {
                if (serviceScore.scoreId == outputTargets[i].scoreId) {
                    score = serviceScore;
                }
                return score;
            })
        });

        self.services.push(new ServiceTarget(service, score));
    }
    // if (!outputTargets || outputTargets.length == 0) {
    //     self.addService();
    // }
    self.outputTargets = function () {
        var outputTargets = [];
        _.each(self.services(), function (target) {
            outputTargets.push(target.toJSON());
        });
        return outputTargets;
    };

    self.toJSON = function () {
        var serviceIds = _.unique(_.map(self.services(), function (service) {
            return service.serviceId();
        }));
        serviceIds = _.filter(serviceIds, function(id) {
            return id != null;
        });
        return {
            serviceIds: serviceIds,
            targets: self.outputTargets()
        }
    };
};