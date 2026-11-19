package pages.modules

class DataTable extends geb.Module {

    static content = {
        table { $('table') }
        headers { table.$('thead th') }
        rows { table.$('tbody tr') }
        getCell { rowIndex, colIndex -> rows[rowIndex].$('td', colIndex) }

        searchField { $('.dt-search input[type=search]') }
        nextButton { $('button.next') }
        previousButton { $('button.previous') }
        showingXtoYofZEntries(required:false) { $('div.dt-info') }

    }

    int totalCount()  {
        waitFor {
            showingXtoYofZEntries.displayed
        }
        String toParse = showingXtoYofZEntries.text()

        def matcher = (toParse =~ /of (\d+) entr/) // Can be "entries" or "entry" depending on the number of results
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
