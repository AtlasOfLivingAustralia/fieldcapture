package pages

import geb.Page
import geb.module.Checkbox

class ProjectImport extends Page {

    static url = "admin/importMeritProjects"

    static at = { title.startsWith("Import Projects") }

    static content = {
        fileInput { $('#fileUpload') }
        importButton { $('button[data-bind*=doImport]')}
        progressSummary { $('span[data-bind*=progressSummary]') }
        updateCheckbox { $('#update').module(Checkbox) }
    }

    def attachFile(File file) {
        fileInput = file.absolutePath
    }

    def importProjects() {
        importButton.click()
    }

    def checkUpdateCheckbox() {
        updateCheckbox.check()
    }

    List<List> projectResults() {

        List columns = ["grantId", "externalId", "success", "errors", "messages"]
        List rows = []
        def progressTable = $('table.table')
        progressTable.find("tbody tr").each {
            List cols = []
            it.find("td").each { col ->
                cols << col.text()
            }
            Map row = [:]
            columns.eachWithIndex{ col, index ->
                row[col] = cols[index]
            }
            rows << row
        }

        rows
    }

    boolean validateComplete() {
        progressSummary.text().startsWith('Processed ')
    }
    boolean loadComplete() {
        // The page will update to say "All x projects processed." or "Import complete" when the load has finished
        progressSummary.text().startsWith("All") || progressSummary.text().startsWith("Import complete")

    }
}
