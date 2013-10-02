package au.org.ala.fieldcapture

class ReportController {

    static defaultAction = "dashboard"
    def webService, cacheService

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

}
