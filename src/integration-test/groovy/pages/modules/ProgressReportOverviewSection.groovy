package pages.modules

import geb.Module

class PreviouslyReportedOutcomes extends Module {

    static content = {
        reportName { $('td', 0) }
        projectOutcomes { $('td', 1) }
    }
}

class ProjectOutcomeTargetRow extends Module {

    static content = {
        targetMeasure { $('td', 0) }
        target { $('td', 1).find('input') }
        deliveredApproved { $('td', 2).find('input') }
        targetThisReport { $('td', 3).find('input') }
        deliveredThisReport { $('td', 4).find('input') }
        explanation { $('td', 5).find('textarea') }

    }}

class ProjectOutcomes extends Module {
    static content = {
        outcomeCode { $('td', 0) }
        outcomeDescription { $('td', 1).find('textarea') }
        achievement { $('td', 2).find('textarea') }
    }
}

class ProgressReportOverviewSection extends Module {

    static content = {
        previousReports(required:false) {$('#previouslyReportedProjectOutcomes-content-0  tbody tr').moduleList(PreviousReportRow) }
        projectOutcomes(required:false) {$('#projectOutcomes-content-0 table').first().moduleList(ProjectOutcomes) }
        projectOutcomeTargets(required:false) { $('#projectOutcomes-content-0 .deliveredAgainstOutcomes tbody tr').moduleList(ProjectOutcomeTargetRow) }
    }
}
