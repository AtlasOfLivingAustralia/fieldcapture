package au.org.ala.fieldcapture

class ReportController {

    static defaultAction = "dashboard"
    def webService, cacheService

    def dashboard() {}

    def speciesReport() {
        response.setContentType('text/json')

        render cacheService.get('speciesReport',{
            webService.get('http://meri-test.ala.org.au/bdrs-core/meri/report/49/render.htm')
        })
    }

    def summaryReport() {
        response.setContentType('text/json')

        render cacheService.get('summaryReport', {
            def originalParams = request.queryString
            webService.get('http://meri-test.ala.org.au/bdrs-core/meri/report/48/render.htm?'+originalParams)
        })
    }

}
