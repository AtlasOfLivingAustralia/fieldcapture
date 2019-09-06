package pages

import geb.Page

class ProjectImport extends Page {

    static url = "admin/gmsProjectImport"

    static at = { title.startsWith("Import Projects") }

    static content = {
        fileInput { $('#fileUpload') }
        progressTable { $('table.table') }
        importButton { $('button[data-bind*=doImport')}
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
        println(progressSummary.text())
        // The page will update to say "All x projects processed." or "Import complete" when the load has finished
        progressSummary.text().startsWith("All") || progressSummary.text().startsWith("Import complete")
    }
}
