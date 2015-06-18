

var ActivityViewModel = function(activity) {
    var self = this;
    $.extend(self, activity);

    self.publicationStatus = activity.publicationStatus ? activity.publicationStatus : 'unpublished';
    self.editable = (self.publicationStatus == 'unpublished');
    self.activityDetailsUrl = self.editable ? fcConfig.activityEditUrl+'/'+activity.activityId+'?returnTo='+fcConfig.organisationViewUrl :
    fcConfig.activityViewUrl+'/'+activity.activityId+'?returnTo='+fcConfig.organisationViewUrl;

    self.activityUrlTitle = self.editable ? 'Enter data for this report' : 'View this report';
};

var ReportViewModel = function(report) {
    $.extend(this, report);
    var self = this;

    self.dueDate = ko.observable(report.dueDate).extend({simpleDate:false})
    self.editUrl = '';
    self.percentComplete = function() {
        if (report.count == 0) {
            return 0;
        }
        return report.finishedCount / report.count * 100;
    }();

    self.toggleActivities = function() {
        self.activitiesVisible(!self.activitiesVisible());
    };
    self.activitiesVisible = ko.observable(false);
    self.activities = [];
    $.each(report.activities, function(i, activity) {
        self.activities.push(new ActivityViewModel(activity));
    });
    self.editable = (report.bulkEditable || self.activities.length == 1) && (report.publicationStatus != 'published' && report.publicationStatus != 'pendingApproval');

    self.title = 'Expand the activity list to complete the reports';
    if (report.bulkEditable) {
        self.title = 'Click to complete the reports in a spreadsheet format';
        self.editUrl = fcConfig.organisationReportUrl + '?type='+report.type+'&plannedStartDate='+report.plannedStartDate+'&plannedEndDate='+report.plannedEndDate+'&returnTo='+fcConfig.returnTo;
    }
    else if (self.editable) {
        self.title = 'Click to complete the report';
        self.editUrl = fcConfig.activityEditUrl + '/' + self.activities[0].activityId + '?returnTo='+fcConfig.organisationViewUrl;
    }
    self.isReportable = function() {
        return (report.plannedEndDate < new Date().toISOStringNoMillis());
    };
    self.complete = (report.finishedCount == report.count);
    self.approvalTemplate = function() {
        if (!self.isReportable()) {
            return 'notReportable';
        }
        switch (report.publicationStatus) {
            case 'unpublished':
                return 'notApproved';
            case 'pendingApproval':
                return 'submitted';
            case 'published':
                return 'approved';
            default:
                return 'notApproved';
        }
    };

    self.changeReportStatus = function(url, action, blockingMessage, successMessage) {
        blockUIWithMessage(blockingMessage);
        var activityIds = $.map(self.activities, function(activity) {return activity.activityId;});
        var json = JSON.stringify({activityIds:activityIds});
        $.ajax({
            url: url,
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success:function() {
                blockUIWithMessage(successMessage);
                window.location.reload();
            },
            error:function(data) {
                $.unblockUI();

                if (data.status == 401) {
                    bootbox.alert("You do not have permission to "+action+" this report.");
                }
                else {
                    bootbox.alert('An unhandled error occurred: ' + data.status);
                }
            }
        });
    }
    self.approveReport = function() {
        self.changeReportStatus(fcConfig.approveReportUrl, 'approve', 'Approving report...', 'Report approved.');
    };
    self.submitReport = function() {
        var declaration = $('#declaration')[0];
        var declarationViewModel = {
            termsAccepted : ko.observable(false),
            submitReport : function() {

                self.changeReportStatus(fcConfig.submitReportUrl, 'submit', 'Submitting report...', 'Report submitted.');
            }
        };
        ko.applyBindings(declarationViewModel, declaration);
        $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', function() {ko.cleanNode(declaration);});

    };
    self.rejectReport = function() {
        self.changeReportStatus(fcConfig.rejectReportUrl, 'reject', 'Rejecting report...', 'Report rejected.');
    };
};

var ReportsViewModel = function(reports, projects) {
    var self = this;
    self.projects = projects;
    self.allReports = ko.observableArray(reports);
    self.hideApprovedReports = ko.observable(true);
    self.hideFutureReports = ko.observable(true);

    self.filteredReports = ko.computed(function() {
        if (!self.hideApprovedReports() && !self.hideFutureReports()) {
            return self.allReports();
        }
        var filteredReports = [];
        var nextMonth = moment().add(1, 'months').format();

        $.each(self.allReports(), function(i, report) {
            if (self.hideApprovedReports() && report.publicationStatus === 'published') {
                return;
            }

            if (self.hideFutureReports() && report.dueDate > nextMonth) {
                return;
            }
            filteredReports.push(new ReportViewModel(report));
        });
        filteredReports.sort(function(r1, r2) {

            var result = ( ( r1.dueDate() == r2.dueDate() ) ? 0 : ( ( r1.dueDate() > r2.dueDate() ) ? 1 : -1 ) );
            if (result === 0) {
                result = ( ( r1.type == r2.type ) ? 0 : ( ( r1.type > r2.type ) ? 1 : -1 ) );
            }
            return result;
        });
        return filteredReports;
    });

    self.editReport = function(report) {
        window.location = report.editUrl;
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

        var self = this;
        self.project =ko.observable();
        self.type = ko.observable();

        self.projectId = ko.computed(function() {
            if (self.project()) {
                return self.project().projectId;
            }
        });
        self.plannedStartDate = ko.computed(function() {
            if (self.project()) {
                return self.project().plannedStartDate;
            }
        });
        self.plannedEndDate = ko.computed(function() {
            if (self.project()) {
                return self.project().plannedEndDate;
            }
        });
        self.availableReports = ko.observableArray([]);

        self.project.subscribe(function(project) {
            $.get(fcConfig.adHocReportsUrl+'/'+project.projectId).done(function(data) {
                self.availableReports(data);
            })

        });

        self.save = function() {
            var reportDetails = ko.mapping.toJS(this, {'ignore':['project', 'save']});

            var reportUrl = fcConfig.reportCreateUrl + '?' + $.param(reportDetails) + '&returnTo='+fcConfig.organisationViewUrl;

            window.location.href = reportUrl;
        };
    };
    self.newReport = new AdHocReportViewModel();

};

