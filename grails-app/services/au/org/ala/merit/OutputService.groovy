package au.org.ala.merit

class OutputService {

    def webService, grailsApplication

    private final String outputPath = grailsApplication.config.getProperty('ecodata.baseUrl')+'output/'

    def get(String id) {
        def record = webService.getJson(outputPath + id)
        record
    }

    def update(String id, Map body) {
        webService.doPost(outputPath + id, body)
    }

    def delete(String id) {
        webService.doDelete(outputPath + id)
    }

}
