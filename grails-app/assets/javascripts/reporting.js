

var GreenArmyActivityViewModel = function(activity) {
    var self = this;
    $.extend(self, activity);

    self.name = activity.name;
    self.description = activity.description;
    self.projectId = activity.projectId;
    self.progress = activity.progress;
    self.publicationStatus = activity.publicationStatus ? activity.publicationStatus : 'unpublished';
    self.editable = (self.publicationStatus == 'unpublished');
    self.activityDetailsUrl = self.editable ? fcConfig.activityEditUrl+'/'+activity.activityId+'?returnTo='+fcConfig.organisationViewUrl :
    fcConfig.activityViewUrl+'/'+activity.activityId+'?returnTo='+fcConfig.organisationViewUrl;

    self.activityUrlTitle = self.editable ? 'Enter data for this report' : 'View this report';
};

/**
 * View model for the modal dialog shown when a report status change
 * (e.g. approving/rejecting/cancelling a report) needs a reason to
 * be supplied by the user.
 */
var ReportStatusChangeReasonViewModel = function(config) {
    var self = this;
    var defaults = {
        buttonText: 'Yes',
        buttonTextNo: 'No',
        blockingMessage: 'Changing report status',
        successMessage: 'Report status successfully changed'
    };
    var options = _.defaults(config, defaults);

    self.reason = ko.observable();
    self.reasonCategoryOptions = ko.observableArray(config.reasonCategoryOptions);
    self.reasonCategories = ko.observableArray();

    self.title = config.title;
    self.explanationText = config.explanationText;
    self.reasonTitle = config.reasonTitle;
    self.buttonText = config.buttonText;
    self.buttonTextNo = config.buttonTextNo;

    /**
     * Evaluates to a non-empty string if a reason needs to be supplied for validation to pass.
     * The return value is then bound to a hidden input which is used by the jQueryValidationEngine
     * condRequired validation.
     */
    self.reasonRequired = ko.pureComputed(function() {
        var reasonRequired = '';
        if (!self.reasonCategoryOptions().length || _.contains(self.reasonCategories(), config.otherCategoryValue)) {
            reasonRequired = 'yes';
        }
        return reasonRequired;
    });

    self.submit = function(data, e) {
        var form = $(e.target).parents('.validationEngineContainer');
        var valid = form.validationEngine('validate');
        if (valid) {
            options.okCallback(self.reasonCategories(), self.reason());
        }
    }
};

var ReportViewModel = function(report, config) {
    $.extend(this, report);
    var self = this;

    self.description = report.description || report.name;
    self.fromDate = ko.observable(report.fromDate).extend({simpleDate:false});
    self.toDate =  ko.observable(report.toDate).extend({simpleDate:false});
    self.submissionDate = ko.observable(report.submissionDate || report.toDate).extend({simpleDate:false});
    self.submissionDateLabel = convertToSimpleDate(moment(self.submissionDate()).subtract(1, 'hours').toDate(), false);
    self.toDateLabel = ko.computed(function() {
        // If the report end date matches the project end date we want to use the project end date,
        // as projects end at 00:00 of the specified day.  Otherwise, the reports end at 00:00 of the following
        // day but we want to show the previous day on the label.
        var label;
        if (config.reportOwner && config.reportOwner.endDate) {
            if (report.toDate == config.reportOwner.endDate) {
                label = convertToSimpleDate(report.toDate);
            }
        }
        if (!label) {
            label = convertToSimpleDate(moment(report.toDate).subtract(1, 'hours').toDate(), false);
        }
        return label;
    });
    self.dueDate = ko.observable(report.dueDate).extend({simpleDate:false});
    self.progress = ko.observable(report.progress || 'planned');
    self.editUrl = config.editReportUrl + '?&reportId='+report.reportId;
    self.viewUrl = config.viewReportUrl + '?&reportId='+report.reportId;
    self.downloadUrl = config.reportPDFUrl ? config.reportPDFUrl +'?reportId='+report.reportId : null;
    self.percentComplete = function() {
        if (report.count == 0) {
            return 0;
        }
        return report.finishedCount / report.count * 100;
    }();

    self.period = ko.computed(function() {
        return self.fromDate.formattedDate() + ' - ' + self.toDate.formattedDate();
    });

    self.toggleActivities = function() {
        self.activitiesVisible(!self.activitiesVisible());
    };
    self.activitiesVisible = ko.observable(false);
    self.activities = [];
    $.each(report.activities || [], function(i, activity) {
        self.activities.push(new GreenArmyActivityViewModel(activity));
    });

    self.editable = (report.bulkEditable || self.activities.length == 0 || self.activities.length == 1) && (report.publicationStatus != 'published' && report.publicationStatus != 'pendingApproval' && report.publicationStatus != 'cancelled');

    self.title = 'Expand the activity list to complete the reports';
    if (self.editable) {
        self.title = 'Click to complete the report';
        self.editUrl = config.editReportUrl + '?reportId='+report.reportId;
    }

    self.viewable = self.progress() == 'finished';

    self.isReportable = function() {
        var reportableDate = report.submissionDate || report.toDate;
        return (reportableDate < new Date().toISOStringNoMillis());
    };
    self.isCurrent = function() {
        var now =new Date().toISOStringNoMillis();
        return report.fromDate <= now && report.toDate >= now;
    };
    self.currentPeriodHelpText = ko.computed(function() {
        return "This report can be submitted on or after "+self.submissionDate.formattedDate();
    });
    self.complete = ko.pureComputed(function() {
        return self.isReportable() && self.progress() == 'finished' && self.editable;
    });

    self.hasData = ko.pureComputed(function() {
        return self.progress() == 'finished' || self.progress() == 'started';
    });

    self.canReset = ko.pureComputed(function() {
        return self.editable && self.hasData();
    });

    self.approvalTemplate = function() {
        if (report.publicationStatus == 'cancelled') {
            return 'cancelled';
        }
        if (!self.isReportable()) {
            return 'notReportable';
        }

        switch (report.publicationStatus) {
            case 'unpublished':
                return 'notSubmitted';
            case 'pendingApproval':
                return 'submitted';
            case 'published':
                return 'approved';
            default:
                return 'notSubmitted';
        }
    };

    self.changeReportStatus = function(url, categories, reason, action, blockingMessage, successMessage, doneCallback) {
        blockUIWithMessage(blockingMessage);
        var payload = {
            reportId:report.reportId,
            stage: report.name,
            categories:categories,
            reason:reason,
            activityIds:[report.activityId]
        };
        var json = JSON.stringify(payload);
        $.ajax({
            url: url,
            type: 'POST',
            data: json,
            contentType: 'application/json'
        }).done(function(result) {
            if (_.isFunction(doneCallback)) {
                doneCallback(result);
            }
            else {
                blockUIWithMessage(successMessage);
                window.location.reload();
            }
        }).fail(function(data) {
            $.unblockUI();

            if (data.status == 401) {
                bootbox.alert("You do not have permission to "+action+" this report.");
            }
            else {
                bootbox.alert('An unhandled error occurred: ' + data.status);
            }
        });
    };
    self.approveReport = function() {
        self.changeReportStatus(config.approveReportUrl, 'approve', 'Approving report...', 'Report approved.');
    };
    self.submitReport = function() {
        var declaration = $('#declaration')[0];
        var declarationViewModel = {
            termsAccepted : ko.observable(false),
            submitReport : function() {

                self.changeReportStatus(config.submitReportUrl, 'submit', 'Submitting report...', 'Report submitted.');
            }
        };
        ko.applyBindings(declarationViewModel, declaration);
        var unbind = function() {ko.cleanNode(declaration)};
        $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', unbind).on('hidden.bs.modal', unbind);

    };


    self.showReportStatusChangeModal = function(options) {

        options = _.extend({}, options);
        var modalTemplate = $(options.reasonModalSelector || '#reason-modal-template');
        var $modal = $(modalTemplate.text());
        $(document.body).append($modal);

        options.okCallback = function(categories, reason) {
            self.changeReportStatus(
                options.actionUrl,
                categories,
                reason,
                options.action,
                options.blockingMessage,
                options.successMessage,
                options.successCallback);
            $modal.modal('hide').modal('dispose');
        }
        var reasonViewModel = new ReportStatusChangeReasonViewModel(options);

        ko.applyBindings(reasonViewModel, $modal[0]);

        var modalOptions = {backdrop: 'static', keyboard:true, show:true};
        $modal.validationEngine({promptPosition:'topLeft'});

        $modal.modal(modalOptions).on('hidden.bs.modal', function() {
            // clean up event handlers and dispose of the modal
            $modal.validationEngine('detach');
            ko.cleanNode($modal[0]);
            $modal.remove();
        });

    }

    self.rejectReport = function() {
        var rejectionReasonCategoryOptions = config.rejectionReasonCategoryOptions;
        var options = {
            explanationText: 'Please enter a reason. This reason will be included in the email sent to the project administrator(s).',
            reasonCategoryOptions: rejectionReasonCategoryOptions,
            otherCategoryValue: 'Other (PM to describe)',
            title:'Return report',
            reasonTitle:'Explanation / Comments',
            buttonText: 'Return',
            buttonTextNo: 'Cancel',
            blockingMessage: 'Returning report...',
            successMessage: 'Report returned.',
            action: 'return',
            actionUrl: config.rejectReportUrl
        };
        self.showReportStatusChangeModal(options);
    };

    self.cancelReport = function() {
        var options = {
            explanationText:'Do you wish to set this report as “not required”? Please enter the reason the report is not required.',
            title:'Report not required',
            buttonText: 'Yes (exempt by PPO)',
            action: 'cancel',
            blockingMessage: 'Marking this report as not required...',
            successMessage: 'Report not required.',
            actionUrl: config.cancelReportUrl
        };
        self.showReportStatusChangeModal(options);
    };

    self.resetReport = function() {
        bootbox.confirm("<h4>Delete report contents</h4>Are you sure you want to delete the data entered for this report?<br/><b>This action cannot be undone</b>", function(result) {
            var url = config.resetReportUrl+'?reportId='+report.reportId;
            if (result) {
                $.ajax({
                    url: url,
                    type: 'POST'
                }).done(function() {
                    window.location.reload();
                }).fail(function(data) {
                    if (data.status == 401) {
                        bootbox.alert("You do not have permission to reset this report.");
                    }
                    else {
                        bootbox.alert('An unhandled error occurred: ' + data.status);
                    }
                });
            }

        });
    };

    self.adjustReport = function() {
        function afterReportCreated(result) {
            if (result.resp && result.resp.reportId) {
                var instructions = $(config.adjustmentInstructionsSelector);
                bootbox.alert(instructions.html(), function() {
                    var adjustmentReportUrl = config.editReportUrl + '?&reportId='+result.resp.reportId;
                    window.location.href = adjustmentReportUrl;
                });
            }
            else {
                bootbox.alert("An unexpected error occurred creating the adjustment", function() {
                    window.location.reload();
                });
            }
        };
        var options = {
            title:'Adjust report',
            buttonText: 'Create adjustment',
            buttonTextNo: 'Cancel',
            blockingMessage: 'Creating an adjustment for the report...',
            successMessage: 'Created adjustment report',
            action: 'adjust',
            actionUrl: config.adjustReportUrl,
            explanationText: 'Please enter the reason the adjustment is required',
            successCallback: afterReportCreated
        };
        self.showReportStatusChangeModal(options)
    };

    self.outcomeCategory = ko.pureComputed(function() {
        return report.category == "Outcomes Report 1";
    });

    self.cancelledComment = ko.observable();
    $.each(report.statusChangeHistory, function(i, history) {
        self.cancelledComment = history.comment
    });
};

var ReportsViewModel = function(reports, projects, availableReports, reportOwner, config) {
    var self = this;
    self.projects = projects;
    self.allReports = ko.observableArray(reports);
    self.hideApprovedReports = ko.observable(true);
    self.hideFutureReports = ko.observable(true);
    self.showAllReports = ko.observable(false);

    self.attachHelp = function(element) {
        $(element).find('.helphover').popover({trigger:'hover'});
    };

    self.filteredReports = ko.computed(function() {

        var filteredReports = [];
        var now = moment().toDate().toISOStringNoMillis();
        var oneWeekAgo = moment().subtract(1, 'weeks').toDate().toISOStringNoMillis();

        $.each(self.allReports(), function(i, report) {
            if (!self.showAllReports() && report.publicationStatus === 'published' && report.dateApproved < oneWeekAgo) {
                return;
            }

            if (!self.showAllReports() && report.fromDate > now) {
                return;
            }
            filteredReports.push(new ReportViewModel(report, _.extend({}, config, {reportOwner:reportOwner})));
        });
        filteredReports.sort(function(r1, r2) {

            var result = ( ( r1.dueDate() == r2.dueDate() ) ? 0 : ( ( r1.dueDate() > r2.dueDate() ) ? 1 : -1 ) );
            if (result === 0) {
                result = ( ( r1.toDate() == r2.toDate() ) ? 0 : ( ( r1.toDate() > r2.toDate() ) ? 1 : -1 ) );
            }
            if (result === 0) {
                result = ( ( r1.type == r2.type ) ? 0 : ( ( r1.type > r2.type ) ? 1 : -1 ) );
            }
            return result;
        });
        return filteredReports;
    });

    self.displayShowAllCheckbox = ko.pureComputed(function() {
        if (self.showAllReports()) {
            return true;
        }
        return reports.length > self.filteredReports().length;
    });

    self.editReport = function(report) {
        window.location = report.editUrl;
    };

    self.viewReport = function(report) {
        window.open(report.viewUrl, 'view-report');
    };

    self.downloadReport = function(report) {
        window.open(report.downloadUrl, 'download-report');
    };

    self.viewAllReports = function(report) {
        report.toggleActivities();
    };

    self.getProject = function(projectId) {
        var projects = $.grep(self.projects, function(project) {
            return project.projectId === projectId;
        });
        return projects ? projects[0] : {name:''};
    };

    self.addReport = function() {
        $('#addReport').modal('show');
    };

    self.publicationStatusLabel = function(publicationStatus) {

        switch (publicationStatus) {
            case 'unpublished':
                return 'Stage report not submitted';
            case 'pendingApproval':
                return 'Stage report submitted';
            case 'published':
                return 'Stage report approved';
            default:
                return 'Stage report not submitted';
        }
    };


    // Data model for the new report dialog.
    var AdHocReportViewModel = function() {

        var defaultFromDate = '2014-07-01T10:00:00Z';
        var defaultToDate = '2015-07-01T10:00:00Z';
        if (reports && reports.length) {
            for (var i=0; i<reports.length; i++) {
                if (reports[i].toDate > defaultToDate) {
                    defaultToDate = reports[i].toDate;
                    defaultFromDate = reports[i].fromDate;
                }
            }
        }
        defaultFromDate = moment(defaultFromDate).add(1, 'years').toDate().toISOStringNoMillis();
        defaultToDate = moment(defaultToDate).add(1, 'years').toDate().toISOStringNoMillis();

        var self = this;
        _.extend(self, reportOwner);

        self.type = ko.observable();

        self.fromDate = ko.observable(defaultFromDate).extend({simpleDate:false});
        self.toDate = ko.observable(defaultToDate).extend({simpleDate:false});

        self.availableReports = availableReports;

        self.selectedReportType = ko.observable();

        self.formatReportType = function(reportType) {
            if (!reportType) {
                return null;
            }
            if (!reportType.activityType) {
                return reportType.type;
            }
            return reportType.activityType;
        };

        self.type = ko.computed(function() {

            var reportType = self.selectedReportType();
            if (!reportType) {
               return null;
            }
            return reportType.type;
        });

        self.activityType = ko.computed(function() {
            var reportType = self.selectedReportType();
            if (!reportType) {
                return null;
            }
            return reportType.activityType;
        });

        self.name = ko.computed(function() {
            var fromDate = moment(self.fromDate());
            var toDate = moment(self.toDate());

            return fromDate.get('year') + ' / ' + toDate.get('year') + ' ' + self.formatReportType(self.selectedReportType());
        });

        self.dueDate = ko.computed(function() {
            var toDate = moment(self.toDate()).add(1, 'months').add(15, 'days');
            return toDate.toDate().toISOStringNoMillis();
        });

        self.save = function() {

            var reportDetails = JSON.stringify(ko.mapping.toJS(this, {'ignore':['project', 'save', 'availableReports', 'selectedReportType']}));


            var reportUrl = config.reportCreateUrl;
            $.ajax({
                method:'POST', url:reportUrl, data:reportDetails, contentType:'application/json'
            }).done(function() {
                window.location.reload();
            });
        };
    };
    self.newReport = new AdHocReportViewModel();

};

var CategorisedReportsViewModel = function(allReports, order, availableReports, reportOwner, config) {

    var self = this;

    var categorizedReports = _.groupBy(allReports, function(report) {
         return report.category;
    });

    var adjustments = categorizedReports['Adjustments'];
    if (adjustments && adjustments.length) {
        _.each(adjustments, function(adjustmentReport) {
            var adjustedReportId = adjustmentReport.adjustedReportId;

            if (adjustedReportId) {
                _.find(categorizedReports, function(reports, category) {
                    var matchedReportIndex = _.findIndex(reports, function(report) {
                        return report.reportId == adjustedReportId;
                    });
                    if (matchedReportIndex >= 0) {
                        reports.splice(matchedReportIndex, 0, adjustmentReport)
                    }
                });
            }
        });
    }
    self.reportsByCategory = [];

    _.each(order, function(category) {
        var reports = categorizedReports[category.category];
        if (reports && reports.length > 0) {
            var reportsOptions = _.extend({}, config, {rejectionReasonCategoryOptions:category.rejectionReasonCategoryOptions})
            self.reportsByCategory.push({
                title:category.category,
                description:ko.observable(category.description).extend({markdown:true}),

                model:new ReportsViewModel(reports, undefined, availableReports, reportOwner, reportsOptions)
            });
        }

    });

};

var GrantManagerReportsViewModel = function(config) {
    var self = this;
    var projectService = new ProjectService(config.project, config);
    self.plannedStartDate = ko.observable().extend({simpleDate: false});
    self.plannedEndDate = ko.observable().extend({simpleDate: false});

    self.anyReportData = ko.pureComputed(function() {
        var count = 0;
        if (config.project.status == 'Active') {
            _.each(config.project.reports, function (report){
                if (report.progress == 'finished' || report.progress == 'started') {
                    count += 1;
                }
            });
            return count <= 0;
        }
    });

    self.generateProjectReports = function () {
        $('#reportingTabDatesForm').validationEngine();
        var result = $('#reportingTabDatesForm').validationEngine('validate');
        if (result) {
            var jsData = {
                plannedStartDate: self.plannedStartDate(),
                plannedEndDate: self.plannedEndDate(),
            };
            projectService.saveProjectData(jsData);
        }
    }

    self.isMeriPlanApproved = ko.pureComputed(function() {
        if (!projectService.isApproved() && config.project.reports == '') {
            return true;
        } else {
            return false;
        }
    });
};



