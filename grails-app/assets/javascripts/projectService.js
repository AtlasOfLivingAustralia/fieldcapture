/** Constants representing the status of a project MERI plan */
PlanStatus = {
    SUBMITTED: 'submitted',
    APPROVED: 'approved',
    NOT_APPROVED: 'not approved',
    UNLOCKED: 'unlocked for correction'
};

ProjectStatus = {
    ACTIVE: 'active',
    APPLICATION: 'application',
    COMPLETED: 'completed',
    TERMINATED: 'terminated',
    DELETED: 'deleted'
};

PROJECT_EXTERNAL_ID_TYPES =  [
    'TECH_ONE_CODE', 'INTERNAL_ORDER_NUMBER', 'GRANT_AWARD', 'RELATED_PROJECT'
];

/**
 * Handles common project and meri plan status functions as well as communication with the server for
 * saving / submitting / approvals etc.
 * @param project the project this service is working with.
 * @param options mostly URLs to access server functions.
 */
function ProjectService(project, options) {

    var self = this;
    var defaults = {
        submitPlanUrl : fcConfig.submitPlanUrl,
        modifyPlanUrl : fcConfig.modifyPlanUrl,
        approvalPlanUrl : fcConfig.approvalPlanUrl,
        rejectPlanUrl : fcConfig.rejectPlanUrl,
        excludeFinancialYearData : false
    };

    var config = _.defaults(options, defaults);

    self.saveGrantManagerSettings = function () {

        if ($('#grantmanager-validation').validationEngine('validate')) {
            var doc = {oldDate:project.plannedEndDate, newDate:self.plannedEndDate(),reason:self.transients.variation(),role:"variation",projectId:project.projectId};
            var jsData = {
                plannedEndDate: self.plannedEndDate()
            };
            var json = JSON.stringify(jsData, function (key, value) {
                return value === undefined ? "" : value;
            });

            $.ajax({
                url: config.projectUpdateUrl,
                type: 'POST',
                data: json,
                contentType: 'application/json',
                success: function (data) {
                    if (data.error) {
                        showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
                            "alert-error","save-settings-result-placeholder");
                    } else {
                        self.uploadVariationDoc(doc);
                    }
                },
                error: function (data) {
                    var status = data.status;
                    alert('An unhandled error occurred: ' + data.status);
                }
            });
        }
    };

    self.saveProjectData = function (jsData) {
        if ($('#settings-validation').validationEngine('validate')) {

            // this call to stringify will make sure that undefined values are propagated to
            // the update call - otherwise it is impossible to erase fields
            var json = JSON.stringify(jsData, function (key, value) {
                return value === undefined ? "" : value;
            });

            blockUIWithMessage("Saving....");
            $.ajax({
                url: config.projectUpdateUrl,
                type: 'POST',
                data: json,
                contentType: 'application/json'
            }).done(function(data) {
                if (data.error) {
                    $.unblockUI();
                    showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
                        "alert-error","save-result-placeholder");
                } else {
                    blockUIWithMessage("Refreshing page...");
                    showAlert("Project settings saved","alert-success","save-result-placeholder");
                    window.location.reload();
                }
            }).fail(function(data) {
                $.unblockUI();
                alert('An unhandled error occurred: ' + data.status + " Please refresh the page and try again");
            });
        }
    };

    self.save = function(url, payload, message) {{
        blockUIWithMessage(message);
        return $.ajax({
            url: url,
            type: 'POST',
            data: payload,
            contentType: 'application/json',
            dataType:'json'
        }).always(function() {
            $.unblockUI();
        });
    }}

    self.saveDataSet = function(dataSet) {
        var json = JSON.stringify(dataSet);
        return self.save(options.dataSetUpdateUrl, json, "Saving data set....")
            .done(function(data) {
                if (data.error) {
                    $.unblockUI();
                    showAlert("Failed to save data set: " + data.detail + ' \n' + data.error,
                        "alert-error","save-result-placeholder");
                } else {
                    blockUIWithMessage("Refreshing page...");
                    showAlert("Data set saved","alert-success","save-result-placeholder");
    
                }
            }).fail(function(data) {
                $.unblockUI();
                alert('An unhandled error occurred: ' + data.status + " Please refresh the page and try again");
            });
    };

    self.deleteDataSet = function(dataSetId) {

        var json = JSON.stringify({dataSetId:dataSetId});
        return self.save(options.deleteDataSetUrl, json, "Deleting data set....")
            .done(function(data) {
                if (data.error) {
                    $.unblockUI();
                    showAlert("An error occurred while deleting the data set: " + data.detail + ' \n' + data.error,
                        "alert-error","save-result-placeholder");
                } else {
                    blockUIWithMessage("Refreshing page...");

                }
            }).fail(function(data) {
                $.unblockUI();
                if (data.status == 401) {
                    alert('You do not have permission to delete this record.');
                }
                else {
                    alert('An unhandled error occurred: ' + data.status + " Please refresh the page and try again");
                }
            });

    };

    self.uploadVariationDoc = function(doc){
        var json = JSON.stringify(doc, function (key, value) {
            return value === undefined ? "" : value;
        });
        $.post(
            config.documentUpdateUrl,
            {document:json},
            function(result) {
                showAlert("Project end date saved","alert-success","save-settings-result-placeholder");
                location.reload();
            })
            .fail(function() {
                alert('Error saving document record');
            });
    };

    self.modifyPlan = function () {
        self.saveStatus(config.modifyPlanUrl);
    };
    // approve plan and handle errors
    self.approvePlan = function (approvalDetails, data) {
        if (data) {
            var payload = JSON.stringify({externalIds: data.externalIds, plannedStartDate: data.plannedStartDate});
            var message = "Saving project data";
            self.save(config.projectUpdateUrl, payload, message).done(function() {
                self.saveStatus(config.approvalPlanUrl, approvalDetails);
            }).fail(function() {
                bootbox.alert("There was an error saving the external ids.  Please contact support");
            });
        }
        else {
            self.saveStatus(config.approvalPlanUrl, approvalDetails);
        }
    };
    // reject plan and handle errors
    self.rejectPlan = function () {
        self.saveStatus(config.rejectPlanUrl);
    };

    self.finishCorrections = function () {
        self.saveStatus(config.finishedCorrectingPlanUrl);
    };

    self.submitPlan = function(declarationText) {
        self.saveStatus(config.submitPlanUrl, {declaration:declarationText});
    };

    self.unlockPlan = function(declarationText) {
        self.saveStatus(unlockPlanForCorrectionUrl, {declaration:declarationText});
    };

    self.saveStatus = function (url, payloadData) {
        var payload = {projectId: project.projectId};
        if (payloadData) {
            _.extend(payload, payloadData);
        }
        return $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json'
        }).done(function (data) {
            if (data.error) {
                bootbox.alert("Unable to modify plan.\n" + data.error);
            } else {
                location.reload();
            }
        }).fail(function (data) {
            if (data.status === 401) {
                bootbox.alert("Unable to modify plan. You may not have the correct permissions.");
            } else {
                bootbox.alert("Unable to modify plan. An unhandled error occurred: " + data.status);
            }
        });
    };

    self.isSubmittedOrApproved = function() {
        return (project.planStatus == PlanStatus.APPROVED || project.planStatus == PlanStatus.SUBMITTED);
    };
    self.isTerminated = function(){
        return project.status.toLowerCase() === 'terminated';
    };

    self.isCompletedOrTerminated = function() {
        return project.status && (project.status.toLowerCase() === ProjectStatus.COMPLETED|| self.isTerminated());
    };

    self.isActive = function(){
        return project.status.toLowerCase() === 'active';
    };

    self.isProjectDetailsLocked = ko.computed(function () {
            return self.isCompletedOrTerminated() || self.isSubmittedOrApproved();
    });

    self.isApproved = function() {
        return project.planStatus == PlanStatus.APPROVED;
    };

    self.isSubmitted = function() {
        return project.planStatus == PlanStatus.SUBMITTED;
    };


    self.isUnlockedForDataCorrection = function() {
        return project.planStatus == PlanStatus.UNLOCKED;
    };

    self.canApproveMeriPlan = function() {
        return self.areExternalIdsValid(project.externalIds);
    };

    /** The list of external ids needs to include at least one SAP Internal Order or one Tech One Project Code */
    self.areExternalIdsValid = function(externalIds) {
        var requiredIdTypes = ['INTERNAL_ORDER_NUMBER', 'TECH_ONE_CODE'];
        return _.find(externalIds, function (externalId) {
            var typeMatches = _.contains(requiredIdTypes, externalId.idType);
            return typeMatches && externalId.externalId && externalId.externalId.length > 0;
        });
    }

    self.validateExternalIds = function(externalIds) {
        if (!self.areExternalIdsValid(externalIds)) {
            return 'At least one SAP Internal Order or Tech One Project Code is required';
        }
    }

    self.getBudgetHeaders = function() {
        if (config.excludeFinancialYearData) {
            return []; // Return a single period header for the project
        }
        var headers = [];
        var startYr = moment(project.plannedStartDate).format('YYYY');
        var endYr = moment(project.plannedEndDate).format('YYYY');
        var startMonth = moment(project.plannedStartDate).format('M');
        var endMonth = moment(project.plannedEndDate).format('M');

        //Is startYr is between jan to june?
        if(startMonth >= 1 &&  startMonth <= 6 ){
            startYr--;
        }

        //Is the end year is between july to dec?
        if(endMonth >= 7 &&  endMonth <= 12 ){
            endYr++;
        }

        var count = endYr - startYr;
        for (i = 0; i < count; i++){
            headers.push(startYr + '/' + ++startYr);
        }
        return headers;

    };

    /**
     * Queries the server to retrieve an array of objects representing each time the MERI plan was approved.
     */
    self.getApprovedMeriPlanHistory = function() {
        var approvedPlans = [];
        var deferred = $.Deferred();
        if (config.approvedMeriPlanHistoryUrl) {
            $.getJSON(config.approvedMeriPlanHistoryUrl).done(function(data) {
                if (data && data.approvedMeriPlanHistory) {
                    _.each(data.approvedMeriPlanHistory, function(meriPlan) {
                        approvedPlans.push(
                            {
                                openMeriPlanUrl: config.viewHistoricalMeriPlanUrl+"?documentId="+meriPlan.documentId,
                                userDisplayName:meriPlan.userDisplayName,
                                dateApproved:convertToSimpleDate(meriPlan.date, true),
                                reason:meriPlan.reason,
                                referenceDocument:meriPlan.referenceDocument,
                                documentId:meriPlan.documentId
                            }
                        )
                    });
                }
                deferred.resolve(approvedPlans);
            }).fail(function() {
                deferred.reject(approvedPlans);
            });
        }
        return deferred;
    };

    self.deleteDocument = function(documentId) {
        var url = config.documentDeleteUrl+'/'+documentId;
        return $.post(url);
    };
};
