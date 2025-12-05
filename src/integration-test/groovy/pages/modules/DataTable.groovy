package pages.modules

class DataTable extends geb.Module {

    static content = {
        table { $('table.data-table') }
        headers { table.$('thead th') }
        rows { table.$('tbody tr') }
        getCell { rowIndex, colIndex -> rows[rowIndex].$('td', colIndex) }

        searchField { $('.dataTables_filter input[type=search]') }
        nextButton { $('button.data-table-next') }
        previousButton { $('button.data-table-previous') }
        showingXtoYofZEntries(required:false) { $('div.dataTables_info') }

    }

    int totalCount()  {
        waitFor {
            showingXtoYofZEntries.displayed
        }
        String toParse = showingXtoYofZEntries.text()

        def matcher = (toParse =~ /of (\d+) entries/)
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1))
        } else {
            return 0
        }

    }

    void search(String term, int expectedResultCount) {
        searchField.value(term)
        waitFor {
            totalCount() == expectedResultCount
        }
    }
}
