package au.org.ala.merit

import java.text.DecimalFormat
import java.text.NumberFormat

abstract class Statistic {
    ReportService reportService
    String searchTerm

    String numberFormatPattern
    String defaultPattern = "###,###,###,###,###,##0"

    List<String> projectFilter

    abstract Number getValue()

    String getStatistic() {
        format(getValue())
    }

    String format(Number value) {
        if (!numberFormatPattern) {
            numberFormatPattern = defaultPattern
        }
        NumberFormat formatter = new DecimalFormat(numberFormatPattern)
        return formatter.format(value)
    }
}


class FilteredScore extends Statistic {

    String scoreLabel
    String resultFilter

    Number getValue() {
        Number result
        if (resultFilter) {
            result = reportService.filterGroupedScore(scoreLabel, resultFilter, projectFilter)
        }
        else {
            result = reportService.getNumericScore(scoreLabel, projectFilter)
        }
        result
    }
}

class FilteredProjectCount extends Statistic {
    Number getValue() {
        reportService.filteredProjectCount(projectFilter, searchTerm)
    }
}

class InvestmentDollars extends Statistic {

    String investmentTypeFilter

    Number getValue() {
        reportService.filteredInvestment(projectFilter, searchTerm, investmentTypeFilter).investment
    }
    String format(Number value) {
        return '$'+super.format(value)
    }
}

class InvestmentProjectCount extends Statistic {

    String investmentTypeFilter
    String searchTerm

    Number getValue() {
        reportService.filteredInvestment(projectFilter, searchTerm, investmentTypeFilter).count
    }
}

class OutputTarget extends Statistic {
    String scoreLabel

    Number getValue() {
        reportService.outputTarget(scoreLabel, projectFilter)
    }
}
