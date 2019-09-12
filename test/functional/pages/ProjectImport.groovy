package pages

import geb.Page

class ProjectImport extends Page {

    static url = "admin/gmsProjectImport"

    static at = { title.startsWith("Import Projects") }

    static content = {
        fileInput { $('#fileUpload') }
        importButton { $('button[data-bind*=doImport]')}
        progressSummary { $('span[data-bind*=progressSummary]') }
    }

    def attachFile(File file) {
        fileInput = file.absolutePath
    }

    def importProjects() {
        importButton.click()
    }

    List<List> projectResults() {
        List rows = []
        def progressTable = $('table.table')
        progressTable.find("tbody tr").each {
            List cols = []
            it.find("td").each { col ->
                cols << col.text()
            }
            rows << cols
        }

        rows
    }

    boolean loadComplete() {
        // The page will update to say "All x projects processed." or "Import complete" when the load has finished
        progressSummary.text().startsWith("All") || progressSummary.text().startsWith("Import complete")
    }
}
