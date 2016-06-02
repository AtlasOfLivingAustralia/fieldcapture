

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

var ReportViewModel = function(report) {
    $.extend(this, report);
    var self = this;

    self.description = report.description || report.name;
    self.fromDate = ko.observable(report.fromDate).extend({simpleDate:false});
    self.toDate =  ko.observable(report.toDate).extend({simpleDate:false});
    self.dueDate = ko.observable(report.dueDate).extend({simpleDate:false})
    self.editUrl = '';
    self.percentComplete = function() {
        if (report.count == 0) {
            return 0;
        }
        return report.finishedCount / report.count * 100;
    }();

    self.reason = ko.observable();

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
    self.editable = (report.bulkEditable || self.activities.length == 0 || self.activities.length == 1) && (report.publicationStatus != 'published' && report.publicationStatus != 'pendingApproval');

    self.title = 'Expand the activity list to complete the reports';
    if (self.editable) {
        self.title = 'Click to complete the report';
        self.editUrl = fcConfig.organisationReportUrl + '?reportId='+report.reportId;
    }

    self.isReportable = function() {
        return (report.toDate < new Date().toISOStringNoMillis());
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
        var json = JSON.stringify({reportId:report.reportId, reason:self.reason()});
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
    };
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

var ReportsViewModel = function(reports, projects, availableReports) {
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
        self.type = ko.observable();

        self.organisationId = ko.observable();

        self.fromDate = ko.observable().extend({simpleDate:false});
        self.toDate = ko.observable().extend({simpleDate:false});

        self.availableReports = availableReports;

        self.save = function() {
            var reportDetails = JSON.stringify(ko.mapping.toJS(this, {'ignore':['project', 'save', 'availableReports']}));

            var reportUrl = fcConfig.reportCreateUrl;
            $.ajax({method:'POST', url:reportUrl, data:reportDetails, success:function() {window.location.reload()}, contentType:'application/json'});
        };
    };
    self.newReport = new AdHocReportViewModel();

};

