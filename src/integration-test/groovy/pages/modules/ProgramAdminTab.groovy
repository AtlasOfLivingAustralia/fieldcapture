package pages.modules

import geb.Module

class ProgramOutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-description textarea') }
        type { $('.outcome-type select') }

        shortDescription { $('.outcome-short-description input') }
        category { $('.outcome-category input') }
        priorityCategories { $('.outcome-priorities select') }
        deleteButton { $('a.deleteProgramOutcomeButton') }
    }
}

class ProgramOutcomes extends Module {
    static content = {
        addOutcomeButton { $('button[click*=addNewOutcome]') }
        outcomeRows { $('table.outcomes-table tbody tr').moduleList(ProgramOutcomeRow) }
    }
}

class ProgramAdminTab extends Module {

    static content = {
        editTab {$('#edit-program-details-tab')}
        editButton(required:false) {$('a.editBtnAction')}
        addSubProgramButton(required: false) {$('a.addSubProgramButton')}

        programOutcomes(required: false) {$('#outcomes').module ProgramOutcomes}
    }

    def openProgramOutcomes() {
        $('.nav-link[href*=outcomes]').click()
        waitFor { programOutcomes.displayed }
    }



}
