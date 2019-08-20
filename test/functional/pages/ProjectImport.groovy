package pages

import geb.Page

class ProjectImport extends Page {

    static url = "admin/gmsProjectImport"

    static at = { title.startsWith("Import Projects") }

    static content = {
        fileInput { $('#fileUpload') }
        progressTable { $('table.table') }
        importButton { $('button[data-bind*=doImport')}
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
}
