//= require reportService.js

var ProjectReportsViewModel = function (project) {

    var self = this;
    var reportService = new ReportService({});

    self.projectId = project.projectId;
    self.organisationId = project.orgIdSvcProvider || project.organisationId;
    self.organisationName = project.serviceProviderName || project.organisationName;
    self.name = project.name;
    self.grantId = project.grantId || '';
    self.associatedProgram = project.associatedProgram;
    self.associatedSubProgram = project.associatedSubProgram;
    self.submittedReportCount = 0;
    self.recommendAsCaseStudy = ko.observable(project.promoteOnHomepage);
    self.activityCount = project.activityCount || 0;

    self.reports = [];
    self.extendedStatus = [];
    var reportingTimeSum = 0;

    var currentReport = null;

    if (project.reports) {
        for (var i = 0; i < project.reports.length; i++) {

            var report = new Report(project.reports[i]);
            self.reports.push(report);
            if (!currentReport) {
                currentReport = report;
            }

            // Rule for "current" report is:
            // 1) Any report awaiting action. (Overdue > Submitted).
            // 2) Current stage.

            if (report.isOverdue()) {
                currentReport = report;
            } else if (report.isSubmitted() && !currentReport.isOverdue()) {
                currentReport = report;
            } else if (report.isDue() && !currentReport.isOverdue() && !currentReport.isSubmitted()) {
                currentReport = report;
            } else if (report.isCurrent() && !currentReport.isDue() && !currentReport.isOverdue() && !currentReport.isSubmitted()) {
                currentReport = report;
            }

            if (report.isSubmitted() || report.isApproved()) {
                self.submittedReportCount++;
                reportingTimeSum += report.submissionDelta();
            }


        }

        for (var i = 0; i < self.reports.length; i++) {
            var report = self.reports[i];
            if (report.isOverdue() || report.isSubmitted() || report.isDue()) {
                if (report !== currentReport) {
                    self.extendedStatus.push(report.status());
                }
            }
        }
    }


    if (self.submittedReportCount > 0) {
        self.averageReportingTime = reportingTimeSum / self.submittedReportCount;
    } else {
        self.averageReportingTime = '';
    }

    self.averageReportingTimeText = function () {
        if (self.submittedReportCount > 0) {
            var deltaDays = Math.round(self.averageReportingTime);
            if (deltaDays < 0) {
                return '<span class="early">' + Math.abs(deltaDays) + ' day(s) early</span>';
            } else if (deltaDays == 0) {
                return 'on time';
            } else {
                return '<span class="late">' + Math.abs(deltaDays) + ' day(s) late</span>';
            }
        } else {
            return '';
        }
    };

    self.isOverdue = currentReport ? currentReport.isOverdue() : false;

    self.historyVisible = ko.observable(false);

    self.currentStatus = function () {
        if (currentReport) {
            return currentReport.status();
        }

        return 'No current report';
    }();

    self.meriPlanStatus = function () {
        if (project.status == 'Completed') {
            return 'Complete';
        }
        if (project.planStatus === 'approved') {
            return 'Reporting phase';
        }
        if (project.planStatus === 'submitted') {
            return 'MERI plan submitted for approval';
        }
        return 'Planning phase';
    };

    self.currentReport = currentReport;

    self.extendedStatusVisible = ko.observable(false);

    self.toggleExtendedStatus = function () {
        self.extendedStatusVisible(!self.extendedStatusVisible());
    };

    var toggling = false;
    self.toggleHistory = function (data, e) {

        if (toggling) {
            return;
        }
        toggling = true;

        var tr = $(e.currentTarget).closest('tr');
        var row = tr.closest('table').DataTable().row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            self.historyVisible(false);
        } else {
            // Open this row
            var obj = {objId:project.projectId,objUrl:fcConfig.projectReportsUrl,myProjects:true};
            var data = reportService.getHistory(obj) || '';
            self.historyVisible(data);

            row.child(data).show();
            tr.addClass('shown');
        }
        toggling = false;
    };

    self.savingCaseStudy = ko.observable(false);
    self.recommendAsCaseStudy.subscribe(function () {
        var url = fcConfig.projectUpdateUrl + '/' + project.projectId;
        var payload = {promoteOnHomepage: self.recommendAsCaseStudy()};

        self.savingCaseStudy(true);

        // save new status
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',

            error: function (data) {
                bootbox.alert('The change was not saved due to a server error or timeout.  Please try again later.', function () {
                    location.reload();
                });
            },
            complete: function () {
                self.savingCaseStudy(false);
            }
        });
    });

};

var ProjectReportingViewModel = function (projects, options) {
    var self = this;
    self.projects = ko.observableArray([]);


    function mapProjectsAndAttachDataTables(projectsToMap) {
        var mappedProjects = _.map(projectsToMap, function(prj) {
            return new ProjectReportsViewModel(prj.project);
        });
        self.projects(mappedProjects);
        $(options.tableSelector).DataTable({displayLength:50, order:[[6,'desc']]});
    }
    if (projects.length == 0) {
        $.get(options.userProjectsUrl).done(function (projects) {
            mapProjectsAndAttachDataTables(projects);
        }).fail(function () {
            bootbox.alert("There was an error retrieving your projects.  Please try again later.");
        });
    }
    else {
        mapProjectsAndAttachDataTables(projects);
    }


};
