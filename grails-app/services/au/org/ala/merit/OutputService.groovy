package au.org.ala.merit

class OutputService {

    def webService, grailsApplication

    def list() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'output/')
        resp.list
    }

    def get(id) {
        def record = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'output/' + id)
        record
    }

    def update(id, body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'output/' + id, body)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'output/' + id)
    }

}
