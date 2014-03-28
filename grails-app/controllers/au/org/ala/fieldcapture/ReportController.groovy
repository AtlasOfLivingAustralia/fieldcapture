package au.org.ala.fieldcapture

class ReportController {

    static defaultAction = "dashboard"
    def webService, cacheService, searchService, metadataService

    def dashboard() {}

    def speciesReport() {
        response.setContentType('text/json')

        def cached = cacheService.get('speciesReport',{
            [result: webService.get('http://meri-test.ala.org.au/bdrs-core/meri/report/49/render.htm', false)]
        })
        render cached.result
    }

    def summaryReport() {
        response.setContentType('text/json')

        def cached = cacheService.get('summaryReport', {
            def originalParams = request.queryString
            [result: webService.get('http://meri-test.ala.org.au/bdrs-core/meri/report/48/render.htm?'+originalParams, false)]
        })
        render cached.result
    }

    def dashboardReport() {

        def categories = metadataService.getReportCategories()
        // The _ parameter is appended by jquery ajax calls and will stop the report contents from being cached.
        params.remove("_")
        def results = searchService.dashboardReport(params)
        def scores = results.outputData

        def groupedScores = scores.groupBy{
            (it.score.category?:'Not categorized')
        }

        def doubleGroupedScores = [:]
        groupedScores.each {key, value ->
            doubleGroupedScores.put(key, value.groupBy{it.score.outputName})
        }


        def model = [categories:categories, scores:doubleGroupedScores, metadata:results.metadata]

        render view:'_dashboard', model:model

    }

}
