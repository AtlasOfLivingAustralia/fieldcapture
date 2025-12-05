package pages

import pages.modules.DataTable

class InvestmentPriorityRow extends geb.Module {
    static content = {
        type { $('td.type').text() }
        name { $('td.name').text() }
        categories { $('td.categories').text() }
        managementUnits{ $('td.management-units textarea').value() }
        editButton { $('button.edit-investment-priority') }

    }


    def edit() {
        editButton.click()
        waitFor {
            ManageInvestmentPriorities.addOrEditCategory.displayed
        }
    }
}

class AddOrEditInvestmentPriorityModule extends geb.Module {
    static content = {
        type { $('#type') }
        name { $('#name') }
        categories { $('#categories') }
        managementUnits { $('#management-unit') }
        saveButton { $('button[data-bind*=addInvestmentPriority]') }
        cancelButton { $('button[data-bs-dismiss=modal]') }
    }



    def save() {
        saveButton.click()
    }

    def cancel() {
        cancelButton.click()
    }
}

class AddOrEditCategoryModule extends geb.Module {
    static content = {
        categoryNameField { $('#category') }
        attachSpreadsheetButton { $('#investmentPriorities') }
        uploadButton { $('#upload') }
        cancelButton { $('button.btn-secondary') }
    }


    def saveCategory() {
        uploadButton.click()
        waitFor {
            hasBeenReloaded()
        }
    }
}

class ManageInvestmentPriorities extends ReloadablePage {

    static url = 'admin/investmentPriorities'

    static at = { title.startsWith("Manage Investment Priorities | MERIT") }

    static content = {
        investmentPrioritiesTable { $('.dataTables_wrapper').module(DataTable) }
        addInvestmentPriorityButton(required:false) { $("[data-bind*=newInvestmentPriority]") }
        addOrEditCategoryButton { $("[data-bind*=showUpdateCategory]") }
        addOrEditInvestmentPriority { $('#editInvestmentPriority').module AddOrEditInvestmentPriorityModule }
        addOrEditCategory() { $('#editCategory').module AddOrEditCategoryModule }
        investmentPriorityRows { investmentPrioritiesTable.$('tbody tr').moduleList{InvestmentPriorityRow} }
    }

    int getInvestmentPrioritiesCount() {
        investmentPrioritiesTable.totalCount()
    }

    void search(String term, int expectedResultCount) {
        investmentPrioritiesTable.search(term, expectedResultCount)
    }

    void addNewInvestmentPriority() {
        addInvestmentPriorityButton.click()
        waitFor {
            addOrEditInvestmentPriority.displayed
        }
    }

}
