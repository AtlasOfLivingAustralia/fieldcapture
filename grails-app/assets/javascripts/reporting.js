

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



    self.reason = ko.observable();
    self.category = ko.observable();

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

    self.changeReportStatus = function(url, action, blockingMessage, successMessage, doneCallback) {
        blockUIWithMessage(blockingMessage);
        var payload = {reportId:report.reportId, stage: report.name, category:self.category(), reason:self.reason(), activityIds:[report.activityId]}
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

    self.rejectReport = function() {
        var reasonModalSelector = config.reasonModalSelector || '#reason-modal';
        var $reasonModal = $(reasonModalSelector);
        var reasonViewModel = {
            reason: self.reason,
            rejectionCategories: ['Minor', 'Moderate', 'Major'],
            rejectionCategory: self.category,
            explanationText:'',
            title:'Return report',
            buttonText: 'Return',
            buttonTextNo: 'Cancel',
            submit:function() {
                self.changeReportStatus(config.rejectReportUrl, 'return', 'Returning report...', 'Report returned.');
            }
        };
        ko.applyBindings(reasonViewModel, $reasonModal[0]);
        $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
    };

    self.cancelReport = function() {
        var reasonModalSelector = config.reasonModalSelector || '#reason-modal';
        var $reasonModal = $(reasonModalSelector);
        var reasonViewModel = {
            reason: self.reason,
            rejectionCategories: ['Minor', 'Moderate', 'Major'],
            rejectionCategory: self.category,
            explanationText:'Do you wish to set this report as “not required”? Please enter the reason the report is not required.',
            title:'Report not required',
            buttonText: 'Yes (exempt by PPO)',
            buttonTextNo: 'No',
            submit:function() {
                self.changeReportStatus(config.cancelReportUrl, 'return', 'Not requiring report...', 'Report not required.');
            }
        };
        ko.applyBindings(reasonViewModel, $reasonModal[0]);
        $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
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

        var reasonModalSelector = config.reasonModalSelector || '#reason-modal';
        var $reasonModal = $(reasonModalSelector);
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
        var reasonViewModel = {
            reason: self.reason,
            title:'Adjust report',
            buttonText: 'Create adjustment',
            buttonTextNo: 'Cancel',
            explanationText: 'Please enter the reason the adjustment is required',
            submit:function() {
                self.changeReportStatus(
                    config.adjustReportUrl,
                    'return',
                    'Creating an adjustment for the report...',
                    'Created adjustment report.',
                    afterReportCreated);
            }
        };
        ko.applyBindings(reasonViewModel, $reasonModal[0]);
        $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
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
            self.reportsByCategory.push({
                title:category.category,
                description:ko.observable(category.description).extend({markdown:true}),
                model:new ReportsViewModel(reports, undefined, availableReports, reportOwner, config)
            });
        }

    });

};

var GrantManagerReportsViewModel = function(config) {
    var self = this;
    var projectService = new ProjectService(config.project, config);
    self.plannedStartDate = ko.observable(config.reportOwner.startDate).extend({simpleDate: false});

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
        var jsData = {
            plannedStartDate: self.plannedStartDate(),
        };

        var startDateSelector = "#generate-report input[data-bind*=plannedStartDate]";

        var message;
        if (!self.plannedStartDate()) {
            message =  "The planned start date is a required field";
        }
        if (self.plannedStartDate() >= config.project.plannedEndDate) {
            message =  "The project start date must be before the end date";
        }

        if (message) {
            setTimeout(function() {
                $(startDateSelector).validationEngine("showPrompt", message, "topRight", true);
            }, 100);

        } else {
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



