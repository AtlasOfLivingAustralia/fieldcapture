

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
    self.dueDate = ko.observable(report.dueDate).extend({simpleDate:false});
    self.progress = ko.observable(report.progress || 'planned');
    self.editUrl = '';
    self.viewUrl = config.viewReportUrl + '?&reportId='+report.reportId;
    self.downloadUrl = config.reportPDFUrl ? config.reportPDFUrl +'/'+report.reportId : null;
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
    self.editable = (report.bulkEditable || self.activities.length == 0 || self.activities.length == 1) && (report.publicationStatus != 'published' && report.publicationStatus != 'pendingApproval');

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
    self.complete = ko.computed(function() {
        return self.isReportable() && self.progress() == 'finished' && self.editable;
    });
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
        var payload = {reportId:report.reportId, stage: report.name, category:self.category(), reason:self.reason(), activityIds:[report.activityId]}
        var json = JSON.stringify(payload);
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
        $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', function() {ko.cleanNode(declaration);});

    };

    this.rejectReport = function() {
        var reasonModalSelector = config.reasonModalSelector || '#reason-modal';
        var $reasonModal = $(reasonModalSelector);
        var reasonViewModel = {
            reason: self.reason,
            rejectionCategories: ['Minor', 'Moderate', 'Major'],
            rejectionCategory: self.category,
            title:'Return report',
            buttonText: 'Return',
            submit:function() {
                self.changeReportStatus(config.rejectReportUrl, 'return', 'Returning report...', 'Report returned.');
            }
        };
        ko.applyBindings(reasonViewModel, $reasonModal[0]);
        $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
    };
};

var ReportsViewModel = function(reports, projects, availableReports, reportOwner, config) {
    var self = this;
    self.projects = projects;
    self.allReports = ko.observableArray(reports);
    self.hideApprovedReports = ko.observable(true);
    self.hideFutureReports = ko.observable(true);

    self.filteredReports = ko.computed(function() {

        var filteredReports = [];
        var now = moment().toDate().toISOStringNoMillis();

        $.each(self.allReports(), function(i, report) {
            if (self.hideApprovedReports() && report.publicationStatus === 'published') {
                return;
            }

            if (self.hideFutureReports() && report.fromDate > now) {
                return;
            }
            filteredReports.push(new ReportViewModel(report, config));
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
            $.ajax({method:'POST', url:reportUrl, data:reportDetails, success:function() {window.location.reload()}, contentType:'application/json'});
        };
    };
    self.newReport = new AdHocReportViewModel();

};

